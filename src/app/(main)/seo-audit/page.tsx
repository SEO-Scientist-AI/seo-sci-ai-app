"use client"

import { useState, useEffect } from "react"
import { useWebsite } from "@/hooks/use-website"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OverviewTab } from "@/components/dashboard/seo-audit/tabs/overview-tab"
import { IssuesTab } from "@/components/dashboard/seo-audit/tabs/issues-tab"
import { KeywordsTab } from "@/components/dashboard/seo-audit/tabs/keywords-tab"
import { ContentTab } from "@/components/dashboard/seo-audit/tabs/content-tab"
import { PerformanceTab } from "@/components/dashboard/seo-audit/tabs/performance-tab"
import { RecommendationsTab } from "@/components/dashboard/seo-audit/tabs/recommendations-tab"
import { CrawledPagesTab } from "@/components/dashboard/seo-audit/tabs/crawled-pages-tab"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CrawlStatsBadge } from "@/components/dashboard/seo-audit/crawl-stats-badge"
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
import { ProgressTab } from "@/components/dashboard/seo-audit/tabs/progress-tab"

export const runtime = "edge";

export default function SeoAuditPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { currentWebsite, isLoading } = useWebsite()

  // Mock data - replace with actual data from your API
  const mockData = {
    siteHealth: {
      score: 80,
      issues: 806,
      warnings: 2778,
      recommendations: 611,
    },
    metrics: {
      performance: 85,
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
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Campaign #4</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="default" size="sm" className="gap-1.5 h-9 px-3">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Rerun Audit</span>
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
                  <Badge
                    variant="outline"
                    className="h-7 px-3 bg-background border-border flex items-center gap-1.5 text-sm font-normal"
                  >
                    <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Mobile</span>
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
                      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                      <path d="M7 7h.01"></path>
                    </svg>
                    <span>JS rendering: Disabled</span>
                  </Badge>

                  <CrawlStatsBadge />

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
            />
          </TabsContent>

          <TabsContent value="issues" className="mt-0">
            <IssuesTab />
          </TabsContent>

          <TabsContent value="keywords" className="mt-0">
            <KeywordsTab keywords={[]} />
          </TabsContent>

          <TabsContent value="on-page" className="mt-0">
            <ContentTab metrics={[]} />
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <PerformanceTab metrics={[]} />
          </TabsContent>

          <TabsContent value="statistics" className="mt-0">
            <RecommendationsTab recommendations={[]} />
          </TabsContent>

          <TabsContent value="crawled-pages" className="mt-0">
            <CrawledPagesTab />
          </TabsContent>

          <TabsContent value="compare-crawls" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Compare Crawls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Compare crawls content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="js-impact" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>JS Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">JS impact content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
