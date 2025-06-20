"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types";
import { Clock, UserCheck, UserMinus, UserX } from "lucide-react";

interface MemberStatusBreakdownProps {
  stats: DashboardStats;
}

export function MemberStatusBreakdown({ stats }: MemberStatusBreakdownProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
            Active
          </CardTitle>
          <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {stats.membershipStatusBreakdown.active}
          </div>
          <p className="text-xs text-green-700 dark:text-green-300">
            Members with active subscriptions
          </p>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Expired
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {stats.membershipStatusBreakdown.expired}
          </div>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Members with expired subscriptions
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
            Suspended
          </CardTitle>
          <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            {stats.membershipStatusBreakdown.suspended}
          </div>
          <p className="text-xs text-red-700 dark:text-red-300">
            Suspended member accounts
          </p>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Inactive
          </CardTitle>
          <UserMinus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.membershipStatusBreakdown.inactive}
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Members without subscriptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
