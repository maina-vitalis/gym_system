"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DURATION_PRESETS,
  MembershipPlanFormData,
  membershipPlanSchema,
} from "@/lib/validations/membership-plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FeatureInput } from "./feature-input";
import { PlanFormProps } from "./types";

export function PlanForm({
  isOpen,
  onClose,
  editingPlan,
  onSubmit,
  isSubmitting,
}: PlanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MembershipPlanFormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: 0,
      features: [],
      isActive: true,
    },
  });

  const watchedFeatures = watch("features");
  const watchedIsActive = watch("isActive");

  // Reset form when editing plan changes
  useEffect(() => {
    if (editingPlan) {
      reset({
        name: editingPlan.name,
        description: editingPlan.description || "",
        duration: editingPlan.duration,
        price: editingPlan.price,
        features: editingPlan.features,
        isActive: editingPlan.isActive,
      });
    } else {
      reset({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        features: [],
        isActive: true,
      });
    }
  }, [editingPlan, reset]);

  const handleFormSubmit = async (data: MembershipPlanFormData) => {
    await onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingPlan
              ? "Edit Membership Plan"
              : "Create New Membership Plan"}
          </DialogTitle>
          <DialogDescription>
            {editingPlan
              ? "Update the details of this membership plan."
              : "Create a new membership plan with pricing and features."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Premium Monthly"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this plan includes..."
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Duration and Price */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="3650"
              placeholder="30"
              {...register("duration", { valueAsNumber: true })}
            />
            <div className="flex flex-wrap gap-1">
              {DURATION_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("duration", preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (KES) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="1000"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Features */}
          <FeatureInput
            features={watchedFeatures}
            onFeaturesChange={(features) => setValue("features", features)}
          />

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watchedIsActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active Plan</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
