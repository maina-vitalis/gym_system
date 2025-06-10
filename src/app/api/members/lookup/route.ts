import { prisma } from "@/lib/prisma";
import { memberLookupSchema } from "@/lib/validations/attendance";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// GET /api/members/lookup - Search members for check-in
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const validatedData = memberLookupSchema.parse({ query });

    // Return empty results for very short queries to avoid unnecessary database load
    if (validatedData.query.length < 2) {
      return NextResponse.json({ data: [] });
    }

    // Search members by name, email, or membership number with optimized query
    const members = await prisma.member.findMany({
      where: {
        OR: [
          {
            user: {
              OR: [
                {
                  firstName: {
                    contains: validatedData.query,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: validatedData.query,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: validatedData.query,
                    mode: "insensitive",
                  },
                },
                {
                  phoneNumber: {
                    contains: validatedData.query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
          {
            membershipNumber: {
              contains: validatedData.query,
              mode: "insensitive",
            },
          },
        ],
      },
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
      take: 10, // Limit results to improve performance
      orderBy: [
        {
          membershipStatus: "asc", // ACTIVE members first
        },
        {
          user: {
            firstName: "asc",
          },
        },
      ],
    });

    // Check if each member has checked in today (for status) in a single query
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all member IDs for batch lookup
    const memberIds = members.map((member) => member.id);

    // Batch fetch last attendance for all members
    const lastAttendances = await prisma.attendance.findMany({
      where: {
        memberId: {
          in: memberIds,
        },
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        memberId: true,
        type: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Create a map for quick lookup of last attendance by member ID
    const lastAttendanceMap = new Map();
    lastAttendances.forEach((attendance) => {
      if (!lastAttendanceMap.has(attendance.memberId)) {
        lastAttendanceMap.set(attendance.memberId, attendance);
      }
    });

    // Build the response with attendance status
    const membersWithStatus = members.map((member) => {
      const lastAttendance = lastAttendanceMap.get(member.id);

      return {
        id: member.id,
        membershipNumber: member.membershipNumber,
        membershipStatus: member.membershipStatus,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email,
        phoneNumber: member.user.phoneNumber,
        hasActiveVisit: lastAttendance?.type === "CHECK_IN",
      };
    });

    // Set cache headers for better performance
    const response = NextResponse.json({ data: membersWithStatus });

    // Cache for 2 minutes (member data doesn't change frequently)
    response.headers.set(
      "Cache-Control",
      "public, max-age=120, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Failed to lookup members:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to lookup members" },
      { status: 500 }
    );
  }
}
