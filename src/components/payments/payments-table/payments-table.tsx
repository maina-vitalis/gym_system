"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { exportPaymentsToCSV } from "./data-export";
import { bulkDeletePayments, deletePayment } from "./payment-operations";
import { usePaymentColumns } from "./table-columns";
import { PaymentTableFilters } from "./table-filters";
import { PaymentTableHeader } from "./table-header";
import { PaymentTablePagination } from "./table-pagination";
import { PaymentsTableProps, TableFilters } from "./types";

export function PaymentsTable({
  payments,
  isLoading = false,
  onPaymentDeleted,
}: PaymentsTableProps) {
  const [filters, setFilters] = useState<TableFilters>({
    globalFilter: "",
    statusFilter: "all",
    methodFilter: "all",
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleting, setDeleting] = useState(false);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<TableFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle single payment deletion
  const handleDeletePayment = async (paymentId: string) => {
    const success = await deletePayment(paymentId);
    if (success) {
      onPaymentDeleted?.();
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const paymentIds = selectedRows.map((row) => row.original.id);
    const memberNames = selectedRows
      .map((row) =>
        row.original.member
          ? `${row.original.member.user.firstName} ${row.original.member.user.lastName}`
          : "Unknown",
      )
      .slice(0, 3); // Limit to first 3 names for readability

    setDeleting(true);
    const success = await bulkDeletePayments(paymentIds, memberNames);
    if (success) {
      setRowSelection({});
      onPaymentDeleted?.();
    }
    setDeleting(false);
  };

  // Handle CSV export
  const handleExportCSV = () => {
    exportPaymentsToCSV(filteredData);
  };

  // Define columns with handlers
  const columns = usePaymentColumns({
    onPaymentDeleted,
    onDeletePayment: handleDeletePayment,
  });

  // Filter data based on status and method filters
  const filteredData = useMemo(() => {
    return payments.filter((payment) => {
      const statusMatch =
        filters.statusFilter === "all" ||
        payment.status === filters.statusFilter;
      const methodMatch =
        filters.methodFilter === "all" ||
        payment.method === filters.methodFilter;
      return statusMatch && methodMatch;
    });
  }, [payments, filters.statusFilter, filters.methodFilter]);

  // Configure table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: (value) =>
      handleFiltersChange({ globalFilter: value }),
    globalFilterFn: (row, columnId, filterValue) => {
      const payment = row.original;
      const searchValue = filterValue.toLowerCase();

      // Search in member name, email, transaction ref, and description
      const memberName = payment.member
        ? `${payment.member.user.firstName} ${payment.member.user.lastName}`.toLowerCase()
        : "";
      const memberEmail = payment.member?.user.email.toLowerCase() || "";
      const transactionRef = payment.transactionRef?.toLowerCase() || "";
      const description = payment.description?.toLowerCase() || "";
      const planName = payment.membershipPlan?.name.toLowerCase() || "";

      return (
        memberName.includes(searchValue) ||
        memberEmail.includes(searchValue) ||
        transactionRef.includes(searchValue) ||
        description.includes(searchValue) ||
        planName.includes(searchValue)
      );
    },
    state: {
      globalFilter: filters.globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    enableGlobalFilter: true,
    getRowId: (row) => row.id,
  });

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <PaymentTableHeader
          totalCount={0}
          selectedCount={0}
          isDeleting={false}
          onBulkDelete={() => {}}
          onExportCSV={() => {}}
        />
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <div className="border-foreground h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <PaymentTableHeader
        totalCount={filteredData.length}
        selectedCount={selectedRowCount}
        isDeleting={deleting}
        onBulkDelete={handleBulkDelete}
        onExportCSV={handleExportCSV}
      />
      <CardContent className="space-y-4">
        {/* Filters */}
        <PaymentTableFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-foreground/10"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <PaymentTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
