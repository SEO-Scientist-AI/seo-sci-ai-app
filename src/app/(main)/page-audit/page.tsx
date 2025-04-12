import { getSearchAnalytics } from "@/app/actions/getSearchAnalytics";
import { getCurrentWebsite } from "@/app/actions/setWebsite";
import { getAvailableWebsites } from "@/app/actions/getWebsites";
import { AnalyticsFilters } from "@/components/dashboard/page-audit/filters";
import { PagesTable } from "@/components/dashboard/page-audit/page-audit-table";
import { WebsiteSelector } from "@/components/dashboard/website-selector";
import { Card } from "@/components/ui/card";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  // Get the current website from URL only (localStorage handled client-side)
  const currentWebsite = await getCurrentWebsite(urlParams);
  
  // Get list of available websites
  const availableWebsites = await getAvailableWebsites();
  
  // Get the analytics data
  const initialPages = await getSearchAnalytics({
    limit: 25,
    sortBy: "position",
    sortOrder: "asc",
  }, urlParams);

  return (
    <div className="px-8 py-6">
      <div className="space-y-6">
        {!currentWebsite && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select a website to view page audit data
            </AlertDescription>
          </Alert>
        )}
        
        <AnalyticsFilters />
        
        <Suspense fallback={
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">
                {currentWebsite 
                  ? `Loading page data for ${currentWebsite}...`
                  : 'Loading...'}
              </p>
            </div>
          </div>
        }>
          {currentWebsite ? (
            <PagesTable initialPages={initialPages} />
          ) : (
            <Card className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="h-4 w-4" />
                <p>Select a website to view page audit data</p>
              </div>
            </Card>
          )}
        </Suspense>
      </div>
    </div>
  );
}
