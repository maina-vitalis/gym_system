"use client";

import { Badge } from "@/components/ui/badge";
import { Payment } from "./types";

interface StatusBadgeProps {
  status: Payment["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status}
    </Badge>
  );
}

interface MethodBadgeProps {
  method: Payment["method"];
}

export function MethodBadge({ method }: MethodBadgeProps) {
  const variants = {
    CASH: "bg-blue-100 text-blue-800 border-blue-200",
    CARD: "bg-purple-100 text-purple-800 border-purple-200",
    BANK_TRANSFER: "bg-indigo-100 text-indigo-800 border-indigo-200",
    MOBILE_MONEY: "bg-green-100 text-green-800 border-green-200",
  };

  const labels = {
    CASH: "Cash",
    CARD: "Card",
    BANK_TRANSFER: "Bank Transfer",
    MOBILE_MONEY: "M-Pesa",
  };

  return (
    <Badge className={variants[method]} variant="outline">
      {labels[method]}
    </Badge>
  );
}
