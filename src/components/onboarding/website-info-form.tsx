"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as echarts from "echarts";

interface WebsiteInfoFormProps {
  onSubmit: (url: string, projectName: string) => void;
}

export default function WebsiteInfoForm({ onSubmit }: WebsiteInfoFormProps) {
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const searchVolumeChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchVolumeChartRef.current) {
      const chart = echarts.init(searchVolumeChartRef.current);
      const option = {
        animation: false,
        grid: { top: 5, right: 5, bottom: 5, left: 5 },
        xAxis: {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          show: false,
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330],
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#4CAF50",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(76, 175, 80, 0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(76, 175, 80, 0.1)",
                  },
                ],
              },
            },
          },
        ],
      };
      chart.setOption(option);

      let currentChart = chart;
      
      // Handle window resize to make chart responsive
      const handleResize = () => {
        currentChart.resize();
      };
      window.addEventListener('resize', handleResize);

      // Handle theme change
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateChartTheme = (isDark: boolean) => {
        currentChart.dispose();
        // Initialize a new chart and set options
        const newChart = echarts.init(searchVolumeChartRef.current);
        newChart.setOption({
          ...option,
          series: [{
            ...option.series[0],
            lineStyle: {
              color: "#4CAF50",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: isDark ? "rgba(76, 175, 80, 0.4)" : "rgba(76, 175, 80, 0.3)",
                  },
                  {
                    offset: 1,
                    color: isDark ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
                  },
                ],
              },
            },
          }]
        });
        return newChart;
      };

      const handleThemeChange = (e: MediaQueryListEvent) => {
        currentChart = updateChartTheme(e.matches);
      };
      
      darkModeMediaQuery.addEventListener('change', handleThemeChange);

      return () => {
        currentChart.dispose();
        window.removeEventListener('resize', handleResize);
        darkModeMediaQuery.removeEventListener('change', handleThemeChange);
      };
    }
  }, []);

  const handleSubmit = () => {
    if (!url) {
      alert("Please enter a website URL");
      return;
    }

    if (!projectName) {
      alert("Please enter a project name");
      return;
    }

    onSubmit(url, projectName);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center mb-8">
          <div className="bg-purple-600 text-white w-10 h-10 rounded-md flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">SEO Optimizer</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Form */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              Hello there, drop your website link here
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You can use this to do an SEO audit, get reports, and optimize for
              generative AI bots like ChatGPT, Claude etc.
            </p>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="website-url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Website URL
                </label>
                <Input
                  id="website-url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project name
                </label>
                <Input
                  id="project-name"
                  type="text"
                  placeholder="My SEO Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white rounded-md"
                />
              </div>
            </div>
          </div>
          {/* Right Column - Illustrations */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Site Audit Card */}
              <Card className="absolute top-0 left-0 w-64 p-6 shadow-lg bg-white dark:bg-gray-800 rounded-xl z-20">
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 mb-2">
                    <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <div className="absolute inset-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="3"
                            className="dark:stroke-gray-600"
                          />
                          <path
                            d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#4CAF50"
                            strokeWidth="3"
                            strokeDasharray="72, 100"
                          />
                          <path
                            d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#FF9800"
                            strokeWidth="3"
                            strokeDasharray="30, 100"
                            strokeDashoffset="-30"
                          />
                        </svg>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">72</div>
                    </div>
                  </div>
                  <div className="text-center text-purple-700 dark:text-purple-400 font-medium">
                    Site Audit
                  </div>
                </div>
              </Card>
              {/* Generative Engine Card */}
              <Card className="absolute top-24 right-0 w-80 p-6 shadow-lg bg-white dark:bg-gray-800 rounded-xl z-10">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Generative Engine Optimisation
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-800 dark:text-gray-200">
                      <span>Total AI Visits</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Total Visitors from AI Crawlers</span>
                      <span className="text-green-500 dark:text-green-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v3H7a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z" clipRule="evenodd" />
                        </svg>
                        4.7%
                      </span>
                    </div>
                    <Progress value={65} className="h-1 mt-2 bg-gray-100 dark:bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-800 dark:text-gray-200">
                      <span>Total Human Visits</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Total Human visitors through LLMs</span>
                      <span className="text-red-500 dark:text-red-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        4.7%
                      </span>
                    </div>
                    <Progress value={45} className="h-1 mt-2 bg-gray-100 dark:bg-gray-700" />
                  </div>
                </div>
              </Card>
              {/* Reporting Card */}
              <Card className="absolute bottom-0 left-10 w-80 p-6 shadow-lg bg-white dark:bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Reporting
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <span>Keyword Research (94/2)</span>
                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                      Full report
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">Search volume</span>
                      </div>
                      <div
                        ref={searchVolumeChartRef}
                        className="h-20 w-full"
                      ></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-300">Difficulty</span>
                      </div>
                      <div className="flex justify-center items-center h-20">
                        <div className="relative w-16 h-16">
                          <svg viewBox="0 0 36 36" className="w-full h-full">
                            <path
                              d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#eee"
                              strokeWidth="3"
                              className="dark:stroke-gray-600"
                            />
                            <path
                              d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#FF9800"
                              strokeWidth="3"
                              strokeDasharray="60, 100"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-200">
                            Medium
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-24 pt-12 relative z-30">
          <div className="flex space-x-2">
            <div className="w-8 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md whitespace-nowrap cursor-pointer relative z-30"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
} 