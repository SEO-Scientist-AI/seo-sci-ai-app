"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertOctagon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeoIssue {
  id: string;
  name: string;
  severity: "Warning" | "Error";
  pagesAffected: number;
  impact: "Low" | "Medium" | "High";
}

const mockIssues: SeoIssue[] = [
  {
    id: "1",
    name: "Missing meta descriptions",
    severity: "Warning",
    pagesAffected: 104,
    impact: "Medium",
  },
  {
    id: "2",
    name: "Broken links",
    severity: "Error",
    pagesAffected: 28,
    impact: "High",
  },
  {
    id: "3",
    name: "Missing alt text on images",
    severity: "Warning",
    pagesAffected: 76,
    impact: "Medium",
  },
  {
    id: "4",
    name: "Slow page load speed",
    severity: "Error",
    pagesAffected: 42,
    impact: "High",
  },
  {
    id: "5",
    name: "Duplicate content",
    severity: "Error",
    pagesAffected: 15,
    impact: "High",
  },
];

const cellDividerClass = "border-l border-border/50 first:border-l-0";

export function IssuesTab() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Error":
        return "text-red-600 bg-red-50";
      case "Warning":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Error":
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case "Warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm border-border/40">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[400px]">Issue</TableHead>
                <TableHead className={cn("w-[120px]", cellDividerClass)}>
                  Severity
                </TableHead>
                <TableHead className={cn("w-[150px]", cellDividerClass)}>
                  Pages Affected
                </TableHead>
                <TableHead className={cn("w-[120px]", cellDividerClass)}>
                  Impact
                </TableHead>
                <TableHead className={cn("w-[100px]", cellDividerClass)}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIssues.map((issue) => (
                <TableRow
                  key={issue.id}
                  className="group cursor-pointer transition-colors h-14"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(issue.severity)}
                      <span className="font-medium">{issue.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        getSeverityColor(issue.severity)
                      )}
                    >
                      {issue.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <span className="font-medium">{issue.pagesAffected}</span>
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <span className="font-medium">{issue.impact}</span>
                  </TableCell>
                  <TableCell className={cellDividerClass}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      Fix
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 