"use client";

import { Button } from "@/components/ui/button";
import { MembershipPlan } from "./types";

interface QuickAmountPresetsProps {
  membershipPlans: MembershipPlan[];
  selectedPlan: MembershipPlan | null;
  currentAmount: number;
  onPlanSelect: (planId: string, amount: number, description: string) => void;
  onAmountSelect: (amount: number) => void;
  onClearSelection: () => void;
  formatCurrency: (amount: number) => string;
}

export function QuickAmountPresets({
  membershipPlans,
  selectedPlan,
  currentAmount,
  onPlanSelect,
  onAmountSelect,
  onClearSelection,
  formatCurrency,
}: QuickAmountPresetsProps) {
  const standardAmounts = [1000, 2000, 5000, 10000];

  return (
    <div className="pt-4 border-t space-y-3">
      <h4 className="font-medium">Quick Amount Presets</h4>

      {/* Membership Plan Prices */}
      {membershipPlans.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Membership Plans:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {membershipPlans.slice(0, 4).map((plan: MembershipPlan) => (
              <Button
                key={plan.id}
                type="button"
                variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onPlanSelect(
                    plan.id,
                    plan.price,
                    `${plan.name} - ${plan.duration} days membership`
                  )
                }
                className={`${
                  selectedPlan?.id === plan.id
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                } h-auto p-3 flex flex-col items-start gap-1 min-h-[60px]`}
              >
                <div className="w-full text-left">
                  <div
                    className="text-xs font-normal truncate max-w-full"
                    title={plan.name}
                  >
                    {plan.name}
                  </div>
                  <div className="font-medium text-sm">
                    {formatCurrency(plan.price)}
                  </div>
                  <div className="text-xs opacity-75">{plan.duration} days</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Standard Presets */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Standard Amounts:</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {standardAmounts.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAmountSelect(amount)}
              className="h-auto p-3 flex flex-col items-center gap-1 min-h-[50px]"
            >
              <span className="font-medium text-sm">
                {formatCurrency(amount)}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Selection */}
      {(selectedPlan || currentAmount > 0) && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
}
