// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Info, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Filter, 
  Bell, 
  Trash2, 
  Settings, 
  LineChart, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText, 
  Search, 
  Monitor, 
  Smartphone, 
  Minus, 
  ChevronDown,
  FileOutput,
  RefreshCw,
  Share2,
  Tag,
  Link2 as Link
} from "lucide-react";

const SeoPerformanceRankTracker: React.FC = () => {
const [timeRange, setTimeRange] = useState("30");
const [searchEngine, setSearchEngine] = useState("google");
const [device, setDevice] = useState("all");
const [alertsEnabled, setAlertsEnabled] = useState(false);
const [showAddKeyword, setShowAddKeyword] = useState(false);
const [keywordFilter, setKeywordFilter] = useState("");
const positionHistoryChartRef = useRef<HTMLDivElement>(null);
const positionDistributionChartRef = useRef<HTMLDivElement>(null);
const rankingChangeChartRef = useRef<HTMLDivElement>(null);
const searchEngineComparisonChartRef = useRef<HTMLDivElement>(null);
const keywordData = [
{ id: 1, keyword: "rank tracking software", url: "/rank-tracker", position: 3, change: 2, previousPosition: 5, searchVolume: 5200, difficulty: "High", ctr: 4.8, searchEngine: "Google", device: "Desktop" },
{ id: 2, keyword: "keyword position tracker", url: "/keyword-tracker", position: 5, change: -1, previousPosition: 4, searchVolume: 3800, difficulty: "Medium", ctr: 3.2, searchEngine: "Google", device: "Mobile" },
{ id: 3, keyword: "seo rank tracking tool", url: "/seo-tools", position: 2, change: 4, previousPosition: 6, searchVolume: 2900, difficulty: "Medium", ctr: 6.7, searchEngine: "Google", device: "Desktop" },
{ id: 4, keyword: "serp position monitor", url: "/serp-monitor", position: 8, change: 1, previousPosition: 9, searchVolume: 1800, difficulty: "Low", ctr: 2.1, searchEngine: "Google", device: "Mobile" },
{ id: 5, keyword: "track google rankings", url: "/google-tracker", position: 4, change: 3, previousPosition: 7, searchVolume: 4500, difficulty: "High", ctr: 4.3, searchEngine: "Google", device: "Desktop" },
{ id: 6, keyword: "keyword ranking software", url: "/ranking-software", position: 7, change: -2, previousPosition: 5, searchVolume: 3200, difficulty: "Medium", ctr: 2.8, searchEngine: "Google", device: "Desktop" },
{ id: 7, keyword: "seo position tracker", url: "/seo-tracker", position: 1, change: 1, previousPosition: 2, searchVolume: 2600, difficulty: "High", ctr: 8.9, searchEngine: "Google", device: "Mobile" },
{ id: 8, keyword: "rank tracking dashboard", url: "/dashboard", position: 6, change: 0, previousPosition: 6, searchVolume: 1900, difficulty: "Medium", ctr: 3.1, searchEngine: "Google", device: "Desktop" },
{ id: 9, keyword: "keyword ranking tool", url: "/ranking-tool", position: 9, change: -3, previousPosition: 6, searchVolume: 4100, difficulty: "High", ctr: 1.8, searchEngine: "Google", device: "Mobile" },
{ id: 10, keyword: "serp tracker", url: "/serp-tracker", position: 3, change: 5, previousPosition: 8, searchVolume: 5800, difficulty: "Medium", ctr: 5.2, searchEngine: "Google", device: "Desktop" },
];
const filteredKeywords = keywordData.filter(item =>
item.keyword.toLowerCase().includes(keywordFilter.toLowerCase())
);
useEffect(() => {
if (positionHistoryChartRef.current) {
const chart = echarts.init(positionHistoryChartRef.current);
const option = {
tooltip: {
trigger: 'axis',
formatter: function(params: any) {
return `${params[0].axisValue}<br/>${params[0].marker} Position: ${params[0].data}`;
}
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
data: ['Apr 2', 'Apr 9', 'Apr 16', 'Apr 23', 'Apr 30', 'May 1', 'May 2']
},
yAxis: {
type: 'value',
inverse: true,
min: 1,
max: 10,
interval: 1,
name: 'Position',
nameLocation: 'middle',
nameGap: 40,
axisLabel: {
formatter: '{value}'
}
},
series: [
{
name: 'Average Position',
type: 'line',
smooth: true,
lineStyle: {
width: 3,
color: '#3b82f6'
},
itemStyle: {
color: '#3b82f6'
},
areaStyle: {
opacity: 0.2,
color: '#3b82f6'
},
data: [5, 4, 4.5, 3.8, 3.2, 3, 2.8]
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
if (positionDistributionChartRef.current) {
const chart = echarts.init(positionDistributionChartRef.current);
const option = {
tooltip: {
trigger: 'item',
formatter: '{b}: {c} ({d}%)'
},
legend: {
orient: 'vertical',
right: 10,
top: 'center',
data: ['Top 3', 'Positions 4-10', 'Positions 11-50', 'Positions 51-100']
},
series: [
{
name: 'Position Distribution',
type: 'pie',
radius: ['50%', '70%'],
avoidLabelOverlap: false,
itemStyle: {
borderRadius: 10,
borderColor: '#fff',
borderWidth: 2
},
label: {
show: false,
position: 'center'
},
emphasis: {
label: {
show: true,
fontSize: '18',
fontWeight: 'bold'
}
},
labelLine: {
show: false
},
data: [
{ value: 32, name: 'Top 3', itemStyle: { color: '#22c55e' } },
{ value: 45, name: 'Positions 4-10', itemStyle: { color: '#3b82f6' } },
{ value: 18, name: 'Positions 11-50', itemStyle: { color: '#f59e0b' } },
{ value: 5, name: 'Positions 51-100', itemStyle: { color: '#ef4444' } }
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
if (rankingChangeChartRef.current) {
const chart = echarts.init(rankingChangeChartRef.current);
const option = {
tooltip: {
trigger: 'axis',
axisPointer: {
type: 'shadow'
}
},
legend: {
data: ['Improved', 'Declined', 'No Change']
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis: [
{
type: 'category',
data: ['Apr 2', 'Apr 9', 'Apr 16', 'Apr 23', 'Apr 30', 'May 1', 'May 2']
}
],
yAxis: [
{
type: 'value',
name: 'Keywords',
nameLocation: 'middle',
nameGap: 40
}
],
series: [
{
name: 'Improved',
type: 'bar',
stack: 'total',
emphasis: {
focus: 'series'
},
itemStyle: {
color: '#22c55e'
},
data: [12, 15, 18, 14, 22, 19, 23]
},
{
name: 'Declined',
type: 'bar',
stack: 'total',
emphasis: {
focus: 'series'
},
itemStyle: {
color: '#ef4444'
},
data: [8, 10, 7, 11, 8, 6, 9]
},
{
name: 'No Change',
type: 'bar',
stack: 'total',
emphasis: {
focus: 'series'
},
itemStyle: {
color: '#94a3b8'
},
data: [5, 4, 6, 3, 5, 7, 4]
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
if (searchEngineComparisonChartRef.current) {
const chart = echarts.init(searchEngineComparisonChartRef.current);
const option = {
tooltip: {
trigger: 'axis',
axisPointer: {
type: 'shadow'
}
},
legend: {
data: ['Google', 'Bing', 'Yahoo']
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis: {
type: 'value',
boundaryGap: [0, 0.01],
inverse: true,
min: 1,
max: 10
},
yAxis: {
type: 'category',
data: ['rank tracking software', 'keyword position tracker', 'seo rank tracking tool', 'serp position monitor', 'track google rankings']
},
series: [
{
name: 'Google',
type: 'bar',
data: [3, 5, 2, 8, 4],
itemStyle: {
color: '#3b82f6'
}
},
{
name: 'Bing',
type: 'bar',
data: [4, 6, 3, 7, 5],
itemStyle: {
color: '#22c55e'
}
},
{
name: 'Yahoo',
type: 'bar',
data: [5, 7, 4, 9, 6],
itemStyle: {
color: '#f59e0b'
}
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
return (
<div className="rounded-lg">
  {/* Main Content */}
  <main className="container mx-auto px-4 py-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Rank Tracker</h2>
        <p className="text-muted-foreground mt-1">Monitor your keyword positions across search engines</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search keywords"
            className="pl-10 pr-4 py-2 border rounded-md w-64 text-sm"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="90">90 Days</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add Keywords
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Keywords to Track</DialogTitle>
              <DialogDescription>
                Enter keywords you want to track rankings for
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <Label htmlFor="keywords" className="text-sm font-medium">Keywords</Label>
                <div className="mt-1">
                  <textarea
                    id="keywords"
                    rows={5}
                    className="w-full border-input rounded-md shadow-sm focus:border-primary focus:ring-primary text-sm p-2 border"
                    placeholder="Enter one keyword per line"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Maximum 10 keywords at once</p>
              </div>
              <div className="mb-4">
                <Label htmlFor="url" className="text-sm font-medium">Target URL (optional)</Label>
                <div className="mt-1">
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://example.com/page"
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="search-engine" className="text-sm font-medium">Search Engine</Label>
                  <Select defaultValue="google">
                    <SelectTrigger id="search-engine" className="w-full mt-1">
                      <SelectValue placeholder="Select Search Engine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="bing">Bing</SelectItem>
                      <SelectItem value="yahoo">Yahoo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="device" className="text-sm font-medium">Device</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="device" className="w-full mt-1">
                      <SelectValue placeholder="Select Device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Keywords</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <FileOutput className="mr-2 h-4 w-4" /> Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileOutput className="mr-2 h-4 w-4" /> Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            Tracked Keywords
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-2 text-gray-400 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Total number of keywords you are currently tracking.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-3xl font-bold text-gray-800">88</div>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>12 new</span>
              </div>
            </div>
            <div className="flex-1 h-16">
              <div className="w-full h-full flex items-end">
                {[35, 42, 38, 45, 52, 58, 65, 72, 78, 88].map((value, index) => (
                <div
                  key={index}
                  className="bg-blue-500 mx-0.5 rounded-t"
                  style={{ height: `${value}%`, width: '8%' }}
                ></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            Average Position
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-2 text-gray-400 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">The average position of all your tracked keywords.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-3xl font-bold text-gray-800">4.2</div>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>1.5</span>
              </div>
            </div>
            <div className="flex-1 h-16">
              <div className="w-full h-full flex items-end">
                {[8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4.2, 4].map((value, index) => (
                <div
                  key={index}
                  className="bg-green-500 mx-0.5 rounded-t"
                  style={{ height: `${(10-value) * 10}%`, width: '8%' }}
                ></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            Top 10 Positions
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-2 text-gray-400 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Number of keywords ranking in the top 10 positions.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-3xl font-bold text-gray-800">32</div>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>5</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '36%' }}></div>
              </div>
              <div className="text-xs text-gray-500">36% of all keywords</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">18</div>
              <div className="text-xs text-gray-500">Top 3</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">14</div>
              <div className="text-xs text-gray-500">4-10</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">56</div>
              <div className="text-xs text-gray-500">11+</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
            Position Changes
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-2 text-gray-400 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Summary of keyword position changes in the selected time period.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-semibold text-green-600">23</div>
              <div className="text-xs text-gray-600">Improved</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xl font-semibold text-red-600">9</div>
              <div className="text-xs text-gray-600">Declined</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-semibold text-gray-600">4</div>
              <div className="text-xs text-gray-600">No Change</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Net Change</span>
            <span className="text-green-600 font-medium">+14 positions</span>
          </div>
        </CardContent>
      </Card>
    </div>
    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Position History</CardTitle>
          <CardDescription>Average position over time for all tracked keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80" ref={positionHistoryChartRef}></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Position Distribution</CardTitle>
          <CardDescription>How your keywords are distributed across ranking positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80" ref={positionDistributionChartRef}></div>
        </CardContent>
      </Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Daily Position Changes</CardTitle>
          <CardDescription>Number of keywords that improved, declined, or remained unchanged</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80" ref={rankingChangeChartRef}></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Search Engine Comparison</CardTitle>
          <CardDescription>Compare rankings across different search engines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="google" className="rounded text-blue-600" checked />
              <label htmlFor="google" className="text-sm">Google</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="bing" className="rounded text-blue-600" checked />
              <label htmlFor="bing" className="text-sm">Bing</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="yahoo" className="rounded text-blue-600" checked />
              <label htmlFor="yahoo" className="text-sm">Yahoo</label>
            </div>
          </div>
          <div className="h-80" ref={searchEngineComparisonChartRef}></div>
        </CardContent>
      </Card>
    </div>
    {/* Filters and Controls */}
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Keyword Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Position Range</Label>
            <div className="px-2">
              <Slider defaultValue={[1, 50]} min={1} max={100} step={1} className="my-6" />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Search Engine</Label>
            <Select value={searchEngine} onValueChange={setSearchEngine}>
              <SelectTrigger className="w-full !rounded-button whitespace-nowrap">
                <SelectValue placeholder="Select Search Engine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
                <SelectItem value="yahoo">Yahoo</SelectItem>
                <SelectItem value="all">All Search Engines</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Device</Label>
            <Select value={device} onValueChange={setDevice}>
              <SelectTrigger className="w-full !rounded-button whitespace-nowrap">
                <SelectValue placeholder="Select Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-sm cursor-pointer !rounded-button whitespace-nowrap">
              <Filter className="mr-2 h-3 w-3" /> Apply Filters
            </Button>
            <Button variant="ghost" className="text-sm text-gray-500 cursor-pointer !rounded-button whitespace-nowrap">Reset Filters</Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="alerts" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              <Label htmlFor="alerts" className="text-sm">Position Alerts</Label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-sm cursor-pointer !rounded-button whitespace-nowrap">
                  <Bell className="mr-2 h-3 w-3" /> Configure Alerts
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Position Alert Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-threshold" className="text-sm">Alert Threshold</Label>
                      <span className="text-sm font-medium">±3 positions</span>
                    </div>
                    <Slider id="alert-threshold" defaultValue={[3]} min={1} max={10} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Notification Method</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-alerts" className="rounded text-blue-600" checked />
                      <label htmlFor="email-alerts" className="text-sm">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="dashboard-alerts" className="rounded text-blue-600" checked />
                      <label htmlFor="dashboard-alerts" className="text-sm">Dashboard</label>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer !rounded-button whitespace-nowrap">Save Alert Settings</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
    {/* Keywords Table */}
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Tracked Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="!rounded-button whitespace-nowrap">All Keywords</TabsTrigger>
            <TabsTrigger value="improved" className="!rounded-button whitespace-nowrap">Improved</TabsTrigger>
            <TabsTrigger value="declined" className="!rounded-button whitespace-nowrap">Declined</TabsTrigger>
            <TabsTrigger value="top10" className="!rounded-button whitespace-nowrap">Top 10</TabsTrigger>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeywords.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.keyword}</TableCell>
                    <TableCell className="text-sm text-gray-500 truncate max-w-[150px]">{item.url}</TableCell>
                    <TableCell>
                      <Badge variant={item.position <= 3 ? "outline" : item.position <= 10 ? "default" : "secondary"}>
                        {item.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-gray-500"}>
                        {item.change > 0 ? <ArrowUp className="mr-1 h-3 w-3 inline" /> :
                        item.change < 0 ? <ArrowDown className="mr-1 h-3 w-3 inline" /> :
                        <Minus className="mr-1 h-3 w-3 inline" />}
                        {Math.abs(item.change)}
                      </span>
                    </TableCell>
                    <TableCell>{item.searchVolume.toLocaleString()}</TableCell>
                    <TableCell>{item.ctr}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100">
                        {item.device === "Desktop" ? <Monitor className="mr-1 h-3 w-3 inline" /> : <Smartphone className="mr-1 h-3 w-3 inline" />}
                        {item.device}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 cursor-pointer !rounded-button whitespace-nowrap">
                                <LineChart className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View History</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 cursor-pointer !rounded-button whitespace-nowrap">
                                <Bell className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Set Alert</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 cursor-pointer !rounded-button whitespace-nowrap">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove Keyword</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">Showing {filteredKeywords.length} of {keywordData.length} keywords</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled className="cursor-pointer !rounded-button whitespace-nowrap">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">1</Button>
                <Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">2</Button>
                <Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">3</Button>
                <Button variant="outline" size="sm" className="cursor-pointer !rounded-button whitespace-nowrap">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="improved">
            <div className="p-4 text-center text-gray-500">
              Select "All Keywords" tab to view all keyword data
            </div>
          </TabsContent>
          <TabsContent value="declined">
            <div className="p-4 text-center text-gray-500">
              Select "All Keywords" tab to view all keyword data
            </div>
          </TabsContent>
          <TabsContent value="top10">
            <div className="p-4 text-center text-gray-500">
              Select "All Keywords" tab to view all keyword data
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    {/* Keyword Detail Modal */}
    <Dialog>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Keyword Detail: rank tracking software</DialogTitle>
          <DialogDescription>
            Detailed performance metrics and history for this keyword
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Current Position</div>
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-green-600 mt-1">
                <ArrowUp className="mr-1 h-3 w-3 inline" /> Improved by 2
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Search Volume</div>
              <div className="text-3xl font-bold">5,200</div>
              <div className="text-sm text-gray-500 mt-1">
                Monthly searches
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Estimated Traffic</div>
              <div className="text-3xl font-bold text-green-600">249</div>
              <div className="text-sm text-gray-500 mt-1">
                Based on 4.8% CTR
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-2">Position History</h4>
          <div className="h-64 w-full bg-white rounded-lg p-2">
            {/* Chart would go here */}
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <span>Position history chart would display here</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium mb-2">SERP Features</h4>
            <div className="bg-white rounded-lg border p-3 h-40">
              <div className="flex items-center mb-2">
                <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Featured Snippet</Badge>
                <span className="text-sm text-gray-500">Your site appears in position 3</span>
              </div>
              <div className="flex items-center mb-2">
                <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">People Also Ask</Badge>
                <span className="text-sm text-gray-500">Present in SERP</span>
              </div>
              <div className="flex items-center">
                <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-100">Related Searches</Badge>
                <span className="text-sm text-gray-500">Present in SERP</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Competitor Rankings</h4>
            <div className="bg-white rounded-lg border p-3 h-40">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SEMrush</span>
                  <Badge>1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ahrefs</span>
                  <Badge>2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">Your Site</span>
                  <Badge>3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Moz</span>
                  <Badge>4</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" className="cursor-pointer !rounded-button whitespace-nowrap">
            <Settings className="mr-2 h-4 w-4" /> Set Custom Alert
          </Button>
          <div>
            <Button variant="outline" className="mr-2 cursor-pointer !rounded-button whitespace-nowrap">Close</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer !rounded-button whitespace-nowrap">
              <ExternalLink className="mr-2 h-4 w-4" /> View in SERP
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    {/* Alert History */}
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Position Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Switch id="enable-alerts" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            <Label htmlFor="enable-alerts" className="ml-2">Enable position change alerts</Label>
          </div>
          <Button variant="outline" className="cursor-pointer !rounded-button whitespace-nowrap">
            <Settings className="mr-2 h-4 w-4" /> Configure Alert Settings
          </Button>
        </div>
        <ScrollArea className="h-64 rounded-md border p-4">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <ArrowUp className="text-green-600 h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Improved: seo rank tracking tool</h3>
                <p className="text-sm text-gray-600 mb-1">Position improved from 6 to 2 (+4 positions)</p>
                <p className="text-xs text-gray-500">May 2, 2025 - 10:23 AM</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <ArrowDown className="text-red-600 h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Declined: keyword ranking software</h3>
                <p className="text-sm text-gray-600 mb-1">Position dropped from 5 to 7 (-2 positions)</p>
                <p className="text-xs text-gray-500">May 1, 2025 - 11:45 AM</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <ArrowUp className="text-green-600 h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Improved: track google rankings</h3>
                <p className="text-sm text-gray-600 mb-1">Position improved from 7 to 4 (+3 positions)</p>
                <p className="text-xs text-gray-500">April 30, 2025 - 9:12 AM</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <ArrowUp className="text-green-600 h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Improved: serp tracker</h3>
                <p className="text-sm text-gray-600 mb-1">Position improved from 8 to 3 (+5 positions)</p>
                <p className="text-xs text-gray-500">April 29, 2025 - 2:34 PM</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <ArrowDown className="text-red-600 h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Declined: keyword ranking tool</h3>
                <p className="text-sm text-gray-600 mb-1">Position dropped from 6 to 9 (-3 positions)</p>
                <p className="text-xs text-gray-500">April 28, 2025 - 8:56 AM</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4 text-center">
          <Button variant="link" className="text-blue-600 hover:text-blue-800 cursor-pointer !rounded-button whitespace-nowrap">
            View All Alerts <ChevronRight className="ml-1 h-4 w-4 inline" />
          </Button>
        </div>
      </CardContent>
    </Card>
    {/* Recommendations */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Ranking Improvement Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FileText className="text-blue-600 h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Content Optimization</h3>
                  <p className="text-sm text-blue-700 mb-2">3 keywords need content improvements to boost rankings</p>
                  <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm cursor-pointer !rounded-button whitespace-nowrap">
                    View Details <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Link className="text-green-600 h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Backlink Opportunities</h3>
                  <p className="text-sm text-green-700 mb-2">5 high-value backlink opportunities identified</p>
                  <Button variant="link" className="text-green-600 hover:text-green-800 p-0 h-auto text-sm cursor-pointer !rounded-button whitespace-nowrap">
                    View Details <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Tag className="text-purple-600 h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-800 mb-1">Keyword Opportunities</h3>
                  <p className="text-sm text-purple-700 mb-2">8 new keyword opportunities with high potential</p>
                  <Button variant="link" className="text-purple-600 hover:text-purple-800 p-0 h-auto text-sm cursor-pointer !rounded-button whitespace-nowrap">
                    View Details <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </main>
</div>
);
};  

export default SeoPerformanceRankTracker;
