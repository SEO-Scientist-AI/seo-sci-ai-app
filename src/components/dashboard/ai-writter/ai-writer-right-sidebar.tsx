"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CONTENT_STRUCTURE_UPDATE_EVENT, ContentStructureMetrics } from "@/components/editor"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Import section components
import { ContentScoreSection } from "./content-score-section"
import { KeywordsSection } from "./keywords-section"
import { KeywordUsageSection } from "./keyword-usage-section"
import { TitleMetaSection } from "./title-meta-section"
import { ReadabilitySection } from "./readability-section"
import { ContentStructureSection } from "./content-structure-section"
import { AiWriterToolbar } from "./ai-writer-toolbar"
import { AdvancedContentToolsSection } from "./advanced-content-tools-section"

interface SearchAnalyticsPage {
  page: string
  mainKeyword: string
  keywords: string[]
  isLoadingKeywords: boolean
  keywordUsageAnalysis: any
  isAnalyzingKeywordUsage: boolean
  titleMetaAnalysis: any
  isAnalyzingTitleMeta: boolean
  readabilityAnalysis: any
  isAnalyzingReadability: boolean
  onKeywordSelect: (keyword: string) => void
}

interface IndexingStatus {
  status: "INDEXED" | "NOT_INDEXED"
  lastCrawled?: string
}

interface PageState {
  indexStatus?: IndexingStatus
  isIndexing: boolean
  lastChecked?: number
}

// Mock sidebar context
const useSidebar = () => {
  const [pageStates, setPageStates] = useState<Record<string, PageState>>({})

  const getPageState = (url: string): PageState => {
    return pageStates[url] || { isIndexing: false }
  }

  const updatePageStatus = (url: string, status: IndexingStatus) => {
    setPageStates((prev) => ({
      ...prev,
      [url]: {
        ...prev[url],
        indexStatus: status,
        lastChecked: Date.now(),
        isIndexing: false,
      },
    }))
  }

  const setPageIndexing = (url: string, isIndexing: boolean) => {
    setPageStates((prev) => ({
      ...prev,
      [url]: {
        ...prev[url],
        isIndexing,
      },
    }))
  }

  return { getPageState, updatePageStatus, setPageIndexing }
}

// Mock API functions
const checkIndexingStatus = async (url: string): Promise<IndexingStatus> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return random status for demo
  return {
    status: Math.random() > 0.5 ? "INDEXED" : "NOT_INDEXED",
    lastCrawled: new Date().toISOString(),
  }
}

const requestIndexing = async (url: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return success for demo
  return {
    success: true,
    message: "Page submitted for indexing",
  }
}

interface RightSidebarProps {
  page: SearchAnalyticsPage | null
  onClose: () => void
  open: boolean
}

// Add dummy data for the example
const dummyPage: SearchAnalyticsPage = {
  page: "https://example.com/blog/how-to-optimize-content",
  mainKeyword: "content marketing",
  keywords: ["content marketing", "SEO", "optimization", "content strategy", "marketing metrics"],
  isLoadingKeywords: false,
  keywordUsageAnalysis: {},
  isAnalyzingKeywordUsage: false,
  titleMetaAnalysis: {},
  isAnalyzingTitleMeta: false,
  readabilityAnalysis: {},
  isAnalyzingReadability: false,
  onKeywordSelect: () => {}
}

// Navigation Tabs Component
function NavigationTabs() {
  return (
    <div className="border-b border-border">
      <div className="flex">
        <button className="px-6 py-3 text-primary border-b-2 border-primary font-medium">PERFORMANCE</button>
        <button className="px-6 py-3 text-muted-foreground hover:text-foreground">COMPETITON </button>
      </div>
    </div>
  )
}

export function RightSidebar({ page, onClose, open }: RightSidebarProps) {
  // Add state for content metrics
  const [contentMetrics, setContentMetrics] = useState<ContentStructureMetrics>({
    wordCount: 0,
    headingCount: 0,
    paragraphCount: 0,
    imageCount: 0
  })
  
  // Load initial metrics from stored content if available
  useEffect(() => {
    // Attempt to calculate initial metrics from stored content
    const storedContent = window.localStorage.getItem("novel-content");
    const storedMarkdown = window.localStorage.getItem("markdown");
    
    if (storedContent) {
      try {
        // Get word count from markdown
        const wordCount = storedMarkdown ? 
          storedMarkdown.split(/\s+/).filter(Boolean).length : 0;
        
        // Parse content JSON
        const json = JSON.parse(storedContent);
        let headingCount = 0;
        let paragraphCount = 0;
        let imageCount = 0;
        
        // Count nodes recursively
        const countNodes = (nodes: any[]) => {
          if (!nodes) return;
          for (const node of nodes) {
            if (node.type === 'heading') headingCount++;
            if (node.type === 'paragraph') paragraphCount++;
            if (node.type === 'image') imageCount++;
            if (node.content) countNodes(node.content);
          }
        };
        
        if (json.content) countNodes(json.content);
        
        // Update metrics with the calculated values
        setContentMetrics({
          wordCount: wordCount,
          headingCount: headingCount,
          paragraphCount: paragraphCount,
          imageCount: imageCount
        });
      } catch (e) {
        console.error("Failed to calculate initial metrics:", e);
      }
    }
  }, []);
  
  // Listen for content structure updates
  useEffect(() => {
    const handleContentStructureUpdate = (event: CustomEvent<ContentStructureMetrics>) => {
      setContentMetrics(event.detail);
    }
    
    // Add event listener
    document.addEventListener(
      CONTENT_STRUCTURE_UPDATE_EVENT, 
      handleContentStructureUpdate as EventListener
    )
    
    // Clean up
    return () => {
      document.removeEventListener(
        CONTENT_STRUCTURE_UPDATE_EVENT, 
        handleContentStructureUpdate as EventListener
      )
    }
  }, [])

  const handleRefreshContentStructure = () => {
                            // Manually trigger a content analysis of what's currently in the editor
                            const content = window.localStorage.getItem("novel-content");
                            const markdown = window.localStorage.getItem("markdown");
                            
                            if (!content || !markdown) {
                              toast.error("No content to analyze");
                              return;
                            }
                            
                            try {
                              // Get accurate word count from markdown
                              const wordCount = markdown.split(/\s+/).filter(Boolean).length;
                              
                              // Parse the editor's content JSON
                              const json = JSON.parse(content);
                              let headingCount = 0;
                              let paragraphCount = 0;
                              let imageCount = 0;
                              
                              // Recursive function to count content elements
                              const countNodes = (nodes: any[]) => {
                                if (!nodes) return;
                                for (const node of nodes) {
                                  if (node.type === 'heading') headingCount++;
                                  if (node.type === 'paragraph') paragraphCount++;
                                  if (node.type === 'image') imageCount++;
                                  if (node.content) countNodes(node.content);
                                }
                              };
                              
                              if (json.content) countNodes(json.content);
                              
                              // Update metrics with real values
                              const updatedMetrics = {
                                wordCount,
                                headingCount,
                                paragraphCount,
                                imageCount
                              };
                              
                              setContentMetrics(updatedMetrics);
                              toast.success("Content structure metrics refreshed");
                            } catch (error) {
                              console.error("Failed to refresh content metrics:", error);
                              toast.error("Failed to refresh content metrics");
                            }
  };

  const handlePreview = () => {
    toast.info("Preview functionality coming soon");
  };

  const handleShare = () => {
    toast.info("Share functionality coming soon");
  };

  const handleCopy = () => {
    const content = window.localStorage.getItem("markdown");
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success("Content copied to clipboard");
    } else {
      toast.error("No content to copy");
    }
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon");
  };

  const handleIntegrations = () => {
    toast.info("Integrations functionality coming soon");
  };

  return (
    <div className={cn(
      "fixed top-0 right-0 z-40 h-screen w-96 bg-background border-l",
      "overflow-y-auto scrollbar-hide"
    )}>
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <span className="text-sm font-medium">Page Analysis</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>

      <div className="px-4 py-6 space-y-6">
        <AiWriterToolbar 
          onPreview={handlePreview}
          onShare={handleShare}
          onCopy={handleCopy}
          onExport={handleExport}
          onIntegrations={handleIntegrations}
        />
        
        <NavigationTabs />

        <ContentScoreSection
          keywordUsageAnalysis={page?.keywordUsageAnalysis}
          titleMetaAnalysis={page?.titleMetaAnalysis}
          readabilityAnalysis={page?.readabilityAnalysis}
          isLoading={
            page?.isAnalyzingKeywordUsage || 
            page?.isAnalyzingTitleMeta || 
            page?.isAnalyzingReadability
          }
        />

        <ContentStructureSection 
          metrics={contentMetrics}
          onRefresh={handleRefreshContentStructure}
        />

        <KeywordsSection 
          keywords={page?.keywords}
          mainKeyword={page?.mainKeyword}
          isLoading={page?.isLoadingKeywords}
          onKeywordSelect={page?.onKeywordSelect}
        />

        <AdvancedContentToolsSection />

        <KeywordUsageSection 
          analysis={page?.keywordUsageAnalysis}
          isLoading={page?.isAnalyzingKeywordUsage}
          keyword={page?.mainKeyword}
        />

        <TitleMetaSection 
          analysis={page?.titleMetaAnalysis}
          isLoading={page?.isAnalyzingTitleMeta}
        />

        <ReadabilitySection 
          analysis={page?.readabilityAnalysis}
          isLoading={page?.isAnalyzingReadability}
          keyword={page?.mainKeyword}
        />
      </div>
    </div>
  )
}