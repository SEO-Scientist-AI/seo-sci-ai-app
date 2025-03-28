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
      coverageState?: string;
      isIndexed?: boolean;
      lastCrawlTime?: string;
      pageFetchState?: string;
      robotsTxtState?: string;
      indexingState?: string;
      verdict?: string;
    };
  };
}

export async function checkIndexingStatus(
  url: string,
  urlParams?: URLSearchParams
): Promise<IndexingStatus> {
  const searchUrl = url.includes('http') ? url : `https://${url}`;
  
  try {
    const session = await auth();
    const currentWebsite = await getCurrentWebsite(urlParams);
    
    if (!session?.user || !session.accessToken) {
      throw new Error("Unauthorized");
    }
    
    // Check if no website is selected
    if (!currentWebsite) {
      return {
        status: 'ERROR',
        message: 'No website selected. Please select a website to check indexing status.'
      };
    }

    // Format for Google Search Console API
    const apiSiteUrl = currentWebsite.startsWith('sc-domain:')
      ? currentWebsite
      : `sc-domain:${currentWebsite}`;

    console.log(`Checking indexing status for ${searchUrl} in property ${apiSiteUrl}`);
    
    const response = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionUrl: searchUrl,
          siteUrl: apiSiteUrl
        })
      }
    );

    if (!response.ok) {
      const error = await response.json() as { error?: { message: string } };
      throw new Error(error.error?.message || 'Failed to check indexing status');
    }

    const data = await response.json() as InspectionResponse;
    console.log('Inspection results:', JSON.stringify(data, null, 2));
    
    // First check if the indexed field is true
    if (data.inspectionResult?.indexStatusResult?.isIndexed === true) {
      return {
        status: 'INDEXED',
        lastCrawled: data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        message: 'This page is indexed by Google'
      };
    }
    
    // Check for verdict "PASS" which means the URL is valid and indexed
    if (data.inspectionResult?.indexStatusResult?.verdict === 'PASS') {
      return {
        status: 'INDEXED',
        lastCrawled: data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        message: 'This page is indexed by Google'
      };
    }
    
    // Check coverage state for signs of indexing
    const coverageState = data.inspectionResult?.indexStatusResult?.coverageState;
    if (coverageState === 'Submitted and indexed' || 
        coverageState === 'Indexed, not submitted' || 
        coverageState === 'Indexed') {
      return {
        status: 'INDEXED',
        lastCrawled: data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        message: 'This page is indexed by Google'
      };
    }
    
    // Check indexing state
    const indexingState = data.inspectionResult?.indexStatusResult?.indexingState;
    if (indexingState === 'INDEXING_ALLOWED' || indexingState === 'INDEXED') {
      return {
        status: 'INDEXED',
        lastCrawled: data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        message: 'This page is indexed by Google'
      };
    }

    // If we have lastCrawlTime but none of the above indexed states, it might still be indexed
    if (data.inspectionResult?.indexStatusResult?.lastCrawlTime) {
      return {
        status: 'INDEXED',
        lastCrawled: data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        message: 'This page appears to be indexed by Google'
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