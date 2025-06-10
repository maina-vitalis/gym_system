import { prisma } from "@/lib/prisma";
import { manualAttendanceSchema } from "@/lib/validations/attendance";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const date = searchParams.get("date");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: {
      memberId?: string;
      timestamp?: {
        gte: Date;
        lt: Date;
      };
      type?: "CHECK_IN" | "CHECK_OUT";
    } = {};

    if (memberId) {
      where.memberId = memberId;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      where.timestamp = {
        gte: startDate,
        lt: endDate,
      };
    }

    if (type && (type === "CHECK_IN" || type === "CHECK_OUT")) {
      where.type = type;
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      data: attendances,
    });
  } catch (error) {
    console.error("Failed to fetch attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Create manual attendance entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = manualAttendanceSchema.parse(body);

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: validatedData.memberId },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId: validatedData.memberId,
        type: validatedData.type,
        timestamp: new Date(validatedData.timestamp),
        notes: validatedData.notes || null,
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: attendance }, { status: 201 });
  } catch (error) {
    console.error("Failed to create attendance record:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create attendance record" },
      { status: 500 }
    );
  }
}
