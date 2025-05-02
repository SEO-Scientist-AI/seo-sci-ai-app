"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Clock, 
  Tag, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  FileText, 
  Eye, 
  Share2, 
  Settings, 
  MoreHorizontal,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for the component props
interface KeywordOverviewHeaderProps {
  keyword: string | null;
  domain: string | null;
  country: string;
  device: string;
  date: Date | null;
  currency: string;
  lastUpdated: string;
  keywordCount: number;
  difficulty: string;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onCountryChange: (value: string) => void;
  onDeviceChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onCurrencyChange: (value: string) => void;
}

export function KeywordOverviewHeader({
  keyword,
  domain,
  country,
  device,
  date,
  currency,
  lastUpdated,
  keywordCount,
  difficulty,
  isLoading,
  onRefresh,
  onCountryChange,
  onDeviceChange,
  onDateChange,
  onCurrencyChange
}: KeywordOverviewHeaderProps) {
  // Country flags for display
  const countryFlags: Record<string, string> = {
    US: "🇺🇸",
    IN: "🇮🇳",
    GB: "🇬🇧",
    CA: "🇨🇦",
    AU: "🇦🇺",
    UK: "🇬🇧"
  };

  // Currencies for display
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
    { code: "CAD", symbol: "CA$" }
  ];

  return (
    <header className="top-0 z-10 border-b w-full">
      <div className="w-full">
        {/* Site info row */}
        <div className="container mx-auto">
          <div className="py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Keyword Overview: {keyword || "Not specified"}
                </h1>
                <Separator orientation="vertical" className="h-6" />
              </div>

              <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="text-primary font-medium">
                    {domain ? domain : "Global Search"}
                  </span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-1.5 h-9 px-3"
                onClick={onRefresh}
                disabled={isLoading || !keyword}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Refresh Data</span>
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 px-3">
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF Report</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Looker Studio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Download className="h-4 w-4" />
                    <span>CSV Export</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="gap-1.5 h-9 px-3">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>

              <Button variant="outline" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="bg-muted/50 border-t border-border w-full">
          <div className="container mx-auto">
            <div className="px-4 md:px-6 py-3 flex flex-wrap gap-3 md:gap-6 items-center">
              {/* Country Selection */}
              <div className="flex items-center">
                <Select 
                  value={country}
                  onValueChange={onCountryChange}
                >
                  <SelectTrigger className="w-[130px] h-7 bg-background border-border text-sm">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span>{countryFlags[country]}</span>
                        <span>{country === "US" ? "United States" : (
                          country === "IN" ? "India" :
                          country === "GB" || country === "UK" ? "United Kingdom" :
                          country === "CA" ? "Canada" :
                          country === "AU" ? "Australia" : country
                        )}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">
                      <span className="flex items-center gap-2">
                        <span>🇺🇸</span>
                        <span>United States</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="IN">
                      <span className="flex items-center gap-2">
                        <span>🇮🇳</span>
                        <span>India</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="GB">
                      <span className="flex items-center gap-2">
                        <span>🇬🇧</span>
                        <span>United Kingdom</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="CA">
                      <span className="flex items-center gap-2">
                        <span>🇨🇦</span>
                        <span>Canada</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="AU">
                      <span className="flex items-center gap-2">
                        <span>🇦🇺</span>
                        <span>Australia</span>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Device Type Selection */}
              <div className="flex items-center">
                <Select
                  value={device}
                  onValueChange={onDeviceChange}
                >
                  <SelectTrigger className="w-[120px] h-7 bg-background border-border text-sm">
                    <SelectValue>
                      {device === 'desktop' ? 'Desktop' : 'Mobile'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-7 px-3 bg-background border-border text-sm font-normal justify-start",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date || undefined}
                      onSelect={onDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Currency Selection */}
              <div className="flex items-center">
                <Select
                  value={currency}
                  onValueChange={onCurrencyChange}
                >
                  <SelectTrigger className="w-[100px] h-7 bg-background border-border text-sm">
                    <SelectValue>
                      {currency}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code}>
                        <span className="flex items-center gap-2">
                          <span>{curr.symbol}</span>
                          <span>{curr.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-5 ml-auto hidden md:block" />

              {/* Stats badges */}
              <div className="flex items-center gap-4 ml-auto md:ml-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Keywords: <strong className="text-foreground">
                      {isLoading ? (
                        <Skeleton className="h-4 w-8 inline-block" />
                      ) : (
                        keywordCount
                      )}
                    </strong>
                  </span>
                </div>

                <Separator orientation="vertical" className="h-5" />

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Difficulty: <strong className="text-foreground">
                      {isLoading ? (
                        <Skeleton className="h-4 w-8 inline-block" />
                      ) : (
                        difficulty
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
