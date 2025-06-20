"use client";

import { Badge } from "@/components/ui/badge";
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
import { MemberWithSubscription } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CreateMembersColumnsOptions {
  router: AppRouterInstance;
  onDeleteMember: (memberId: string, memberName: string) => void;
  onSuspendMember: (
    memberId: string,
    memberName: string,
    currentStatus: string
  ) => void;
  isDeleting: boolean;
  getStatusColor: (status: string) => string;
  formatDate: (date: Date) => string;
}

export function createMembersColumns({
  router,
  onDeleteMember,
  onSuspendMember,
  isDeleting,
  getStatusColor,
  formatDate,
}: CreateMembersColumnsOptions): ColumnDef<MemberWithSubscription>[] {
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
      accessorKey: "user",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">
                {member.user.firstName} {member.user.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {member.user.email}
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const nameA = `${rowA.original.user.firstName} ${rowA.original.user.lastName}`;
        const nameB = `${rowB.original.user.firstName} ${rowB.original.user.lastName}`;
        return nameA.localeCompare(nameB);
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: "currentPlan",
      header: "Current Plan",
      cell: ({ row }) => {
        const member = row.original;
        const plan = member.currentPlan;
        if (!plan) {
          return (
            <span className="text-sm text-muted-foreground">
              No active plan
            </span>
          );
        }
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{plan.name}</div>
            <div className="text-xs text-muted-foreground">
              KES {plan.price.toLocaleString()} • {plan.duration} days
            </div>
          </div>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: "daysRemaining",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Days Remaining
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => {
        const member = row.original;
        const daysRemaining = member.daysRemaining || 0;
        const subscriptionStatus = member.subscriptionStatus;

        if (subscriptionStatus === "INACTIVE") {
          return (
            <span className="text-sm text-muted-foreground">
              No subscription
            </span>
          );
        }

        let colorClass = "text-green-600";
        if (daysRemaining <= 7 && daysRemaining > 0) {
          colorClass = "text-yellow-600";
        } else if (daysRemaining <= 0) {
          colorClass = "text-red-600";
        }

        return (
          <div className="space-y-1">
            <div className={`font-medium text-sm ${colorClass}`}>
              {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
            </div>
            {member.subscriptionEndDate && (
              <div className="text-xs text-muted-foreground">
                Until {formatDate(new Date(member.subscriptionEndDate))}
              </div>
            )}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const daysA = rowA.original.daysRemaining || 0;
        const daysB = rowB.original.daysRemaining || 0;
        return daysA - daysB;
      },
      enableGlobalFilter: false,
    },
    {
      accessorKey: "user.phoneNumber",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.original.user.phoneNumber;
        return phone ? (
          <span className="text-sm">{phone}</span>
        ) : (
          <span className="text-sm text-muted-foreground">Not provided</span>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: "membershipStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("membershipStatus") as string;
        const member = row.original;
        const subscriptionStatus = member.subscriptionStatus;

        // Show subscription status if different from membership status
        const displayStatus =
          subscriptionStatus === "EXPIRED" ? "EXPIRED" : status;

        return (
          <div className="space-y-1">
            <Badge
              variant="secondary"
              className={getStatusColor(displayStatus)}
            >
              {displayStatus}
            </Badge>
            {member.lastPaymentDate && (
              <div className="text-xs text-muted-foreground">
                Last payment: {formatDate(new Date(member.lastPaymentDate))}
              </div>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        const member = row.original;
        const subscriptionStatus = member.subscriptionStatus;
        const membershipStatus = row.getValue(id)?.toString().toLowerCase();
        const displayStatus =
          subscriptionStatus === "EXPIRED" ? "expired" : membershipStatus;
        return displayStatus === value;
      },
      enableGlobalFilter: false,
    },
    {
      accessorKey: "joinDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Join Date
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => formatDate(row.getValue("joinDate")),
      sortingFn: "datetime",
      enableGlobalFilter: false,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/members/${member.id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/members/${member.id}/edit`)
                }
              >
                Edit Member
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={
                  member.membershipStatus === "SUSPENDED"
                    ? "text-green-600"
                    : "text-orange-600"
                }
                onClick={() =>
                  onSuspendMember(
                    member.id,
                    `${member.user.firstName} ${member.user.lastName}`,
                    member.membershipStatus
                  )
                }
              >
                {member.membershipStatus === "SUSPENDED"
                  ? "Unsuspend Member"
                  : "Suspend Member"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() =>
                  onDeleteMember(
                    member.id,
                    `${member.user.firstName} ${member.user.lastName}`
                  )
                }
                disabled={isDeleting}
              >
                Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
      enableGlobalFilter: false,
    },
  ];
}
