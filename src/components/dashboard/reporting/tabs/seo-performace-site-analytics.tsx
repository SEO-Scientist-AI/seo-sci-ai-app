"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink,
  ChevronRight,
  BarChart2,
  FileText,
  Link,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const SeoPerformanceSiteAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30");
  const chartRef = useRef<HTMLDivElement>(null);
  const trafficChartRef = useRef<HTMLDivElement>(null);
  const keywordPositionsChartRef = useRef<HTMLDivElement>(null);
  const competitorChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#ef4444'],
                  [0.7, '#f59e0b'],
                  [1, '#22c55e']
                ]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 50,
              offsetCenter: [0, 0],
              formatter: '{value}',
              color: '#6b7280'
            },
            data: [
              {
                value: 67
              }
            ]
          }
        ],
        animation: false
      };
      chart.setOption(option);
      
      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (trafficChartRef.current) {
      const chart = echarts.init(trafficChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Organic Traffic',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: 'hsl(var(--primary))'
            },
            areaStyle: {
              opacity: 0.2,
              color: 'hsl(var(--primary) / 0.2)'
            },
            data: [140, 232, 201, 264, 290, 330, 410]
          }
        ],
        animation: false
      };
      chart.setOption(option);
      
      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (keywordPositionsChartRef.current) {
      const chart = echarts.init(keywordPositionsChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['Top 3 Positions', '4-10 Positions', '11-50 Positions', '51-100 Positions']
        },
        series: [
          {
            name: 'Keywords',
            type: 'bar',
            data: [
              {value: 18, itemStyle: {color: 'hsl(var(--primary) / 0.9)'}},
              {value: 23, itemStyle: {color: 'hsl(var(--primary) / 0.7)'}},
              {value: 35, itemStyle: {color: 'hsl(var(--primary) / 0.5)'}},
              {value: 12, itemStyle: {color: 'hsl(var(--primary) / 0.3)'}}
            ]
          }
        ],
        animation: false
      };
      chart.setOption(option);
      
      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (competitorChartRef.current) {
      const chart = echarts.init(competitorChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Your Site', 'Competitor 1', 'Competitor 2']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Visibility', 'Keywords', 'Traffic', 'Backlinks']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Your Site',
            type: 'bar',
            data: [67, 88, 410, 235],
            itemStyle: {color: 'hsl(var(--primary))'}
          },
          {
            name: 'Competitor 1',
            type: 'bar',
            data: [82, 123, 562, 312],
            itemStyle: {color: '#f59e0b'}
          },
          {
            name: 'Competitor 2',
            type: 'bar',
            data: [43, 65, 289, 167],
            itemStyle: {color: '#10b981'}
          }
        ],
        animation: false
      };
      chart.setOption(option);
      
      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const keywordData = [
    { keyword: "seo analytics dashboard", position: 3, change: 2, volume: 1200, difficulty: "Medium" },
    { keyword: "rank tracking software", position: 5, change: -1, volume: 2400, difficulty: "High" },
    { keyword: "keyword position tracker", position: 2, change: 4, volume: 890, difficulty: "Medium" },
    { keyword: "seo performance metrics", position: 8, change: 1, volume: 760, difficulty: "Medium" },
    { keyword: "competitor seo analysis", position: 4, change: 3, volume: 1500, difficulty: "High" },
  ];

  const competitorData = [
    { name: "SEMrush", visibility: 87, keywords: 12500, traffic: 45600, backlinks: 8700 },
    { name: "Ahrefs", visibility: 82, keywords: 11800, traffic: 42300, backlinks: 9200 },
    { name: "Moz", visibility: 76, keywords: 9500, traffic: 38900, backlinks: 7600 },
  ];

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">{difficulty}</Badge>;
      case "Medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">{difficulty}</Badge>;
      case "High":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">{difficulty}</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getPositionBadge = (position: number) => {
    if (position <= 3) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">{position}</Badge>;
    } else if (position <= 10) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">{position}</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400">{position}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Overall SEO Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Your overall SEO score based on various metrics including content quality, technical SEO, and backlinks.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-24 h-24 mr-4" ref={chartRef}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-green-600">Good</span>
                  <span className="text-sm font-medium">42</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-amber-500">Fair</span>
                  <span className="text-sm font-medium">25</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-red-500">Poor</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">67 is your overall SEO score. This score shows how well your site is optimized based on our scoring system.</p>
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-sm mt-2">
              OPEN REPORT <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Search Impressions
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">The number of times your pages appeared in search results.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3">
                <div className="text-3xl font-bold text-foreground">8,432</div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <span>12.5%</span>
                </div>
              </div>
              <div className="flex-1 h-16">
                <div className="w-full h-full flex items-end">
                  {[35, 45, 38, 52, 48, 65, 58, 56, 72, 68].map((value, index) => (
                    <div
                      key={index}
                      className="bg-primary mx-0.5 rounded-t"
                      style={{ height: `${value}%`, width: '8%' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-sm mt-4">
              OPEN REPORT <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Total Clicks
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">The number of times users clicked through to your site from search results.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3">
                <div className="text-3xl font-bold text-foreground">2,156</div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <span>8.3%</span>
                </div>
              </div>
              <div className="flex-1 h-16">
                <div className="w-full h-full flex items-end">
                  {[25, 30, 28, 35, 32, 42, 38, 40, 45, 43].map((value, index) => (
                    <div
                      key={index}
                      className="bg-green-500 mx-0.5 rounded-t"
                      style={{ height: `${value}%`, width: '8%' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-sm mt-4">
              OPEN REPORT <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Average Position
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">The average position of your site in search results for all tracked keywords.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3">
                <div className="text-3xl font-bold text-foreground">4.2</div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <span>1.5</span>
                </div>
              </div>
              <div className="flex-1 h-16">
                <div className="w-full h-full flex items-end">
                  {[8, 7, 7.5, 6, 6.5, 5, 5.5, 4.5, 4, 4.2].map((value, index) => (
                    <div
                      key={index}
                      className="bg-primary mx-0.5 rounded-t"
                      style={{ height: `${(10-value) * 10}%`, width: '8%' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-sm mt-4">
              OPEN REPORT <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span>Organic Traffic Trend</span>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                  Monthly
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Details</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" ref={trafficChartRef}></div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span>Keyword Positions</span>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                  Distribution
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Details</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" ref={keywordPositionsChartRef}></div>
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Total Keywords: <span className="font-semibold text-foreground">88</span></div>
              <div>Avg. CTR: <span className="font-semibold text-foreground">4.8%</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Section */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Keyword Rankings</span>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>View All Keywords</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Keywords</TabsTrigger>
              <TabsTrigger value="winning">Winning Keywords</TabsTrigger>
              <TabsTrigger value="losing">Losing Keywords</TabsTrigger>
              <TabsTrigger value="tracked">Tracked Keywords</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="overflow-x-auto border rounded-md border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Keyword</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywordData.map((item, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.keyword}</TableCell>
                        <TableCell>
                          {getPositionBadge(item.position)}
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "flex items-center",
                            item.change > 0 ? "text-green-600" : 
                            item.change < 0 ? "text-red-600" : 
                            "text-muted-foreground"
                          )}>
                            {item.change > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> :
                             item.change < 0 ? <TrendingDown className="h-3.5 w-3.5 mr-1" /> :
                             <Minus className="h-3.5 w-3.5 mr-1" />}
                            {Math.abs(item.change)}
                          </span>
                        </TableCell>
                        <TableCell>{item.volume.toLocaleString()}</TableCell>
                        <TableCell>
                          {getDifficultyBadge(item.difficulty)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="sr-only">View analytics</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">Showing 5 of 88 keywords</div>
                <Button variant="outline" className="gap-1.5">
                  View All Keywords <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="winning">
              <div className="p-4 text-center text-muted-foreground border rounded-md border-dashed border-border/50">
                Select "All Keywords" tab to view keyword data
              </div>
            </TabsContent>
            <TabsContent value="losing">
              <div className="p-4 text-center text-muted-foreground border rounded-md border-dashed border-border/50">
                Select "All Keywords" tab to view keyword data
              </div>
            </TabsContent>
            <TabsContent value="tracked">
              <div className="p-4 text-center text-muted-foreground border rounded-md border-dashed border-border/50">
                Select "All Keywords" tab to view keyword data
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Competitor Analysis</span>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Full Comparison</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6" ref={competitorChartRef}></div>
          <div className="border rounded-md border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Competitor</TableHead>
                  <TableHead>Visibility Score</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Est. Traffic</TableHead>
                  <TableHead>Backlinks</TableHead>
                  <TableHead className="text-right">Gap Analysis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitorData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{item.visibility}</span>
                        <div className="w-20 bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${item.visibility}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.keywords.toLocaleString()}</TableCell>
                    <TableCell>{item.traffic.toLocaleString()}</TableCell>
                    <TableCell>{item.backlinks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" /> Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <div>
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Optimize Content</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">5 pages need content optimization to improve rankings</p>
                      <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto text-sm">
                        View Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
                      <Link className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Build Backlinks</h3>
                      <p className="text-sm text-green-700 dark:text-green-400 mb-2">3 high-opportunity keywords need quality backlinks</p>
                      <Button variant="link" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-0 h-auto text-sm">
                        View Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-full mr-3">
                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-orange-800 dark:text-orange-300 mb-1">Fix Technical Issues</h3>
                      <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">8 technical issues affecting your site performance</p>
                      <Button variant="link" className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 p-0 h-auto text-sm">
                        View Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeoPerformanceSiteAnalytics;
