"use client";

import { CacheStatus } from "@/components/cache-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardStats } from "@/types";

interface AnalyticsCardsProps {
  stats: DashboardStats;
}

export function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
          <CardDescription>Overview of payment processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completed</span>
            <span className="font-medium text-green-600">
              {stats.paymentStats.totalCompleted}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="font-medium text-yellow-600">
              {stats.paymentStats.totalPending}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Failed</span>
            <span className="font-medium text-red-600">
              {stats.paymentStats.totalFailed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Refunded</span>
            <span className="font-medium text-gray-600">
              {stats.paymentStats.totalRefunded}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Member Distribution</CardTitle>
          <CardDescription>Breakdown by membership status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
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
              <span className="text-sm text-muted-foreground">Expired</span>
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
              <span className="text-sm text-muted-foreground">Inactive</span>
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
              <span className="text-sm text-muted-foreground">Suspended</span>
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
  );
}
