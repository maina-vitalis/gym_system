# Payments Table Components

This folder contains modular components for the payments table functionality, refactored from a single large component (950 lines) into smaller, manageable pieces for better maintainability and reusability.

## Structure Overview

The original 950-line `PaymentsTable` component has been broken down into 11 focused components:

### Core Components

- **`PaymentsTable`** - Main orchestrator component that combines all other components
- **`types.ts`** - TypeScript interfaces and type definitions

### UI Components

- **`PaymentBadges`** - Status and method badge components
- **`TableFilters`** - Search and filter controls
- **`TableHeader`** - Header with title, selection count, and action buttons
- **`TableColumns`** - Column definitions and configuration
- **`TablePagination`** - Pagination controls and navigation

### Utility Components

- **`ReceiptGenerator`** - PDF receipt generation and download functionality
- **`DataExport`** - CSV export functionality
- **`PaymentOperations`** - Delete and bulk delete operations

## Component Details

### 1. PaymentsTable (Main Component)

**File**: `payments-table.tsx` (242 lines)
**Purpose**: Main orchestrator that combines all components and manages state

### 2. PaymentBadges

**File**: `payment-badges.tsx` (40 lines)
**Purpose**: Visual status and method indicators
**Components**:

- `StatusBadge` - Payment status (PENDING, COMPLETED, FAILED, REFUNDED)
- `MethodBadge` - Payment method (CASH, CARD, BANK_TRANSFER, MOBILE_MONEY)

### 3. TableFilters

**File**: `table-filters.tsx` (60 lines)
**Purpose**: Search and filtering controls

### 4. TableHeader

**File**: `table-header.tsx` (45 lines)
**Purpose**: Table header with actions

### 5. TableColumns

**File**: `table-columns.tsx` (210 lines)
**Purpose**: Column definitions and cell renderers

### 6. TablePagination

**File**: `table-pagination.tsx` (65 lines)
**Purpose**: Pagination controls

### 7. ReceiptGenerator

**File**: `receipt-generator.tsx` (235 lines)
**Purpose**: Professional PDF receipt generation

### 8. DataExport

**File**: `data-export.tsx` (30 lines)
**Purpose**: CSV export functionality

### 9. PaymentOperations

**File**: `payment-operations.tsx` (55 lines)
**Purpose**: Payment CRUD operations

### 10. Types

**File**: `types.ts` (55 lines)
**Purpose**: TypeScript definitions

## Usage Examples

### Basic Usage

```tsx
import { PaymentsTable } from "@/components/payments/payments-table";

function PaymentsPage() {
  const { data: payments, isLoading, refetch } = usePayments();

  return (
    <PaymentsTable
      payments={payments || []}
      isLoading={isLoading}
      onPaymentDeleted={refetch}
    />
  );
}
```

## Key Features

### 1. Advanced Filtering & Search

- Global search across member names, emails, transaction refs, descriptions, and plan names
- Status-based filtering (All, Pending, Completed, Failed, Refunded)
- Payment method filtering (All, Cash, Card, Bank Transfer, M-Pesa)

### 2. Professional Receipt Generation

- PDF receipts with gym branding
- Member information section
- Payment details with plan information
- Professional layout with colors and typography

### 3. Bulk Operations

- Multi-select functionality
- Bulk delete with confirmation
- Selection count display

### 4. Data Export

- CSV export with all payment data
- Formatted dates and readable field names

### 5. M-Pesa Integration

- Special status tracking for mobile money payments
- Real-time status updates

## Type Safety

All components use strict TypeScript with proper interfaces:

- No `any` types used anywhere
- Proper generic typing for TanStack Table
- Type-safe event handlers and callbacks

## File Size Comparison

- **Original**: 950 lines in single file
- **Refactored**: 11 files, largest is 242 lines (main component)
- **Average**: ~85 lines per component
