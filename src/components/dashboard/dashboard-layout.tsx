import Link from "next/link";
import { DashboardSidebar } from "./dashboard-sidebar";
import { LogoutButton } from "../auth/logout-button";
import { getThemeToggler } from "@/lib/theme/get-theme-button";
import { getCurrentWebsite } from "@/app/actions/setWebsite";
import { getAvailableWebsites } from "@/app/actions/getWebsites";
import { auth } from "@/server/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { WebsiteSelector } from "../website-selector";
import { Suspense } from "react";
import { headers } from "next/headers";

export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Call getCurrentWebsite with no parameters - it handles the null case
  const currentWebsite = await getCurrentWebsite();
  
  // Get list of available websites from Google Search Console
  const availableWebsites = await getAvailableWebsites();
  
  // Make sure current website is included in the list if it exists
  if (currentWebsite && !availableWebsites.includes(currentWebsite)) {
    availableWebsites.unshift(currentWebsite);
  }
  
  const SetThemeButton = getThemeToggler();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 justify-between">
          <Link
            href="/"
            className="font-medium hover:text-primary transition-colors"
          >
            SEO Scientist
          </Link>
          <div className="flex items-center gap-4">
            {!currentWebsite ? (
              <div className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>No website selected</span>
              </div>
            ) : (
              <WebsiteSelector websites={availableWebsites} className="text-xs" />
            )}
            <SetThemeButton />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="flex">
        <DashboardSidebar currentWebsite={currentWebsite || undefined} />

        {/* Main Content with Suspense for better loading experience */}
        <main className="flex-1">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
