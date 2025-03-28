'use server'

import { auth } from "@/server/auth";
import { cleanWebsiteUrl } from "@/lib/utils/website";

interface GSCSitesResponse {
  siteEntry: {
    siteUrl: string;
    permissionLevel: string;
  }[];
}

/**
 * Get list of websites from Google Search Console for the website selector
 */
export async function getAvailableWebsites(): Promise<string[]> {
  try {
    const session = await auth();
    
    if (!session?.user || !session.accessToken) {
      console.log('Not authenticated - returning empty website list');
      return [];
    }

    // Fetch sites from Google Search Console API
    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites',
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch GSC properties');
      return [];
    }

    const data = await response.json() as GSCSitesResponse;
    
    // Format domain names to be user-friendly
    const websiteList = data.siteEntry?.map(site => {
      // Remove the sc-domain: prefix and clean the URL
      return cleanWebsiteUrl(site.siteUrl);
    }) || [];
    
    console.log('Available websites:', websiteList);
    
    // Return the list, never defaults
    return websiteList;

  } catch (error) {
    console.error('Error fetching websites:', error);
    return [];
  }
} 