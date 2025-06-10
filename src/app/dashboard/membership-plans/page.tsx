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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  MembershipPlan,
  useCreateMembershipPlan,
  useDeleteMembershipPlan,
  useMembershipPlans,
  useToggleMembershipPlanStatus,
  useUpdateMembershipPlan,
} from "@/hooks/use-membership-plans";
import {
  DURATION_PRESETS,
  formatDuration,
  MembershipPlanFormData,
  membershipPlanSchema,
} from "@/lib/validations/membership-plan";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function MembershipPlansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [currentFeature, setCurrentFeature] = useState("");

  const { data: membershipPlans, isLoading } = useMembershipPlans(showInactive);
  const createMutation = useCreateMembershipPlan();
  const updateMutation = useUpdateMembershipPlan();
  const deleteMutation = useDeleteMembershipPlan();
  const toggleStatusMutation = useToggleMembershipPlanStatus();

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

  // Filter plans based on search query
  const filteredPlans =
    membershipPlans?.data?.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const handleCreateOrEdit: SubmitHandler<MembershipPlanFormData> = async (
    data
  ) => {
    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          id: editingPlan.id,
          data: data,
        });
        setEditingPlan(null);
      } else {
        await createMutation.mutateAsync(data);
        setIsCreateDialogOpen(false);
      }
      reset();
    } catch {
      // Error handling is done in the hooks
    }
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    reset({
      name: plan.name,
      description: plan.description || "",
      duration: plan.duration,
      price: plan.price,
      features: plan.features,
      isActive: plan.isActive,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this membership plan?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleStatusMutation.mutateAsync({
      id,
      isActive: !currentStatus,
    });
  };

  const addFeature = () => {
    if (
      currentFeature.trim() &&
      !watchedFeatures.includes(currentFeature.trim())
    ) {
      setValue("features", [...watchedFeatures, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setValue(
      "features",
      watchedFeatures.filter((_, i) => i !== index)
    );
  };

  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingPlan(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Membership Plans
          </h1>
          <p className="text-muted-foreground">
            Manage membership plans and pricing for your gym
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Plan
            </Button>
          </DialogTrigger>
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

            <form
              onSubmit={handleSubmit(handleCreateOrEdit)}
              className="space-y-4"
            >
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="text-sm text-red-500">
                      {errors.duration.message}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature..."
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <Button type="button" variant="outline" onClick={addFeature}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watchedFeatures.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeFeature(index)}
                    >
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <Label htmlFor="isActive">Active Plan</Label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="showInactive"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <Label htmlFor="showInactive">Show inactive</Label>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted" />
              <CardContent className="h-40 bg-muted" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
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
                      <DropdownMenuItem onClick={() => handleEdit(plan)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(plan.id, plan.isActive)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(plan.id)}
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
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
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
                      <span className="font-medium">
                        {plan.stats.totalMembers}
                      </span>
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
          ))}
        </div>
      )}

      {filteredPlans.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No membership plans found
            </h3>
            <p className="text-muted-foreground text-center">
              {searchQuery
                ? "No plans match your search criteria. Try adjusting your search."
                : "Get started by creating your first membership plan."}
            </p>
            {!searchQuery && (
              <Button
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Plan
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
