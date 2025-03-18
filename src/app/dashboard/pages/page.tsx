import { Button } from "@/components/ui/button"
import { getThemeToggler } from "@/lib/theme/get-theme-button"
import { getSearchAnalytics } from "@/app/actions/getSearchAnalytics"
import { getCurrentWebsite } from "@/app/actions/setWebsite"
import { AnalyticsFilters } from "@/components/analytics/filters"
import { PagesTable } from "@/components/analytics/pages-table"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export const runtime = "edge"

export default async function PagesPage() {
  const SetThemeButton = getThemeToggler()
  const currentWebsite = await getCurrentWebsite()

  // Get initial data
  const initialPages = await getSearchAnalytics({
    limit: 100,
    sortBy: "position",
    sortOrder: "asc",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="font-medium">{currentWebsite}</div>
          <SetThemeButton />
        </div>
      </nav>

      <div className="flex">
        <DashboardSidebar currentWebsite={currentWebsite} currentPath="/dashboard/pages" />

        {/* Main Content */}
        <main className="flex-1 px-8 py-6">
          <div className="space-y-6">
            <AnalyticsFilters />
            <PagesTable initialPages={initialPages} />
          </div>
        </main>
      </div>
    </div>
  )
}

