"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ExternalLink } from "lucide-react";

interface Issue {
  type: string;
  count: number;
  severity: 'error' | 'warning';
  link: string;
}

const issues: Issue[] = [
  {
    type: "Incorrect pages found in sitemap.xml",
    count: 64,
    severity: "error",
    link: "#"
  },
  {
    type: "Invalid structured data items",
    count: 153,
    severity: "error",
    link: "#"
  },
  {
    type: "Missing meta description",
    count: 104,
    severity: "warning",
    link: "#"
  },
  {
    type: "Missing h1",
    count: 116,
    severity: "warning",
    link: "#"
  },
  {
    type: "Issues with mixed content",
    count: 130,
    severity: "error",
    link: "#"
  }
];

export function IssuesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type of issues</TableHead>
          <TableHead className="text-right">Number of issues</TableHead>
          <TableHead className="text-right">About the issue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.type} className="hover:bg-muted/50">
            <TableCell className="flex items-center gap-2">
              {issue.severity === 'error' ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              {issue.type}
              <Badge 
                variant={issue.severity === 'error' ? 'destructive' : 'secondary'} 
                className={cn(
                  "ml-2",
                  issue.severity === 'error' 
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                )}
              >
                {issue.severity}s
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              <span className={cn(
                issue.severity === 'error' ? "text-destructive" : "text-amber-500"
              )}>
                {issue.count}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground hover:text-foreground">
                Why and how to fix it
                <ExternalLink className="h-3 w-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 