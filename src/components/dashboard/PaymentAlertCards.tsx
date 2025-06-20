"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types";
import { AlertTriangle, Clock } from "lucide-react";

interface PaymentAlertCardsProps {
  stats: DashboardStats;
}

export function PaymentAlertCards({ stats }: PaymentAlertCardsProps) {
  // Don't render if no alerts
  if (stats.pendingPayments === 0 && stats.failedPayments === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.pendingPayments > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {stats.pendingPayments}
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Payments awaiting processing
            </p>
          </CardContent>
        </Card>
      )}

      {stats.failedPayments > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
              Failed Payments
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {stats.failedPayments}
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              Payments that failed processing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
