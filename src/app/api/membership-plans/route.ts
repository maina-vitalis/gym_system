import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Membership plan schema for validation
const membershipPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").max(100, "Name too long"),
  description: z.string().optional(),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration cannot exceed 10 years"),
  price: z.number().min(0, "Price cannot be negative"),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

// GET /api/membership-plans - Get all membership plans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const where = includeInactive ? {} : { isActive: true };

    const membershipPlans = await prisma.membershipPlan.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        features: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            members: true,
            payments: true,
          },
        },
      },
      where,
      orderBy: [{ isActive: "desc" }, { price: "asc" }],
    });

    // Calculate additional statistics for each plan
    const plansWithStats = await Promise.all(
      membershipPlans.map(async (plan) => {
        // Get revenue for this plan in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRevenue = await prisma.payment.aggregate({
          where: {
            membershipPlanId: plan.id,
            status: "COMPLETED",
            paidAt: {
              gte: thirtyDaysAgo,
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          ...plan,
          stats: {
            totalMembers: plan._count.members,
            totalPayments: plan._count.payments,
            revenueLastMonth: recentRevenue._sum.amount || 0,
          },
        };
      })
    );

    return NextResponse.json({ data: plansWithStats });
  } catch (error) {
    console.error("Failed to fetch membership plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch membership plans" },
      { status: 500 }
    );
  }
}

// POST /api/membership-plans - Create a new membership plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = membershipPlanSchema.parse(body);

    // Check if a plan with the same name already exists
    const existingPlan = await prisma.membershipPlan.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: "insensitive",
        },
      },
    });

    if (existingPlan) {
      return NextResponse.json(
        { error: "A membership plan with this name already exists" },
        { status: 409 }
      );
    }

    const membershipPlan = await prisma.membershipPlan.create({
      data: {
        name: validatedData.name.trim(),
        description: validatedData.description?.trim(),
        duration: validatedData.duration,
        price: validatedData.price,
        features: validatedData.features,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({ data: membershipPlan }, { status: 201 });
  } catch (error) {
    console.error("Failed to create membership plan:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create membership plan" },
      { status: 500 }
    );
  }
}
