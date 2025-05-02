"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { KeywordOverviewHeader } from "@/components/dashboard/keyword-research/keyword-overview/keyword-overview-header";
import { KeywordOverviewContent } from "@/components/dashboard/keyword-research/keyword-overview/keyword-overview-content";

export const runtime = 'edge';

export default function KeywordOverviewPage() {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get('keyword');
  const countryParam = searchParams.get('country') || 'US';
  const domainParam = searchParams.get('domain');
  
  // State for last updated date - initialized only on client to avoid hydration mismatch
  const [lastUpdated, setLastUpdated] = useState("");
  
  // State for filters - initialized with null as default to avoid hydration issues
  const [country, setCountry] = useState<string | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keywordCount, setKeywordCount] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("N/A");
  
  // Initialize values after component mounts to avoid hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
    setCountry(countryParam);
    setDevice("desktop");
    setDate(new Date());
    setCurrency("USD");
  }, [countryParam]);

  // Currencies for display
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
    { code: "CAD", symbol: "CA$" }
  ];

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || "$";
  };

  // Handle country change to trigger refresh animation
  const handleCountryChange = (newCountry: string) => {
    setIsLoading(true); // Set loading state immediately
    setCountry(newCountry);
    setLastUpdated(new Date().toLocaleString());
  };

  // Handle refresh (make it return a promise)
  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    
    // Force reload of keyword data by changing lastUpdated
    setLastUpdated(new Date().toLocaleString());
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    return Promise.resolve();
  };

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate || null);
  };

  // Handle loading state change from KeywordOverviewContent
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Update keyword metadata from API response
  const updateKeywordMetadata = (difficultyScore: number, relatedKeywordsCount: number) => {
    // Set difficulty label based on score
    let difficultyLabel = "Easy";
    if (difficultyScore > 70) difficultyLabel = "Hard";
    else if (difficultyScore > 40) difficultyLabel = "Medium";
    
    setDifficulty(difficultyLabel);
    setKeywordCount(relatedKeywordsCount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page is not ready until client-side state is initialized */}
      {country && device && currency ? (
        <>
          <KeywordOverviewHeader 
            keyword={keywordParam}
            domain={domainParam}
            country={country}
            device={device}
            date={date}
            currency={currency}
            lastUpdated={lastUpdated}
            keywordCount={keywordCount}
            difficulty={difficulty}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            onCountryChange={handleCountryChange}
            onDeviceChange={setDevice}
            onDateChange={handleDateChange}
            onCurrencyChange={setCurrency}
          />
          
          <KeywordOverviewContent 
            keywordParam={keywordParam}
            currency={currency}
            currencySymbol={getCurrencySymbol(currency)}
            country={country}
            onMetadataUpdate={updateKeywordMetadata}
            onLoadingChange={handleLoadingChange}
          />
        </>
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Loading</AlertTitle>
            <AlertDescription>
              Please wait while we initialize the page...
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
