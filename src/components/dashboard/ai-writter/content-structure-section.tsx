"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ContentStructureMetrics } from "@/components/editor"

interface ContentStructureSectionProps { 
  metrics: ContentStructureMetrics
  onRefresh: () => void 
}

export function ContentStructureSection({ metrics, onRefresh }: ContentStructureSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-muted-foreground">Content Structure</h4>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                <span>Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh content structure metrics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>

      <div className="grid grid-cols-4 divide-x divide-border">
        <div className="px-2 py-3 text-center">
          <div className="text-xs text-muted-foreground">WORDS</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xl font-semibold">{metrics.wordCount}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={metrics.wordCount >= 3043 ? "text-green-500" : "text-red-500"}
            >
              {metrics.wordCount >= 3043 ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </>
              )}
            </svg>
          </div>
          <div className="text-xs text-muted-foreground mt-1">3,043-3,499</div>
        </div>

        <div className="px-2 py-3 text-center">
          <div className="text-xs text-muted-foreground">HEADINGS</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xl font-semibold">{metrics.headingCount}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={metrics.headingCount >= 27 && metrics.headingCount <= 40 ? "text-green-500" : "text-red-500"}
            >
              {metrics.headingCount >= 27 && metrics.headingCount <= 40 ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </>
              )}
            </svg>
          </div>
          <div className="text-xs text-muted-foreground mt-1">27-40</div>
        </div>

        <div className="px-2 py-3 text-center">
          <div className="text-xs text-muted-foreground">PARAGRAPHS</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xl font-semibold">{metrics.paragraphCount}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={metrics.paragraphCount >= 85 ? "text-green-500" : "text-red-500"}
            >
              {metrics.paragraphCount >= 85 ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </>
              )}
            </svg>
          </div>
          <div className="text-xs text-muted-foreground mt-1">at least 85</div>
        </div>

        <div className="px-2 py-3 text-center">
          <div className="text-xs text-muted-foreground">IMAGES</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xl font-semibold">{metrics.imageCount}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={metrics.imageCount >= 12 ? "text-green-500" : "text-red-500"}
            >
              {metrics.imageCount >= 12 ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </>
              )}
            </svg>
          </div>
          <div className="text-xs text-muted-foreground mt-1">12-20</div>
        </div>
      </div>
    </div>
  )
} 