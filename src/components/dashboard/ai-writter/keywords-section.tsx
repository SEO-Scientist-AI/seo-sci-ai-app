"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2, Info, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"

interface KeywordsSectionProps { 
  keywords?: string[]
  mainKeyword?: string
  isLoading?: boolean
  onKeywordSelect?: (keyword: string) => void
}

export function KeywordsSection({ 
  keywords = [], 
  mainKeyword = "",
  isLoading = false,
  onKeywordSelect
}: KeywordsSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedKeyword, setSelectedKeyword] = useState(mainKeyword)

  // Update selected keyword when mainKeyword changes
  useEffect(() => {
    if (mainKeyword && mainKeyword !== selectedKeyword) {
      setSelectedKeyword(mainKeyword)
      // Trigger analysis for main keyword if it's different
      if (onKeywordSelect) {
        onKeywordSelect(mainKeyword)
      }
    }
  }, [mainKeyword, selectedKeyword, onKeywordSelect])

  // Set initial keyword when keywords are loaded
  useEffect(() => {
    if (keywords?.length && !selectedKeyword && !mainKeyword) {
      const initialKeyword = keywords[0]
      setSelectedKeyword(initialKeyword)
      if (onKeywordSelect) {
        onKeywordSelect(initialKeyword)
      }
    }
  }, [keywords, selectedKeyword, mainKeyword, onKeywordSelect])

  const handleKeywordSelect = (value: string) => {
    setSelectedKeyword(value)
    if (onKeywordSelect) {
      onKeywordSelect(value)
    }
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Keywords</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle keywords</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Extracting keywords...</p>
          </div>
        ) : keywords && keywords.length > 0 ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">FOCUS KEYWORD</p>
              <Select value={selectedKeyword} onValueChange={handleKeywordSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a focus keyword" />
                </SelectTrigger>
                <SelectContent>
                  {keywords.map((keyword, index) => (
                    <SelectItem key={index} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">ALL KEYWORDS</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant={keyword === selectedKeyword ? "default" : "outline"}
                    className={`${
                      keyword === selectedKeyword 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    } cursor-pointer`}
                    onClick={() => {
                      navigator.clipboard.writeText(keyword)
                      toast.success(`Copied "${keyword}" to clipboard`)
                    }}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No keywords extracted yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add content to the editor to extract keywords</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 