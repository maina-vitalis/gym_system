import { prisma } from "@/lib/prisma";
import { checkOutSchema } from "@/lib/validations/attendance";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// POST /api/attendance/check-out - Check out a member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = checkOutSchema.parse(body);

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

    // Check if member has checked in today (last record should be CHECK_IN)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastAttendance = await prisma.attendance.findFirst({
      where: {
        memberId: validatedData.memberId,
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!lastAttendance || lastAttendance.type !== "CHECK_IN") {
      return NextResponse.json(
        { error: "Member is not currently checked in today" },
        { status: 409 }
      );
    }

    // Create check-out attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId: validatedData.memberId,
        type: "CHECK_OUT",
        notes: validatedData.notes || null,
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
      },
    });

    return NextResponse.json({
      data: {
        id: attendance.id,
        memberId: validatedData.memberId,
        memberName: `${member.user.firstName} ${member.user.lastName}`,
        checkOutTime: attendance.timestamp,
        message: "Check-out successful",
      },
    });
  } catch (error) {
    console.error("Failed to check out member:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to check out member" },
      { status: 500 }
    );
  }
}
