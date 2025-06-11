"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAttendance,
  useAttendanceStats,
  useCheckIn,
  useCheckOut,
} from "@/hooks/use-attendance";
import {
  useEnhancedMemberSearch,
  useMemberCacheStats,
  useWarmMemberCache,
} from "@/hooks/use-member-search";
import {
  Activity,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  Search,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";

interface MemberSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  membershipStatus: string;
  hasActiveVisit?: boolean;
}

interface AttendanceRecord {
  id: string;
  memberId: string;
  type: "CHECK_IN" | "CHECK_OUT";
  timestamp: string;
  notes?: string | null;
  member: {
    id: string;
    membershipNumber: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export default function AttendancePage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedMember, setSelectedMember] =
    useState<MemberSearchResult | null>(null);
  const [checkInNotes, setCheckInNotes] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Get today's date for filtering
  const today = new Date().toISOString().split("T")[0];

  // Hooks
  const { data: stats, isLoading: statsLoading } = useAttendanceStats(today);

  // Use enhanced member search with cache instead of direct database lookup
  const {
    data: memberSearchResults,
    isLoading: isSearching,
    isCacheHit,
  } = useEnhancedMemberSearch(searchInput, {
    enabled: searchInput.trim().length >= 2,
    limit: 8,
    minQueryLength: 2,
  });

  const { data: todayAttendance, isLoading: attendanceLoading } = useAttendance(
    {
      date: today,
      limit: 50,
    }
  );

  // Warm the member cache on component mount
  useWarmMemberCache();

  // Get cache statistics for performance monitoring
  const cacheStats = useMemberCacheStats();

  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      setShowResults(value.trim().length >= 2);

      // Clear selected member if search is cleared
      if (value.trim().length === 0) {
        setSelectedMember(null);
      }
    },
    []
  );

  // Handle member selection
  const handleMemberSelect = useCallback((member: MemberSearchResult) => {
    setSelectedMember(member);
    setSearchInput(`${member.firstName} ${member.lastName}`);
    setShowResults(false);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSelectedMember(null);
    setShowResults(false);
    setCheckInNotes("");
  }, []);

  const handleCheckIn = async (member: MemberSearchResult) => {
    try {
      await checkInMutation.mutateAsync({
        memberId: member.id,
        notes: checkInNotes,
      });
      clearSearch();
    } catch {
      // Error handled by hook
    }
  };

  const handleCheckOut = async (memberId: string) => {
    try {
      await checkOutMutation.mutateAsync({
        memberId,
      });
    } catch {
      // Error handled by hook
    }
  };

  const formatTime = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "EXPIRED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Get today's check-ins and check-outs
  const todayCheckIns =
    todayAttendance?.data?.filter(
      (record: AttendanceRecord) => record.type === "CHECK_IN"
    ) || [];

  const todayCheckOuts =
    todayAttendance?.data?.filter(
      (record: AttendanceRecord) => record.type === "CHECK_OUT"
    ) || [];

  // Get currently active visitors (checked in but not checked out)
  const currentlyInGym = todayCheckIns.filter(
    (checkIn: AttendanceRecord) =>
      !todayCheckOuts.some(
        (checkOut: AttendanceRecord) => checkOut.memberId === checkIn.memberId
      )
  );

  // Show loading indicator when user is typing or search is in progress
  const showLoadingIndicator = isSearching;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Manage member check-ins, check-outs, and view attendance analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visits Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.data?.totalVisitsToday || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Currently In Gym
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.data?.activeVisitors || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "..."
                : (() => {
                    const popularTimes = stats?.data?.popularTimes || [];
                    const peakHour = popularTimes.reduce(
                      (
                        max: { hour: number; count: number },
                        time: { hour: number; count: number }
                      ) => (time.count > max.count ? time : max),
                      { hour: 0, count: 0 }
                    );
                    return `${peakHour.hour}:00`;
                  })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Visits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "..."
                : stats?.data?.monthlyStats?.totalVisits || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checkin" className="space-y-6">
        <TabsList>
          <TabsTrigger value="checkin">Check In/Out</TabsTrigger>
          <TabsTrigger value="visits">Today&apos;s Visits</TabsTrigger>
          <TabsTrigger value="active">Currently In Gym</TabsTrigger>
        </TabsList>

        {/* Check In/Out Tab */}
        <TabsContent value="checkin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Member Check-In
                {cacheStats && cacheStats.allMembersCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {cacheStats.allMembersCount} members cached
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Search and check in members quickly with cached search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                {showLoadingIndicator && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 text-muted-foreground animate-spin" />
                )}
                <Input
                  placeholder="Search by name, email, or membership number..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-8 top-3 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search Status */}
              {searchInput.length > 0 && searchInput.length < 2 && (
                <p className="text-sm text-muted-foreground">
                  Type at least 2 characters to search...
                </p>
              )}

              {/* Member Search Results */}
              {showResults &&
                memberSearchResults &&
                memberSearchResults.length > 0 && (
                  <div className="space-y-2 border rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-muted-foreground">
                        Found {memberSearchResults.length} member(s)
                      </p>
                      {isCacheHit && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Zap className="w-3 h-3" />
                          <span>Cache Hit</span>
                        </div>
                      )}
                    </div>
                    {memberSearchResults.map((member: MemberSearchResult) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleMemberSelect(member)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {member.firstName} {member.lastName}
                            </span>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(
                                member.membershipStatus
                              )}
                            >
                              {member.membershipStatus}
                            </Badge>
                            {member.hasActiveVisit && (
                              <Badge variant="default">Currently In Gym</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.email} • {member.membershipNumber}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {member.hasActiveVisit ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckOut(member.id);
                              }}
                              disabled={checkOutMutation.isPending}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Check Out
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMemberSelect(member);
                              }}
                              disabled={
                                member.membershipStatus !== "ACTIVE" ||
                                checkInMutation.isPending
                              }
                            >
                              <LogIn className="mr-2 h-4 w-4" />
                              Select
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* No Results */}
              {showResults &&
                memberSearchResults &&
                memberSearchResults.length === 0 &&
                !showLoadingIndicator && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No members found matching &quot;{searchInput}&quot;
                  </p>
                )}

              {/* Check In Form */}
              {selectedMember && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Check In: {selectedMember.firstName}{" "}
                      {selectedMember.lastName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Add notes (optional)"
                      value={checkInNotes}
                      onChange={(e) => setCheckInNotes(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCheckIn(selectedMember)}
                        disabled={checkInMutation.isPending}
                      >
                        {checkInMutation.isPending ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Checking In...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Confirm Check In
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={clearSearch}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Today's Visits Tab */}
        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Visits</CardTitle>
              <CardDescription>
                All member check-ins for{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAttendance?.data?.map((record: AttendanceRecord) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {record.member.user.firstName}{" "}
                              {record.member.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.member.membershipNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.type === "CHECK_IN"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              record.type === "CHECK_IN"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {record.type === "CHECK_IN"
                              ? "Check In"
                              : "Check Out"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTime(record.timestamp)}</TableCell>
                        <TableCell>{record.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                    {(!todayAttendance?.data ||
                      todayAttendance.data.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          No attendance records found for today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currently In Gym Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Currently In Gym</CardTitle>
              <CardDescription>
                Members who are currently checked in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Check In Time</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentlyInGym.map((record: AttendanceRecord) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {record.member.user.firstName}{" "}
                            {record.member.user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {record.member.membershipNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(record.timestamp)}</TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckOut(record.memberId)}
                          disabled={checkOutMutation.isPending}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Check Out
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentlyInGym.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No members currently in the gym
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
