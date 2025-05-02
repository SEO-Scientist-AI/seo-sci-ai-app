"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe } from "lucide-react"

// Define interfaces for API responses
interface DataForSEOTask {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: {
    api: string;
    function: string;
    location_name: string;
    keywords: string[];
  };
  result: Array<{
    search_volume?: number;
    keyword?: string;
    [key: string]: any;
  }>;
}

interface DataForSEOResponse {
  status_code: number;
  status_message: string;
  tasks: DataForSEOTask[];
  [key: string]: any;
}

interface GlobalVolumeData {
  country: string;
  code: string;
  flag: string;
  volume: number;
  percentage: number;
}

interface GlobalVolumeCardProps {
  keyword: string | null;
  credentials: () => string;
}

// Map of country codes to DataForSEO location codes
const COUNTRY_LOCATION_MAP = {
  US: "United States",
  IN: "India",
  GB: "United Kingdom",
  BR: "Brazil",
  DE: "Germany",
  AU: "Australia"
};

export function GlobalVolumeCard({ keyword, credentials }: GlobalVolumeCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [volumeData, setVolumeData] = useState<GlobalVolumeData[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);

  // Country data with flags and location names
  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "AU", name: "Australia", flag: "🇦🇺" }
  ];

  // Function to post search volume task for a specific country
  const postSearchTask = async (keyword: string, country: string) => {
    try {
      console.log(`Posting search task for ${keyword} in ${country}`);
      const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/task_post", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          {
            "location_name": country,
            "keywords": [keyword]
          }
        ])
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json() as DataForSEOResponse;
      console.log(`Task ID response for ${country}:`, responseData);
      
      if (responseData.tasks && responseData.tasks.length > 0 && responseData.tasks[0].id) {
        return responseData.tasks[0].id;
      } else {
        throw new Error("No task ID returned");
      }
    } catch (err) {
      console.error(`Error posting search task for ${country}:`, err);
      throw err;
    }
  };

  // Function to get search results
  const getSearchResults = async (taskId: string) => {
    try {
      const response = await fetch(`https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/task_get/${taskId}`, {
        headers: {
          "Authorization": `Basic ${credentials()}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json() as DataForSEOResponse;
      console.log(`Results for task ${taskId}:`, responseData);
      
      if (responseData.tasks && 
          responseData.tasks.length > 0 && 
          responseData.tasks[0].result && 
          responseData.tasks[0].result.length > 0) {
        
        // Explicitly access the search_volume from the first result item
        const firstResult = responseData.tasks[0].result[0];
        return firstResult?.search_volume || 0;
      }
      
      return 0;
    } catch (err) {
      console.error("Error getting search results:", err);
      return 0;
    }
  };

  // Poll for results with retries
  const pollForResults = async (taskId: string) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Polling attempt ${attempt + 1} for task ${taskId}`);
        const volume = await getSearchResults(taskId);
        if (volume > 0) {
          console.log(`Got volume: ${volume} for task ${taskId}`);
          return volume;
        }
        
        console.log(`No volume yet, waiting for retry...`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } catch (err) {
        if (attempt === MAX_RETRIES - 1) {
          console.error("Failed after maximum retries:", err);
          return 0;
        }
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
    
    return 0;
  };

  // Fetch volume data for all countries
  const fetchGlobalVolumeData = async () => {
    if (!keyword) return;
    
    setIsLoading(true);
    console.log(`Fetching global volume data for keyword: ${keyword}`);
    
    try {
      // Create a data array with initial volumes of 0
      const initialData = countries.map(country => ({
        country: country.name,
        code: country.code,
        flag: country.flag,
        volume: 0,
        percentage: 0
      }));
      
      // Add an "Other" category
      initialData.push({
        country: "Other",
        code: "OTHER",
        flag: "🌎",
        volume: 0,
        percentage: 0
      });
      
      setVolumeData(initialData);
      
      // Process countries in parallel with Promise.all
      const countryPromises = countries.map(async (country) => {
        try {
          // 1. Post search task
          const taskId = await postSearchTask(keyword, country.name);
          
          // 2. Wait a bit before polling
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 3. Poll for results
          const volume = await pollForResults(taskId);
          
          // 4. Return country data with volume
          return {
            country: country.name,
            code: country.code,
            flag: country.flag,
            volume,
            percentage: 0 // will calculate after getting all volumes
          };
        } catch (error) {
          console.error(`Error fetching data for ${country.name}:`, error);
          return {
            country: country.name,
            code: country.code,
            flag: country.flag,
            volume: 0,
            percentage: 0
          };
        }
      });
      
      // Wait for all country data
      const results = await Promise.all(countryPromises);
      console.log("All country results:", results);
      
      // Calculate global volume as sum of all countries
      const total = results.reduce((sum, item) => sum + item.volume, 0);
      
      // Add 10% for "Other" countries
      const otherVolume = Math.round(total * 0.1);
      const globalTotal = total + otherVolume;
      
      console.log(`Total volume: ${total}, Global total with Other: ${globalTotal}`);
      
      // Calculate percentages based on total volume
      const resultsWithPercentages = results.map(item => ({
        ...item,
        percentage: globalTotal > 0 ? (item.volume / globalTotal) * 100 : 0
      }));
      
      // Add the "Other" entry
      resultsWithPercentages.push({
        country: "Other",
        code: "OTHER",
        flag: "🌎",
        volume: otherVolume,
        percentage: globalTotal > 0 ? (otherVolume / globalTotal) * 100 : 0
      });
      
      // Sort by volume (highest first)
      resultsWithPercentages.sort((a, b) => b.volume - a.volume);
      
      setVolumeData(resultsWithPercentages);
      setTotalVolume(globalTotal);
    } catch (error) {
      console.error("Error fetching global volume data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (keyword) {
      fetchGlobalVolumeData();
    }
  }, [keyword]);

  if (!keyword) {
    return null;
  }

  // Function to format volume (e.g., 9200 → 9.2K)
  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    } else {
      return volume.toString();
    }
  };

  // Function to get flag URL for country code
  const getFlagUrl = (code: string): string => {
    if (code === "OTHER") {
      return "https://cdn-icons-png.flaticon.com/512/44/44386.png"; // World globe icon
    }
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`; // Using flagcdn.com for country flags
  };

  return (
    <Card className="h-[50vh] min-h-[400px]">
      <CardHeader className="pb-0 pt-3">
        <CardTitle className="flex items-center gap-1.5 text-lg font-semibold">
          <Globe className="h-4 w-4 text-muted-foreground" />
          Global Volume
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1.5">
        {isLoading ? (
          <div className="space-y-3.5 h-[calc(50vh-80px)] min-h-[320px]">
            <Skeleton className="h-8 w-24" />
            <div className="space-y-3.5 mt-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-5 rounded" />
                    <Skeleton className="h-3.5 w-12" />
                    <Skeleton className="h-3.5 w-12 ml-auto" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 h-[calc(50vh-80px)] min-h-[320px]">
            <div className="text-3xl font-bold">
              {formatVolume(totalVolume)}
            </div>
            <div className="space-y-3 mt-2 ">
              {volumeData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-3.5 relative overflow-hidden rounded-sm">
                        <img 
                          src={getFlagUrl(item.code)} 
                          alt={`${item.country} flag`}
                          className="object-cover w-full h-full"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                      <span className="font-medium text-sm">{item.code}</span>
                    </div>
                    <span className={`text-sm ${index === 0 ? "font-medium" : "text-muted-foreground"}`}>
                      {formatVolume(item.volume)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                      style={{ width: `${Math.max(item.percentage, 1)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 