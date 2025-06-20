"use client";

import { AuthUser } from "@/lib/auth-client";

interface DashboardHeaderProps {
  user: AuthUser | undefined;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="items-center justify-between">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <p className="text-muted-foreground hidden sm:block">
        Welcome back, {user?.firstName}! Here are Tumaini fitness stats.
      </p>
    </div>
  );
}
