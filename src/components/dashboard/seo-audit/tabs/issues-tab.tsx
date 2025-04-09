"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved";
  category: string;
}

interface IssuesTabProps {
  issues: Issue[];
}

export function IssuesTab({ issues }: IssuesTabProps) {
  const getSeverityColor = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
    }
  };

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in-progress":
        return "bg-purple-500";
      case "resolved":
        return "bg-green-500";
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {issue.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
              </TableCell>
              <TableCell>{issue.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 