"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MpesaStatusTracker } from "@/components/ui/mpesa-status-tracker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  MoreHorizontal,
  Receipt,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Payment type definition
interface Payment {
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

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
  onPaymentDeleted?: () => void;
}

// Status badge component
const StatusBadge = ({ status }: { status: Payment["status"] }) => {
  const variants = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status}
    </Badge>
  );
};

// Method badge component
const MethodBadge = ({ method }: { method: Payment["method"] }) => {
  const variants = {
    CASH: "bg-blue-100 text-blue-800 border-blue-200",
    CARD: "bg-purple-100 text-purple-800 border-purple-200",
    BANK_TRANSFER: "bg-indigo-100 text-indigo-800 border-indigo-200",
    MOBILE_MONEY: "bg-green-100 text-green-800 border-green-200",
  };

  const labels = {
    CASH: "Cash",
    CARD: "Card",
    BANK_TRANSFER: "Bank Transfer",
    MOBILE_MONEY: "M-Pesa",
  };

  return (
    <Badge className={variants[method]} variant="outline">
      {labels[method]}
    </Badge>
  );
};

// Professional PDF receipt download function
const downloadReceipt = async (payment: Payment) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { default: jsPDF } = await import("jspdf");

    const response = await fetch(`/api/payments/${payment.id}/receipt`);

    if (!response.ok) {
      throw new Error("Failed to generate receipt data");
    }

    const { receiptData, receiptNumber } = await response.json();

    // Create new PDF document
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Colors
    const primaryColor: [number, number, number] = [102, 126, 234]; // #667eea
    const secondaryColor: [number, number, number] = [108, 117, 125]; // #6c757d
    const successColor: [number, number, number] = [40, 167, 69]; // #28a745
    const textColor: [number, number, number] = [73, 80, 87]; // #495057

    // Header with gradient effect (simulated with rectangles)
    pdf.setFillColor(102, 126, 234);
    pdf.rect(0, 0, pageWidth, 50, "F");

    // Gym name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("FITNESS GYM", pageWidth / 2, 25, { align: "center" });

    // Receipt title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Payment Receipt", pageWidth / 2, 35, { align: "center" });

    // Receipt info section
    let yPos = 70;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Receipt #${receiptNumber}`, 20, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.text(receiptData.date, pageWidth - 20, yPos, { align: "right" });
    pdf.text(receiptData.time, pageWidth - 20, yPos + 5, { align: "right" });

    // Divider line
    yPos += 15;
    pdf.setDrawColor(233, 236, 239);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos, pageWidth - 20, yPos);

    // Member Information Section
    if (receiptData.member) {
      yPos += 15;
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Member Information", 20, yPos);

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const memberInfo = [
        ["Name:", receiptData.member.name],
        ["Membership #:", receiptData.member.membershipNumber],
        ["Email:", receiptData.member.email],
        ["Phone:", receiptData.member.phone],
      ];

      memberInfo.forEach(([label, value]) => {
        yPos += 6;
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.text(label, 25, yPos);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFont("helvetica", "bold");
        pdf.text(value, 70, yPos);
        pdf.setFont("helvetica", "normal");
      });

      yPos += 10;
      pdf.setDrawColor(222, 226, 230);
      pdf.line(20, yPos, pageWidth - 20, yPos);
    }

    // Payment Details Section
    yPos += 15;
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Payment Details", 20, yPos);

    yPos += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const paymentInfo = [
      ["Description:", receiptData.payment.description],
      ...(receiptData.plan
        ? [
            [
              "Plan:",
              `${receiptData.plan.name} (${receiptData.plan.duration} days)`,
            ],
          ]
        : []),
      ["Payment Method:", receiptData.payment.method.replace("_", " ")],
      ["Transaction Ref:", receiptData.payment.transactionRef],
      ["Status:", receiptData.payment.status],
    ];

    paymentInfo.forEach(([label, value]) => {
      yPos += 6;
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.text(label, 25, yPos);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFont("helvetica", "bold");
      pdf.text(value, 70, yPos);
      pdf.setFont("helvetica", "normal");
    });

    // Amount section with background
    yPos += 20;
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(20, yPos - 5, pageWidth - 40, 25, 3, 3, "F");

    pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `KES ${receiptData.payment.amount.toLocaleString()}`,
      pageWidth / 2,
      yPos + 10,
      { align: "center" }
    );

    // Footer
    yPos += 40;
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Thank you for your payment!", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 10;
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("For any inquiries, please contact us.", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 8;
    pdf.setFontSize(8);
    pdf.text("This is a computer-generated receipt.", pageWidth / 2, yPos, {
      align: "center",
    });

    // Add a subtle border
    pdf.setDrawColor(222, 226, 230);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 55, pageWidth - 30, yPos - 50);

    // Save the PDF
    pdf.save(`receipt-${receiptNumber}.pdf`);
  } catch (error) {
    console.error("Failed to download receipt:", error);
    // Fallback to simple text receipt
    const receiptData = {
      receiptNumber: `RCP-${payment.id.slice(-8).toUpperCase()}`,
      date: payment.paidAt ? format(new Date(payment.paidAt), "PPP") : "N/A",
      time: payment.paidAt ? format(new Date(payment.paidAt), "p") : "N/A",
      member: payment.member
        ? `${payment.member.user.firstName} ${payment.member.user.lastName}`
        : "N/A",
      membershipNumber: payment.member?.membershipNumber || "N/A",
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      description: payment.description || "Payment",
      transactionRef: payment.transactionRef || "N/A",
      plan: payment.membershipPlan?.name || "N/A",
    };

    const receiptContent = `
RECEIPT
${receiptData.receiptNumber}

Date: ${receiptData.date}
Time: ${receiptData.time}

MEMBER DETAILS
Name: ${receiptData.member}
Membership #: ${receiptData.membershipNumber}

PAYMENT DETAILS
Description: ${receiptData.description}
Plan: ${receiptData.plan}
Amount: KES ${receiptData.amount.toLocaleString()}
Method: ${receiptData.method.replace("_", " ")}
Status: ${receiptData.status}
Transaction Ref: ${receiptData.transactionRef}

Thank you for your payment!
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${receiptData.receiptNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};

export function PaymentsTable({
  payments,
  isLoading = false,
  onPaymentDeleted,
}: PaymentsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleting, setDeleting] = useState(false);

  // Delete functions
  const deletePayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete payment");
      }

      toast.success("Payment deleted successfully");
      onPaymentDeleted?.();
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete payment"
      );
    }
  };

  const bulkDeletePayments = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const paymentIds = selectedRows.map((row) => row.original.id);
    const memberNames = selectedRows
      .map((row) =>
        row.original.member
          ? `${row.original.member.user.firstName} ${row.original.member.user.lastName}`
          : "Unknown"
      )
      .join(", ");

    if (
      !confirm(
        `Are you sure you want to delete ${selectedRows.length} payment(s) for: ${memberNames}?`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch("/api/payments/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete payments");
      }

      const result = await response.json();
      toast.success(result.message);
      setRowSelection({});
      onPaymentDeleted?.();
    } catch (error) {
      console.error("Failed to bulk delete payments:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete payments"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Define columns
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "member",
        accessorFn: (row) => row.member,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Member
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => {
          const member = getValue() as Payment["member"];
          if (!member) return <span className="text-gray-500">N/A</span>;
          return (
            <div className="space-y-1">
              <div className="font-medium">
                {member.user.firstName} {member.user.lastName}
              </div>
              <div className="text-sm text-gray-500">
                {member.membershipNumber}
              </div>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const memberA = rowA.original.member;
          const memberB = rowB.original.member;
          if (!memberA && !memberB) return 0;
          if (!memberA) return 1;
          if (!memberB) return -1;
          const nameA = `${memberA.user.firstName} ${memberA.user.lastName}`;
          const nameB = `${memberB.user.firstName} ${memberB.user.lastName}`;
          return nameA.localeCompare(nameB);
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Amount
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => (
          <div className="font-medium">
            KES {(getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ getValue }) => (
          <MethodBadge method={getValue() as Payment["method"]} />
        ),
        filterFn: (row, id, value) => {
          if (value === "all") return true;
          return row.getValue(id) === value;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const payment = row.original;

          // Use M-Pesa status tracker for mobile money payments
          if (payment.method === "MOBILE_MONEY") {
            return (
              <MpesaStatusTracker
                payment={payment}
                onStatusUpdate={onPaymentDeleted}
                isCompact={true}
              />
            );
          }

          // Standard status badge for other payment methods
          return <StatusBadge status={payment.status} />;
        },
      },
      {
        id: "plan",
        accessorFn: (row) => row.membershipPlan,
        header: "Plan",
        cell: ({ getValue }) => {
          const plan = getValue() as Payment["membershipPlan"];
          if (!plan) return <span className="text-gray-500">N/A</span>;
          return (
            <div className="space-y-1">
              <div className="font-medium">{plan.name}</div>
              <div className="text-sm text-gray-500">{plan.duration} days</div>
            </div>
          );
        },
      },
      // {
      //   accessorKey: "transactionRef",
      //   header: "Transaction Ref",
      //   cell: ({ getValue }) => {
      //     const ref = getValue() as string;
      //     if (!ref) return <span className="text-gray-500">N/A</span>;
      //     return (
      //       <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ref}</code>
      //     );
      //   },
      // },
      {
        accessorKey: "paidAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => {
          const date = getValue() as string;
          if (!date) return <span className="text-gray-500">N/A</span>;
          return (
            <div className="space-y-1">
              <div>{format(new Date(date), "MMM dd, yyyy")}</div>
              <div className="text-sm text-gray-500">
                {format(new Date(date), "HH:mm")}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => downloadReceipt(payment)}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Download Receipt
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this payment?")
                    ) {
                      deletePayment(payment.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Payment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPaymentDeleted]
  );

  // Filter data based on status and method filters
  const filteredData = useMemo(() => {
    return payments.filter((payment) => {
      const statusMatch =
        statusFilter === "all" || payment.status === statusFilter;
      const methodMatch =
        methodFilter === "all" || payment.method === methodFilter;
      return statusMatch && methodMatch;
    });
  }, [payments, statusFilter, methodFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
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
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    enableGlobalFilter: true,
    getRowId: (row) => row.id,
  });

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  // Export function
  const exportToCSV = () => {
    const csvData = filteredData.map((payment) => ({
      Member: payment.member
        ? `${payment.member.user.firstName} ${payment.member.user.lastName}`
        : "N/A",
      MembershipNumber: payment.member?.membershipNumber || "N/A",
      Amount: payment.amount,
      Method: payment.method,
      Status: payment.status,
      Plan: payment.membershipPlan?.name || "N/A",
      TransactionRef: payment.transactionRef || "N/A",
      Date: payment.paidAt
        ? format(new Date(payment.paidAt), "yyyy-MM-dd HH:mm:ss")
        : "N/A",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Payments ({filteredData.length})
            {selectedRowCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({selectedRowCount} selected)
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedRowCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDeletePayments}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {selectedRowCount} selected
              </Button>
            )}
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <Select value={methodFilter} onValueChange={setMethodFilter}>
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
                              header.getContext()
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
                      className="hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
