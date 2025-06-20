"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MembersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="animate-pulse">
          <div className="h-9 w-32 bg-muted rounded mb-2"></div>
          <div className="h-4 w-80 bg-muted rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          {/* Action buttons skeleton */}
          <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
          <div className="h-9 w-28 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`stat-${i}`} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Card Skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded mb-2"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
            <div className="flex-1">
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
            <div className="md:w-48">
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
            <div className="h-10 w-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card Skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded mb-2"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <div className="rounded-md border">
              {/* Table Header Skeleton */}
              <div className="border-b bg-muted/50 p-4">
                <div className="flex space-x-4">
                  <div className="h-4 w-4 bg-muted rounded"></div>
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-28 bg-muted rounded"></div>
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </div>
              </div>

              {/* Table Rows Skeleton */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`row-${i}`} className="border-b p-4">
                  <div className="flex space-x-4 items-center">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-6 w-16 bg-muted rounded-full"></div>
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-4 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="h-4 w-48 bg-muted rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
              <div className="h-4 w-20 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
