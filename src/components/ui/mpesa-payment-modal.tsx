"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSendPushNotification } from "@/hooks/use-payments";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Clock,
  Info,
  Loader2,
  Phone,
  Shield,
  Smartphone,
  Timer,
  User,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Enhanced interfaces for better type safety
interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  membershipNumber: string;
}

interface PaymentData {
  amount: number;
  description: string;
  membershipPlanId?: string;
}

interface TransactionData {
  transactionRef: string;
  pushRequestId: string;
  memberName: string;
  phoneNumber: string;
  amount: number;
  responseCode: string;
  responseDescription: string;
  paymentId?: string;
}

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: MemberData | null;
  paymentData: PaymentData;
  onSuccess?: (transactionRef: string) => void;
}

// Payment flow steps for better UX
enum PaymentStep {
  DETAILS = "details",
  SENDING = "sending",
  SENT = "sent",
  SUCCESS = "success",
  FAILED = "failed",
}

// Professional phone number validation with Kenya focus
const SAFARICOM_PREFIXES = [
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

export function MpesaPaymentModal({
  isOpen,
  onClose,
  memberData,
  paymentData,
  onSuccess,
}: MpesaPaymentModalProps) {
  // State management
  const [currentStep, setCurrentStep] = useState<PaymentStep>(
    PaymentStep.DETAILS
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  const sendPushMutation = useSendPushNotification();

  // Initialize form data when modal opens
  useEffect(() => {
    if (memberData && isOpen) {
      setPhoneNumber(memberData.phoneNumber || "");
      setCustomDescription(
        paymentData.description ||
          `Gym Payment - ${memberData.membershipNumber}`
      );
      setCurrentStep(PaymentStep.DETAILS);
      setPhoneError("");
      setTransactionData(null);
      setCountdownSeconds(0);
      setProgress(0);
    }
  }, [memberData, paymentData, isOpen]);

  // Countdown timer for success state
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep === PaymentStep.SUCCESS && countdownSeconds > 0) {
      interval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            if (onSuccess && transactionData) {
              onSuccess(transactionData.transactionRef);
            }
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, countdownSeconds, onSuccess, transactionData, onClose]);

  // Progress animation for sending state
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep === PaymentStep.SENDING) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Stop at 90% until actual response
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep]);

  // Phone number validation
  const validateSafaricomNumber = useCallback((phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");

    let checkNumber = "";
    if (cleanPhone.startsWith("254")) {
      checkNumber = cleanPhone;
    } else if (cleanPhone.startsWith("0")) {
      checkNumber = "254" + cleanPhone.substring(1);
    } else if (cleanPhone.length === 9) {
      checkNumber = "254" + cleanPhone;
    } else {
      return false;
    }

    if (checkNumber.length !== 12) return false;

    const prefix = checkNumber.substring(3, 6);
    return SAFARICOM_PREFIXES.includes(prefix);
  }, []);

  // Phone number formatting
  const formatPhoneNumber = useCallback((phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("254")) {
      return cleanPhone;
    } else if (cleanPhone.startsWith("0")) {
      return "254" + cleanPhone.substring(1);
    } else if (cleanPhone.length === 9) {
      return "254" + cleanPhone;
    }
    return cleanPhone;
  }, []);

  // Handle phone number input changes
  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhoneNumber(value);
      setPhoneError("");

      if (value.trim() && !validateSafaricomNumber(value)) {
        setPhoneError(
          "Please enter a valid Safaricom number (07xxxxxxxx or 254xxxxxxx)"
        );
      }
    },
    [validateSafaricomNumber]
  );

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle STK Push submission
  const handleSendPush = async () => {
    if (!memberData || !phoneNumber.trim() || phoneError) return;

    const formattedPhone = formatPhoneNumber(phoneNumber);
    setCurrentStep(PaymentStep.SENDING);

    const pushData = {
      memberId: memberData.id,
      amount: paymentData.amount,
      description: customDescription,
      phoneNumber: formattedPhone,
      membershipPlanId: paymentData.membershipPlanId,
    };

    try {
      const response = await sendPushMutation.mutateAsync(pushData);

      setProgress(100);
      setTransactionData(response.data);
      setCurrentStep(PaymentStep.SENT);

      // Auto transition to success state
      setTimeout(() => {
        setCurrentStep(PaymentStep.SUCCESS);
        setCountdownSeconds(8); // 8 second countdown
      }, 2000);
    } catch (error) {
      console.error("M-Pesa push failed:", error);
      setCurrentStep(PaymentStep.FAILED);

      if (error instanceof Error) {
        if (error.message.includes("not configured")) {
          setPhoneError(
            "M-Pesa service not configured. Please contact administrator."
          );
        } else if (error.message.includes("Member not found")) {
          setPhoneError("Member not found. Please refresh and try again.");
        } else {
          setPhoneError(error.message);
        }
      }
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (sendPushMutation.isPending || currentStep === PaymentStep.SENDING)
      return;
    onClose();
  };

  // Prevent closing during critical operations
  const canClose =
    !sendPushMutation.isPending && currentStep !== PaymentStep.SENDING;

  if (!memberData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={canClose ? handleClose : undefined}>
      <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-semibold">M-Pesa Payment</div>
              <div className="text-sm font-normal text-muted-foreground">
                Send payment request via STK Push
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[
            { step: PaymentStep.DETAILS, label: "Details", icon: User },
            { step: PaymentStep.SENDING, label: "Sending", icon: Zap },
            { step: PaymentStep.SENT, label: "Sent", icon: Phone },
            { step: PaymentStep.SUCCESS, label: "Success", icon: CheckCircle },
          ].map(({ step, label, icon: Icon }, index) => {
            const isActive = currentStep === step;
            const isCompleted =
              Object.values(PaymentStep).indexOf(currentStep) > index;
            const isFailed = currentStep === PaymentStep.FAILED && index > 0;

            return (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                    isCompleted || isActive
                      ? "bg-green-600 border-green-600 text-white"
                      : isFailed
                      ? "bg-red-100 border-red-300 text-red-600"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "ml-2 text-xs font-medium",
                    isActive || isCompleted ? "text-green-600" : "text-gray-400"
                  )}
                >
                  {label}
                </span>
                {index < 3 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-3 transition-all",
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Content based on current step */}
        <div className="space-y-6">
          {currentStep === PaymentStep.DETAILS && (
            <>
              {/* Payment Summary */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      {memberData.firstName} {memberData.lastName}
                    </div>
                    <div className="text-xs text-green-600">
                      {memberData.membershipNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(paymentData.amount)}
                    </div>
                    <div className="text-xs text-green-600">Payment Amount</div>
                  </div>
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  M-Pesa Phone Number
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678 or 254712345678"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={cn(
                    "font-mono text-base",
                    phoneError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  )}
                />
                {phoneError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {phoneError}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Customer will receive payment prompt on this number
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description">Payment Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter payment description (optional)"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  maxLength={50}
                  rows={2}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {customDescription.length}/50 characters
                </div>
              </div>

              {/* Important Notes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <strong>STK Push:</strong> Customer receives instant payment
                    prompt on their phone
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Timer className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Timeout:</strong> M-Pesa requests expire after 60
                    seconds
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <strong>Secure:</strong> All transactions are encrypted and
                    secure
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={!canClose}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSendPush}
                  disabled={
                    !phoneNumber.trim() ||
                    !!phoneError ||
                    sendPushMutation.isPending
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Send STK Push
                </Button>
              </div>
            </>
          )}

          {currentStep === PaymentStep.SENDING && (
            <div className="text-center py-8 space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sending STK Push</h3>
                <p className="text-sm text-muted-foreground">
                  Processing your payment request...
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {progress < 50
                    ? "Connecting to M-Pesa..."
                    : progress < 90
                    ? "Sending request..."
                    : "Almost done..."}
                </div>
              </div>
            </div>
          )}

          {currentStep === PaymentStep.SENT && (
            <div className="text-center py-8 space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">STK Push Sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Payment request sent to {transactionData?.phoneNumber}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-xs font-mono text-muted-foreground break-all">
                  Transaction ID: {transactionData?.transactionRef}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Customer should check their phone for M-Pesa prompt
              </div>
            </div>
          )}

          {currentStep === PaymentStep.SUCCESS && (
            <div className="text-center py-8 space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-green-700">
                  Payment Request Sent!
                </h3>
                <p className="text-sm text-muted-foreground">
                  M-Pesa STK Push delivered to {transactionData?.phoneNumber}
                </p>
              </div>

              {transactionData && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member:</span>
                      <span className="font-medium">
                        {transactionData.memberName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(transactionData.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-mono text-sm">
                        {transactionData.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <Separator />

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">
                      <strong>Status:</strong>{" "}
                      {transactionData.responseDescription}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Auto-closing in {countdownSeconds} seconds
              </div>

              <Button onClick={handleClose} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          )}

          {currentStep === PaymentStep.FAILED && (
            <div className="text-center py-8 space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-700">
                  Payment Request Failed
                </h3>
                <p className="text-sm text-muted-foreground">
                  Unable to send M-Pesa STK Push
                </p>
              </div>

              {phoneError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">{phoneError}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setCurrentStep(PaymentStep.DETAILS)}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
