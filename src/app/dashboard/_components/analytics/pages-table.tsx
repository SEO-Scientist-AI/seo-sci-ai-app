"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAnalyticsFilters } from "@/store/analytics-filters"
import type { SearchAnalyticsPage } from "@/types/searchConsole"
import { SortableHeader } from "./sortable-header"
import { filterAnalytics } from "@/app/actions/filterAnalytics"
import { PageDetailsSidebar } from "./page-details-sidebar"
import { 
  ExternalLink, 
  PanelRightOpen, 
  ArrowDown, 
  ArrowUp, 
  Minus, 
  LayoutDashboard, 
  Pencil, 
  Sidebar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { requestIndexing } from "@/app/actions/requestIndexing"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { TrendIndicator } from "@/app/dashboard/_components/trend-indicator"
import { DashboardIcon } from "@radix-ui/react-icons"

interface PagesTableProps {
  initialPages: SearchAnalyticsPage[]
}

function getCleanPath(url: string): string {
  try {
    const path = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im, '')
    return path.replace(/\/$/, '')
  } catch (e) {
    return url
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// First, add a reusable class for the divider
const cellDividerClass = "border-l border-border/50 first:border-l-0";

// First, update the getScoreGradient function to handle segments
function getScoreSegments(score: number) {
  const getColor = () => {
    if (score >= 80) return "bg-green-500/80"; // Lighter green
    if (score >= 33) return "bg-yellow-500/80"; // Lighter yellow
    return "bg-red-500/80"; // Lighter red
  };

  const color = getColor();
  
  return [
    { active: score >= 0, className: color }, // First segment
    { active: score >= 33, className: color }, // Second segment
    { active: score >= 80, className: color }, // Third segment
  ];
}

export function PagesTable({ initialPages }: PagesTableProps) {
  const { filters } = useAnalyticsFilters()
  const [pages, setPages] = useState(initialPages)
  const [loading, setLoading] = useState(false)
  const [selectedPage, setSelectedPage] = useState<SearchAnalyticsPage | null>(null)
  const [indexingPages, setIndexingPages] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchPages() {
      setLoading(true)
      try {
        const newPages = await filterAnalytics(filters)
        setPages(newPages)
      } catch (error) {
        console.error("Error fetching pages:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPages()
  }, [filters])

  const handleRequestIndex = async (url: string, e: React.MouseEvent, page: SearchAnalyticsPage) => {
    e.stopPropagation()

    setSelectedPage(page)

    setIndexingPages((prev) => new Set(prev).add(url))
    try {
      const result = await requestIndexing(url)
      if (result.success) {
        toast.success(result.message, {
          duration: 5000,
        })
      } else {
        toast.error(result.error, {
          description: result.helpText,
          duration: 10000,
        })
      }
    } catch (error) {
      toast.error("Failed to request indexing")
    } finally {
      setIndexingPages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(url)
        return newSet
      })
    }
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-green-600 bg-green-50"
    if (position <= 10) return "text-blue-600 bg-blue-50"
    if (position <= 20) return "text-amber-600 bg-amber-50"
    return "text-red-600 bg-red-50"
  }

  const getTrafficTrend = (traffic: number) => {
    // This would ideally use real trend data
    if (traffic > 100) return "text-green-600"
    if (traffic > 50) return "text-blue-600"
    if (traffic > 10) return "text-amber-600"
    return "text-muted-foreground"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-green-300 to-green-500"
    if (score >= 40) return "from-amber-300 to-amber-500"
    return "from-red-300 to-red-500"
  }

  return (
    <div className="relative">
      <Card className="shadow-sm border-border/40">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[400px]">
                    <SortableHeader field="page">Page</SortableHeader>
                  </TableHead>
                  <TableHead className={cn("w-[120px]", cellDividerClass)}>
                    <SortableHeader field="contentScore">Content Score</SortableHeader>
                  </TableHead>
                  <TableHead className={cn("w-[100px] text-right", cellDividerClass)}>
                    <SortableHeader field="position">Position</SortableHeader>
                  </TableHead>
                  <TableHead className={cn("w-[100px] text-right", cellDividerClass)}>
                    <SortableHeader field="traffic">Traffic</SortableHeader>
                  </TableHead>
                  <TableHead className={cn("w-[100px] text-right", cellDividerClass)}>
                    <SortableHeader field="impressions">Impr.</SortableHeader>
                  </TableHead>
                  <TableHead className={cn("w-[80px] text-right", cellDividerClass)}>
                    <SortableHeader field="ctr">CTR</SortableHeader>
                  </TableHead>
                </TableRow>
              </TableHeader>
              {loading ? (
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-3 w-[180px]" />
                          </div>
                          <div className="flex gap-1">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={cellDividerClass}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5 w-24">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton key={i} className="h-1.5 flex-1 rounded-sm" />
                            ))}
                          </div>
                          <Skeleton className="h-3 w-8" />
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-1">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-1">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-1">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  {pages.map((page, i) => (
                    <TableRow
                      key={i}
                      className={cn(
                        "group cursor-pointer transition-colors h-14",
                        selectedPage?.page === page.page && "bg-muted/50",
                      )}
                      onClick={() => setSelectedPage(page)}
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center h-full">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="flex-1 truncate">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={page.page}
                                        className="text-primary hover:underline truncate inline-flex items-center gap-1 font-medium"
                                        onClick={(e) => e.stopPropagation()}
                                        target="_blank"
                                      >
                                        {getCleanPath(page.page)}
                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Open page in new tab</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground truncate">{page.mainKeyword}</span>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/editor?url=${encodeURIComponent(page.page)}`, '_blank');
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit with AI</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPage(page);
                              }}
                            >
                              <Sidebar className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={cellDividerClass}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5 w-24">
                            {getScoreSegments(page.contentScore).map((segment, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "h-1.5 flex-1 rounded-sm",
                                  segment.active ? segment.className : "bg-gray-100 dark:bg-gray-800"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {page.contentScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-2">
                          <TrendIndicator trend={page.positionTrend} isPosition={true} />
                          <Badge variant="outline" className={cn("font-medium", getPositionColor(page.position))}>
                            {page.position}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-1">
                          <TrendIndicator trend={page.trafficTrend} />
                          <span className={cn("font-medium", getTrafficTrend(page.traffic))}>
                            {formatNumber(page.traffic)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-1">
                          <TrendIndicator trend={page.impressionsTrend} />
                          <span className="font-medium">
                            {formatNumber(page.impressions)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <div className="flex items-center justify-end gap-1">
                          <TrendIndicator trend={page.ctrTrend} />
                          <span className="font-medium">{page.ctr}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      <PageDetailsSidebar page={selectedPage} onClose={() => setSelectedPage(null)} />
    </div>
  )
}

