"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/types";

interface UpcomingRenewalsCardProps {
  stats: DashboardStats;
  formatCurrency: (amount: number) => string;
}

export function UpcomingRenewalsCard({
  stats,
  formatCurrency,
}: UpcomingRenewalsCardProps) {
  return (
    <Card className="col-span-4 md:col-span-3 w-full">
      <CardHeader>
        <CardTitle>Upcoming Renewals</CardTitle>
        <CardDescription>
          Members with upcoming membership renewals
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="space-y-4">
          {stats.upcomingRenewals.length > 0 ? (
            stats.upcomingRenewals.map((renewal) => (
              <div key={renewal.id} className="flex items-center space-x-4">
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
                    {renewal.plan} • {renewal.daysRemaining} days left
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
  );
}
