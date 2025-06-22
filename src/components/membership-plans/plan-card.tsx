"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration } from "@/lib/validations/membership-plan";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { PlanCardProps } from "./types";

export function PlanCard({
  plan,
  onEdit,
  onDelete,
  onToggleStatus,
  formatCurrency,
}: PlanCardProps) {
  return (
    <Card className={!plan.isActive ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <Badge variant={plan.isActive ? "default" : "secondary"}>
              {plan.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(plan)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(plan.id, plan.isActive)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {plan.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(plan.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {plan.description || "No description"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price and Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="h-5 w-5 text-green-600" />
            {formatCurrency(plan.price)}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDuration(plan.duration)}
          </div>
        </div>

        {/* Features */}
        {plan.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features:</h4>
            <div className="flex flex-wrap gap-1">
              {plan.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        {plan.stats && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-3 w-3 text-blue-600" />
              <span className="font-medium">{plan.stats.totalMembers}</span>
              <span className="text-muted-foreground">members</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="font-medium">
                {formatCurrency(plan.stats.revenueLastMonth)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
