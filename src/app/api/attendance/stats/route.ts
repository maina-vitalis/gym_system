import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/attendance/stats - Get attendance statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get total visits today (count of CHECK_IN records)
    const totalVisitsToday = await prisma.attendance.count({
      where: {
        type: "CHECK_IN",
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get currently active visitors (checked in but not checked out today)
    const checkedInToday = await prisma.attendance.findMany({
      where: {
        type: "CHECK_IN",
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        memberId: true,
      },
    });

    const checkedOutToday = await prisma.attendance.findMany({
      where: {
        type: "CHECK_OUT",
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        memberId: true,
      },
    });

    const checkedInMemberIds = checkedInToday.map((a) => a.memberId);
    const checkedOutMemberIds = checkedOutToday.map((a) => a.memberId);
    const activeVisitors = checkedInMemberIds.filter(
      (id) => !checkedOutMemberIds.includes(id)
    ).length;

    // Get hourly breakdown for today
    const hourlyAttendance = await prisma.attendance.findMany({
      where: {
        type: "CHECK_IN",
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        timestamp: true,
      },
    });

    const popularTimes = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourlyAttendance.filter(
        (a) => new Date(a.timestamp).getHours() === hour
      ).length,
    }));

    // Get weekly attendance (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyAttendanceData = await prisma.attendance.findMany({
      where: {
        type: "CHECK_IN",
        timestamp: {
          gte: weekStart,
        },
      },
      select: {
        timestamp: true,
      },
    });

    const weeklyAttendance = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const count = weeklyAttendanceData.filter((a) => {
        const timestamp = new Date(a.timestamp);
        return timestamp >= dayStart && timestamp <= dayEnd;
      }).length;

      return { day: dayName, count };
    });

    // Get monthly stats
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyVisits = await prisma.attendance.count({
      where: {
        type: "CHECK_IN",
        timestamp: {
          gte: monthStart,
        },
      },
    });

    const monthlyUniqueVisitors = await prisma.attendance.findMany({
      where: {
        type: "CHECK_IN",
        timestamp: {
          gte: monthStart,
        },
      },
      distinct: ["memberId"],
      select: {
        memberId: true,
      },
    });

    const stats = {
      totalVisitsToday,
      activeVisitors,
      popularTimes,
      weeklyAttendance,
      monthlyStats: {
        totalVisits: monthlyVisits,
        uniqueVisitors: monthlyUniqueVisitors.length,
      },
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Failed to fetch attendance stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance stats" },
      { status: 500 }
    );
  }
}
