"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardStats } from "@/types";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

interface KeyMetricsCardsProps {
  stats: DashboardStats;
  formatCurrency: (amount: number) => string;
}

export function KeyMetricsCards({
  stats,
  formatCurrency,
}: KeyMetricsCardsProps) {
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          {formatGrowth(stats.memberGrowth)}
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
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
              {Math.round((stats.activeMembers / stats.totalMembers) * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
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
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">All-time earnings</p>
        </CardContent>
      </Card>
    </div>
  );
}
