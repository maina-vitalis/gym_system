"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnhancedMemberSearch } from "@/hooks/use-member-search";
import { Loader2, Search } from "lucide-react";
import { MemberData } from "./types";

interface MemberSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedMember: MemberData | null;
  onMemberSelect: (member: MemberData) => void;
  error?: string;
}

export function MemberSearch({
  searchQuery,
  onSearchQueryChange,
  selectedMember,
  onMemberSelect,
  error,
}: MemberSearchProps) {
  const { data: searchResults, isLoading: isSearching } =
    useEnhancedMemberSearch(searchQuery);

  return (
    <div className="space-y-2">
      <Label htmlFor="member-search">
        Member <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          id="member-search"
          placeholder="Search members by name, email, or membership number..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="border rounded-md max-h-48 overflow-auto">
          {isSearching ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="p-1">
              {searchResults.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onMemberSelect(member)}
                  className="w-full text-left p-2 hover:bg-muted rounded text-sm border-b last:border-b-0"
                >
                  <div className="font-medium">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-muted-foreground">
                    {member.email} • {member.membershipNumber}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No members found
            </div>
          )}
        </div>
      )}

      {/* Selected Member Display */}
      {selectedMember && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="font-medium">
            {selectedMember.firstName} {selectedMember.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedMember.email} • {selectedMember.membershipNumber}
            {selectedMember.phoneNumber && <> • {selectedMember.phoneNumber}</>}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
