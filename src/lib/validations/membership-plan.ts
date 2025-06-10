import { z } from "zod";

// Base membership plan schema
export const membershipPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Plan name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration cannot exceed 10 years"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price cannot exceed 1,000,000"),
  features: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .refine((features) => new Set(features).size === features.length, {
      message: "Features must be unique",
    }),
  isActive: z.boolean(),
});

// Update membership plan schema (allows partial updates)
export const updateMembershipPlanSchema = membershipPlanSchema.partial();

// Form data types
export type MembershipPlanFormData = z.infer<typeof membershipPlanSchema>;
export type UpdateMembershipPlanFormData = z.infer<
  typeof updateMembershipPlanSchema
>;

// Duration helper functions
export const DURATION_PRESETS = [
  { label: "1 Month", value: 30 },
  { label: "3 Months", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "1 Year", value: 365 },
  { label: "2 Years", value: 730 },
] as const;

export function formatDuration(days: number): string {
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    const years = Math.round(days / 365);
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
}

export function calculateExpirationDate(
  startDate: Date,
  durationInDays: number
): Date {
  const expirationDate = new Date(startDate);
  expirationDate.setDate(expirationDate.getDate() + durationInDays);
  return expirationDate;
}

export function calculateDaysRemaining(expirationDate: Date): number {
  const today = new Date();
  const timeDiff = expirationDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(0, daysDiff);
}
