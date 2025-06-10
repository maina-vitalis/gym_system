import { prisma } from "@/lib/prisma";
import { checkInSchema } from "@/lib/validations/attendance";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// POST /api/attendance/check-in - Check in a member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = checkInSchema.parse(body);

    let memberId = validatedData.memberId;

    // If membershipNumber is provided instead of memberId, look up the member
    if (!memberId && validatedData.membershipNumber) {
      const member = await prisma.member.findUnique({
        where: { membershipNumber: validatedData.membershipNumber },
      });

      if (!member) {
        return NextResponse.json(
          { error: "Member not found with this membership number" },
          { status: 404 }
        );
      }

      memberId = member.id;
    }

    // Check if member exists and is active
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

    if (member.membershipStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          error: `Member membership is ${member.membershipStatus.toLowerCase()}. Please contact staff.`,
        },
        { status: 403 }
      );
    }

    // Check if member is already checked in today (last record is CHECK_IN)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastAttendance = await prisma.attendance.findFirst({
      where: {
        memberId,
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (lastAttendance && lastAttendance.type === "CHECK_IN") {
      return NextResponse.json(
        { error: "Member is already checked in today" },
        { status: 409 }
      );
    }

    // Create check-in attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        type: "CHECK_IN",
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

    // Update member's last visit
    await prisma.member.update({
      where: { id: memberId },
      data: { lastVisit: new Date() },
    });

    return NextResponse.json(
      {
        data: {
          id: attendance.id,
          memberId,
          memberName: `${member.user.firstName} ${member.user.lastName}`,
          checkInTime: attendance.timestamp,
          message: "Check-in successful",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to check in member:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to check in member" },
      { status: 500 }
    );
  }
}
