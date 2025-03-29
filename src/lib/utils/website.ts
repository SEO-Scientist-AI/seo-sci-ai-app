// Client-side utility functions for website handling
// NOTE: We only use localStorage for website selection persistence (no cookies)

// No default website anymore
// const DEFAULT_WEBSITE = 'agencyspot.seoscientist.ai'

// localStorage key for storing the selected website
export const WEBSITE_STORAGE_KEY = 'selectedWebsite'

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

/**
 * Saves the selected website to localStorage
 * This is the only persistent storage method we use for website selection
 */
export function saveWebsiteToLocalStorage(website: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(WEBSITE_STORAGE_KEY, website)
    } catch (error) {
      console.error('Failed to save website to localStorage:', error)
    }
  }
}

/**
 * Gets the selected website from localStorage
 * Used as a fallback when no website is specified in the URL
 */
export function getWebsiteFromLocalStorage(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(WEBSITE_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to get website from localStorage:', error)
    }
  }
  return null
} 