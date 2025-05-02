"use client"

import { useState, useEffect, useRef, FormEvent } from "react"
import { Globe, Search, Sparkles, AlertCircle } from "lucide-react"
import * as echarts from 'echarts'
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircularProgress } from "@/components/dashboard/circular-score"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

export const runtime = 'edge';

export default function KeywordSearch() {
  const [keywords, setKeywords] = useState("")
  const [domain, setDomain] = useState("")
  const [country, setCountry] = useState("US")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  
  // Chart refs
  const volumeChartRef = useRef<HTMLDivElement>(null)
  const volumeChartInstance = useRef<echarts.ECharts | null>(null)

  // Country data
  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "NL", name: "Netherlands" },
    { code: "RU", name: "Russia" },
    { code: "CN", name: "China" },
    { code: "KR", name: "South Korea" },
    { code: "ZA", name: "South Africa" },
    { code: "SG", name: "Singapore" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "PT", name: "Portugal" },
    { code: "IE", name: "Ireland" },
    { code: "CH", name: "Switzerland" },
    { code: "AT", name: "Austria" },
    { code: "BE", name: "Belgium" },
    { code: "NZ", name: "New Zealand" }
  ];

  // Function to get flag URL for country code
  const getFlagUrl = (code: string): string => {
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  // Initialize charts after component mounts
  useEffect(() => {
    // Volume trend chart
    if (volumeChartRef.current) {
      volumeChartInstance.current = echarts.init(volumeChartRef.current)
      
      const volumeTrendOption = {
        animation: false,
        grid: { top: 20, right: 20, bottom: 30, left: 50 },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisLine: { lineStyle: { color: '#ddd' } }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#ddd' } }
        },
        series: [{
          data: [120, 132, 101, 134, 90, 180, 210, 190, 170, 182, 195, 124],
          type: 'line',
          smooth: true,
          color: '#10b981'
        }],
        tooltip: {
          trigger: 'axis'
        }
      }
      
      volumeChartInstance.current.setOption(volumeTrendOption)
    }

    // Resize charts on window resize
    const handleResize = () => {
      volumeChartInstance.current?.resize()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      volumeChartInstance.current?.dispose()
    }
  }, [])

  // Keyword difficulty score (0-100)
  const keywordDifficultyScore = 75

  // Handle form submission
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation
    if (!keywords.trim()) {
      setError("Please enter at least one keyword")
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // For multiple keywords, we just take the first one for now
      // In a real app, we might handle multiple keywords differently
      const firstKeyword = keywords.split(",")[0].trim()
      
      // Navigate to the keyword overview page with the keyword and country as search params
      router.push(`/keyword-overview?keyword=${encodeURIComponent(firstKeyword)}&country=${country}${domain ? `&domain=${encodeURIComponent(domain)}` : ''}`)
      
      // Show toast notification
      const countryName = countries.find(c => c.code === country)?.name || country;
      toast.success("Searching for keyword data", {
        description: `Analyzing "${firstKeyword}" in ${countryName}`
      })
    } catch (error) {
      console.error("Error searching for keyword:", error)
      setError("Failed to search for keyword. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get country name from code
  const getCountryName = (code: string): string => {
    return countries.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex-1 space-y-6 p-6">
        <div className="mx-auto max-w-6xl">
          {/* Keyword Overview Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-foreground">Keyword Overview</h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Dive into the largest AI-powered keyword checker on the market and analyze everything you need to know about
              a keyword.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search Form */}
          <Card className="mb-8 shadow-sm border-border/40 transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-semibold">Search for a keyword</CardTitle>
              <CardDescription>Enter keywords to analyze search volumes, competition, and ranking potential</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch}>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-foreground">Keywords</span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-muted/80 text-muted-foreground"
                    >
                      {keywords.split(",").filter(k => k.trim()).length}/100
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Examples:</span>
                    <Badge 
                      variant="secondary"
                      className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors"
                      onClick={() => setKeywords("loans")}
                    >
                      loans
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50 transition-colors"
                      onClick={() => setKeywords("movies")}
                    >
                      movies
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 transition-colors"
                      onClick={() => setKeywords("how to buy audible books")}
                    >
                      how to buy audible books
                    </Badge>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <Input
                      placeholder="Enter keywords separated by commas"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className={`h-12 w-full text-base transition-all duration-200 focus-visible:ring-primary pr-10 ${
                        isSubmitting ? "bg-muted/40 border-primary/40 animate-pulse" : ""
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch(e as unknown as FormEvent);
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleSearch(e as unknown as FormEvent)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {isSubmitting && (
                    <div className="mt-2 text-sm text-primary font-medium flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-primary animate-ping" />
                      Searching for keyword data...
                    </div>
                  )}
                </div>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="relative">
                    <div className="relative transition-all duration-200 hover:opacity-90">
                      <Input
                        placeholder="Enter domain for personalized data"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="h-12 w-full border-purple-200 bg-purple-50 pl-10 text-base dark:bg-purple-900/10 dark:border-purple-800"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                        <Sparkles className="h-4 w-4 animate-[pulse_3s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                      <span>AI-powered feature</span>
                    </div>
                  </div>
                  <Select defaultValue={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12 transition-all duration-200 hover:border-primary">
                      <SelectValue placeholder="Select country">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-3.5 relative overflow-hidden rounded-sm">
                            <img 
                              src={getFlagUrl(country)} 
                              alt={`${getCountryName(country)} flag`}
                              className="object-cover w-full h-full"
                              style={{ maxWidth: "100%" }}
                            />
                          </div>
                          <span>{getCountryName(country)}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-[300px]">
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-3.5 relative overflow-hidden rounded-sm">
                                <img 
                                  src={getFlagUrl(c.code)} 
                                  alt={`${c.name} flag`}
                                  className="object-cover w-full h-full"
                                  style={{ maxWidth: "100%" }}
                                />
                              </div>
                              <span>{c.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Feature Headline */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-foreground">Your all-in-one keyword research tool</h2>
          </div>

          {/* Main Dashboard */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
            {/* Volume Card */}
            <Card className="shadow-sm border-border/40 transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Volume</CardTitle>
                <CardDescription>
                  Understand how many times a keyword is queried every month across the globe and in your region.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Volume</div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-foreground">124.0M</span>
                      <div className="w-5 h-3.5 relative overflow-hidden rounded-sm">
                        <img 
                          src={getFlagUrl("US")} 
                          alt="United States flag"
                          className="object-cover w-full h-full"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Global Volume</div>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-foreground">352.1M</span>
                      <span className="ml-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-2 text-sm font-medium text-foreground">Monthly trend</div>
                <div 
                  ref={volumeChartRef}
                  className="h-64 w-full transition-opacity duration-500 opacity-90 hover:opacity-100"
                ></div>
              </CardContent>
            </Card>

            {/* Keyword Difficulty Card */}
            <Card className="shadow-sm border-border/40 transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-orange-500 dark:text-orange-400">Keyword Difficulty</CardTitle>
                <CardDescription>
                  Evaluate how challenging it will be to rank for this keyword based on competition analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm font-medium text-foreground mb-2">Personal KD</div>
                    <CircularProgress 
                      value={keywordDifficultyScore} 
                      size="large" 
                      title="Difficult" 
                    />
                  </div>
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4 transition-transform duration-300 hover:translate-x-1">
                      <div className="mb-1 text-sm font-medium text-muted-foreground">Potential Traffic</div>
                      <div className="text-3xl font-bold text-foreground">5.4K</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 transition-transform duration-300 hover:translate-x-1">
                      <div className="mb-1 text-sm font-medium text-muted-foreground">Potential Topic Traffic</div>
                      <div className="text-3xl font-bold text-foreground">12.5K</div>
                    </div>
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 transition-transform duration-300 hover:translate-x-1">
                      <div className="mb-1 text-sm font-medium text-muted-foreground">Topical Authority</div>
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">High</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
