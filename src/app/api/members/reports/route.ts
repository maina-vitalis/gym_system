/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Starting members report generation...");

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const planId = searchParams.get("planId");
    const includePayments = searchParams.get("includePayments") === "true";
    const includeSubscriptions =
      searchParams.get("includeSubscriptions") === "true";

    console.log("📋 Report parameters:", {
      format,
      status,
      startDate,
      endDate,
      planId,
      includePayments,
      includeSubscriptions,
    });

    // Build where clause for members
    const memberWhere: Record<string, unknown> = {};

    if (status) {
      memberWhere.membershipStatus = status;
    }

    if (startDate || endDate) {
      memberWhere.createdAt = {};
      if (startDate) {
        (memberWhere.createdAt as Record<string, unknown>).gte = new Date(
          startDate,
        );
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        (memberWhere.createdAt as Record<string, unknown>).lte = end;
      }
    }

    console.log("🔍 Fetching members with where clause:", memberWhere);

    // Fetch members with basic info
    const members = await prisma.member.findMany({
      where: memberWhere,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ Found ${members.length} members`);

    // Fetch additional data if requested
    const memberIds = members.map((m) => m.id);

    let subscriptions: Record<string, any[]> = {};
    let payments: Record<string, any[]> = {};

    if (includeSubscriptions && memberIds.length > 0) {
      console.log("📊 Fetching subscriptions...");
      const subs = await prisma.membershipSubscription.findMany({
        where: { memberId: { in: memberIds } },
        include: {
          membershipPlan: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      subscriptions = subs.reduce(
        (acc, sub) => {
          if (!acc[sub.memberId]) acc[sub.memberId] = [];
          acc[sub.memberId].push(sub);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      console.log(`✅ Found ${subs.length} subscriptions`);
    }

    if (includePayments && memberIds.length > 0) {
      console.log("💰 Fetching payments...");
      const pays = await prisma.payment.findMany({
        where: { memberId: { in: memberIds } },
        include: {
          membershipPlan: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      payments = pays.reduce(
        (acc, payment) => {
          if (payment.memberId && !acc[payment.memberId])
            acc[payment.memberId] = [];
          if (payment.memberId) acc[payment.memberId].push(payment);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      console.log(`✅ Found ${pays.length} payments`);
    }

    // Filter by plan if specified
    let filteredMembers = members;
    if (planId && includeSubscriptions) {
      filteredMembers = members.filter((member) => {
        const memberSubs = subscriptions[member.id] || [];
        return memberSubs.some((sub: any) => sub.membershipPlan?.id === planId);
      });
      console.log(`🔽 Filtered to ${filteredMembers.length} members by plan`);
    }

    // Calculate summary statistics
    const summary = {
      totalMembers: filteredMembers.length,
      activeMembers: filteredMembers.filter(
        (m) => m.membershipStatus === "ACTIVE",
      ).length,
      inactiveMembers: filteredMembers.filter(
        (m) => m.membershipStatus === "INACTIVE",
      ).length,
      expiredMembers: filteredMembers.filter(
        (m) => m.membershipStatus === "EXPIRED",
      ).length,
      suspendedMembers: filteredMembers.filter(
        (m) => m.membershipStatus === "SUSPENDED",
      ).length,
      totalRevenue: 0,
      averageAge: 0,
      ageRangeDistribution: {} as Record<string, number>,
    };

    // Calculate total revenue
    if (includePayments) {
      summary.totalRevenue = filteredMembers.reduce((sum, member) => {
        const memberPayments = payments[member.id] || [];
        return (
          sum +
          memberPayments
            .filter((p: any) => p.status === "COMPLETED")
            .reduce(
              (paymentSum: number, payment: any) => paymentSum + payment.amount,
              0,
            )
        );
      }, 0);
    }

    // Calculate age range distribution and average age
    const ageRangeDistribution: Record<string, number> = {};
    let totalAge = 0;
    let membersWithAge = 0;

    filteredMembers.forEach((member) => {
      if (member.ageRange) {
        ageRangeDistribution[member.ageRange] =
          (ageRangeDistribution[member.ageRange] || 0) + 1;

        // Calculate approximate age from age range for average
        const ageMatch = member.ageRange.match(/(\d+)/);
        if (ageMatch) {
          totalAge += parseInt(ageMatch[1]);
          membersWithAge++;
        }
      }

      // Also try to calculate from date of birth if available
      if ("dateOfBirth" in member && member.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(member.dateOfBirth as Date);
        const age = today.getFullYear() - birthDate.getFullYear();
        totalAge += age;
        membersWithAge++;
      }
    });

    summary.averageAge =
      membersWithAge > 0 ? Math.round(totalAge / membersWithAge) : 0;
    summary.ageRangeDistribution = ageRangeDistribution;

    console.log("📈 Summary calculated:", summary);

    // Format data for response
    const reportData = filteredMembers.map((member) => {
      const memberSubs = subscriptions[member.id] || [];
      const memberPayments = payments[member.id] || [];
      const currentSubscription = memberSubs[0] as any;

      const totalPaid = memberPayments
        .filter((p: any) => p.status === "COMPLETED")
        .reduce((sum: number, payment: any) => sum + payment.amount, 0);

      return {
        id: member.id,
        membershipNumber: member.membershipNumber,
        name: `${member.user.firstName} ${member.user.lastName}`,
        email: member.user.email,
        phoneNumber: member.user.phoneNumber,
        status: member.membershipStatus,
        joinDate: member.joinDate,
        dateOfBirth: "dateOfBirth" in member ? member.dateOfBirth : undefined,
        ageRange: member.ageRange,
        gender: member.gender,
        address: member.address,
        emergencyContactName: member.emergencyContactName,
        emergencyContactPhone: member.emergencyContactPhone,
        healthConditions: member.healthConditions,
        fitnessGoals: member.fitnessGoals,
        currentPlan: currentSubscription
          ? {
              name: currentSubscription.membershipPlan?.name,
              price: currentSubscription.membershipPlan?.price,
              duration: currentSubscription.membershipPlan?.duration,
              startDate: currentSubscription.startDate,
              endDate: currentSubscription.endDate,
              isActive: currentSubscription.isActive,
            }
          : null,
        totalPaid,
        totalPayments: memberPayments.length,
        subscriptions: includeSubscriptions ? memberSubs : undefined,
        payments: includePayments ? memberPayments : undefined,
      };
    });

    console.log(`✅ Formatted ${reportData.length} member records`);

    // Return CSV format if requested
    if (format === "csv") {
      const csvHeaders = [
        "Membership Number",
        "Name",
        "Email",
        "Phone",
        "Status",
        "Join Date",
        "Last Visit",
        "Age Range",
        "Gender",
        "Address",
        "Emergency Contact",
        "Emergency Phone",
        "Health Conditions",
        "Fitness Goals",
        "Current Plan",
        "Plan Price",
        "Plan Duration",
        "Subscription Start",
        "Subscription End",
        "Total Paid",
        "Total Payments",
      ];

      const csvRows = reportData.map((member) => [
        member.membershipNumber,
        member.name,
        member.email,
        member.phoneNumber || "",
        member.status,
        member.joinDate ? new Date(member.joinDate).toLocaleDateString() : "",
        member.ageRange || "",
        member.gender || "",
        member.address || "",
        member.emergencyContactName || "",
        member.emergencyContactPhone || "",
        member.healthConditions || "",
        member.fitnessGoals || "",
        member.currentPlan?.name || "",
        member.currentPlan?.price || "",
        member.currentPlan?.duration || "",
        member.currentPlan?.startDate
          ? new Date(member.currentPlan.startDate).toLocaleDateString()
          : "",
        member.currentPlan?.endDate
          ? new Date(member.currentPlan.endDate).toLocaleDateString()
          : "",
        member.totalPaid,
        member.totalPayments,
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) =>
          row
            .map((field) => `"${String(field).replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="members-report-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    // Return JSON format
    return NextResponse.json({
      data: reportData,
      summary,
      filters: {
        status,
        startDate,
        endDate,
        planId,
        includePayments,
        includeSubscriptions,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to generate members report:", error);
    return NextResponse.json(
      { error: "Failed to generate members report" },
      { status: 500 },
    );
  }
}
