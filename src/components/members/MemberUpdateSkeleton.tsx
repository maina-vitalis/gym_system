import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface MemberFormSkeletonProps {
  memberId: string;
}

function MemberFormSkeleton({ memberId }: MemberFormSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center">
        <Link href={`/dashboard/members/${memberId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Member
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        <p className="text-muted-foreground">Loading member details...</p>
      </div>

      <div className="space-y-6">
        {/* Personal Information Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-muted h-6 w-48 animate-pulse rounded" />
              <div className="bg-muted h-4 w-64 animate-pulse rounded" />
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    <div className="bg-muted h-10 w-full animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-muted h-6 w-40 animate-pulse rounded" />
              <div className="bg-muted h-4 w-56 animate-pulse rounded" />
              <div className="mt-6 space-y-2">
                <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                <div className="bg-muted h-10 w-full animate-pulse rounded md:w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-muted h-6 w-44 animate-pulse rounded" />
              <div className="bg-muted h-4 w-52 animate-pulse rounded" />
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    <div className="bg-muted h-10 w-full animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health & Fitness Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-muted h-6 w-56 animate-pulse rounded" />
              <div className="bg-muted h-4 w-64 animate-pulse rounded" />
              <div className="mt-6 space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    <div className="bg-muted h-24 w-full animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-end gap-4">
          <div className="bg-muted h-10 w-24 animate-pulse rounded" />
          <div className="bg-muted h-10 w-32 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default MemberFormSkeleton;
