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
import { Progress } from "@/components/ui/progress"

interface TitleMetaAnalysis {
  title_within_55_60_chars: boolean
  meta_description_within_150_160_chars: boolean
  title_length?: number
  meta_description_length?: number
}

interface TitleMetaSectionProps {
  analysis?: TitleMetaAnalysis
  isLoading?: boolean
}

export function TitleMetaSection({
  analysis,
  isLoading = false
}: TitleMetaSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  const checklistItems = [
    {
      id: 'title_length',
      label: 'Title length is between 55-60 characters',
      value: analysis?.title_within_55_60_chars,
      info: 'Title should be between 55-60 characters for optimal display in search results',
      current: analysis?.title_length || 0,
      min: 55,
      max: 60,
      type: 'title'
    },
    {
      id: 'meta_description_length',
      label: 'Meta description length between 150-160 characters',
      value: analysis?.meta_description_within_150_160_chars,
      info: 'Meta description should be between 150-160 characters for optimal display in search results',
      current: analysis?.meta_description_length || 0,
      min: 150,
      max: 160,
      type: 'meta'
    }
  ]

  // Calculate completed items
  const completedCount = analysis ? 
    Object.values(analysis).filter(Boolean).length : 0
  const totalCount = checklistItems.length
  const allCompleted = completedCount === totalCount
  const remainingCount = totalCount - completedCount

  const getProgressColor = (current: number, min: number, max: number) => {
    if (current >= min && current <= max) return "bg-green-500"
    if (current < min) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getProgressValue = (current: number, min: number, max: number) => {
    if (current <= max) return (current / max) * 100
    return 100
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">Title & Meta</h4>
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
            <span className="sr-only">Toggle title and meta analysis</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing title and meta description...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {checklistItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
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
                    title={item.info}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
                <div className="px-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.current} characters</span>
                    <span>{item.min}-{item.max} recommended</span>
                  </div>
                  <Progress 
                    value={getProgressValue(item.current, item.min, item.max)} 
                    className={`h-2 ${getProgressColor(item.current, item.min, item.max)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No title and meta analysis available</p>
            <p className="text-xs text-muted-foreground mt-1">Add content to analyze title and meta description</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}