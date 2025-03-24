import { getThemeToggler } from "@/lib/theme/get-theme-button";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentWebsite?: string;
  title?: string;
}

export async function DashboardLayout({
  children,
  currentWebsite,
  title,
}: DashboardLayoutProps) {
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
            <SetThemeButton />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="flex">
        <DashboardSidebar currentWebsite={currentWebsite} />

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
