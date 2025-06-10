import { prisma } from "@/lib/prisma";
import { memberFormSchema } from "@/lib/validations/member";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Helper function to calculate days remaining
function calculateDaysRemaining(endDate: Date): number {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// GET /api/members - Get all members with subscription info
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        membershipSubscriptions: {
          where: {
            isActive: true,
          },
          include: {
            membershipPlan: {
              select: {
                id: true,
                name: true,
                duration: true,
                price: true,
              },
            },
            payment: {
              select: {
                id: true,
                amount: true,
                paidAt: true,
                transactionRef: true,
              },
            },
          },
          orderBy: {
            endDate: "desc",
          },
          take: 1,
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paidAt: true,
            status: true,
          },
          orderBy: {
            paidAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enhance members with calculated fields
    const enhancedMembers = members.map((member) => {
      const activeSubscription = member.membershipSubscriptions[0];
      const lastPayment = member.payments[0];

      let daysRemaining = 0;
      let subscriptionStatus = "INACTIVE";
      let subscriptionEndDate = null;

      if (activeSubscription) {
        daysRemaining = calculateDaysRemaining(
          new Date(activeSubscription.endDate)
        );
        subscriptionEndDate = activeSubscription.endDate;

        if (daysRemaining > 0) {
          subscriptionStatus = "ACTIVE";
        } else {
          subscriptionStatus = "EXPIRED";
        }
      }

      return {
        ...member,
        daysRemaining,
        subscriptionStatus,
        subscriptionEndDate,
        currentPlan: activeSubscription?.membershipPlan || null,
        lastPaymentDate: lastPayment?.paidAt || null,
        lastPaymentAmount: lastPayment?.amount || null,
      };
    });

    return NextResponse.json({ data: enhancedMembers });
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// POST /api/members - Create a new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = memberFormSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    // Create user and member in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user first
      const user = await tx.user.create({
        data: {
          email: validatedData.email.toLowerCase().trim(),
          firstName: validatedData.firstName.trim(),
          lastName: validatedData.lastName.trim(),
          phoneNumber: validatedData.phoneNumber?.trim() || null,
          name: `${validatedData.firstName.trim()} ${validatedData.lastName.trim()}`,
          role: "MEMBER",
        },
      });

      // Generate membership number
      const memberCount = await tx.member.count();
      const membershipNumber = `GYM${(memberCount + 1)
        .toString()
        .padStart(4, "0")}`;

      // Create the member
      const member = await tx.member.create({
        data: {
          userId: user.id,
          dateOfBirth: validatedData.dateOfBirth
            ? new Date(validatedData.dateOfBirth)
            : null,
          gender: validatedData.gender || null,
          address: validatedData.address?.trim() || null,
          emergencyContactName:
            validatedData.emergencyContactName?.trim() || null,
          emergencyContactPhone:
            validatedData.emergencyContactPhone?.trim() || null,
          healthConditions: validatedData.healthConditions?.trim() || null,
          fitnessGoals: validatedData.fitnessGoals?.trim() || null,
          membershipNumber,
          membershipStatus: "INACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      });

      return member;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("Failed to create member:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint violations
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
