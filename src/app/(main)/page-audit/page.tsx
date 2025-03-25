import { Button } from "@/components/ui/button";
import { getThemeToggler } from "@/lib/theme/get-theme-button";
import { getSearchAnalytics } from "@/app/actions/getSearchAnalytics";
import { getCurrentWebsite } from "@/app/actions/setWebsite";
import { AnalyticsFilters } from "@/components/dashboard/analytics/filters";
import { PagesTable } from "@/components/dashboard/analytics/pages-table";

export const runtime = "edge";

export default async function PagesPage() {
  const currentWebsite = await getCurrentWebsite();
  const initialPages = await getSearchAnalytics({
    limit: 25,
    sortBy: "position",
    sortOrder: "asc",
  });

  return (
    <div className="px-8 py-6">
      <div className="space-y-6">
        <AnalyticsFilters />
        <PagesTable initialPages={initialPages} />
      </div>
    </div>
  );
}
