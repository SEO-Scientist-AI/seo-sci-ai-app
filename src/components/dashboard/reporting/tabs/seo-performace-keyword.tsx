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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Info, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Folder, 
  Download, 
  FileText, 
  FileOutput, 
  Edit, 
  Trash2, 
  LineChart, 
  Tag as TagIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb,
  FileEdit,
  BarChart2,
  PieChart,
  Minus,
  Network,
  Workflow
} from "lucide-react";

const SeoPerformanceKeyword: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("all");
  const [selectedVolume, setSelectedVolume] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showAddKeywordDialog, setShowAddKeywordDialog] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [competitorAnalysisTab, setCompetitorAnalysisTab] = useState("overview");
  const volumeTrendChartRef = useRef<HTMLDivElement>(null);
  const difficultyDistributionChartRef = useRef<HTMLDivElement>(null);
  const rankingProgressChartRef = useRef<HTMLDivElement>(null);
  const competitorComparisonChartRef = useRef<HTMLDivElement>(null);
  
  const keywordData = [
    { id: 1, keyword: "rank tracking software", volume: 5200, difficulty: "High", cpc: 4.50, competition: 0.82, opportunity: 72, group: "Core", trend: "up" },
    { id: 2, keyword: "keyword position tracker", volume: 3800, difficulty: "Medium", cpc: 3.20, competition: 0.65, opportunity: 68, group: "Core", trend: "up" },
    { id: 3, keyword: "seo rank tracking tool", volume: 2900, difficulty: "Medium", cpc: 3.80, competition: 0.58, opportunity: 75, group: "Tools", trend: "up" },
    { id: 4, keyword: "serp position monitor", volume: 1800, difficulty: "Low", cpc: 2.10, competition: 0.45, opportunity: 80, group: "Monitoring", trend: "stable" },
    { id: 5, keyword: "track google rankings", volume: 4500, difficulty: "High", cpc: 4.30, competition: 0.79, opportunity: 65, group: "Core", trend: "down" },
    { id: 6, keyword: "keyword ranking software", volume: 3200, difficulty: "Medium", cpc: 3.50, competition: 0.62, opportunity: 70, group: "Tools", trend: "up" },
    { id: 7, keyword: "seo position tracker", volume: 2600, difficulty: "High", cpc: 4.10, competition: 0.75, opportunity: 62, group: "Monitoring", trend: "stable" },
    { id: 8, keyword: "rank tracking dashboard", volume: 1900, difficulty: "Medium", cpc: 2.80, competition: 0.55, opportunity: 73, group: "Dashboard", trend: "up" },
    { id: 9, keyword: "keyword ranking tool", volume: 4100, difficulty: "High", cpc: 4.80, competition: 0.85, opportunity: 60, group: "Tools", trend: "down" },
    { id: 10, keyword: "serp tracker", volume: 5800, difficulty: "Medium", cpc: 3.90, competition: 0.70, opportunity: 78, group: "Monitoring", trend: "up" },
    { id: 11, keyword: "keyword difficulty checker", volume: 2200, difficulty: "Low", cpc: 2.50, competition: 0.48, opportunity: 82, group: "Research", trend: "up" },
    { id: 12, keyword: "seo keyword tracker", volume: 3500, difficulty: "Medium", cpc: 3.60, competition: 0.67, opportunity: 71, group: "Core", trend: "stable" },
    { id: 13, keyword: "search engine ranking tool", volume: 2800, difficulty: "High", cpc: 4.20, competition: 0.77, opportunity: 64, group: "Tools", trend: "down" },
    { id: 14, keyword: "keyword position monitoring", volume: 1700, difficulty: "Low", cpc: 2.30, competition: 0.42, opportunity: 79, group: "Monitoring", trend: "up" },
    { id: 15, keyword: "google ranking checker", volume: 4300, difficulty: "Medium", cpc: 3.70, competition: 0.69, opportunity: 74, group: "Tools", trend: "stable" },
  ];
  
  const relatedKeywords = [
    "keyword research tool", "keyword analysis software", "seo keyword finder",
    "keyword competition analyzer", "long tail keyword tool", "keyword difficulty tool",
    "keyword opportunity finder", "keyword gap analysis", "keyword clustering tool",
    "keyword intent analyzer", "keyword seasonality checker", "keyword trend tracker"
  ];
  
  const filteredKeywords = keywordData.filter(item => {
    const matchesSearch = item.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVolume = selectedVolume === "all" ||
      (selectedVolume === "high" && item.volume > 4000) ||
      (selectedVolume === "medium" && item.volume > 2000 && item.volume <= 4000) ||
      (selectedVolume === "low" && item.volume <= 2000);
    const matchesGroup = selectedGroup === "all" || item.group === selectedGroup;
    return matchesSearch && matchesVolume && matchesGroup;
  });
  
  const keywordGroups = Array.from(new Set(keywordData.map(item => item.group)));
  
  useEffect(() => {
    if (volumeTrendChartRef.current) {
      const chart = echarts.init(volumeTrendChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Search Volume', 'Trend']
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
          data: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
        },
        yAxis: {
          type: 'value',
          name: 'Volume',
        },
        series: [
          {
            name: 'Search Volume',
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
            data: [3200, 3500, 3800, 4200, 4500, 4800, 5200]
          },
          {
            name: 'Trend',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#10b981'
            },
            itemStyle: {
              color: '#10b981'
            },
            data: [65, 68, 70, 72, 75, 78, 82]
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
    if (difficultyDistributionChartRef.current) {
      const chart = echarts.init(difficultyDistributionChartRef.current);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['Easy', 'Medium', 'Hard', 'Very Hard']
        },
        series: [
          {
            name: 'Difficulty Distribution',
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
              { value: 15, name: 'Easy', itemStyle: { color: '#22c55e' } },
              { value: 42, name: 'Medium', itemStyle: { color: '#3b82f6' } },
              { value: 30, name: 'Hard', itemStyle: { color: '#f59e0b' } },
              { value: 13, name: 'Very Hard', itemStyle: { color: '#ef4444' } }
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
    if (rankingProgressChartRef.current) {
      const chart = echarts.init(rankingProgressChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Current', 'Previous Month']
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
          max: 20
        },
        yAxis: {
          type: 'category',
          data: ['rank tracking software', 'keyword position tracker', 'seo rank tracking tool', 'serp position monitor', 'track google rankings']
        },
        series: [
          {
            name: 'Current',
            type: 'bar',
            data: [3, 5, 2, 8, 4],
            itemStyle: {
              color: '#3b82f6'
            }
          },
          {
            name: 'Previous Month',
            type: 'bar',
            data: [5, 7, 6, 10, 7],
            itemStyle: {
              color: '#94a3b8'
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
  
  useEffect(() => {
    if (competitorComparisonChartRef.current) {
      const chart = echarts.init(competitorComparisonChartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Your Site', 'Competitor A', 'Competitor B']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Top 3', 'Top 10', 'Top 20', 'Top 50', 'Top 100']
        },
        yAxis: {
          type: 'value',
          name: 'Keywords',
        },
        series: [
          {
            name: 'Your Site',
            type: 'bar',
            data: [18, 32, 45, 62, 78],
            itemStyle: {
              color: '#3b82f6'
            }
          },
          {
            name: 'Competitor A',
            type: 'bar',
            data: [25, 38, 50, 68, 85],
            itemStyle: {
              color: '#ef4444'
            }
          },
          {
            name: 'Competitor B',
            type: 'bar',
            data: [15, 28, 42, 58, 72],
            itemStyle: {
              color: '#10b981'
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
  }, [competitorAnalysisTab]);
  
  const handleKeywordSelect = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };
  
  return (
    <div className="rounded-lg">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Keyword Research & Management</h2>
            <p className="text-muted-foreground mt-1">Discover, analyze, and manage keywords to improve your SEO strategy</p>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog open={showAddKeywordDialog} onOpenChange={setShowAddKeywordDialog}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Add Keywords
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Keywords to Track</DialogTitle>
                  <DialogDescription>
                    Enter keywords you want to research and track
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
                    <Label htmlFor="keyword-group" className="text-sm font-medium">Keyword Group</Label>
                    <Select defaultValue="core">
                      <SelectTrigger id="keyword-group" className="w-full mt-1">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core Keywords</SelectItem>
                        <SelectItem value="tools">Tools Keywords</SelectItem>
                        <SelectItem value="monitoring">Monitoring Keywords</SelectItem>
                        <SelectItem value="research">Research Keywords</SelectItem>
                        <SelectItem value="new">Create New Group...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="include-related" className="text-sm font-medium">Include Related Keywords</Label>
                      <div className="flex items-center mt-2">
                        <Switch id="include-related" />
                        <Label htmlFor="include-related" className="ml-2 text-sm text-muted-foreground">Auto-suggest related terms</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="track-rankings" className="text-sm font-medium">Track Rankings</Label>
                      <div className="flex items-center mt-2">
                        <Switch id="track-rankings" defaultChecked />
                        <Label htmlFor="track-rankings" className="ml-2 text-sm text-muted-foreground">Monitor SERP positions</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddKeywordDialog(false)}>Cancel</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowAddKeywordDialog(false)}>Add Keywords</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Folder className="mr-2 h-4 w-4" /> Manage Groups
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Keyword Groups</DialogTitle>
                  <DialogDescription>
                    Organize your keywords into logical groups
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="mb-4">
                    <Label className="text-sm font-medium">Current Groups</Label>
                    <div className="mt-2 space-y-2">
                      {keywordGroups.map((group, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center">
                            <Folder className="text-primary mr-2 h-4 w-4" />
                            <span>{group}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="new-group" className="text-sm font-medium">Create New Group</Label>
                    <div className="mt-1 flex">
                      <Input id="new-group" placeholder="Enter group name" className="text-sm" />
                      <Button className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="mr-2 h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowGroupDialog(false)}>Done</Button>
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
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                Total Keywords
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Total number of keywords in your database.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="text-3xl font-bold text-foreground">152</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>15 new</span>
                  </div>
                </div>
                <div className="flex-1 h-16">
                  <div className="w-full h-full flex items-end">
                    {[85, 92, 98, 105, 112, 120, 128, 135, 142, 152].map((value, index) => (
                      <div
                        key={index}
                        className="bg-primary mx-0.5 rounded-t"
                        style={{ height: `${(value / 152) * 100}%`, width: '8%' }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                Average Search Volume
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Average monthly search volume across all tracked keywords.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="text-3xl font-bold text-foreground">3,420</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>+8.5%</span>
                  </div>
                </div>
                <div className="flex-1 h-16">
                  <div className="w-full h-full flex items-end">
                    {[2800, 2950, 3050, 3150, 3200, 3250, 3300, 3350, 3380, 3420].map((value, index) => (
                      <div
                        key={index}
                        className="bg-green-500 mx-0.5 rounded-t"
                        style={{ height: `${((value - 2800) / 620) * 100}%`, width: '8%' }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                Keyword Difficulty
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Average difficulty score of your keywords (0-100).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="text-3xl font-bold text-foreground">62</div>
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>+3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Easy</span>
                    <span>Medium</span>
                    <span>Hard</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">15%</div>
                  <div className="text-xs text-muted-foreground">Low</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">42%</div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">43%</div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                Opportunity Score
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">Average opportunity score based on volume, difficulty, and competition.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold text-foreground">74</div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="74, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-foreground">Good Opportunity</div>
                <div className="text-xs text-muted-foreground mt-1">High volume, moderate competition</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Keyword Database */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Keyword Database</CardTitle>
                <CardDescription>Search and filter your keyword collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Search keywords"
                      className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </div>
                  <div className="flex space-x-2">
                    <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Volumes</SelectItem>
                        <SelectItem value="high">High (4000+)</SelectItem>
                        <SelectItem value="medium">Medium (2000-4000)</SelectItem>
                        <SelectItem value="low">Low (0-2000)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {keywordGroups.map((group, index) => (
                          <SelectItem key={index} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            id="select-all"
                            onCheckedChange={() => {}}
                          />
                        </TableHead>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>CPC</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKeywords.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              id={`select-${item.id}`}
                              checked={selectedKeywords.includes(item.keyword)}
                              onCheckedChange={() => handleKeywordSelect(item.keyword)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.keyword}</TableCell>
                          <TableCell>{item.volume.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.difficulty === "High" ? "destructive" :
                              item.difficulty === "Medium" ? "default" :
                              "secondary"
                            }>
                              {item.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell>${item.cpc.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  item.competition > 0.7 ? "bg-destructive" :
                                  item.competition > 0.5 ? "bg-yellow-500" :
                                  "bg-green-500"
                                }`}
                                style={{ width: `${item.competition * 100}%` }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`
                              ${item.opportunity >= 75 ? "bg-green-100 text-green-800" :
                                item.opportunity >= 65 ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"}
                            `}>
                              {item.opportunity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-muted/50">
                              {item.group}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.trend === "up" ? (
                              <ArrowUp className="text-green-600 h-4 w-4" />
                            ) : item.trend === "down" ? (
                              <ArrowDown className="text-destructive h-4 w-4" />
                            ) : (
                              <Minus className="text-muted-foreground h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                                      <BarChart2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Trends</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                                      <TagIcon className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Manage Groups</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
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
                  <div className="text-sm text-muted-foreground">Showing {filteredKeywords.length} of {keywordData.length} keywords</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Keyword Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keywordGroups.map((group, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md flex items-center justify-between cursor-pointer ${
                        selectedGroup === group ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50 border border-border'
                      }`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <div className="flex items-center">
                        <Folder className={`${selectedGroup === group ? 'text-primary' : 'text-muted-foreground'} mr-3 h-4 w-4`} />
                        <div>
                          <div className="font-medium">{group}</div>
                          <div className="text-xs text-muted-foreground">
                            {keywordData.filter(k => k.group === group).length} keywords
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-background">
                        {keywordData.filter(k => k.group === group).length}
                      </Badge>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setShowGroupDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create New Group
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Related Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {relatedKeywords.slice(0, 8).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-muted/50 cursor-pointer">
                      {keyword} <Plus className="ml-1 text-xs text-primary inline h-3 w-3" />
                    </Badge>
                  ))}
                </div>
                <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-sm">
                  View All Related Keywords <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Search Volume Trends</CardTitle>
              <CardDescription>Monthly search volume trends for top keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80" ref={volumeTrendChartRef}></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Keyword Difficulty Distribution</CardTitle>
              <CardDescription>How your keywords are distributed by difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80" ref={difficultyDistributionChartRef}></div>
            </CardContent>
          </Card>
        </div>
        
        {/* Keyword Performance and Competitor Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ranking Progress</CardTitle>
              <CardDescription>Position changes for your top keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80" ref={rankingProgressChartRef}></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Competitor Keyword Analysis</CardTitle>
              <CardDescription>Compare keyword rankings with competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" onValueChange={setCompetitorAnalysisTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
                  <TabsTrigger value="common">Common Keywords</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="h-64" ref={competitorComparisonChartRef}></div>
                </TabsContent>
                <TabsContent value="gap">
                  <div className="p-4 text-center text-muted-foreground">
                    Select "Overview" tab to view competitor data
                  </div>
                </TabsContent>
                <TabsContent value="common">
                  <div className="p-4 text-center text-muted-foreground">
                    Select "Overview" tab to view competitor data
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Keyword Research Tools */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Keyword Research Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Search className="text-blue-600 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Keyword Explorer</h3>
                      <p className="text-sm text-blue-700 mb-2">Discover new keywords and analyze their potential</p>
                      <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm">
                        Launch Tool <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Network className="text-green-600 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800 mb-1">Content Gap Analyzer</h3>
                      <p className="text-sm text-green-700 mb-2">Find keywords your competitors rank for but you don't</p>
                      <Button variant="link" className="text-green-600 hover:text-green-800 p-0 h-auto text-sm">
                        Launch Tool <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <PieChart className="text-purple-600 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800 mb-1">Keyword Clustering</h3>
                      <p className="text-sm text-purple-700 mb-2">Group similar keywords for content planning</p>
                      <Button variant="link" className="text-purple-600 hover:text-purple-800 p-0 h-auto text-sm">
                        Launch Tool <ChevronRight className="ml-1 text-xs h-3 w-3 inline" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* SERP Features Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">SERP Features Analysis</CardTitle>
            <CardDescription>Identify opportunities for featured snippets and other SERP features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature Type</TableHead>
                    <TableHead>Keywords with Feature</TableHead>
                    <TableHead>Your Presence</TableHead>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Featured Snippets</TableCell>
                    <TableCell>28 keywords</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        5 snippets owned
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-1.5 mr-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                        <span className="text-sm">18%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Keywords
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">People Also Ask</TableCell>
                    <TableCell>42 keywords</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        3 answers included
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-1.5 mr-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '7%' }}></div>
                        </div>
                        <span className="text-sm">7%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Keywords
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Image Packs</TableCell>
                    <TableCell>35 keywords</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        0 images included
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-1.5 mr-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-sm">0%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Keywords
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Video Results</TableCell>
                    <TableCell>19 keywords</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        2 videos ranked
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-1.5 mr-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '11%' }}></div>
                        </div>
                        <span className="text-sm">11%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Keywords
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Keyword Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Lightbulb className="text-blue-600 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Keyword Opportunities</h3>
                      <p className="text-sm text-blue-700 mb-2">12 high-opportunity keywords identified</p>
                      <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm">
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
                      <FileText className="text-green-600 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800 mb-1">Content Suggestions</h3>
                      <p className="text-sm text-green-700 mb-2">8 content ideas based on keyword gaps</p>
                      <Button variant="link" className="text-green-600 hover:text-green-800 p-0 h-auto text-sm">
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
                      <LineChart className="text-purple-600 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800 mb-1">Trending Keywords</h3>
                      <p className="text-sm text-purple-700 mb-2">5 keywords with increasing search volume</p>
                      <Button variant="link" className="text-purple-600 hover:text-purple-800 p-0 h-auto text-sm">
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

export default SeoPerformanceKeyword;
