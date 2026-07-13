import { mpesaService } from "@/lib/mpesa-config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const pushNotificationSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  membershipPlanId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    console.log("🚀 M-Pesa STK Push request received");

    // Check if M-Pesa service is configured
    if (!mpesaService.isConfigured()) {
      console.error(
        "❌ M-Pesa service not configured - Configuration check failed",
      );
      return NextResponse.json(
        {
          error: "M-Pesa service not configured",
          details:
            "Please configure M-Pesa environment variables. Check server logs for specific missing variables.",
        },
        { status: 503 },
      );
    }

    console.log("✅ M-Pesa service is configured");

    const body = await request.json();
    console.log(
      "📥 Push notification request body:",
      JSON.stringify(body, null, 2),
    );

    const data = pushNotificationSchema.parse(body);
    console.log(
      "✅ Validated push notification data:",
      JSON.stringify(data, null, 2),
    );

    // Verify member exists with multiple lookup attempts
    console.log(`🔍 Looking up member with ID: ${data.memberId}`);

    // Try primary lookup
    const member = await prisma.member.findUnique({
      where: { id: data.memberId },
      select: {
        id: true,
        membershipNumber: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    });

    // If not found, try alternative lookups for debugging
    if (!member) {
      console.log(`❌ Member not found with ID: ${data.memberId}`);

      // Check if the ID format is correct (should be a UUID)
      const isValidUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          data.memberId,
        );
      console.log(`🔍 Is valid UUID format: ${isValidUUID}`);

      // Try to find any member with similar characteristics
      const allMembers = await prisma.member.findMany({
        take: 5,
        select: {
          id: true,
          membershipNumber: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      console.log(`📊 Found ${allMembers.length} total members in database`);
      console.log(
        `📋 Sample member IDs:`,
        allMembers.map((m) => ({
          id: m.id,
          name: `${m.user.firstName} ${m.user.lastName}`,
        })),
      );

      return NextResponse.json(
        {
          error: "Member not found",
          debug: {
            searchedId: data.memberId,
            isValidUUID,
            totalMembersInDb: allMembers.length,
            sampleMembers: allMembers.map((m) => ({
              id: m.id,
              name: `${m.user.firstName} ${m.user.lastName}`,
            })),
          },
        },
        { status: 404 },
      );
    }

    console.log(
      "🔎 Member lookup result:",
      member
        ? {
            id: member.id,
            membershipNumber: member.membershipNumber,
            name: `${member.user.firstName} ${member.user.lastName}`,
            hasPhoneNumber: !!member.user.phoneNumber,
          }
        : "null",
    );

    // Use provided phone number or member's phone number
    const phoneNumber = data.phoneNumber || member.user.phoneNumber;
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "No phone number available for M-Pesa STK Push" },
        { status: 400 },
      );
    }

    // Validate phone number using M-Pesa service
    if (!mpesaService.isValidSafaricomNumber(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format for M-Pesa. Please use a valid Kenyan number (07xxxxxxxx or 254xxxxxxx).",
        },
        { status: 400 },
      );
    }

    const formattedPhone = mpesaService.formatPhoneNumber(phoneNumber);
    if (!formattedPhone) {
      return NextResponse.json(
        { error: "Failed to format phone number" },
        { status: 400 },
      );
    }

    // Create a pending payment record to track the transaction
    const pendingPayment = await prisma.payment.create({
      data: {
        amount: data.amount,
        method: "MOBILE_MONEY",
        status: "PENDING",
        description: data.description || `GYM-${member.membershipNumber}`,
        memberId: member.id,
        userId: member.user.email ? undefined : member.user.email,
        membershipPlanId: data.membershipPlanId,
        // We'll update this with the actual CheckoutRequestID after the STK push
        transactionRef: null,
      },
    });

    console.log(
      `📱 Creating M-Pesa STK Push for payment ID: ${pendingPayment.id}`,
    );

    // Send M-Pesa STK Push using the production service
    const mpesaResponse = await mpesaService.sendSTKPush({
      phoneNumber: formattedPhone,
      amount: data.amount,
      accountReference: member.membershipNumber,
      transactionDesc: data.description || `GYM-${member.membershipNumber}`,
    });

    if (mpesaResponse.success && mpesaResponse.data) {
      // Update the payment record with the CheckoutRequestID
      await prisma.payment.update({
        where: { id: pendingPayment.id },
        data: {
          transactionRef: mpesaResponse.data.CheckoutRequestID,
        },
      });

      console.log(
        `✅ M-Pesa STK Push sent successfully for payment ${pendingPayment.id}`,
      );
      console.log(`CheckoutRequestID: ${mpesaResponse.data.CheckoutRequestID}`);

      return NextResponse.json({
        success: true,
        message: "M-Pesa STK Push sent successfully",
        data: {
          transactionRef: mpesaResponse.data.CheckoutRequestID,
          pushRequestId: mpesaResponse.data.MerchantRequestID,
          memberName: `${member.user.firstName} ${member.user.lastName}`,
          phoneNumber: formattedPhone,
          amount: data.amount,
          responseCode: mpesaResponse.data.ResponseCode,
          responseDescription: mpesaResponse.data.ResponseDescription,
          paymentId: pendingPayment.id,
        },
      });
    } else {
      // M-Pesa request failed, update payment status
      await prisma.payment.update({
        where: { id: pendingPayment.id },
        data: {
          status: "FAILED",
          description: `${pendingPayment.description} - Failed: ${mpesaResponse.error}`,
        },
      });

      console.error(
        `❌ M-Pesa STK Push failed for payment ${pendingPayment.id}:`,
        mpesaResponse.error,
      );

      return NextResponse.json(
        {
          error: mpesaResponse.error || "Failed to send M-Pesa STK Push",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 },
      );
    }

    // Check if it's an M-Pesa configuration error
    if (
      error instanceof Error &&
      error.message.includes("M-Pesa environment variables")
    ) {
      return NextResponse.json(
        {
          error:
            "M-Pesa service not configured. Please check environment variables.",
          details: "Contact administrator to configure M-Pesa integration.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    if (!mpesaService.isConfigured()) {
      return NextResponse.json(
        {
          status: "M-Pesa service not configured",
          error: "Missing environment variables",
          details:
            "Please configure M-Pesa environment variables. See MPESA_INTEGRATION.md for setup instructions.",
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      );
    }

    const config = mpesaService.getConfig();

    // Also check if we have any members in the database
    const memberCount = await prisma.member.count();
    const sampleMember = await prisma.member.findFirst({
      select: {
        id: true,
        membershipNumber: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "M-Pesa STK Push service is active",
      environment: config.environment,
      shortCode: config.shortCode,
      callbackUrl: config.callbackUrl,
      databaseInfo: {
        totalMembers: memberCount,
        sampleMember: sampleMember
          ? {
              id: sampleMember.id,
              membershipNumber: sampleMember.membershipNumber,
              name: `${sampleMember.user.firstName} ${sampleMember.user.lastName}`,
            }
          : null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "M-Pesa service configuration error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
