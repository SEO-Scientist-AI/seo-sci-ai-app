"use client"

import { useEffect, useRef } from "react"

interface TrendChartProps {
  data: number[]
  height?: number
}

export function TrendChart({ data, height = 40 }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set line style
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Calculate points
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const padding = 5
    const availableHeight = canvas.height - padding * 2
    const step = canvas.width / (data.length - 1)

    // Draw line
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = index * step
      const normalizedValue = (value - min) / range
      const y = canvas.height - (normalizedValue * availableHeight + padding)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }, [data])

  return <canvas ref={canvasRef} width={120} height={height} className="w-full text-white" />
}

