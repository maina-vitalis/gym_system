import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Member lookup schema (for quick search)
const memberLookupSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// GET /api/members/lookup - Search members for check-in with caching support
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const warm = searchParams.get("warm") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Cache warming - return all members for initial cache population
    if (warm) {
      console.log("🔥 Cache warming request - fetching all members");

      const allMembers = await prisma.member.findMany({
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

      // Transform for cache format
      const transformedMembers = allMembers.map((member) => ({
        id: member.id,
        membershipNumber: member.membershipNumber,
        membershipStatus: member.membershipStatus,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email,
        phoneNumber: member.user.phoneNumber,
      }));

      const response = NextResponse.json({ data: transformedMembers });

      // Cache for longer since this is for warming
      response.headers.set(
        "Cache-Control",
        "public, max-age=900, stale-while-revalidate=300" // 15 minutes
      );

      console.log(
        `✅ Cache warming complete - ${transformedMembers.length} members`
      );
      return response;
    }

    // Regular search query
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

    console.log(`🔍 Searching members for: "${validatedData.query}"`);

    // Optimized search query with better indexing
    const searchTerms = validatedData.query
      .split(/\s+/)
      .filter((term) => term.length > 0);

    // Build dynamic OR conditions for better search
    const searchConditions: Array<{
      user?: {
        firstName?: { contains: string; mode: "insensitive" };
        lastName?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        phoneNumber?: { contains: string; mode: "insensitive" };
      };
      membershipNumber?: { contains: string; mode: "insensitive" };
    }> = searchTerms.flatMap((term) => [
      {
        user: {
          firstName: {
            contains: term,
            mode: "insensitive" as const,
          },
        },
      },
      {
        user: {
          lastName: {
            contains: term,
            mode: "insensitive" as const,
          },
        },
      },
      {
        user: {
          email: {
            contains: term,
            mode: "insensitive" as const,
          },
        },
      },
      {
        membershipNumber: {
          contains: term,
          mode: "insensitive" as const,
        },
      },
    ]);

    // Add phone number search if the query looks like a phone number
    if (/^\+?[\d\s\-\(\)]+$/.test(validatedData.query)) {
      searchConditions.push({
        user: {
          phoneNumber: {
            contains: validatedData.query.replace(/[\s\-\(\)]/g, ""),
            mode: "insensitive" as const,
          },
        },
      });
    }

    // Search members with optimized query
    const members = await prisma.member.findMany({
      where: {
        OR: searchConditions,
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
      take: Math.min(limit, 50), // Cap at 50 for performance
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

    // Build the response
    const membersWithStatus = members.map((member) => ({
      id: member.id,
      membershipNumber: member.membershipNumber,
      membershipStatus: member.membershipStatus,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      email: member.user.email,
      phoneNumber: member.user.phoneNumber,
    }));

    // Set cache headers for better performance
    const response = NextResponse.json({ data: membersWithStatus });

    // Cache for shorter time for search results
    response.headers.set(
      "Cache-Control",
      "public, max-age=120, stale-while-revalidate=60" // 2 minutes
    );

    console.log(
      `✅ Found ${membersWithStatus.length} members for "${validatedData.query}"`
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
