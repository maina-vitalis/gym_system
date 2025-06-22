"use client";

import {
  useCreateMembershipPlan,
  useDeleteMembershipPlan,
  useMembershipPlans,
  useToggleMembershipPlanStatus,
  useUpdateMembershipPlan,
} from "@/hooks/use-membership-plans";
import { useState } from "react";
import { EmptyState } from "./empty-state";
import { LoadingSkeleton } from "./loading-skeleton";
import { MembershipPlansPageHeader } from "./page-header";
import { PlanCard } from "./plan-card";
import { PlanFilters } from "./plan-filters";
import { PlanForm } from "./plan-form";
import { MembershipPlan, MembershipPlanFormData } from "./types";

export function MembershipPlansComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const { data: membershipPlans, isLoading } = useMembershipPlans(showInactive);
  const createMutation = useCreateMembershipPlan();
  const updateMutation = useUpdateMembershipPlan();
  const deleteMutation = useDeleteMembershipPlan();
  const toggleStatusMutation = useToggleMembershipPlanStatus();

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

  const handleCreateOrEdit = async (data: MembershipPlanFormData) => {
    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          id: editingPlan.id,
          data: data,
        });
        setEditingPlan(null);
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsCreateDialogOpen(false);
    } catch {
      // Error handling is done in the hooks
    }
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
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

  const handleCreateNew = () => {
    setEditingPlan(null);
    setIsCreateDialogOpen(true);
  };

  const handleCloseForm = () => {
    setIsCreateDialogOpen(false);
    setEditingPlan(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <MembershipPlansPageHeader onCreateNew={handleCreateNew} />

      {/* Search and Filters */}
      <PlanFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
      />

      {/* Plans Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredPlans.length === 0 ? (
        <EmptyState searchQuery={searchQuery} onCreateNew={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}

      {/* Plan Form Dialog */}
      <PlanForm
        isOpen={isCreateDialogOpen}
        onClose={handleCloseForm}
        editingPlan={editingPlan}
        onSubmit={handleCreateOrEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
