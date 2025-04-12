'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

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
  // Add timestamp to force a complete page refresh
  const timestamp = Date.now()
  
  // Set cookie for server-side access
  cookies().set('current_website', website, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  
  // Redirect to the same page with the website parameter
  redirect(`?website=${encodeURIComponent(website)}&t=${timestamp}`)
}

/**
 * Get the current website from URL parameters or cookies
 */
export async function getCurrentWebsite(urlParams?: URLSearchParams | { [key: string]: string }): Promise<string | null> {
  // Check URL parameters first
  if (urlParams) {
    // Handle both URLSearchParams and plain objects
    const getParam = (key: string) => {
      if (urlParams instanceof URLSearchParams) {
        return urlParams.get(key)
      }
      return urlParams[key] || null
    }

    // Check 'website' parameter
    const websiteFromUrl = getParam('website')
    if (websiteFromUrl) {
      return websiteFromUrl
    }

    // Check 'site' parameter (support for existing URLs)
    const siteFromUrl = getParam('site')
    if (siteFromUrl) {
      return siteFromUrl
    }
  }

  // Fallback to cookie
  const websiteFromCookie = cookies().get('current_website')
  return websiteFromCookie?.value || null
} 