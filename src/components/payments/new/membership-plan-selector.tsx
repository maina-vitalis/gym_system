"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectedPlanDisplay } from "./selected-plan-display";
import { MembershipPlan } from "./types";

interface MembershipPlanSelectorProps {
  membershipPlans: MembershipPlan[];
  selectedPlanId?: string;
  selectedPlan: MembershipPlan | null;
  onPlanChange: (planId: string | undefined) => void;
  formatCurrency: (amount: number) => string;
}

export function MembershipPlanSelector({
  membershipPlans,
  selectedPlanId,
  selectedPlan,
  onPlanChange,
  formatCurrency,
}: MembershipPlanSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="membershipPlanId">
        Membership Plan {selectedPlan && "(Selected)"}
      </Label>
      <Select
        value={selectedPlanId || ""}
        onValueChange={(value) => onPlanChange(value || undefined)}
      >
        <SelectTrigger
          className={`${
            selectedPlan ? "border-green-300 bg-green-50" : ""
          } w-full`}
        >
          <SelectValue placeholder="Select a membership plan" />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2 text-xs text-muted-foreground border-b">
            Choose a plan to auto-fill amount and description
          </div>
          {membershipPlans.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No membership plans available
            </div>
          ) : (
            membershipPlans.map((plan: MembershipPlan) => (
              <SelectItem key={plan.id} value={plan.id} className="p-3">
                <div className="flex gap-1 w-full min-w-0">
                  <div
                    className="font-medium truncate max-w-[250px]"
                    title={plan.name}
                  >
                    {plan.name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      {formatCurrency(plan.price)}
                    </span>
                    <span>•</span>
                    <span>{plan.duration} days</span>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <SelectedPlanDisplay
          selectedPlan={selectedPlan}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}
