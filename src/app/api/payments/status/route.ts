import { mpesaService } from "@/lib/mpesa-config";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const statusQuerySchema = z.object({
  checkoutRequestId: z.string().min(1, "CheckoutRequestID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if M-Pesa service is configured
    if (!mpesaService.isConfigured()) {
      return NextResponse.json(
        {
          error: "M-Pesa service not configured",
          details: "Please configure M-Pesa environment variables.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { checkoutRequestId } = statusQuerySchema.parse(body);

    console.log(
      `🔍 Querying M-Pesa status for CheckoutRequestID: ${checkoutRequestId}`
    );

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        transactionRef: checkoutRequestId,
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Query M-Pesa status
    const statusResponse = await mpesaService.querySTKStatus(checkoutRequestId);

    if (statusResponse.success && statusResponse.data) {
      const { data } = statusResponse;

      console.log("M-Pesa Status Response:", data);

      // Update payment status based on M-Pesa response
      let updateData: {
        status?: "COMPLETED" | "FAILED";
        paidAt?: Date;
        description?: string;
      } = {};

      if (data.ResultCode === "0") {
        // Payment completed successfully
        updateData = {
          status: "COMPLETED",
          paidAt: new Date(),
        };
      } else if (data.ResultCode === "1032") {
        // User cancelled the request
        updateData = {
          status: "FAILED",
          description: `${payment.description} - Cancelled by user`,
        };
      } else if (data.ResultCode === "1") {
        // Insufficient funds
        updateData = {
          status: "FAILED",
          description: `${payment.description} - Insufficient funds`,
        };
      } else {
        // Other failure codes
        updateData = {
          status: "FAILED",
          description: `${payment.description} - ${
            data.ResultDesc || "Transaction failed"
          }`,
        };
      }

      // Update the payment record if status changed
      if (payment.status === "PENDING" && updateData.status) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: updateData,
        });

        console.log(
          `Payment ${payment.id} status updated to: ${updateData.status}`
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          paymentId: payment.id,
          checkoutRequestId,
          currentStatus: updateData.status || payment.status,
          mpesaStatus: {
            ResponseCode: data.ResponseCode,
            ResponseDescription: data.ResponseDescription,
            ResultCode: data.ResultCode,
            ResultDesc: data.ResultDesc,
          },
          memberName: `${payment.member?.user.firstName} ${payment.member?.user.lastName}`,
          amount: payment.amount,
          lastUpdated: new Date().toISOString(),
        },
      });
    } else {
      console.error("M-Pesa status query failed:", statusResponse.error);

      return NextResponse.json({
        success: false,
        error: statusResponse.error || "Failed to query M-Pesa status",
        data: {
          paymentId: payment.id,
          checkoutRequestId,
          currentStatus: payment.status,
          memberName: `${payment.member?.user.firstName} ${payment.member?.user.lastName}`,
          amount: payment.amount,
        },
      });
    }
  } catch (error) {
    console.error("M-Pesa status query error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to query by URL parameter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: "checkoutRequestId parameter is required" },
        { status: 400 }
      );
    }

    // Reuse the POST logic
    return POST(
      new NextRequest(request.url, {
        method: "POST",
        body: JSON.stringify({ checkoutRequestId }),
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
