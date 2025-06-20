"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface MembersHeaderProps {
  selectedRowCount: number;
  onBulkDelete: () => void;
  onExportCSV: () => void;
  isDeleting: boolean;
}

export default function MembersHeader({
  selectedRowCount,
  onBulkDelete,
  onExportCSV,
  isDeleting,
}: MembersHeaderProps) {
  return (
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
            onClick={onBulkDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {selectedRowCount} selected
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onExportCSV}>
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
  );
}
