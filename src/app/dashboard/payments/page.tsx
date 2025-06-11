"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsTable } from "@/components/ui/payments-table";
import { usePayments } from "@/hooks/use-payments";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  DollarSign,
  FileText,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Use the same Payment interface as PaymentsTable
interface Payment {
  id: string;
  amount: number;
  method: "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  description?: string;
  paidAt?: string;
  transactionRef?: string;
  createdAt: string;
  member?: {
    id: string;
    membershipNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  membershipPlan?: {
    name: string;
    price: number;
    duration: number;
  };
}

export default function PaymentsPage() {
  const [isUpdatingStatuses, setIsUpdatingStatuses] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all payments without pagination for client-side filtering
  const { data: paymentsData, isLoading } = usePayments({
    limit: 1000, // Get all payments for client-side filtering
    offset: 0,
  });

  const payments: Payment[] = useMemo(
    () => paymentsData?.data || [],
    [paymentsData?.data]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalRevenue = payments.reduce(
      (sum: number, payment: Payment) =>
        payment.status === "COMPLETED" ? sum + payment.amount : sum,
      0
    );
    const totalTransactions = payments.filter(
      (p: Payment) => p.status === "COMPLETED"
    ).length;
    const pendingAmount = payments.reduce(
      (sum: number, payment: Payment) =>
        payment.status === "PENDING" ? sum + payment.amount : sum,
      0
    );
    const failedTransactions = payments.filter(
      (p: Payment) => p.status === "FAILED"
    ).length;

    return {
      totalRevenue,
      totalTransactions,
      pendingAmount,
      failedTransactions,
      averageTransaction:
        totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
    };
  }, [payments]);

  // Update member statuses based on subscription expiry
  const updateMemberStatuses = async () => {
    setIsUpdatingStatuses(true);
    try {
      const response = await fetch("/api/members/status", {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          `Member statuses updated successfully!

Total members: ${result.totalMembers}
Active: ${result.summary.active}
Expired: ${result.summary.expired}
Inactive: ${result.summary.inactive}
Suspended: ${result.summary.suspended}

${result.updates.length} members had status changes.`,
          {
            description: `Active: ${result.summary.active}, Expired: ${result.summary.expired}, Inactive: ${result.summary.inactive}`,
          }
        );

        // Refresh payments data to reflect any changes
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      } else {
        toast.error("Failed to update member statuses");
      }
    } catch (error) {
      console.error("Failed to update member statuses:", error);
      toast.error("Failed to update member statuses");
    } finally {
      setIsUpdatingStatuses(false);
    }
  };

  // Handle payment deletion
  const handlePaymentDeleted = () => {
    // Refresh payments data
    queryClient.invalidateQueries({ queryKey: ["payments"] });
    toast.success("Payment data refreshed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage payments and track member subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={updateMemberStatuses}
            disabled={isUpdatingStatuses}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isUpdatingStatuses ? "animate-spin" : ""
              }`}
            />
            Update Member Status
          </Button>
          <Link href="/dashboard/payments/reports">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="/dashboard/payments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {summary.totalTransactions} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Transaction
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.averageTransaction)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per completed payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Payments
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary.failedTransactions}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        onPaymentDeleted={handlePaymentDeleted}
      />
    </div>
  );
}
