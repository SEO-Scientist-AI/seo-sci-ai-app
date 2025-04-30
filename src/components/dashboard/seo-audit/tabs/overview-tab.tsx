"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SiteHealthChart } from "../site-health-chart";
import { MetricChart } from "../metric-chart";
import { ThematicReports } from "../thematic-reports";
import { IssuesTable } from "../issues-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { UrlFetcher } from "../url-fetcher";
import { useAuditStore } from "@/store/audit-store";
import { useSearchParams } from "next/navigation";
import { getSiteOverview } from "@/app/actions/processUrls";

interface TopKeyword {
  keyword: string;
  occurrences: number;
  density: string;
}

interface KeywordGap {
  missingKeyword: string;
  competitorUsage: "High" | "Medium" | "Low";
  searchVolume: string;
}

const topKeywords: TopKeyword[] = [
  { keyword: "consulting", occurrences: 87, density: "3.2%" },
  { keyword: "business", occurrences: 64, density: "2.4%" },
  { keyword: "services", occurrences: 52, density: "1.9%" },
  { keyword: "solutions", occurrences: 43, density: "1.6%" },
];

const keywordGaps: KeywordGap[] = [
  { missingKeyword: "strategy", competitorUsage: "High", searchVolume: "8.4K" },
  {
    missingKeyword: "management",
    competitorUsage: "Medium",
    searchVolume: "6.2K",
  },
  {
    missingKeyword: "analytics",
    competitorUsage: "Medium",
    searchVolume: "5.1K",
  },
  {
    missingKeyword: "innovation",
    competitorUsage: "Low",
    searchVolume: "3.7K",
  },
];

export function OverviewTab() {
  const [overviewData, setOverviewData] = useState({
    siteHealth: {
      score: 80,
      issues: 0, // Use the calculated total from the audit store
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
  });
  const { issues } = useAuditStore();
  const searchParams = useSearchParams();
  const currentWebsite = searchParams.get("website") || "";

  // Memoize chart data arrays to prevent unnecessary re-renders
  const issuesChartData = useMemo(
    () => [750, 830, 820, 790, 800, overviewData.siteHealth.issues],
    [overviewData.siteHealth.issues]
  );

  const warningsChartData = useMemo(
    () => [1800, 2100, 2300, 2500, 2600, overviewData.siteHealth.warnings],
    [overviewData.siteHealth.warnings]
  );

  const recommendationsChartData = useMemo(
    () => [400, 450, 500, 550, 590, overviewData.siteHealth.recommendations],
    [overviewData.siteHealth.recommendations]
  );

  // Poll getSiteOverview every 10 seconds
  const fetchSiteOverview = useCallback(async () => {
    if (currentWebsite) {
      try {
        console.log("Polling site overview for:", currentWebsite);
        await getSiteOverview(currentWebsite);
      } catch (error) {
        console.error("Error polling site overview:", error);
      }
    }
  }, [currentWebsite]);

  // Set up polling interval
  useEffect(() => {
    // Initial fetch
    fetchSiteOverview();

    // Set up interval for polling
    const intervalId = setInterval(fetchSiteOverview, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchSiteOverview]);

  useEffect(() => {
    const totalIssues = issues.items.reduce(
      (total, issue) => total + issue.pagesAffected,
      0
    );

    setOverviewData((prevData) => {
      // Only update if the issues value has changed
      if (prevData.siteHealth.issues !== totalIssues) {
        return {
          ...prevData,
          siteHealth: { ...prevData.siteHealth, issues: totalIssues },
        };
      }
      // Return previous state unchanged if no update needed
      return prevData;
    });
  }, [issues]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              Site Health{" "}
              <i className="fas fa-info-circle ml-2 text-gray-400 text-sm"></i>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <SiteHealthChart value={overviewData.siteHealth.score} />
              <div className="w-full mt-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm">Your site</span>
                  </div>
                  <span className="text-sm font-medium">
                    {overviewData.siteHealth.score}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-sm">Top-10% websites</span>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-red-500">
                      {overviewData.siteHealth.issues}
                    </h3>
                    <span className="text-red-500 ml-2 text-sm">+283</span>
                  </div>
                  <i className="fas fa-info-circle text-gray-400 text-sm"></i>
                </div>
                <div className="text-gray-600 mb-4">Errors</div>
                <MetricChart data={issuesChartData} color="#ef4444" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0</span>
                  <span>{overviewData.siteHealth.issues}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-orange-500">
                      {overviewData.siteHealth.warnings}
                    </h3>
                    <span className="text-orange-500 ml-2 text-sm">+1,066</span>
                  </div>
                  <i className="fas fa-info-circle text-gray-400 text-sm"></i>
                </div>
                <div className="text-gray-600 mb-4">Warnings</div>
                <MetricChart data={warningsChartData} color="#f97316" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0</span>
                  <span>{overviewData.siteHealth.warnings}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-blue-500">
                      {overviewData.siteHealth.recommendations}
                    </h3>
                    <span className="text-blue-500 ml-2 text-sm">+237</span>
                  </div>
                  <i className="fas fa-info-circle text-gray-400 text-sm"></i>
                </div>
                <div className="text-gray-600 mb-4">Notices</div>
                <MetricChart data={recommendationsChartData} color="#0ea5e9" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0</span>
                  <span>{overviewData.siteHealth.recommendations}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <UrlFetcher />

      <Card>
        <CardHeader>
          <CardTitle>Thematic Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ThematicReports />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              Crawled Pages{" "}
              <i className="fas fa-info-circle ml-2 text-gray-400 text-sm"></i>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-blue-500">
                  {overviewData.crawledPages.total}
                </h3>
                <span className="text-blue-500 text-sm">+59</span>
              </div>
            </div>
            <div className="mb-6">
              <Progress value={32} className="h-6 bg-gray-200">
                <div className="flex h-full">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: "1%" }}
                  ></div>
                  <div
                    className="bg-orange-400 h-full"
                    style={{ width: "31%" }}
                  ></div>
                </div>
              </Progress>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm">Healthy</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">
                    {overviewData.crawledPages.healthy}
                  </span>
                  <span className="text-red-500 ml-1 text-sm">-1</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm">Broken</span>
                </div>
                <span className="font-medium">
                  {overviewData.crawledPages.broken}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                  <span className="text-sm">Have issues</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">
                    {overviewData.crawledPages.withIssues}
                  </span>
                  <span className="text-green-500 ml-1 text-sm">+60</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                  <span className="text-sm">Redirects</span>
                </div>
                <span className="font-medium">
                  {overviewData.crawledPages.redirects}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  <span className="text-sm">Blocked</span>
                </div>
                <span className="font-medium">
                  {overviewData.crawledPages.blocked}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <IssuesTable />
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="!rounded-button whitespace-nowrap cursor-pointer"
              >
                View details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robots.txt Updates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Robots.txt Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              since the last crawl
            </div>
            <div className="space-y-2">
              <div className="font-medium">File status</div>
              <div className="flex items-center gap-2 text-green-500">
                <span>Available</span>
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="text-sm text-muted-foreground">
                No changes detected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Analysis Section */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Keyword Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Top Keywords Table */}
            <div>
              <h3 className="text-lg font-medium mb-4">Top Keywords</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Occurrences</TableHead>
                    <TableHead className="text-right">Density</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topKeywords.map((kw) => (
                    <TableRow key={kw.keyword}>
                      <TableCell>{kw.keyword}</TableCell>
                      <TableCell className="text-right">
                        {kw.occurrences}
                      </TableCell>
                      <TableCell className="text-right">{kw.density}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                View full keyword analysis
              </Button>
            </div>

            {/* Keyword Gaps Table */}
            <div>
              <h3 className="text-lg font-medium mb-4">Keyword Gaps</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Missing Keyword</TableHead>
                    <TableHead>Competitor Usage</TableHead>
                    <TableHead className="text-right">Search Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordGaps.map((gap) => (
                    <TableRow key={gap.missingKeyword}>
                      <TableCell>{gap.missingKeyword}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            gap.competitorUsage === "High"
                              ? "bg-red-100 text-red-800"
                              : gap.competitorUsage === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {gap.competitorUsage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {gap.searchVolume}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
