import { prisma } from "@/lib/prisma";
import { calculateExpirationDate } from "@/lib/validations/membership-plan";
import { createPaymentSchema } from "@/lib/validations/payment";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// Helper function to determine member status based on subscription
function determineMemberStatus(
  hasActiveSubscription: boolean,
  hasExpiredSubscription: boolean,
): "ACTIVE" | "EXPIRED" | "INACTIVE" {
  if (hasActiveSubscription) return "ACTIVE";
  if (hasExpiredSubscription) return "EXPIRED";
  return "INACTIVE";
}

// GET /api/payments - Get payments with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const status = searchParams.get("status");
    const method = searchParams.get("method");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: {
      memberId?: string;
      status?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
      method?: "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (memberId) {
      where.memberId = memberId;
    }

    if (status) {
      where.status = status as "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    }

    if (method) {
      where.method = method as
        | "CASH"
        | "CARD"
        | "BANK_TRANSFER"
        | "MOBILE_MONEY";
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          member: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          membershipPlan: {
            select: {
              name: true,
              price: true,
              duration: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({
      data: payments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: validatedData.memberId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    let membershipPlan = null;
    // Check if membership plan exists (if provided)
    if (validatedData.membershipPlanId) {
      membershipPlan = await prisma.membershipPlan.findUnique({
        where: { id: validatedData.membershipPlanId },
      });

      if (!membershipPlan) {
        return NextResponse.json(
          { error: "Membership plan not found" },
          { status: 404 },
        );
      }
    }

    // Generate unique transaction reference if not provided
    let transactionRef = validatedData.transactionRef;
    if (!transactionRef) {
      transactionRef = `GYM-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }

    // Check if transaction reference already exists
    if (transactionRef) {
      const existingPayment = await prisma.payment.findUnique({
        where: { transactionRef },
      });

      if (existingPayment) {
        return NextResponse.json(
          { error: "Transaction reference already exists" },
          { status: 409 },
        );
      }
    }

    // Use a transaction to create payment and potentially a subscription
    const result = await prisma.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.payment.create({
        data: {
          memberId: validatedData.memberId,
          amount: validatedData.amount,
          method: validatedData.method,
          status: "COMPLETED", // Default to completed for manual entries
          description: validatedData.description,
          membershipPlanId: validatedData.membershipPlanId,
          transactionRef,
          paidAt: new Date(),
        },
      });

      // If this payment is for a membership plan, create a subscription
      if (membershipPlan) {
        // Check for existing active subscription
        const existingActiveSubscription =
          await tx.membershipSubscription.findFirst({
            where: {
              memberId: validatedData.memberId,
              isActive: true,
            },
          });

        let startDate = new Date();
        let endDate: Date;

        if (
          existingActiveSubscription &&
          existingActiveSubscription.endDate > new Date()
        ) {
          // Member has an active subscription with remaining days
          // Start the new subscription from the end of the current one
          startDate = existingActiveSubscription.endDate;
          endDate = calculateExpirationDate(startDate, membershipPlan.duration);

          console.log(
            `🔄 Extending existing subscription for member ${
              member.user.firstName
            } ${
              member.user.lastName
            }. Current ends: ${existingActiveSubscription.endDate.toISOString()}, New ends: ${endDate.toISOString()}`,
          );

          // Deactivate the existing subscription
          await tx.membershipSubscription.update({
            where: { id: existingActiveSubscription.id },
            data: { isActive: false },
          });
        } else {
          // No active subscription or expired subscription
          // Deactivate any existing subscriptions
          await tx.membershipSubscription.updateMany({
            where: {
              memberId: validatedData.memberId,
              isActive: true,
            },
            data: {
              isActive: false,
            },
          });

          // Start immediately
          endDate = calculateExpirationDate(startDate, membershipPlan.duration);

          console.log(
            `🆕 Creating new subscription for member ${member.user.firstName} ${
              member.user.lastName
            }. Starts: ${startDate.toISOString()}, Ends: ${endDate.toISOString()}`,
          );
        }

        // Create new subscription
        await tx.membershipSubscription.create({
          data: {
            memberId: validatedData.memberId,
            membershipPlanId: validatedData.membershipPlanId!,
            paymentId: payment.id,
            startDate,
            endDate,
            isActive: true,
            autoRenew: false,
          },
        });

        // Update member status to ACTIVE since they have a new subscription
        await tx.member.update({
          where: { id: validatedData.memberId },
          data: {
            membershipStatus: "ACTIVE",
          },
        });
      } else {
        // For non-membership payments, update member status based on current subscriptions
        const activeSubscriptions = await tx.membershipSubscription.findMany({
          where: {
            memberId: validatedData.memberId,
            isActive: true,
            endDate: {
              gte: new Date(),
            },
          },
        });

        const expiredSubscriptions = await tx.membershipSubscription.findMany({
          where: {
            memberId: validatedData.memberId,
            OR: [{ isActive: false }, { endDate: { lt: new Date() } }],
          },
        });

        const newStatus = determineMemberStatus(
          activeSubscriptions.length > 0,
          expiredSubscriptions.length > 0,
        );

        await tx.member.update({
          where: { id: validatedData.memberId },
          data: {
            membershipStatus: newStatus,
          },
        });
      }

      // Fetch the complete payment with relationships
      return await tx.payment.findUnique({
        where: { id: payment.id },
        include: {
          member: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          membershipPlan: {
            select: {
              name: true,
              price: true,
              duration: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("Failed to create payment:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Transaction reference already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
