import { prisma } from "@/lib/prisma";
import { updateMemberFormSchema } from "@/lib/validations/member";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// GET /api/members/[id] - Get a specific member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ data: member });
  } catch (error) {
    console.error("Failed to fetch member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PUT /api/members/[id] - Update a specific member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateMemberFormSchema.parse(body);

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Update user and member in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user data if provided
      const userUpdateData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string | null;
        name?: string;
      } = {};
      if (validatedData.firstName)
        userUpdateData.firstName = validatedData.firstName.trim();
      if (validatedData.lastName)
        userUpdateData.lastName = validatedData.lastName.trim();
      if (validatedData.email)
        userUpdateData.email = validatedData.email.toLowerCase().trim();
      if (validatedData.phoneNumber !== undefined) {
        userUpdateData.phoneNumber = validatedData.phoneNumber?.trim() || null;
      }

      // Update name if first or last name changed
      if (validatedData.firstName || validatedData.lastName) {
        const firstName =
          validatedData.firstName?.trim() || existingMember.user.firstName;
        const lastName =
          validatedData.lastName?.trim() || existingMember.user.lastName;
        userUpdateData.name = `${firstName} ${lastName}`;
      }

      // Update user if there are changes
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingMember.userId },
          data: userUpdateData,
        });
      }

      // Update member data
      const memberUpdateData: {
        ageRange?: string | null;
        gender?: string | null;
        address?: string | null;
        emergencyContactName?: string | null;
        emergencyContactPhone?: string | null;
        healthConditions?: string | null;
        fitnessGoals?: string | null;
        membershipStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "EXPIRED";
      } = {};
      if (validatedData.ageRange !== undefined) {
        memberUpdateData.ageRange = validatedData.ageRange || null;
      }
      if (validatedData.gender !== undefined)
        memberUpdateData.gender = validatedData.gender || null;
      if (validatedData.address !== undefined)
        memberUpdateData.address = validatedData.address?.trim() || null;
      if (validatedData.emergencyContactName !== undefined) {
        memberUpdateData.emergencyContactName =
          validatedData.emergencyContactName?.trim() || null;
      }
      if (validatedData.emergencyContactPhone !== undefined) {
        memberUpdateData.emergencyContactPhone =
          validatedData.emergencyContactPhone?.trim() || null;
      }
      if (validatedData.healthConditions !== undefined) {
        memberUpdateData.healthConditions =
          validatedData.healthConditions?.trim() || null;
      }
      if (validatedData.fitnessGoals !== undefined) {
        memberUpdateData.fitnessGoals =
          validatedData.fitnessGoals?.trim() || null;
      }
      if (validatedData.membershipStatus) {
        memberUpdateData.membershipStatus = validatedData.membershipStatus as
          | "ACTIVE"
          | "INACTIVE"
          | "SUSPENDED"
          | "EXPIRED";
      }

      // Update member
      const updatedMember = await tx.member.update({
        where: { id },
        data: memberUpdateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      });

      return updatedMember;
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Failed to update member:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // Handle unique constraint violations (email already exists)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Email address is already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE /api/members/[id] - Delete a specific member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Delete member and user in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the member first (due to foreign key constraint)
      await tx.member.delete({
        where: { id },
      });

      // Delete the associated user
      await tx.user.delete({
        where: { id: existingMember.userId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
