import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/payments/reports - Generate payment reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'monthly' or 'member'
    const memberId = searchParams.get("memberId");
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString()
    );
    const month = parseInt(
      searchParams.get("month") || (new Date().getMonth() + 1).toString()
    );

    if (type === "monthly") {
      return await generateMonthlyReport(year, month);
    } else if (type === "member" && memberId) {
      return await generateMemberReport(memberId, year, month);
    } else {
      return NextResponse.json(
        { error: "Invalid report type or missing parameters" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to generate report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

// Generate monthly revenue report
async function generateMonthlyReport(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Get all payments for the month
  const payments = await prisma.payment.findMany({
    where: {
      status: "COMPLETED",
      paidAt: {
        gte: startDate,
        lte: endDate,
      },
    },
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
        },
      },
    },
    orderBy: {
      paidAt: "desc",
    },
  });

  // Calculate summary statistics
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalTransactions = payments.length;
  const averageTransaction =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Group by payment method
  const byMethod = payments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group by membership plan
  const byPlan = payments.reduce((acc, payment) => {
    const planName = payment.membershipPlan?.name || "Other";
    acc[planName] = (acc[planName] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  // Daily breakdown
  const dailyBreakdown = payments.reduce((acc, payment) => {
    const day = payment.paidAt?.toISOString().split("T")[0] || "";
    acc[day] = (acc[day] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  // Top paying members
  const memberPayments = payments.reduce((acc, payment) => {
    const memberKey = `${payment.member?.user.firstName} ${payment.member?.user.lastName}`;
    acc[memberKey] = (acc[memberKey] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const topMembers = Object.entries(memberPayments)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, amount]) => ({ name, amount }));

  const report = {
    period: {
      year,
      month,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    summary: {
      totalRevenue,
      totalTransactions,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
    },
    breakdown: {
      byMethod,
      byPlan,
      dailyBreakdown,
    },
    topMembers,
    payments: payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      method: payment.method,
      description: payment.description,
      paidAt: payment.paidAt,
      member: {
        name: `${payment.member?.user.firstName} ${payment.member?.user.lastName}`,
        email: payment.member?.user.email,
      },
      plan: payment.membershipPlan?.name,
      transactionRef: payment.transactionRef,
    })),
  };

  return NextResponse.json({ data: report });
}

// Generate individual member payment report
async function generateMemberReport(
  memberId: string,
  year: number,
  month: number
) {
  // Get member details
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Get member's payments for the month
  const payments = await prisma.payment.findMany({
    where: {
      memberId,
      status: "COMPLETED",
      paidAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      membershipPlan: {
        select: {
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      paidAt: "desc",
    },
  });

  // Get member's payment history (all time)
  const paymentHistory = await prisma.payment.findMany({
    where: {
      memberId,
      status: "COMPLETED",
    },
    select: {
      amount: true,
      paidAt: true,
      method: true,
    },
    orderBy: {
      paidAt: "desc",
    },
    take: 50, // Last 50 payments
  });

  // Calculate statistics
  const monthlyTotal = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const monthlyTransactions = payments.length;
  const totalPaid = paymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalTransactions = paymentHistory.length;

  // Group by payment method
  const monthlyByMethod = payments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const report = {
    member: {
      id: member.id,
      name: `${member.user.firstName} ${member.user.lastName}`,
      email: member.user.email,
      phoneNumber: member.user.phoneNumber,
      membershipNumber: member.membershipNumber,
      membershipStatus: member.membershipStatus,
      joinDate: member.joinDate,
    },
    period: {
      year,
      month,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    monthly: {
      totalAmount: monthlyTotal,
      totalTransactions: monthlyTransactions,
      averageTransaction:
        monthlyTransactions > 0
          ? Math.round((monthlyTotal / monthlyTransactions) * 100) / 100
          : 0,
      byMethod: monthlyByMethod,
      payments: payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        description: payment.description,
        paidAt: payment.paidAt,
        plan: payment.membershipPlan?.name,
        transactionRef: payment.transactionRef,
      })),
    },
    overall: {
      totalPaid,
      totalTransactions,
      averageTransaction:
        totalTransactions > 0
          ? Math.round((totalPaid / totalTransactions) * 100) / 100
          : 0,
    },
    paymentHistory: paymentHistory.map((payment) => ({
      amount: payment.amount,
      method: payment.method,
      paidAt: payment.paidAt,
    })),
  };

  return NextResponse.json({ data: report });
}
