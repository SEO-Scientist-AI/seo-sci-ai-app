"use client";

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { cn } from "@/lib/utils";

interface MetricChartProps {
  data: number[];
  color: string;
  className?: string;
}

export function MetricChart({ data, color, className }: MetricChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [{
          data,
          type: 'line',
          showSymbol: false,
          smooth: true,
          lineStyle: {
            color,
            width: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: `${color}40` // 25% opacity
              }, {
                offset: 1,
                color: `${color}00` // 0% opacity
              }]
            }
          }
        }],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut' as const
      };
      chart.setOption(option);
      
      const handleResize = () => {
        chart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [data, color]);

  return <div ref={chartRef} className={cn("h-24", className)} />;
} 