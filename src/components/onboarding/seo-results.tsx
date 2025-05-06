"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SeoResultsProps {
  results: {
    score: number;
    metrics: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
      aiOptimization: number;
    };
    keywords: Array<{
      keyword: string;
      volume: number;
      difficulty: string;
      position: number;
    }>;
    recommendations: Array<{
      title: string;
      priority: string;
      impact: string;
    }>;
  };
  url: string;
  projectName: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function SeoResults({ 
  results, 
  url, 
  projectName, 
  onBack, 
  onComplete 
}: SeoResultsProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-8">
        <div className="bg-purple-600 text-white w-10 h-10 rounded-md flex items-center justify-center mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xl font-semibold">SEO Optimizer</span>
        <div className="ml-auto flex items-center">
          <span className="text-gray-600 mr-4">{projectName}</span>
          <span className="text-gray-600">{url}</span>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">SEO Audit Results</h2>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <div className="absolute inset-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="3"
                      strokeDasharray={`${results.score}, 100`}
                    />
                  </svg>
                </div>
                <div className="text-4xl font-bold">{results.score}</div>
              </div>
            </div>
            <div className="text-center text-purple-700 font-medium">
              Overall Score
            </div>
          </div>

          <div className="col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Performance</span>
                <span className="text-sm font-bold">
                  {results.metrics.performance}%
                </span>
              </div>
              <Progress
                value={results.metrics.performance}
                className="h-2 bg-gray-200"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Accessibility</span>
                <span className="text-sm font-bold">
                  {results.metrics.accessibility}%
                </span>
              </div>
              <Progress
                value={results.metrics.accessibility}
                className="h-2 bg-gray-200"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Best Practices</span>
                <span className="text-sm font-bold">
                  {results.metrics.bestPractices}%
                </span>
              </div>
              <Progress
                value={results.metrics.bestPractices}
                className="h-2 bg-gray-200"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SEO</span>
                <span className="text-sm font-bold">
                  {results.metrics.seo}%
                </span>
              </div>
              <Progress
                value={results.metrics.seo}
                className="h-2 bg-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Keyword Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Keyword
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Volume
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Difficulty
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.keywords.map((keyword, index) => (
                  <tr
                    key={index}
                    className={
                      index !== results.keywords.length - 1
                        ? "border-b"
                        : ""
                    }
                  >
                    <td className="py-3 px-4">{keyword.keyword}</td>
                    <td className="py-3 px-4">
                      {keyword.volume.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          keyword.difficulty === "High"
                            ? "bg-red-100 text-red-800"
                            : keyword.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {keyword.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">#{keyword.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Optimization */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">AI Optimization</h3>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>AI Optimization Score</span>
              <span className="font-medium">
                {results.metrics.aiOptimization}%
              </span>
            </div>
            <Progress
              value={results.metrics.aiOptimization}
              className="h-2 bg-gray-200"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">AI Crawler Visibility</span>
              </div>
              <p className="text-sm text-gray-600">
                Your site is properly structured for AI crawlers, but could
                benefit from additional schema markup.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                <span className="font-medium">
                  LLM Content Optimization
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Content is well-structured but lacks semantic richness that
                would help LLMs better understand your content.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">AI Search Readiness</span>
              </div>
              <p className="text-sm text-gray-600">
                Your site appears in AI search results but could improve
                visibility with better structured data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-6">
          Optimization Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.recommendations.map((rec, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    rec.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : rec.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <div className="flex space-x-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        rec.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : rec.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        rec.impact === "High"
                          ? "bg-purple-100 text-purple-800"
                          : rec.impact === "Medium"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rec.impact} Impact
                    </span>
                  </div>
                  <Button className="text-xs bg-transparent hover:bg-gray-100 text-purple-600 border border-purple-600 rounded-md whitespace-nowrap">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          className="bg-transparent hover:bg-gray-100 text-purple-600 border border-purple-600 rounded-md whitespace-nowrap"
          onClick={onBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Input
        </Button>
        <div className="flex space-x-2">
          <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-2 bg-purple-600 rounded-full"></div>
          <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-md whitespace-nowrap"
          onClick={onComplete}
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
} 