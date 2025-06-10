import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const paymentId = params.id;

    // Fetch payment with member and plan details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        member: {
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
        },
        membershipPlan: {
          select: {
            name: true,
            duration: true,
            price: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Generate receipt data
    const receiptData = {
      receiptNumber: `RCP-${payment.id.slice(-8).toUpperCase()}`,
      date: payment.paidAt
        ? new Date(payment.paidAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A",
      time: payment.paidAt
        ? new Date(payment.paidAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      member: payment.member
        ? {
            name: `${payment.member.user.firstName} ${payment.member.user.lastName}`,
            email: payment.member.user.email,
            phone: payment.member.user.phoneNumber || "N/A",
            membershipNumber: payment.member.membershipNumber,
          }
        : null,
      payment: {
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        description: payment.description || "Payment",
        transactionRef: payment.transactionRef || "N/A",
      },
      plan: payment.membershipPlan
        ? {
            name: payment.membershipPlan.name,
            duration: payment.membershipPlan.duration,
            price: payment.membershipPlan.price,
          }
        : null,
    };

    // Generate HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .gym-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .receipt-title {
            font-size: 18px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .receipt-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .receipt-number {
            font-size: 16px;
            font-weight: bold;
            color: #667eea;
        }
        .date-time {
            text-align: right;
            color: #6c757d;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #495057;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #dee2e6;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dotted #dee2e6;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 500;
            color: #6c757d;
        }
        .value {
            font-weight: 600;
            color: #495057;
        }
        .amount-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
            text-align: center;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-completed {
            background: #d4edda;
            color: #155724;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .status-failed {
            background: #f8d7da;
            color: #721c24;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #6c757d;
            font-size: 14px;
        }
        .thank-you {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="gym-name">FITNESS GYM</div>
            <div class="receipt-title">Payment Receipt</div>
        </div>
        
        <div class="content">
            <div class="receipt-info">
                <div>
                    <div class="receipt-number">Receipt #${
                      receiptData.receiptNumber
                    }</div>
                </div>
                <div class="date-time">
                    <div>${receiptData.date}</div>
                    <div>${receiptData.time}</div>
                </div>
            </div>

            ${
              receiptData.member
                ? `
            <div class="section">
                <div class="section-title">Member Information</div>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${receiptData.member.name}</span>
                </div>
                <div class="info-row">
                    <span class="label">Membership #:</span>
                    <span class="value">${receiptData.member.membershipNumber}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${receiptData.member.email}</span>
                </div>
                <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">${receiptData.member.phone}</span>
                </div>
            </div>
            `
                : ""
            }

            <div class="section">
                <div class="section-title">Payment Details</div>
                <div class="info-row">
                    <span class="label">Description:</span>
                    <span class="value">${
                      receiptData.payment.description
                    }</span>
                </div>
                ${
                  receiptData.plan
                    ? `
                <div class="info-row">
                    <span class="label">Plan:</span>
                    <span class="value">${receiptData.plan.name} (${receiptData.plan.duration} days)</span>
                </div>
                `
                    : ""
                }
                <div class="info-row">
                    <span class="label">Payment Method:</span>
                    <span class="value">${receiptData.payment.method.replace(
                      "_",
                      " "
                    )}</span>
                </div>
                <div class="info-row">
                    <span class="label">Transaction Ref:</span>
                    <span class="value">${
                      receiptData.payment.transactionRef
                    }</span>
                </div>
                <div class="info-row">
                    <span class="label">Status:</span>
                    <span class="value">
                        <span class="status-badge status-${receiptData.payment.status.toLowerCase()}">
                            ${receiptData.payment.status}
                        </span>
                    </span>
                </div>
            </div>

            <div class="amount-section">
                <div class="total-amount">
                    KES ${receiptData.payment.amount.toLocaleString()}
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="thank-you">Thank you for your payment!</div>
            <div>For any inquiries, please contact us.</div>
            <div style="margin-top: 10px; font-size: 12px;">
                This is a computer-generated receipt.
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Return HTML content that will be converted to PDF on the client side
    return NextResponse.json({
      receiptData,
      htmlContent,
      receiptNumber: receiptData.receiptNumber,
    });
  } catch (error) {
    console.error("Failed to generate receipt:", error);
    return NextResponse.json(
      { error: "Failed to generate receipt" },
      { status: 500 }
    );
  }
}
