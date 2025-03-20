"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Home,
  Globe,
  RefreshCcw,
  Settings,
  type LucideIcon,
  BookOpen,
  Pen,
  Calendar,
  Search,
  Link2,
  Wrench,
  ExternalLink,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

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
  const [isExpanded, setIsExpanded] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

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
      icon: Home,
      label: currentWebsite || "Dashboard",
      href: "/dashboard",
    },
    {
      icon: BookOpen,
      label: "Library",
      href: "/dashboard/library",
    },
    {
      icon: Pen,
      label: "AI Writer",
      href: "/dashboard/ai-writer",
    },
    {
      icon: Calendar,
      label: "Content Planner",
      href: "/dashboard/content-planner",
    },
    {
      icon: Globe,
      label: "Page Audit",
      href: "/dashboard/page-audit",
    },
    {
      icon: Search,
      label: "Keyword Research",
      href: "/dashboard/keyword-research",
    },
    {
      icon: Link2,
      label: "Interlinking",
      href: "/dashboard/interlinking",
    },
    {
      icon: Wrench,
      label: "Technical Audit",
      href: "/dashboard/technical-audit",
    },
    {
      icon: ExternalLink,
      label: "Backlinks",
      href: "/dashboard/backlinks",
    },
    {
      icon: Upload,
      label: "Instant Indexing",
      href: "/dashboard/instant-indexing",
    },
    {
      icon: RefreshCcw,
      label: "History",
      href: "/dashboard/history",
    },
  ]

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "relative flex flex-col border-r min-h-[calc(100vh-4rem)] bg-background z-10",
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

      <div className="flex flex-col gap-2 py-6 px-2 overflow-hidden">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full rounded-lg h-12 overflow-hidden",
              "transition-all",
              // Faster collapse, slower expand
              isExpanded ? "duration-300 ease-out" : "duration-200 ease-in-out",
              "justify-start pl-4 gap-3", // Always justify-start to keep icons on left
              currentPath === item.href ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-muted",
            )}
            asChild
          >
            <Link href={item.href} className="flex items-center">
              <item.icon
                className={cn(
                  "h-5 w-5 min-w-5",
                  "transition-transform duration-200",
                  currentPath === item.href && "text-primary",
                )}
              />
              <span
                className={cn(
                  "font-medium whitespace-nowrap",
                  "transition-all",
                  isExpanded
                    ? "opacity-100 translate-x-0 ml-2 duration-300 ease-out"
                    : "opacity-0 translate-x-10 w-0 duration-150 ease-in",
                )}
              >
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
              "w-full rounded-lg h-12 overflow-hidden",
              "transition-all",
              // Faster collapse, slower expand
              isExpanded ? "duration-300 ease-out" : "duration-200 ease-in-out",
              "justify-start pl-4 gap-3", // Always justify-start to keep icons on left
            )}
            asChild
          >
            <Link href="/dashboard/settings" className="flex items-center">
              <Settings className={cn("h-5 w-5 min-w-5", "transition-transform duration-200")} />
              <span
                className={cn(
                  "font-medium whitespace-nowrap",
                  "transition-all",
                  isExpanded
                    ? "opacity-100 translate-x-0 ml-2 duration-300 ease-out"
                    : "opacity-0 translate-x-10 w-0 duration-150 ease-in",
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

