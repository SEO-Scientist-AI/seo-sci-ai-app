import { Button } from "@/components/ui/button"
import { getThemeToggler } from "@/lib/theme/get-theme-button"
import Link from "next/link"
import { Home, Globe, FileText, BarChart3, RefreshCcw, Settings, ExternalLink, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { getGSCProperties } from "@/app/actions/getGSCProperties"
import { auth } from "@/server/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export const runtime = "edge"

export default async function DashboardPage() {
  const SetThemeButton = getThemeToggler()
  const session = await auth()

  // Fetch GSC properties
  const properties = await getGSCProperties()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="font-medium">Dashboard</div>
          <SetThemeButton />
        </div>
      </nav>

      <div className="flex">
        <DashboardSidebar currentPath="/dashboard" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-3">Your Properties</h1>
              <p className="text-muted-foreground text-lg">Select a property to view its analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <Link
                  key={index}
                  href={`/dashboard/pages?site=${encodeURIComponent(property.siteUrl)}`}
                  className="block group"
                >
                  <div className="border rounded-xl p-6 hover:border-primary hover:shadow-sm transition-all duration-200 bg-card">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {property.siteUrl.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/^sc-/, "")}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          <p className="text-sm text-muted-foreground">{property.permissionLevel}</p>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <p className="text-sm font-medium text-muted-foreground">Clicks/day</p>
                        </div>
                        <p className="text-2xl font-bold">{property.clicks}</p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <p className="text-sm font-medium text-muted-foreground">Impressions</p>
                        </div>
                        <p className="text-2xl font-bold">{property.impressions}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

