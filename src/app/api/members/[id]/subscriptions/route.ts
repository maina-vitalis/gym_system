import { prisma } from "@/lib/prisma";
import {
  calculateDaysRemaining,
  calculateExpirationDate,
} from "@/lib/validations/membership-plan";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSubscriptionSchema = z.object({
  membershipPlanId: z.string().min(1, "Membership plan ID is required"),
  paymentId: z.string().optional(),
  startDate: z.string().optional(),
  autoRenew: z.boolean().default(false),
});

// GET /api/members/[id]/subscriptions - Get member's subscriptions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeExpired = searchParams.get("includeExpired") === "true";

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const where: { memberId: string; endDate?: { gte: Date } } = {
      memberId: id,
    };
    if (!includeExpired) {
      where.endDate = { gte: new Date() };
    }

    const subscriptions = await prisma.membershipSubscription.findMany({
      where,
      include: {
        membershipPlan: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            features: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            paidAt: true,
            transactionRef: true,
          },
        },
      },
      orderBy: {
        endDate: "desc",
      },
    });

    // Calculate remaining days for each subscription
    const subscriptionsWithDays = subscriptions.map((subscription) => {
      const daysRemaining = calculateDaysRemaining(subscription.endDate);
      const isExpired = daysRemaining <= 0;
      const isActive = subscription.isActive && !isExpired;

      return {
        ...subscription,
        daysRemaining,
        isExpired,
        isCurrentlyActive: isActive,
        status: isExpired ? "EXPIRED" : isActive ? "ACTIVE" : "INACTIVE",
      };
    });

    // Find the current active subscription
    const currentSubscription = subscriptionsWithDays.find(
      (sub) => sub.isCurrentlyActive
    );

    return NextResponse.json({
      data: {
        subscriptions: subscriptionsWithDays,
        currentSubscription: currentSubscription || null,
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: subscriptionsWithDays.filter(
          (sub) => sub.isCurrentlyActive
        ).length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch member subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch member subscriptions" },
      { status: 500 }
    );
  }
}

// POST /api/members/[id]/subscriptions - Create a new subscription
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createSubscriptionSchema.parse(body);

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id },
      select: { id: true, membershipNumber: true },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check if membership plan exists
    const membershipPlan = await prisma.membershipPlan.findUnique({
      where: { id: validatedData.membershipPlanId },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        isActive: true,
      },
    });

    if (!membershipPlan) {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }

    if (!membershipPlan.isActive) {
      return NextResponse.json(
        { error: "Cannot subscribe to an inactive membership plan" },
        { status: 400 }
      );
    }

    // Validate payment if provided
    if (validatedData.paymentId) {
      const payment = await prisma.payment.findUnique({
        where: { id: validatedData.paymentId },
        select: {
          id: true,
          status: true,
          membershipSubscription: true,
        },
      });

      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        );
      }

      if (payment.status !== "COMPLETED") {
        return NextResponse.json(
          { error: "Payment must be completed before creating subscription" },
          { status: 400 }
        );
      }

      if (payment.membershipSubscription) {
        return NextResponse.json(
          { error: "Payment is already linked to another subscription" },
          { status: 400 }
        );
      }
    }

    // Calculate subscription dates
    const startDate = validatedData.startDate
      ? new Date(validatedData.startDate)
      : new Date();
    const endDate = calculateExpirationDate(startDate, membershipPlan.duration);

    // Create the subscription
    const subscription = await prisma.membershipSubscription.create({
      data: {
        memberId: id,
        membershipPlanId: validatedData.membershipPlanId,
        startDate,
        endDate,
        autoRenew: validatedData.autoRenew,
        paymentId: validatedData.paymentId,
      },
      include: {
        membershipPlan: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            features: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            paidAt: true,
            transactionRef: true,
          },
        },
      },
    });

    // Deactivate other active subscriptions for this member
    await prisma.membershipSubscription.updateMany({
      where: {
        memberId: id,
        id: {
          not: subscription.id,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Calculate remaining days
    const daysRemaining = calculateDaysRemaining(subscription.endDate);

    return NextResponse.json(
      {
        data: {
          ...subscription,
          daysRemaining,
          isExpired: daysRemaining <= 0,
          isCurrentlyActive: subscription.isActive && daysRemaining > 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create subscription:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
