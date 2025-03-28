// Client-side utility functions for website handling

// No default website anymore
// const DEFAULT_WEBSITE = 'agencyspot.seoscientist.ai'

/**
 * Cleans a website URL by removing protocol, www, and trailing slash
 */
export function cleanWebsiteUrl(url: string): string {
  return url
    .replace(/^sc-domain:/, '') // Remove sc-domain: prefix
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '') // Remove trailing slash
}

/**
 * Extracts the website parameter from a URL
 * Checks for both 'website' and 'site' parameters
 * Used in client components
 */
export function getWebsiteFromURL(url: URL | string): string | null {
  const urlObj = typeof url === 'string' ? new URL(url) : url
  
  // Check for 'website' parameter first
  const websiteParam = urlObj.searchParams.get('website')
  if (websiteParam) return websiteParam
  
  // Then check for 'site' parameter
  const siteParam = urlObj.searchParams.get('site')
  if (siteParam) {
    // Clean the URL in case it contains protocol, www, etc.
    return cleanWebsiteUrl(siteParam)
  }
  
  // No default fallback, return null
  return null
} 