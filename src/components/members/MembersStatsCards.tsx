"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberWithSubscription } from "@/types";
import { Calendar, Users } from "lucide-react";

interface MembersStatsCardsProps {
  members: MemberWithSubscription[];
}

export default function MembersStatsCards({ members }: MembersStatsCardsProps) {
  const activeMembers = members.filter(
    (m) => m.membershipStatus === "ACTIVE"
  ).length;
  const expiredMembers = members.filter(
    (m) => m.membershipStatus === "EXPIRED"
  ).length;

  const newThisMonth = members.filter((m) => {
    const joinDate = new Date(m.joinDate);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return (
      joinDate.getMonth() === currentMonth &&
      joinDate.getFullYear() === currentYear
    );
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{members.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeMembers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newThisMonth}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiredMembers}</div>
        </CardContent>
      </Card>
    </div>
  );
}
