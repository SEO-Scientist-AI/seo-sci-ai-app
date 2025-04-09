"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Bug, 
  Lock, 
  Globe, 
  Gauge, 
  Zap, 
  Link, 
  Code, 
  FileText,
  ExternalLink
} from "lucide-react";

interface ThematicReport {
  title: string;
  icon: string;
  value: string;
  description?: string;
  link: string;
}

const reports: ThematicReport[] = [
  {
    title: "Crawlability",
    icon: "spider",
    value: "100%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "HTTPS",
    icon: "lock",
    value: "84%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "International SEO",
    icon: "globe",
    value: "N/A",
    description: "International SEO is not implemented on this site.",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "Core Web Vitals",
    icon: "tachometer-alt",
    value: "0%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "Site Performance",
    icon: "bolt",
    value: "93%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "Internal Linking",
    icon: "link",
    value: "85%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "Markup",
    icon: "code",
    value: "82%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  },
  {
    title: "On-Page SEO",
    icon: "file-alt",
    value: "78%",
    link: "https://readdy.ai/home/c8b8a774-b463-401e-a3c1-7a887584c80a/2fb81e83-d9d4-4cf8-9a90-811ab0824baf"
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "spider":
      return <Bug className="h-5 w-5" />;
    case "lock":
      return <Lock className="h-5 w-5" />;
    case "globe":
      return <Globe className="h-5 w-5" />;
    case "tachometer-alt":
      return <Gauge className="h-5 w-5" />;
    case "bolt":
      return <Zap className="h-5 w-5" />;
    case "link":
      return <Link className="h-5 w-5" />;
    case "code":
      return <Code className="h-5 w-5" />;
    case "file-alt":
      return <FileText className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getScoreColor = (value: string) => {
  if (value === "N/A") return "text-muted-foreground";
  
  const score = parseInt(value);
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-amber-500";
  if (score >= 50) return "text-orange-500";
  return "text-destructive";
};

export function ThematicReports() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {reports.map((report) => (
        <Card key={report.title} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium">{report.title}</h3>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {getIcon(report.icon)}
              </div>
            </div>
            
            {report.description ? (
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
            ) : (
              <div className="flex items-center mb-4">
                <span className={cn("text-2xl font-bold", getScoreColor(report.value))}>
                  {report.value}
                </span>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-1"
              asChild
            >
              <a href={report.link} target="_blank" rel="noopener noreferrer">
                View details
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 