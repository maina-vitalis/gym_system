import { mpesaService } from "@/lib/mpesa-config";
import { prisma } from "@/lib/prisma";
import { calculateExpirationDate } from "@/lib/validations/membership-plan";
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

    // Find the payment record with proper includes
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
        membershipPlan: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Get current active subscription for the member separately
    let currentSubscription = null;
    if (payment.member) {
      currentSubscription = await prisma.membershipSubscription.findFirst({
        where: {
          memberId: payment.member.id,
          isActive: true,
        },
        orderBy: {
          endDate: "desc",
        },
      });
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

      // Update the payment record and create subscription if payment completed and status changed
      if (payment.status === "PENDING" && updateData.status === "COMPLETED") {
        console.log(
          `✅ Payment completed for ${payment.member?.user.firstName} ${payment.member?.user.lastName}`
        );

        await prisma.$transaction(async (tx) => {
          // Update payment
          await tx.payment.update({
            where: { id: payment.id },
            data: updateData,
          });

          // Create subscription if membershipPlan is associated and member exists
          if (payment.membershipPlan && payment.member) {
            console.log(
              `Creating subscription for plan: ${payment.membershipPlan.name}`
            );

            const now = new Date();
            let startDate: Date;
            let endDate: Date;

            if (currentSubscription && currentSubscription.endDate > now) {
              // Extend existing active subscription
              startDate = currentSubscription.endDate;
              endDate = calculateExpirationDate(
                startDate,
                payment.membershipPlan.duration
              );

              // Deactivate current subscription
              await tx.membershipSubscription.update({
                where: { id: currentSubscription.id },
                data: { isActive: false },
              });

              console.log(
                `Extending subscription from ${startDate.toISOString()}`
              );
            } else {
              // Create new subscription starting immediately
              startDate = now;
              endDate = calculateExpirationDate(
                startDate,
                payment.membershipPlan.duration
              );
              console.log("Creating new subscription starting immediately");
            }

            // Create new subscription
            await tx.membershipSubscription.create({
              data: {
                memberId: payment.member.id,
                membershipPlanId: payment.membershipPlan.id,
                paymentId: payment.id,
                startDate,
                endDate,
                isActive: true,
              },
            });

            // Update member status to ACTIVE
            await tx.member.update({
              where: { id: payment.member.id },
              data: {
                membershipStatus: "ACTIVE",
              },
            });

            console.log(
              `🎉 Subscription created: ${startDate.toISOString()} to ${endDate.toISOString()}`
            );
          }
        });

        console.log(
          `Payment ${payment.id} status updated to: ${updateData.status}`
        );
      } else if (payment.status === "PENDING" && updateData.status) {
        // Update payment status for failed payments
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
          subscriptionCreated:
            updateData.status === "COMPLETED" && payment.membershipPlan
              ? true
              : false,
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
