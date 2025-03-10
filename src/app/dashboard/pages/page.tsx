import { getThemeToggler } from "@/lib/theme/get-theme-button";
import { getSearchAnalytics } from "@/app/actions/getSearchAnalytics";
import { getCurrentWebsite } from "@/app/actions/setWebsite";
import { AnalyticsFilters } from "@/components/analytics/filters";
import { PagesTable } from "@/components/analytics/pages-table";
import { Sidebar } from "@/components/layout/sidebar";
import { LogoutButton } from "@/components/auth/logout-button";

export const runtime = "edge";

export default async function PagesPage() {
  const SetThemeButton = getThemeToggler();
  const currentWebsite = await getCurrentWebsite();

  // Get initial data
  const initialPages = await getSearchAnalytics({
    limit: 100,
    sortBy: "position",
    sortOrder: "asc",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="text-sm text-muted-foreground">{currentWebsite}</div>
          <div className="flex items-center gap-2">
            <SetThemeButton />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="flex">
        <Sidebar currentWebsite={currentWebsite} />

        {/* Main Content */}
        <main className="flex-1 px-8 py-3">
          <div className="p-4 space-y-4">
            <AnalyticsFilters />
            <PagesTable initialPages={initialPages} />
          </div>
        </main>
      </div>
    </div>
  );
}
