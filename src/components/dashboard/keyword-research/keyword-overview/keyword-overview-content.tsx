"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, type TooltipProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { GlobalVolumeCard } from "./global-volume-card"
import { RelatedKeywordsSection } from "./related-keywords-section"

// Define interfaces for API responses
interface SearchVolumeItem {
  keyword: string
  location_code: number
  search_volume: number
  cpc: number
  competition: number
  competition_index: number
  low_top_of_page_bid: number
  high_top_of_page_bid: number
  monthly_searches: {
    year: number
    month: number
    search_volume: number
  }[]
}

// DataForSEO API response types
interface DataForSEOTask {
  id: string
  status_code: number
  status_message: string
  time: string
  cost: number
  result_count: number
  path: string
  data: Record<string, any>
  result: Array<{
    id?: string
    status_code?: number
    status_message?: string
    items?: any[]
    [key: string]: any
  }>
}

interface DataForSEOResponse {
  status_code: number
  status_message: string
  tasks: DataForSEOTask[]
  [key: string]: any
}

interface KeywordData {
  keyword: string
  country: string
  difficulty: {
    score: number
    label: string
  }
  volume: {
    value: number
    trend: number[]
  }
  cpc: number
  competition: number
}

interface KeywordOverviewContentProps {
  keywordParam: string | null
  currency: string
  currencySymbol: string
  country: string
  onMetadataUpdate?: (difficultyScore: number, keywordCount: number) => void
  onLoadingChange?: (isLoading: boolean) => void
  isLoading?: boolean
}

// Constants
const MAX_RETRIES = 5
const RETRY_DELAY = 2000

// Map country codes to DataForSEO location names
const COUNTRY_TO_LOCATION: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  IN: "India",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  BR: "Brazil",
  MX: "Mexico",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  RU: "Russia",
  CN: "China",
  KR: "South Korea",
  ZA: "South Africa",
  SG: "Singapore",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PT: "Portugal",
  IE: "Ireland",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  NZ: "New Zealand"
}

export function KeywordOverviewContent({
  keywordParam,
  currency = "USD",
  currencySymbol = "$",
  country = "US",
  onMetadataUpdate,
  onLoadingChange,
  isLoading: externalLoading,
}: KeywordOverviewContentProps) {
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showGlobalVolume, setShowGlobalVolume] = useState<boolean>(false)

  // Use external loading state if provided
  const isLoadingState = externalLoading !== undefined ? externalLoading : isLoading

  // Function to get base64 credentials
  const getCredentials = () => {
    // Get credentials from environment variables exposed to the client
    const login = process.env.NEXT_PUBLIC_DATAFORSEO_LOGIN
    const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD

    if (!login || !password) {
      console.error("DataForSEO credentials are missing in environment variables")
      throw new Error("API credentials not configured")
    }

    return btoa(`${login}:${password}`)
  }

  // Function to post search task
  const postSearchTask = async (keyword: string) => {
    try {
      // Get location name from country code
      const locationName = COUNTRY_TO_LOCATION[country] || "United States"

      const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/task_post", {
        method: "POST",
        headers: {
          Authorization: `Basic ${getCredentials()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            location_name: locationName,
            keywords: [keyword],
          },
        ]),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Parse response and assert its structure
      const responseData = await response.json()
      const data = responseData as unknown as DataForSEOResponse

      if (data.tasks && data.tasks.length > 0 && data.tasks[0].id) {
        return data.tasks[0].id
      } else {
        throw new Error("No task ID returned")
      }
    } catch (err) {
      console.error("Error posting search task:", err)
      throw err
    }
  }

  // Function to get search results
  const getSearchResults = async (taskId: string) => {
    try {
      const response = await fetch(
        `https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/task_get/${taskId}`,
        {
          headers: {
            Authorization: `Basic ${getCredentials()}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Parse response and assert its structure
      const responseData = await response.json()
      const data = responseData as unknown as DataForSEOResponse

      // Validate response format
      if (data.tasks && data.tasks.length > 0 && data.tasks[0].result && data.tasks[0].result.length > 0) {
        return data.tasks[0].result as unknown as SearchVolumeItem[]
      }

      return null
    } catch (err) {
      console.error("Error getting search results:", err)
      throw err
    }
  }

  // Poll for results with retries
  const pollForResults = async (taskId: string, getResultsFn: (id: string) => Promise<any>) => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const results = await getResultsFn(taskId)

        // Check if we have valid results and return immediately
        if (results && results.length > 0) {
          console.log("Valid results obtained on attempt", attempt + 1)
          return results
        }

        console.log(`Attempt ${attempt + 1}: No results yet, waiting...`)
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      } catch (err) {
        if (attempt === MAX_RETRIES - 1) {
          throw err
        }
        console.warn(`Attempt ${attempt + 1} failed: ${err}`)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }

    throw new Error("Failed to get results after maximum retries")
  }

  // Function to transform API data to our format
  const transformData = (keyword: string, volumeData: SearchVolumeItem[]): KeywordData => {
    console.log("Raw volume data:", volumeData)
    // Extract volume trends from monthly searches
    const monthlySearches = volumeData[0]?.monthly_searches || []
    const sortedMonthlySearches = [...monthlySearches].sort((a, b) => {
      // Sort by year and then by month
      return a.year === b.year ? a.month - b.month : a.year - b.year
    })

    console.log("Sorted monthly searches:", sortedMonthlySearches)
    const trends = sortedMonthlySearches.map((m) => m.search_volume)
    console.log("Extracted trends:", trends)

    // Calculate difficulty score based on competition index
    const competitionIndex = volumeData[0]?.competition_index || 0
    const difficultyScore = Math.min(Math.round(competitionIndex), 100)
    let difficultyLabel = "Easy"
    if (difficultyScore > 70) difficultyLabel = "Hard"
    else if (difficultyScore > 40) difficultyLabel = "Medium"

    // Convert string competition to number if needed
    let competitionValue = volumeData[0]?.competition || 0
    if (typeof competitionValue === "string") {
      competitionValue =
        competitionValue === "HIGH" ? 0.9 : competitionValue === "MEDIUM" ? 0.5 : competitionValue === "LOW" ? 0.2 : 0
    }

    return {
      keyword,
      country: COUNTRY_TO_LOCATION[country] || "United States",
      difficulty: {
        score: difficultyScore,
        label: difficultyLabel,
      },
      volume: {
        value: volumeData[0]?.search_volume || 0,
        trend: trends.length ? trends : Array(12).fill(0),
      },
      cpc: volumeData[0]?.cpc || 0,
      competition: competitionValue,
    }
  }

  // Update parent's loading state when our loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading)
    }
  }, [isLoading, onLoadingChange])

  // Main function to fetch keyword data
  const fetchKeywordData = async (keyword: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Post search volume task
      const volumeTaskId = await postSearchTask(keyword)
      console.log("Task ID:", volumeTaskId)

      // 2. Wait a bit before polling
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // 3. Poll for search volume results
      const volumeResults = await pollForResults(volumeTaskId, getSearchResults)
      console.log("API Response:", volumeResults)

      // 4. Transform data to our format
      const transformedData = transformData(keyword, volumeResults)
      console.log("Transformed Data:", transformedData)

      // 5. Update state
      setKeywordData(transformedData)

      // 6. Update parent component with metadata (if callback exists)
      if (onMetadataUpdate) {
        onMetadataUpdate(
          transformedData.difficulty.score,
          10 // We're now using the RelatedKeywordsSection which will fetch approximately 10 keywords
        )
      }
    } catch (err) {
      console.error("Error fetching keyword data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when keyword or country changes
  useEffect(() => {
    if (keywordParam) {
      fetchKeywordData(keywordParam)
    }
  }, [keywordParam, country])

  // Show global volume card after main data is loaded
  useEffect(() => {
    if (keywordData && !isLoading) {
      // Delay showing global volume to prioritize main content loading
      const timer = setTimeout(() => {
        setShowGlobalVolume(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [keywordData, isLoading])

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No keyword specified message */}
      {!keywordParam && !error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No keyword specified</AlertTitle>
          <AlertDescription>
            Please search for a keyword from the keyword search page to see detailed analytics.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Area - Add data display sections */}
      {keywordParam && keywordData && !error && (
        <div className="pb-12">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Volume Card */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Monthly Search Volume</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {isLoadingState ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse h-7 w-20 bg-muted rounded"></div>
                    </div>
                  ) : (
                    keywordData.volume.value.toLocaleString()
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {isLoadingState ? (
                    <div className="animate-pulse h-4 w-16 bg-muted rounded"></div>
                  ) : (
                    <>
                      <span
                        className={
                          keywordData.volume.trend[11] > keywordData.volume.trend[0] ? "text-green-500" : "text-red-500"
                        }
                      >
                        {keywordData.volume.trend[11] > keywordData.volume.trend[0] ? "↑" : "↓"}
                        {Math.abs(
                          Math.round(
                            ((keywordData.volume.trend[11] - keywordData.volume.trend[0]) / keywordData.volume.trend[0]) *
                              100,
                          ),
                        )}
                        %
                      </span>
                      <span className="ml-1">vs last year</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Difficulty Card */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Keyword Difficulty</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">{keywordData.difficulty.score}/100</div>
                <div className="flex items-center">
                  <Badge
                    className={
                      keywordData.difficulty.label === "Easy"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : keywordData.difficulty.label === "Medium"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {keywordData.difficulty.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* CPC Card */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Cost Per Click</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {currencySymbol}
                  {keywordData.cpc.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Average CPC</div>
              </div>
            </div>

            {/* Competition Card */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Competition</h3>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">{(keywordData.competition * 100).toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Advertiser competition</div>
              </div>
            </div>
          </div>

          {/* Two-column layout for volume trend and global volume */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              {/* Volume Trend */}
              <h2 className="text-xl font-semibold mb-4">Monthly Search Trend</h2>
              <Card className="mb-8 lg:mb-0">
                <CardHeader className="pb-0">
                  <CardTitle>
                    <div className="flex justify-between items-center">
                      <span className="mb-4">Monthly Search Volume</span>
                      <span className="text-sm font-normal ">
                        {isLoadingState ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
                          </div>
                        ) : (
                          <Badge
                            className={
                              keywordData.volume.trend[keywordData.volume.trend.length - 1] > keywordData.volume.trend[0]
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {keywordData.volume.trend[keywordData.volume.trend.length - 1] >
                            keywordData.volume.trend[0] ? (
                              <span className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {Math.abs(
                                  Math.round(
                                    ((keywordData.volume.trend[keywordData.volume.trend.length - 1] -
                                      keywordData.volume.trend[0]) /
                                      (keywordData.volume.trend[0] || 1)) *
                                      100,
                                  ),
                                )}
                                %
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {Math.abs(
                                  Math.round(
                                    ((keywordData.volume.trend[0] -
                                      keywordData.volume.trend[keywordData.volume.trend.length - 1]) /
                                      (keywordData.volume.trend[0] || 1)) *
                                      100,
                                  ),
                                )}
                                %
                              </span>
                            )}
                          </Badge>
                        )}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full">
                    {isLoadingState ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="space-y-4 w-full">
                          <div className="flex items-center justify-between">
                            <div className="animate-pulse h-4 w-16 bg-muted rounded"></div>
                            <div className="animate-pulse h-4 w-16 bg-muted rounded"></div>
                          </div>
                          <div className="animate-pulse h-[280px] w-full bg-muted/50 rounded"></div>
                          <div className="flex items-center justify-between">
                            <div className="animate-pulse h-4 w-8 bg-muted rounded"></div>
                            <div className="animate-pulse h-4 w-8 bg-muted rounded"></div>
                            <div className="animate-pulse h-4 w-8 bg-muted rounded"></div>
                            <div className="animate-pulse h-4 w-8 bg-muted rounded"></div>
                            <div className="animate-pulse h-4 w-8 bg-muted rounded"></div>
                            <div className="animate-pulse h-4 w-8 bg-muted rounded"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={keywordData.volume.trend.map((volume, index) => {
                            const monthNames = [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ]
                            return {
                              month: monthNames[index % 12],
                              volume: volume,
                            }
                          })}
                          margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 20%"]} />
                          <ChartTooltip
                            cursor={false}
                            content={(props: TooltipProps<ValueType, NameType>) => {
                              if (props.active && props.payload && props.payload.length) {
                                const payload = props.payload[0]
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col">
                                        <span className="text-xs uppercase text-muted-foreground">Month</span>
                                        <span className="font-bold">{payload.payload.month}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs uppercase text-muted-foreground">Search Volume</span>
                                        <span className="font-bold">{payload.payload.volume.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="volume"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            activeDot={{
                              r: 6,
                              style: { fill: "hsl(var(--primary))", opacity: 0.8 },
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Volume Card (loads after main content) */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Global Reach</h2>
              {showGlobalVolume ? (
                <GlobalVolumeCard keyword={keywordParam} credentials={getCredentials} />
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-7 w-32" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-32" />
                      <div className="space-y-2">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-5 rounded-full" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Related Keywords Section - using the new component */}
          <RelatedKeywordsSection 
            keyword={keywordParam} 
            credentials={getCredentials}
            country={country}
            currencySymbol={currencySymbol}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoadingState && !keywordData && (
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border shadow-sm p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>

          <Skeleton className="h-8 w-48 mb-4" />
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-8">
            <Skeleton className="h-64 w-full" />
          </div>

          <Skeleton className="h-8 w-48 mb-4" />
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      )}
    </div>
  )
}
