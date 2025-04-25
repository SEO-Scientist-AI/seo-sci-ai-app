'use server'

import { auth } from "@/server/auth";
import { getCurrentWebsite } from "./setWebsite";
import { useAuditStore } from '@/store/audit-store'

interface GSCUrlsResponse {
  rows?: Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    position: number;
  }>;
}

interface GSCSitesResponse {
  siteEntry: Array<{
    siteUrl: string;
    permissionLevel: string;
  }>;
}

/**
 * Fetches all URLs from Google Search Console for a website
 * @param domain Optional domain parameter, otherwise uses currently selected website
 * @returns Array of URLs from the website
 */
export async function getGSCUrls(
  domain?: string | null,
  urlParams?: URLSearchParams
): Promise<string[]> {
  try {
    const session = await auth();
    const websiteFromParams = domain || await getCurrentWebsite(urlParams);
    
    // Check if no website is selected
    if (!websiteFromParams) {
      console.log('No website selected for URL fetching');
      return [];
    }
    
    // At this point, websiteFromParams is guaranteed to be a string
    const currentWebsite = websiteFromParams;
    console.log(`Fetching URLs for website: ${currentWebsite}`);
    
    if (!session?.accessToken) {
      throw new Error("Unauthorized - Please sign in again");
    }

    // First, verify access to the property
    try {
      const verifyResponse = await fetch(
        'https://www.googleapis.com/webmasters/v3/sites',
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!verifyResponse.ok) {
        throw new Error(`Failed to verify site access: ${verifyResponse.statusText}`);
      }

      const sites = await verifyResponse.json() as GSCSitesResponse;
      const siteEntry = sites.siteEntry || [];
      
      // Check if the site exists in the user's GSC account
      const siteExists = siteEntry.some(site => {
        const siteUrl = site.siteUrl.replace(/\/$/, ''); // Remove trailing slash
        const currentSite = currentWebsite.replace(/\/$/, ''); // Remove trailing slash
        return siteUrl === currentSite || siteUrl === `sc-domain:${currentSite}`;
      });

      if (!siteExists) {
        throw new Error(`No access to site ${currentWebsite} in Google Search Console`);
      }
    } catch (error) {
      console.error('Error verifying site access:', error);
      throw error;
    }

    // Format for Google Search Console API
    // Try both domain and URL property formats if needed
    const apiSiteUrl = currentWebsite.includes('sc-domain:') 
      ? currentWebsite 
      : currentWebsite.startsWith('http') 
        ? currentWebsite
        : `sc-domain:${currentWebsite}`;

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 1)
    const endDate = new Date()

    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(apiSiteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          dimensions: ['page'],
          rowLimit: 25000
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GSC API Error:', errorText);
      throw new Error(`Failed to fetch URLs: ${response.statusText}`);
    }

    const data: GSCUrlsResponse = await response.json()
    
    if (!data.rows) {
      return []
    }

    // Extract URLs from response
    const urls = data.rows.map(row => row.keys[0])
    
    // Store URLs in the audit store
    useAuditStore.getState().setUrls(urls)
    
    return urls

  } catch (error) {
    console.error('Error fetching GSC URLs:', error)
    throw error
  }
}

// Helper function for testing
export async function getMockGSCUrls(domain: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const pageTypes = [
    { path: "", count: 1 },
    { path: "about", count: 1 },
    { path: "contact", count: 1 },
    { path: "blog", count: 1 },
    { path: "blog/post-", count: 20 },
    { path: "products", count: 1 },
    { path: "products/product-", count: 15 },
  ]
  
  const urls: string[] = []
  
  pageTypes.forEach(({ path, count }) => {
    if (count === 1) {
      urls.push(path === "" ? `https://${domain}` : `https://${domain}/${path}`)
    } else {
      for (let i = 1; i <= count; i++) {
        urls.push(`https://${domain}/${path}${i}`)
      }
    }
  })
  
  return urls
} 