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
import { usePaymentReport } from "@/hooks/use-payments";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

export default function CompanyPaymentReportsPage() {
  const [reportParams, setReportParams] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const { data: reportData, isLoading } = usePaymentReport({
    type: "monthly",
    year: reportParams.year,
    month: reportParams.month,
  });

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

    const data = reportData.data as MonthlyReportData;
    const csvContent = generateMonthlyCSV(data);

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `company_payment_report_${reportParams.year}_${reportParams.month}.csv`;
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
          },${payment.description || ""},${payment.transactionRef || ""}`,
      )
      .join("\n");
    return header + rows;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="">
        <div className="space-y-3">
          <Link href="/dashboard/payments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payments
            </Button>
          </Link>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight md:text-3xl">
                Company Payment Reports
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Generate and view detailed company-wide payment reports
              </p>
            </div>

            {reportData?.data && (
              <Button
                onClick={exportReport}
                variant="outline"
                className="md:w-fit"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Configuration
          </CardTitle>
          <CardDescription>
            Configure the report period for company-wide payment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Year */}
            <div className="w-full space-y-2">
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
                    (_, i) => new Date().getFullYear() - i,
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
        </CardContent>
      </Card>

      {/* Report Results */}
      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p>Generating company payment report...</p>
            </div>
          </CardContent>
        </Card>
      ) : reportData?.data ? (
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Payment Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        (reportData.data as MonthlyReportData).summary
                          .totalRevenue,
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {getMonthName(reportParams.month)} {reportParams.year}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Transactions
                    </CardTitle>
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        (reportData.data as MonthlyReportData).summary
                          .totalTransactions
                      }
                    </div>
                    <p className="text-muted-foreground text-xs">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Transaction
                    </CardTitle>
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        (reportData.data as MonthlyReportData).summary
                          .averageTransaction,
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Per transaction
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Members
                    </CardTitle>
                    <Users className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(reportData.data as MonthlyReportData).topMembers.length}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Paying members
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Method Breakdown */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Revenue breakdown by payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        (reportData.data as MonthlyReportData).breakdown
                          .byMethod,
                      ).map(([method, amount]: [string, number]) => (
                        <div
                          key={method}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium capitalize">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Membership Plans</CardTitle>
                    <CardDescription>
                      Revenue breakdown by membership plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        (reportData.data as MonthlyReportData).breakdown.byPlan,
                      ).map(([plan, amount]: [string, number]) => (
                        <div
                          key={plan}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{plan}</span>
                          <Badge variant="secondary">
                            {formatCurrency(amount)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Payment Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  All company payments for {getMonthName(reportParams.month)}{" "}
                  {reportParams.year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction Ref</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(reportData.data as MonthlyReportData).payments.map(
                        (payment: PaymentReportPayment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.member.name}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell className="capitalize">
                              {payment.method.toLowerCase().replace("_", " ")}
                            </TableCell>
                            <TableCell>
                              {payment.description || payment.plan || "-"}
                            </TableCell>
                            <TableCell>
                              {payment.paidAt
                                ? formatDate(payment.paidAt)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <code className="bg-muted rounded px-1 py-0.5 text-sm">
                                {payment.transactionRef || "-"}
                              </code>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Paying Members</CardTitle>
                  <CardDescription>
                    Members with highest payments this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(reportData.data as MonthlyReportData).topMembers
                      .slice(0, 10)
                      .map(
                        (
                          member: { name: string; amount: number },
                          index: number,
                        ) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="font-medium">{member.name}</span>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(member.amount)}
                            </Badge>
                          </div>
                        ),
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue</CardTitle>
                  <CardDescription>
                    Day-by-day revenue breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {Object.entries(
                      (reportData.data as MonthlyReportData).breakdown
                        .dailyBreakdown,
                    )
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, amount]: [string, number]) => (
                        <div
                          key={date}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">
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
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 font-medium">No Payment Data</h3>
            <p className="text-muted-foreground mb-4">
              No payment data found for {getMonthName(reportParams.month)}{" "}
              {reportParams.year}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
