import { Button } from "@/components/ui/button";
import { getThemeToggler } from "@/lib/theme/get-theme-button";
import Link from "next/link";
import {
  Home,
  Globe,
  FileText,
  BarChart3,
  RefreshCcw,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getGSCProperties } from "@/app/actions/getGSCProperties";
import { auth } from "@/server/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export const runtime = "edge";

export default async function DashboardPage() {
  const SetThemeButton = getThemeToggler();
  const session = await auth();

  // Fetch GSC properties
  const properties = await getGSCProperties();

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", isActive: true },
    { icon: Globe, label: "Pages", href: "/dashboard/pages" },
    { icon: FileText, label: "Content Editor", href: "/dashboard/editor" },
    { icon: BarChart3, label: "Audit", href: "/dashboard/audit" },
    { icon: RefreshCcw, label: "History", href: "/dashboard/history" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="text-sm text-muted-foreground">Dashboard</div>
          <div className="flex items-center gap-2">
            <SetThemeButton />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="group relative flex flex-col w-[60px] hover:w-64 transition-all duration-300 ease-in-out border-r min-h-[calc(100vh-4rem)]">
          {/* Sidebar Content */}
          <div className="flex flex-col gap-1 py-4 overflow-hidden">
            {sidebarItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-300 rounded-none h-14",
                  "group-hover:justify-start group-hover:gap-2",
                  "justify-center",
                  item.isActive && "bg-accent"
                )}
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="h-5 w-5 min-w-5" />
                  <span className="opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                </Link>
              </Button>
            ))}

            {/* Settings at the bottom */}
            <Button
              variant="ghost"
              className={cn(
                "w-full transition-all duration-300 rounded-none h-14",
                "group-hover:justify-start group-hover:gap-2",
                "justify-center"
              )}
              asChild
            >
              <Link href="/dashboard/settings" className="flex items-center">
                <Settings className="h-5 w-5 min-w-5" />
                <span className="opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden">
                  Settings
                </span>
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Your Properties</h1>
              <p className="text-muted-foreground">
                Select a property to view its analytics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property, index) => (
                <Link
                  key={index}
                  href={`/dashboard/pages?site=${encodeURIComponent(
                    property.siteUrl
                  )}`}
                  className="block group"
                >
                  <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {property.siteUrl
                            .replace(/^(https?:\/\/)?(www\.)?/, "")
                            .replace(/^sc-/, "")}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {property.permissionLevel}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-2xl font-semibold">
                          {property.clicks}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Clicks/day
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">
                          {property.impressions}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Impressions/day
                        </p>
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
  );
}
