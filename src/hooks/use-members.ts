import { apiClient } from "@/lib/api-client";
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
    queryFn: async () => {
      const response = await apiClient.getMembers();
      return response.data;
    },
  });
}

// Get single member
export function useMember(id: string) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.getMember(id);
      if (!response.data) {
        throw new Error("Member not found");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Create member mutation
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MemberFormData) => {
      const memberData: Partial<Member> = {
        user: {
          id: `temp_${Date.now()}`, // Temporary ID, will be replaced by API
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim().toLowerCase(),
          phoneNumber: data.phoneNumber?.trim() || null,
        },
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        address: data.address?.trim() || null,
        emergencyContactName: data.emergencyContactName?.trim() || null,
        emergencyContactPhone: data.emergencyContactPhone?.trim() || null,
        healthConditions: data.healthConditions?.trim() || null,
        fitnessGoals: data.fitnessGoals?.trim() || null,
      };

      const response = await apiClient.createMember(memberData);
      return response.data;
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
      toast.error("Failed to create member. Please try again.");
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
    }) => {
      // Get current member data for proper merging
      const currentMember = queryClient.getQueryData<Member>(
        memberKeys.detail(id)
      );

      const updateData: Partial<Member> = {};

      // Handle user data updates - merge with existing user data
      if (
        data.firstName ||
        data.lastName ||
        data.email ||
        data.phoneNumber !== undefined
      ) {
        updateData.user = {
          ...currentMember?.user,
          id: currentMember?.user.id || "",
          firstName:
            data.firstName?.trim() || currentMember?.user.firstName || "",
          lastName: data.lastName?.trim() || currentMember?.user.lastName || "",
          email:
            data.email?.trim().toLowerCase() || currentMember?.user.email || "",
          phoneNumber: data.phoneNumber?.trim() || null,
        };
      }

      // Handle member data updates
      if (data.dateOfBirth !== undefined) {
        updateData.dateOfBirth = data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : null;
      }
      if (data.gender !== undefined) updateData.gender = data.gender || null;
      if (data.address !== undefined)
        updateData.address = data.address?.trim() || null;
      if (data.emergencyContactName !== undefined) {
        updateData.emergencyContactName =
          data.emergencyContactName?.trim() || null;
      }
      if (data.emergencyContactPhone !== undefined) {
        updateData.emergencyContactPhone =
          data.emergencyContactPhone?.trim() || null;
      }
      if (data.healthConditions !== undefined) {
        updateData.healthConditions = data.healthConditions?.trim() || null;
      }
      if (data.fitnessGoals !== undefined) {
        updateData.fitnessGoals = data.fitnessGoals?.trim() || null;
      }
      if (data.membershipStatus) {
        updateData.membershipStatus = data.membershipStatus;
      }

      const response = await apiClient.updateMember(id, updateData);
      return response.data;
    },
    onSuccess: (updatedMember) => {
      // Update specific member in cache
      queryClient.setQueryData(
        memberKeys.detail(updatedMember.id),
        updatedMember
      );

      // Invalidate members list to reflect changes
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });

      toast.success("Member updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update member:", error);
      toast.error("Failed to update member. Please try again.");
    },
  });
}

// Delete member mutation
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.deleteMember(id);
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
        }
      );

      toast.success("Member deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete member:", error);
      toast.error("Failed to delete member. Please try again.");
    },
  });
}

// Optimistic update helper for member status changes
export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.updateMember(id, {
        membershipStatus: status,
      });
      return response.data;
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
        }
      );

      return { previousMember };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMember) {
        queryClient.setQueryData(
          memberKeys.detail(variables.id),
          context.previousMember
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
