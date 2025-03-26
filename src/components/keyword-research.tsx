"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { TrendChart } from "@/components/trend-chart";
import { TrendChart } from "@/components/trend-chart2";


interface KeywordData {
  keyword: string
  volume: number
  competitionIndex: number
  trend: number[]
  aiRecommendation: "HIGH" |"MEDIUM"| "LOW" 
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

  return (
    <div className="border rounded-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Keyword Research</h1>
        <Button variant="outline" className="h-10 px-4 py-2">
          History
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Target Keyword"
          value={targetKeyword}
          onChange={(e) => setTargetKeyword(e.target.value)}
          className="h-12"
        />
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="h-12" />
        <Button onClick={handleFindKeywords} className="bg-black text-white h-12 hover:bg-gray-800">
          Find Keywords
        </Button>
      </div>

      <div className="border rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Keyword</TableHead>
              <TableHead className="font-medium">Volume</TableHead>
              <TableHead className="font-medium">Competition Index</TableHead>
              <TableHead className="font-medium">Actions Trend</TableHead>
              <TableHead className="font-medium">AI Recommendation</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywordData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.keyword}</TableCell>
                <TableCell>{item.volume}</TableCell>
                <TableCell>{item.competitionIndex}</TableCell>
                <TableCell className="w-32">
                  <TrendChart data={item.trend} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{item.aiRecommendation}</span>
                    <span className="text-gray-500 text-sm">{item.reasoning}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Write
                    </Button>
                    <Button variant="ghost" size="sm">
                      Save to library
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

