"use client";

import { PageHeader, PaymentForm } from "@/components/payments/new";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewPaymentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader />

      <div className="mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter payment information or send M-Pesa request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PaymentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
