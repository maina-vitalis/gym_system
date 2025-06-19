import { hashPassword } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  phoneNumber: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createAdminSchema.parse(body);

    const email = validatedData.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    console.log("Creating admin user with email:", email);
    console.log("Original password length:", validatedData.password.length);

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    console.log(
      "Password hashed successfully, hash length:",
      hashedPassword.length
    );

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email,
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        phoneNumber: validatedData.phoneNumber?.trim() || null,
        role: "ADMIN",
        password: hashedPassword,
        name: `${validatedData.firstName.trim()} ${validatedData.lastName.trim()}`,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("Admin user created successfully:", adminUser.id);

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: adminUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint violations
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
