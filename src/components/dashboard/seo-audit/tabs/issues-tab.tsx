"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AlertTriangle, AlertOctagon, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuditStore, SeoIssue } from "@/store/audit-store";
import { useSearchParams } from "next/navigation";
import { getIssuesCount } from "@/app/actions/performance/getIssuesCount";
import { Skeleton } from "@/components/ui/skeleton";

const cellDividerClass = "border-l border-border/50 first:border-l-0";

export function IssuesTab() {
  const { issues, isProcessing, startProcessing, setIssues, urlAnalysis, processedUrls } = useAuditStore();
  const searchParams = useSearchParams();
  const website = searchParams.get('website');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // Trigger URL processing when the component mounts
  useEffect(() => {
    if (website && !isProcessing && !issues.items.length) {
      fetchIssueData();
    }
  }, [website, isProcessing, issues.items.length]);

  const fetchIssueData = async () => {
    if (!website) return;
    
    try {
      setIsLoading(true);
      setError(null);
      // Start processing with the current domain
      startProcessing(website);
      
      // Fetch issue data using the server action
      const issueStats = await getIssuesCount(website);
      
      // Map the API response to the SeoIssue interface
      const formattedIssues: SeoIssue[] = issueStats.map(issue => ({
        id: issue.audit_id,
        name: issue.title,
        severity: issue.audit_id.includes('error') ? 'Error' : 'Warning',
        pagesAffected: issue.affected_pages_count,
        impact: issue.affected_pages_count > 100 ? 'High' : 
               issue.affected_pages_count > 50 ? 'Medium' : 'Low'
      }));
      
      // Update the store with the fetched issues
      setIssues(formattedIssues);
    } catch (err) {
      console.error('Error fetching issue data:', err);
      setError('Failed to load issue data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Function to show affected pages for an issue
  const showAffectedPages = (issueId: string) => {
    setSelectedIssue(selectedIssue === issueId ? null : issueId);
  };

  // Get affected URLs for the selected issue
  const getAffectedUrls = (issueId: string) => {
    return Object.entries(urlAnalysis)
      .filter(([_, analysis]) => {
        // Since failed_audits doesn't exist in our type, we'll filter using URL
        // In a real implementation, you would check for the issue ID in the analysis
        return processedUrls.includes(_);
      })
      .map(([url, _]) => url);
  };

  if (!website) {
    return (
      <Card className="shadow-sm border-border/40">
        <CardContent className="p-6 text-center text-muted-foreground">
          Please select a website to view issues
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border-border/40">
        <CardContent className="p-6 text-center text-destructive">
          <AlertOctagon className="h-6 w-6 mx-auto mb-2" />
          {error}
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={fetchIssueData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

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
              {(isProcessing || isLoading) && !issues.items.length ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-[350px]" />
                      </div>
                    </TableCell>
                    <TableCell className={cellDividerClass}>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className={cellDividerClass}>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell className={cellDividerClass}>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell className={cellDividerClass}>
                      <Skeleton className="h-8 w-14" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !issues.items.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No issues found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {issues.items.map((issue) => (
                    <React.Fragment key={issue.id}>
                      <TableRow
                        className="group cursor-pointer transition-colors h-14"
                        onClick={() => showAffectedPages(issue.id)}
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
                      
                      {/* Expandable section showing affected pages */}
                      {selectedIssue === issue.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 py-2 px-4">
                            <div className="py-2">
                              <h4 className="text-sm font-medium mb-2">Affected Pages:</h4>
                              <div className="max-h-60 overflow-y-auto space-y-1 pl-1">
                                {processedUrls.length === 0 ? (
                                  <div className="text-sm text-muted-foreground italic">
                                    No pages analyzed yet
                                  </div>
                                ) : (
                                  processedUrls.map((url, idx) => (
                                    <div key={idx} className="text-xs py-1 px-2 rounded hover:bg-muted">
                                      <a 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        {url}
                                      </a>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 