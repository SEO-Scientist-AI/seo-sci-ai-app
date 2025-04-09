"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Bot, User, Languages, Copy, Megaphone, List, BarChart, Search, Heading, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function AdvancedContentToolsSection() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-muted-foreground">Advanced Content Tools</h4>
          <Badge variant="outline" className="h-5 text-xs">
            New
          </Badge>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle advanced content tools</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        <div className="px-2 py-2">
          <div className="mb-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Content Enhancement
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs dark:bg-blue-500/20 dark:border-blue-500/30"
                  >
                    Premium
                  </Badge>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
                >
                  <Bot className="h-4 w-4 mr-2 text-blue-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      AI Detector
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      15% AI Content
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-green-500/5 hover:bg-green-500/10 dark:bg-green-500/10 dark:hover:bg-green-500/20"
                >
                  <User className="h-4 w-4 mr-2 text-green-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      Humanizer
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Make natural
                    </span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Style & Tone
                  </span>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs dark:bg-purple-500/20 dark:border-purple-500/30">
                    Popular
                  </Badge>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-500/10 dark:hover:bg-purple-500/20"
                >
                  <Languages className="h-4 w-4 mr-2 text-purple-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      Tone Switcher
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Professional
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-red-500/5 hover:bg-red-500/10 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                >
                  <Copy className="h-4 w-4 mr-2 text-red-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      Plagiarism
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      100% Original
                    </span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Conversion Tools
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs dark:bg-orange-500/20 dark:border-orange-500/30"
                  >
                    New
                  </Badge>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-orange-500/5 hover:bg-orange-500/10 dark:bg-orange-500/10 dark:hover:bg-orange-500/20"
                >
                  <Megaphone className="h-4 w-4 mr-2 text-orange-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      CTA Generator
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Based on intent
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-teal-500/5 hover:bg-teal-500/10 dark:bg-teal-500/10 dark:hover:bg-teal-500/20"
                >
                  <List className="h-4 w-4 mr-2 text-teal-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      AI Outline
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Suggestions
                    </span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    SEO Optimization
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-xs dark:bg-indigo-500/20 dark:border-indigo-500/30"
                  >
                    Essential
                  </Badge>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-indigo-500/5 hover:bg-indigo-500/10 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20"
                >
                  <BarChart className="h-4 w-4 mr-2 text-indigo-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      Gap Analyzer
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      vs Competitors
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-cyan-500/5 hover:bg-cyan-500/10 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 relative"
                >
                  <Search className="h-4 w-4 mr-2 text-cyan-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      SERP Preview
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Snippet Tool
                    </span>
                  </div>
                  <Badge className="absolute top-1 right-1 bg-green-500/10 text-green-500 text-[8px] px-1 dark:bg-green-500/20">
                    Free
                  </Badge>
                </Button>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 relative"
                >
                  <Heading className="h-4 w-4 mr-2 text-amber-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      Meta Generator
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Title & Description
                    </span>
                  </div>
                  <Badge className="absolute top-1 right-1 bg-green-500/10 text-green-500 text-[8px] px-1 dark:bg-green-500/20">
                    Free
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start py-2 rounded-md whitespace-nowrap bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
                >
                  <Globe className="h-4 w-4 mr-2 text-emerald-500" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">
                      Multilingual
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Content Generator
                    </span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-500 text-xs rounded-md whitespace-nowrap hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <span className="mr-1">+</span> View all 24 tools
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
} 