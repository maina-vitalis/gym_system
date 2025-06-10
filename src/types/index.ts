import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    firstName: string;
    lastName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    firstName: string;
    lastName: string;
  }
}

// Application types
export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  suspendedMembers: number;
  inactiveMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  failedPayments: number;
  memberGrowth: number;
  revenueGrowth: number;
  recentActivities: Array<{
    id: string;
    type: "member_joined" | "payment_received";
    member: string;
    timestamp: Date;
    description: string;
    amount?: number;
  }>;
  upcomingRenewals: Array<{
    id: string;
    name: string;
    date: Date;
    amount: number;
    plan: string;
    daysRemaining: number;
  }>;
  membershipStatusBreakdown: {
    active: number;
    expired: number;
    suspended: number;
    inactive: number;
  };
  paymentStats: {
    totalCompleted: number;
    totalPending: number;
    totalFailed: number;
    totalRefunded: number;
  };
}

export interface Member {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
  };
  dateOfBirth?: Date | null;
  gender?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  healthConditions?: string | null;
  fitnessGoals?: string | null;
  membershipNumber: string;
  membershipStatus: string;
  joinDate: Date;
  lastVisit?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  method: "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  description?: string | null;
  transactionRef?: string | null;
  paidAt?: Date | null;
  memberId?: string | null;
  member?: Member;
  membershipPlanId?: string | null;
  membershipPlan?: {
    name: string;
    price: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentReport {
  period: {
    year: number;
    month: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    averageTransaction: number;
  };
  breakdown: {
    byMethod: Record<string, number>;
    byPlan: Record<string, number>;
    dailyBreakdown: Record<string, number>;
  };
  topMembers: Array<{
    name: string;
    amount: number;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    description?: string | null;
    paidAt: Date | null;
    member: {
      name: string;
      email?: string;
    };
    plan?: string;
    transactionRef?: string | null;
  }>;
}

export interface MemberPaymentReport {
  member: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
    membershipNumber: string;
    membershipStatus: string;
    joinDate: Date;
  };
  period: {
    year: number;
    month: number;
    startDate: string;
    endDate: string;
  };
  monthly: {
    totalAmount: number;
    totalTransactions: number;
    averageTransaction: number;
    byMethod: Record<string, number>;
    payments: Array<{
      id: string;
      amount: number;
      method: string;
      description?: string | null;
      paidAt: Date | null;
      plan?: string;
      transactionRef?: string | null;
    }>;
  };
  overall: {
    totalPaid: number;
    totalTransactions: number;
    averageTransaction: number;
  };
  paymentHistory: Array<{
    amount: number;
    method: string;
    paidAt: Date | null;
  }>;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  description?: string | null;
  dueDate: Date;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  memberId: string;
  member?: Member;
  type: "CHECK_IN" | "CHECK_OUT";
  timestamp: Date;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceStats {
  totalVisitsToday: number;
  activeVisitors: number;
  popularTimes: Array<{
    hour: number;
    count: number;
  }>;
  weeklyAttendance: Array<{
    day: string;
    count: number;
  }>;
  monthlyStats: {
    totalVisits: number;
    uniqueVisitors: number;
  };
}

// Enhanced Member type with subscription information
export interface EnhancedMember extends Member {
  daysRemaining: number;
  subscriptionStatus: "ACTIVE" | "EXPIRED" | "INACTIVE";
  subscriptionEndDate: string | null;
  currentPlan: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

// Member with enhanced subscription data (for API responses)
export interface MemberWithSubscription extends Member {
  daysRemaining?: number;
  subscriptionStatus?: "ACTIVE" | "EXPIRED" | "INACTIVE";
  subscriptionEndDate?: string | null;
  currentPlan?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  lastPaymentDate?: string | null;
  lastPaymentAmount?: number | null;
}
