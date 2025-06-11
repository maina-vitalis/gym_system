"use client";

import { SubscriptionTest } from "@/components/subscription-test";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TestTube } from "lucide-react";
import Link from "next/link";

export default function TestSubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TestTube className="h-8 w-8 text-primary" />
            Subscription Logic Testing
          </h1>
          <p className="text-muted-foreground">
            Test and verify subscription extension logic with different
            scenarios
          </p>
        </div>
      </div>

      {/* Test Information */}
      <Card>
        <CardHeader>
          <CardTitle>How Subscription Extension Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">✅ New Member</h3>
              <p className="text-sm text-muted-foreground">
                No active subscription → Starts immediately, ends after plan
                duration
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">
                🔄 Active Member
              </h3>
              <p className="text-sm text-muted-foreground">
                Has active subscription → Extends from current end date, adds
                new duration
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-orange-700 mb-2">
                🔄 Expired Member
              </h3>
              <p className="text-sm text-muted-foreground">
                Subscription expired → Starts immediately, ends after new plan
                duration
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              💡 Professional Logic
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Active subscriptions are extended, not replaced</li>
              <li>
                • No subscription time is lost - extensions start from current
                end date
              </li>
              <li>• Expired subscriptions start fresh from current date</li>
              <li>• All subscription changes are logged and tracked</li>
              <li>
                • Member status is automatically updated based on subscription
                state
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Test Component */}
      <SubscriptionTest />

      {/* API Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Real API Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To test with real data, use the payment recording page:
            </p>
            <div className="flex gap-2">
              <Link href="/dashboard/payments/new">
                <Button>Test Real Payment → Subscription Logic</Button>
              </Link>
              <Link href="/dashboard/members">
                <Button variant="outline">
                  View Members → Check Days Remaining
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
