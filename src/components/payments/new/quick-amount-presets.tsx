"use client";

import { Button } from "@/components/ui/button";
import { MembershipPlan } from "./types";

interface QuickAmountPresetsProps {
  membershipPlans: MembershipPlan[];
  selectedPlan: MembershipPlan | null;
  currentAmount: number;
  onPlanSelect: (planId: string, amount: number, description: string) => void;
  onClearSelection: () => void;
  formatCurrency: (amount: number) => string;
}

export function QuickAmountPresets({
  membershipPlans,
  selectedPlan,
  currentAmount,
  onPlanSelect,
  onClearSelection,
  formatCurrency,
}: QuickAmountPresetsProps) {
  return (
    <div className="space-y-3 border-t pt-4">
      <h4 className="font-medium">Quick Amount Presets</h4>

      {/* Membership Plan Prices */}
      {membershipPlans.length > 0 && (
        <div className="space-y-2">
          <div className="text-muted-foreground text-sm">Membership Plans:</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                    `${plan.name} - ${plan.duration} days membership`,
                  )
                }
                className={`${
                  selectedPlan?.id === plan.id
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                } flex h-auto min-h-[60px] flex-col items-start gap-1 p-3`}
              >
                <div className="w-full text-left">
                  <div
                    className="max-w-full truncate text-xs font-normal"
                    title={plan.name}
                  >
                    {plan.name}
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(plan.price)}
                  </div>
                  <div className="text-xs opacity-75">{plan.duration} days</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

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
