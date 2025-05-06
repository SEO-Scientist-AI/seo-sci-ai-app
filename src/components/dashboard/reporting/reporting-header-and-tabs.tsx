"use client";

import { useState } from "react";
import { useWebsite } from "@/hooks/use-website";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  FileText,
  Download,
  Share2,
  Settings,
  ChevronDown,
  Globe,
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  Search,
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  LineChart,
  Link,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SeoPerformanceOverview from "./tabs/seo-performance-overview";
import SeoPerformanceSiteAnalytics from "@/components/dashboard/reporting/tabs/seo-performace-site-analytics";
import SeoPerformanceRankTracker from "@/components/dashboard/reporting/tabs/seo-performace-rank-tracker";
import SeoPerformanceKeyword from "@/components/dashboard/reporting/tabs/seo-performace-keyword";

const SeoPerformanceDashboard = () => {
  const { currentWebsite, isLoading } = useWebsite();
  const [timeRange, setTimeRange] = useState("30days");
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading website data...
          </p>
        </div>
      </div>
    );
  }

  if (!currentWebsite) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a website to view SEO performance data
          </AlertDescription>
        </Alert>
      </div>
    );
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
                  <h1 className="text-xl font-semibold text-foreground">
                    SEO Performance
                  </h1>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-primary mr-1.5" />
                    <span className="font-medium text-primary">
                      {currentWebsite}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary/10 text-primary border-primary/20"
                  >
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
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 h-9 px-3"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh Data</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-9 px-3"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </Button>

                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:hidden"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats and badges row */}
          <div className="bg-muted/50 border-t border-border w-full">
            <div className="container mx-auto">
              <div className="px-4 md:px-6 py-3 flex flex-wrap gap-3 md:gap-6 justify-between items-center">
                <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Search post URL" 
                      className="pl-9 h-9"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-9 px-3"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {timeRange === "7days" && "Last 7 days"}
                          {timeRange === "15days" && "Last 15 days"}
                          {timeRange === "30days" && "Last 30 days"}
                          {timeRange === "90days" && "Last 90 days"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setTimeRange("7days")}>
                        Last 7 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("15days")}>
                        Last 15 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("30days")}>
                        Last 30 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("90days")}>
                        Last 90 days
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-9 px-3"
                      >
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
                        <Download className="h-4 w-4" />
                        <span>CSV Export</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs
          defaultValue="overview"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 w-full grid grid-cols-6 gap-4 overflow-x-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="site-analytics" className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Site Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="seo-performance" className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>SEO Performance</span>
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-1.5">
              <Search className="h-4 w-4" />
              <span>Keywords</span>
            </TabsTrigger>
            <TabsTrigger value="rank-tracker" className="flex items-center gap-1.5">
              <LineChart className="h-4 w-4" />
              <span>Rank Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="backlinks" className="flex items-center gap-1.5">
              <Link className="h-4 w-4" />
              <span>Backlinks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <SeoPerformanceOverview />
          </TabsContent>

          <TabsContent value="site-analytics" className="mt-0">
            <SeoPerformanceSiteAnalytics />
          </TabsContent>

          <TabsContent value="seo-performance" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>SEO Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SEO Performance metrics and trends will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="mt-0">
            <SeoPerformanceKeyword />
          </TabsContent>

          <TabsContent value="rank-tracker" className="mt-0">
            <SeoPerformanceRankTracker />
          </TabsContent>

          <TabsContent value="backlinks" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Backlinks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Backlink analysis will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeoPerformanceDashboard;