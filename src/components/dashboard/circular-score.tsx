"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  size?: "default" | "large"
  indicatorColor?: string
  className?: string
  title?: string
  description?: string
}

export function CircularProgress({
  value,
  size = "default",
  indicatorColor = "text-primary",
  className,
  title = " ",
  description,
}: CircularProgressProps) {
  // Add this function to determine color
  const getColorClass = (value: number) => {
    if (value >= 70) return "text-green-500"
    if (value >= 40) return "text-amber-500"
    return "text-red-500"
  }

  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [shouldUseValue, setShouldUseValue] = useState(false)
  const sizeInPixels = size === "large" ? 160 : 120
  const strokeWidth = size === "large" ? 14 : 12 // Increased stroke width
  const gap = 10

  useEffect(() => {
    // Delay animation for a smoother entrance
    const timeout = setTimeout(() => {
      setShouldAnimate(true)
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  // Calculate dimensions for the semi-circle
  const radius = sizeInPixels / 2 - strokeWidth / 2
  const circumference = Math.PI * radius
  const validatedProgress = Math.min(Math.max(value, 0), 100)
  const strokeDashoffset = circumference - (validatedProgress / 100) * circumference

  // Generate tick marks
  const tickMarks = []
  const tickCount = 20 // Number of tick marks
  const tickLength = size === "large" ? 6 : 4
  const tickWidth = size === "large" ? 2 : 1.5
  const tickRadius = radius + strokeWidth / 2 + 2

  for (let i = 0; i <= tickCount; i++) {
    // Calculate angle for each tick (from -180 to 0 degrees)
    const angle = -Math.PI + (i / tickCount) * Math.PI
    const x1 = sizeInPixels / 2 + Math.cos(angle) * tickRadius
    const y1 = sizeInPixels / 2 + Math.sin(angle) * tickRadius
    const x2 = sizeInPixels / 2 + Math.cos(angle) * (tickRadius - tickLength)
    const y2 = sizeInPixels / 2 + Math.sin(angle) * (tickRadius - tickLength)

    // Only show ticks at certain intervals
    if (i % 2 === 0) {
      tickMarks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth={tickWidth}
          className={cn("text-muted transition-opacity duration-700", shouldAnimate ? "opacity-70" : "opacity-0")}
        />,
      )
    }
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: sizeInPixels, height: sizeInPixels / 2 + 40 }}>
        <svg
          width={sizeInPixels}
          height={sizeInPixels}
          viewBox={`0 0 ${sizeInPixels} ${sizeInPixels}`}
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Background Semi-circle */}
          <path
            d={`M ${strokeWidth / 2} ${sizeInPixels / 2} 
                A ${radius} ${radius} 0 0 1 ${sizeInPixels - strokeWidth / 2} ${sizeInPixels / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-muted/20"
          />

          {/* Progress Semi-circle */}
          <path
            d={`M ${strokeWidth / 2} ${sizeInPixels / 2} 
                A ${radius} ${radius} 0 0 1 ${sizeInPixels - strokeWidth / 2} ${sizeInPixels / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-out",
              shouldAnimate ? getColorClass(value) : "text-transparent"
            )}
            strokeDasharray={circumference}
            strokeDashoffset={shouldAnimate ? strokeDashoffset : circumference}
          />

          {/* Tick marks */}
          {tickMarks}
        </svg>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 text-center",
          )}
        >
          <div className={cn("font-bold", size === "large" ? "text-4xl" : "text-3xl")}>{validatedProgress}</div>

          <div className={cn("font-medium mt-1", size === "large" ? "text-sm" : "text-xs")}>{title}</div>

          {description && (
            <div
              className={cn(
                "text-muted-foreground text-center mt-2 max-w-[200px] mx-auto",
                size === "large" ? "text-xs" : "text-[10px]",
              )}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

