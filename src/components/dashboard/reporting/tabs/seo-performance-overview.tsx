"use client";

import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Search,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  Info,
  ChevronRight,
  FileText,
  Link as LinkIcon,
  AlertTriangle,
  ArrowUpRight,
  Unlink,
  Gauge,
  Image,
  Smartphone,
  Copy,
  TrendingUp,
  BarChart2,
  Tags,
  Cog,
  ExternalLink,
} from "lucide-react";

const SeoPerformanceOverview = () => {
  const [timeRange, setTimeRange] = useState("30");

  // Sample data
  const trafficTrendData = [
    { name: 'Apr 25', organic: 320, direct: 220, referral: 150 },
    { name: 'Apr 26', organic: 332, direct: 182, referral: 232 },
    { name: 'Apr 27', organic: 301, direct: 191, referral: 201 },
    { name: 'Apr 28', organic: 334, direct: 234, referral: 154 },
    { name: 'Apr 29', organic: 390, direct: 290, referral: 190 },
    { name: 'Apr 30', organic: 330, direct: 330, referral: 230 },
    { name: 'May 1', organic: 350, direct: 310, referral: 210 },
    { name: 'May 2', organic: 410, direct: 285, referral: 195 }
  ];

  const keywordDistributionData = [
    { name: 'Top 3 Positions', value: 22, color: '#3b82f6' },
    { name: '4-10 Positions', value: 35, color: '#60a5fa' },
    { name: '11-20 Positions', value: 28, color: '#93c5fd' },
    { name: '21-50 Positions', value: 42, color: '#bfdbfe' },
    { name: '51-100 Positions', value: 18, color: '#dbeafe' }
  ];

  const trafficSourcesData = [
    { name: 'Organic Search', value: 65, color: '#3b82f6' },
    { name: 'Direct', value: 15, color: '#10b981' },
    { name: 'Referral', value: 10, color: '#f59e0b' },
    { name: 'Social', value: 8, color: '#8b5cf6' },
    { name: 'Other', value: 2, color: '#6b7280' }
  ];

  const deviceBreakdownData = [
    { name: 'Mobile', value: 52, color: '#3b82f6' },
    { name: 'Desktop', value: 38, color: '#10b981' },
    { name: 'Tablet', value: 10, color: '#f59e0b' }
  ];

  const pagePerformanceData = [
    { name: 'Home', impressions: 820, clicks: 320, ctr: 3.9 },
    { name: 'Blog', impressions: 932, clicks: 332, ctr: 3.6 },
    { name: 'Products', impressions: 901, clicks: 301, ctr: 3.3 },
    { name: 'About', impressions: 634, clicks: 334, ctr: 5.3 },
    { name: 'Contact', impressions: 590, clicks: 290, ctr: 4.9 }
  ];

  const keywordData = [
    { keyword: "seo dashboard", position: 2, change: 3, volume: 2800, difficulty: "Medium", ctr: 5.2 },
    { keyword: "rank tracking software", position: 4, change: 1, volume: 3500, difficulty: "High", ctr: 4.1 },
    { keyword: "keyword position tracker", position: 1, change: 4, volume: 1200, difficulty: "Medium", ctr: 8.3 },
    { keyword: "seo performance metrics", position: 5, change: -1, volume: 980, difficulty: "Medium", ctr: 3.7 },
    { keyword: "competitor seo analysis", position: 3, change: 2, volume: 1700, difficulty: "High", ctr: 4.8 },
    { keyword: "seo analytics tools", position: 7, change: -2, volume: 2300, difficulty: "Medium", ctr: 2.9 },
  ];

  const recentActivityData = [
    { type: "Ranking Change", description: "Keyword 'seo dashboard' moved up 3 positions to #2", date: "May 2, 2025", icon: "ArrowUp", color: "text-green-600", bgColor: "bg-green-100" },
    { type: "New Backlink", description: "New backlink from domain.com (DA: 65)", date: "May 1, 2025", icon: "LinkIcon", color: "text-blue-600", bgColor: "bg-blue-100" },
    { type: "Technical Issue", description: "3 pages with missing meta descriptions detected", date: "Apr 30, 2025", icon: "AlertTriangle", color: "text-orange-600", bgColor: "bg-orange-100" },
    { type: "Content Update", description: "Blog post 'SEO Best Practices' updated", date: "Apr 29, 2025", icon: "FileText", color: "text-purple-600", bgColor: "bg-purple-100" },
    { type: "Ranking Change", description: "Keyword 'seo analytics tools' dropped 2 positions to #7", date: "Apr 28, 2025", icon: "ArrowDown", color: "text-red-600", bgColor: "bg-red-100" },
  ];

  const actionItemsData = [
    { title: "Optimize Meta Descriptions", description: "8 pages are missing optimized meta descriptions", priority: "High", icon: "FileText", color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Fix Broken Links", description: "12 broken links found across your website", priority: "Medium", icon: "Unlink", color: "text-orange-600", bgColor: "bg-orange-100" },
    { title: "Improve Page Speed", description: "3 pages have poor loading performance", priority: "High", icon: "Gauge", color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Add Alt Text to Images", description: "24 images missing alt text attributes", priority: "Medium", icon: "Image", color: "text-orange-600", bgColor: "bg-orange-100" },
    { title: "Mobile Optimization", description: "5 pages not properly optimized for mobile", priority: "High", icon: "Smartphone", color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Keyword Cannibalization", description: "2 pages competing for same keywords", priority: "Low", icon: "Copy", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  ];

  const renderIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      "ArrowUp": <ArrowUp className="h-4 w-4" />,
      "ArrowDown": <ArrowDown className="h-4 w-4" />,
      "LinkIcon": <LinkIcon className="h-4 w-4" />,
      "AlertTriangle": <AlertTriangle className="h-4 w-4" />,
      "FileText": <FileText className="h-4 w-4" />,
      "Unlink": <Unlink className="h-4 w-4" />,
      "Gauge": <Gauge className="h-4 w-4" />,
      "Image": <Image className="h-4 w-4" />,
      "Smartphone": <Smartphone className="h-4 w-4" />,
      "Copy": <Copy className="h-4 w-4" />,
    };
    
    return icons[iconName] || <Info className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Overall SEO Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" />
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
              <div className="w-24 h-24 mr-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">78</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 78 }, { value: 22 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#48bb78" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-green-600">Good</span>
                  <span className="text-sm font-medium">52</span>
                </div>
                <Progress value={52} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-orange-500">Fair</span>
                  <span className="text-sm font-medium">18</span>
                </div>
                <Progress value={18} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-red-500">Poor</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <Progress value={8} className="h-1.5 mb-2" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">78 is your overall SEO score. This score shows how well your site is optimized based on our scoring system.</p>
            <Button variant="link" className="p-0 h-auto text-sm mt-2">
              VIEW DETAILED REPORT <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Organic Traffic
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">The number of visitors coming to your site from search engines.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3">
                <div className="text-3xl font-bold">10,482</div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>15.2%</span>
                </div>
              </div>
              <div className="flex-1 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[35, 45, 38, 52, 48, 65, 58, 56, 72, 68].map((value, index) => ({ name: index, value }))}>
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
              <div>vs. previous period</div>
              <div>+1,385 visitors</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Keyword Rankings
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Summary of your keyword positions in search results.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium">Top 3 Positions</div>
              <div className="text-xs font-medium">22</div>
            </div>
            <Progress value={22} className="h-1.5 mb-3" />
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium">Positions 4-10</div>
              <div className="text-xs font-medium">35</div>
            </div>
            <Progress value={35} className="h-1.5 mb-3" />
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium">Positions 11-50</div>
              <div className="text-xs font-medium">70</div>
            </div>
            <Progress value={70} className="h-1.5 mb-3" />
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium">Total Keywords</div>
              <div className="text-xs font-medium">145</div>
            </div>
            <div className="flex items-center text-green-600 text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>12 new keywords ranking</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Backlink Profile
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">Overview of your website's backlink profile quality and quantity.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Total Backlinks</div>
                <div className="text-xl font-bold">1,245</div>
                <div className="flex items-center text-green-600 text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>32 new</span>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Referring Domains</div>
                <div className="text-xl font-bold">287</div>
                <div className="flex items-center text-green-600 text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>8 new</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium">Domain Authority</div>
              <div className="text-xs font-medium">42/100</div>
            </div>
            <Progress value={42} className="h-1.5 mb-3" />
            <Button variant="link" className="p-0 h-auto text-sm mt-1">
              VIEW BACKLINK REPORT <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Traffic Trends */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/40">
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>Showing data for the last {timeRange} days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="organic" name="Organic Traffic" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="direct" name="Direct Traffic" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="referral" name="Referral Traffic" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-border/40">
              <CardHeader>
                <CardTitle>Keyword Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={keywordDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <RechartsTooltip />
                      <Bar dataKey="value" name="Keywords">
                        {keywordDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/40">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficSourcesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {trafficSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-border/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Performing Keywords</CardTitle>
                <CardDescription>Keywords with the highest traffic and rankings</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywordData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.keyword}</TableCell>
                        <TableCell>
                          <Badge variant={item.position <= 3 ? "default" : item.position <= 10 ? "secondary" : "outline"} className={item.position <= 3 ? "bg-green-100 text-green-800 hover:bg-green-100" : item.position <= 10 ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}>
                            {item.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-muted-foreground"}>
                            {item.change > 0 ? <ArrowUp className="h-3 w-3 inline mr-1" /> :
                              item.change < 0 ? <ArrowDown className="h-3 w-3 inline mr-1" /> : "—"}
                            {Math.abs(item.change)}
                          </span>
                        </TableCell>
                        <TableCell>{item.volume.toLocaleString()}</TableCell>
                        <TableCell>{item.ctr}%</TableCell>
                        <TableCell>
                          <Badge variant={item.difficulty === "Low" ? "default" : item.difficulty === "Medium" ? "secondary" : "outline"} className={`${item.difficulty === "Low" ? "bg-green-100 text-green-800 hover:bg-green-100" : item.difficulty === "Medium" ? "bg-orange-100 text-orange-800 hover:bg-orange-100" : "bg-red-100 text-red-800 hover:bg-red-100"}`}>
                            {item.difficulty}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">Showing 6 of 145 keywords</div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  View All Keywords <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Actions */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/40">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Impressions</div>
                    <div className="text-sm font-medium">12,456</div>
                  </div>
                  <Progress value={65} className="h-1.5 mb-1" />
                  <div className="flex items-center text-green-600 text-xs">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>18.5% vs. previous period</span>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Click-Through Rate</div>
                    <div className="text-sm font-medium">4.2%</div>
                  </div>
                  <Progress value={42} className="h-1.5 mb-1" />
                  <div className="flex items-center text-green-600 text-xs">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>0.8% vs. previous period</span>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Conversion Rate</div>
                    <div className="text-sm font-medium">2.8%</div>
                  </div>
                  <Progress value={28} className="h-1.5 mb-1" />
                  <div className="flex items-center text-green-600 text-xs">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>0.3% vs. previous period</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Device Breakdown</div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {deviceBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/40">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivityData.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`rounded-full p-2 ${item.bgColor} mr-3`}>
                      {renderIcon(item.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium text-sm">{item.type}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="p-0 h-auto text-sm mt-4 w-full">
                VIEW ALL ACTIVITY <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/40">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="flex items-center justify-center h-auto py-3 gap-1.5">
                  <BarChart2 className="h-4 w-4" />
                  Analytics
                </Button>
                <Button className="flex items-center justify-center h-auto py-3 gap-1.5">
                  <Tags className="h-4 w-4" />
                  Keywords
                </Button>
                <Button className="flex items-center justify-center h-auto py-3 gap-1.5">
                  <LinkIcon className="h-4 w-4" />
                  Backlinks
                </Button>
                <Button className="flex items-center justify-center h-auto py-3 gap-1.5">
                  <Cog className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Items Section */}
      <div>
        <Card className="shadow-sm border-border/40">
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Issues that need your attention to improve SEO performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actionItemsData.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 shadow-sm border-border/40">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${item.bgColor} ${item.color}`}>
                        {renderIcon(item.icon)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"} className={`ml-2 ${item.priority === "Medium" ? "bg-orange-100 text-orange-800 hover:bg-orange-100" : item.priority === "Low" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}`}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Fix Issue <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Performance */}
      <Card className="shadow-sm border-border/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Page Performance</CardTitle>
            <CardDescription>How your top pages are performing in search results</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pagePerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="impressions" name="Impressions" fill="#3b82f6" />
                <Bar yAxisId="left" dataKey="clicks" name="Clicks" fill="#10b981" />
                <Line yAxisId="right" type="monotone" dataKey="ctr" name="CTR (%)" stroke="#f59e0b" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View Detailed Page Analytics <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoPerformanceOverview;
