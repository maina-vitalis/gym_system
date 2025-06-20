"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, FileText, Plus } from "lucide-react";
import Link from "next/link";

export function QuickActionsCard() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts for gym management
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/members/new">
          <Button className="w-full justify-start h-16" variant="outline">
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
          <Button className="w-full justify-start h-16" variant="outline">
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
          <Button className="w-full justify-start h-16" variant="outline">
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
      </CardContent>
    </Card>
  );
}
