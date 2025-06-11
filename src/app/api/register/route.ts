import {
  checkRateLimit,
  hashPassword,
  validateEmail,
  validatePassword,
} from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
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
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting for registration attempts
    const rateLimit = checkRateLimit(`register:${clientIP}`, 3, 60 * 60 * 1000); // 3 attempts per hour
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Additional email validation
    if (!validateEmail(validatedData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(validatedData.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Password validation failed",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

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

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user in transaction
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Create the user
        const user = await tx.user.create({
          data: {
            email,
            firstName: validatedData.firstName.trim(),
            lastName: validatedData.lastName.trim(),
            phoneNumber: validatedData.phoneNumber?.trim() || null,
            role: validatedData.role,
            password: hashedPassword,
            name: `${validatedData.firstName.trim()} ${validatedData.lastName.trim()}`,
            emailVerified: new Date(), // Auto-verify for now, implement email verification later
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
        });

        // If registering as a member, create member profile
        if (validatedData.role === "MEMBER") {
          const memberCount = await tx.member.count();
          const membershipNumber = `GYM${(memberCount + 1)
            .toString()
            .padStart(4, "0")}`;

          await tx.member.create({
            data: {
              userId: user.id,
              membershipNumber,
              membershipStatus: "INACTIVE", // Inactive until first payment
            },
          });
        }

        return user;
      }
    );

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
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
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
