"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAnalyticsFilters } from "@/store/analytics-filters"
import type { SearchAnalyticsPage } from "@/types/searchConsole"
import { SortableHeader } from "./sortable-header"
import { filterAnalytics } from "@/app/actions/filterAnalytics"
import { PageDetailsSidebar } from "./page-details-sidebar"
import { ExternalLink, PanelRightOpen, RefreshCw, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { requestIndexing } from "@/app/actions/requestIndexing"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PagesTableProps {
  initialPages: SearchAnalyticsPage[]
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
                  <TableHead className="w-[120px]">Content Score</TableHead>
                  <TableHead className="w-[100px] text-right">
                    <SortableHeader field="position">Position</SortableHeader>
                  </TableHead>
                  <TableHead className="w-[100px] text-right">
                    <SortableHeader field="traffic">Traffic</SortableHeader>
                  </TableHead>
                  <TableHead className="w-[100px] text-right">
                    <SortableHeader field="impressions">Impr.</SortableHeader>
                  </TableHead>
                  <TableHead className="w-[80px] text-right">
                    <SortableHeader field="ctr">CTR</SortableHeader>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <TableRow key={i} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              <Skeleton className="h-4 w-[90%]" />
                              <Skeleton className="h-3 w-[60%]" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-10 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-12 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-10 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                  : pages.map((page, i) => (
                      <TableRow
                        key={i}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedPage?.page === page.page && "bg-muted/50",
                        )}
                        onClick={() => setSelectedPage(page)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 group/row">
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
                                        {page.page.replace(/^https?:\/\//, "")}
                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Open page in new tab</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity"
                                onClick={() => setSelectedPage(page)}
                              >
                                <PanelRightOpen className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground truncate">{page.mainKeyword}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-5 w-5 rounded-full",
                                  indexingPages.has(page.page) ? "opacity-100" : "opacity-0 group-hover/row:opacity-70",
                                )}
                                onClick={(e) => handleRequestIndex(page.page, e, page)}
                                disabled={indexingPages.has(page.page)}
                              >
                                <RefreshCw className={cn("h-3 w-3", indexingPages.has(page.page) && "animate-spin")} />
                                <span className="sr-only">Request indexing</span>
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-300 to-amber-500 w-[30%]"></div>
                            </div>
                            <span className="text-xs text-muted-foreground">Analyzing...</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={cn("font-medium", getPositionColor(page.position))}>
                            {page.position}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn("font-medium", getTrafficTrend(page.traffic))}>{page.traffic}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium">{page.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{page.ctr}%</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PageDetailsSidebar page={selectedPage} onClose={() => setSelectedPage(null)} />
    </div>
  )
}

const limitOptions = [10, 25, 50, 100, 250, 500]

export function AnalyticsFilters() {
  const { filters, setLimit } = useAnalyticsFilters()

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Top pages <span className="ml-1 text-muted-foreground">{filters.limit}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {limitOptions.map((limit) => (
              <DropdownMenuItem
                key={limit}
                onClick={() => setLimit(limit)}
              >
                Show top {limit}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" /> Filters
      </Button>
    </div>
  )
}

