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
import { useDashboardStats } from "@/hooks/use-dashboard";
import { AuthUser, useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as AuthUser | undefined;

  // Only fetch stats for admin users
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats(user?.role === "ADMIN");

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

  if (isPending || (user?.role === "ADMIN" && statsLoading)) {
    return <DashboardSkeleton />;
  }

  // Show error state for admin users if stats fail to load
  if (user?.role === "ADMIN" && statsError) {
    return (
      <div className="space-y-6">
        <DashboardHeader user={user} />
        <div className="py-8 text-center">
          <p className="text-red-600">
            Failed to load dashboard statistics. Please try again.
          </p>
        </div>
      </div>
    );
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
