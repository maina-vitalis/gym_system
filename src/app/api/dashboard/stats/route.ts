import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get current date for monthly calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch all required data in parallel
    const [
      totalMembers,
      activeMembers,
      expiredMembers,
      suspendedMembers,
      inactiveMembers,
      totalRevenue,
      monthlyRevenue,
      pendingPayments,
      failedPayments,
      recentMembers,
      recentPayments,
      upcomingExpirations,
    ] = await Promise.all([
      // Total members count
      prisma.member.count(),

      // Active members count
      prisma.member.count({
        where: { membershipStatus: "ACTIVE" },
      }),

      // Expired members count
      prisma.member.count({
        where: { membershipStatus: "EXPIRED" },
      }),

      // Suspended members count
      prisma.member.count({
        where: { membershipStatus: "SUSPENDED" },
      }),

      // Inactive members count
      prisma.member.count({
        where: { membershipStatus: "INACTIVE" },
      }),

      // Total revenue from completed payments
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),

      // Monthly revenue from completed payments
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          paidAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { amount: true },
      }),

      // Pending payments count
      prisma.payment.count({
        where: { status: "PENDING" },
      }),

      // Failed payments count
      prisma.payment.count({
        where: { status: "FAILED" },
      }),

      // Recent members (last 5)
      prisma.member.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      // Recent payments (last 5)
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { status: "COMPLETED" },
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
          membershipPlan: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Upcoming subscription expirations (next 30 days)
      prisma.membershipSubscription.findMany({
        where: {
          isActive: true,
          endDate: {
            gte: now,
            lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          },
        },
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
          membershipPlan: {
            select: {
              name: true,
              price: true,
            },
          },
        },
        orderBy: { endDate: "asc" },
        take: 10,
      }),
    ]);

    // Calculate growth percentages (comparing to previous month)
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [previousMonthMembers, previousMonthRevenue] = await Promise.all([
      prisma.member.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          paidAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const currentMonthMembers = await prisma.member.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Calculate growth percentages
    const memberGrowth =
      previousMonthMembers > 0
        ? ((currentMonthMembers - previousMonthMembers) /
            previousMonthMembers) *
          100
        : 0;

    const revenueGrowth =
      (previousMonthRevenue._sum.amount || 0) > 0
        ? (((monthlyRevenue._sum.amount || 0) -
            (previousMonthRevenue._sum.amount || 0)) /
            (previousMonthRevenue._sum.amount || 0)) *
          100
        : 0;

    // Format recent activities
    const recentActivities = [
      ...recentMembers.map((member) => ({
        id: `member-${member.id}`,
        type: "member_joined" as const,
        member: `${member.user.firstName} ${member.user.lastName}`,
        timestamp: member.createdAt,
        description: "New member registration",
      })),
      ...recentPayments.map((payment) => ({
        id: `payment-${payment.id}`,
        type: "payment_received" as const,
        member: payment.member
          ? `${payment.member.user.firstName} ${payment.member.user.lastName}`
          : "Unknown",
        amount: payment.amount,
        timestamp: payment.createdAt,
        description: payment.membershipPlan?.name
          ? `${payment.membershipPlan.name} payment`
          : "Payment received",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    // Format upcoming renewals
    const upcomingRenewals = upcomingExpirations.map((subscription) => ({
      id: subscription.id,
      name: `${subscription.member.user.firstName} ${subscription.member.user.lastName}`,
      date: subscription.endDate,
      amount: subscription.membershipPlan.price,
      plan: subscription.membershipPlan.name,
      daysRemaining: Math.ceil(
        (new Date(subscription.endDate).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    }));

    const stats = {
      totalMembers,
      activeMembers,
      expiredMembers,
      suspendedMembers,
      inactiveMembers,
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      pendingPayments,
      failedPayments,
      memberGrowth: Math.round(memberGrowth * 10) / 10, // Round to 1 decimal
      revenueGrowth: Math.round(revenueGrowth * 10) / 10, // Round to 1 decimal
      recentActivities,
      upcomingRenewals,
      // Additional metrics
      membershipStatusBreakdown: {
        active: activeMembers,
        expired: expiredMembers,
        suspended: suspendedMembers,
        inactive: inactiveMembers,
      },
      paymentStats: {
        totalCompleted: await prisma.payment.count({
          where: { status: "COMPLETED" },
        }),
        totalPending: pendingPayments,
        totalFailed: failedPayments,
        totalRefunded: await prisma.payment.count({
          where: { status: "REFUNDED" },
        }),
      },
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
