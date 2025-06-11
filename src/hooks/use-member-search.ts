import { memberCache, type CachedMember } from "@/lib/cache/member-cache";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

// ============================================================================
// ENHANCED MEMBER SEARCH HOOK WITH PROFESSIONAL CACHING
// ============================================================================

interface UseEnhancedMemberSearchOptions {
  enabled?: boolean;
  limit?: number;
  minQueryLength?: number;
  debounceMs?: number;
}

interface SearchResult {
  data: CachedMember[];
  isLoading: boolean;
  isCacheHit: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Enhanced member search hook with professional caching
 * Provides instant responses from cache with fallback to API
 */
export function useEnhancedMemberSearch(
  query: string,
  options: UseEnhancedMemberSearchOptions = {}
): SearchResult {
  const { enabled = true, limit = 10, minQueryLength = 2 } = options;

  const [isCacheHit, setIsCacheHit] = useState(false);

  // Memoize and normalize the query
  const normalizedQuery = useMemo(() => {
    return query.trim().toLowerCase();
  }, [query]);

  // Check if we should search
  const shouldSearch = enabled && normalizedQuery.length >= minQueryLength;

  // Try cache first - this is instant
  const cachedResults = useMemo(() => {
    if (!shouldSearch) return [];

    const results = memberCache.searchMembers(normalizedQuery, limit);
    if (results) {
      setIsCacheHit(true);
      return results;
    }

    setIsCacheHit(false);
    return null;
  }, [normalizedQuery, shouldSearch, limit]);

  // Fallback to API if cache miss
  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["memberSearch", normalizedQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("query", normalizedQuery);
      params.append("limit", limit.toString());

      const response = await fetch(`/api/members/lookup?${params}`);
      if (!response.ok) {
        throw new Error("Failed to search members");
      }

      const result = await response.json();

      // Cache the results for future searches
      if (result.data && Array.isArray(result.data)) {
        // If this is a comprehensive search, update the full cache
        if (normalizedQuery.length <= 2) {
          memberCache.setAllMembers(result.data);
        } else {
          // Cache individual members
          result.data.forEach((member: CachedMember) => {
            memberCache.setMember(member);
          });
        }
      }

      return result.data || [];
    },
    enabled: shouldSearch && cachedResults === null, // Only fetch if cache miss
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Return cached results immediately, or API results if cache miss
  const finalResults = cachedResults || apiData || [];

  return {
    data: finalResults,
    isLoading: cachedResults === null && isLoading,
    isCacheHit,
    isError,
    error,
  };
}

/**
 * Hook for debounced member search
 */
export function useDebouncedMemberSearch(
  query: string,
  options: UseEnhancedMemberSearchOptions = {}
) {
  const { debounceMs = 300, ...restOptions } = options;
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  const debounce = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        setDebouncedQuery(value);
      }, debounceMs);

      return () => clearTimeout(timer);
    },
    [debounceMs]
  );

  // Update debounced query when input changes
  useMemo(() => {
    const cleanup = debounce(query);
    return cleanup;
  }, [query, debounce]);

  return useEnhancedMemberSearch(debouncedQuery, restOptions);
}

/**
 * Hook to warm the member cache
 */
export function useWarmMemberCache() {
  return useQuery({
    queryKey: ["warmMemberCache"],
    queryFn: async () => {
      // Ensure we're on client side
      if (typeof window === "undefined") {
        throw new Error("Cache warming should only run on client side");
      }

      const response = await fetch("/api/members/lookup?warm=true");
      if (!response.ok) {
        throw new Error(
          `Failed to warm cache: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        memberCache.setAllMembers(result.data);
        console.log(
          `🔥 Cache warmed with ${result.data.length} members via hook`
        );
      }

      return result.data || [];
    },
    enabled: typeof window !== "undefined", // Only run on client side
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

/**
 * Hook to get cache statistics
 */
export function useMemberCacheStats() {
  const [stats, setStats] = useState(memberCache.getStats());

  // Update stats periodically
  useMemo(() => {
    const interval = setInterval(() => {
      setStats(memberCache.getStats());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return stats;
}

/**
 * Hook to invalidate member cache
 */
export function useMemberCacheInvalidation() {
  return {
    invalidateMember: useCallback((id: string) => {
      memberCache.invalidateMember(id);
    }, []),

    invalidateAllMembers: useCallback(() => {
      memberCache.invalidateAllMembers();
    }, []),

    clearSearchCache: useCallback(() => {
      memberCache.clearSearchCache();
    }, []),
  };
}
