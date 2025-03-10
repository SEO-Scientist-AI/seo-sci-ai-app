"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Home,
  Globe,
  FileText,
  BarChart3,
  RefreshCcw,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentWebsite: string;
}

export function Sidebar({ currentWebsite }: SidebarProps) {
  const sidebarItems = [
    { icon: Home, label: currentWebsite, href: "/dashboard" },
    { icon: Globe, label: "Pages", href: "/dashboard/pages", isActive: true },
    { icon: FileText, label: "Content Editor", href: "/dashboard/editor" },
    { icon: BarChart3, label: "Audit", href: "/dashboard/audit" },
    { icon: RefreshCcw, label: "History", href: "/dashboard/history" },
  ];

  return (
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
        <div className="mt-auto">
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
      </div>
    </aside>
  );
}
