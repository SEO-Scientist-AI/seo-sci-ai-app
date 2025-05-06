"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Search,
  Plus,
  Download,
  RefreshCw,
  Filter,
  Bell,
  Cog,
  ExternalLink,
  Info,
  HelpCircle,
  Trash2,
  LineChart as LineChartIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for the component
const positionHistoryData = [
  { date: 'Apr 2', position: 5 },
  { date: 'Apr 9', position: 4 },
  { date: 'Apr 16', position: 4.5 },
  { date: 'Apr 23', position: 3.8 },
  { date: 'Apr 30', position: 3.2 },
  { date: 'May 1', position: 3 },
  { date: 'May 2', position: 2.8 },
];

const positionDistributionData = [
  { name: 'Top 3', value: 32, color: '#10b981' },
  { name: 'Positions 4-10', value: 45, color: '#3b82f6' },
  { name: 'Positions 11-50', value: 18, color: '#f59e0b' },
  { name: 'Positions 51-100', value: 5, color: '#ef4444' },
];

const rankingChangeData = [
  { date: 'Apr 2', improved: 12, declined: 8, noChange: 5 },
  { date: 'Apr 9', improved: 15, declined: 10, noChange: 4 },
  { date: 'Apr 16', improved: 18, declined: 7, noChange: 6 },
  { date: 'Apr 23', improved: 14, declined: 11, noChange: 3 },
  { date: 'Apr 30', improved: 22, declined: 8, noChange: 5 },
  { date: 'May 1', improved: 19, declined: 6, noChange: 7 },
  { date: 'May 2', improved: 23, declined: 9, noChange: 4 },
];

const keywordData = [
  { id: 1, keyword: "rank tracking software", url: "/rank-tracker", position: 3, change: 2, previousPosition: 5, searchVolume: 5200, difficulty: "High", ctr: 4.8, searchEngine: "Google", device: "Desktop" },
  { id: 2, keyword: "keyword position tracker", url: "/keyword-tracker", position: 5, change: -1, previousPosition: 4, searchVolume: 3800, difficulty: "Medium", ctr: 3.2, searchEngine: "Google", device: "Mobile" },
  { id: 3, keyword: "seo rank tracking tool", url: "/seo-tools", position: 2, change: 4, previousPosition: 6, searchVolume: 2900, difficulty: "Medium", ctr: 6.7, searchEngine: "Google", device: "Desktop" },
  { id: 4, keyword: "serp position monitor", url: "/serp-monitor", position: 8, change: 1, previousPosition: 9, searchVolume: 1800, difficulty: "Low", ctr: 2.1, searchEngine: "Google", device: "Mobile" },
  { id: 5, keyword: "track google rankings", url: "/google-tracker", position: 4, change: 3, previousPosition: 7, searchVolume: 4500, difficulty: "High", ctr: 4.3, searchEngine: "Google", device: "Desktop" },
];

const RankTrackerTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30");
  const [searchEngine, setSearchEngine] = useState("google");
  const [device, setDevice] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState("");
  
  const filteredKeywords = keywordData.filter(item =>
    item.keyword.toLowerCase().includes(keywordFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search keywords"
            className="pl-9 pr-4 w-full sm:w-[280px]"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Keywords
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <Download className="h-4 w-4" /> Export <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Tracked Keywords
              <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-3xl font-bold">88</div>
                <div className="flex items-center text-emerald-600 text-sm">
                  <ArrowUp className="h-3.5 w-3.5 mr-1" />
                  <span>12 new</span>
                </div>
              </div>
              <div className="h-16 flex items-end gap-[3px]">
                {[35, 42, 38, 45, 52, 58, 65, 72, 78, 88].map((value, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${value}%`, width: '8px' }}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Average Position
              <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-3xl font-bold">4.2</div>
                <div className="flex items-center text-emerald-600 text-sm">
                  <ArrowUp className="h-3.5 w-3.5 mr-1" />
                  <span>+1.5</span>
                </div>
              </div>
              <div className="h-16 flex items-end gap-[3px]">
                {[8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4.2, 4].map((value, index) => (
                  <div
                    key={index}
                    className="bg-emerald-500 rounded-t"
                    style={{ height: `${(10-value) * 10}%`, width: '8px' }}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Top 10 Positions
              <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <div className="text-3xl font-bold">32</div>
                <div className="flex items-center text-emerald-600 text-sm">
                  <ArrowUp className="h-3.5 w-3.5 mr-1" />
                  <span>+5</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold">18</div>
                <div className="text-xs text-muted-foreground">Top 3</div>
              </div>
              <div>
                <div className="text-lg font-semibold">14</div>
                <div className="text-xs text-muted-foreground">4-10</div>
              </div>
              <div>
                <div className="text-lg font-semibold">56</div>
                <div className="text-xs text-muted-foreground">11+</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              Position Changes
              <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-emerald-600 dark:text-emerald-500">23</div>
                <div className="text-xs text-muted-foreground">Improved</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-red-600 dark:text-red-500">9</div>
                <div className="text-xs text-muted-foreground">Declined</div>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-muted-foreground">4</div>
                <div className="text-xs text-muted-foreground">No Change</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Net Change</span>
              <span className="text-emerald-600 font-medium">+14 positions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Position History</CardTitle>
            <CardDescription>Average position over time for all tracked keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={positionHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis 
                    stroke="#94a3b8" 
                    domain={[1, 10]} 
                    reversed={true} 
                    label={{ value: 'Position', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="position" 
                    name="Average Position" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }} 
                    dot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Distribution</CardTitle>
            <CardDescription>How your keywords are distributed across ranking positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={positionDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive={false}
                  >
                    {positionDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} keywords`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Position Changes</CardTitle>
          <CardDescription>Number of keywords that improved, declined, or remained unchanged</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingChangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="improved" name="Improved" stackId="a" fill="#10b981" isAnimationActive={false} />
                <Bar dataKey="declined" name="Declined" stackId="a" fill="#ef4444" isAnimationActive={false} />
                <Bar dataKey="noChange" name="No Change" stackId="a" fill="#94a3b8" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tracked Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Keywords</TabsTrigger>
              <TabsTrigger value="improved">Improved</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
              <TabsTrigger value="top10">Top 10</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeywords.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.keyword}</TableCell>
                        <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">{item.url}</TableCell>
                        <TableCell>
                          <Badge variant={item.position <= 3 ? "default" : item.position <= 10 ? "secondary" : "outline"}>
                            {item.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={item.change > 0 ? "text-emerald-600 flex items-center" : 
                                          item.change < 0 ? "text-red-600 flex items-center" : 
                                          "text-muted-foreground flex items-center"}>
                            {item.change > 0 ? <ArrowUp className="h-3.5 w-3.5 mr-1" /> :
                             item.change < 0 ? <ArrowDown className="h-3.5 w-3.5 mr-1" /> : "-"}
                            {Math.abs(item.change)}
                          </span>
                        </TableCell>
                        <TableCell>{item.searchVolume.toLocaleString()}</TableCell>
                        <TableCell>{item.ctr}%</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.device}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Bell className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">Showing {filteredKeywords.length} of {keywordData.length} keywords</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="improved">
              <div className="flex items-center justify-center h-40 text-center text-muted-foreground">
                Filter view for improved keywords will appear here
              </div>
            </TabsContent>
            
            <TabsContent value="declined">
              <div className="flex items-center justify-center h-40 text-center text-muted-foreground">
                Filter view for declined keywords will appear here
              </div>
            </TabsContent>
            
            <TabsContent value="top10">
              <div className="flex items-center justify-center h-40 text-center text-muted-foreground">
                Filter view for top 10 ranking keywords will appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankTrackerTab; 