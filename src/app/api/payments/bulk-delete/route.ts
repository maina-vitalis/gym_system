import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { paymentIds } = await request.json();

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return NextResponse.json(
        { error: "Payment IDs array is required" },
        { status: 400 }
      );
    }

    // Check if any payments are linked to subscriptions
    const paymentsWithSubscriptions = await prisma.payment.findMany({
      where: {
        id: { in: paymentIds },
        membershipSubscription: { isNot: null },
      },
      include: {
        membershipSubscription: true,
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (paymentsWithSubscriptions.length > 0) {
      const linkedPayments = paymentsWithSubscriptions.map((p) => ({
        id: p.id,
        memberName: `${p.member?.user.firstName} ${p.member?.user.lastName}`,
        amount: p.amount,
      }));

      return NextResponse.json(
        {
          error:
            "Some payments are linked to active subscriptions and cannot be deleted",
          linkedPayments,
        },
        { status: 400 }
      );
    }

    // Get payment details before deletion for response
    const paymentsToDelete = await prisma.payment.findMany({
      where: { id: { in: paymentIds } },
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Delete the payments
    const deleteResult = await prisma.payment.deleteMany({
      where: { id: { in: paymentIds } },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.count} payment(s)`,
      deletedCount: deleteResult.count,
      deletedPayments: paymentsToDelete.map((p) => ({
        id: p.id,
        memberName: p.member
          ? `${p.member.user.firstName} ${p.member.user.lastName}`
          : "Unknown",
        amount: p.amount,
        method: p.method,
        paidAt: p.paidAt,
      })),
    });
  } catch (error) {
    console.error("Failed to bulk delete payments:", error);
    return NextResponse.json(
      { error: "Failed to delete payments" },
      { status: 500 }
    );
  }
}
