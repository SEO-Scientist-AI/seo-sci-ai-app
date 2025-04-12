import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Helper to clean URLs - moved from setWebsite.ts
function cleanWebsiteUrl(url: string): string {
  return url
    .replace(/^sc-domain:/, '') // Remove sc-domain: prefix
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '') // Remove trailing slash
}

interface WebsiteState {
  currentWebsite: string | null
  previousWebsites: string[]
  isLoading: boolean
}

interface WebsiteActions {
  setCurrentWebsite: (website: string) => void
  addToPreviousWebsites: (website: string) => void
  setIsLoading: (loading: boolean) => void
  clearCurrentWebsite: () => void
}

type WebsiteStore = WebsiteState & WebsiteActions

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      // Initial state
      currentWebsite: null,
      previousWebsites: [],
      isLoading: false,

      // Actions
      setCurrentWebsite: (website) => {
        const cleanUrl = cleanWebsiteUrl(website)
        set((state) => {
          // Don't add duplicate to history
          if (state.currentWebsite !== cleanUrl) {
            return {
              currentWebsite: cleanUrl,
              previousWebsites: Array.from(new Set([
                cleanUrl,
                ...state.previousWebsites.filter((w) => w !== cleanUrl),
              ])).slice(0, 10), // Keep last 10 websites
            }
          }
          return { currentWebsite: cleanUrl }
        })
      },

      addToPreviousWebsites: (website) => {
        const cleanUrl = cleanWebsiteUrl(website)
        set((state) => ({
          previousWebsites: Array.from(new Set([
            cleanUrl,
            ...state.previousWebsites.filter((w) => w !== cleanUrl),
          ])).slice(0, 10),
        }))
      },

      setIsLoading: (loading) => set({ isLoading: loading }),
      
      clearCurrentWebsite: () => set({ currentWebsite: null }),
    }),
    {
      name: 'website-storage',
    }
  )
) 