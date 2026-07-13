/**
 * M-Pesa Utilities
 *
 * Professional utility functions for M-Pesa integration including:
 * - Phone number validation and formatting
 * - Currency formatting for Kenyan market
 * - Transaction status management
 * - Error handling helpers
 */

// M-Pesa transaction status codes
export const MPESA_RESULT_CODES = {
  SUCCESS: "0",
  INSUFFICIENT_FUNDS: "1",
  LESS_THAN_MINIMUM: "2",
  MORE_THAN_MAXIMUM: "3",
  ACCOUNT_NOT_FOUND: "4",
  TIMEOUT: "1032",
  USER_CANCELLED: "1037",
  INVALID_ACCOUNT: "2001",
} as const;

// M-Pesa transaction limits
export const MPESA_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 300000,
  MAX_DESCRIPTION_LENGTH: 50,
} as const;

/**
 * Validates if a phone number is a valid Kenyan M-Pesa number (254XXXXXXXXX)
 */
export function isValidSafaricomNumber(phoneNumber: string): boolean {
  const formatted = formatPhoneNumber(phoneNumber);
  return formatted !== null && formatted.length === 12;
}

/**
 * Formats a phone number to M-Pesa international format (254XXXXXXXXX)
 */
export function formatPhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber) return null;

  const cleanPhone = phoneNumber.replace(/\D/g, "");

  if (cleanPhone.startsWith("254")) {
    return cleanPhone;
  } else if (cleanPhone.startsWith("0")) {
    return "254" + cleanPhone.substring(1);
  } else if (cleanPhone.length === 9) {
    return "254" + cleanPhone;
  }

  return null;
}

/**
 * Formats a phone number for display (0712345678)
 */
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
  const formatted = formatPhoneNumber(phoneNumber);
  if (!formatted) return phoneNumber;

  // Convert 254712345678 to 0712345678
  if (formatted.startsWith("254")) {
    return "0" + formatted.substring(3);
  }

  return phoneNumber;
}

/**
 * Validates M-Pesa transaction amount
 */
export function validateMpesaAmount(amount: number): {
  isValid: boolean;
  error?: string;
} {
  if (amount < MPESA_LIMITS.MIN_AMOUNT) {
    return {
      isValid: false,
      error: `Amount must be at least KES ${MPESA_LIMITS.MIN_AMOUNT}`,
    };
  }

  if (amount > MPESA_LIMITS.MAX_AMOUNT) {
    return {
      isValid: false,
      error: `Amount cannot exceed KES ${MPESA_LIMITS.MAX_AMOUNT.toLocaleString()}`,
    };
  }

  // Check for decimal places (M-Pesa only accepts whole numbers)
  if (amount % 1 !== 0) {
    return {
      isValid: false,
      error: "M-Pesa only accepts whole number amounts",
    };
  }

  return { isValid: true };
}

/**
 * Formats currency for Kenyan market
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats currency in compact form (e.g., KES 1.2K, KES 2.5M)
 */
export function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Gets human-readable description for M-Pesa result codes
 */
export function getMpesaResultDescription(resultCode: string): string {
  const descriptions: Record<string, string> = {
    "0": "Transaction completed successfully",
    "1": "Insufficient funds in account",
    "2": "Amount below minimum transaction limit",
    "3": "Amount exceeds maximum transaction limit",
    "4": "Account does not exist",
    "1032": "Request timeout - user took too long to respond",
    "1037": "Transaction cancelled by user",
    "2001": "Invalid account number",
    "1025": "Invalid transaction - PIN mismatch or locked account",
    "1019": "Transaction failed - system error",
    "9999": "Request failed - invalid request",
  };

  return (
    descriptions[resultCode] || `Transaction failed with code: ${resultCode}`
  );
}

/**
 * Determines if an M-Pesa result code indicates success
 */
export function isMpesaSuccess(resultCode: string): boolean {
  return resultCode === MPESA_RESULT_CODES.SUCCESS;
}

/**
 * Determines if an M-Pesa result code indicates a retryable error
 */
export function isMpesaRetryable(resultCode: string): boolean {
  const retryableCodes = [
    "1032", // Timeout
    "1019", // System error
    "9999", // Request failed
  ];
  return retryableCodes.includes(resultCode);
}

/**
 * Validates M-Pesa transaction description
 */
export function validateMpesaDescription(description: string): {
  isValid: boolean;
  error?: string;
} {
  if (description.length > MPESA_LIMITS.MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `Description must be ${MPESA_LIMITS.MAX_DESCRIPTION_LENGTH} characters or less`,
    };
  }

  // Check for invalid characters (M-Pesa has restrictions)
  const invalidChars = /[^a-zA-Z0-9\s\-_.,]/;
  if (invalidChars.test(description)) {
    return {
      isValid: false,
      error:
        "Description contains invalid characters. Use only letters, numbers, spaces, and basic punctuation.",
    };
  }

  return { isValid: true };
}

/**
 * Generates a clean transaction reference for M-Pesa
 */
export function generateTransactionReference(prefix: string = "GYM"): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp.slice(-8)}-${random}`;
}

/**
 * Formats M-Pesa date string to JavaScript Date
 */
export function parseMpesaDate(mpesaDateString: string): Date {
  // M-Pesa date format: 20231215143022 (YYYYMMDDHHMMSS)
  if (mpesaDateString.length !== 14) {
    throw new Error(`Invalid M-Pesa date format: ${mpesaDateString}`);
  }

  const year = parseInt(mpesaDateString.substring(0, 4));
  const month = parseInt(mpesaDateString.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(mpesaDateString.substring(6, 8));
  const hour = parseInt(mpesaDateString.substring(8, 10));
  const minute = parseInt(mpesaDateString.substring(10, 12));
  const second = parseInt(mpesaDateString.substring(12, 14));

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Formats a date for M-Pesa API (YYYYMMDDHHMMSS)
 */
export function formatDateForMpesa(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * Creates a professional error message from M-Pesa API errors
 */
export function createMpesaErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.errorMessage && typeof errorObj.errorMessage === "string") {
      return errorObj.errorMessage;
    }
    if (
      errorObj.ResponseDescription &&
      typeof errorObj.ResponseDescription === "string"
    ) {
      return errorObj.ResponseDescription;
    }
    if (errorObj.message && typeof errorObj.message === "string") {
      return errorObj.message;
    }
  }

  return "An unexpected error occurred with the M-Pesa service";
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const sensitiveFields = [
    "consumerKey",
    "consumerSecret",
    "password",
    "phoneNumber",
  ];

  if (typeof data === "object" && data !== null) {
    const masked = { ...data };

    for (const field of sensitiveFields) {
      if (masked[field]) {
        const value = String(masked[field]);
        if (field === "phoneNumber") {
          // Mask phone number: 254712345678 -> 254****5678
          masked[field] = value.replace(/(\d{3})\d{5}(\d{4})/, "$1****$2");
        } else {
          // Mask other sensitive fields: show first 4 and last 4 characters
          masked[field] =
            value.length > 8
              ? `${value.substring(0, 4)}****${value.substring(
                  value.length - 4
                )}`
              : "****";
        }
      }
    }

    return masked;
  }

  return data;
}
