"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PushNotificationModal } from "@/components/ui/push-notification-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useEnhancedMemberSearch,
  useWarmMemberCache,
} from "@/hooks/use-member-search";
import { useCreatePayment, useMembershipPlans } from "@/hooks/use-payments";
import { createPaymentSchema } from "@/lib/validations/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  DollarSign,
  Loader2,
  Search,
  Smartphone,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof createPaymentSchema>;

interface MemberSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  membershipStatus: string;
}

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] =
    useState<MemberSearchResult | null>(null);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);

  const createPaymentMutation = useCreatePayment();

  // Use the new enhanced member search with caching
  const {
    data: memberLookupData,
    isLoading: isSearchLoading,
    isCacheHit,
  } = useEnhancedMemberSearch(searchQuery, {
    enabled: searchQuery.length >= 2,
    limit: 10,
  });

  const { data: membershipPlans } = useMembershipPlans();

  // Warm the cache on component mount
  const { isLoading: isCacheWarming, error: cacheWarmError } =
    useWarmMemberCache();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      amount: 0,
      method: "CASH",
      description: "",
    },
  });

  const watchedMethod = watch("method");
  const watchedAmount = watch("amount");

  const handleMemberSelect = useCallback(
    (member: MemberSearchResult) => {
      setSelectedMember(member);
      setValue("memberId", member.id);
      setSearchQuery(`${member.firstName} ${member.lastName}`);
      setShowMemberSearch(false);
    },
    [setValue]
  );

  const clearMemberSelection = useCallback(() => {
    setSelectedMember(null);
    setSearchQuery("");
    setValue("memberId", "");
    setShowMemberSearch(false);
  }, [setValue]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setShowMemberSearch(value.length >= 2);
      if (value.length === 0) {
        clearMemberSelection();
      }
    },
    [clearMemberSelection]
  );

  const onSubmit = async (data: FormData) => {
    try {
      await createPaymentMutation.mutateAsync(data);
      reset();
      router.push("/dashboard/payments");
    } catch {
      // Error handled by the hook
    }
  };

  const handleMembershipPlanSelect = (planId: string) => {
    setValue("membershipPlanId", planId);
    const plan = membershipPlans?.data?.find(
      (p: MembershipPlan) => p.id === planId
    );
    if (plan) {
      setValue("amount", plan.price);
      setValue("description", `Membership: ${plan.name}`);
    }
  };

  const handlePushSuccess = (transactionRef: string) => {
    // Auto-populate the transaction reference when push is successful
    setValue("transactionRef", transactionRef);
    // Note: Method will remain as selected by user since MOBILE_MONEY is handled automatically
    setShowPushModal(false);
  };

  const handleSendPush = () => {
    if (!selectedMember || watchedAmount <= 0) return;
    setShowPushModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Record New Payment
          </h1>
          <p className="text-muted-foreground">
            Record a payment from a member for membership or other services
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Enter the payment information and select the member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Member Selection */}
              <div className="space-y-2">
                <Label htmlFor="member">Member *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search member by name, email, or membership number..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-16"
                  />
                  {selectedMember && (
                    <button
                      type="button"
                      onClick={clearMemberSelection}
                      className="absolute right-12 top-3 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                  {/* Cache indicator */}
                  {searchQuery.length >= 2 && (
                    <div className="absolute right-3 top-3">
                      {isSearchLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : isCacheHit ? (
                        <Zap className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                      )}
                    </div>
                  )}
                  {/* Cache warming indicator */}
                  {isCacheWarming && searchQuery.length < 2 && (
                    <div
                      className="absolute right-3 top-3"
                      title="Warming cache for faster searches"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    </div>
                  )}
                </div>

                {/* Member Search Results */}
                {showMemberSearch &&
                  memberLookupData &&
                  memberLookupData.length > 0 && (
                    <div className="border rounded-lg p-2 space-y-1 max-h-60 overflow-y-auto">
                      {memberLookupData.map((member: MemberSearchResult) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => handleMemberSelect(member)}
                        >
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.email} • {member.membershipNumber}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.membershipStatus}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Search Status */}
                {searchQuery.length >= 2 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {isSearchLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Searching...
                      </>
                    ) : isCacheHit ? (
                      <>
                        <Zap className="h-3 w-3 text-green-500" />
                        Instant result from cache
                      </>
                    ) : (
                      <>
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        Result from database
                      </>
                    )}
                  </div>
                )}

                {/* Cache warming status */}
                {isCacheWarming && (
                  <div className="text-xs text-orange-600 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Warming cache for faster searches...
                  </div>
                )}

                {/* Cache warming error */}
                {cacheWarmError && (
                  <div className="text-xs text-red-600 flex items-center gap-2">
                    ⚠️ Cache warming failed - searches may be slower
                  </div>
                )}

                {/* Selected Member Display */}
                {selectedMember && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {selectedMember.firstName} {selectedMember.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedMember.email} •{" "}
                          {selectedMember.membershipNumber}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearMemberSelection}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}

                {errors.memberId && (
                  <p className="text-sm text-red-500">
                    {errors.memberId.message}
                  </p>
                )}
              </div>

              {/* Quick Membership Plan Selection */}
              {membershipPlans?.data && (
                <div className="space-y-2">
                  <Label>Quick Select (Membership Plans)</Label>
                  <Select onValueChange={handleMembershipPlanSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a membership plan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {membershipPlans.data.map((plan: MembershipPlan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{plan.name}</span>
                            <span className="text-muted-foreground ml-2">
                              {formatCurrency(plan.price)} - {plan.duration}{" "}
                              days
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Selected Plan Details */}
                  {watch("membershipPlanId") && membershipPlans?.data && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      {(() => {
                        const selectedPlan = membershipPlans.data.find(
                          (p: MembershipPlan) =>
                            p.id === watch("membershipPlanId")
                        );
                        if (!selectedPlan) return null;

                        return (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-blue-900">
                                {selectedPlan.name}
                              </h4>
                              <span className="text-lg font-bold text-blue-900">
                                {formatCurrency(selectedPlan.price)}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-700 font-medium">
                                  Duration:
                                </span>
                                <span className="ml-1 text-blue-900">
                                  {selectedPlan.duration} days
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-700 font-medium">
                                  Access until:
                                </span>
                                <span className="ml-1 text-blue-900">
                                  {new Date(
                                    Date.now() +
                                      selectedPlan.duration *
                                        24 *
                                        60 *
                                        60 *
                                        1000
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {selectedPlan.features.length > 0 && (
                              <div className="pt-2 border-t border-blue-300">
                                <span className="text-blue-700 font-medium text-sm">
                                  Features:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedPlan.features.map(
                                    (feature: string, index: number) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                      >
                                        {feature}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-sm">
                              <span className="text-green-800 font-medium">
                                💡 Upon payment completion, member will receive{" "}
                                {selectedPlan.duration} days of access
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    {...register("amount", { valueAsNumber: true })}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
                {watchedAmount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatCurrency(watchedAmount)}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method *</Label>
                <Select
                  defaultValue="CASH"
                  onValueChange={(value: "CASH" | "CARD" | "BANK_TRANSFER") =>
                    setValue("method", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    {/* Mobile Money disabled - use STK Push instead */}
                  </SelectContent>
                </Select>
                {errors.method && (
                  <p className="text-sm text-red-500">
                    {errors.method.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  💡 For M-Pesa payments, use the &quot;Send Push&quot; button
                  to initiate STK Push
                </p>
              </div>

              {/* Transaction Reference (for non-cash payments) */}
              {watchedMethod !== "CASH" && (
                <div className="space-y-2">
                  <Label htmlFor="transactionRef">Transaction Reference</Label>
                  <Input
                    id="transactionRef"
                    placeholder="Enter transaction/reference number"
                    {...register("transactionRef")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional reference number for tracking
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description or notes about this payment"
                  rows={3}
                  {...register("description")}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={createPaymentMutation.isPending || !selectedMember}
                  className="flex-1"
                >
                  {createPaymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Record Payment
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendPush}
                  disabled={!selectedMember || watchedAmount <= 0}
                  className="px-3"
                  title={
                    !selectedMember || watchedAmount <= 0
                      ? "Select member and enter amount first"
                      : "Send M-Pesa STK Push to customer's phone"
                  }
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Send Push
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/payments")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Review the payment details before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member:</span>
                <span className="font-medium">
                  {selectedMember
                    ? `${selectedMember.firstName} ${selectedMember.lastName}`
                    : "No member selected"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium text-lg">
                  {watchedAmount > 0 ? formatCurrency(watchedAmount) : "$0.00"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium capitalize">
                  {watchedMethod?.toLowerCase().replace("_", " ") || "Cash"}
                </span>
              </div>

              {watch("description") && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground block mb-1">
                    Description:
                  </span>
                  <span className="text-sm">{watch("description")}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t space-y-2">
              <h4 className="font-medium">Quick Amount Presets</h4>
              <div className="grid grid-cols-2 gap-2">
                {[1000, 2000, 5000, 10000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("amount", amount)}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Push Notification Modal */}
      <PushNotificationModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        memberData={
          selectedMember
            ? {
                id: selectedMember.id,
                firstName: selectedMember.firstName,
                lastName: selectedMember.lastName,
                email: selectedMember.email,
                membershipNumber: selectedMember.membershipNumber,
                phoneNumber: undefined, // Will be entered in modal
              }
            : null
        }
        paymentData={{
          amount: watchedAmount,
          description: watch("description") || "",
          membershipPlanId: watch("membershipPlanId"),
        }}
        onSuccess={handlePushSuccess}
      />
    </div>
  );
}
