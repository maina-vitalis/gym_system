"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { forwardRef } from "react";
import { MembershipPlan } from "./types";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  selectedPlan: MembershipPlan | null;
  error?: string;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ value, onChange, selectedPlan, error }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount (KES) <span className="text-red-500">*</span>
          {selectedPlan && (
            <span className="ml-2 text-sm font-normal text-green-600">
              (Auto-filled from selected plan)
            </span>
          )}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={value || ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className={selectedPlan ? "border-green-300 bg-green-50" : ""}
          />
          {selectedPlan && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>
        {selectedPlan && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Amount automatically set from {selectedPlan.name}
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

AmountInput.displayName = "AmountInput";
