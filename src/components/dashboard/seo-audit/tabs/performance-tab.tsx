"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, AlertCircle, AlertTriangle } from "lucide-react";
import { MetricSkeleton, PerformanceScoreSkeleton, AlertSkeleton } from "../metric-skeleton";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
}

// New interface for web vitals audits
interface WebVitalsAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  display_value: string | null;
  details_summary: any;
}

interface PerformanceTabProps {
  metrics: PerformanceMetric[];
  overallScore?: number;
  failedAudits?: WebVitalsAudit[];
  isLoading?: boolean;
  error?: string | null;
}

export function PerformanceTab({ 
  metrics, 
  overallScore, 
  failedAudits = [], 
  isLoading = false,
  error = null
}: PerformanceTabProps) {
  const getTrendColor = (trend: PerformanceMetric["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      case "stable":
        return "text-yellow-500";
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Determine if we show error state
  const hasError = !!error;

  return (
    <div className="space-y-6">
      {/* API Error Alert */}
      {hasError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Performance Data</AlertTitle>
          <AlertDescription>
            {error}. Showing available data or placeholders.
          </AlertDescription>
        </Alert>
      )}

      {/* Overall Performance Score */}
      {isLoading ? (
        <PerformanceScoreSkeleton />
      ) : (
        overallScore !== undefined && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Overall Performance Score</CardTitle>
              <CardDescription>
                Based on Core Web Vitals and other performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Score</span>
                <span className="text-2xl font-bold">{Math.round(overallScore * 100)}%</span>
              </div>
              <Progress 
                value={overallScore * 100} 
                className={overallScore >= 0.9 ? "bg-green-500" : overallScore >= 0.5 ? "bg-yellow-500" : "bg-red-500"} 
              />
            </CardContent>
          </Card>
        )
      )}

      {/* Core Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Show skeletons while loading
          Array(6).fill(0).map((_, i) => <MetricSkeleton key={i} />)
        ) : metrics.length > 0 ? (
          // Show actual metrics if available
          metrics.map((metric) => (
            <Card key={metric.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{metric.name}</span>
                  <span
                    className={`text-sm font-medium ${getTrendColor(metric.trend)}`}
                  >
                    {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}{" "}
                    {metric.change}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                  <Progress
                    value={(metric.value / metric.target) * 100}
                    className={getProgressColor(metric.value, metric.target)}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">
                      {metric.target}
                      {metric.unit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // No metrics available
          <div className="col-span-3">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>No Performance Metrics Available</AlertTitle>
              <AlertDescription>
                We couldn't retrieve performance metrics for this website. Try running a new audit.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Critical Audit Issues */}
      {isLoading ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Performance Issues to Fix</h3>
          {Array(3).fill(0).map((_, i) => <AlertSkeleton key={i} />)}
        </div>
      ) : failedAudits && failedAudits.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Performance Issues to Fix</h3>
          
          {failedAudits
            .filter(audit => audit.score < 0.5) // Only show critical issues
            .map((audit) => (
              <Alert key={audit.id} variant={audit.score < 0.3 ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {audit.title}
                  {audit.display_value && (
                    <Badge variant="outline" className="ml-2">
                      {audit.display_value}
                    </Badge>
                  )}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {audit.description.replace(/\[Learn more.*?\)/, '')}
                </AlertDescription>
              </Alert>
          ))}
        </div>
      ) : null}
    </div>
  );
} 