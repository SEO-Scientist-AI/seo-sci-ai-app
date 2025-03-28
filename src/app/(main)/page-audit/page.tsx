import { Button } from "@/components/ui/button";
import { getThemeToggler } from "@/lib/theme/get-theme-button";
import { getSearchAnalytics } from "@/app/actions/getSearchAnalytics";
import { getCurrentWebsite } from "@/app/actions/setWebsite";
import { AnalyticsFilters } from "@/components/dashboard/analytics/filters";
import { PagesTable } from "@/components/dashboard/analytics/page-audit-table";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Info, Loader2 } from "lucide-react";
import { Suspense } from "react";

export const runtime = "edge";

export default async function PageAuditPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const urlParams = new URLSearchParams();
  
  // Convert searchParams to URLSearchParams
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        urlParams.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => urlParams.append(key, v));
      }
    });
  }
  
  // Get the current website - this checks only URL parameters now
  const currentWebsite = await getCurrentWebsite(urlParams);
  
  // No more cookie checks
  const isRecentWebsiteUsed = false;
  
  // Get the analytics data
  const initialPages = await getSearchAnalytics({
    limit: 25,
    sortBy: "position",
    sortOrder: "asc",
  }, urlParams);

  return (
    <div className="px-8 py-6">
      <div className="space-y-6">
        {!currentWebsite ? (
          <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">No website selected</p>
                <p className="text-sm mt-1">
                  To view your page audit data, please select a website using the URL parameter <code className="bg-amber-100/50 dark:bg-amber-900/50 px-1 py-0.5 rounded">?website=yoursite</code>
                </p>
              </div>
            </div>
          </Card>
        ) : isRecentWebsiteUsed ? (
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Using website: {currentWebsite}</p>
                <p className="text-sm mt-1">
                  Showing data for {currentWebsite}. You can change websites using the selector in the top bar.
                </p>
              </div>
            </div>
          </Card>
        ) : null}
        
        <AnalyticsFilters />
        
        <Suspense fallback={
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Loading page data for {currentWebsite}...</p>
            </div>
          </div>
        }>
          <PagesTable initialPages={initialPages} />
        </Suspense>
      </div>
    </div>
  );
}
