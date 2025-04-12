"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Line as ChartJSLine } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartJSTooltip,
  Legend
)

interface TimeSeriesData {
  name: string
  totalIssues: number
  siteHealth: number
  pagesCrawled: number
  totalErrors: number
  totalWarnings: number
}

export interface LegendItem {
  key: string
  label: string
  color: string
  category: 'general' | 'errors' | 'warnings' | 'notices'
}

export const LEGEND_ITEMS: LegendItem[] = [
  // General
  { key: 'pagesCrawled', label: 'Pages crawled', color: '#22c55e', category: 'general' },
  { key: 'siteHealth', label: 'Site Health', color: '#0ea5e9', category: 'general' },
  { key: 'totalIssues', label: 'Total issues', color: '#ec4899', category: 'general' },
  { key: 'totalErrors', label: 'Total errors', color: '#ef4444', category: 'general' },
  { key: 'totalWarnings', label: 'Total warnings', color: '#f59e0b', category: 'general' },
  
  // Errors
  { key: '5xxErrors', label: '5xx errors', color: '#dc2626', category: 'errors' },
  { key: '4xxErrors', label: '4xx errors', color: '#b91c1c', category: 'errors' },
  { key: 'missingTitleTags', label: 'Missing title tags', color: '#991b1b', category: 'errors' },
  { key: 'duplicateTitleTags', label: 'Duplicate title tags', color: '#7f1d1d', category: 'errors' },
  
  // Warnings
  { key: 'brokenExternalLinks', label: 'Broken external links', color: '#ea580c', category: 'warnings' },
  { key: 'brokenExternalImages', label: 'Broken external images', color: '#c2410c', category: 'warnings' },
  { key: 'linksLeadToHttp', label: 'Links lead to HTTP pages for HTTPS site', color: '#9a3412', category: 'warnings' },
  
  // Notices
  { key: 'multipleH1Tags', label: 'Multiple h1 tags', color: '#2563eb', category: 'notices' },
  { key: 'blockedFromCrawling', label: 'Blocked from crawling', color: '#1d4ed8', category: 'notices' },
  { key: 'urlsLongerThan200', label: 'URLs longer than 200 characters', color: '#1e40af', category: 'notices' }
]

const data: TimeSeriesData[] = [
  {
    name: "Apr 1",
    totalIssues: 120,
    siteHealth: 85,
    pagesCrawled: 150,
    totalErrors: 20,
    totalWarnings: 35,
  },
  {
    name: "Apr 3",
    totalIssues: 170,
    siteHealth: 82,
    pagesCrawled: 220,
    totalErrors: 25,
    totalWarnings: 45,
  },
  {
    name: "Apr 5",
    totalIssues: 210,
    siteHealth: 78,
    pagesCrawled: 280,
    totalErrors: 30,
    totalWarnings: 55,
  },
  {
    name: "Apr 6",
    totalIssues: 250,
    siteHealth: 75,
    pagesCrawled: 320,
    totalErrors: 35,
    totalWarnings: 65,
  },
]

interface ChartProps {
  visibleLines: Set<string>
  onToggleLine: (key: string) => void
}

export function Chart({ visibleLines = new Set(['totalIssues']), onToggleLine }: ChartProps) {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  // Generate random data for each line
  const generateData = () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))

  const chartData: ChartData<'line'> = {
    labels,
    datasets: LEGEND_ITEMS
      .filter(item => visibleLines.has(item.key))
      .map(item => ({
        label: item.label,
        data: generateData(),
        borderColor: item.color,
        backgroundColor: item.color,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 3,
      })),
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="h-[350px]">
      <ChartJSLine options={options} data={chartData} />
    </div>
  )
} 