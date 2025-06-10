"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSendPushNotification } from "@/hooks/use-payments";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email: string;
    membershipNumber: string;
  } | null;
  paymentData: {
    amount: number;
    description: string;
    membershipPlanId?: string;
  };
  onSuccess?: (transactionRef: string) => void;
}

export function PushNotificationModal({
  isOpen,
  onClose,
  memberData,
  paymentData,
  onSuccess,
}: PushNotificationModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    transactionRef: string;
    pushRequestId: string;
    memberName: string;
    phoneNumber: string;
    amount: number;
    responseCode: string;
    responseDescription: string;
  } | null>(null);
  const [phoneError, setPhoneError] = useState("");

  const sendPushMutation = useSendPushNotification();

  useEffect(() => {
    if (memberData) {
      setPhoneNumber(memberData.phoneNumber || "");
      setCustomDescription(
        paymentData.description || `GYM-${memberData.membershipNumber}`
      );
    }
  }, [memberData, paymentData]);

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setTransactionData(null);
      setPhoneError("");
    }
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const validateSafaricomNumber = (phone: string): boolean => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, "");

    // Safaricom prefixes
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
    return safaricomPrefixes.includes(prefix);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("254")) {
      return cleanPhone;
    } else if (cleanPhone.startsWith("0")) {
      return "254" + cleanPhone.substring(1);
    } else if (cleanPhone.length === 9) {
      return "254" + cleanPhone;
    }
    return cleanPhone;
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError("");

    if (value.trim() && !validateSafaricomNumber(value)) {
      setPhoneError("Please enter a valid Safaricom number");
    }
  };

  const handleSendPush = async () => {
    if (!memberData || !phoneNumber.trim()) return;

    if (!validateSafaricomNumber(phoneNumber)) {
      setPhoneError("Please enter a valid Safaricom number");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      const response = await sendPushMutation.mutateAsync({
        memberId: memberData.id,
        amount: paymentData.amount,
        description: customDescription,
        phoneNumber: formattedPhone,
        membershipPlanId: paymentData.membershipPlanId,
      });

      setTransactionData(response.data);
      setShowSuccess(true);

      // Auto-close success state after 5 seconds for M-Pesa
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(response.data.transactionRef);
        }
        onClose();
      }, 5000);
    } catch (error) {
      // Check if it's a configuration error
      if (error instanceof Error && error.message.includes("not configured")) {
        setPhoneError(
          "M-Pesa service not configured. Please contact administrator."
        );
      }
      // Other errors are handled by the hook
    }
  };

  const handleClose = () => {
    if (sendPushMutation.isPending) return;
    onClose();
  };

  if (!memberData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-xl font-semibold text-green-700">
              M-Pesa STK Push Sent!
            </DialogTitle>
            <DialogDescription className="mt-2 space-y-2">
              <p>Payment request sent to {transactionData?.phoneNumber}</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                CheckoutRequestID: {transactionData?.transactionRef}
              </p>
              <p className="text-sm text-green-600 font-medium">
                {transactionData?.responseDescription}
              </p>
              <p className="text-xs text-muted-foreground">
                Customer will receive M-Pesa prompt. Auto-closing in 5 seconds.
              </p>
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                Send M-Pesa STK Push
              </DialogTitle>
              <DialogDescription>
                Send payment request to {memberData.firstName}{" "}
                {memberData.lastName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Member Info & Amount - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">
                    {memberData.firstName} {memberData.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {memberData.membershipNumber}
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(paymentData.amount)}
                  </div>
                  <div className="text-xs text-green-700">Amount</div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  Safaricom Number <span className="text-red-500">*</span>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678 or 254712345678"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`font-mono ${phoneError ? "border-red-500" : ""}`}
                />
                {phoneError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {phoneError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Only Safaricom numbers support M-Pesa
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (max 50 chars)</Label>
                <Textarea
                  id="description"
                  placeholder="Payment description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={2}
                  maxLength={50}
                  className="resize-none"
                />
              </div>

              {/* Compact Info Boxes */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <Smartphone className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-green-800">
                    <strong>STK Push:</strong> Customer receives instant payment
                    prompt on their phone
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-800">
                    Ensure customer is ready - M-Pesa requests expire quickly
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={sendPushMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSendPush}
                disabled={
                  sendPushMutation.isPending ||
                  !phoneNumber.trim() ||
                  !!phoneError
                }
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              >
                {sendPushMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
