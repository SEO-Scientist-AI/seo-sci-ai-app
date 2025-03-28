'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getWebsiteFromURL } from '@/lib/utils/website'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

type WebsiteSelectorProps = {
  websites: string[]
  className?: string
}

export function WebsiteSelector({ 
  websites = [],
  className 
}: WebsiteSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get current website from URL
  const [selectedWebsite, setSelectedWebsite] = useState<string>('')
  
  // Set the selected website when the component mounts or URL changes
  useEffect(() => {
    try {
      const currentWebsite = getWebsiteFromURL(window.location.href)
      
      if (currentWebsite) {
        setSelectedWebsite(currentWebsite)
      } else {
        setSelectedWebsite('')
      }
    } catch (error) {
      console.error("Error getting website from URL:", error)
      setSelectedWebsite('')
    }
  }, [searchParams])
  
  // Handle website change
  const handleWebsiteChange = (website: string) => {
    // If the website selection hasn't changed, don't do anything
    if (website === selectedWebsite) return;
    
    // Create new URLSearchParams to maintain other query parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Set the new website parameter
    params.set('website', website)
    
    // Build the new URL with updated parameters
    const newUrl = `${pathname}?${params.toString()}`
    
    // Use window.location for a full page reload to ensure all data is refreshed
    window.location.href = newUrl
  }
  
  // Format website for display (remove common prefixes/suffixes if needed)
  const formatWebsiteForDisplay = (url: string) => {
    // Just return the domain as is - we've already cleaned it
    return url;
  }
  
  // If we have no websites, don't render the selector
  if (websites.length === 0) {
    return null;
  }
  
  return (
    <Select value={selectedWebsite || ""} onValueChange={handleWebsiteChange}>
      <SelectTrigger 
        className={cn(
          "w-[200px] h-9 px-3 border-muted-foreground/20 bg-background", 
          className
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <SelectValue 
            placeholder="Select website" 
            className="text-sm truncate"
          />
        </div>
      </SelectTrigger>
      <SelectContent align="end">
        {websites.map((website) => (
          <SelectItem key={website} value={website} className="text-sm py-1.5">
            {formatWebsiteForDisplay(website)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 