export interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  phoneNumber?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  features: string[];
  isActive: boolean;
}

export interface PaymentData {
  amount: number;
  description: string;
  membershipPlanId?: string;
}
