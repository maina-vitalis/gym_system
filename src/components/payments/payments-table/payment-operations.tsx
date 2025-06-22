"use client";

import { toast } from "sonner";

export const deletePayment = async (paymentId: string) => {
  try {
    const response = await fetch(`/api/payments/${paymentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete payment");
    }

    toast.success("Payment deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete payment:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to delete payment"
    );
    return false;
  }
};

export const bulkDeletePayments = async (
  paymentIds: string[],
  memberNames: string[]
): Promise<boolean> => {
  if (paymentIds.length === 0) return false;

  const confirmMessage = `Are you sure you want to delete ${
    paymentIds.length
  } payment(s) for: ${memberNames.join(", ")}?`;

  if (!confirm(confirmMessage)) {
    return false;
  }

  try {
    const response = await fetch("/api/payments/bulk-delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete payments");
    }

    const result = await response.json();
    toast.success(result.message);
    return true;
  } catch (error) {
    console.error("Failed to bulk delete payments:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to delete payments"
    );
    return false;
  }
};
