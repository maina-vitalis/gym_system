import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let action = "unknown"; // Default value for error handling

  try {
    const params = await context.params;
    const memberId = params.id;
    const body = await request.json();
    action = body.action;
    const reason = body.reason;

    if (!["suspend", "unsuspend"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'suspend' or 'unsuspend'" },
        { status: 400 }
      );
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        membershipSubscriptions: {
          where: { isActive: true },
          include: {
            membershipPlan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    let newStatus: "SUSPENDED" | "ACTIVE" | "EXPIRED" | "INACTIVE";
    let statusReason = reason || "";

    if (action === "suspend") {
      newStatus = "SUSPENDED";
      statusReason = reason || "Manually suspended by admin";
    } else {
      // Unsuspend - determine appropriate status based on subscriptions
      const hasActiveSubscription = member.membershipSubscriptions.some(
        (sub) => sub.isActive && new Date(sub.endDate) > new Date()
      );
      const hasExpiredSubscription = member.membershipSubscriptions.length > 0;

      if (hasActiveSubscription) {
        newStatus = "ACTIVE";
      } else if (hasExpiredSubscription) {
        newStatus = "EXPIRED";
      } else {
        newStatus = "INACTIVE";
      }
      statusReason = "Suspension lifted by admin";
    }

    // Update member status
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        membershipStatus: newStatus,
        healthConditions: statusReason, // Store reason in notes field
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        membershipSubscriptions: {
          where: { isActive: true },
          include: {
            membershipPlan: {
              select: {
                name: true,
                duration: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: `Member ${action}ed successfully`,
      member: updatedMember,
      action,
      reason: statusReason,
    });
  } catch (error) {
    console.error(`Failed to ${action} member:`, error);
    return NextResponse.json(
      { error: `Failed to ${action} member` },
      { status: 500 }
    );
  }
}
