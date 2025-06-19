"use client";

import { CacheStatus } from "@/components/cache-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface MemberReport {
  id: string;
  membershipNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: string;
  joinDate: string;
  lastVisit?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  healthConditions?: string;
  fitnessGoals?: string;
  currentPlan?: {
    name: string;
    price: number;
    duration: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  totalPaid: number;
  totalPayments: number;
}

interface ReportSummary {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  expiredMembers: number;
  suspendedMembers: number;
  totalRevenue: number;
  averageAge: number;
}

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export default function MembersReportsPage() {
  const [members, setMembers] = useState<MemberReport[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    planId: "",
    includePayments: true,
    includeSubscriptions: true,
  });

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<MemberReport[]>([]);

  // Fetch membership plans for filter
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/membership-plans");
        if (response.ok) {
          const data = await response.json();
          setMembershipPlans(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch membership plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setMembers([]);
    setSummary(null);

    try {
      console.log("🔄 Generating report with filters:", filters);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.planId) params.append("planId", filters.planId);
      params.append("includePayments", filters.includePayments.toString());
      params.append(
        "includeSubscriptions",
        filters.includeSubscriptions.toString()
      );

      const response = await fetch(`/api/members/reports?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from server");
      }

      setMembers(data.data);
      setSummary(data.summary);
      toast.success(
        `Report generated successfully with ${data.data.length} members`
      );
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate report"
      );
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredMembers(members);
        return;
      }

      const searchTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 0);

      const filtered = members.filter((member) => {
        const searchableText = [
          member.name,
          member.email,
          member.membershipNumber,
          member.phoneNumber || "",
          member.status,
          member.currentPlan?.name || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchTerms.every((term) => searchableText.includes(term));
      });

      setFilteredMembers(filtered);
    },
    [members]
  );

  // Update filtered members when members change
  useEffect(() => {
    handleSearch(searchQuery);
  }, [members, searchQuery, handleSearch]);

  const exportToCSV = async () => {
    setGenerating(true);
    try {
      const params = new URLSearchParams();
      params.append("format", "csv");
      if (filters.status) params.append("status", filters.status);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.planId) params.append("planId", filters.planId);
      params.append("includePayments", filters.includePayments.toString());
      params.append(
        "includeSubscriptions",
        filters.includeSubscriptions.toString()
      );

      const response = await fetch(`/api/members/reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to export report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `members-report-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Failed to export report:", error);
      toast.error("Failed to export report");
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      EXPIRED: "outline",
      SUSPENDED: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports about your gym members
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CacheStatus />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>
            Configure the parameters for your members report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Member Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            {/* Membership Plan Filter */}
            <div className="space-y-2">
              <Label htmlFor="plan-filter">Membership Plan</Label>
              <Select
                value={filters.planId}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, planId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Plans</SelectItem>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Members */}
            <div className="space-y-2">
              <Label htmlFor="search-members">Search Members</Label>
              <Input
                placeholder="Search by name, email, or membership number..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-payments"
                checked={filters.includePayments}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    includePayments: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="include-payments">Include payment history</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-subscriptions"
                checked={filters.includeSubscriptions}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    includeSubscriptions: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="include-subscriptions">
                Include subscription details
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={generateReport} disabled={loading}>
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>

            {(filteredMembers.length > 0 || members.length > 0) && (
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                In selected criteria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.activeMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.totalMembers > 0
                  ? `${Math.round(
                      (summary.activeMembers / summary.totalMembers) * 100
                    )}% of total`
                  : "No members"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From selected members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Age</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.averageAge > 0 ? `${summary.averageAge} years` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on birth dates
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Breakdown */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>
              Distribution of member statuses in the report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.activeMembers}
                </div>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {summary.inactiveMembers}
                </div>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.expiredMembers}
                </div>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {summary.suspendedMembers}
                </div>
                <p className="text-sm text-muted-foreground">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      {(filteredMembers.length > 0 || members.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Members Report Data</CardTitle>
            <CardDescription>
              {searchQuery ? (
                <>
                  Showing {filteredMembers.length} of {members.length} members
                  matching &quot;{searchQuery}&quot;
                </>
              ) : (
                <>Showing {members.length} members matching your criteria</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Member #</th>
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Email</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Join Date</th>
                    <th className="text-left p-2 font-medium">Current Plan</th>
                    <th className="text-left p-2 font-medium">Total Paid</th>
                    <th className="text-left p-2 font-medium">Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery ? filteredMembers : members).map((member) => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-sm">
                        {member.membershipNumber}
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          {member.phoneNumber && (
                            <div className="text-sm text-muted-foreground">
                              {member.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-sm">{member.email}</td>
                      <td className="p-2">{getStatusBadge(member.status)}</td>
                      <td className="p-2 text-sm">
                        {formatDate(member.joinDate)}
                      </td>
                      <td className="p-2">
                        {member.currentPlan ? (
                          <div>
                            <div className="font-medium">
                              {member.currentPlan.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(member.currentPlan.price)} •{" "}
                              {member.currentPlan.duration} days
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No active plan
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-medium">
                        {formatCurrency(member.totalPaid)}
                      </td>
                      <td className="p-2 text-sm">{member.totalPayments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && members.length === 0 && summary === null && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Report Generated</h3>
            <p className="text-muted-foreground text-center mb-4">
              Configure your filters above and click &quot;Generate Report&quot;
              to create a members report.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
