"use client"

import { useEffect, useState } from "react"
import Editor from "@/components/editor"
import { RightSidebar } from "@/components/dashboard/ai-writter/ai-writer-right-sidebar"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { extractKeywords } from "@/app/actions/extractKeywords"
import { evaluateKeywordUsage } from "@/app/actions/evaluateKeywordUsage"
import { evaluateTitleMeta } from "@/app/actions/evaluateTitleMeta"
import { evaluateReadability } from "@/app/actions/evaluateReadability"

export const runtime = 'edge';

// Define types for the scrape API response
interface ScrapeResponse {
  url: string;
  title: string;
  description: string;
  content: string;
  links: string[];
  images: string[];
  metadata: {
    title: string;
    description: string;
    author: string;
    date: string;
    sitename: string;
    url: string;
  };
}

export default function AIWriter() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pageContent, setPageContent] = useState<string | null>(null)
  const [pageUrl, setPageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([])
  const [isExtractingKeywords, setIsExtractingKeywords] = useState(false)
  const [keywordUsageAnalysis, setKeywordUsageAnalysis] = useState<any>(null)
  const [isAnalyzingKeywordUsage, setIsAnalyzingKeywordUsage] = useState(false)
  const [titleMetaAnalysis, setTitleMetaAnalysis] = useState<any>(null)
  const [isAnalyzingTitleMeta, setIsAnalyzingTitleMeta] = useState(false)
  const [readabilityAnalysis, setReadabilityAnalysis] = useState<any>(null)
  const [isAnalyzingReadability, setIsAnalyzingReadability] = useState(false)
  
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const refreshParam = searchParams.get('refresh')
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }
  
  // Fetch keywords when pageContent changes
  useEffect(() => {
    const getKeywords = async () => {
      if (!pageContent) return
      
      setIsExtractingKeywords(true)
      try {
        const keywords = await extractKeywords(pageContent)
        setExtractedKeywords(keywords)
      } catch (err) {
        console.error("Error extracting keywords:", err)
      } finally {
        setIsExtractingKeywords(false)
      }
    }
    
    getKeywords()
  }, [pageContent])
  
  // Fetch page content if URL is provided
  useEffect(() => {
    const fetchPageContent = async () => {
      if (!url) return
      
      setIsLoading(true)
      setError(null)
      setPageUrl(url)
      
      try {
        console.log("Fetching content for URL:", url, "Refresh:", refreshParam)
        
        // Browser-safe base64 encoding for client-side
        const credentials = window.btoa(
          `${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
        )
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/scrape/page`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: url.startsWith("http") ? url : `https://${url}`,
              include_markdown: true,
              include_links: true,
              include_images: true,
              force_refresh: Boolean(refreshParam), // Tell the API to ignore cache if refresh param exists
            }),
          }
        )
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error Response:", errorText)
          throw new Error(`Failed to fetch page content: ${response.status} ${errorText}`)
        }
        
        const data = await response.json() as ScrapeResponse
        console.log("Received page content:", data)
        
        // Use the markdown content from the API
        setPageContent(data.content)
      } catch (err) {
        console.error("Error fetching page content:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch page content")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPageContent()
  }, [url, refreshParam])

  // Add new useEffect for keyword usage analysis
  useEffect(() => {
    const analyzeKeywordUsage = async () => {
      if (!pageContent || !extractedKeywords.length) return
      
      setIsAnalyzingKeywordUsage(true)
      try {
        const analysis = await evaluateKeywordUsage(pageContent, extractedKeywords[0])
        setKeywordUsageAnalysis(analysis)
      } catch (err) {
        console.error("Error analyzing keyword usage:", err)
      } finally {
        setIsAnalyzingKeywordUsage(false)
      }
    }
    
    analyzeKeywordUsage()
  }, [pageContent, extractedKeywords])

  // Add new useEffect for title meta analysis
  useEffect(() => {
    const analyzeTitleMeta = async () => {
      if (!pageContent) return
      
      setIsAnalyzingTitleMeta(true)
      try {
        // Get the metadata from localStorage
        const pageUrl = window.localStorage.getItem("editing-page-url");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/scrape/page`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Basic ${window.btoa(
                `${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
              )}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: pageUrl?.startsWith("http") ? pageUrl : `https://${pageUrl}`,
              include_markdown: false,
              include_links: false,
              include_images: false,
              force_refresh: false,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status}`);
        }

        const data = (await response.json()) as ScrapeResponse;
        const analysis = await evaluateTitleMeta({
          title: data.metadata.title,
          description: data.metadata.description
        });
        setTitleMetaAnalysis(analysis);
      } catch (err) {
        console.error("Error analyzing title and meta:", err)
      } finally {
        setIsAnalyzingTitleMeta(false)
      }
    }
    
    analyzeTitleMeta()
  }, [pageContent])

  // Add new useEffect for readability analysis
  useEffect(() => {
    const analyzeReadability = async () => {
      if (!pageContent || !extractedKeywords.length) return
      
      setIsAnalyzingReadability(true)
      try {
        const analysis = await evaluateReadability(pageContent, extractedKeywords[0])
        setReadabilityAnalysis(analysis)
      } catch (err) {
        console.error("Error analyzing readability:", err)
      } finally {
        setIsAnalyzingReadability(false)
      }
    }
    
    analyzeReadability()
  }, [pageContent, extractedKeywords])
  
  return (
    <div className="relative flex w-full h-screen overflow-auto scrollbar-hide">
      {/* Main editor area - takes remaining space and centers content */}
      <div className={cn(
        "flex-1 flex justify-center transition-all duration-200 ease-in-out min-h-screen",
        sidebarOpen ? "mr-96" : "mr-0"
      )}>
        <div className="w-full max-w-4xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-medium">Loading page content...</p>
                  <p className="text-sm text-muted-foreground">{pageUrl}</p>
                </div>
                <div className="space-y-4 w-[800px]">
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-lg font-medium">Error Loading Content</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <p className="text-sm text-muted-foreground">Starting with a blank editor instead.</p>
                <Editor />
              </div>
            </div>
          ) : (
            <Editor pageUrl={pageUrl || undefined} pageContent={pageContent || undefined} />
          )}
        </div>
      </div>

      {/* Right sidebar - fixed width and position */}
      <div className={cn(
        "fixed top-0 right-0 h-screen transition-all duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <RightSidebar 
          page={pageUrl ? { 
            page: pageUrl, 
            mainKeyword: extractedKeywords[0] || "", 
            keywords: extractedKeywords,
            isLoadingKeywords: isExtractingKeywords,
            keywordUsageAnalysis: keywordUsageAnalysis,
            isAnalyzingKeywordUsage: isAnalyzingKeywordUsage,
            titleMetaAnalysis: titleMetaAnalysis,
            isAnalyzingTitleMeta: isAnalyzingTitleMeta,
            readabilityAnalysis: readabilityAnalysis,
            isAnalyzingReadability: isAnalyzingReadability
          } as any : null}
          onClose={handleCloseSidebar}
          open={sidebarOpen}
        />
      </div>
    </div>
  )
}