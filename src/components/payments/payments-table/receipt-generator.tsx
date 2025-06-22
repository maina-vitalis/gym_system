"use client";

import { format } from "date-fns";
import { Payment } from "./types";

export const downloadReceipt = async (payment: Payment) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { default: jsPDF } = await import("jspdf");

    const response = await fetch(`/api/payments/${payment.id}/receipt`);

    if (!response.ok) {
      throw new Error("Failed to generate receipt data");
    }

    const { receiptData, receiptNumber } = await response.json();

    // Create new PDF document
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Colors
    const primaryColor: [number, number, number] = [102, 126, 234]; // #667eea
    const secondaryColor: [number, number, number] = [108, 117, 125]; // #6c757d
    const successColor: [number, number, number] = [40, 167, 69]; // #28a745
    const textColor: [number, number, number] = [73, 80, 87]; // #495057

    // Header with gradient effect (simulated with rectangles)
    pdf.setFillColor(102, 126, 234);
    pdf.rect(0, 0, pageWidth, 50, "F");

    // Gym name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("FITNESS GYM", pageWidth / 2, 25, { align: "center" });

    // Receipt title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Payment Receipt", pageWidth / 2, 35, { align: "center" });

    // Receipt info section
    let yPos = 70;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Receipt #${receiptNumber}`, 20, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.text(receiptData.date, pageWidth - 20, yPos, { align: "right" });
    pdf.text(receiptData.time, pageWidth - 20, yPos + 5, { align: "right" });

    // Divider line
    yPos += 15;
    pdf.setDrawColor(233, 236, 239);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos, pageWidth - 20, yPos);

    // Member Information Section
    if (receiptData.member) {
      yPos += 15;
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Member Information", 20, yPos);

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const memberInfo = [
        ["Name:", receiptData.member.name],
        ["Membership #:", receiptData.member.membershipNumber],
        ["Email:", receiptData.member.email],
        ["Phone:", receiptData.member.phone],
      ];

      memberInfo.forEach(([label, value]) => {
        yPos += 6;
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.text(label, 25, yPos);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFont("helvetica", "bold");
        pdf.text(value, 70, yPos);
        pdf.setFont("helvetica", "normal");
      });

      yPos += 10;
      pdf.setDrawColor(222, 226, 230);
      pdf.line(20, yPos, pageWidth - 20, yPos);
    }

    // Payment Details Section
    yPos += 15;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Payment Details", 20, yPos);

    yPos += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const paymentInfo = [
      ["Description:", receiptData.payment.description],
      ...(receiptData.plan
        ? [
            [
              "Plan:",
              `${receiptData.plan.name} (${receiptData.plan.duration} days)`,
            ],
          ]
        : []),
      ["Payment Method:", receiptData.payment.method.replace("_", " ")],
      ["Transaction Ref:", receiptData.payment.transactionRef],
      ["Status:", receiptData.payment.status],
    ];

    paymentInfo.forEach(([label, value]) => {
      yPos += 6;
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.text(label, 25, yPos);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFont("helvetica", "bold");
      pdf.text(value, 70, yPos);
      pdf.setFont("helvetica", "normal");
    });

    // Amount section with background
    yPos += 20;
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(20, yPos - 5, pageWidth - 40, 25, 3, 3, "F");

    pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `KES ${receiptData.payment.amount.toLocaleString()}`,
      pageWidth / 2,
      yPos + 10,
      { align: "center" }
    );

    // Footer
    yPos += 40;
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Thank you for your payment!", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 10;
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("For any inquiries, please contact us.", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 8;
    pdf.setFontSize(8);
    pdf.text("This is a computer-generated receipt.", pageWidth / 2, yPos, {
      align: "center",
    });

    // Add a subtle border
    pdf.setDrawColor(222, 226, 230);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 55, pageWidth - 30, yPos - 50);

    // Save the PDF
    pdf.save(`receipt-${receiptNumber}.pdf`);
  } catch (error) {
    console.error("Failed to download receipt:", error);
    // Fallback to simple text receipt
    generateFallbackReceipt(payment);
  }
};

const generateFallbackReceipt = (payment: Payment) => {
  const receiptData = {
    receiptNumber: `RCP-${payment.id.slice(-8).toUpperCase()}`,
    date: payment.paidAt ? format(new Date(payment.paidAt), "PPP") : "N/A",
    time: payment.paidAt ? format(new Date(payment.paidAt), "p") : "N/A",
    member: payment.member
      ? `${payment.member.user.firstName} ${payment.member.user.lastName}`
      : "N/A",
    membershipNumber: payment.member?.membershipNumber || "N/A",
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    description: payment.description || "Payment",
    transactionRef: payment.transactionRef || "N/A",
    plan: payment.membershipPlan?.name || "N/A",
  };

  const receiptContent = `
RECEIPT
${receiptData.receiptNumber}

Date: ${receiptData.date}
Time: ${receiptData.time}

MEMBER DETAILS
Name: ${receiptData.member}
Membership #: ${receiptData.membershipNumber}

PAYMENT DETAILS
Description: ${receiptData.description}
Plan: ${receiptData.plan}
Amount: KES ${receiptData.amount.toLocaleString()}
Method: ${receiptData.method.replace("_", " ")}
Status: ${receiptData.status}
Transaction Ref: ${receiptData.transactionRef}

Thank you for your payment!
  `.trim();

  const blob = new Blob([receiptContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${receiptData.receiptNumber}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
};
