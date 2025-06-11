"use client";

import { CacheStatus } from "@/components/cache-status";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { AuthUser, useSession } from "@/lib/auth-client";
import { DashboardStats } from "@/types";
import {
  AlertTriangle,
  ArrowDownIcon,
  ArrowUpIcon,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Plus,
  Target,
  UserCheck,
  UserMinus,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
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

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const colorClass = isPositive ? "text-green-500" : "text-red-500";

    return (
      <div className={`flex items-center space-x-1 text-xs ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span>{Math.abs(growth).toFixed(1)}% from last month</span>
      </div>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "member_joined":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "payment_received":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isPending || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening
            at your gym today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {user?.role}
          </Badge>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {user?.role === "ADMIN" && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
                {formatGrowth(stats.memberGrowth)}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Members
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeMembers}</div>
                <div className="flex items-center justify-between mt-2">
                  <Progress
                    value={(stats.activeMembers / stats.totalMembers) * 100}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground ml-2">
                    {Math.round(
                      (stats.activeMembers / stats.totalMembers) * 100
                    )}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.monthlyRevenue)}
                </div>
                {formatGrowth(stats.revenueGrowth)}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All-time earnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Member Status Breakdown */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">
                  Active
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {stats.membershipStatusBreakdown.active}
                </div>
                <p className="text-xs text-green-700">
                  Members with active subscriptions
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">
                  Expired
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">
                  {stats.membershipStatusBreakdown.expired}
                </div>
                <p className="text-xs text-yellow-700">
                  Members with expired subscriptions
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">
                  Suspended
                </CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">
                  {stats.membershipStatusBreakdown.suspended}
                </div>
                <p className="text-xs text-red-700">
                  Suspended member accounts
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">
                  Inactive
                </CardTitle>
                <UserMinus className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.membershipStatusBreakdown.inactive}
                </div>
                <p className="text-xs text-gray-700">
                  Members without subscriptions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alert Cards */}
          {(stats.pendingPayments > 0 || stats.failedPayments > 0) && (
            <div className="grid gap-4 md:grid-cols-2">
              {stats.pendingPayments > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-800">
                      Pending Payments
                    </CardTitle>
                    <Clock className="h-4 w-4 text-amber-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-900">
                      {stats.pendingPayments}
                    </div>
                    <p className="text-xs text-amber-700">
                      Payments awaiting processing
                    </p>
                  </CardContent>
                </Card>
              )}

              {stats.failedPayments > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-800">
                      Failed Payments
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-900">
                      {stats.failedPayments}
                    </div>
                    <p className="text-xs text-red-700">
                      Payments that failed processing
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Quick Actions */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and shortcuts for gym management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <Link href="/dashboard/members/new">
                      <Button
                        className="w-full justify-start h-16"
                        variant="outline"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Plus className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Add Member</div>
                            <div className="text-xs text-muted-foreground">
                              Register new gym member
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/dashboard/payments/new">
                      <Button
                        className="w-full justify-start h-16"
                        variant="outline"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Record Payment</div>
                            <div className="text-xs text-muted-foreground">
                              Process member payment
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/dashboard/membership-plans">
                      <Button
                        className="w-full justify-start h-16"
                        variant="outline"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Membership Plans</div>
                            <div className="text-xs text-muted-foreground">
                              Manage subscription plans
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/dashboard/attendance">
                      <Button
                        className="w-full justify-start h-16"
                        variant="outline"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">View Attendance</div>
                            <div className="text-xs text-muted-foreground">
                              Check member visits
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Upcoming Renewals */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Renewals</CardTitle>
                    <CardDescription>
                      Members with upcoming membership renewals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.upcomingRenewals.length > 0 ? (
                        stats.upcomingRenewals.map((renewal) => (
                          <div
                            key={renewal.id}
                            className="flex items-center space-x-4"
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {renewal.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {renewal.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {renewal.plan} • {renewal.daysRemaining} days
                                left
                              </p>
                            </div>
                            <div className="font-medium">
                              {formatCurrency(renewal.amount)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No upcoming renewals in the next 30 days
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest member registrations and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivities.length > 0 ? (
                      stats.recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.member}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.description}
                            </p>
                          </div>
                          <div className="text-right">
                            {activity.amount && (
                              <div className="font-medium text-green-600">
                                {formatCurrency(activity.amount)}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {formatDate(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Statistics</CardTitle>
                    <CardDescription>
                      Overview of payment processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Completed
                      </span>
                      <span className="font-medium text-green-600">
                        {stats.paymentStats.totalCompleted}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pending
                      </span>
                      <span className="font-medium text-yellow-600">
                        {stats.paymentStats.totalPending}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Failed
                      </span>
                      <span className="font-medium text-red-600">
                        {stats.paymentStats.totalFailed}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Refunded
                      </span>
                      <span className="font-medium text-gray-600">
                        {stats.paymentStats.totalRefunded}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Member Distribution</CardTitle>
                    <CardDescription>
                      Breakdown by membership status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Active
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={
                              (stats.membershipStatusBreakdown.active /
                                stats.totalMembers) *
                              100
                            }
                            className="w-20"
                          />
                          <span className="text-sm font-medium">
                            {stats.membershipStatusBreakdown.active}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Expired
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={
                              (stats.membershipStatusBreakdown.expired /
                                stats.totalMembers) *
                              100
                            }
                            className="w-20"
                          />
                          <span className="text-sm font-medium">
                            {stats.membershipStatusBreakdown.expired}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Inactive
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={
                              (stats.membershipStatusBreakdown.inactive /
                                stats.totalMembers) *
                              100
                            }
                            className="w-20"
                          />
                          <span className="text-sm font-medium">
                            {stats.membershipStatusBreakdown.inactive}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Suspended
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={
                              (stats.membershipStatusBreakdown.suspended /
                                stats.totalMembers) *
                              100
                            }
                            className="w-20"
                          />
                          <span className="text-sm font-medium">
                            {stats.membershipStatusBreakdown.suspended}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cache Performance Widget */}
                <CacheStatus />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Member Dashboard */}
      {user?.role === "MEMBER" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Gym Dashboard</CardTitle>
              <CardDescription>
                Track your membership and gym activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Member dashboard features coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
