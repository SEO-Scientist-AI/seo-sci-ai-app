"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WebsiteInfoForm from "@/components/onboarding/website-info-form";
import LoadingAnalysis from "@/components/onboarding/loading-analysis";
import SeoResults from "@/components/onboarding/seo-results";

export default function OverviewClient() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // SEO results data structure
  const [seoResults, setSeoResults] = useState({
    score: 72,
    metrics: {
      performance: 85,
      accessibility: 92,
      bestPractices: 78,
      seo: 95,
      aiOptimization: 65,
    },
    keywords: [
      {
        keyword: "digital marketing",
        volume: 12500,
        difficulty: "Medium",
        position: 8,
      },
      { keyword: "seo tools", volume: 8300, difficulty: "High", position: 12 },
      {
        keyword: "website optimization",
        volume: 5400,
        difficulty: "Low",
        position: 3,
      },
      { keyword: "ai seo", volume: 3200, difficulty: "Medium", position: 5 },
    ],
    recommendations: [
      { title: "Improve page load speed", priority: "High", impact: "High" },
      {
        title: "Add structured data markup",
        priority: "Medium",
        impact: "High",
      },
      { title: "Optimize for AI crawlers", priority: "High", impact: "Medium" },
      { title: "Fix broken links", priority: "Medium", impact: "Medium" },
      {
        title: "Improve mobile responsiveness",
        priority: "High",
        impact: "High",
      },
    ],
  });

  const handleSubmit = (url: string, projectName: string) => {
    if (!url || !projectName) return;

    setUrl(url);
    setProjectName(projectName);
    setIsLoading(true);
    setLoadingProgress(0);

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Simulate API call completion
    setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        setShowResults(true);
      }, 500);
    }, 5000);
  };

  const handleComplete = () => {
    // Navigate to dashboard or next onboarding step
    router.push("/dashboard");
  };

  const handleBackToInput = () => {
    setShowResults(false);
  };

  // Render appropriate component based on state
  if (isLoading) {
    return <LoadingAnalysis progress={loadingProgress} />;
  }

  if (showResults) {
    return (
      <SeoResults
        results={seoResults}
        url={url}
        projectName={projectName}
        onBack={handleBackToInput}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <WebsiteInfoForm 
      onSubmit={handleSubmit}
    />
  );
} 