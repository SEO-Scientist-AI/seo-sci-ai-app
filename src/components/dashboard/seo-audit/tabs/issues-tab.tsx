"use client";

import { useEffect, useState, useRef } from "react";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertOctagon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IssuesSkeleton } from "../issues-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Define Web Vitals audit type
interface WebVitalsAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  display_value: string | null;
  details_summary: any;
}

interface SeoIssue {
  id: string;
  name: string;
  severity: "Warning" | "Error";
  pagesAffected: number | null;
  impact: "Low" | "Medium" | "High";
}

interface PageCountData {
  audit_id: string;
  title: string;
  affected_pages_count: number;
}

// Mock issues as fallback
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

interface IssuesTabProps {
  failedAudits?: WebVitalsAudit[];
  isLoading?: boolean;
  error?: string | null;
  currentWebsite?: string;
}

const cellDividerClass = "border-l border-border/50 first:border-l-0";

// Cache for storing page counts to avoid redundant API calls
const pageCountsCache = new Map<string, Record<string, number>>();

export function IssuesTab({ failedAudits, isLoading = false, error = null, currentWebsite }: IssuesTabProps = {}) {
  const [pageCountsMap, setPageCountsMap] = useState<Record<string, number>>({});
  const [pageCountsLoading, setPageCountsLoading] = useState(false);
  const [pageCountsError, setPageCountsError] = useState<string | null>(null);
  const fetchedAuditIds = useRef<Set<string>>(new Set());

  // Fetch page counts for failed audits - optimized to avoid redundant calls
  useEffect(() => {
    if (!failedAudits || failedAudits.length === 0 || !currentWebsite) return;
    
    // Check if we already have data in cache
    const cacheKey = `${currentWebsite}`;
    if (pageCountsCache.has(cacheKey)) {
      setPageCountsMap(pageCountsCache.get(cacheKey) || {});
      return;
    }
    
    // Identify which audit IDs need to be fetched
    const auditIdsToFetch = failedAudits
      .map(audit => audit.id)
      .filter(id => !fetchedAuditIds.current.has(id));
    
    if (auditIdsToFetch.length === 0) return;
    
    setPageCountsLoading(true);
    
    // Prepare for batch fetching - ideally the API would support multiple audit_ids
    // but we'll work with what we have
    const fetchPageCounts = async () => {
      try {
        const countsMap: Record<string, number> = {...pageCountsMap};
        const pendingFetches = auditIdsToFetch.map(async (auditId) => {
          try {
            // Add to tracked set to avoid refetching
            fetchedAuditIds.current.add(auditId);
            
            const response = await fetch(
              `https://api.seoscientist.ai/api/performance/issues/count?domain=${encodeURIComponent(currentWebsite)}&audit_id=${encodeURIComponent(auditId)}`
            );
            
            if (!response.ok) {
              throw new Error(`Error fetching count for ${auditId}: ${response.statusText}`);
            }
            
            const data = await response.json() as PageCountData[];
            
            // Store the count in our map
            if (data && data.length > 0) {
              countsMap[auditId] = data[0].affected_pages_count;
            }
            
            return { auditId, success: true };
          } catch (err) {
            console.error(`Error fetching count for ${auditId}:`, err);
            return { auditId, success: false };
          }
        });
        
        await Promise.allSettled(pendingFetches);
        
        // Update state and cache
        setPageCountsMap(countsMap);
        pageCountsCache.set(cacheKey, countsMap);
      } catch (err) {
        console.error("Error fetching page counts:", err);
        setPageCountsError("Failed to load page counts");
      } finally {
        setPageCountsLoading(false);
      }
    };
    
    fetchPageCounts();
  }, [failedAudits, currentWebsite, pageCountsMap]);

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

  // Convert Web Vitals audits to issues if available
  const getIssuesFromAudits = () => {
    if (!failedAudits || failedAudits.length === 0) {
      return mockIssues;
    }
    
    return failedAudits.map((audit) => {
      // Determine severity based on score
      // 0-0.49: Error, 0.5-0.89: Warning, 0.9+: Low impact warning
      let severity: "Warning" | "Error" = "Warning";
      let impact: "Low" | "Medium" | "High" = "Medium";
      
      if (audit.score < 0.5) {
        severity = "Error";
        impact = "High";
      } else if (audit.score < 0.9) {
        severity = "Warning";
        impact = "Medium";
      } else {
        severity = "Warning";
        impact = "Low";
      }
      
      // If we have page count data, use it. Otherwise, set to null to show skeleton
      const pagesAffected = audit.id in pageCountsMap ? pageCountsMap[audit.id] : null;
      
      return {
        id: audit.id,
        name: audit.title,
        severity,
        pagesAffected,
        impact,
      };
    });
  };

  const issues = getIssuesFromAudits();

  if (isLoading) {
    return <IssuesSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Issues</AlertTitle>
        <AlertDescription>
          {error}. Using fallback data where possible.
        </AlertDescription>
      </Alert>
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
              {issues.map((issue) => (
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
                    {issue.pagesAffected === null ? (
                      <Skeleton className="h-5 w-10" />
                    ) : (
                      <span className="font-medium">{issue.pagesAffected}</span>
                    )}
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