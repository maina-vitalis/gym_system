"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface PaymentStatusIndicatorProps {
  isUsingMpesa: boolean;
}

export function PaymentStatusIndicator({
  isUsingMpesa,
}: PaymentStatusIndicatorProps) {
  if (!isUsingMpesa) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-green-800">
            M-Pesa STK Push Sent Successfully
          </div>
          <div className="text-sm text-green-700 mt-1">
            Payment request delivered to customer&apos;s phone. Check the
            payments table for real-time status updates.
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-700">Next steps:</span>
          <Link
            href="/dashboard/payments"
            className="text-green-600 hover:text-green-800 underline font-medium"
          >
            View Payments →
          </Link>
        </div>
      </div>
    </div>
  );
}
