import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Site Health and Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Skeleton className="h-5 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Skeleton className="h-40 w-40 rounded-full" />
              <div className="w-full mt-8">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-20 mb-4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-3 w-6" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thematic Reports */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crawled Pages and Issues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
            <Skeleton className="h-6 w-full mb-6" />
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extra sections */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 