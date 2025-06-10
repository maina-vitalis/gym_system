import { z } from "zod";

// Check-in validation schema
export const checkInSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  membershipNumber: z.string().optional(),
  notes: z.string().optional(),
});

// Check-out validation schema
export const checkOutSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  notes: z.string().optional(),
});

// Manual attendance entry schema
export const manualAttendanceSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  type: z.enum(["CHECK_IN", "CHECK_OUT"]),
  timestamp: z.string().datetime(),
  notes: z.string().optional(),
});

// Member lookup schema (for quick check-in)
export const memberLookupSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;
export type CheckOutFormData = z.infer<typeof checkOutSchema>;
export type ManualAttendanceFormData = z.infer<typeof manualAttendanceSchema>;
export type MemberLookupFormData = z.infer<typeof memberLookupSchema>;
