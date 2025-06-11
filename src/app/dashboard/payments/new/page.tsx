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
import { MpesaPaymentModal } from "@/components/ui/mpesa-payment-modal";
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
  CheckCircle,
  DollarSign,
  Loader2,
  Search,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof createPaymentSchema>;

interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  phoneNumber?: string;
}

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  features: string[];
  isActive: boolean;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const [showPushModal, setShowPushModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [isUsingMpesa, setIsUsingMpesa] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      method: "CASH",
      amount: 0,
      description: "",
    },
  });

  const createPaymentMutation = useCreatePayment();
  const { data: membershipPlansResponse } = useMembershipPlans();

  // Enhanced member search
  const { data: searchResults, isLoading: isSearching } =
    useEnhancedMemberSearch(searchQuery);

  useWarmMemberCache();

  const watchedAmount = watch("amount");
  const watchedMembershipPlanId = watch("membershipPlanId");

  // Extract membershipPlans from the response data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const membershipPlans = membershipPlansResponse?.data || [];

  // Find the selected membership plan
  const selectedPlan = useMemo(() => {
    if (!watchedMembershipPlanId) return null;
    return (
      membershipPlans.find(
        (plan: MembershipPlan) => plan.id === watchedMembershipPlanId
      ) || null
    );
  }, [watchedMembershipPlanId, membershipPlans]);

  // Auto-fill amount when plan is selected
  useEffect(() => {
    if (selectedPlan && selectedPlan.price !== watchedAmount) {
      setValue("amount", selectedPlan.price);
      setValue(
        "description",
        `${selectedPlan.name} - ${selectedPlan.duration} days membership`
      );
    }
  }, [selectedPlan, setValue, watchedAmount]);

  const handleMemberSelect = useCallback(
    (member: MemberData) => {
      console.log("🔍 Member selected:", JSON.stringify(member, null, 2));
      setSelectedMember(member);
      setValue("memberId", member.id);
      console.log("✅ Member ID set in form:", member.id);
      setSearchQuery(`${member.firstName} ${member.lastName}`);
    },
    [setValue]
  );

  const handlePushSuccess = useCallback(() => {
    setIsUsingMpesa(true);
    toast.success("M-Pesa STK Push sent successfully!", {
      description:
        "Customer will receive payment prompt. Check payments table to verify status.",
    });
  }, []);

  const handleSendPush = useCallback(() => {
    if (!selectedMember || watchedAmount <= 0) return;
    setShowPushModal(true);
  }, [selectedMember, watchedAmount]);

  const onSubmit = async (data: FormData) => {
    try {
      await createPaymentMutation.mutateAsync(data);
      toast.success("Payment recorded successfully!");
      reset();
      setSelectedMember(null);
      setSearchQuery("");
      setIsUsingMpesa(false);
      router.push("/dashboard/payments");
    } catch (error) {
      console.error("Failed to record payment:", error);
      toast.error("Failed to record payment");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Record Payment</h1>
          <p className="text-muted-foreground">
            Record a new payment or send M-Pesa STK Push
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter payment information or send M-Pesa request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Member Search */}
              <div className="space-y-2">
                <Label htmlFor="member-search">
                  Member <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="member-search"
                    placeholder="Search members by name, email, or membership number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                {searchQuery && (
                  <div className="border rounded-md max-h-48 overflow-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                        Searching...
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="p-1">
                        {searchResults.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => handleMemberSelect(member)}
                            className="w-full text-left p-2 hover:bg-muted rounded text-sm border-b last:border-b-0"
                          >
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-muted-foreground">
                              {member.email} • {member.membershipNumber}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        No members found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Member Display */}
                {selectedMember && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedMember.email} • {selectedMember.membershipNumber}
                      {selectedMember.phoneNumber && (
                        <> • {selectedMember.phoneNumber}</>
                      )}
                    </div>
                  </div>
                )}
                {errors.memberId && (
                  <p className="text-sm text-red-500">
                    {errors.memberId.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  value={watch("method")}
                  onValueChange={(value) =>
                    setValue("method", value as FormData["method"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
                {errors.method && (
                  <p className="text-sm text-red-500">
                    {errors.method.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount (KES) <span className="text-red-500">*</span>
                  {selectedPlan && (
                    <span className="ml-2 text-sm font-normal text-green-600">
                      (Auto-filled from selected plan)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("amount", { valueAsNumber: true })}
                    className={
                      selectedPlan ? "border-green-300 bg-green-50" : ""
                    }
                  />
                  {selectedPlan && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {selectedPlan && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Amount automatically set from {selectedPlan.name}
                  </div>
                )}
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Membership Plan */}
              <div className="space-y-2">
                <Label htmlFor="membershipPlanId">
                  Membership Plan {selectedPlan && "(Selected)"}
                </Label>
                <Select
                  value={watch("membershipPlanId") || ""}
                  onValueChange={(value) => {
                    setValue("membershipPlanId", value || undefined);
                    // Clear amount if plan is deselected
                    if (!value) {
                      setValue("amount", 0);
                      setValue("description", "");
                    }
                  }}
                >
                  <SelectTrigger
                    className={
                      selectedPlan ? "border-green-300 bg-green-50" : ""
                    }
                  >
                    <SelectValue placeholder="Select a membership plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 text-xs text-muted-foreground border-b">
                      Choose a plan to auto-fill amount and description
                    </div>
                    {membershipPlans.length === 0 ? (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        No membership plans available
                      </div>
                    ) : (
                      membershipPlans.map((plan: MembershipPlan) => (
                        <SelectItem
                          key={plan.id}
                          value={plan.id}
                          className="p-3"
                        >
                          <div className="flex flex-col gap-1 w-full min-w-0">
                            <div
                              className="font-medium truncate max-w-[250px]"
                              title={plan.name}
                            >
                              {plan.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                              <span className="font-medium">
                                {formatCurrency(plan.price)}
                              </span>
                              <span>•</span>
                              <span>{plan.duration} days</span>
                              {plan.description && (
                                <>
                                  <span>•</span>
                                  <span
                                    className="truncate max-w-[150px]"
                                    title={plan.description}
                                  >
                                    {plan.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {/* Selected Plan Details */}
                {selectedPlan && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-medium text-green-800 mb-2 truncate"
                          title={selectedPlan.name}
                        >
                          {selectedPlan.name}
                        </div>
                        <div className="text-sm text-green-700 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-green-600">
                                Duration:
                              </span>
                              <span className="font-medium">
                                {selectedPlan.duration} days
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-green-600">
                                Price:
                              </span>
                              <span className="font-bold text-lg">
                                {formatCurrency(selectedPlan.price)}
                              </span>
                            </div>
                          </div>
                          {selectedPlan.description && (
                            <div className="text-xs text-green-600 p-2 bg-green-100 rounded">
                              <div className="font-medium mb-1">
                                Description:
                              </div>
                              <div
                                className="text-xs leading-relaxed overflow-hidden"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  maxHeight: "2.4em",
                                }}
                                title={selectedPlan.description}
                              >
                                {selectedPlan.description}
                              </div>
                            </div>
                          )}
                          {selectedPlan.features &&
                            selectedPlan.features.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-green-800 mb-1">
                                  Features:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {(selectedPlan.features as string[])
                                    .slice(0, 3)
                                    .map((feature: string, index: number) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 max-w-[120px] truncate"
                                        title={feature}
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                  {selectedPlan.features.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                      +{selectedPlan.features.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

              {/* M-Pesa Info */}
              {isUsingMpesa && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-green-800">
                        M-Pesa STK Push Sent Successfully
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Payment request delivered to customer&apos;s phone.
                        Check the payments table for real-time status updates.
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Next steps:</span>
                      <Link
                        href="/dashboard/payments"
                        className="text-green-600 hover:text-green-800 underline font-medium"
                      >
                        View Payments →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={
                    createPaymentMutation.isPending ||
                    !selectedMember ||
                    isUsingMpesa
                  }
                  className="flex-1 min-w-0"
                  title={
                    isUsingMpesa
                      ? "M-Pesa payments are recorded automatically"
                      : !selectedMember
                      ? "Select a member first"
                      : undefined
                  }
                >
                  {createPaymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                      <span className="truncate">Recording...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Record Payment</span>
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendPush}
                  disabled={!selectedMember || watchedAmount <= 0}
                  className="min-w-0 sm:px-3"
                  title={
                    !selectedMember || watchedAmount <= 0
                      ? "Select member and enter amount first"
                      : "Send M-Pesa STK Push to customer's phone"
                  }
                >
                  <Smartphone className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate sm:hidden lg:inline">
                    Send M-Pesa
                  </span>
                  <span className="hidden sm:inline lg:hidden">M-Pesa</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/payments")}
                  className="min-w-0"
                >
                  <span className="truncate">Cancel</span>
                </Button>
              </div>
            </form>

            {/* Quick Amount Presets */}
            <div className="pt-4 border-t space-y-3">
              <h4 className="font-medium">Quick Amount Presets</h4>

              {/* Membership Plan Prices */}
              {membershipPlans.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Membership Plans:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {membershipPlans.slice(0, 4).map((plan: MembershipPlan) => (
                      <Button
                        key={plan.id}
                        type="button"
                        variant={
                          selectedPlan?.id === plan.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setValue("membershipPlanId", plan.id);
                          setValue("amount", plan.price);
                          setValue(
                            "description",
                            `${plan.name} - ${plan.duration} days membership`
                          );
                        }}
                        className={`${
                          selectedPlan?.id === plan.id
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        } h-auto p-3 flex flex-col items-start gap-1 min-h-[60px]`}
                      >
                        <div className="w-full text-left">
                          <div
                            className="text-xs font-normal truncate max-w-full"
                            title={plan.name}
                          >
                            {plan.name}
                          </div>
                          <div className="font-medium text-sm">
                            {formatCurrency(plan.price)}
                          </div>
                          <div className="text-xs opacity-75">
                            {plan.duration} days
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Presets */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Standard Amounts:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1000, 2000, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setValue("amount", amount);
                        // Clear membership plan selection when using custom amount
                        if (selectedPlan) {
                          setValue("membershipPlanId", undefined);
                          setValue("description", "");
                        }
                      }}
                      className="h-auto p-3 flex flex-col items-center gap-1 min-h-[50px]"
                    >
                      <span className="font-medium text-sm">
                        {formatCurrency(amount)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Selection */}
              {(selectedPlan || watchedAmount > 0) && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setValue("membershipPlanId", undefined);
                      setValue("amount", 0);
                      setValue("description", "");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Push Notification Modal */}
      <MpesaPaymentModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        memberData={selectedMember}
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
