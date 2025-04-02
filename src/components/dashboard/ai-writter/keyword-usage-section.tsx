"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle2, XCircle, Loader2, Info } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface KeywordUsageAnalysis {
  title_tag_contains_keyword: boolean
  meta_description_contains_keyword: boolean
  h1_contains_keyword: boolean
  first_100_words_contains_keyword: boolean
}

interface KeywordUsageSectionProps {
  analysis?: KeywordUsageAnalysis
  isLoading?: boolean
  mainKeyword?: string
}

export function KeywordUsageSection({
  analysis,
  isLoading = false,
  mainKeyword = ""
}: KeywordUsageSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  const checklistItems = [
    {
      id: 'title_tag',
      label: `"${mainKeyword}" found in Title Tag`,
      value: analysis?.title_tag_contains_keyword
    },
    {
      id: 'meta_description',
      label: `"${mainKeyword}" found in Meta Description`,
      value: analysis?.meta_description_contains_keyword
    },
    {
      id: 'h1',
      label: `"${mainKeyword}" found in H1`,
      value: analysis?.h1_contains_keyword
    },
    {
      id: 'first_100_words',
      label: `"${mainKeyword}" found in first 100 words`,
      value: analysis?.first_100_words_contains_keyword
    }
  ]

  // Calculate completed items
  const completedCount = analysis ? 
    Object.values(analysis).filter(Boolean).length : 0
  const totalCount = checklistItems.length
  const allCompleted = completedCount === totalCount
  const remainingCount = totalCount - completedCount

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">Keyword Usage</h4>
          {!isLoading && analysis && (
            allCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Badge 
                variant="destructive" 
                className="h-5 px-1.5 text-xs font-medium"
              >
                {remainingCount} remaining
              </Badge>
            )
          )}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle keyword usage analysis</span>
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
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  {item.value ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">{item.label}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No keyword usage analysis available</p>
            <p className="text-xs text-muted-foreground mt-1">Add content and keywords to analyze usage</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
} 