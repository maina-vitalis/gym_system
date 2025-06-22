"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";

interface TableHeaderProps {
  totalCount: number;
  selectedCount: number;
  isDeleting: boolean;
  onBulkDelete: () => void;
  onExportCSV: () => void;
}

export function PaymentTableHeader({
  totalCount,
  selectedCount,
  isDeleting,
  onBulkDelete,
  onExportCSV,
}: TableHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>
          Payments ({totalCount})
          {selectedCount > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({selectedCount} selected)
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedCount} selected
            </Button>
          )}
          <Button onClick={onExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
