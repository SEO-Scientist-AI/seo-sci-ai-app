"use client";

import { useAuditStore } from "@/store/audit-store";
import { getWebVitals, WebVitalsResponse } from "./performance/getWebVitals";
import { getIssuesCount, AuditIssueCount } from "./performance/getIssuesCount";

type URLQueueMessage = {
  domain: string;
  url: string;
  country: string;
  language: string;
};

// API response type
interface QueueApiResponse {
  success: boolean;
  messagesSent: number;
  error?: string;
  details?: string;
}

// Helper function to chunk an array into smaller arrays
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function processUrlsInBatches(domain: string) {
  const store = useAuditStore.getState();
  const { urls, processedUrls } = store;
  const MAX_BATCH_SIZE = 10; // Cloudflare Queue batch size limit

  // Start processing
  store.startProcessing(domain);

  try {
    // Get unprocessed URLs - get the first 10 instead of skipping them
    const remainingUrls = urls
      .filter((url) => !processedUrls.includes(url))
      .slice(0, 10); // Changed from .slice(10) to .slice(0, 10)
    console.log("Starting URL processing with:", { remainingUrls, domain });

    // Skip if no URLs to process
    if (remainingUrls.length === 0) {
      console.log("No URLs to process");
      return;
    }

    // Prepare queue messages - each URL becomes a message with metadata
    const queueMessages: URLQueueMessage[] = remainingUrls.map((url) => ({
      domain,
      url,
      country: "US", // Default value - consider making this configurable
      language: "en", // Default value - consider making this configurable
    }));

    // Split messages into batches of max 10 items each
    const batches = chunkArray(queueMessages, MAX_BATCH_SIZE);
    console.log(
      `Split ${queueMessages.length} messages into ${batches.length} batches`
    );

    // Process each batch
    let totalEnqueued = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `Processing batch ${i + 1}/${batches.length} with ${
          batch.length
        } messages`
      );

      // Enqueue the current batch using the Queue API
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: batch,
        }),
      });

      const result = (await response.json()) as QueueApiResponse;

      if (!response.ok) {
        throw new Error(
          `Failed to enqueue batch ${i + 1}: ${
            result.error || response.statusText
          }`
        );
      }

      console.log(`Successfully enqueued batch ${i + 1}:`, result);
      totalEnqueued += result.messagesSent;

      // Small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    console.log(`Total messages enqueued: ${totalEnqueued}`);

    // Mark URLs as being processed
    for (const url of remainingUrls) {
      store.addProcessedUrl(url);
    }

    // Fetch site overview to update stats immediately
    await getSiteOverview(domain);
  } catch (error) {
    console.error("Error in batch processing:", error);
  } finally {
    store.stopProcessing();
  }
}

export async function getSiteOverview(domain: string) {
  const store = useAuditStore.getState();
  // Get updated issue stats after each URL - pass the domain
  console.log("Fetching issue stats for domain:", domain);
  const issueStats = await getIssuesCount(domain);
  console.log("Issue stats result:", issueStats);

  store.setIssues(
    issueStats.map((issue) => ({
      id: issue.audit_id,
      name: issue.title,
      severity: issue.audit_id.includes("error") ? "Error" : "Warning",
      pagesAffected: issue.affected_pages_count,
      impact:
        issue.affected_pages_count > 100
          ? "High"
          : issue.affected_pages_count > 50
          ? "Medium"
          : "Low",
    }))
  );
}
