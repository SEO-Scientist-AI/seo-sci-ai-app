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

interface ReadabilityAnalysis {
  has_short_paragraphs: boolean
  uses_conversational_tone: boolean
  passive_voice_under_10_percent: boolean
  matches_user_intent: boolean
  uses_emotion_and_storytelling: boolean
}

interface ReadabilitySectionProps {
  analysis?: {
    has_short_paragraphs: boolean
    uses_conversational_tone: boolean
    passive_voice_under_10_percent: boolean
    matches_user_intent: boolean
    uses_emotion_and_storytelling: boolean
  }
  isLoading?: boolean
  keyword?: string
}

export function ReadabilitySection({
  analysis,
  isLoading = false,
  keyword
}: ReadabilitySectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  const checklistItems = [
    {
      id: 'paragraphs',
      label: 'Short, scannable paragraphs',
      value: analysis?.has_short_paragraphs,
      info: 'Paragraphs should be short and easy to read for better engagement'
    },
    {
      id: 'tone',
      label: 'Conversational tone',
      value: analysis?.uses_conversational_tone,
      info: 'Content should use a friendly, conversational tone to engage readers'
    },
    {
      id: 'passive_voice',
      label: 'Limited passive voice (<10%)',
      value: analysis?.passive_voice_under_10_percent,
      info: 'Keep passive voice usage under 10% for clearer, more engaging writing'
    },
    {
      id: 'user_intent',
      label: 'Matches user intent',
      value: analysis?.matches_user_intent,
      info: 'Content should align with the user\'s search intent and expectations'
    },
    {
      id: 'storytelling',
      label: 'Uses emotion & storytelling',
      value: analysis?.uses_emotion_and_storytelling,
      info: 'Incorporate emotional elements and storytelling to create compelling content'
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
          <h4 className="text-sm font-medium text-muted-foreground">Readability</h4>
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
            <span className="sr-only">Toggle readability analysis</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing content readability...</p>
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
                  title={item.info}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No readability analysis available</p>
            <p className="text-xs text-muted-foreground mt-1">Add content to analyze readability</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}