"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, AreaChart, PieChart, Share2, Download, Info, TrendingUp } from "lucide-react";

export const GSCIntegrationScreen: React.FC = () => {
  const [period, setPeriod] = useState("7");
  const [device, setDevice] = useState("Web");
  const router = useRouter();
  
  const handleLoginClick = () => {
    router.push('/login');
  };
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Section */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <div className="text-primary mb-4">
              <LineChart className="h-6 w-6" />
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-foreground text-lg font-medium tracking-wide">ANALYTICS DASHBOARD</h2>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-indigo-500 dark:from-primary dark:to-indigo-400 mb-2">
              Transform Your Data into Actionable Insights Today.
            </h1>
          </div>
          
          <div className="mb-8">
            <p className="text-muted-foreground text-lg">
              Leverage advanced analytics to optimize your content performance and drive measurable results
            </p>
          </div>
          
          <Button 
            className="flex items-center gap-2 px-4 py-2" 
            size="lg"
            onClick={handleLoginClick}
          >
            <BarChart className="h-4 w-4" />
            <span>Start Analytics Dashboard</span>
          </Button>
        </div>
        
        {/* Right Section - Analytics Preview */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 mb-4">
              <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <Tabs defaultValue="overview" className="w-full sm:w-auto max-w-[400px]">
                  <TabsList>
                    <TabsTrigger value="overview">Performance</TabsTrigger>
                    <TabsTrigger value="keywords">Engagement</TabsTrigger>
                    <TabsTrigger value="urls">Conversion</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Checkbox id="lastDays" checked={true} />
                    <label htmlFor="lastDays" className="text-sm text-muted-foreground">Real-time Data</label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={device} onValueChange={setDevice}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web">Desktop</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="All">All Platforms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard 
                  title="Total Users" 
                  value="3.2M" 
                  icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
                  color="bg-gradient-to-r from-primary/80 to-indigo-500/80 dark:from-primary/90 dark:to-indigo-400"
                  hasInfo={true}
                  isChecked={true}
                />
                <MetricCard 
                  title="Page Views" 
                  value="8.5M" 
                  icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
                  color="bg-gradient-to-r from-indigo-500/80 to-purple-500/80 dark:from-indigo-400 dark:to-purple-400"
                  hasInfo={true}
                  isChecked={true}
                />
                <MetricCard 
                  title="Bounce Rate" 
                  value="32.4%" 
                  icon={<AreaChart className="h-4 w-4 text-muted-foreground" />}
                  color="bg-gradient-to-r from-purple-500/80 to-pink-500/80 dark:from-purple-400 dark:to-pink-400"
                  hasInfo={true}
                  isChecked={false}
                />
                <MetricCard 
                  title="Avg. Session" 
                  value="4:32" 
                  icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
                  color="bg-gradient-to-r from-pink-500/80 to-rose-500/80 dark:from-pink-400 dark:to-rose-400"
                  hasInfo={true}
                  isChecked={false}
                />
              </div>
              
              {/* Data Table */}
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Page Path</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Users</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Sessions</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Growth</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Page Views</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">View Change</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bounce Rate</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Rate Change</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow 
                        keyword="/homepage" 
                        volume="125K" 
                        clicks="45.2K" 
                        clicksChange="12" 
                        impressions="89.3K" 
                        impChange="15" 
                        avgCtr="28.4%" 
                        ctrChange="8.2%" 
                        keywords="2:45"
                        isNegative={false}
                      />
                      <TableRow 
                        keyword="/products" 
                        volume="98K" 
                        clicks="32.1K" 
                        clicksChange="-8" 
                        impressions="67.8K" 
                        impChange="-5" 
                        avgCtr="22.6%" 
                        ctrChange="-4.3%" 
                        keywords="3:12"
                        isNegative={true}
                      />
                      <TableRow 
                        keyword="/blog" 
                        volume="76K" 
                        clicks="28.9K" 
                        clicksChange="18" 
                        impressions="52.4K" 
                        impChange="22" 
                        avgCtr="31.2%" 
                        ctrChange="12.8%" 
                        keywords="4:05"
                        isNegative={false}
                      />
                      <TableRow 
                        keyword="/about" 
                        volume="45K" 
                        clicks="15.3K" 
                        clicksChange="9" 
                        impressions="28.7K" 
                        impChange="11" 
                        avgCtr="25.8%" 
                        ctrChange="5.2%" 
                        keywords="2:18"
                        isNegative={false}
                      />
                      <TableRow 
                        keyword="/contact" 
                        volume="32K" 
                        clicks="12.8K" 
                        clicksChange="-5" 
                        impressions="21.5K" 
                        impChange="-3" 
                        avgCtr="19.4%" 
                        ctrChange="-2.8%" 
                        keywords="1:45"
                        isNegative={true}
                      />
                      <TableRow 
                        keyword="/services" 
                        volume="28K" 
                        clicks="10.2K" 
                        clicksChange="15" 
                        impressions="18.9K" 
                        impChange="18" 
                        avgCtr="28.9%" 
                        ctrChange="9.4%" 
                        keywords="3:28"
                        isNegative={false}
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  hasInfo: boolean;
  isChecked: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, hasInfo, isChecked }) => {
  return (
    <Card className="shadow-sm border">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {isChecked && <Checkbox checked={true} />}
            <span className="text-sm text-muted-foreground font-medium">{title}</span>
          </div>
          {hasInfo && <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />}
        </div>
        <div className="text-2xl font-bold mb-2 text-foreground">{value}</div>
        <div className={`h-1.5 w-full ${color} rounded-full`}></div>
      </CardContent>
    </Card>
  );
};

interface TableRowProps {
  keyword: string;
  volume: string;
  clicks: string;
  clicksChange: string;
  impressions: string;
  impChange: string;
  avgCtr: string;
  ctrChange: string;
  keywords: string;
  isNegative: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ 
  keyword, 
  volume, 
  clicks, 
  clicksChange, 
  impressions, 
  impChange, 
  avgCtr, 
  ctrChange, 
  keywords,
  isNegative
}) => {
  const negativeClass = "text-destructive";
  const positiveClass = "text-emerald-500 dark:text-emerald-400";
  
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors duration-150">
      <td className="py-3 px-4 text-sm font-medium text-foreground">{keyword}</td>
      <td className="py-3 px-4 text-right text-sm text-foreground">{volume}</td>
      <td className="py-3 px-4 text-right text-sm text-foreground">{clicks}</td>
      <td className={`py-3 px-4 text-right ${isNegative ? negativeClass : positiveClass} text-sm font-medium`}>
        <span className="flex items-center justify-end">
          {isNegative ? clicksChange : `+${clicksChange}`}%
        </span>
      </td>
      <td className="py-3 px-4 text-right text-sm text-foreground">{impressions}</td>
      <td className={`py-3 px-4 text-right ${isNegative ? negativeClass : positiveClass} text-sm font-medium`}>
        <span className="flex items-center justify-end">
          {isNegative ? impChange : `+${impChange}`}%
        </span>
      </td>
      <td className="py-3 px-4 text-right text-sm text-foreground">{avgCtr}</td>
      <td className={`py-3 px-4 text-right ${isNegative ? negativeClass : positiveClass} text-sm font-medium`}>
        <span className="flex items-center justify-end">
          {isNegative ? ctrChange : `+${ctrChange}`}
        </span>
      </td>
      <td className="py-3 px-4 text-right text-sm text-foreground">{keywords}</td>
    </tr>
  );
};

export default GSCIntegrationScreen;
