"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PageHeader() {
  return (
    <div className="space-y-2">
      <Link href="/dashboard/payments">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Record Payment</h1>
        <p className="text-muted-foreground">
          Record a new payment or send M-Pesa STK Push
        </p>
      </div>
    </div>
  );
}
