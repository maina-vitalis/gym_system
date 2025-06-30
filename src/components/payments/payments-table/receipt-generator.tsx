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

    // Brand Colors
    const primaryColor: [number, number, number] = [30, 41, 57]; // #1E2939
    const secondaryColor: [number, number, number] = [240, 177, 0]; // #F0B100
    const textColor: [number, number, number] = [73, 80, 87]; // #495057

    // Load and add logo
    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = 20;
    const logoY = 15;

    // Convert base64 image to data URL
    const img = new Image();
    img.src = "/gym.png";

    // Header with brand color
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, pageWidth, 60, "F");

    // Add logo
    pdf.addImage(img.src, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Gym name with secondary color
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text("TUMAINI FITNESS", pageWidth / 2, 30, { align: "center" });

    // Receipt title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text("Payment Receipt", pageWidth / 2, 45, { align: "center" });

    // Receipt info section
    let yPos = 80;
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Receipt #${receiptNumber}`, 20, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(receiptData.date, pageWidth - 20, yPos, { align: "right" });
    pdf.text(receiptData.time, pageWidth - 20, yPos + 5, { align: "right" });

    // Elegant divider line with brand color
    yPos += 15;
    pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setLineWidth(0.8);
    pdf.line(20, yPos, pageWidth - 20, yPos);

    // Member Information Section with styled heading
    if (receiptData.member) {
      yPos += 20;
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Member Information", 20, yPos);

      yPos += 10;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const memberInfo = [
        ["Name:", receiptData.member.name],
        ["Membership #:", receiptData.member.membershipNumber],
        ["Email:", receiptData.member.email],
        ["Phone:", receiptData.member.phone],
      ];

      memberInfo.forEach(([label, value]) => {
        yPos += 8;
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(label, 25, yPos);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFont("helvetica", "bold");
        pdf.text(value, 70, yPos);
        pdf.setFont("helvetica", "normal");
      });

      // Subtle section divider
      yPos += 12;
      pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setLineWidth(0.3);
      pdf.line(20, yPos, pageWidth - 20, yPos);
    }

    // Payment Details Section with consistent styling
    yPos += 20;
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Payment Details", 20, yPos);

    yPos += 10;
    pdf.setFontSize(11);
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
      yPos += 8;
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(label, 25, yPos);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFont("helvetica", "bold");
      pdf.text(value, 70, yPos);
      pdf.setFont("helvetica", "normal");
    });

    // Amount section with branded styling
    yPos += 25;
    // Create a subtle background with primary color
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.roundedRect(20, yPos - 5, pageWidth - 40, 30, 3, 3, "F");

    // Add amount with secondary color for emphasis
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `KES ${receiptData.payment.amount.toLocaleString()}`,
      pageWidth / 2,
      yPos + 12,
      { align: "center" },
    );

    // Footer with brand elements
    yPos += 45;
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Thank you for choosing Tumaini Fitness!", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 12;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("For inquiries, contact us:", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 6;
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.text(
      "info@tumainifitness.com | +254 700 000 000",
      pageWidth / 2,
      yPos,
      {
        align: "center",
      },
    );

    yPos += 10;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(8);
    pdf.text("This is a computer-generated receipt.", pageWidth / 2, yPos, {
      align: "center",
    });

    // Add an elegant border with brand color
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(15, 70, pageWidth - 30, yPos - 65, 3, 3);

    // Save the PDF
    pdf.save(`TumainiFitness-Receipt-${receiptNumber}.pdf`);
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
