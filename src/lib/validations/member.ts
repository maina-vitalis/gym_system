import { z } from "zod";

// Member form validation schema
export const memberFormSchema = z.object({
  // Required fields (matching database User model)
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase()
    .trim(),

  // Optional fields (matching database schema)
  phoneNumber: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .max(20, "Phone number must be less than 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      const date = new Date(val);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate()
      );
      return !isNaN(date.getTime()) && date <= today && date >= minDate;
    }, "Please enter a valid birth date (must be in the past and reasonable)"),

  gender: z
    .enum(["Male", "Female", "Other", "Prefer not to say"])
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  emergencyContactName: z
    .string()
    .max(100, "Emergency contact name must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  emergencyContactPhone: z
    .string()
    .max(20, "Emergency contact phone must be less than 20 characters")
    .trim()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      return /^[\+]?[\d\s\-\(\)]+$/.test(val);
    }, "Please enter a valid phone number")
    .or(z.literal("")),

  healthConditions: z
    .string()
    .max(1000, "Health conditions must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  fitnessGoals: z
    .string()
    .max(1000, "Fitness goals must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

// Update member form schema (allows partial updates)
export const updateMemberFormSchema = memberFormSchema.partial().extend({
  membershipStatus: z
    .enum(["ACTIVE", "INACTIVE", "SUSPENDED", "EXPIRED"])
    .optional(),
});

// Search and filter schema
export const memberFilterSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(["all", "active", "inactive", "suspended", "expired"])
    .default("all"),
  sortBy: z
    .enum(["name", "email", "joinDate", "lastVisit", "status"])
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// Type exports
export type MemberFormData = z.infer<typeof memberFormSchema>;
export type UpdateMemberFormData = z.infer<typeof updateMemberFormSchema>;
export type MemberFilterData = z.infer<typeof memberFilterSchema>;
