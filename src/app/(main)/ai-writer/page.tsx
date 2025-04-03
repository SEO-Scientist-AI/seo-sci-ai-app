"use client"

import { useEffect, useState, useRef } from "react"
import Editor from "@/components/editor"
import { RightSidebar } from "@/components/dashboard/ai-writter/ai-writer-right-sidebar"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { extractKeywords } from "@/app/actions/extractKeywords"
import { evaluateKeywordUsage } from "@/app/actions/evaluateKeywordUsage"
import { evaluateTitleMeta } from "@/app/actions/evaluateTitleMeta"
import { evaluateReadability } from "@/app/actions/evaluateReadability"
import { useDebouncedCallback } from "use-debounce"
import { EDITOR_CONTENT_CHANGE_EVENT } from "@/components/editor"

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
  const [editorContent, setEditorContent] = useState<string | null>(null)
  const [pageUrl, setPageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<string>("")
  const [isExtractingKeywords, setIsExtractingKeywords] = useState(false)
  const [keywordUsageAnalysis, setKeywordUsageAnalysis] = useState<any>(null)
  const [isAnalyzingKeywordUsage, setIsAnalyzingKeywordUsage] = useState(false)
  const [titleMetaAnalysis, setTitleMetaAnalysis] = useState<any>(null)
  const [isAnalyzingTitleMeta, setIsAnalyzingTitleMeta] = useState(false)
  const [readabilityAnalysis, setReadabilityAnalysis] = useState<any>(null)
  const [isAnalyzingReadability, setIsAnalyzingReadability] = useState(false)
  const analysisInProgressRef = useRef(false)
  
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const refreshParam = searchParams.get('refresh')
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  // Listen for content changes from the editor
  useEffect(() => {
    const handleContentChange = () => {
      const markdown = window.localStorage.getItem("markdown");
      if (markdown && markdown !== editorContent) {
        setEditorContent(markdown);
      }
    };

    // Listen for editor content change events
    document.addEventListener(EDITOR_CONTENT_CHANGE_EVENT, handleContentChange);
    
    // Initial load from localStorage
    handleContentChange();
    
    return () => {
      document.removeEventListener(EDITOR_CONTENT_CHANGE_EVENT, handleContentChange);
    };
  }, [editorContent]);

  // Debounced content analysis
  const runContentAnalysis = useDebouncedCallback(async () => {
    // Skip if analysis is already in progress
    if (analysisInProgressRef.current) return;
    
    // Get current content from localStorage
    const markdown = window.localStorage.getItem("markdown");
    if (!markdown) return;
    
    console.log("Running content analysis after 5-second debounce");
    analysisInProgressRef.current = true;
    
    try {
      // Extract keywords first
      setIsExtractingKeywords(true);
      const keywords = await extractKeywords(markdown);
      setExtractedKeywords(keywords);
      setIsExtractingKeywords(false);
      
      // Select first keyword if none selected
      const keyword = selectedKeyword || keywords[0] || "";
      if (!selectedKeyword && keywords.length > 0) {
        setSelectedKeyword(keywords[0]);
      }
      
      // Run analysis in parallel
      const [keywordAnalysis, titleMetaResult, readabilityResult] = await Promise.all([
        // Keyword usage analysis
        (async () => {
          if (!keyword) return null;
          setIsAnalyzingKeywordUsage(true);
          try {
            return await evaluateKeywordUsage(markdown, keyword);
          } catch (err) {
            console.error("Error analyzing keyword usage:", err);
            return null;
          } finally {
            setIsAnalyzingKeywordUsage(false);
          }
        })(),
        
        // Title & meta analysis
        (async () => {
          setIsAnalyzingTitleMeta(true);
          try {
            // Get the metadata from localStorage
            const pageUrl = window.localStorage.getItem("editing-page-url");
            if (!pageUrl) {
              console.log("No page URL found in localStorage");
              return null;
            }
            
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
            return await evaluateTitleMeta({
              title: data.metadata.title,
              description: data.metadata.description
            });
          } catch (err) {
            console.error("Error analyzing title and meta:", err);
            return null;
          } finally {
            setIsAnalyzingTitleMeta(false);
          }
        })(),
        
        // Readability analysis
        (async () => {
          if (!keyword) return null;
          setIsAnalyzingReadability(true);
          try {
            return await evaluateReadability(markdown, keyword);
          } catch (err) {
            console.error("Error analyzing readability:", err);
            return null;
          } finally {
            setIsAnalyzingReadability(false);
          }
        })()
      ]);
      
      // Update state with results
      if (keywordAnalysis) setKeywordUsageAnalysis(keywordAnalysis);
      if (titleMetaResult) setTitleMetaAnalysis(titleMetaResult);
      if (readabilityResult) setReadabilityAnalysis(readabilityResult);
      
    } catch (err) {
      console.error("Error during content analysis:", err);
    } finally {
      analysisInProgressRef.current = false;
    }
  }, 5000); // 5-second debounce
  
  // Trigger content analysis when editor content changes
  useEffect(() => {
    if (editorContent) {
      runContentAnalysis();
    }
  }, [editorContent, runContentAnalysis]);
  
  // Handle keyword selection
  const handleKeywordSelect = async (keyword: string) => {
    if (keyword === selectedKeyword) return;
    
    setSelectedKeyword(keyword);
    
    // Skip if no content
    if (!editorContent) return;
    
    // Reset analyses
    setKeywordUsageAnalysis(null);
    setReadabilityAnalysis(null);
    
    // Run new analyses with selected keyword
    const markdown = editorContent;
    
    // Analyze keyword usage
    setIsAnalyzingKeywordUsage(true);
    try {
      const keywordAnalysis = await evaluateKeywordUsage(markdown, keyword);
      setKeywordUsageAnalysis(keywordAnalysis);
    } catch (err) {
      console.error("Error analyzing keyword usage:", err);
    } finally {
      setIsAnalyzingKeywordUsage(false);
    }

    // Analyze readability
    setIsAnalyzingReadability(true);
    try {
      const readabilityResult = await evaluateReadability(markdown, keyword);
      setReadabilityAnalysis(readabilityResult);
    } catch (err) {
      console.error("Error analyzing readability:", err);
    } finally {
      setIsAnalyzingReadability(false);
    }
  }
  
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
        setEditorContent(data.content)
      } catch (err) {
        console.error("Error fetching page content:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch page content")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPageContent()
  }, [url, refreshParam])

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
            mainKeyword: selectedKeyword,
            keywords: extractedKeywords,
            isLoadingKeywords: isExtractingKeywords,
            keywordUsageAnalysis: keywordUsageAnalysis,
            isAnalyzingKeywordUsage: isAnalyzingKeywordUsage,
            titleMetaAnalysis: titleMetaAnalysis,
            isAnalyzingTitleMeta: isAnalyzingTitleMeta,
            readabilityAnalysis: readabilityAnalysis,
            isAnalyzingReadability: isAnalyzingReadability,
            onKeywordSelect: handleKeywordSelect
          } as any : null}
          onClose={handleCloseSidebar}
          open={sidebarOpen}
        />
      </div>
    </div>
  )
}