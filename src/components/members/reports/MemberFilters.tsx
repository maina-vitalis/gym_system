import { MemberSearchResult } from "@/app/dashboard/members/reports/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CachedMember } from "@/lib/cache/member-cache";
import { Search, X } from "lucide-react";
import { Dispatch, JSX, SetStateAction } from "react";

interface MemberFiltersProps {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
  showMemberSearch: boolean;
  memberLookup: CachedMember[];
  handleMemberSelect: (member: MemberSearchResult) => void;
  getStatusBadge: (value: string) => JSX.Element;
  reportParams: {
    year: number;
    month: number;
  };
  setReportParams: Dispatch<
    SetStateAction<{
      year: number;
      month: number;
    }>
  >;
  getMonthName: (month: number) => string;
  clearMemberSelection: () => void;
  selectedMember: MemberSearchResult | null;
}

function MemberFilters({
  searchQuery,
  handleSearchChange,
  showMemberSearch,
  memberLookup,
  handleMemberSelect,
  getStatusBadge,
  getMonthName,
  reportParams,
  setReportParams,
  clearMemberSelection,
  selectedMember,
}: MemberFiltersProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Select Member & Report Period
          </CardTitle>
          <CardDescription>
            Choose a member and specify the time period for the payment report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Member Search */}
            <div className="space-y-2">
              <Label>Member</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search member by name or number..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Member Search Results */}
              {showMemberSearch && memberLookup && memberLookup.length > 0 && (
                <div className="absolute z-10 w-full border rounded-lg p-2 space-y-1 max-h-60 overflow-y-auto bg-background shadow-lg">
                  {memberLookup.map((member: MemberSearchResult) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleMemberSelect(member)}
                    >
                      <div>
                        <div className="font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.membershipNumber} • {member.email}
                        </div>
                      </div>
                      {getStatusBadge(member.membershipStatus)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Year */}
            <div className="space-y-2 col-span-1">
              <Label>Year</Label>
              <Select
                value={reportParams.year.toString()}
                onValueChange={(value) =>
                  setReportParams((prev) => ({
                    ...prev,
                    year: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month */}
            <div className="space-y-2">
              <Label>Month</Label>
              <Select
                value={reportParams.month.toString()}
                onValueChange={(value) =>
                  setReportParams((prev) => ({
                    ...prev,
                    month: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Member Display */}
          {selectedMember && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMember.email} • {selectedMember.membershipNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedMember.membershipStatus)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearMemberSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberFilters;
