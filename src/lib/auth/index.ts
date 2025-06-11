// ============================================================================
// MAIN AUTH MODULE - SERVER-SIDE EXPORTS
// ============================================================================

// Configuration
export { authOptions } from "./config";

// Server-side utilities
export {
  getAuthenticatedUser,
  getSession,
  hasRole,
  isAuthenticated,
  requireAdmin,
  requireAuth,
  type AuthenticatedUser,
} from "./server";

// Shared utilities (can be used on both client and server)
export {
  checkRateLimit,
  generateSecurePassword,
  hashPassword,
  validateEmail,
  validatePassword,
  verifyPassword,
} from "./utils";

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// For backward compatibility and convenience
export { authOptions as default } from "./config";
