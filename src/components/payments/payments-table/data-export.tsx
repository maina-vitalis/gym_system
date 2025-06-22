"use client";

import { format } from "date-fns";
import { Payment } from "./types";

export const exportPaymentsToCSV = (payments: Payment[]) => {
  const csvData = payments.map((payment) => ({
    Member: payment.member
      ? `${payment.member.user.firstName} ${payment.member.user.lastName}`
      : "N/A",
    MembershipNumber: payment.member?.membershipNumber || "N/A",
    Amount: payment.amount,
    Method: payment.method,
    Status: payment.status,
    Plan: payment.membershipPlan?.name || "N/A",
    TransactionRef: payment.transactionRef || "N/A",
    Date: payment.paidAt
      ? format(new Date(payment.paidAt), "yyyy-MM-dd HH:mm:ss")
      : "N/A",
  }));

  const csv = [
    Object.keys(csvData[0]).join(","),
    ...csvData.map((row) => Object.values(row).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
