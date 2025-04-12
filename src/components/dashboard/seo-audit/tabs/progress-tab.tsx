"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Settings } from "lucide-react";
import { Chart, LEGEND_ITEMS } from "@/components/ui/charts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export function ProgressTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [visibleLines, setVisibleLines] = useState<Set<string>>(new Set(['totalIssues']));

  const toggleLine = (key: string) => {
    // Find the category of the clicked item
    const clickedItem = LEGEND_ITEMS.find(item => item.key === key);
    if (!clickedItem) return;

    setVisibleLines(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(key)) {
        // If item is already selected, just remove it
        newSet.delete(key);
      } else {
        // Remove any other items from the same category
        LEGEND_ITEMS.forEach(item => {
          if (item.category === clickedItem.category) {
            newSet.delete(item.key);
          }
        });
        // Add the new item
        newSet.add(key);
      }
      
      return newSet;
    });
  };

  const legendItemsByCategory = LEGEND_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof LEGEND_ITEMS>);

  const categories = Object.keys(legendItemsByCategory);

  return (
    <div className="space-y-6">
      {/* Historical Chart for Audits */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg">Historical Chart for Audits</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>FROM:</span>
                <Select defaultValue="3 Apr 2025 (13:14)">
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="3 Apr 2025 (13:14)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 Apr 2025 (13:14)">3 Apr 2025 (13:14)</SelectItem>
                    <SelectItem value="2 Apr 2025 (13:14)">2 Apr 2025 (13:14)</SelectItem>
                    <SelectItem value="1 Apr 2025 (13:14)">1 Apr 2025 (13:14)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span>TO:</span>
                <Select defaultValue="6 Apr 2025 (05:54)">
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="6 Apr 2025 (05:54)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6 Apr 2025 (05:54)">6 Apr 2025 (05:54)</SelectItem>
                    <SelectItem value="5 Apr 2025 (05:54)">5 Apr 2025 (05:54)</SelectItem>
                    <SelectItem value="4 Apr 2025 (05:54)">4 Apr 2025 (05:54)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span>Notes:</span>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add
                </Button>
                <Button variant="outline" size="sm">View all</Button>
              </div>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Chart Area */}
          <div className="w-full h-[350px]">
            <Chart visibleLines={visibleLines} onToggleLine={toggleLine} />
          </div>

          {/* Legend Badges with Cross Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-t pt-6">
            <span className="text-sm font-medium text-gray-600 mr-3">LEGEND:</span>
            {Array.from(visibleLines).map((key) => {
              const item = LEGEND_ITEMS.find(i => i.key === key);
              if (!item) return null;
              
              return (
                <button
                  key={item.key}
                  onClick={() => toggleLine(item.key)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-colors relative group border"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                    borderColor: `${item.color}30`,
                  }}
                >
                  <span className="relative">
                    <span>{item.label}</span>
                  </span>
                  <span
                    className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-black/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLine(item.key);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Radio Button Groups */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Categories */}
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-md font-medium mb-3 text-gray-700 pb-2 border-b capitalize">
                  {category}:
                </h3>
                <div className="space-y-2">
                  {legendItemsByCategory[category]?.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <Checkbox
                        id={item.key}
                        checked={visibleLines.has(item.key)}
                        onCheckedChange={() => toggleLine(item.key)}
                      />
                      <label
                        htmlFor={item.key}
                        className={cn(
                          "text-sm",
                          visibleLines.has(item.key) && "font-medium",
                          visibleLines.has(item.key) && category === 'general' && "text-blue-600",
                          visibleLines.has(item.key) && category === 'errors' && "text-red-600",
                          visibleLines.has(item.key) && category === 'warnings' && "text-orange-600"
                        )}
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crawl Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Crawl Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Overall Progress</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">32% (159/500)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-200">Crawl Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pages Crawled</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">159</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pages in Queue</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">341</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pages with Errors</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">1</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 dark:bg-red-400 h-2 rounded-full" style={{ width: "0.2%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-200">Crawl Speed</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pages per Minute</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">12.4</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Average Response Time</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">0.82s</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Bandwidth Usage</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">2.4 MB/s</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-200">Estimated Completion</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Estimated Time Remaining</h3>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">28 minutes</p>
                    <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">Based on current crawl rate</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-100 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Expected Completion</h3>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-300">Sun, Apr 6, 2025 at 10:34 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="mr-2 dark:border-gray-700 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                </svg>
                Pause Crawl
              </Button>
              <Button variant="outline" className="mr-2 dark:border-gray-700 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                </svg>
                Stop Crawl
              </Button>
              <Button variant="default" className="dark:bg-blue-600 dark:hover:bg-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Progress Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}       