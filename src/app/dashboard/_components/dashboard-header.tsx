"use client"

import Link from "next/link"
import { getThemeToggler } from "@/lib/theme/get-theme-button"
import { LogoutButton } from "@/components/auth/logout-button"

interface HeaderProps {
  title?: string
  currentWebsite?: string
}

export function Header({ title, currentWebsite }: HeaderProps) {
  const SetThemeButton = getThemeToggler()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-medium hover:text-primary transition-colors">
            {title || currentWebsite || "Dashboard"}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SetThemeButton />
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}

