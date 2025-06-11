"use client";

import { useMemberCacheStats } from "@/hooks/use-member-search";
import { Database, Search, Users, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function CacheStatus() {
  const stats = useMemberCacheStats();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          Cache Status
        </CardTitle>
        <CardDescription className="text-xs">
          Member search performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">Members</span>
            </div>
            <div className="text-lg font-semibold">{stats.allMembersCount}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Search className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Searches</span>
            </div>
            <div className="text-lg font-semibold">{stats.searchCacheSize}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Cache Status</span>
          <Badge
            variant={stats.allMembersCached ? "default" : "secondary"}
            className="text-xs"
          >
            {stats.allMembersCached ? (
              <>
                <Zap className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              "Warming..."
            )}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          {stats.allMembersCached
            ? "🚀 Search results are instant from cache"
            : "⏳ Cache is warming up for faster searches"}
        </div>
      </CardContent>
    </Card>
  );
}
