"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Info, Loader2, CheckCircle2, XCircle } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KeywordUsageSectionProps {
  analysis?: {
    title_tag_contains_keyword: boolean
    meta_description_contains_keyword: boolean
    h1_contains_keyword: boolean
    first_100_words_contains_keyword: boolean
  }
  isLoading?: boolean
  keyword?: string
}

export function KeywordUsageSection({
  analysis,
  isLoading = false,
  keyword = ""
}: KeywordUsageSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  const checklistItems = useMemo(() => [
    {
      id: 'title_tag',
      label: `"${keyword}" found in Title Tag`,
      value: analysis?.title_tag_contains_keyword,
      tooltip: "Your focus keyword should appear in the page title"
    },
    {
      id: 'meta_description',
      label: `"${keyword}" found in Meta Description`,
      value: analysis?.meta_description_contains_keyword,
      tooltip: "Include your focus keyword in the meta description"
    },
    {
      id: 'h1',
      label: `"${keyword}" found in H1`,
      value: analysis?.h1_contains_keyword,
      tooltip: "Your focus keyword should appear in the main heading"
    },
    {
      id: 'first_100_words',
      label: `"${keyword}" found in first 100 words`,
      value: analysis?.first_100_words_contains_keyword,
      tooltip: "Include your focus keyword early in the content"
    }
  ], [analysis, keyword])

  const completedItems = checklistItems.filter(item => item.value).length

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">Keyword Usage</h4>
          {!isLoading && analysis && completedItems < checklistItems.length && (
            <Badge variant="destructive" className="h-5 text-xs">
              {checklistItems.length - completedItems} remaining
            </Badge>
          )}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle keyword usage</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing keyword usage...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-2">
            {checklistItems.map(item => (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        {item.value ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Select a focus keyword to analyze usage</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 