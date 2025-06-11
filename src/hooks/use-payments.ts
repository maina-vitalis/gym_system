import {
  CreatePaymentFormData,
  PaymentFilterFormData,
  ReportFormData,
} from "@/lib/validations/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch payments with filtering
export function usePayments(filters?: PaymentFilterFormData) {
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.memberId) params.append("memberId", filters.memberId);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.method) params.append("method", filters.method);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());

      const response = await fetch(`/api/payments?${params}`);
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });
}

// Create payment mutation
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentFormData) => {
      const response = await fetch(`/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully");

      // Invalidate payment queries
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["paymentReports"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record payment");
    },
  });
}

// Generate payment reports
export function usePaymentReport(params: ReportFormData) {
  return useQuery({
    queryKey: ["paymentReports", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("type", params.type);
      if (params.memberId) searchParams.append("memberId", params.memberId);
      if (params.year) searchParams.append("year", params.year.toString());
      if (params.month) searchParams.append("month", params.month.toString());

      const response = await fetch(`/api/payments/reports?${searchParams}`);
      if (!response.ok) throw new Error("Failed to generate report");
      return response.json();
    },
    enabled: !!params.type, // Only fetch when type is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Fetch membership plans for payment forms
export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membershipPlans"],
    queryFn: async () => {
      const response = await fetch(`/api/membership-plans`);
      if (!response.ok) throw new Error("Failed to fetch membership plans");
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes (plans don't change often)
  });
}

// Send push notification to customer
export function useSendPushNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      memberId: string;
      amount: number;
      description?: string;
      phoneNumber: string;
      membershipPlanId?: string;
    }) => {
      const response = await fetch(`/api/payments/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send push notification");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        `M-Pesa STK Push sent to ${data.data.phoneNumber}. Customer will receive payment prompt.`
      );

      // Invalidate payment queries in case the payment comes through quickly
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send M-Pesa STK Push");
    },
  });
}
