"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useDeleteMember, useMembers } from "@/hooks/use-members";
import { MemberWithSubscription } from "@/types";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function MembersPage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // React Query hooks
  const { data: members = [], isLoading, error } = useMembers();
  const deleteMemberMutation = useDeleteMember();

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete ${memberName}?`)) return;

    try {
      await deleteMemberMutation.mutateAsync(memberId);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Delete member error:", error);
    }
  };

  const handleSuspendMember = async (
    memberId: string,
    memberName: string,
    currentStatus: string
  ) => {
    const action = currentStatus === "SUSPENDED" ? "unsuspend" : "suspend";
    const reason =
      action === "suspend"
        ? prompt(`Enter reason for suspending ${memberName}:`)
        : null;

    if (action === "suspend" && !reason) return; // User cancelled

    try {
      const response = await fetch(`/api/members/${memberId}/suspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, reason }),
      });

      if (response.ok) {
        // Refresh the members list
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to ${action} member: ${error.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} member:`, error);
      alert(`Failed to ${action} member`);
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const memberNames = selectedRows
      .map(
        (row) => `${row.original.user.firstName} ${row.original.user.lastName}`
      )
      .join(", ");

    if (
      !confirm(
        `Are you sure you want to delete ${selectedRows.length} members: ${memberNames}?`
      )
    )
      return;

    try {
      await Promise.all(
        selectedRows.map((row) =>
          deleteMemberMutation.mutateAsync(row.original.id)
        )
      );
      setRowSelection({});
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  };

  const exportToCSV = () => {
    const csvData = members.map((member) => ({
      Name: `${member.user.firstName} ${member.user.lastName}`,
      Email: member.user.email,
      Phone: member.user.phoneNumber || "",
      MembershipNumber: member.membershipNumber,
      Status: member.membershipStatus,
      JoinDate: new Date(member.joinDate).toLocaleDateString(),
      LastVisit: member.lastVisit
        ? new Date(member.lastVisit).toLocaleDateString()
        : "Never",
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row]}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `members-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Enhanced table columns definition
  const columns = useMemo<ColumnDef<MemberWithSubscription>[]>(
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
        accessorKey: "user",
        header: "Member",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src=""
                  alt={`${member.user.firstName} ${member.user.lastName}`}
                />
                <AvatarFallback>
                  {member.user.firstName[0]}
                  {member.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
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
        accessorKey: "membershipNumber",
        header: "Membership #",
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue("membershipNumber")}
          </span>
        ),
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
        accessorKey: "lastVisit",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Last Visit
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        ),
        cell: ({ row }) => {
          const lastVisit = row.getValue("lastVisit") as Date | null;
          return lastVisit ? formatDate(lastVisit) : "Never";
        },
        sortingFn: (rowA, rowB) => {
          const dateA = rowA.getValue("lastVisit") as Date | null;
          const dateB = rowB.getValue("lastVisit") as Date | null;

          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;

          return new Date(dateA).getTime() - new Date(dateB).getTime();
        },
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
                    handleSuspendMember(
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
                    handleDeleteMember(
                      member.id,
                      `${member.user.firstName} ${member.user.lastName}`
                    )
                  }
                  disabled={deleteMemberMutation.isPending}
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, deleteMemberMutation.isPending]
  );

  // Enhanced table instance
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const member = row.original;
      const searchValue = filterValue.toLowerCase();

      // Search in member name and email
      const fullName =
        `${member.user.firstName} ${member.user.lastName}`.toLowerCase();
      const email = member.user.email.toLowerCase();
      const membershipNumber = member.membershipNumber.toLowerCase();
      const phone = member.user.phoneNumber?.toLowerCase() || "";

      return (
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        membershipNumber.includes(searchValue) ||
        phone.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    enableGlobalFilter: true,
    getRowId: (row) => row.id,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className=" text-red-600">
              Failed to load members. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your gym members and their memberships
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedRowCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deleteMemberMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete {selectedRowCount} selected
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/dashboard/members/reports">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="/dashboard/members/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter((m) => m.membershipStatus === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                members.filter((m) => {
                  const joinDate = new Date(m.joinDate);
                  const currentMonth = new Date().getMonth();
                  const currentYear = new Date().getFullYear();
                  return (
                    joinDate.getMonth() === currentMonth &&
                    joinDate.getFullYear() === currentYear
                  );
                }).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter((m) => m.membershipStatus === "EXPIRED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search Members</CardTitle>
          <CardDescription>
            Search, filter, and manage members with advanced table controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members by name or email..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select
                value={
                  (table
                    .getColumn("membershipStatus")
                    ?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("membershipStatus")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Checkbox
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          className="mr-2"
                        />
                        {column.id}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
          <CardDescription>
            {table.getFilteredRowModel().rows.length} of {members.length}{" "}
            members
            {selectedRowCount > 0 && ` (${selectedRowCount} selected)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-left">
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
                        className={row.getIsSelected() ? "bg-muted/50" : ""}
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
                        No members found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedRowCount > 0 && (
                <span className="mr-4">
                  {selectedRowCount} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </span>
              )}
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
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <Button
                  variant="outline"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
