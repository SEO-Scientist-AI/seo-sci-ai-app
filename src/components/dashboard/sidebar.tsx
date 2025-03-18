import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Globe, FileText, BarChart3, RefreshCcw, Settings, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentWebsite?: string
  currentPath: string
}

interface SidebarItem {
  icon: LucideIcon
  label: string
  href: string
}

export function DashboardSidebar({ currentWebsite, currentPath }: SidebarProps) {
  const sidebarItems: SidebarItem[] = [
    { 
      icon: Home, 
      label: currentWebsite || "Dashboard", 
      href: "/dashboard" 
    },
    { 
      icon: Globe, 
      label: "Pages", 
      href: "/dashboard/pages" 
    },
    { 
      icon: FileText, 
      label: "Content Editor", 
      href: "/dashboard/editor" 
    },
    { 
      icon: BarChart3, 
      label: "Audit", 
      href: "/dashboard/audit" 
    },
    { 
      icon: RefreshCcw, 
      label: "History", 
      href: "/dashboard/history" 
    },
  ]

  return (
    <aside className="group relative flex flex-col w-[70px] hover:w-64 transition-all duration-300 ease-in-out border-r min-h-[calc(100vh-4rem)] bg-background z-10">
      <div className="flex flex-col gap-2 py-6 px-2 overflow-hidden">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full transition-all duration-300 rounded-lg h-12",
              "group-hover:justify-start group-hover:gap-3 group-hover:pl-4",
              "justify-center",
              currentPath === item.href ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-muted",
            )}
            asChild
          >
            <Link href={item.href} className="flex items-center">
              <item.icon className={cn("h-5 w-5 min-w-5", currentPath === item.href && "text-primary")} />
              <span className="opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden font-medium">
                {item.label}
              </span>
            </Link>
          </Button>
        ))}

        {/* Settings at the bottom */}
        <div className="mt-auto mb-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-300 rounded-lg h-12",
              "group-hover:justify-start group-hover:gap-3 group-hover:pl-4",
              "justify-center",
            )}
            asChild
          >
            <Link href="/dashboard/settings" className="flex items-center">
              <Settings className="h-5 w-5 min-w-5" />
              <span className="opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden font-medium">
                Settings
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
} 