"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MpesaStatusTracker } from "@/components/ui/mpesa-status-tracker";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Receipt,
  Trash2,
} from "lucide-react";
import { MethodBadge, StatusBadge } from "./payment-badges";
import { downloadReceipt } from "./receipt-generator";
import { Payment } from "./types";

interface UsePaymentColumnsProps {
  onPaymentDeleted?: () => void;
  onDeletePayment: (paymentId: string) => void;
}

export function usePaymentColumns({
  onPaymentDeleted,
  onDeletePayment,
}: UsePaymentColumnsProps): ColumnDef<Payment>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
                    onDeletePayment(payment.id);
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
  ];
}
