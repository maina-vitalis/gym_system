import { z } from "zod";

// Payment creation schema for manual payments (excludes MOBILE_MONEY)
export const createPaymentSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER"], {
    required_error: "Payment method is required",
  }),
  description: z.string().optional(),
  membershipPlanId: z.string().optional(),
  transactionRef: z.string().optional(),
});

// Payment creation schema for system/automatic payments (includes MOBILE_MONEY)
export const createSystemPaymentSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY"], {
    required_error: "Payment method is required",
  }),
  description: z.string().optional(),
  membershipPlanId: z.string().optional(),
  transactionRef: z.string().optional(),
});

// Payment filter schema
export const paymentFilterSchema = z.object({
  memberId: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

// Report generation schema
export const reportSchema = z.object({
  type: z.enum(["monthly", "member"], {
    required_error: "Report type is required",
  }),
  memberId: z.string().optional(),
  year: z.number().min(2020).max(2030).optional(),
  month: z.number().min(1).max(12).optional(),
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
export type PaymentFilterFormData = z.infer<typeof paymentFilterSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
