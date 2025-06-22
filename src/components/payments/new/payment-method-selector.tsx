"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePaymentFormData } from "@/lib/validations/payment";

interface PaymentMethodSelectorProps {
  value: CreatePaymentFormData["method"];
  onValueChange: (value: CreatePaymentFormData["method"]) => void;
  error?: string;
}

export function PaymentMethodSelector({
  value,
  onValueChange,
  error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="method">Payment Method</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CASH">Cash</SelectItem>
          <SelectItem value="CARD">Card</SelectItem>
          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
