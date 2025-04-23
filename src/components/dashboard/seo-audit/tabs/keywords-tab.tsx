"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsite } from "@/hooks/use-website";
import { getWebsiteKeywords } from "@/app/actions/getWebsiteKeywords";
import { RefreshCw, Search, ArrowUpDown, TrendingUp, TrendingDown, Minus, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Keyword {
  id: string;
  keyword: string;
  position: number | null;
  change: number;
  volume: number;
  difficulty: "easy" | "medium" | "hard";
  intent: "informational" | "transactional" | "navigational";
  cpc?: number | null;
  trends?: {
    monthly?: number;
    quarterly?: number;
    yearly?: number;
  }
}

interface KeywordsTabProps {
  keywords: Keyword[];
}

export function KeywordsTab({ keywords: initialKeywords }: KeywordsTabProps) {
  const { currentWebsite } = useWebsite();
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("volume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);

  const fetchKeywords = async (forceRefresh: boolean = false) => {
    if (!currentWebsite) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching keywords for ${currentWebsite}, forceRefresh: ${forceRefresh}`);
      const response = await getWebsiteKeywords(currentWebsite, forceRefresh, { limit: 100 });
      
      console.log(`Keywords response:`, response);
      
      if (response.error) {
        setError(response.error);
      } else if (!response.keywords || response.keywords.length === 0) {
        setError("No keywords found. Try refreshing or check API connectivity.");
        setKeywords([]);
      } else {
        setKeywords(response.keywords || []);
        setError(null);
      }
    } catch (err) {
      console.error("Error in keywords component:", err);
      setError(`Failed to load keywords: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentWebsite) {
      fetchKeywords();
    }
  }, [currentWebsite]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchKeywords(true);
  };

  const getDifficultyColor = (difficulty: Keyword["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-100";
    }
  };

  const getIntentColor = (intent: Keyword["intent"]) => {
    switch (intent) {
      case "informational":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "transactional":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "navigational":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const filteredKeywords = keywords.filter(kw => 
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    // Handle null values
    if (sortBy === "position") {
      if (a.position === null && b.position === null) return 0;
      if (a.position === null) return 1;
      if (b.position === null) return -1;
    }
    
    const aValue = a[sortBy as keyof Keyword];
    const bValue = b[sortBy as keyof Keyword];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    // Default string comparison
    const aString = String(aValue || '');
    const bString = String(bValue || '');
    return sortDirection === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString);
  });
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown size={14} />;
    return sortDirection === "asc" ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  if (!currentWebsite) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a website to view keywords data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Keywords</h2>
          <p className="text-muted-foreground">
            Analyze keyword rankings and performance for your website.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search keywords..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) => handleSort(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="keyword">Keyword</SelectItem>
            <SelectItem value="position">Position</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="change">Change</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("keyword")}
              >
                <div className="flex items-center gap-1">
                  Keyword {getSortIcon("keyword")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("position")}
              >
                <div className="flex items-center gap-1">
                  Position {getSortIcon("position")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("change")}
              >
                <div className="flex items-center gap-1">
                  Change (Monthly) {getSortIcon("change")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("volume")}
              >
                <div className="flex items-center gap-1">
                  Volume {getSortIcon("volume")}
                </div>
              </TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>CPC</TableHead>
              <TableHead>Intent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {error}
                </TableCell>
              </TableRow>
            ) : sortedKeywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No keywords match your search.' : 'No keywords found. Click refresh to fetch keyword data.'}
                </TableCell>
              </TableRow>
            ) : (
              sortedKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>
                    {keyword.position !== null ? keyword.position : <Minus className="h-4 w-4 text-muted-foreground" />}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        keyword.change > 0
                          ? "text-green-500 flex items-center"
                          : keyword.change < 0
                          ? "text-red-500 flex items-center"
                          : "text-muted-foreground flex items-center"
                      }
                    >
                      {keyword.change > 0 ? (
                        <>
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +{keyword.change}
                        </>
                      ) : keyword.change < 0 ? (
                        <>
                          <TrendingDown className="h-4 w-4 mr-1" />
                          {keyword.change}
                        </>
                      ) : (
                        <>
                          <Minus className="h-4 w-4 mr-1" />
                          0
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{keyword.volume?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(keyword.difficulty)}>
                      {keyword.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {keyword.cpc ? (
                      <span className="flex items-center text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5 mr-0.5" />
                        {keyword.cpc.toFixed(2)}
                      </span>
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getIntentColor(keyword.intent)}>
                      {keyword.intent}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {keywords.length > 0 && (
        <div className="flex justify-end gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {sortedKeywords.length} of {keywords.length} keywords
          </div>
        </div>
      )}
    </div>
  );
} 