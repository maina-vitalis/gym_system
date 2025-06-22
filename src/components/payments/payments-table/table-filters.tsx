"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { TableFilters } from "./types";

interface TableFiltersProps {
  filters: TableFilters;
  onFiltersChange: (filters: Partial<TableFilters>) => void;
}

export function PaymentTableFilters({
  filters,
  onFiltersChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search payments..."
          value={filters.globalFilter ?? ""}
          onChange={(e) => onFiltersChange({ globalFilter: e.target.value })}
          className="pl-10"
        />
      </div>

      <Select
        value={filters.statusFilter}
        onValueChange={(value) => onFiltersChange({ statusFilter: value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
          <SelectItem value="REFUNDED">Refunded</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.methodFilter}
        onValueChange={(value) => onFiltersChange({ methodFilter: value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          <SelectItem value="CASH">Cash</SelectItem>
          <SelectItem value="CARD">Card</SelectItem>
          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
          <SelectItem value="MOBILE_MONEY">M-Pesa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
