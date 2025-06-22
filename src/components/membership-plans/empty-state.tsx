"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { EmptyStateProps } from "./types";

export function EmptyState({ searchQuery, onCreateNew }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No membership plans found
        </h3>
        <p className="text-muted-foreground text-center">
          {searchQuery
            ? "No plans match your search criteria. Try adjusting your search."
            : "Get started by creating your first membership plan."}
        </p>
        {!searchQuery && (
          <Button className="mt-4" onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
