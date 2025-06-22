"use client";

import { Button } from "@/components/ui/button";
import { DollarSign, Loader2, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { MemberData } from "./types";

interface PaymentFormActionsProps {
  isSubmitting: boolean;
  selectedMember: MemberData | null;
  isUsingMpesa: boolean;
  watchedAmount: number;
  onSendPush: () => void;
}

export function PaymentFormActions({
  isSubmitting,
  selectedMember,
  isUsingMpesa,
  watchedAmount,
  onSendPush,
}: PaymentFormActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-2 pt-4">
      <Button
        type="submit"
        disabled={isSubmitting || !selectedMember || isUsingMpesa}
        className="flex-1 min-w-0"
        title={
          isUsingMpesa
            ? "M-Pesa payments are recorded automatically"
            : !selectedMember
            ? "Select a member first"
            : undefined
        }
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
            <span className="truncate">Recording...</span>
          </>
        ) : (
          <>
            <DollarSign className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Record Payment</span>
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onSendPush}
        disabled={!selectedMember || watchedAmount <= 0}
        className="min-w-0 sm:px-3"
        title={
          !selectedMember || watchedAmount <= 0
            ? "Select member and enter amount first"
            : "Send M-Pesa STK Push to customer's phone"
        }
      >
        <Smartphone className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate sm:hidden lg:inline">Send M-Pesa</span>
        <span className="hidden sm:inline lg:hidden">M-Pesa</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/dashboard/payments")}
        className="min-w-0"
      >
        <span className="truncate">Cancel</span>
      </Button>
    </div>
  );
}
