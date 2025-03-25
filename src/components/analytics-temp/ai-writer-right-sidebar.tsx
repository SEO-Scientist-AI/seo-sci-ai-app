"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, RefreshCw, Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { CircularProgress } from "@/components/dashboard/circular-score"

interface SearchAnalyticsPage {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  contentScore: number
  keywords: string[]
  wordCount?: number
  headingCount?: number
  paragraphCount?: number
  imageCount?: number
}

interface IndexingStatus {
  status: "INDEXED" | "NOT_INDEXED"
  lastCrawled?: string
}

interface PageState {
  indexStatus?: IndexingStatus
  isIndexing: boolean
  lastChecked?: number
}

// Mock sidebar context
const useSidebar = () => {
  const [pageStates, setPageStates] = useState<Record<string, PageState>>({})

  const getPageState = (url: string): PageState => {
    return pageStates[url] || { isIndexing: false }
  }

  const updatePageStatus = (url: string, status: IndexingStatus) => {
    setPageStates((prev) => ({
      ...prev,
      [url]: {
        ...prev[url],
        indexStatus: status,
        lastChecked: Date.now(),
        isIndexing: false,
      },
    }))
  }

  const setPageIndexing = (url: string, isIndexing: boolean) => {
    setPageStates((prev) => ({
      ...prev,
      [url]: {
        ...prev[url],
        isIndexing,
      },
    }))
  }

  return { getPageState, updatePageStatus, setPageIndexing }
}

// Mock API functions
const checkIndexingStatus = async (url: string): Promise<IndexingStatus> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return random status for demo
  return {
    status: Math.random() > 0.5 ? "INDEXED" : "NOT_INDEXED",
    lastCrawled: new Date().toISOString(),
  }
}

const requestIndexing = async (url: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return success for demo
  return {
    success: true,
    message: "Page submitted for indexing",
  }
}

interface PageDetailsSidebarProps {
  page: SearchAnalyticsPage | null
  onClose: () => void
  open: boolean
}

// Add dummy data for the example
const dummyPage: SearchAnalyticsPage = {
  page: "https://example.com/blog/how-to-optimize-content",
  clicks: 245,
  impressions: 3890,
  ctr: 0.063,
  position: 4.2,
  contentScore: 82,
  keywords: ["content marketing", "SEO", "optimization", "content strategy", "marketing metrics"],
  wordCount: 2267,
  headingCount: 34,
  paragraphCount: 65,
  imageCount: 5,
}

export function RightSidebar({ page: propPage, onClose, open }: PageDetailsSidebarProps) {
  // Use dummy data if no page is provided
  const page = propPage || dummyPage

  const { getPageState, updatePageStatus, setPageIndexing } = useSidebar()
  const pageState = page ? getPageState(page.page) : undefined

  const checkIndexStatus = async () => {
    if (!page?.page) return

    setPageIndexing(page.page, true)
    try {
      const status = await checkIndexingStatus(page.page)
      updatePageStatus(page.page, status)
    } catch (error) {
      toast.error("Failed to check indexing status")
    } finally {
      setPageIndexing(page.page, false)
    }
  }

  const handleRequestIndex = async () => {
    if (!page?.page) return

    setPageIndexing(page.page, true)
    try {
      const result = await requestIndexing(page.page)
      if (result.success) {
        toast.success(result.message, { duration: 5000 })
        // Recheck status after requesting indexing
        await checkIndexStatus()
      } else {
        toast.error("Request failed", {
          description: "Unable to request indexing at this time",
          duration: 10000,
        })
      }
    } catch (error) {
      toast.error("Failed to request indexing")
    } finally {
      setPageIndexing(page.page, false)
    }
  }

  useEffect(() => {
    if (!page?.page) return

    const state = getPageState(page.page)
    if (!state?.indexStatus || Date.now() - (state.lastChecked || 0) > 5 * 60 * 1000) {
      checkIndexStatus()
    }
  }, [page?.page])

  return (
    <div
      className={cn(
        "fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] bg-background border-l shadow-lg transform transition-transform duration-200 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {page && (
        <>
          <div className="border-b border-border">
            <div className="flex">
              <button className="px-6 py-3 text-primary border-b-2 border-primary font-medium">GUIDELINES</button>
              <button className="px-6 py-3 text-muted-foreground hover:text-foreground">OUTLINE</button>
              <button className="px-6 py-3 text-muted-foreground hover:text-foreground">BRIEF</button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-4rem-3rem)]">
            <div className="p-4 space-y-6">
              {/* Content Score Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Content Score</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          <span>Refresh</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh content score</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex justify-center py-4">
                  <CircularProgress 
                    value={page.contentScore} 
                    size="large"
                    title="Content Score" 
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                  <span className="mr-2">✨</span>
                  Auto-Optimize
                </Button>

                <Button variant="outline" className="w-full mt-2 border-border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Insert internal links
                </Button>
              </div>

              {/* Content Structure Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Content Structure</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10 9l-6 6 6 6" />
                            <path d="M14 9l6 6-6 6" />
                          </svg>
                          <span className="ml-1">Adjust</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adjust content structure</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-4 divide-x divide-border">
                  <div className="px-2 py-3 text-center">
                    <div className="text-xs text-muted-foreground">WORDS</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-xl font-semibold">{page.wordCount || 2267}</span>
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
                        className="text-red-500"
                      >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">3,043-3,499</div>
                  </div>

                  <div className="px-2 py-3 text-center">
                    <div className="text-xs text-muted-foreground">HEADINGS</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-xl font-semibold">{page.headingCount || 34}</span>
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
                        className="text-green-500"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">27-40</div>
                  </div>

                  <div className="px-2 py-3 text-center">
                    <div className="text-xs text-muted-foreground">PARAGRAPHS</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-xl font-semibold">{page.paragraphCount || 65}</span>
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
                        className="text-red-500"
                      >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">at least 85</div>
                  </div>

                  <div className="px-2 py-3 text-center">
                    <div className="text-xs text-muted-foreground">IMAGES</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-xl font-semibold">{page.imageCount || 5}</span>
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
                        className="text-red-500"
                      >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">12-20</div>
                  </div>
                </div>
              </div>

              {/* Terms Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Terms</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10 9l-6 6 6 6" />
                            <path d="M14 9l6 6-6 6" />
                          </svg>
                          <span className="ml-1">Adjust</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adjust terms</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input type="search" className="pl-10" placeholder="Search" />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">#Content</span>
                    <span className="text-sm text-muted-foreground">- 14</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">#Market</span>
                    <span className="text-sm text-muted-foreground">- 12</span>
                  </div>
                </div>

                <div className="flex border-b mt-4">
                  <button className="px-4 py-2 text-primary border-b-2 border-primary">
                    All <span className="ml-1 px-1.5 py-0.5 bg-primary text-white rounded-md text-xs">80</span>
                  </button>
                  <button className="px-4 py-2 text-muted-foreground">
                    Headings{" "}
                    <span className="ml-1 px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-xs">5</span>
                  </button>
                  <button className="px-4 py-2 text-muted-foreground">
                    NLP <span className="ml-1 px-1.5 py-0.5 bg-gray-600 text-white rounded-md text-xs">65</span>
                  </button>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between p-2 rounded-md bg-amber-50 dark:bg-warning/20">
                    <span className="text-amber-800 dark:text-amber-300">content marketing metrics</span>
                    <span className="text-amber-800 dark:text-amber-300">7/8-15</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-red-50 dark:bg-destructive/20">
                    <span className="text-red-800 dark:text-red-300">content marketing strategy</span>
                    <span className="text-red-800 dark:text-red-300 flex items-center">
                      5/2-4
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
                        className="ml-1"
                      >
                        <path d="M12 5v14" />
                        <path d="M19 12l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-red-50 dark:bg-destructive/20">
                    <span className="text-red-800 dark:text-red-300">content marketing efforts</span>
                    <span className="text-red-800 dark:text-red-300 flex items-center">
                      7/3-4
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
                        className="ml-1"
                      >
                        <path d="M12 5v14" />
                        <path d="M19 12l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-green-50 dark:bg-success/20">
                    <span className="text-green-800 dark:text-green-300">content marketing success</span>
                    <span className="text-green-800 dark:text-green-300">2/2-4</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}