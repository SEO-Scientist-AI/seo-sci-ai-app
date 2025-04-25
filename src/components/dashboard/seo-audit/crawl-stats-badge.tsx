"use client";

import { Badge } from "@/components/ui/badge";
import { useAuditStore } from "@/store/audit-store";
import { Book } from "lucide-react";

export function CrawlStatsBadge() {
  const { urls, processedUrls } = useAuditStore();

  return (
    <Badge
      variant="outline"
      className="h-7 px-3 bg-background border-border flex items-center gap-1.5 text-sm font-normal"
    >
      <Book className="h-3.5 w-3.5 text-muted-foreground" />
      <span>
        Pages crawled:{" "}
        <strong className="text-foreground">
          {processedUrls.length}
        </strong>
        /{urls.length}
      </span>
    </Badge>
  );
} 