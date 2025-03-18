'use server';

import { auth } from "@/server/auth";
import { getCurrentWebsite } from "./setWebsite";

export type IndexingStatus = {
  status: 'INDEXED' | 'NOT_INDEXED' | 'ERROR';
  lastCrawled?: string;
  message?: string;
};

interface InspectionResponse {
  inspectionResult?: {
    indexStatusResult?: {
      isIndexed?: boolean;
      lastCrawlTime?: string;
    };
  };
}

export async function checkIndexingStatus(url: string): Promise<IndexingStatus> {
  try {
    const session = await auth();
    const currentWebsite = await getCurrentWebsite();
    
    if (!session?.user || !session.accessToken) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: `sc-domain:${currentWebsite}`
        })
      }
    );

    if (!response.ok) {
      const error = await response.json() as { error?: { message: string } };
      throw new Error(error.error?.message || 'Failed to check indexing status');
    }

    const data = await response.json() as InspectionResponse;
    
    if (data.inspectionResult?.indexStatusResult?.isIndexed) {
      return {
        status: 'INDEXED',
        lastCrawled: data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        message: 'This page is indexed by Google'
      };
    }

    return {
      status: 'NOT_INDEXED',
      message: 'This page is not yet indexed by Google'
    };

  } catch (error) {
    console.error('Error checking indexing status:', error);
    return {
      status: 'ERROR',
      message: error instanceof Error ? error.message : 'Failed to check indexing status'
    };
  }
} 