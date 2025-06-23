"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Plus } from "lucide-react";
import Link from "next/link";

interface MembersHeaderProps {
  onExportCSV: () => void;
}

export default function MembersHeader({ onExportCSV }: MembersHeaderProps) {
  return (
    <div className="space-y-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground">
          Manage your gym members and their memberships
        </p>
      </div>
      <div className="flex items-center gap-2">
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
            <p className="hidden sm:block">Add Member</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
