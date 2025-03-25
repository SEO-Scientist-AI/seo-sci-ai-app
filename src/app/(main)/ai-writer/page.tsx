"use client"

import { useState } from "react"
import Editor from "@/components/editor"
import { RightSidebar } from "@/components/analytics-temp/ai-writer-right-sidebar"
import { cn } from "@/lib/utils"

export const runtime = 'edge';

export default function AIWriter() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }
  
  return (
    <div className="relative flex w-full h-screen">
      {/* Main editor area - takes remaining space and centers content */}
      <div className={cn(
        "flex-1 flex justify-center transition-all duration-200 ease-in-out",
        sidebarOpen ? "mr-96" : "mr-0"
      )}>
        <div className="w-full max-w-4xl">
          <Editor />
        </div>
      </div>

      {/* Right sidebar - fixed width */}
      <RightSidebar 
        page={null}
        onClose={handleCloseSidebar}
        open={sidebarOpen}
      />
    </div>
  )
}