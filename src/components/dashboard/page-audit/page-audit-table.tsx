"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAnalyticsFilters } from "@/store/analytics-filters";
import type { SearchAnalyticsPage } from "@/types/searchConsole";
import { SortableHeader } from "./page-audit-sortable-header";
import { filterAnalytics } from "@/app/actions/filterAnalytics";
import { PageDetailsSidebar } from "./page-audit-sidebar";
import {
  ExternalLink,
  PanelRightOpen,
  ArrowDown,
  ArrowUp,
  Minus,
  LayoutDashboard,
  Pencil,
  Sidebar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requestIndexing } from "@/app/actions/requestIndexing";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TrendIndicator } from "@/components/dashboard/trend-indicator";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useWebsite } from "@/hooks/use-website";

interface PagesTableProps {
  initialPages: SearchAnalyticsPage[];
}

// Add new interface for scrape response
interface ScrapeResponse {
  url: string;
  title: string;
  description: string;
}

// Add new interface to track page titles
interface PageTitleState {
  [url: string]: {
    title?: string;
    loading: boolean;
  };
}

function getCleanPath(url: string): string {
  try {
    const path = url.replace(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im,
      ""
    );
    return path.replace(/\/$/, "");
  } catch (e) {
    return url;
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
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
  const { currentWebsite, isLoading: isWebsiteLoading } = useWebsite();
  const { filters } = useAnalyticsFilters();
  const [pages, setPages] = useState(initialPages);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<SearchAnalyticsPage | null>(
    null
  );
  const [indexingPages, setIndexingPages] = useState<Set<string>>(new Set());
  const [pageTitles, setPageTitles] = useState<PageTitleState>({});

  useEffect(() => {
    async function fetchPages() {
      if (!currentWebsite) return;
      
      setLoading(true);
      try {
        const newPages = await filterAnalytics(filters);
        setPages(newPages);
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast.error("Failed to fetch page data");
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if we have a website selected
    if (currentWebsite && !isWebsiteLoading) {
      fetchPages();
    }
  }, [filters, currentWebsite, isWebsiteLoading]);

  // Update the fetchPageTitle function with the correct API endpoint
  const fetchPageTitle = async (url: string) => {
    // Skip if already loading or we have the title
    if (pageTitles[url]?.loading || pageTitles[url]?.title) return;

    // Update loading state
    setPageTitles((prev) => ({
      ...prev,
      [url]: { loading: true },
    }));

    try {
      console.log("Fetching title for:", url);

      // Create base64 encoded credentials
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

      // Log the response status
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to fetch page title: ${response.status} ${errorText}`
        );
      }

      const data = (await response.json()) as ScrapeResponse;

      // Log the received data
      console.log("API Response for", url, ":", data);

      // Only update if we got a title back
      if (data.title) {
        console.log("Setting title for", url, ":", data.title);
        setPageTitles((prev) => ({
          ...prev,
          [url]: {
            title: data.title,
            loading: false,
          },
        }));
      } else {
        console.log("No title received for:", url);
        setPageTitles((prev) => ({
          ...prev,
          [url]: {
            loading: false,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching page title for", url, ":", error);
      toast.error(
        `Failed to fetch page title: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setPageTitles((prev) => ({
        ...prev,
        [url]: {
          loading: false,
        },
      }));
    }
  };

  // Fetch titles for visible pages
  useEffect(() => {
    if (!loading && pages.length > 0) {
      pages.forEach((page) => {
        fetchPageTitle(page.page);
      });
    }
  }, [pages, loading]);

  // Modify the page URL/title display in the table row
  const renderPageTitle = (page: SearchAnalyticsPage) => {
    const titleState = pageTitles[page.page];
    const isSpecialMessage = 
      page.mainKeyword === "Property not found in Search Console" || 
      page.mainKeyword === "No data in Search Console" ||
      page.mainKeyword === "No permission for this property";

    // Get badge text based on the message type
    const getBadgeText = () => {
      if (page.mainKeyword === "No permission for this property") {
        return "No Access";
      }
      return "Not Verified";
    };

    // Get tooltip text based on the message type
    const getTooltipText = () => {
      if (page.mainKeyword === "No permission for this property") {
        return "You don't have permission to access this property in Google Search Console";
      }
      return "This website needs to be verified in Google Search Console";
    };

    if (titleState?.loading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-[200px]" />
        </div>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {isSpecialMessage ? (
              <div className="text-amber-600 hover:text-amber-700 truncate inline-flex items-center gap-1 font-medium">
                {page.page.replace(/^https?:\/\//, "")}
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {getBadgeText()}
                </span>
              </div>
            ) : (
              <Link
                href={page.page}
                className="text-primary hover:underline truncate inline-flex items-center gap-1 font-medium"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
              >
                {titleState?.title || getCleanPath(page.page)}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </Link>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {isSpecialMessage ? (
              <p>{getTooltipText()}</p>
            ) : (
              <p>Open page in new tab</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleRequestIndex = async (
    url: string,
    e: React.MouseEvent,
    page: SearchAnalyticsPage
  ) => {
    e.stopPropagation();

    setSelectedPage(page);

    setIndexingPages((prev) => new Set(prev).add(url));
    try {
      const result = await requestIndexing(url);
      if (result.success) {
        toast.success(result.message, {
          duration: 5000,
        });
      } else {
        toast.error(result.error, {
          description: result.helpText,
          duration: 10000,
        });
      }
    } catch (error) {
      toast.error("Failed to request indexing");
    } finally {
      setIndexingPages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-green-600 bg-green-50";
    if (position <= 10) return "text-blue-600 bg-blue-50";
    if (position <= 20) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getTrafficTrend = (traffic: number) => {
    // This would ideally use real trend data
    if (traffic > 100) return "text-green-600";
    if (traffic > 50) return "text-blue-600";
    if (traffic > 10) return "text-amber-600";
    return "text-muted-foreground";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-green-300 to-green-500";
    if (score >= 40) return "from-amber-300 to-amber-500";
    return "from-red-300 to-red-500";
  };

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
                    <SortableHeader field="contentScore">
                      Content Score
                    </SortableHeader>
                  </TableHead>
                  <TableHead
                    className={cn("w-[100px] text-right", cellDividerClass)}
                  >
                    <SortableHeader field="position">Position</SortableHeader>
                  </TableHead>
                  <TableHead
                    className={cn("w-[100px] text-right", cellDividerClass)}
                  >
                    <SortableHeader field="traffic">Traffic</SortableHeader>
                  </TableHead>
                  <TableHead
                    className={cn("w-[100px] text-right", cellDividerClass)}
                  >
                    <SortableHeader field="impressions">Impr.</SortableHeader>
                  </TableHead>
                  <TableHead
                    className={cn("w-[80px] text-right", cellDividerClass)}
                  >
                    <SortableHeader field="ctr">CTR</SortableHeader>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(loading || isWebsiteLoading) ? (
                  // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
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
                              <Skeleton
                                key={i}
                                className="h-1.5 flex-1 rounded-sm"
                              />
                            ))}
                          </div>
                          <Skeleton className="h-3 w-8" />
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <Skeleton className="h-6 w-12 ml-auto rounded-full" />
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className={cn("text-right", cellDividerClass)}>
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  pages.map((page, i) => {
                    const isSpecialMessage = 
                      page.mainKeyword === "Property not found in Search Console" || 
                      page.mainKeyword === "No data in Search Console" ||
                      page.mainKeyword === "No permission for this property";
                    
                    // Get explanation text to show under the domain
                    const getSpecialMessageText = () => {
                      if (page.mainKeyword === "No permission for this property") {
                        return (
                          <span className="text-amber-600">
                            You don't have permission to access this domain in Google Search Console
                          </span>
                        );
                      }
                      return (
                        <span className="text-amber-600">
                          Verify this website in Google Search Console to see data
                        </span>
                      );
                    };
                    
                    return (
                      <TableRow
                        key={i}
                        className={cn(
                          "group cursor-pointer transition-colors h-14",
                          selectedPage?.page === page.page && "bg-muted/50"
                        )}
                        onClick={() => setSelectedPage(page)}
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center h-full">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="flex-1 truncate">
                                  {renderPageTitle(page)}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground truncate">
                                {page.mainKeyword === "Property not found in Search Console" || 
                                 page.mainKeyword === "No data in Search Console" ||
                                 page.mainKeyword === "No permission for this property" ? (
                                  getSpecialMessageText()
                                ) : (
                                  page.mainKeyword
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add timestamp to force fresh data scrape
                                  const timestamp = Date.now();
                                  window.location.href = `/ai-writer?url=${encodeURIComponent(
                                    page.page
                                  )}&refresh=${timestamp}`;
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
                              {getScoreSegments(page.contentScore).map(
                                (segment, index) => (
                                  <div
                                    key={index}
                                    className={cn(
                                      "h-1.5 flex-1 rounded-sm",
                                      segment.active
                                        ? segment.className
                                        : "bg-gray-100 dark:bg-gray-800"
                                    )}
                                  />
                                )
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {page.contentScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={cn("text-right", cellDividerClass)}>
                          <div className="flex items-center justify-end gap-2">
                            <TrendIndicator
                              trend={page.positionTrend}
                              isPosition={true}
                            />
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-medium",
                                getPositionColor(page.position)
                              )}
                            >
                              {page.position}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className={cn("text-right", cellDividerClass)}>
                          <div className="flex items-center justify-end gap-1">
                            <TrendIndicator trend={page.trafficTrend} />
                            <span
                              className={cn(
                                "font-medium",
                                getTrafficTrend(page.traffic)
                              )}
                            >
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PageDetailsSidebar
        page={selectedPage}
        onClose={() => setSelectedPage(null)}
      />
    </div>
  );
}
