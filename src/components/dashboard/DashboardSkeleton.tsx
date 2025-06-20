import { Card, CardContent, CardHeader } from "@/components/ui/card";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="items-center justify-between">
        <div className="flex justify-between">
          <div className="animate-pulse">
            <div className="h-9 w-48 bg-muted rounded mb-2"></div>
            <div className="h-4 w-80 bg-muted rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Key Metrics Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={`metric-${i}`}
            className="hover:shadow-md transition-shadow animate-pulse"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Status Breakdown Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`status-${i}`} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-16 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-muted rounded mb-2"></div>
              <div className="h-3 w-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={`alert-${i}`} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-28 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-8 bg-muted rounded mb-2"></div>
              <div className="h-3 w-36 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        {/* Tab Navigation Skeleton */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`tab-${i}`}
              className="h-9 w-20 bg-background rounded"
            ></div>
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Quick Actions Card Skeleton */}
            <Card className="col-span-4 animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded mb-2"></div>
                <div className="h-4 w-64 bg-muted rounded"></div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`action-${i}`}
                    className="h-16 bg-muted rounded"
                  ></div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Renewals Card Skeleton */}
            <Card className="col-span-4 md:col-span-3 animate-pulse">
              <CardHeader>
                <div className="h-6 w-40 bg-muted rounded mb-2"></div>
                <div className="h-4 w-56 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`renewal-${i}`}
                      className="flex items-center space-x-4"
                    >
                      <div className="h-9 w-9 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted rounded"></div>
                      </div>
                      <div className="h-4 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
