"use client";

import type { SearchAnalyticsPage } from "@/types/searchConsole";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCw,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { requestIndexing } from "@/app/actions/requestIndexing";
import { useEffect } from "react";
import { toast } from "sonner";
import { checkIndexingStatus } from "@/app/actions/checkIndexingStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSidebar } from "@/store/sidebar-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircularProgress } from "@/components/dashboard/circular-score";

interface PageDetailsSidebarProps {
  page: SearchAnalyticsPage | null;
  onClose: () => void;
}

// Helper function to get clean path (add at the top of the file)
function getCleanPath(url: string): string {
  try {
    // Remove protocol and domain
    const path = url.replace(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im,
      ""
    );
    // Remove trailing slash
    return path.replace(/\/$/, "");
  } catch (e) {
    return url;
  }
}

export function PageDetailsSidebar({ page, onClose }: PageDetailsSidebarProps) {
  const { getPageState, updatePageStatus, setPageIndexing } = useSidebar();
  const pageState = page ? getPageState(page.page) : undefined;

  const checkIndexStatus = async () => {
    if (!page?.page) return;

    setPageIndexing(page.page, true);
    try {
      const status = await checkIndexingStatus(page.page);
      updatePageStatus(page.page, status);
    } catch (error) {
      toast.error("Failed to check indexing status");
    } finally {
      setPageIndexing(page.page, false);
    }
  };

  const handleRequestIndex = async () => {
    if (!page?.page) return;

    setPageIndexing(page.page, true);
    try {
      const result = await requestIndexing(page.page);
      if (result.success) {
        toast.success(result.message, { duration: 5000 });
        // Recheck status after requesting indexing
        await checkIndexStatus();
      } else {
        toast.error(result.error, {
          description: result.helpText,
          duration: 10000,
        });
      }
    } catch (error) {
      toast.error("Failed to request indexing");
    } finally {
      setPageIndexing(page.page, false);
    }
  };

  useEffect(() => {
    if (!page?.page) return;

    const state = getPageState(page.page);
    if (
      !state?.indexStatus ||
      Date.now() - (state.lastChecked || 0) > 5 * 60 * 1000
    ) {
      checkIndexStatus();
    }
  }, [page?.page]);

  return (
    <div
      className={cn(
        "fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-background border-l shadow-lg transform transition-transform duration-200 ease-in-out overflow-hidden",
        page ? "translate-x-0" : "translate-x-full"
      )}
    >
      {page && (
        <>
          {/* Header Section */}
          <div className="border-b bg-muted/30">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-medium bg-muted/50 px-2 py-1 rounded">
                  {getCleanPath(page.page)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-muted shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-5 space-y-6">
              {/* Content Score Section - Moved to top */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Content Score
                </h4>
                <Card className="border-none shadow-none bg-muted/30">
                  <CardContent className="p-6 flex flex-col items-center justify-center ">
                    <CircularProgress
                      value={page.contentScore}
                      size="large"
                      indicatorColor={cn(
                        "bg-gradient-to-r from-amber-300 to-amber-500",
                        page.contentScore >= 70
                          ? "from-green-300 to-green-500"
                          : page.contentScore >= 40
                          ? "from-amber-300 to-amber-500"
                          : "from-red-300 to-red-500"
                      )}
                    />
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium ">
                        {page.contentScore >= 70
                          ? "Good content quality"
                          : page.contentScore >= 40
                          ? "Average content quality"
                          : "Poor content quality"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Based on keyword optimization, readability, and SEO
                        factors
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Article Data Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Article Data
                </h4>
                <p className="text-xs text-muted-foreground">
                  Key metrics and performance indicators
                </p>

                {/* Keyword */}
                <div className="p-3 bg-muted/30 rounded-lg space-y-1">
                  <p className="text-sm font-medium">Keyword</p>
                  <p className="text-base">{page.mainKeyword}</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Search Volume</p>
                      </div>
                      <p className="text-xl font-semibold">880</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Difficulty</p>
                      </div>
                      <p className="text-xl font-semibold">0</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Word Count</p>
                      </div>
                      <p className="text-xl font-semibold">2917</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">Keyword Density</p>
                      </div>
                      <p className="text-xl font-semibold">0.8%</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Headings</p>
                      </div>
                      <p className="text-xl font-semibold">15</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">Images</p>
                      </div>
                      <p className="text-xl font-semibold">2</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <p className="text-sm font-medium">Internal Links</p>
                      </div>
                      <p className="text-xl font-semibold">1</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">External Links</p>
                      </div>
                      <p className="text-xl font-semibold">4</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Indexing Status Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Indexing Status
                  </h4>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={checkIndexStatus}
                    disabled={pageState?.isIndexing}
                    className="h-8 w-8 rounded-full"
                  >
                    {pageState?.isIndexing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Card className="border-none shadow-none bg-muted/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      {pageState?.isIndexing ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">
                            Checking status...
                          </span>
                        </div>
                      ) : pageState?.indexStatus ? (
                        <>
                          {pageState.indexStatus.status === "INDEXED" ? (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Indexed
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                              <div className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-500" />
                              <span className="text-sm font-medium">
                                Not Indexed
                              </span>
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
                              <Send className="h-3.5 w-3.5 mr-2" />
                              Request Indexing
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {pageState?.indexStatus?.lastCrawled && (
                      <p className="text-xs text-muted-foreground">
                        Last crawled:{" "}
                        {new Date(
                          pageState.indexStatus.lastCrawled
                        ).toLocaleDateString()}
                      </p>
                    )}

                    {pageState?.indexStatus?.status === "NOT_INDEXED" &&
                      !pageState.isIndexing && (
                        <Alert
                          variant="default"
                          className="mt-2 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            This page isn't indexed by Google yet. Click
                            "Request Indexing" to submit it.
                          </AlertDescription>
                        </Alert>
                      )}
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Performance Metrics Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Performance Metrics
                </h4>
                <p className="text-xs text-muted-foreground">
                  Search performance and visibility data
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Clicks</p>
                      </div>
                      <p className="text-xl font-semibold">{page.clicks}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Impressions</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {page.impressions}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">Avg. Position</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {Number(page.position).toFixed(1)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">CTR</p>
                      </div>
                      <p className="text-xl font-semibold">{page.ctr}%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Keywords Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Top Keywords
                </h4>
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
                    <p className="text-xs text-muted-foreground">
                      No keywords data available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
