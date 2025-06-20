"use client";

import {
  AnalyticsCards,
  DashboardHeader,
  KeyMetricsCards,
  MemberDashboard,
  MemberStatusBreakdown,
  PaymentAlertCards,
  QuickActionsCard,
  RecentActivityCard,
  UpcomingRenewalsCard,
} from "@/components/dashboard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { AuthUser, useSession } from "@/lib/auth-client";
import { DashboardStats } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user as AuthUser | undefined;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      if (user?.role === "ADMIN") {
        fetchStats();
      } else {
        setLoading(false);
      }
    }
  }, [user, isPending]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (isPending || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader user={user} />

      {/* Admin Dashboard */}
      {user?.role === "ADMIN" && stats && (
        <>
          <KeyMetricsCards stats={stats} formatCurrency={formatCurrency} />

          <MemberStatusBreakdown stats={stats} />

          <PaymentAlertCards stats={stats} />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <QuickActionsCard />
                <UpcomingRenewalsCard
                  stats={stats}
                  formatCurrency={formatCurrency}
                />
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <RecentActivityCard
                stats={stats}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsCards stats={stats} />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Member Dashboard */}
      {user?.role === "MEMBER" && <MemberDashboard />}
    </div>
  );
}
