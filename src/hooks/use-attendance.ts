import { API_BASE_URL } from "@/constants/constants";
import {
  CheckInFormData,
  CheckOutFormData,
  ManualAttendanceFormData,
} from "@/lib/validations/attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

// Use relative URLs for API calls - works in both development and production

// Fetch attendance records
export function useAttendance(filters?: {
  memberId?: string;
  date?: string;
  type?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.memberId) params.append("memberId", filters.memberId);
      if (filters?.date) params.append("date", filters.date);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/attendance?${params}`);
      if (!response.ok) throw new Error("Failed to fetch attendance records");
      return response.json();
    },
  });
}

// Fetch attendance stats
export function useAttendanceStats(date?: string) {
  return useQuery({
    queryKey: ["attendanceStats", date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (date) params.append("date", date);

      const response = await fetch(`/api/attendance/stats?${params}`);
      if (!response.ok) throw new Error("Failed to fetch attendance stats");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time stats
  });
}

// Debounced member lookup hook with optimizations
export function useMemberLookup(query: string) {
  // Memoize the trimmed query to avoid unnecessary re-renders
  const trimmedQuery = useMemo(() => query.trim(), [query]);

  return useQuery({
    queryKey: ["memberLookup", trimmedQuery],
    queryFn: async () => {
      // Return empty results for short queries without hitting the server
      if (trimmedQuery.length < 2) {
        return { data: [] };
      }

      const params = new URLSearchParams();
      params.append("query", trimmedQuery);

      const response = await fetch(
        `${API_BASE_URL}/api/members/lookup?${params}`
      );
      if (!response.ok) throw new Error("Failed to lookup members");
      return response.json();
    },
    enabled: trimmedQuery.length >= 2, // Only fetch if query is at least 2 characters
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (search results don't change often)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 1, // Only retry once on failure
  });
}

// Check-in mutation
export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckInFormData) => {
      const response = await fetch(`/api/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to check in member");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "Member checked in successfully");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceStats"] });
      queryClient.invalidateQueries({ queryKey: ["memberLookup"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to check in member");
    },
  });
}

// Check-out mutation
export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckOutFormData) => {
      const response = await fetch(`/api/attendance/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to check out member");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "Member checked out successfully");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceStats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to check out member");
    },
  });
}

// Manual attendance entry mutation
export function useCreateManualAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ManualAttendanceFormData) => {
      const response = await fetch(`/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create attendance record");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Attendance record created successfully");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceStats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create attendance record");
    },
  });
}
