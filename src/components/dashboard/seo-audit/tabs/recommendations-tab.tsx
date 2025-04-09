"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "quick" | "moderate" | "extensive";
  status: "pending" | "in-progress" | "completed";
  category: string;
}

interface RecommendationsTabProps {
  recommendations: Recommendation[];
}

export function RecommendationsTab({ recommendations }: RecommendationsTabProps) {
  const getImpactColor = (impact: Recommendation["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
    }
  };

  const getEffortColor = (effort: Recommendation["effort"]) => {
    switch (effort) {
      case "quick":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "extensive":
        return "bg-red-500";
    }
  };

  const getStatusColor = (status: Recommendation["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-500";
      case "in-progress":
        return "bg-purple-500";
      case "completed":
        return "bg-green-500";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{recommendation.title}</span>
              <Badge className={getStatusColor(recommendation.status)}>
                {recommendation.status}
              </Badge>
            </CardTitle>
            <CardDescription>{recommendation.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {recommendation.description}
            </p>
            <div className="mt-4 flex gap-2">
              <Badge className={getImpactColor(recommendation.impact)}>
                Impact: {recommendation.impact}
              </Badge>
              <Badge className={getEffortColor(recommendation.effort)}>
                Effort: {recommendation.effort}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 