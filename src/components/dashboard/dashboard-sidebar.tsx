"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Globe,
  RefreshCcw,
  Settings,
  type LucideIcon,
  BookOpen,
  Pen,
  Search,
  Wrench,
  BarChart,
  BarChart2,
  Play,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface SidebarProps {
  currentWebsite?: string
}

interface SidebarItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: string
  section?: string
}

export function DashboardSidebar({ currentWebsite }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Handle clicks outside the sidebar to collapse it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  const sidebarItems: SidebarItem[] = [
    {
      icon: Play,
      label: "Get Started 1/5",
      href: "/get-started",
    },
    {
      icon: Home,
      label: "Home",
      href: "/dashboard",
    },
    {
      icon: RefreshCcw,
      label: "History",
      href: "/history",
    },
    {
      icon: Pen,
      label: "SEO Agent",
      href: "/seo-agent",
      badge: "AI",
    },
    {
      icon: BookOpen,
      label: "AI Article Writer",
      href: "/ai-writer",
    },
    // SEO & CONTENT WORKFLOW section
    {
      icon: BarChart2,
      label: "Site Audit",
      href: "/seo-audit",
      section: "SEO & CONTENT WORKFLOW",
    },
    {
      icon: Search,
      label: "Keyword Research",
      href: "/keyword-overview",
    },
    {
      icon: Globe,
      label: "Optimize Content",
      href: "/optimize-content",
    },
    {
      icon: BarChart,
      label: "Reporting",
      href: "/reporting",
    },
    {
      icon: Wrench,
      label: "Other Tools",
      href: "/other-tools",
    },
  ]

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "sticky top-16 flex flex-col border-r h-[calc(100vh-4rem)] bg-background z-10",
        "transition-all duration-300",
        // Different easing for expand vs collapse
        isExpanded ? "ease-out w-64" : "ease-in-out w-[70px]",
        "hover:shadow-md",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Subtle indicator for expandable sidebar */}
      <div
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 h-16 w-1 bg-primary/10 rounded-l",
          "transition-opacity duration-300",
          isExpanded ? "opacity-0" : "opacity-100",
        )}
      />

      <div className="flex flex-col gap-2 py-6 px-2 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <div key={index}>
            {item.section && (
              <div
                className={cn(
                  "px-4 py-2 text-xs font-semibold text-muted-foreground",
                  "transition-all duration-300 origin-left overflow-hidden",
                  isExpanded ? "max-h-8 mb-2 opacity-100" : "max-h-0 mb-0 opacity-0",
                )}
              >
                <span className="whitespace-nowrap">{item.section}</span>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full rounded-lg h-12 overflow-hidden",
                "transition-all",
                // Faster collapse, slower expand
                isExpanded ? "duration-300 ease-out" : "duration-200 ease-in-out",
                "justify-start pl-4 gap-3", // Always justify-start to keep icons on left
                pathname === item.href ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-muted",
              )}
              asChild
            >
              <Link href={item.href} className="flex items-center relative w-full">
                <item.icon
                  className={cn(
                    "h-5 w-5 min-w-5",
                    "transition-transform duration-200",
                    pathname === item.href && "text-primary",
                  )}
                />
                <span
                  className={cn(
                    "font-medium whitespace-nowrap absolute left-12",
                    "transition-all duration-300",
                    isExpanded
                      ? "opacity-100 translate-x-0 delay-[50ms]"
                      : "opacity-0 -translate-x-4 pointer-events-none",
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-purple-500 text-white">{item.badge}</span>
                  )}
                </span>
              </Link>
            </Button>
          </div>
        ))}

        {/* Settings at the bottom */}
        <div className="mt-auto mb-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full rounded-lg h-12 overflow-hidden",
              "transition-all",
              // Faster collapse, slower expand
              isExpanded ? "duration-300 ease-out" : "duration-200 ease-in-out",
              "justify-start pl-4 gap-3", // Always justify-start to keep icons on left
            )}
            asChild
          >
            <Link href="/settings" className="flex items-center">
              <Settings className={cn("h-5 w-5 min-w-5", "transition-transform duration-200")} />
              <span
                className={cn(
                  "font-medium whitespace-nowrap absolute left-12",
                  "transition-all duration-300",
                  isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none",
                )}
              >
                Settings
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
