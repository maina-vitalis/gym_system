import { DashboardStats } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

// Get dashboard statistics
export function useDashboardStats(enabled: boolean = true) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch(`/api/dashboard/stats`, {
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
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: enabled ? 10 * 60 * 1000 : false, // Only refetch if enabled
  });
}
