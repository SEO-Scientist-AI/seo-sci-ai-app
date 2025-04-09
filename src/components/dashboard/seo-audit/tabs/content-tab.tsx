"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ContentMetric {
  id: string;
  title: string;
  score: number;
  issues: {
    id: string;
    description: string;
    severity: "low" | "medium" | "high";
    suggestion: string;
  }[];
}

interface ContentTabProps {
  metrics: ContentMetric[];
}

export function ContentTab({ metrics }: ContentTabProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getSeverityColor = (severity: ContentMetric["issues"][0]["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
    }
  };

  return (
    <div className="space-y-6">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}
              </span>
              <span className="text-muted-foreground">/100</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={metric.score} className="mb-4" />
            <div className="space-y-4">
              {metric.issues.map((issue) => (
                <div key={issue.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                    <span className="text-sm">{issue.description}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-2">
                    Suggestion: {issue.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 