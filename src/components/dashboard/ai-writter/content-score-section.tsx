"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircularProgress } from "@/components/dashboard/circular-score"
import { calculateContentScore } from "@/app/actions/calculateContentScore"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ContentScoreSectionProps {
  keywordUsageAnalysis?: {
    title_tag_contains_keyword: boolean
    meta_description_contains_keyword: boolean
    h1_contains_keyword: boolean
    first_100_words_contains_keyword: boolean
  }
  titleMetaAnalysis?: {
    title_within_55_60_chars: boolean
    meta_description_within_150_160_chars: boolean
  }
  readabilityAnalysis?: {
    has_short_paragraphs: boolean
    uses_conversational_tone: boolean
    passive_voice_under_10_percent: boolean
    matches_user_intent: boolean
    uses_emotion_and_storytelling: boolean
  }
  isLoading?: boolean
}

interface ScoreBreakdown {
  keyword_usage: number
  title_meta: number
  readability: number
}

export function ContentScoreSection({ 
  keywordUsageAnalysis,
  titleMetaAnalysis,
  readabilityAnalysis,
  isLoading = false
}: ContentScoreSectionProps) {
  const [score, setScore] = useState<number>(0)
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculate score when any analysis changes
  useEffect(() => {
    calculateScore()
  }, [keywordUsageAnalysis, titleMetaAnalysis, readabilityAnalysis])

  const calculateScore = async () => {
    // Don't calculate if loading or already calculating
    if (isLoading || isCalculating) return

    // Don't calculate if we don't have all analyses
    if (!keywordUsageAnalysis || !titleMetaAnalysis || !readabilityAnalysis) {
      setScore(0)
      setBreakdown(null)
      return
    }

    setIsCalculating(true)
    try {
      const result = await calculateContentScore(
        keywordUsageAnalysis,
        titleMetaAnalysis,
        readabilityAnalysis
      )
      setScore(result.score)
      setBreakdown(result.breakdown)
    } catch (error) {
      console.error("Failed to calculate content score:", error)
      toast.error("Failed to calculate content score")
    } finally {
      setIsCalculating(false)
    }
  }

  const renderScoreSkeleton = () => (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        {/* Outer circle skeleton */}
        <Skeleton className="absolute inset-0 rounded-full" />
        {/* Inner circle skeleton for score */}
        <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
          <div className="space-y-2 text-center">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-muted-foreground">Content Score</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={calculateScore}
                disabled={isLoading || isCalculating || !keywordUsageAnalysis || !titleMetaAnalysis || !readabilityAnalysis}
              >
                {isCalculating ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                )}
                <span>Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh content score</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-center py-4">
        {isLoading || isCalculating ? (
          renderScoreSkeleton()
        ) : (
          <CircularProgress 
            value={score} 
            size="large"
            title="Content Score" 
          />
        )}
      </div>

      {(!keywordUsageAnalysis || !titleMetaAnalysis || !readabilityAnalysis) && !isLoading && !isCalculating && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>Waiting for all analyses to complete...</p>
        </div>
      )}

      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
        disabled={isLoading || isCalculating || !keywordUsageAnalysis || !titleMetaAnalysis || !readabilityAnalysis}
      >
        <span className="mr-2">✨</span>
        Auto-Optimize
      </Button>

      <Button 
        variant="outline" 
        className="w-full mt-2 border-border"
        disabled={isLoading || isCalculating || !keywordUsageAnalysis || !titleMetaAnalysis || !readabilityAnalysis}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        Insert internal links
      </Button>
    </div>
  )
} 