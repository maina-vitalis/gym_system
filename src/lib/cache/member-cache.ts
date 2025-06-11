// ============================================================================
// PROFESSIONAL MEMBER CACHE SYSTEM
// ============================================================================

interface CachedMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  membershipStatus: string;
  phoneNumber?: string;
  hasActiveVisit?: boolean;
  // Add search-optimized fields
  searchText: string; // Combined searchable text
  fullName: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface SearchCacheEntry {
  query: string;
  results: CachedMember[];
  timestamp: number;
  ttl: number;
}

class MemberCacheManager {
  private memberCache = new Map<string, CacheEntry<CachedMember>>();
  private searchCache = new Map<string, SearchCacheEntry>();
  private allMembersCache: CacheEntry<CachedMember[]> | null = null;

  // Cache configuration
  private readonly MEMBER_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly SEARCH_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly ALL_MEMBERS_TTL = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_SEARCH_CACHE_SIZE = 100;
  private readonly MAX_MEMBER_CACHE_SIZE = 1000;

  // Cleanup intervals
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
    // Only auto-warm on client side, and with a delay to avoid blocking
    if (typeof window !== "undefined") {
      setTimeout(() => this.warmCache(), 1000); // Delay 1 second
    }
  }

  // ============================================================================
  // CORE CACHE OPERATIONS
  // ============================================================================

  /**
   * Get member by ID from cache
   */
  getMember(id: string): CachedMember | null {
    const entry = this.memberCache.get(id);
    if (!entry || this.isExpired(entry)) {
      this.memberCache.delete(id);
      return null;
    }
    return entry.data;
  }

  /**
   * Store member in cache
   */
  setMember(member: CachedMember): void {
    // Ensure we have search-optimized fields
    const optimizedMember = this.optimizeMemberForSearch(member);

    this.memberCache.set(member.id, {
      data: optimizedMember,
      timestamp: Date.now(),
      ttl: this.MEMBER_TTL,
    });

    // Cleanup if cache is too large
    if (this.memberCache.size > this.MAX_MEMBER_CACHE_SIZE) {
      this.cleanupMemberCache();
    }
  }

  /**
   * Get all members from cache
   */
  getAllMembers(): CachedMember[] | null {
    if (!this.allMembersCache || this.isExpired(this.allMembersCache)) {
      this.allMembersCache = null;
      return null;
    }
    return this.allMembersCache.data;
  }

  /**
   * Store all members in cache
   */
  setAllMembers(members: CachedMember[]): void {
    const optimizedMembers = members.map((m) =>
      this.optimizeMemberForSearch(m)
    );

    this.allMembersCache = {
      data: optimizedMembers,
      timestamp: Date.now(),
      ttl: this.ALL_MEMBERS_TTL,
    };

    // Also cache individual members
    optimizedMembers.forEach((member) => {
      this.memberCache.set(member.id, {
        data: member,
        timestamp: Date.now(),
        ttl: this.MEMBER_TTL,
      });
    });
  }

  /**
   * Manually warm the cache (public method)
   */
  async warmCacheManually(): Promise<void> {
    return this.warmCache();
  }

  // ============================================================================
  // SEARCH OPERATIONS
  // ============================================================================

  /**
   * Search members in cache with fuzzy matching
   */
  searchMembers(query: string, limit: number = 10): CachedMember[] | null {
    const normalizedQuery = this.normalizeQuery(query);

    // Check search cache first
    const cachedSearch = this.searchCache.get(normalizedQuery);
    if (cachedSearch && !this.isSearchExpired(cachedSearch)) {
      return cachedSearch.results.slice(0, limit);
    }

    // Search in all members cache
    const allMembers = this.getAllMembers();
    if (!allMembers) {
      return null; // Cache miss - need to fetch from API
    }

    // Perform fuzzy search
    const results = this.performFuzzySearch(allMembers, normalizedQuery, limit);

    // Cache the search results
    this.setSearchResults(normalizedQuery, results);

    return results;
  }

  /**
   * Cache search results
   */
  private setSearchResults(query: string, results: CachedMember[]): void {
    this.searchCache.set(query, {
      query,
      results,
      timestamp: Date.now(),
      ttl: this.SEARCH_TTL,
    });

    // Cleanup if search cache is too large
    if (this.searchCache.size > this.MAX_SEARCH_CACHE_SIZE) {
      this.cleanupSearchCache();
    }
  }

  // ============================================================================
  // SEARCH ALGORITHMS
  // ============================================================================

  /**
   * Perform fuzzy search with scoring
   */
  private performFuzzySearch(
    members: CachedMember[],
    query: string,
    limit: number
  ): CachedMember[] {
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const scoredResults = members
      .map((member) => ({
        member,
        score: this.calculateSearchScore(member, queryWords),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => {
        // Sort by score (descending), then by membership status (ACTIVE first)
        if (b.score !== a.score) return b.score - a.score;
        if (
          a.member.membershipStatus === "ACTIVE" &&
          b.member.membershipStatus !== "ACTIVE"
        )
          return -1;
        if (
          b.member.membershipStatus === "ACTIVE" &&
          a.member.membershipStatus !== "ACTIVE"
        )
          return 1;
        return a.member.fullName.localeCompare(b.member.fullName);
      })
      .slice(0, limit)
      .map((result) => result.member);

    return scoredResults;
  }

  /**
   * Calculate search score for a member
   */
  private calculateSearchScore(
    member: CachedMember,
    queryWords: string[]
  ): number {
    let score = 0;
    const searchText = member.searchText.toLowerCase();

    for (const word of queryWords) {
      // Exact matches get highest score
      if (member.membershipNumber.toLowerCase().includes(word)) {
        score += 100; // Membership number exact match
      } else if (member.email.toLowerCase().includes(word)) {
        score += 90; // Email match
      } else if (member.firstName.toLowerCase().startsWith(word)) {
        score += 80; // First name starts with
      } else if (member.lastName.toLowerCase().startsWith(word)) {
        score += 80; // Last name starts with
      } else if (member.firstName.toLowerCase().includes(word)) {
        score += 60; // First name contains
      } else if (member.lastName.toLowerCase().includes(word)) {
        score += 60; // Last name contains
      } else if (searchText.includes(word)) {
        score += 40; // General text match
      } else if (this.fuzzyMatch(word, searchText)) {
        score += 20; // Fuzzy match
      }
    }

    // Boost active members
    if (member.membershipStatus === "ACTIVE") {
      score += 10;
    }

    return score;
  }

  /**
   * Simple fuzzy matching for typos
   */
  private fuzzyMatch(word: string, text: string): boolean {
    if (word.length < 3) return false;

    // Check for common typos (1 character difference)
    for (let i = 0; i < text.length - word.length + 1; i++) {
      const substring = text.substring(i, i + word.length);
      let differences = 0;

      for (let j = 0; j < word.length; j++) {
        if (word[j] !== substring[j]) {
          differences++;
          if (differences > 1) break;
        }
      }

      if (differences <= 1) return true;
    }

    return false;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Optimize member data for search
   */
  private optimizeMemberForSearch(member: CachedMember): CachedMember {
    const fullName = `${member.firstName} ${member.lastName}`;
    const searchText = [
      member.firstName,
      member.lastName,
      member.email,
      member.membershipNumber,
      member.phoneNumber || "",
      fullName,
    ]
      .join(" ")
      .toLowerCase();

    return {
      ...member,
      fullName,
      searchText,
    };
  }

  /**
   * Normalize search query
   */
  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase().replace(/\s+/g, " ");
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Check if search cache entry is expired
   */
  private isSearchExpired(entry: SearchCacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Warm the cache by fetching all members
   */
  private async warmCache(): Promise<void> {
    try {
      // Only warm cache on client side to avoid SSR issues
      if (typeof window === "undefined") {
        console.log("⏭️ Skipping cache warming on server side");
        return;
      }

      console.log("🔥 Warming member cache...");
      const response = await fetch("/api/members/lookup?warm=true");
      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          this.setAllMembers(data.data);
          console.log(`✅ Cache warmed with ${data.data.length} members`);
        }
      } else {
        console.warn(`⚠️ Cache warming failed with status: ${response.status}`);
      }
    } catch (error) {
      console.warn("⚠️ Failed to warm cache:", error);
    }
  }

  /**
   * Invalidate specific member
   */
  invalidateMember(id: string): void {
    this.memberCache.delete(id);
    this.clearSearchCache(); // Clear search cache as results may have changed
  }

  /**
   * Invalidate all members cache
   */
  invalidateAllMembers(): void {
    this.allMembersCache = null;
    this.memberCache.clear();
    this.clearSearchCache();
  }

  /**
   * Clear search cache
   */
  clearSearchCache(): void {
    this.searchCache.clear();
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    this.cleanupMemberCache();
    this.cleanupSearchCache();

    // Cleanup all members cache
    if (this.allMembersCache && this.isExpired(this.allMembersCache)) {
      this.allMembersCache = null;
    }
  }

  /**
   * Cleanup expired member cache entries
   */
  private cleanupMemberCache(): void {
    const now = Date.now();
    for (const [id, entry] of this.memberCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.memberCache.delete(id);
      }
    }
  }

  /**
   * Cleanup expired search cache entries
   */
  private cleanupSearchCache(): void {
    const now = Date.now();
    for (const [query, entry] of this.searchCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.searchCache.delete(query);
      }
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    // Only start cleanup on client side
    if (typeof window === "undefined") {
      return;
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 2 * 60 * 1000); // Cleanup every 2 minutes
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // ============================================================================
  // CACHE STATISTICS
  // ============================================================================

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memberCacheSize: this.memberCache.size,
      searchCacheSize: this.searchCache.size,
      allMembersCached: !!this.allMembersCache,
      allMembersCount: this.allMembersCache?.data.length || 0,
    };
  }
}

// Export singleton instance
export const memberCache = new MemberCacheManager();

// Export types
export type { CachedMember };
