"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  RefreshCw,
  Smartphone,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Enhanced payment interface
interface Payment {
  id: string;
  amount: number;
  method: "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  description?: string;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
  member?: {
    id: string;
    membershipNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  membershipPlan?: {
    name: string;
    price: number;
    duration: number;
  };
}

interface MpesaStatusResponse {
  success: boolean;
  data?: {
    paymentId: string;
    checkoutRequestId: string;
    currentStatus: string;
    mpesaStatus: {
      ResponseCode: string;
      ResponseDescription: string;
      ResultCode: string;
      ResultDesc: string;
    };
    memberName: string;
    amount: number;
    lastUpdated: string;
    subscriptionCreated?: boolean;
  };
  error?: string;
}

interface MpesaStatusTrackerProps {
  payment: Payment;
  onStatusUpdate?: () => void;
  isCompact?: boolean;
}

// Status configuration for better UX
const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "Waiting for customer response",
    canRefresh: true,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Payment successfully processed",
    canRefresh: false,
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: X,
    description: "Payment was unsuccessful",
    canRefresh: true,
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: RefreshCw,
    description: "Payment has been refunded",
    canRefresh: false,
  },
};

export function MpesaStatusTracker({
  payment,
  onStatusUpdate,
  isCompact = false,
}: MpesaStatusTrackerProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [statusData, setStatusData] = useState<
    MpesaStatusResponse["data"] | null
  >(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Auto-refresh for pending payments
  useEffect(() => {
    if (
      !autoRefreshEnabled ||
      payment.status !== "PENDING" ||
      !payment.transactionRef
    ) {
      return;
    }

    const interval = setInterval(async () => {
      if (refreshCount < 12) {
        // Max 12 refreshes (1 minute for 5-second intervals)
        await handleVerifyStatus(true);
        setRefreshCount((prev) => prev + 1);
      } else {
        setAutoRefreshEnabled(false);
        toast.info("Auto-refresh stopped", {
          description: "Please check manually or contact customer",
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoRefreshEnabled,
    payment.status,
    payment.transactionRef,
    refreshCount,
  ]);

  // Verify payment status
  const handleVerifyStatus = useCallback(
    async (isAutomatic = false) => {
      if (!payment.transactionRef || isVerifying) return;

      setIsVerifying(true);
      if (!isAutomatic) {
        setLastChecked(new Date());
      }

      try {
        const response = await fetch("/api/payments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkoutRequestId: payment.transactionRef,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: MpesaStatusResponse = await response.json();

        if (result.success && result.data) {
          setStatusData(result.data);
          const { currentStatus } = result.data;

          if (!isAutomatic) {
            if (currentStatus === "COMPLETED") {
              toast.success("Payment verified successfully!", {
                description: "Payment completed and subscription updated",
              });
              setAutoRefreshEnabled(false);
            } else if (currentStatus === "FAILED") {
              toast.error("Payment verification failed", {
                description:
                  result.data.mpesaStatus.ResultDesc || "Transaction failed",
              });
              setAutoRefreshEnabled(false);
            } else {
              toast.info("Payment still pending", {
                description: "Customer may still be processing the payment",
              });
            }
          }

          // Trigger parent refresh if status changed
          if (currentStatus !== payment.status) {
            onStatusUpdate?.();
          }
        } else {
          throw new Error(result.error || "Failed to verify payment status");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        if (!isAutomatic) {
          toast.error("Verification failed", {
            description:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [payment.transactionRef, payment.status, isVerifying, onStatusUpdate]
  );

  // Start auto-refresh
  const startAutoRefresh = () => {
    setAutoRefreshEnabled(true);
    setRefreshCount(0);
    toast.info("Auto-refresh enabled", {
      description: "Checking payment status every 5 seconds",
    });
  };

  // Stop auto-refresh
  const stopAutoRefresh = () => {
    setAutoRefreshEnabled(false);
    setRefreshCount(0);
    toast.info("Auto-refresh disabled");
  };

  const statusConfig = STATUS_CONFIG[payment.status];
  const canVerify =
    payment.method === "MOBILE_MONEY" &&
    (payment.status === "PENDING" || payment.status === "FAILED") &&
    payment.transactionRef;

  // Compact view for table
  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={statusConfig.color} variant="outline">
          <statusConfig.icon className="w-3 h-3 mr-1" />
          {statusConfig.label}
        </Badge>

        {canVerify && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVerifyStatus()}
            disabled={isVerifying}
            className="h-6 px-2"
          >
            {isVerifying ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
          </Button>
        )}

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <MpesaStatusDetails
              payment={payment}
              statusData={statusData}
              onVerify={() => handleVerifyStatus()}
              isVerifying={isVerifying}
              lastChecked={lastChecked}
              autoRefreshEnabled={autoRefreshEnabled}
              onStartAutoRefresh={startAutoRefresh}
              onStopAutoRefresh={stopAutoRefresh}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Full view
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            M-Pesa Payment Status
          </CardTitle>
          <Badge className={statusConfig.color} variant="outline">
            <statusConfig.icon className="w-4 h-4 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
        <CardDescription>{statusConfig.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <MpesaStatusDetails
          payment={payment}
          statusData={statusData}
          onVerify={() => handleVerifyStatus()}
          isVerifying={isVerifying}
          lastChecked={lastChecked}
          autoRefreshEnabled={autoRefreshEnabled}
          onStartAutoRefresh={startAutoRefresh}
          onStopAutoRefresh={stopAutoRefresh}
        />
      </CardContent>
    </Card>
  );
}

// Detailed status component
interface MpesaStatusDetailsProps {
  payment: Payment;
  statusData: MpesaStatusResponse["data"] | null;
  onVerify: () => void;
  isVerifying: boolean;
  lastChecked: Date | null;
  autoRefreshEnabled: boolean;
  onStartAutoRefresh: () => void;
  onStopAutoRefresh: () => void;
}

function MpesaStatusDetails({
  payment,
  statusData,
  onVerify,
  isVerifying,
  lastChecked,
  autoRefreshEnabled,
  onStartAutoRefresh,
  onStopAutoRefresh,
}: MpesaStatusDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const canVerify =
    payment.method === "MOBILE_MONEY" &&
    (payment.status === "PENDING" || payment.status === "FAILED") &&
    payment.transactionRef;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </DialogTitle>
        <DialogDescription>
          M-Pesa transaction information and status
        </DialogDescription>
      </DialogHeader>

      {/* Payment Information */}
      <div className="grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Member:</span>
          <span className="font-medium">
            {payment.member
              ? `${payment.member.user.firstName} ${payment.member.user.lastName}`
              : "Unknown"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium">{formatCurrency(payment.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction ID:</span>
          <span className="font-mono text-xs">
            {payment.transactionRef || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created:</span>
          <span>{new Date(payment.createdAt).toLocaleString()}</span>
        </div>
        {payment.paidAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paid At:</span>
            <span>{new Date(payment.paidAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Status Information */}
      {statusData && (
        <div className="space-y-3">
          <h4 className="font-medium">M-Pesa Status</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                className={
                  STATUS_CONFIG[
                    statusData.currentStatus as keyof typeof STATUS_CONFIG
                  ]?.color
                }
                variant="outline"
              >
                {statusData.currentStatus}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">M-Pesa Code:</span>
              <span className="font-mono text-xs">
                {statusData.mpesaStatus.ResultCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="text-right text-xs max-w-[200px]">
                {statusData.mpesaStatus.ResultDesc}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-xs">
                {new Date(statusData.lastUpdated).toLocaleString()}
              </span>
            </div>
            {statusData.subscriptionCreated && (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Subscription created successfully
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auto-refresh status */}
      {payment.status === "PENDING" && (
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Auto-refresh</span>
            </div>
            <Badge variant={autoRefreshEnabled ? "default" : "secondary"}>
              {autoRefreshEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          {autoRefreshEnabled && (
            <div className="text-xs text-muted-foreground">
              Checking every 5 seconds for payment updates
            </div>
          )}
        </div>
      )}

      {/* Last checked indicator */}
      {lastChecked && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          Last checked: {formatTime(lastChecked)}
        </div>
      )}

      {/* Action buttons */}
      {canVerify && (
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onVerify}
            disabled={isVerifying}
            className="flex-1"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Check Status
          </Button>

          {payment.status === "PENDING" && (
            <Button
              variant={autoRefreshEnabled ? "destructive" : "default"}
              onClick={
                autoRefreshEnabled ? onStopAutoRefresh : onStartAutoRefresh
              }
              size="sm"
            >
              {autoRefreshEnabled ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-1" />
                  Auto
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
