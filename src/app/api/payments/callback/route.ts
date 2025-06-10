import { prisma } from "@/lib/prisma";
import { calculateExpirationDate } from "@/lib/validations/membership-plan";
import { NextRequest, NextResponse } from "next/server";

interface MpesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value?: string | number;
        }>;
      };
    };
  };
}

interface CallbackMetadata {
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("📞 M-Pesa Callback received");

    // Parse the callback data
    const callbackData: MpesaCallbackData = await request.json();

    console.log("Raw callback data:", JSON.stringify(callbackData, null, 2));

    const { stkCallback } = callbackData.Body;
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    console.log(
      `Processing callback for CheckoutRequestID: ${CheckoutRequestID}`
    );
    console.log(`Result Code: ${ResultCode}, Description: ${ResultDesc}`);

    // Extract metadata if payment was successful
    const metadata: CallbackMetadata = {};

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        switch (item.Name) {
          case "Amount":
            metadata.amount = Number(item.Value);
            break;
          case "MpesaReceiptNumber":
            metadata.mpesaReceiptNumber = String(item.Value);
            break;
          case "TransactionDate":
            metadata.transactionDate = String(item.Value);
            break;
          case "PhoneNumber":
            metadata.phoneNumber = String(item.Value);
            break;
        }
      }
    }

    console.log("Extracted metadata:", metadata);

    // Check if we have a pending payment with this checkout request ID
    const existingPayment = await prisma.payment.findFirst({
      where: {
        transactionRef: CheckoutRequestID,
        status: "PENDING",
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
        membershipPlan: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
      },
    });

    if (!existingPayment) {
      console.log(
        `⚠️ No pending payment found for CheckoutRequestID: ${CheckoutRequestID}`
      );

      // If no existing payment, create a new one for successful transactions
      if (ResultCode === 0 && metadata.amount && metadata.phoneNumber) {
        console.log("Creating new payment record from callback");

        // Try to find member by phone number
        const member = await prisma.member.findFirst({
          where: {
            user: {
              phoneNumber: metadata.phoneNumber,
            },
          },
          include: {
            user: true,
          },
        });

        if (member) {
          await prisma.payment.create({
            data: {
              amount: metadata.amount,
              method: "MOBILE_MONEY",
              status: "COMPLETED",
              description: `M-Pesa payment - ${metadata.mpesaReceiptNumber}`,
              memberId: member.id,
              userId: member.userId,
              transactionRef: metadata.mpesaReceiptNumber || CheckoutRequestID,
              paidAt: metadata.transactionDate
                ? new Date(formatMpesaDate(metadata.transactionDate))
                : new Date(),
            },
          });

          console.log(
            `✅ New payment created for member ${member.user.firstName} ${member.user.lastName}`
          );
        } else {
          console.log(
            `⚠️ No member found with phone number: ${metadata.phoneNumber}`
          );
        }
      }

      return NextResponse.json(
        {
          ResultCode: 0,
          ResultDesc: "Callback processed successfully",
        },
        { status: 200 }
      );
    }

    // Update the existing payment based on the result
    if (ResultCode === 0) {
      // Payment successful - use transaction to update payment and create subscription
      console.log(
        `✅ Payment successful for ${existingPayment.member?.user.firstName} ${existingPayment.member?.user.lastName}`
      );

      await prisma.$transaction(async (tx) => {
        // Update payment
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: "COMPLETED",
            transactionRef: metadata.mpesaReceiptNumber || CheckoutRequestID,
            paidAt: metadata.transactionDate
              ? new Date(formatMpesaDate(metadata.transactionDate))
              : new Date(),
            description: existingPayment.description
              ? `${existingPayment.description} - M-Pesa: ${metadata.mpesaReceiptNumber}`
              : `M-Pesa payment - ${metadata.mpesaReceiptNumber}`,
          },
        });

        // If this payment is for a membership plan, create a subscription
        if (existingPayment.membershipPlan && existingPayment.memberId) {
          // Check for existing active subscription
          const existingActiveSubscription =
            await tx.membershipSubscription.findFirst({
              where: {
                memberId: existingPayment.memberId,
                isActive: true,
              },
            });

          let startDate = new Date();
          let endDate: Date;

          if (
            existingActiveSubscription &&
            existingActiveSubscription.endDate > new Date()
          ) {
            // Member has an active subscription with remaining days
            // Start the new subscription from the end of the current one
            startDate = existingActiveSubscription.endDate;
            endDate = calculateExpirationDate(
              startDate,
              existingPayment.membershipPlan.duration
            );

            console.log(
              `🔄 Extending existing subscription. Current ends: ${existingActiveSubscription.endDate.toISOString()}, New ends: ${endDate.toISOString()}`
            );

            // Deactivate the existing subscription
            await tx.membershipSubscription.update({
              where: { id: existingActiveSubscription.id },
              data: { isActive: false },
            });
          } else {
            // No active subscription or expired subscription
            // Deactivate any existing subscriptions
            await tx.membershipSubscription.updateMany({
              where: {
                memberId: existingPayment.memberId,
                isActive: true,
              },
              data: {
                isActive: false,
              },
            });

            // Start immediately
            endDate = calculateExpirationDate(
              startDate,
              existingPayment.membershipPlan.duration
            );

            console.log(
              `🆕 Creating new subscription. Starts: ${startDate.toISOString()}, Ends: ${endDate.toISOString()}`
            );
          }

          // Create new subscription
          await tx.membershipSubscription.create({
            data: {
              memberId: existingPayment.memberId,
              membershipPlanId: existingPayment.membershipPlan.id,
              paymentId: existingPayment.id,
              startDate,
              endDate,
              isActive: true,
              autoRenew: false,
            },
          });

          console.log(
            `🎯 Membership subscription created/extended for plan: ${existingPayment.membershipPlan.name}`
          );
        }
      });

      console.log(
        `Payment updated with M-Pesa receipt: ${metadata.mpesaReceiptNumber}`
      );
    } else {
      // Payment failed
      console.log(`❌ Payment failed: ${ResultDesc}`);

      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: "FAILED",
          description: existingPayment.description
            ? `${existingPayment.description} - Failed: ${ResultDesc}`
            : `Payment failed: ${ResultDesc}`,
        },
      });
    }

    // Log the callback for auditing
    console.log("M-Pesa Callback processed:", {
      CheckoutRequestID,
      MerchantRequestID,
      ResultCode,
      ResultDesc,
      Amount: metadata.amount,
      Receipt: metadata.mpesaReceiptNumber,
      PaymentId: existingPayment.id,
      HasMembershipPlan: !!existingPayment.membershipPlan,
    });

    // Respond to M-Pesa
    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: "Callback processed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ M-Pesa Callback Error:", error);

    // Always respond successfully to M-Pesa to avoid retries
    // Log the error but don't let it affect the callback response
    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: "Callback received but processing failed",
      },
      { status: 200 }
    );
  }
}

/**
 * Format M-Pesa date string to ISO date
 * M-Pesa date format: YYYYMMDDHHMMSS
 */
function formatMpesaDate(mpesaDate: string): string {
  if (!mpesaDate || mpesaDate.length !== 14) {
    return new Date().toISOString();
  }

  const year = mpesaDate.substring(0, 4);
  const month = mpesaDate.substring(4, 6);
  const day = mpesaDate.substring(6, 8);
  const hour = mpesaDate.substring(8, 10);
  const minute = mpesaDate.substring(10, 12);
  const second = mpesaDate.substring(12, 14);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
}

// Handle GET requests (for health checks)
export async function GET() {
  return NextResponse.json(
    {
      message: "M-Pesa callback endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
