"use client";

import { AuthUser } from "@/types";
import { useSession as useNextAuthSession } from "next-auth/react";

// ============================================================================
// CLIENT-SIDE AUTHENTICATION UTILITIES
// ============================================================================

export type { AuthUser };

/**
 * Custom useSession hook with enhanced typing and error handling
 */
export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    data: session,
    isPending: status === "loading",
    isAuthenticated: !!session?.user,
  };
}

/**
 * Hook to get the current user with proper typing
 */
export function useUser() {
  const { data: session, isPending } = useSession();

  return {
    user: session?.user as AuthUser | undefined,
    isPending,
    isAuthenticated: !!session?.user,
  };
}

/**
 * Hook to check if user has specific role
 */
export function useRole(role: "ADMIN" | "MEMBER") {
  const { user } = useUser();
  return user?.role === role;
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  return useRole("ADMIN");
}

/**
 * Hook to check if user is member
 */
export function useIsMember() {
  return useRole("MEMBER");
}
