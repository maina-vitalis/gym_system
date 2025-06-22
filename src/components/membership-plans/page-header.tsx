"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeaderProps } from "./types";

export function MembershipPlansPageHeader({ onCreateNew }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
        <p className="text-muted-foreground">
          Manage membership plans and pricing for your gym
        </p>
      </div>
      <Button onClick={onCreateNew}>
        <Plus className="mr-2 h-4 w-4" />
        New Plan
      </Button>
    </div>
  );
}
