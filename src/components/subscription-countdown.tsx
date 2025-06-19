"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, Clock, Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface SubscriptionCountdownProps {
  subscription: {
    id: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    membershipPlan: {
      id: string;
      name: string;
      duration: number;
      price: number;
      features: string[];
    };
    payment?: {
      id: string;
      amount: number;
      method: string;
      status: string;
      paidAt: string;
    };
  } | null;
  memberName: string;
  className?: string;
  showDetails?: boolean;
}

export function SubscriptionCountdown({
  subscription,
  memberName,
  className = "",
  showDetails = true,
}: SubscriptionCountdownProps) {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Update countdown every second for real-time effect
  useEffect(() => {
    if (!subscription) return;

    const updateCountdown = () => {
      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const timeDiff = endDate.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setDaysRemaining(0);
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setDaysRemaining(days);
      setIsExpired(false);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Initial update
    updateCountdown();

    // Update every second for real-time countdown
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [subscription]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const getStatusColor = () => {
    if (!subscription || isExpired) return "destructive";
    if (daysRemaining <= 3) return "destructive";
    if (daysRemaining <= 7) return "secondary";
    if (daysRemaining <= 30) return "outline";
    return "default";
  };

  const getStatusText = () => {
    if (!subscription) return "No Active Plan";
    if (isExpired) return "Expired";
    if (daysRemaining <= 3) return "Critical";
    if (daysRemaining <= 7) return "Expiring Soon";
    if (daysRemaining <= 30) return "Expiring This Month";
    return "Active";
  };

  const getIcon = () => {
    if (!subscription || isExpired) return <Clock className="h-4 w-4" />;
    if (daysRemaining <= 3) return <AlertTriangle className="h-4 w-4" />;
    if (daysRemaining <= 7) return <Zap className="h-4 w-4" />;
    return <Crown className="h-4 w-4" />;
  };

  if (!subscription) {
    return (
      <Card className={`border-dashed ${className}`}>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              No Active Membership
            </p>
            <p className="text-xs text-muted-foreground">
              {memberName} doesn&apos;t have an active membership plan
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {subscription.membershipPlan.name}
          </CardTitle>
          <Badge variant={getStatusColor()} className="flex items-center gap-1">
            {getIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Real-time Countdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Time Remaining:
            </span>
            <span
              className={`font-bold text-lg ${
                isExpired
                  ? "text-red-600"
                  : daysRemaining <= 3
                  ? "text-red-600"
                  : daysRemaining <= 7
                  ? "text-orange-600"
                  : daysRemaining <= 30
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {isExpired
                ? "EXPIRED"
                : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
            </span>
          </div>

          {/* Progress Bar */}

          {/* Live Second Counter for Critical Period */}
          {!isExpired && daysRemaining <= 7 && (
            <div className="text-center p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-lg font-mono font-bold text-orange-700">
                {timeLeft.days}d : {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </div>
              <p className="text-xs text-orange-600 mt-1">
                Live countdown to expiration
              </p>
            </div>
          )}
        </div>

        {showDetails && (
          <>
            {/* Plan Details */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan Price:</span>
                <span className="font-medium">
                  {formatCurrency(subscription.membershipPlan.price)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan Duration:</span>
                <span className="font-medium">
                  {subscription.membershipPlan.duration} days
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Start Date:</span>
                <span className="font-medium">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">End Date:</span>
                <span className="font-medium">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Features */}
            {subscription.membershipPlan.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Plan Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {subscription.membershipPlan.features.map(
                    (feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Payment Info */}
            {subscription.payment && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Payment:</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(subscription.payment.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(
                        subscription.payment.paidAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Alerts */}
        {!isExpired && daysRemaining <= 7 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              ⚠️ <strong>Renewal Required:</strong> This membership expires in{" "}
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}. Consider
              renewing to maintain access.
            </p>
          </div>
        )}

        {/* Critical Alert */}
        {!isExpired && daysRemaining <= 3 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              🚨 <strong>CRITICAL:</strong> Membership expires in{" "}
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}! Immediate
              renewal required to prevent service interruption.
            </p>
          </div>
        )}

        {/* Expired Alert */}
        {isExpired && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              🚫 <strong>Membership Expired:</strong> This membership expired on{" "}
              {new Date(subscription.endDate).toLocaleDateString()}. Please
              renew to restore access.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
