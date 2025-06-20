"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/types";
import { Clock, DollarSign, Users } from "lucide-react";

interface RecentActivityCardProps {
  stats: DashboardStats;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

export function RecentActivityCard({
  stats,
  formatCurrency,
  formatDate,
}: RecentActivityCardProps) {
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

  return (
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
              <div key={activity.id} className="flex items-center space-x-4">
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
  );
}
