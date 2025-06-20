"use client";

import MemberFilters from "@/components/members/reports/MemberFilters";
import MemberReportInfo from "@/components/members/reports/MemberReportInfo";
import MemberReportSummaryStat from "@/components/members/reports/MemberReportSummaryStat";
import MemberReportTable from "@/components/members/reports/MemberReportTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useEnhancedMemberSearch } from "@/hooks/use-member-search";
import { usePaymentReport } from "@/hooks/use-payments";
import { Clock, FileText, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface MemberSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  membershipStatus: string;
}

interface MemberPaymentReport {
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
    payments: Array<{
      id: string;
      amount: number;
      method: string;
      description?: string | null;
      paidAt: Date | null;
      plan?: string;
      transactionRef?: string | null;
    }>;
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

export default function MemberPaymentReportsPage() {
  const [selectedMember, setSelectedMember] =
    useState<MemberSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [reportParams, setReportParams] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [generating, setGenerating] = useState(false);

  const { data: memberLookup } = useEnhancedMemberSearch(searchQuery);
  const { data: reportData, isLoading } = usePaymentReport({
    type: "member",
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

  const exportToCSV = async () => {
    if (!reportData?.data) {
      toast.error("No report data to export");
      return;
    }

    setGenerating(true);
    try {
      const data = reportData.data as MemberPaymentReport;
      const headers = [
        "Date",
        "Amount",
        "Method",
        "Description",
        "Transaction Ref",
      ];
      const csvContent = [
        headers.join(","),
        ...data.monthly.payments.map((payment) =>
          [
            payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "",
            payment.amount.toString(),
            payment.method,
            `"${payment.description || payment.plan || ""}"`,
            `"${payment.transactionRef || ""}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.member.name.replace(/\s+/g, "_")}_payments_${
        reportParams.year
      }_${reportParams.month}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Payment report exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export payment report");
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleDateString("en-US", {
      month: "long",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: "Active", variant: "default" as const },
      INACTIVE: { label: "Inactive", variant: "secondary" as const },
      EXPIRED: { label: "Expired", variant: "destructive" as const },
      SUSPENDED: { label: "Suspended", variant: "outline" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Member Payment Reports
          </h1>
          <p className="text-muted-foreground">
            Generate detailed payment reports for individual members
          </p>
        </div>
        {reportData?.data && (
          <Button variant="outline" onClick={exportToCSV} disabled={generating}>
            {generating ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        )}
      </div>

      {/* Member Selection and Report Parameters */}
      <MemberFilters
        clearMemberSelection={clearMemberSelection}
        getMonthName={getMonthName}
        getStatusBadge={getStatusBadge}
        handleMemberSelect={handleMemberSelect}
        handleSearchChange={handleSearchChange}
        memberLookup={memberLookup}
        reportParams={reportParams}
        searchQuery={searchQuery}
        selectedMember={selectedMember}
        setReportParams={setReportParams}
        showMemberSearch={showMemberSearch}
      />

      {/* Report Results */}
      {isLoading && selectedMember && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Generating payment report...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData?.data && (
        <div className="space-y-6">
          {/* Summary Statistics */}
          <MemberReportSummaryStat
            formatCurrency={formatCurrency}
            getMonthName={getMonthName}
            reportData={reportData}
            reportParams={reportParams}
          />

          {/* Member Information */}
          <MemberReportInfo
            getStatusBadge={getStatusBadge}
            reportData={reportData}
          />

          {/* Payment Details payment table */}
          <MemberReportTable
            formatCurrency={formatCurrency}
            getMonthName={getMonthName}
            reportData={reportData}
            reportParams={reportParams}
            selectedMember={selectedMember}
          />
        </div>
      )}

      {/* Empty State */}
      {!selectedMember && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Member</h3>
            <p className="text-muted-foreground text-center mb-4">
              Search and select a member above to generate their payment report.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
