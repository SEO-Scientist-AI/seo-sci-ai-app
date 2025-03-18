"use client"

import type { SearchAnalyticsPage } from "@/types/searchConsole"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, RefreshCw, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { requestIndexing } from "@/app/actions/requestIndexing"
import { useEffect } from "react"
import { toast } from "sonner"
import { checkIndexingStatus } from "@/app/actions/checkIndexingStatus"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSidebar } from "@/store/sidebar-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PageDetailsSidebarProps {
  page: SearchAnalyticsPage | null
  onClose: () => void
}

export function PageDetailsSidebar({ page, onClose }: PageDetailsSidebarProps) {
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
        toast.error(result.error, {
          description: result.helpText,
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
        "fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-background border-l shadow-lg transform transition-transform duration-200 ease-in-out overflow-hidden",
        page ? "translate-x-0" : "translate-x-full",
      )}
    >
      {page && (
        <>
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h3 className="font-semibold text-lg">Page Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-5 space-y-6">
              {/* URL Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">URL</h4>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm break-all">{page.page}</p>
                </div>
              </div>

              <Separator />

              {/* Indexing Status Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">Indexing Status</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkIndexStatus}
                    disabled={pageState?.isIndexing}
                    className="h-8 rounded-full"
                  >
                    {pageState?.isIndexing ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-2" />
                        Check Again
                      </>
                    )}
                  </Button>
                </div>

                <Card className="border-none shadow-none bg-muted/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      {pageState?.isIndexing ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">Checking status...</span>
                        </div>
                      ) : pageState?.indexStatus ? (
                        <>
                          {pageState.indexStatus.status === "INDEXED" ? (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm font-medium">Indexed</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                              <div className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-500" />
                              <span className="text-sm font-medium">Not Indexed</span>
                            </div>
                          )}
                        </>
                      ) : null}

                      {pageState?.indexStatus?.status === "NOT_INDEXED" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleRequestIndex}
                          disabled={pageState.isIndexing}
                          className="h-8 rounded-full"
                        >
                          {pageState.isIndexing ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                              Requesting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 mr-2" />
                              Request Indexing
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {pageState?.indexStatus?.lastCrawled && (
                      <p className="text-xs text-muted-foreground">
                        Last crawled: {new Date(pageState.indexStatus.lastCrawled).toLocaleDateString()}
                      </p>
                    )}

                    {pageState?.indexStatus?.status === "NOT_INDEXED" && !pageState.isIndexing && (
                      <Alert
                        variant="default"
                        className="mt-2 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          This page isn't indexed by Google yet. Click "Request Indexing" to submit it.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Metrics Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-2xl font-semibold">{page.clicks}</p>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-2xl font-semibold">{page.impressions}</p>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-2xl font-semibold">{Number(page.position).toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Avg. Position</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-2xl font-semibold">{page.ctr}%</p>
                      <p className="text-xs text-muted-foreground">CTR</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Content Score Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Content Score</h4>
                <Card className="border-none shadow-none bg-muted/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500",
                            page.contentScore >= 70
                              ? "bg-green-500"
                              : page.contentScore >= 40
                                ? "bg-amber-500"
                                : "bg-red-500",
                          )}
                          style={{ width: `${page.contentScore}%` }}
                        />
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {page.contentScore}/100
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {page.contentScore >= 70
                        ? "Good content quality"
                        : page.contentScore >= 40
                          ? "Average content quality"
                          : "Poor content quality"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Keywords Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Top Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {page.keywords?.length ? (
                    page.keywords.map((keyword, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="px-2.5 py-1 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No keywords data available</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}

