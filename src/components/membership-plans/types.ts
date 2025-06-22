export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalMembers: number;
    revenueLastMonth: number;
  };
}

export interface MembershipPlanFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  features: string[];
  isActive: boolean;
}

export interface PlanCardProps {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  formatCurrency: (amount: number) => string;
}

export interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan: MembershipPlan | null;
  onSubmit: (data: MembershipPlanFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface PlanFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showInactive: boolean;
  onShowInactiveChange: (show: boolean) => void;
}

export interface PageHeaderProps {
  onCreateNew: () => void;
}

export interface EmptyStateProps {
  searchQuery: string;
  onCreateNew: () => void;
}
