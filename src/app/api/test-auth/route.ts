import { hashPassword, verifyPassword } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "User has no password set" },
        { status: 400 }
      );
    }

    // Test password verification
    const isValidPassword = await verifyPassword(password, user.password);

    // Also test hashing the input password to compare
    const newHash = await hashPassword(password);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      passwordTest: {
        inputPassword: password,
        inputPasswordLength: password.length,
        storedHashLength: user.password.length,
        storedHashPrefix: user.password.substring(0, 10),
        isValidPassword,
        newHashLength: newHash.length,
        newHashPrefix: newHash.substring(0, 10),
        hashesMatch: user.password === newHash,
      },
    });
  } catch (error) {
    console.error("Test auth error:", error);
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
