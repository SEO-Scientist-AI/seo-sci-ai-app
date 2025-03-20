import { Button } from "@/components/ui/button"
import { getThemeToggler } from "@/lib/theme/get-theme-button"
import { getSearchAnalytics } from "@/app/actions/getSearchAnalytics"
import { getCurrentWebsite } from "@/app/actions/setWebsite"
import { AnalyticsFilters } from "@/app/dashboard/_components/analytics/filters"
import { PagesTable } from "@/app/dashboard/_components/analytics/pages-table"
import { DashboardSidebar } from "@/app/dashboard/_components/dashboard-sidebar"
import { LogoutButton } from "@/components/auth/logout-button"
import { DashboardLayout } from "@/app/dashboard/_components/dashboard-layout"

export const runtime = "edge"

export default async function PagesPage() {
  const currentWebsite = await getCurrentWebsite()
  const initialPages = await getSearchAnalytics({
    limit: 100,
    sortBy: "position",
    sortOrder: "asc",
  })

  return (
    <DashboardLayout 
      currentPath="/dashboard/page-audit"
      currentWebsite={currentWebsite}
    >
      <div className="px-8 py-6">
        <div className="space-y-6">
          <AnalyticsFilters />
          <PagesTable initialPages={initialPages} />
        </div>
      </div>
    </DashboardLayout>
  )
}

