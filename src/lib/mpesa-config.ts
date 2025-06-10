interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: "sandbox" | "production";
  shortCode: string;
  passkey: string;
  callbackUrl: string;
  timeoutUrl?: string;
  resultUrl?: string;
  accountReference: string;
  transactionDesc: string;
}

interface MpesaAuthResponse {
  access_token: string;
  expires_in: string;
}

interface MpesaSTKResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaSTKQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode?: string;
  ResultDesc?: string;
}

export class MpesaService {
  private config: MpesaConfig | null = null;
  private baseUrl: string = "";
  private initialized: boolean = false;

  constructor() {
    try {
      this.initialize();
    } catch (error) {
      console.warn(
        "M-Pesa service not initialized:",
        error instanceof Error ? error.message : "Unknown error"
      );
      // Don't throw during construction to allow build to succeed
    }
  }

  private initialize() {
    this.validateEnvironmentVariables();

    this.config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY!,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
      environment:
        (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") ||
        "sandbox",
      shortCode: process.env.MPESA_SHORTCODE!,
      passkey: process.env.MPESA_PASSKEY!,
      callbackUrl: process.env.MPESA_CALLBACK_URL!,
      timeoutUrl: process.env.MPESA_TIMEOUT_URL,
      resultUrl: process.env.MPESA_RESULT_URL,
      accountReference: process.env.MPESA_ACCOUNT_REFERENCE || "GYM",
      transactionDesc: process.env.MPESA_TRANSACTION_DESC || "Gym Payment",
    };

    this.baseUrl =
      this.config.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    this.initialized = true;
  }

  private ensureInitialized() {
    if (!this.initialized || !this.config) {
      throw new Error(
        "M-Pesa service not properly configured. Please check your environment variables. " +
          "See MPESA_INTEGRATION.md for setup instructions."
      );
    }
  }

  private validateEnvironmentVariables() {
    const requiredVars = [
      "MPESA_CONSUMER_KEY",
      "MPESA_CONSUMER_SECRET",
      "MPESA_SHORTCODE",
      "MPESA_PASSKEY",
      "MPESA_CALLBACK_URL",
    ];

    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required M-Pesa environment variables: ${missing.join(
          ", "
        )}. ` +
          "Please check your .env file and ensure all M-Pesa configuration is set."
      );
    }

    // Validate callback URL format
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    if (
      callbackUrl &&
      !callbackUrl.startsWith("https://") &&
      process.env.NODE_ENV === "production"
    ) {
      console.warn(
        "Warning: M-Pesa callback URL should use HTTPS in production. " +
          "HTTP URLs may be rejected by Safaricom's servers."
      );
    }
  }

  /**
   * Get OAuth access token from M-Pesa API
   */
  private async getAccessToken(): Promise<string> {
    this.ensureInitialized();

    try {
      const auth = Buffer.from(
        `${this.config!.consumerKey}:${this.config!.consumerSecret}`
      ).toString("base64");

      const response = await fetch(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth failed: ${response.status} - ${errorText}`);
      }

      const data: MpesaAuthResponse = await response.json();

      if (!data.access_token) {
        throw new Error("No access token received from M-Pesa API");
      }

      return data.access_token;
    } catch (error) {
      console.error("M-Pesa OAuth Error:", error);
      throw new Error(
        `Failed to authenticate with M-Pesa API: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate M-Pesa password for STK Push
   */
  private generatePassword(): { password: string; timestamp: string } {
    this.ensureInitialized();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);

    const password = Buffer.from(
      `${this.config!.shortCode}${this.config!.passkey}${timestamp}`
    ).toString("base64");

    return { password, timestamp };
  }

  /**
   * Format phone number to M-Pesa format (254XXXXXXXXX)
   */
  public formatPhoneNumber(phoneNumber: string): string | null {
    // Remove all non-digits
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    // Validate Safaricom prefixes
    const safaricomPrefixes = [
      "701",
      "702",
      "703",
      "704",
      "705",
      "706",
      "707",
      "708",
      "709",
      "110",
      "111",
      "112",
      "113",
      "114",
      "115",
      "790",
      "791",
      "792",
      "793",
      "794",
      "795",
      "796",
      "797",
      "798",
      "799",
    ];

    let formattedNumber = "";

    if (cleanPhone.startsWith("254")) {
      formattedNumber = cleanPhone;
    } else if (cleanPhone.startsWith("0")) {
      formattedNumber = "254" + cleanPhone.substring(1);
    } else if (cleanPhone.length === 9) {
      formattedNumber = "254" + cleanPhone;
    } else {
      return null;
    }

    // Validate length and prefix
    if (formattedNumber.length !== 12) return null;

    const prefix = formattedNumber.substring(3, 6);
    if (!safaricomPrefixes.includes(prefix)) return null;

    return formattedNumber;
  }

  /**
   * Validate Safaricom phone number
   */
  public isValidSafaricomNumber(phoneNumber: string): boolean {
    return this.formatPhoneNumber(phoneNumber) !== null;
  }

  /**
   * Send STK Push request to M-Pesa
   */
  public async sendSTKPush({
    phoneNumber,
    amount,
    accountReference,
    transactionDesc,
  }: {
    phoneNumber: string;
    amount: number;
    accountReference?: string;
    transactionDesc?: string;
  }): Promise<{
    success: boolean;
    data?: MpesaSTKResponse;
    error?: string;
  }> {
    try {
      this.ensureInitialized();

      // Validate and format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      if (!formattedPhone) {
        return {
          success: false,
          error: "Invalid Safaricom phone number format",
        };
      }

      // Validate amount
      if (amount < 1) {
        return {
          success: false,
          error: "Amount must be at least KES 1",
        };
      }

      if (amount > 300000) {
        return {
          success: false,
          error: "Amount exceeds M-Pesa transaction limit (KES 300,000)",
        };
      }

      // Get access token
      const accessToken = await this.getAccessToken();

      // Generate password and timestamp
      const { password, timestamp } = this.generatePassword();

      // Prepare STK Push payload
      const payload = {
        BusinessShortCode: this.config!.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount), // M-Pesa only accepts whole numbers
        PartyA: formattedPhone,
        PartyB: this.config!.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.config!.callbackUrl,
        AccountReference: accountReference || this.config!.accountReference,
        TransactionDesc: transactionDesc || this.config!.transactionDesc,
      };

      console.log("📱 Sending M-Pesa STK Push:", {
        phone: formattedPhone,
        amount: Math.round(amount),
        reference: payload.AccountReference,
        environment: this.config!.environment,
      });

      // Send STK Push request
      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("M-Pesa STK Push failed:", responseData);
        return {
          success: false,
          error:
            responseData.errorMessage ||
            `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      // Check response code
      if (responseData.ResponseCode === "0") {
        console.log("✅ M-Pesa STK Push sent successfully:", {
          MerchantRequestID: responseData.MerchantRequestID,
          CheckoutRequestID: responseData.CheckoutRequestID,
        });

        return {
          success: true,
          data: responseData as MpesaSTKResponse,
        };
      } else {
        console.error("M-Pesa STK Push rejected:", responseData);
        return {
          success: false,
          error:
            responseData.ResponseDescription || "M-Pesa request was rejected",
        };
      }
    } catch (error) {
      console.error("M-Pesa STK Push Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Query STK Push transaction status
   */
  public async querySTKStatus(checkoutRequestId: string): Promise<{
    success: boolean;
    data?: MpesaSTKQueryResponse;
    error?: string;
  }> {
    try {
      this.ensureInitialized();

      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const payload = {
        BusinessShortCode: this.config!.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data as MpesaSTKQueryResponse };
      } else {
        return { success: false, error: data.errorMessage || "Query failed" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Check if M-Pesa service is properly configured
   */
  public isConfigured(): boolean {
    return this.initialized && this.config !== null;
  }

  /**
   * Get M-Pesa configuration info
   */
  public getConfig() {
    if (!this.isConfigured()) {
      throw new Error("M-Pesa service not configured");
    }

    return {
      environment: this.config!.environment,
      shortCode: this.config!.shortCode,
      callbackUrl: this.config!.callbackUrl,
    };
  }
}

// Create singleton instance with error handling
let mpesaServiceInstance: MpesaService | null = null;

try {
  mpesaServiceInstance = new MpesaService();
} catch (error) {
  console.warn(
    "M-Pesa service initialization failed during module load:",
    error instanceof Error ? error.message : "Unknown error"
  );
}

// Export singleton instance
export const mpesaService = mpesaServiceInstance || new MpesaService();
