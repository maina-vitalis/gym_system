"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDaysRemaining } from "@/lib/validations/membership-plan";
import { Calendar, Clock, Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface MembershipSubscription {
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
}

interface MembershipStatusProps {
  memberName: string;
  subscription?: MembershipSubscription | null;
  className?: string;
}

export function MembershipStatus({
  memberName,
  subscription,
  className = "",
}: MembershipStatusProps) {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (subscription) {
      const days = calculateDaysRemaining(new Date(subscription.endDate));
      setDaysRemaining(days);
      setIsExpired(days <= 0);
    }
  }, [subscription]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const getStatusColor = () => {
    if (!subscription || isExpired) return "destructive";
    if (daysRemaining <= 7) return "secondary";
    if (daysRemaining <= 30) return "outline";
    return "default";
  };

  const getStatusText = () => {
    if (!subscription) return "No Active Plan";
    if (isExpired) return "Expired";
    if (daysRemaining <= 7) return "Expiring Soon";
    return "Active";
  };

  const getIcon = () => {
    if (!subscription || isExpired) return <Clock className="h-4 w-4" />;
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
        {/* Days Remaining */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Days Remaining:</span>
          <span
            className={`font-bold ${
              isExpired
                ? "text-red-600"
                : daysRemaining <= 7
                ? "text-orange-600"
                : daysRemaining <= 30
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {isExpired ? "Expired" : `${daysRemaining} days`}
          </span>
        </div>

        {/* Plan Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">
              {formatCurrency(subscription.membershipPlan.price)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
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
              {subscription.membershipPlan.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
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
                  {new Date(subscription.payment.paidAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Renewal Alert */}
        {!isExpired && daysRemaining <= 7 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              ⚠️ <strong>Renewal Required:</strong> This membership expires in{" "}
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}. Consider
              renewing to maintain access.
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
