export interface Payment {
  id: string;
  amount: number;
  method: "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  description?: string;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
  member?: {
    id: string;
    membershipNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  membershipPlan?: {
    name: string;
    price: number;
    duration: number;
  };
}

export interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
  onPaymentDeleted?: () => void;
}

export interface TableFilters {
  globalFilter: string;
  statusFilter: string;
  methodFilter: string;
}

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  time: string;
  member?: {
    name: string;
    membershipNumber: string;
    email: string;
    phone: string;
  };
  payment: {
    description: string;
    amount: number;
    method: string;
    status: string;
    transactionRef: string;
  };
  plan?: {
    name: string;
    duration: number;
  };
}
