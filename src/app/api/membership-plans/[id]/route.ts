import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Membership plan update schema
const updateMembershipPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().optional(),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration cannot exceed 10 years")
    .optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/membership-plans/[id] - Get a specific membership plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const membershipPlan = await prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
            payments: true,
          },
        },
      },
    });

    if (!membershipPlan) {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }

    // Get additional statistics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentRevenue, recentPayments, activeMembers] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          membershipPlanId: id,
          status: "COMPLETED",
          paidAt: {
            gte: thirtyDaysAgo,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.payment.count({
        where: {
          membershipPlanId: id,
          status: "COMPLETED",
          paidAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.member.count({
        where: {
          memberships: {
            some: {
              id: id,
            },
          },
          membershipStatus: "ACTIVE",
        },
      }),
    ]);

    const planWithStats = {
      ...membershipPlan,
      stats: {
        totalMembers: membershipPlan._count.members,
        activeMembers,
        totalPayments: membershipPlan._count.payments,
        revenueLastMonth: recentRevenue._sum.amount || 0,
        paymentsLastMonth: recentPayments,
      },
    };

    return NextResponse.json({ data: planWithStats });
  } catch (error) {
    console.error("Failed to fetch membership plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch membership plan" },
      { status: 500 }
    );
  }
}

// PUT /api/membership-plans/[id] - Update a membership plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateMembershipPlanSchema.parse(body);

    // Check if plan exists
    const existingPlan = await prisma.membershipPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it conflicts with another plan
    if (validatedData.name && validatedData.name !== existingPlan.name) {
      const nameConflict = await prisma.membershipPlan.findFirst({
        where: {
          name: {
            equals: validatedData.name,
            mode: "insensitive",
          },
          id: {
            not: id,
          },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: "A membership plan with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update the plan
    const updatedPlan = await prisma.membershipPlan.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name.trim() }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description?.trim() || null,
        }),
        ...(validatedData.duration && { duration: validatedData.duration }),
        ...(validatedData.price !== undefined && {
          price: validatedData.price,
        }),
        ...(validatedData.features && { features: validatedData.features }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
      },
    });

    return NextResponse.json({ data: updatedPlan });
  } catch (error) {
    console.error("Failed to update membership plan:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update membership plan" },
      { status: 500 }
    );
  }
}

// DELETE /api/membership-plans/[id] - Delete a membership plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if plan exists
    const existingPlan = await prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
            payments: true,
          },
        },
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }

    // Check if plan has associated members or payments
    if (existingPlan._count.members > 0 || existingPlan._count.payments > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete membership plan with associated members or payments",
          details: {
            members: existingPlan._count.members,
            payments: existingPlan._count.payments,
          },
        },
        { status: 409 }
      );
    }

    // Delete the plan
    await prisma.membershipPlan.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Membership plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete membership plan:", error);
    return NextResponse.json(
      { error: "Failed to delete membership plan" },
      { status: 500 }
    );
  }
}
