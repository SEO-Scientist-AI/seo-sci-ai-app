"use client"

import { useState, useEffect } from "react"
import { useWebsite } from "@/hooks/use-website"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tab components
import { OverviewTab } from "@/components/dashboard/seo-audit/tabs/overview-tab"
import { IssuesTab } from "@/components/dashboard/seo-audit/tabs/issues-tab"
import { KeywordsTab } from "@/components/dashboard/seo-audit/tabs/keywords-tab"
import { ContentTab } from "@/components/dashboard/seo-audit/tabs/content-tab"
import { PerformanceTab } from "@/components/dashboard/seo-audit/tabs/performance-tab"
import { RecommendationsTab } from "@/components/dashboard/seo-audit/tabs/recommendations-tab"
import { CrawledPagesTab } from "@/components/dashboard/seo-audit/tabs/crawled-pages-tab"
import { ProgressTab } from "@/components/dashboard/seo-audit/tabs/progress-tab"

// Icons
import {
  RefreshCw,
  Eye,
  FileText,
  Download,
  Share2,
  Settings,
  ChevronDown,
  Globe,
  Smartphone,
  Tag,
  Clock,
  MoreHorizontal,
  AlertCircle,
  Loader2
} from "lucide-react"

// Skeleton components
import { TabSkeleton } from "@/components/dashboard/seo-audit/tab-skeleton"
import { OverviewSkeleton } from "@/components/dashboard/seo-audit/overview-skeleton"

export const runtime = "edge";

// Web Vitals API response type
interface WebVitalsResponse {
  requested_url: string;
  final_url: string;
  fetch_time: string;
  overall_performance_score: number;
  lab_data: Record<string, any> | null;
  field_data: any;
  diagnostics: any;
  failed_audits: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    display_value: string | null;
    details_summary: any;
  }>;
  error: string | null;
}

// Device strategy for web vitals API
type Strategy = "desktop" | "mobile";

// Custom hook to fetch Web Vitals data
function useWebVitals(url: string | null, strategy: Strategy = "desktop") {
  const [data, setData] = useState<WebVitalsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchWebVitals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.seoscientist.ai/api/performance/web-vitals?url=${encodeURIComponent(url)}&strategy=${strategy}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const webVitalsData = await response.json();
        setData(webVitalsData as WebVitalsResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching Web Vitals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebVitals();
  }, [url, strategy]);

  // Function to manually refresh data
  const refreshData = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.seoscientist.ai/api/performance/web-vitals?url=${encodeURIComponent(url)}&strategy=${strategy}&nocache=true`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const webVitalsData = await response.json();
      setData(webVitalsData as WebVitalsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error refreshing Web Vitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refreshData };
}

// Create performance metrics from web vitals data
function createPerformanceMetrics(webVitalsData: WebVitalsResponse | null) {
  if (!webVitalsData) return [];

  // Extract key metrics from failed_audits
  const metrics = [];
  
  // Get overall performance score
  metrics.push({
    id: 'performance-score',
    name: 'Performance Score',
    value: Math.round(webVitalsData.overall_performance_score * 100),
    target: 100,
    unit: '',
    trend: 'stable' as const,
    change: 0,
  });
  
  // Map key metrics from failed_audits
  const metricsMap: Record<string, { name: string, target: number, unit: string }> = {
    'first-contentful-paint': { name: 'First Contentful Paint', target: 1.8, unit: 's' },
    'largest-contentful-paint': { name: 'Largest Contentful Paint', target: 2.5, unit: 's' },
    'speed-index': { name: 'Speed Index', target: 3.4, unit: 's' },
    'total-blocking-time': { name: 'Total Blocking Time', target: 200, unit: 'ms' },
    'cumulative-layout-shift': { name: 'Cumulative Layout Shift', target: 0.1, unit: '' },
    'interactive': { name: 'Time to Interactive', target: 3.8, unit: 's' }
  };
  
  // Process failed audits to extract metrics
  webVitalsData.failed_audits.forEach(audit => {
    if (metricsMap[audit.id]) {
      // Extract numeric value from display_value (e.g., "1.7 s" -> 1.7)
      let value = 0;
      if (audit.display_value) {
        const match = audit.display_value.match(/(\d+(\.\d+)?)/);
        if (match) {
          value = parseFloat(match[0]);
        }
      }
      
      metrics.push({
        id: audit.id,
        name: metricsMap[audit.id].name,
        value: value,
        target: metricsMap[audit.id].target,
        unit: metricsMap[audit.id].unit,
        trend: 'stable' as const,
        change: 0
      });
    }
  });
  
  return metrics;
}

export default function SeoAuditPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [strategy, setStrategy] = useState<Strategy>("desktop")
  const { currentWebsite, isLoading: websiteLoading } = useWebsite()
  const { 
    data: webVitalsData, 
    isLoading: vitalsLoading, 
    error: vitalsError,
    refreshData: refreshWebVitals
  } = useWebVitals(currentWebsite ? `https://${currentWebsite}` : null, strategy);

  // Performance metrics based on Web Vitals API data
  const performanceMetrics = createPerformanceMetrics(webVitalsData);

  // Count issues from web vitals data
  const issuesCount = webVitalsData?.failed_audits?.length || 0;
  
  // Mock data - replace with actual data from your API
  const mockData = {
    siteHealth: {
      score: webVitalsData ? Math.round(webVitalsData.overall_performance_score * 100) : 80,
      issues: issuesCount || 806,
      warnings: 2778,
      recommendations: 611,
    },
    metrics: {
      performance: webVitalsData ? Math.round(webVitalsData.overall_performance_score * 100) : 85,
      accessibility: 90,
      bestPractices: 75,
      seo: 80,
    },
    crawledPages: {
      total: 159,
      healthy: 2,
      broken: 0,
      withIssues: 156,
      redirects: 1,
      blocked: 0,
    },
  }

  // Determine overall loading state - website data is essential
  const isLoading = websiteLoading;

  // Handle rerun audit action
  const handleRerunAudit = () => {
    refreshWebVitals();
  };

  // Toggle between mobile and desktop strategy
  const toggleStrategy = () => {
    setStrategy(prev => prev === "desktop" ? "mobile" : "desktop");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Loading website data...</p>
        </div>
      </div>
    )
  }

  if (!currentWebsite) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a website to view SEO audit data
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="top-0 z-10 border-b w-full">
        <div className="w-full">
          {/* Site info row */}
          <div className="container mx-auto">
            <div className="py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground">Site Audit</h1>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-primary mr-1.5" />
                    <span className="font-medium text-primary">{currentWebsite}</span>
                  </div>
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last updated: {webVitalsData ? new Date(webVitalsData.fetch_time).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Campaign #4</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-1.5 h-9 px-3"
                  onClick={handleRerunAudit}
                  disabled={vitalsLoading}
                >
                  {vitalsLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Rerun Audit</span>
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 h-9 px-3">
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                      <ChevronDown className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>PDF Report</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Looker Studio</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Download className="h-4 w-4" />
                      <span>CSV Export</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" className="gap-1.5 h-9 px-3">
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </Button>

                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats and badges row */}
          <div className="bg-muted/50 border-t border-border w-full">
            <div className="container mx-auto">
              <div className="px-4 md:px-6 py-3 flex flex-wrap gap-3 md:gap-6 justify-between items-center">
                <div className="flex flex-wrap gap-3 md:gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={`h-7 px-3 bg-background border-border flex items-center gap-1.5 text-sm font-normal ${vitalsLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} transition-colors ${strategy === "mobile" ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
                          onClick={vitalsLoading ? undefined : toggleStrategy}
                        >
                          {vitalsLoading ? (
                            <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                          ) : strategy === "mobile" ? (
                            <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
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
                              className="text-muted-foreground"
                            >
                              <rect x="2" y="3" width="20" height="14" rx="2" />
                              <line x1="8" x2="16" y1="21" y2="21" />
                              <line x1="12" x2="12" y1="17" y2="21" />
                            </svg>
                          )}
                          <span>{strategy === "mobile" ? "Mobile" : "Desktop"}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to switch to {strategy === "mobile" ? "Desktop" : "Mobile"} view</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Badge
                    variant="outline"
                    className="h-7 px-3 bg-background border-border flex items-center gap-1.5 text-sm font-normal"
                  >
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
                      className="text-muted-foreground"
                    >
                      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                      <path d="M7 7h.01"></path>
                    </svg>
                    <span>JS rendering: Disabled</span>
                  </Badge>

                  <Badge
                    variant="outline"
                    className="h-7 px-3 bg-background border-border flex items-center gap-1.5 text-sm font-normal"
                  >
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
                      className="text-muted-foreground"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    <span>
                      Pages crawled: <strong className="text-foreground">159</strong>/500
                    </span>
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-muted-foreground">
                      Health Score: <strong className="text-foreground">{mockData.siteHealth.score}%</strong>
                    </span>
                  </div>

                  <Separator orientation="vertical" className="h-5" />

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-muted-foreground">
                      Issues: <strong className="text-foreground">{mockData.siteHealth.issues}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-10 gap-4 overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="crawled-pages">Crawled Pages</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="compare-crawls">Compare Crawls</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="js-impact">JS Impact</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="on-page">On-Page</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <OverviewTab
              siteHealth={mockData.siteHealth}
              metrics={mockData.metrics}
              crawledPages={mockData.crawledPages}
              isLoading={vitalsLoading}
            />
          </TabsContent>

          <TabsContent value="issues" className="mt-0">
            <IssuesTab 
              failedAudits={webVitalsData?.failed_audits || []} 
              isLoading={vitalsLoading}
              error={vitalsError}
              currentWebsite={currentWebsite}
            />
          </TabsContent>

          <TabsContent value="keywords" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <KeywordsTab keywords={[]} />
            )}
          </TabsContent>

          <TabsContent value="on-page" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <ContentTab metrics={[]} />
            )}
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <PerformanceTab 
              metrics={performanceMetrics} 
              overallScore={webVitalsData?.overall_performance_score} 
              failedAudits={webVitalsData?.failed_audits}
              isLoading={vitalsLoading}
              error={vitalsError}
            />
          </TabsContent>

          <TabsContent value="statistics" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <RecommendationsTab recommendations={[]} />
            )}
          </TabsContent>

          <TabsContent value="crawled-pages" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <CrawledPagesTab />
            )}
          </TabsContent>

          <TabsContent value="compare-crawls" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Compare Crawls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Compare crawls content will be displayed here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <ProgressTab />
            )}
          </TabsContent>

          <TabsContent value="js-impact" className="mt-0">
            {vitalsLoading ? (
              <TabSkeleton />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>JS Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">JS impact content will be displayed here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
