import { API_BASE_URL } from "@/constants/constants";
import {
  MembershipPlanFormData,
  UpdateMembershipPlanFormData,
} from "@/lib/validations/membership-plan";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Use relative URLs for API calls - works in both development and production

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalMembers: number;
    activeMembers?: number;
    totalPayments: number;
    revenueLastMonth: number;
    paymentsLastMonth?: number;
  };
}

// Fetch all membership plans
export function useMembershipPlans(includeInactive = false) {
  return useQuery({
    queryKey: ["membershipPlans", includeInactive],
    queryFn: async (): Promise<{ data: MembershipPlan[] }> => {
      const params = new URLSearchParams();
      if (includeInactive) {
        params.append("includeInactive", "true");
      }

      const response = await fetch(`/api/membership-plans?${params}`);
      if (!response.ok) throw new Error("Failed to fetch membership plans");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Fetch a single membership plan
export function useMembershipPlan(id: string) {
  return useQuery({
    queryKey: ["membershipPlan", id],
    queryFn: async (): Promise<{ data: MembershipPlan }> => {
      const response = await fetch(
        `${API_BASE_URL}/api/membership-plans/${id}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Membership plan not found");
        }
        throw new Error("Failed to fetch membership plan");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Create a new membership plan
export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: MembershipPlanFormData
    ): Promise<{ data: MembershipPlan }> => {
      const response = await fetch(`/api/membership-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create membership plan");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Membership plan "${data.data.name}" created successfully`);

      // Invalidate membership plans queries
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create membership plan");
    },
  });
}

// Update a membership plan
export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMembershipPlanFormData;
    }): Promise<{ data: MembershipPlan }> => {
      const response = await fetch(`/api/membership-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update membership plan");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast.success(`Membership plan "${data.data.name}" updated successfully`);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
      queryClient.invalidateQueries({
        queryKey: ["membershipPlan", variables.id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update membership plan");
    },
  });
}

// Delete a membership plan
export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/membership-plans/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete membership plan");
      }
    },
    onSuccess: (_, id) => {
      toast.success("Membership plan deleted successfully");

      // Invalidate and remove queries
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
      queryClient.removeQueries({ queryKey: ["membershipPlan", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete membership plan");
    },
  });
}

// Toggle membership plan active status
export function useToggleMembershipPlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }): Promise<{ data: MembershipPlan }> => {
      const response = await fetch(`/api/membership-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Failed to update membership plan status"
        );
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      const status = variables.isActive ? "activated" : "deactivated";
      toast.success(
        `Membership plan "${data.data.name}" ${status} successfully`
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
      queryClient.invalidateQueries({
        queryKey: ["membershipPlan", variables.id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update membership plan status");
    },
  });
}
