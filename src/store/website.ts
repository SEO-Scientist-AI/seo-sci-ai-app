import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WebsiteStore {
  currentWebsite: string
  setCurrentWebsite: (website: string) => void
}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      currentWebsite: 'agencyspot.seoscientist.ai',
      setCurrentWebsite: (website) => set({ currentWebsite: website }),
    }),
    {
      name: 'website-storage',
    }
  )
) 