"use client";

import React from "react";

interface LoadingAnalysisProps {
  progress: number;
}

export default function LoadingAnalysis({ progress }: LoadingAnalysisProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <img
        src="/images/loading-analysis.png"
        alt="Loading"
        className="w-full max-w-lg mb-8"
      />
      <div className="text-center max-w-lg px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thank you! Extracting information from your website now
        </h2>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-8 mb-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-600">{progress}% completed</p>
      </div>
    </div>
  );
} 