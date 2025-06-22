# Membership Plans Components

A comprehensive set of React components for managing gym membership plans, refactored from a monolithic 512-line component into 8 focused, reusable components.

## 📁 Component Structure

src/components/membership-plans/
├── membership-plans.tsx # Main orchestrator component (110 lines)
├── page-header.tsx # Page header with title and create button (20 lines)
├── plan-filters.tsx # Search and filter controls (35 lines)
├── plan-card.tsx # Individual plan card display (120 lines)
├── plan-form.tsx # Create/edit plan form dialog (180 lines)
├── feature-input.tsx # Feature management input (55 lines)
├── empty-state.tsx # Empty state when no plans found (25 lines)
├── loading-skeleton.tsx # Loading skeleton for plan cards (35 lines)
├── types.ts # TypeScript interfaces (55 lines)
├── index.ts # Barrel exports (12 lines)
└── README.md # This documentation (150 lines)

## 🧩 Components Overview

### MembershipPlansComponent

**Main orchestrator component** that manages state and coordinates all other components.

**Features:**

- State management for search, filters, and form dialogs
- API integration with custom hooks
- Currency formatting utilities
- CRUD operations handling

**Props:** None (root component)

### MembershipPlansPageHeader

**Page header** with title, description, and create new plan button.

**Props:**

```typescript
interface PageHeaderProps {
  onCreateNew: () => void;
}
```

### PlanFilters

**Search and filtering controls** for finding specific plans.

**Features:**

- Real-time search by plan name and description
- Toggle to show/hide inactive plans
- Clean, accessible form controls

**Props:**

```typescript
interface PlanFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showInactive: boolean;
  onShowInactiveChange: (show: boolean) => void;
}
```

### PlanCard

**Individual plan display card** with rich information and actions.

**Features:**

- Plan details (name, price, duration, features)
- Status badges (Active/Inactive)
- Action dropdown (Edit, Toggle Status, Delete)
- Statistics display (member count, revenue)
- Responsive design

**Props:**

```typescript
interface PlanCardProps {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  formatCurrency: (amount: number) => string;
}
```

### PlanForm

**Create and edit form dialog** with comprehensive validation.

**Features:**

- React Hook Form integration with Zod validation
- Duration presets (1 week, 1 month, 3 months, etc.)
- Feature management with add/remove functionality
- Active/inactive status toggle
- Form reset on dialog close

**Props:**

```typescript
interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan: MembershipPlan | null;
  onSubmit: (data: MembershipPlanFormData) => Promise<void>;
  isSubmitting: boolean;
}
```

### FeatureInput

**Feature management component** for adding/removing plan features.

**Features:**

- Dynamic feature addition
- Duplicate prevention
- Click-to-remove badges
- Enter key support for quick addition

**Props:**

```typescript
interface FeatureInputProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}
```

### EmptyState

**Empty state display** when no plans are found.

**Features:**

- Contextual messaging (search vs. no plans)
- Call-to-action button for creating first plan
- Friendly, encouraging design

**Props:**

```typescript
interface EmptyStateProps {
  searchQuery: string;
  onCreateNew: () => void;
}
```

### LoadingSkeleton

**Loading skeleton** for plan cards during data fetching.

**Features:**

- Realistic card structure mimicking
- Smooth animation
- Responsive grid layout

**Props:** None

## 🔧 TypeScript Interfaces

### Core Types

```typescript
interface MembershipPlan {
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

interface MembershipPlanFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  features: string[];
  isActive: boolean;
}
```

## 🚀 Usage

### Basic Usage

```tsx
import { MembershipPlansComponent } from "@/components/membership-plans";

export default function MembershipPlansPage() {
  return <MembershipPlansComponent />;
}
```

### Individual Component Usage

```tsx
import { PlanCard, PlanFilters } from "@/components/membership-plans";

// Use individual components for custom layouts
function CustomPlanView() {
  return (
    <div>
      <PlanFilters {...filterProps} />
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} {...cardProps} />
      ))}
    </div>
  );
}
```

## 🎨 Features

### Form Validation

- **Zod Schema Integration**: Strict validation with `membershipPlanSchema`
- **Real-time Validation**: Immediate feedback on form errors
- **Type Safety**: Full TypeScript integration with no `any` types

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Skeleton loading for better perceived performance
- **Empty States**: Contextual messaging and call-to-action
- **Confirmation Dialogs**: Safe deletion with user confirmation

### Data Management

- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Search & Filter**: Real-time search with case-insensitive matching
- **Status Management**: Easy activation/deactivation of plans

### Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical focus flow through components

## 🔄 State Management

The component uses a combination of:

- **Local State**: `useState` for UI state (search, dialogs, editing)
- **Server State**: Custom hooks with TanStack Query for API operations
- **Form State**: React Hook Form for complex form management

## 🎯 Performance Optimizations

- **Memoized Calculations**: Filtered plans computed only when dependencies change
- **Efficient Re-renders**: Proper key props and state structure
- **Lazy Loading**: Dialog content loaded only when opened
- **Debounced Search**: (Can be added) Prevent excessive API calls

## 🧪 Testing Considerations

Each component is designed for easy testing:

- **Pure Functions**: Currency formatting and data filtering
- **Isolated Components**: Each component can be tested independently
- **Mock-friendly**: Props-based design allows easy mocking
- **Predictable State**: Clear state management patterns

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Flexible Grid**: Responsive grid that adapts to screen size
- **Touch Friendly**: Appropriate touch targets and spacing
- **Readable Typography**: Proper font sizes and contrast

## 🔧 Customization

### Styling

All components use Tailwind CSS classes and can be easily customized:

```tsx
// Custom styling example
<PlanCard className="custom-card-styles" plan={plan} {...props} />
```

### Functionality

Components are designed to be extensible:

```tsx
// Custom actions example
<PlanCard
  plan={plan}
  onEdit={customEditHandler}
  onDelete={customDeleteHandler}
  additionalActions={customActions}
  {...props}
/>
```

## 🚀 Future Enhancements

- **Drag & Drop**: Reorder plans by priority
- **Bulk Operations**: Select multiple plans for bulk actions
- **Export/Import**: CSV/JSON export/import functionality
- **Templates**: Pre-defined plan templates
- **Analytics**: Plan performance metrics and insights

---

This refactoring transforms a monolithic component into a maintainable, testable, and reusable component system while preserving all original functionality and improving the developer experience.
