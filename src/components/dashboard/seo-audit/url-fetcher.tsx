"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuditStore } from "@/store/audit-store";
import { getGSCUrls } from "@/app/actions/getGscUrls";
import { processUrlsInBatches } from "@/app/actions/processUrls";
import { RefreshCw, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function UrlFetcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { urls, setUrls, isProcessing } = useAuditStore();
  const searchParams = useSearchParams();
  const currentWebsite = searchParams.get("website") || "";

  const fetchUrls = async (website: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!website) {
        throw new Error("Please select a website first");
      }

      const fetchedUrls = await getGSCUrls(website);
      setUrls(fetchedUrls);

      // Automatically start processing URLs
      if (fetchedUrls.length > 0 && !isProcessing) {
        console.log("Starting URL processing after fetch");
        await processUrlsInBatches(website);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch URLs");
      console.error("Error fetching URLs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch URLs when component mounts or website changes
  useEffect(() => {
    if (currentWebsite) {
      fetchUrls(currentWebsite);
    }
  }, [currentWebsite]); // Re-run when website changes

  return (
    <Card className="bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">URL Discovery</span>
            {currentWebsite && (
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                for {currentWebsite}
              </span>
            )}
          </div>
          <Button
            onClick={() => currentWebsite && fetchUrls(currentWebsite)}
            disabled={isLoading || !currentWebsite || isProcessing}
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 transition-all duration-200",
              (isLoading || isProcessing) && "opacity-70"
            )}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 transition-all",
                (isLoading || isProcessing) && "animate-spin"
              )}
            />
            <span className="hidden sm:inline-block">
              {isLoading
                ? "Fetching..."
                : isProcessing
                ? "Processing..."
                : "Refresh URLs"}
            </span>
          </Button>
        </CardTitle>
        {currentWebsite && (
          <span className="text-sm text-muted-foreground md:hidden">
            for {currentWebsite}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {!currentWebsite && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              Please select a website from the dropdown above to fetch URLs.
            </div>
          )}

          <div className="flex items-center justify-between text-sm bg-muted/40 p-3 rounded-md">
            <span className="text-muted-foreground">
              Total URLs discovered:
            </span>
            <span className="font-medium text-foreground">{urls.length}</span>
          </div>

          {(isLoading || isProcessing) && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                {isLoading ? "Fetching URLs..." : "Processing URLs..."}
              </p>
            </div>
          )}

          {urls.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto border rounded-md border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      URL
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {urls.map((url, index) => (
                    <tr
                      key={index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-2 text-sm text-foreground truncate max-w-md">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition-colors"
                        >
                          {url}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
