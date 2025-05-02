"use client"

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
  Search,
  Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  onSearch: (searchKeyword: string) => void;
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
  onCurrencyChange,
  onSearch
}: KeywordOverviewHeaderProps) {
  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  
  // Update search input when keyword changes
  useEffect(() => {
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [keyword]);
  
  // Handle search form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onSearch(searchKeyword);
    }
  };

  // Country flags for display
  const countryFlags: Record<string, string> = {
    US: "🇺🇸",
    IN: "🇮🇳",
    GB: "🇬🇧",
    CA: "🇨🇦",
    AU: "🇦🇺",
    DE: "🇩🇪",
    FR: "🇫🇷",
    JP: "🇯🇵",
    BR: "🇧🇷",
    MX: "🇲🇽",
    ES: "🇪🇸",
    IT: "🇮🇹",
    NL: "🇳🇱",
    RU: "🇷🇺",
    CN: "🇨🇳",
    KR: "🇰🇷",
    ZA: "🇿🇦",
    SG: "🇸🇬",
    SE: "🇸🇪",
    NO: "🇳🇴",
    DK: "🇩🇰",
    FI: "🇫🇮",
    PT: "🇵🇹",
    IE: "🇮🇪",
    CH: "🇨🇭",
    AT: "🇦🇹",
    BE: "🇧🇪",
    NZ: "🇳🇿"
  };

  // Country names
  const countries = [
    { code: "US", name: "United States" },
    { code: "IN", name: "India" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
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

  // Currencies for display
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
    { code: "CAD", symbol: "CA$" }
  ];

  // Function to get flag URL for country code
  const getFlagUrl = (code: string): string => {
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  return (
    <header className="top-0 z-10 border-b w-full">
      <div className="w-full">
        {/* Site info row */}
        <div className="container mx-auto">
          <div className="py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground whitespace-nowrap">Keyword Overview:</h1>
                <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
                  <div className="relative">
                    <Input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Enter keyword to search"
                      className="pl-3 pr-10 py-1 h-10 text-sm font-medium  shadow-sm focus-visible:ring-primary"
                      style={{ caretColor: "var(--primary)" }}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 text-primary hover:text-primary/80"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
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
                    <div className="animate-pulse h-3.5 w-3.5 rounded-full bg-white/80" />
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[180px] h-7 bg-background border-border text-sm justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-3.5 relative overflow-hidden rounded-sm">
                          <img 
                            src={getFlagUrl(country)} 
                            alt={`${countries.find(c => c.code === country)?.name || country} flag`}
                            className="object-cover w-full h-full"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                        <span>{countries.find(c => c.code === country)?.name || country}</span>
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandList>
                        <ScrollArea className="h-[300px]">
                          <CommandGroup>
                            {countries.map((c) => (
                              <CommandItem
                                key={c.code}
                                value={`${c.code} ${c.name}`}
                                onSelect={() => {
                                  onCountryChange(c.code);
                                }}
                              >
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
                                {country === c.code && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
