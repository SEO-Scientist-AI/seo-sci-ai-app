"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendChart } from "@/components/dashboard/keyword-research/trend-chart"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClockIcon, SearchIcon, SaveIcon, PencilIcon } from "lucide-react"

interface KeywordData {
  keyword: string
  volume: number
  competitionIndex: number
  trend: number[]
  aiRecommendation: "HIGH" | "MEDIUM" | "LOW" 
  reasoning: string
}

export default function KeywordResearch() {
  const [targetKeyword, setTargetKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [keywordData, setKeywordData] = useState<KeywordData[]>([
    {
      keyword: "Marketing",
      volume: 6500,
      competitionIndex: 72,
      trend: [10, 30, 20, 40, 30, 60, 70],
      aiRecommendation: "HIGH",
      reasoning: "Consistent growth trend with high volume"
    },
    {
      keyword: "SEO",
      volume: 8900,
      competitionIndex: 85,
      trend: [20, 25, 30, 35, 45, 55, 65],
      aiRecommendation: "MEDIUM",
      reasoning: "High competition but strong volume"
    },
    {
      keyword: "Content",
      volume: 5400,
      competitionIndex: 65,
      trend: [15, 20, 25, 30, 40, 50, 60],
      aiRecommendation: "HIGH",
      reasoning: "Steady upward trend"
    },
    {
      keyword: "Analytics",
      volume: 3200,
      competitionIndex: 58,
      trend: [10, 15, 20, 25, 30, 35, 40],
      aiRecommendation: "LOW",
      reasoning: "Moderate growth potential"
    },
    {
      keyword: "Social Media",
      volume: 7800,
      competitionIndex: 82,
      trend: [30, 35, 40, 45, 50, 55, 60],
      aiRecommendation: "HIGH",
      reasoning: "High volume and engagement"
    },
    {
      keyword: "PPC",
      volume: 4300,
      competitionIndex: 75,
      trend: [25, 20, 25, 30, 35, 40, 45],
      aiRecommendation: "MEDIUM",
      reasoning: "Competitive but profitable"
    },
    {
      keyword: "Email",
      volume: 5100,
      competitionIndex: 68,
      trend: [20, 25, 30, 35, 40, 45, 50],
      aiRecommendation: "HIGH",
      reasoning: "Consistent performer"
    },
    {
      keyword: "Conversion",
      volume: 2900,
      competitionIndex: 62,
      trend: [30, 15, 20, 25, 30, 35, 40],
      aiRecommendation: "LOW",
      reasoning: "Niche but stable"
    },
    {
      keyword: "Ecommerce",
      volume: 6700,
      competitionIndex: 79,
      trend: [25, 30, 35, 40, 45, 50, 55],
      aiRecommendation: "HIGH",
      reasoning: "Growing market demand"
    },
    {
      keyword: "Branding",
      volume: 3800,
      competitionIndex: 71,
      trend: [15, 20, 25, 30, 35, 40, 45],
      aiRecommendation: "MEDIUM",
      reasoning: "Strategic long-term value"
    },
    {
      keyword: "Influencer",
      volume: 5600,
      competitionIndex: 64,
      trend: [20, 25, 30, 35, 40, 45, 50],
      aiRecommendation: "HIGH",
      reasoning: "High engagement potential"
    },
    {
      keyword: "Video",
      volume: 7200,
      competitionIndex: 81,
      trend: [30, 35, 40, 45, 50, 55, 60],
      aiRecommendation: "HIGH",
      reasoning: "Dominant content format"
    },
    {
      keyword: "Mobile",
      volume: 4900,
      competitionIndex: 67,
      trend: [20, 25, 30, 35, 40, 45, 50],
      aiRecommendation: "MEDIUM",
      reasoning: "Essential but competitive"
    },
    {
      keyword: "Local SEO",
      volume: 3100,
      competitionIndex: 59,
      trend: [10, 15, 20, 25, 30, 35, 40],
      aiRecommendation: "LOW",
      reasoning: "Regional limitations"
    },
    {
      keyword: "Automation",
      volume: 5800,
      competitionIndex: 73,
      trend: [25, 30, 35, 40, 45, 50, 55],
      aiRecommendation: "HIGH",
      reasoning: "Increasing efficiency demand"
    }
  ])

  const handleFindKeywords = () => {
    // In a real application, this would fetch data based on the inputs
    console.log("Finding keywords for:", targetKeyword, location)
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "HIGH":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-100 dark:hover:bg-yellow-900";
      case "LOW":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800";
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Keyword Research</CardTitle>
          <Button variant="outline" size="sm" className="h-9">
            <ClockIcon className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Target Keyword"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="pl-9 h-10" 
            />
          </div>
          <Button 
            onClick={handleFindKeywords} 
            className="h-10"
          >
            Find Keywords
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Keyword</TableHead>
                  <TableHead className="font-semibold text-right">Volume</TableHead>
                  <TableHead className="font-semibold text-right">Competition</TableHead>
                  <TableHead className="font-semibold w-40">Trend</TableHead>
                  <TableHead className="font-semibold pl-4">AI Recommendation</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywordData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 h-14">
                    <TableCell className="font-medium">{item.keyword}</TableCell>
                    <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.competitionIndex}/100</TableCell>
                    <TableCell className="w-40">
                      <TrendChart data={item.trend} />
                    </TableCell>
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-1">
                        <Badge className={`w-fit ${getRecommendationColor(item.aiRecommendation)}`}>
                          {item.aiRecommendation}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{item.reasoning}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Write</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <SaveIcon className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

