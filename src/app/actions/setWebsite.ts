'use server'

import { redirect } from 'next/navigation'

// No default website anymore
// const DEFAULT_WEBSITE = 'agencyspot.seoscientist.ai'

// Helper to clean URLs - remove protocol, www, and trailing slash
function cleanWebsiteUrl(url: string): string {
  return url
    .replace(/^sc-domain:/, '') // Remove sc-domain: prefix
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '') // Remove trailing slash
}

/**
 * Server action to set the current website and redirect
 */
export async function setWebsite(website: string) {
  // Clean up the URL
  const cleanUrl = cleanWebsiteUrl(website)
  
  // Redirect to the same page with the website parameter
  // This creates a URL parameter that will persist as users navigate
  // Add a timestamp to force a complete page refresh
  const timestamp = Date.now();
  redirect(`?website=${encodeURIComponent(cleanUrl)}&t=${timestamp}`);
}

/**
 * Get the current website from URL parameters only
 */
export async function getCurrentWebsite(urlParams?: URLSearchParams): Promise<string | null> {
  console.log("getCurrentWebsite called with urlParams:", urlParams ? Object.fromEntries(urlParams.entries()) : 'undefined');
  
  if (!urlParams) {
    console.log("No URL parameters provided");
    return null;
  }
  
  // Check 'website' parameter
  if (urlParams.has('website')) {
    const websiteFromUrl = urlParams.get('website')
    console.log("Found 'website' parameter:", websiteFromUrl);
    if (websiteFromUrl) {
      return websiteFromUrl;
    }
  }
  
  // Check 'site' parameter (support for existing URLs)
  if (urlParams.has('site')) {
    const siteFromUrl = urlParams.get('site')
    console.log("Found 'site' parameter:", siteFromUrl);
    if (siteFromUrl) {
      // Clean the URL
      return cleanWebsiteUrl(siteFromUrl);
    }
  }
  
  console.log("No website parameter found in URL");
  return null; // Return null if no website is selected
} 