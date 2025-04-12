'use client'

import { useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWebsiteStore } from '@/store/website'
import { setWebsite } from '@/app/actions/setWebsite'

export function useWebsite() {
  const searchParams = useSearchParams()
  const { 
    currentWebsite, 
    setCurrentWebsite, 
    previousWebsites, 
    isLoading, 
    setIsLoading 
  } = useWebsiteStore()

  // Sync URL parameters with store
  useEffect(() => {
    const syncWebsite = async () => {
      const website = searchParams.get('website') || searchParams.get('site')
      if (website && website !== currentWebsite) {
        setIsLoading(true)
        try {
          setCurrentWebsite(website)
          // Only call setWebsite server action if we don't already have the website in URL
          if (!searchParams.has('website') && !searchParams.has('site')) {
            await setWebsite(website)
          }
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    syncWebsite()
  }, [searchParams, currentWebsite, setCurrentWebsite, setIsLoading])

  // Function to change website with server action
  const changeWebsite = useCallback(async (website: string) => {
    try {
      setIsLoading(true)
      setCurrentWebsite(website) // Update store immediately
      await setWebsite(website)  // Then update server-side state
    } catch (error) {
      console.error('Failed to change website:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setCurrentWebsite, setIsLoading])

  return {
    currentWebsite,
    previousWebsites,
    isLoading,
    changeWebsite
  }
} 