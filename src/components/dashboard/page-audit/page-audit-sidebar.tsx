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
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { requestIndexing } from "@/app/actions/requestIndexing";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkIndexingStatus } from "@/app/actions/checkIndexingStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSidebar } from "@/store/sidebar-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircularProgress } from "@/components/dashboard/circular-score";

interface ScrapeResponse {
  url: string;
  title: string;
  description: string;
  author: string;
  published_date: string;
  site_name: string;
  content: string;
  markdown: string;
  links: string[];
  images: string[];
  metadata: {
    [key: string]: string;
  };
  processing_time: number;
}

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

// Helper function to count words in a string
function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
}

// Helper function to calculate keyword density
function calculateKeywordDensity(content: string, keyword: string): number {
  if (!content || !keyword) return 0;
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => word === keyword.toLowerCase()).length;
  return Number(((keywordCount / words.length) * 100).toFixed(1));
}

// Helper function to count headings in markdown
function countHeadings(markdown: string): number {
  if (!markdown) return 0;
  const headingRegex = /^#{1,6}\s/gm;
  const matches = markdown.match(headingRegex);
  return matches ? matches.length : 0;
}

// Helper function to categorize links
function categorizeLinks(links: string[], currentDomain: string): { internal: string[], external: string[] } {
  if (!links || !Array.isArray(links)) return { internal: [], external: [] };
  
  const internal: string[] = [];
  const external: string[] = [];
  
  links.forEach(link => {
    try {
      const url = new URL(link);
      if (url.hostname.includes(currentDomain)) {
        internal.push(link);
      } else {
        external.push(link);
      }
    } catch {
      // If URL parsing fails, consider it internal
      internal.push(link);
    }
  });
  
  return { internal, external };
}

export function PageDetailsSidebar({ page, onClose }: PageDetailsSidebarProps) {
  const { getPageState, updatePageStatus, setPageIndexing } = useSidebar();
  const pageState = page ? getPageState(page.page) : undefined;
  const [pageData, setPageData] = useState<ScrapeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<{
    wordCount: number;
    keywordDensity: number;
    headingsCount: number;
    internalLinks: number;
    externalLinks: number;
  }>({
    wordCount: 0,
    keywordDensity: 0,
    headingsCount: 0,
    internalLinks: 0,
    externalLinks: 0,
  });

  // Function to process the scraped data
  const processScrapedData = (data: ScrapeResponse, currentUrl: string) => {
    const domain = new URL(currentUrl).hostname.replace('www.', '');
    const wordCount = countWords(data.content);
    const keywordDensity = calculateKeywordDensity(data.content, page?.mainKeyword || '');
    const headingsCount = countHeadings(data.markdown);
    const { internal, external } = categorizeLinks(data.links || [], domain);

    setProcessedData({
      wordCount,
      keywordDensity,
      headingsCount,
      internalLinks: internal.length,
      externalLinks: external.length,
    });
  };

  // Function to fetch page data
  const fetchPageData = async (url: string) => {
    setIsLoading(true);
    try {
      const credentials = btoa(
        `${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/scrape/page`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.startsWith("http") ? url : `https://${url}`,
            include_markdown: true,
            include_links: true,
            include_images: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch page data: ${response.status}`);
      }

      const data = await response.json() as ScrapeResponse;
      setPageData(data);
      processScrapedData(data, url);
    } catch (error) {
      console.error("Error fetching page data:", error);
      toast.error("Failed to fetch page data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch page data when page changes
  useEffect(() => {
    if (page?.page) {
      fetchPageData(page.page);
    } else {
      setPageData(null);
    }
  }, [page?.page]);

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
        // Show different message based on indexing status
        const isResubmission = pageState?.indexStatus?.status === "INDEXED";
        toast.success(
          isResubmission 
            ? "Page resubmitted for indexing. Google will recrawl it soon."
            : result.message, 
          { duration: 5000 }
        );
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

              {/* Article Data Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Article Data
                </h4>
                <p className="text-xs text-muted-foreground">
                  Key metrics and performance indicators
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Search Volume</p>
                      </div>
                      <p className="text-xl font-semibold">880</p>
                    </CardContent>
                  </Card> */}

                  {/* <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Difficulty</p>
                      </div>
                      <p className="text-xl font-semibold">0</p>
                    </CardContent>
                  </Card> */}

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Word Count</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          processedData.wordCount.toLocaleString()
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">Keyword Density</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          `${processedData.keywordDensity.toFixed(1)}%`
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Headings</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          processedData.headingsCount.toString()
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">Images</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          (pageData?.images?.length || 0).toString()
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <p className="text-sm font-medium">Internal Links</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          processedData.internalLinks.toString()
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">External Links</p>
                      </div>
                      <p className="text-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          processedData.externalLinks.toString()
                        )}
                      </p>
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
                          ) : pageState?.indexStatus?.status === "NOT_INDEXED" ? (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                              <div className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-500" />
                              <span className="text-sm font-medium">
                                Not Indexed
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {pageState?.indexStatus?.message || "Unknown status"}
                              </span>
                            </div>
                          )}
                        </>
                      ) : null}

                      {/* Show Request Indexing for NOT_INDEXED pages */}
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
                      
                      {/* Show Resubmit button for INDEXED pages */}
                      {pageState?.indexStatus?.status === "INDEXED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRequestIndex}
                          disabled={pageState.isIndexing}
                          className="h-8 rounded-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                        >
                          {pageState.isIndexing ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                              Requesting...
                            </>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5 mr-2" />
                              Resubmit for Indexing
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
                        ).toLocaleDateString() + " " +
                        new Date(
                          pageState.indexStatus.lastCrawled
                        ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}

                    {pageState?.indexStatus?.status === "INDEXED" && (
                      <Alert
                        variant="default"
                        className="mt-2 bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                      >
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          If you've recently updated this page, you can use "Resubmit for Indexing" to help Google discover the changes faster.
                        </AlertDescription>
                      </Alert>
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
                    
                    {pageState?.indexStatus?.status === "ERROR" &&
                      !pageState.isIndexing && (
                        <Alert
                          variant="default"
                          className="mt-2 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {pageState.indexStatus.message || "Error checking indexing status. Please try again."}
                          </AlertDescription>
                        </Alert>
                      )}
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Keywords Section */}
              {/* <div className="space-y-3">
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
              </div> */}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
