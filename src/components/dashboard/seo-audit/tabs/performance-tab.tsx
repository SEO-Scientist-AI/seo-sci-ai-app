"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
}

interface PerformanceTabProps {
  metrics: PerformanceMetric[];
}

export function PerformanceTab({ metrics }: PerformanceTabProps) {
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.id}>
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
      ))}
    </div>
  );
} 