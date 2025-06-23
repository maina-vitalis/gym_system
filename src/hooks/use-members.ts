import { MemberFormData, UpdateMemberFormData } from "@/lib/validations/member";
import { Member } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (filters: Record<string, string | number>) =>
    [...memberKeys.lists(), filters] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};

// Get all members
export function useMembers() {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: async (): Promise<Member[]> => {
      const response = await fetch(`/api/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    },
  });
}

// Get single member
export function useMember(id: string) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: async (): Promise<Member> => {
      const response = await fetch(`/api/members/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        throw new Error("Member not found");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data) {
        throw new Error("Member not found");
      }
      return data.data;
    },
    enabled: !!id,
  });
}

// Create member mutation
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MemberFormData): Promise<Member> => {
      // Transform the form data to match the API schema
      const apiData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber?.trim() || null,
        ageRange: data.ageRange || null,
        gender: data.gender || null,
        address: data.address?.trim() || null,
        emergencyContactName: data.emergencyContactName?.trim() || null,
        emergencyContactPhone: data.emergencyContactPhone?.trim() || null,
        healthConditions: data.healthConditions?.trim() || null,
        fitnessGoals: data.fitnessGoals?.trim() || null,
      };

      const response = await fetch(`/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      return responseData.data;
    },
    onSuccess: (newMember) => {
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });

      // Add the new member to cache
      queryClient.setQueryData(memberKeys.detail(newMember.id), newMember);

      toast.success("Member created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create member:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create member. Please try again.",
      );
    },
  });
}

// Update member mutation
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMemberFormData;
    }): Promise<Member> => {
      // Transform the form data to match the API schema
      const apiData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string | null;
        ageRange?: string | null;
        gender?: string | null;
        address?: string | null;
        emergencyContactName?: string | null;
        emergencyContactPhone?: string | null;
        healthConditions?: string | null;
        fitnessGoals?: string | null;
        membershipStatus?: string;
      } = {};

      // Handle user data updates
      if (data.firstName) apiData.firstName = data.firstName.trim();
      if (data.lastName) apiData.lastName = data.lastName.trim();
      if (data.email) apiData.email = data.email.trim().toLowerCase();
      if (data.phoneNumber !== undefined)
        apiData.phoneNumber = data.phoneNumber?.trim() || null;

      // Handle member data updates
      if (data.ageRange !== undefined) apiData.ageRange = data.ageRange || null;
      if (data.gender !== undefined) apiData.gender = data.gender || null;
      if (data.address !== undefined)
        apiData.address = data.address?.trim() || null;
      if (data.emergencyContactName !== undefined) {
        apiData.emergencyContactName =
          data.emergencyContactName?.trim() || null;
      }
      if (data.emergencyContactPhone !== undefined) {
        apiData.emergencyContactPhone =
          data.emergencyContactPhone?.trim() || null;
      }
      if (data.healthConditions !== undefined) {
        apiData.healthConditions = data.healthConditions?.trim() || null;
      }
      if (data.fitnessGoals !== undefined) {
        apiData.fitnessGoals = data.fitnessGoals?.trim() || null;
      }
      if (data.membershipStatus) {
        apiData.membershipStatus = data.membershipStatus;
      }

      const response = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      return responseData.data;
    },
    onSuccess: (updatedMember) => {
      // Update specific member in cache
      queryClient.setQueryData(
        memberKeys.detail(updatedMember.id),
        updatedMember,
      );

      // Invalidate members list to reflect changes
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });

      toast.success("Member updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update member:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update member. Please try again.",
      );
    },
  });
}

// Delete member mutation
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return id;
    },
    onSuccess: (deletedId) => {
      // Remove member from cache
      queryClient.removeQueries({ queryKey: memberKeys.detail(deletedId) });

      // Update members list cache
      queryClient.setQueryData(
        memberKeys.lists(),
        (oldData: Member[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((member) => member.id !== deletedId);
        },
      );

      toast.success("Member deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete member:", error);
      toast.error("Failed to delete member. Please try again.");
    },
  });
}

// Suspend/unsuspend member mutation
export function useSuspendMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      suspend,
      reason,
    }: {
      id: string;
      suspend: boolean;
      reason?: string;
    }): Promise<void> => {
      const response = await fetch(`/api/members/${id}/suspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: suspend ? "suspend" : "unsuspend",
          reason:
            reason || (suspend ? "Suspended by admin" : "Unsuspended by admin"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onSuccess: () => {
      // Invalidate members list to reflect status change
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success("Member status updated successfully");
    },
    onError: (error) => {
      console.error("Failed to suspend/unsuspend member:", error);
      toast.error("Failed to update member status. Please try again.");
    },
  });
}

// Optimistic update helper for member status changes
export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }): Promise<Member> => {
      const apiData = { membershipStatus: status };

      const response = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      return responseData.data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: memberKeys.detail(id) });

      // Snapshot previous value
      const previousMember = queryClient.getQueryData(memberKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(
        memberKeys.detail(id),
        (old: Member | undefined) => {
          if (!old) return old;
          return { ...old, membershipStatus: status, updatedAt: new Date() };
        },
      );

      return { previousMember };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMember) {
        queryClient.setQueryData(
          memberKeys.detail(variables.id),
          context.previousMember,
        );
      }
      toast.error("Failed to update member status");
    },
    onSuccess: () => {
      // Invalidate members list to reflect status change
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success("Member status updated successfully");
    },
  });
}
