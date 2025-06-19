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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberLookup } from "@/hooks/use-attendance";
import { usePaymentReport } from "@/hooks/use-payments";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

interface MemberSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  membershipStatus: string;
}

interface PaymentReportPayment {
  id: string;
  amount: number;
  method: string;
  description?: string | null;
  paidAt: Date | null;
  member: {
    name: string;
    email?: string;
  };
  plan?: string;
  transactionRef?: string | null;
}

interface MonthlyReportData {
  period: {
    year: number;
    month: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    averageTransaction: number;
  };
  breakdown: {
    byMethod: Record<string, number>;
    byPlan: Record<string, number>;
    dailyBreakdown: Record<string, number>;
  };
  topMembers: Array<{
    name: string;
    amount: number;
  }>;
  payments: PaymentReportPayment[];
}

interface MemberReportPayment {
  id: string;
  amount: number;
  method: string;
  description?: string | null;
  paidAt: Date | null;
  plan?: string;
  transactionRef?: string | null;
}

interface MemberReportData {
  member: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
    membershipNumber: string;
    membershipStatus: string;
    joinDate: Date;
  };
  period: {
    year: number;
    month: number;
    startDate: string;
    endDate: string;
  };
  monthly: {
    totalAmount: number;
    totalTransactions: number;
    averageTransaction: number;
    byMethod: Record<string, number>;
    payments: MemberReportPayment[];
  };
  overall: {
    totalPaid: number;
    totalTransactions: number;
    averageTransaction: number;
  };
  paymentHistory: Array<{
    amount: number;
    method: string;
    paidAt: Date | null;
  }>;
}

export default function PaymentReportsPage() {
  const [reportType, setReportType] = useState<"monthly" | "member">("monthly");
  const [selectedMember, setSelectedMember] =
    useState<MemberSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [reportParams, setReportParams] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { data: memberLookup } = useMemberLookup(searchQuery);
  const { data: reportData, isLoading } = usePaymentReport({
    type: reportType,
    memberId: selectedMember?.id,
    year: reportParams.year,
    month: reportParams.month,
  });

  const handleMemberSelect = useCallback((member: MemberSearchResult) => {
    setSelectedMember(member);
    setSearchQuery(`${member.firstName} ${member.lastName}`);
    setShowMemberSearch(false);
  }, []);

  const clearMemberSelection = useCallback(() => {
    setSelectedMember(null);
    setSearchQuery("");
    setShowMemberSearch(false);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setShowMemberSearch(value.length >= 2);
      if (value.length === 0) {
        clearMemberSelection();
      }
    },
    [clearMemberSelection]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleDateString("en-US", {
      month: "long",
    });
  };

  const exportReport = () => {
    if (!reportData?.data) return;

    const csvContent =
      reportType === "monthly"
        ? generateMonthlyCSV(reportData.data as MonthlyReportData)
        : generateMemberCSV(reportData.data as MemberReportData);

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}_report_${reportParams.year}_${reportParams.month}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateMonthlyCSV = (data: MonthlyReportData) => {
    const header = "Date,Member,Amount,Method,Description,Transaction Ref\n";
    const rows = data.payments
      .map(
        (payment: PaymentReportPayment) =>
          `${payment.paidAt},${payment.member.name},${payment.amount},${
            payment.method
          },${payment.description || ""},${payment.transactionRef || ""}`
      )
      .join("\n");
    return header + rows;
  };

  const generateMemberCSV = (data: MemberReportData) => {
    const header = "Date,Amount,Method,Description,Transaction Ref\n";
    const rows = data.monthly.payments
      .map(
        (payment: MemberReportPayment) =>
          `${payment.paidAt},${payment.amount},${payment.method},${
            payment.description || ""
          },${payment.transactionRef || ""}`
      )
      .join("\n");
    return header + rows;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/payments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Reports
            </h1>
            <p className="text-muted-foreground">
              Generate and view detailed payment reports
            </p>
          </div>
        </div>
        {reportData?.data && (
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Configuration
          </CardTitle>
          <CardDescription>
            Configure the report type and parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(value: "monthly" | "member") => {
                  setReportType(value);
                  if (value === "monthly") {
                    setSelectedMember(null);
                    setSearchQuery("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="member">Member Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
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
                <SelectTrigger>
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
                <SelectTrigger>
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

            {/* Member Selection (for member reports) */}
            {reportType === "member" && (
              <div className="space-y-2">
                <Label>Member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search member..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Member Search Results */}
                {showMemberSearch &&
                  memberLookup?.data &&
                  memberLookup.data.length > 0 && (
                    <div className="absolute z-10 w-full border rounded-lg p-2 space-y-1 max-h-60 overflow-y-auto bg-background shadow-lg">
                      {memberLookup.data.map((member: MemberSearchResult) => (
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
                              {member.membershipNumber}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Selected Member Display */}
          {reportType === "member" && selectedMember && (
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMemberSelection}
                >
                  Change
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Results */}
      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Generating report...</p>
            </div>
          </CardContent>
        </Card>
      ) : reportData?.data ? (
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Payment Details</TabsTrigger>
            {reportType === "monthly" && (
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            )}
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            {reportType === "monthly" ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(reportData.data.summary.totalRevenue)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Transactions
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.data.summary.totalTransactions}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Average Transaction
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          reportData.data.summary.averageTransaction
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Top Members
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.data.topMembers.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Method Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(
                        (reportData.data as MonthlyReportData).breakdown
                          .byMethod
                      ).map(([method, amount]: [string, number]) => (
                        <div
                          key={method}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize">
                            {method.toLowerCase().replace("_", " ")}
                          </span>
                          <Badge variant="secondary">
                            {formatCurrency(amount)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Member Report Summary
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Total
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(reportData.data.monthly.totalAmount)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Transactions
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.data.monthly.totalTransactions}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Lifetime Total
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(reportData.data.overall.totalPaid)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Member Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Member Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="ml-2 font-medium">
                          {reportData.data.member.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-2 font-medium">
                          {reportData.data.member.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Membership #:
                        </span>
                        <span className="ml-2 font-medium">
                          {reportData.data.member.membershipNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className="ml-2" variant="secondary">
                          {reportData.data.member.membershipStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Payment Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  {reportType === "monthly"
                    ? `All payments for ${getMonthName(reportParams.month)} ${
                        reportParams.year
                      }`
                    : `${selectedMember?.firstName} ${
                        selectedMember?.lastName
                      }'s payments for ${getMonthName(reportParams.month)} ${
                        reportParams.year
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {reportType === "monthly" && (
                          <TableHead>Member</TableHead>
                        )}
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction Ref</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(reportType === "monthly"
                        ? (reportData.data as MonthlyReportData).payments
                        : (reportData.data as MemberReportData).monthly.payments
                      ).map(
                        (
                          payment: PaymentReportPayment | MemberReportPayment
                        ) => (
                          <TableRow key={payment.id}>
                            {reportType === "monthly" && (
                              <TableCell className="font-medium">
                                {(payment as PaymentReportPayment).member.name}
                              </TableCell>
                            )}
                            <TableCell className="font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell className="capitalize">
                              {payment.method.toLowerCase().replace("_", " ")}
                            </TableCell>
                            <TableCell>
                              {payment.description ||
                                (payment as PaymentReportPayment).plan ||
                                "-"}
                            </TableCell>
                            <TableCell>
                              {payment.paidAt
                                ? formatDate(payment.paidAt)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                {payment.transactionRef || "-"}
                              </code>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab (Monthly only) */}
          {reportType === "monthly" && (
            <TabsContent value="analytics">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Top Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Paying Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(reportData.data as MonthlyReportData).topMembers
                        .slice(0, 10)
                        .map(
                          (
                            member: { name: string; amount: number },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="font-medium">
                                  {member.name}
                                </span>
                              </div>
                              <Badge variant="secondary">
                                {formatCurrency(member.amount)}
                              </Badge>
                            </div>
                          )
                        )}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Revenue */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {Object.entries(
                        (reportData.data as MonthlyReportData).breakdown
                          .dailyBreakdown
                      )
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, amount]: [string, number]) => (
                          <div
                            key={date}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">
                              {new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <Badge variant="secondary">
                              {formatCurrency(amount)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Report Data</h3>
            <p className="text-muted-foreground mb-4">
              {reportType === "member" && !selectedMember
                ? "Please select a member to generate a report"
                : "No payment data found for the selected period"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
