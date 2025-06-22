"use client";

import { Label } from "@/components/ui/label";
import { MpesaPaymentModal } from "@/components/ui/mpesa-payment-modal";
import { Textarea } from "@/components/ui/textarea";
import { useWarmMemberCache } from "@/hooks/use-member-search";
import { useCreatePayment, useMembershipPlans } from "@/hooks/use-payments";
import {
  CreatePaymentFormData,
  createPaymentSchema,
} from "@/lib/validations/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AmountInput } from "./amount-input";
import { MemberSearch } from "./member-search";
import { MembershipPlanSelector } from "./membership-plan-selector";
import { PaymentFormActions } from "./payment-form-actions";
import { PaymentMethodSelector } from "./payment-method-selector";
import { PaymentStatusIndicator } from "./payment-status-indicator";
import { QuickAmountPresets } from "./quick-amount-presets";
import { MemberData, MembershipPlan } from "./types";

export function PaymentForm() {
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
  } = useForm<CreatePaymentFormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      method: "CASH",
      amount: 0,
      description: "",
    },
  });

  const createPaymentMutation = useCreatePayment();
  const { data: membershipPlansResponse } = useMembershipPlans();

  useWarmMemberCache();

  const watchedAmount = watch("amount");
  const watchedMembershipPlanId = watch("membershipPlanId");

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

  const onSubmit = async (data: CreatePaymentFormData) => {
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

  const handlePlanSelect = (
    planId: string,
    amount: number,
    description: string
  ) => {
    setValue("membershipPlanId", planId);
    setValue("amount", amount);
    setValue("description", description);
  };

  const handleAmountSelect = (amount: number) => {
    setValue("amount", amount);
    // Clear membership plan selection when using custom amount
    if (selectedPlan) {
      setValue("membershipPlanId", undefined);
      setValue("description", "");
    }
  };

  const handleClearSelection = () => {
    setValue("membershipPlanId", undefined);
    setValue("amount", 0);
    setValue("description", "");
  };

  const handlePlanChange = (planId: string | undefined) => {
    setValue("membershipPlanId", planId);
    // Clear amount if plan is deselected
    if (!planId) {
      setValue("amount", 0);
      setValue("description", "");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <MemberSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedMember={selectedMember}
          onMemberSelect={handleMemberSelect}
          error={errors.memberId?.message}
        />

        <PaymentMethodSelector
          value={watch("method")}
          onValueChange={(value) => setValue("method", value)}
          error={errors.method?.message}
        />

        <MembershipPlanSelector
          membershipPlans={membershipPlans}
          selectedPlanId={watchedMembershipPlanId}
          selectedPlan={selectedPlan}
          onPlanChange={handlePlanChange}
          formatCurrency={formatCurrency}
        />

        <AmountInput
          {...register("amount", { valueAsNumber: true })}
          value={watchedAmount}
          onChange={(value) => setValue("amount", value)}
          selectedPlan={selectedPlan}
          error={errors.amount?.message}
        />

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

        <PaymentStatusIndicator isUsingMpesa={isUsingMpesa} />

        <PaymentFormActions
          isSubmitting={createPaymentMutation.isPending}
          selectedMember={selectedMember}
          isUsingMpesa={isUsingMpesa}
          watchedAmount={watchedAmount}
          onSendPush={handleSendPush}
        />
      </form>

      <QuickAmountPresets
        membershipPlans={membershipPlans}
        selectedPlan={selectedPlan}
        currentAmount={watchedAmount}
        onPlanSelect={handlePlanSelect}
        onAmountSelect={handleAmountSelect}
        onClearSelection={handleClearSelection}
        formatCurrency={formatCurrency}
      />

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
    </>
  );
}
