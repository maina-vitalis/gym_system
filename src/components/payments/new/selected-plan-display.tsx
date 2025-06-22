"use client";

import { CheckCircle } from "lucide-react";
import { MembershipPlan } from "./types";

interface SelectedPlanDisplayProps {
  selectedPlan: MembershipPlan;
  formatCurrency: (amount: number) => string;
}

export function SelectedPlanDisplay({
  selectedPlan,
  formatCurrency,
}: SelectedPlanDisplayProps) {
  return (
    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-green-800 mb-2 truncate"
            title={selectedPlan.name}
          >
            {selectedPlan.name}
          </div>
          <div className="text-sm text-green-700 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-green-600">Duration:</span>
                <span className="font-medium">
                  {selectedPlan.duration} days
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-green-600">Price:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(selectedPlan.price)}
                </span>
              </div>
            </div>
            {selectedPlan.description && (
              <div className="text-xs text-green-600 p-2 bg-green-100 rounded">
                <div className="font-medium mb-1">Description:</div>
                <div
                  className="text-xs leading-relaxed overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    maxHeight: "2.4em",
                  }}
                  title={selectedPlan.description}
                >
                  {selectedPlan.description}
                </div>
              </div>
            )}
            {selectedPlan.features && selectedPlan.features.length > 0 && (
              <div>
                <div className="text-xs font-medium text-green-800 mb-1">
                  Features:
                </div>
                <div className="flex flex-wrap gap-1">
                  {(selectedPlan.features as string[])
                    .slice(0, 3)
                    .map((feature: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 max-w-[120px] truncate"
                        title={feature}
                      >
                        {feature}
                      </span>
                    ))}
                  {selectedPlan.features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      +{selectedPlan.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
