"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MemberDashboard() {
  return (
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
  );
}
