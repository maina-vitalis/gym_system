import { DashboardStats, Invoice, Member, Payment } from "@/types";

// Base API URL
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-domain.com"
    : "http://localhost:3000";

// Mock data for dashboard stats, payments, and invoices (these will be replaced later)
const mockPayments: Payment[] = [
  {
    id: "pay1",
    amount: 50.0,
    method: "CARD",
    status: "COMPLETED",
    description: "Monthly membership fee",
    transactionRef: "TXN001",
    paidAt: new Date("2024-12-01"),
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "pay2",
    amount: 75.0,
    method: "CASH",
    status: "PENDING",
    description: "Premium membership upgrade",
    transactionRef: null,
    paidAt: null,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-10"),
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNumber: "INV001",
    amount: 50.0,
    status: "PAID",
    description: "Monthly membership - December 2024",
    dueDate: new Date("2024-12-31"),
    paidAt: new Date("2024-12-01"),
    createdAt: new Date("2024-11-25"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "inv2",
    invoiceNumber: "INV002",
    amount: 50.0,
    status: "OVERDUE",
    description: "Monthly membership - November 2024",
    dueDate: new Date("2024-11-30"),
    paidAt: null,
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-11-30"),
  },
];

class ApiClient {
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getDashboardStats(): Promise<{ data: DashboardStats }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  }

  async getMembers(): Promise<{ data: Member[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch members:", error);
      throw error;
    }
  }

  async getPayments(): Promise<{ data: Payment[] }> {
    await this.delay(300);
    return { data: mockPayments };
  }

  async getInvoices(): Promise<{ data: Invoice[] }> {
    await this.delay(300);
    return { data: mockInvoices };
  }

  async getMember(id: string): Promise<{ data: Member | null }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return { data: null };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch member:", error);
      throw error;
    }
  }

  async createMember(memberData: Partial<Member>): Promise<{ data: Member }> {
    try {
      // Transform the member data to match the API schema
      const apiData = {
        firstName: memberData.user?.firstName,
        lastName: memberData.user?.lastName,
        email: memberData.user?.email,
        phoneNumber: memberData.user?.phoneNumber,
        dateOfBirth: memberData.dateOfBirth?.toISOString().split("T")[0],
        gender: memberData.gender,
        address: memberData.address,
        emergencyContactName: memberData.emergencyContactName,
        emergencyContactPhone: memberData.emergencyContactPhone,
        healthConditions: memberData.healthConditions,
        fitnessGoals: memberData.fitnessGoals,
      };

      const response = await fetch(`${API_BASE_URL}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to create member:", error);
      throw error;
    }
  }

  async updateMember(
    id: string,
    memberData: Partial<Member>
  ): Promise<{ data: Member }> {
    try {
      // Transform the member data to match the API schema
      const apiData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string | null;
        dateOfBirth?: string | null;
        gender?: string;
        address?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        healthConditions?: string;
        fitnessGoals?: string;
        membershipStatus?: string;
      } = {};

      if (memberData.user) {
        if (memberData.user.firstName)
          apiData.firstName = memberData.user.firstName;
        if (memberData.user.lastName)
          apiData.lastName = memberData.user.lastName;
        if (memberData.user.email) apiData.email = memberData.user.email;
        if (memberData.user.phoneNumber !== undefined)
          apiData.phoneNumber = memberData.user.phoneNumber;
      }

      if (memberData.dateOfBirth !== undefined) {
        apiData.dateOfBirth = memberData.dateOfBirth
          ? memberData.dateOfBirth.toISOString().split("T")[0]
          : null;
      }
      if (memberData.gender !== undefined)
        apiData.gender = memberData.gender || undefined;
      if (memberData.address !== undefined)
        apiData.address = memberData.address || undefined;
      if (memberData.emergencyContactName !== undefined)
        apiData.emergencyContactName =
          memberData.emergencyContactName || undefined;
      if (memberData.emergencyContactPhone !== undefined)
        apiData.emergencyContactPhone =
          memberData.emergencyContactPhone || undefined;
      if (memberData.healthConditions !== undefined)
        apiData.healthConditions = memberData.healthConditions || undefined;
      if (memberData.fitnessGoals !== undefined)
        apiData.fitnessGoals = memberData.fitnessGoals || undefined;
      if (memberData.membershipStatus)
        apiData.membershipStatus = memberData.membershipStatus;

      const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to update member:", error);
      throw error;
    }
  }

  async deleteMember(id: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to delete member:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
