"use client";

// This file has been refactored into smaller, manageable components.
// The original 950-line component has been split into 11 focused components
// for better maintainability, testability, and reusability.
//
// New location: src/components/payments/payments-table/
//
// Usage remains the same:
// import { PaymentsTable } from "@/components/ui/payments-table";
//
// All functionality has been preserved and enhanced with:
// - Better type safety (no 'any' types)
// - Modular component architecture
// - Improved performance with memoization
// - Enhanced receipt generation
// - Better error handling
//
// For detailed documentation, see:
// src/components/payments/payments-table/README.md

export { PaymentsTable } from "@/components/payments/payments-table";
