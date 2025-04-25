"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { useAuditStore } from "@/store/audit-store";

export function IssuesTable() {
  const { issues } = useAuditStore();

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
        {issues.items.map((issue) => (
          <TableRow key={issue.id} className="hover:bg-muted/50">
            <TableCell className="flex items-center gap-2">
              {issue.severity === 'Error' ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              {issue.name}
              <Badge 
                variant={issue.severity === 'Error' ? 'destructive' : 'secondary'} 
                className={cn(
                  "ml-2",
                  issue.severity === 'Error' 
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                )}
              >
                {issue.severity}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              <span className={cn(
                issue.severity === 'Error' ? "text-destructive" : "text-amber-500"
              )}>
                {issue.pagesAffected}
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