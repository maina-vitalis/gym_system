import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper function to calculate days remaining
function calculateDaysRemaining(endDate: Date): number {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Helper function to determine member status
function determineMemberStatus(
  subscription: { endDate: Date } | null
): "ACTIVE" | "EXPIRED" | "SUSPENDED" | "INACTIVE" {
  if (!subscription) return "INACTIVE";

  const daysRemaining = calculateDaysRemaining(subscription.endDate);

  if (daysRemaining > 0) {
    return "ACTIVE";
  } else if (daysRemaining === 0) {
    return "EXPIRED";
  } else {
    return "EXPIRED";
  }
}

// GET /api/members/status - Update all member statuses and return summary
export async function GET() {
  try {
    // Get all members with their active subscriptions
    const members = await prisma.member.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        membershipSubscriptions: {
          where: {
            isActive: true,
          },
          include: {
            membershipPlan: {
              select: {
                name: true,
                duration: true,
              },
            },
          },
          orderBy: {
            endDate: "desc",
          },
          take: 1,
        },
      },
    });

    const updates = [];
    const statusSummary = {
      active: 0,
      expired: 0,
      inactive: 0,
      suspended: 0,
    };

    // Process each member
    for (const member of members) {
      const activeSubscription = member.membershipSubscriptions[0];
      const newStatus = determineMemberStatus(activeSubscription);

      // Update member status if it has changed
      if (member.membershipStatus !== newStatus) {
        await prisma.member.update({
          where: { id: member.id },
          data: { membershipStatus: newStatus },
        });

        updates.push({
          memberId: member.id,
          memberName: `${member.user.firstName} ${member.user.lastName}`,
          oldStatus: member.membershipStatus,
          newStatus,
        });
      }

      // Count statuses
      statusSummary[newStatus.toLowerCase() as keyof typeof statusSummary]++;

      // Deactivate expired subscriptions
      if (activeSubscription && newStatus === "EXPIRED") {
        await prisma.membershipSubscription.update({
          where: { id: activeSubscription.id },
          data: { isActive: false },
        });
      }
    }

    return NextResponse.json({
      message: "Member statuses updated successfully",
      updates,
      summary: statusSummary,
      totalMembers: members.length,
    });
  } catch (error) {
    console.error("Failed to update member statuses:", error);
    return NextResponse.json(
      { error: "Failed to update member statuses" },
      { status: 500 }
    );
  }
}

// POST /api/members/status - Manually update a specific member's status
export async function POST(request: NextRequest) {
  try {
    const { memberId, status, reason } = await request.json();

    if (!memberId || !status) {
      return NextResponse.json(
        { error: "Member ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "EXPIRED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: " + validStatuses.join(", "),
        },
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
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Update member status
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        membershipStatus: status,
        ...(reason && { healthConditions: reason }), // Store reason in notes field if provided
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
      message: "Member status updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Failed to update member status:", error);
    return NextResponse.json(
      { error: "Failed to update member status" },
      { status: 500 }
    );
  }
}
