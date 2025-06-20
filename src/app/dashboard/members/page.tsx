"use client";

import {
  MembersDataTable,
  MembersFiltersCard,
  MembersHeader,
  MembersLoadingSkeleton,
  MembersStatsCards,
  createMembersColumns,
} from "@/components/members";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MembersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Fetch members
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await apiClient.getMembers();
      return response.data;
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) => apiClient.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  // Suspend member mutation
  const suspendMemberMutation = useMutation({
    mutationFn: ({
      memberId,
      suspend,
    }: {
      memberId: string;
      suspend: boolean;
    }) => apiClient.suspendMember(memberId, suspend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update member status");
    },
  });

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${memberName}? This action cannot be undone.`
      )
    ) {
      deleteMemberMutation.mutate(memberId);
    }
  };

  const handleSuspendMember = async (
    memberId: string,
    memberName: string,
    currentStatus: string
  ) => {
    const action = currentStatus === "SUSPENDED" ? "unsuspend" : "suspend";
    if (confirm(`Are you sure you want to ${action} ${memberName}?`)) {
      suspendMemberMutation.mutate({
        memberId,
        suspend: currentStatus !== "SUSPENDED",
      });
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const memberIds = selectedRows.map((row) => row.original.id);
    const memberNames = selectedRows.map(
      (row) => `${row.original.user.firstName} ${row.original.user.lastName}`
    );

    if (
      confirm(
        `Are you sure you want to delete ${
          memberIds.length
        } members?\n\n${memberNames.join(
          ", "
        )}\n\nThis action cannot be undone.`
      )
    ) {
      try {
        await Promise.all(memberIds.map((id) => apiClient.deleteMember(id)));
        queryClient.invalidateQueries({ queryKey: ["members"] });
        toast.success(`Successfully deleted ${memberIds.length} members`);
        setRowSelection({});
      } catch {
        toast.error("Failed to delete some members. Please try again.");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Status", "Join Date"];

    const csvData = members.map((member) => [
      `${member.user.firstName} ${member.user.lastName}`,
      member.user.email,
      member.user.phoneNumber || "N/A",
      member.membershipStatus,
      formatDate(member.joinDate),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "expired":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Create table columns
  const columns = createMembersColumns({
    router,
    onDeleteMember: handleDeleteMember,
    onSuspendMember: handleSuspendMember,
    isDeleting: deleteMemberMutation.isPending,
    getStatusColor,
    formatDate,
  });

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
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
  });

  // Loading state
  if (isLoading) {
    return <MembersLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-red-600">
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
      <MembersHeader
        selectedRowCount={selectedRowCount}
        onBulkDelete={handleBulkDelete}
        onExportCSV={exportToCSV}
        isDeleting={deleteMemberMutation.isPending}
      />

      <MembersStatsCards members={members} />

      <MembersFiltersCard
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        table={table}
      />

      <MembersDataTable
        table={table}
        members={members}
        selectedRowCount={selectedRowCount}
      />
    </div>
  );
}
