import { getServerSession } from "next-auth";
import { prisma } from "../prisma";
import { authOptions } from "./config";

// ============================================================================
// SERVER-SIDE AUTHENTICATION HELPERS
// ============================================================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "MEMBER";
  emailVerified: Date | null;
  createdAt: Date;
}

/**
 * Get the currently authenticated user from the session
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: "ADMIN" | "MEMBER"): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user?.role === role;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user !== null;
}

/**
 * Get user session data
 */
export async function getSession() {
  return getServerSession(authOptions);
}
