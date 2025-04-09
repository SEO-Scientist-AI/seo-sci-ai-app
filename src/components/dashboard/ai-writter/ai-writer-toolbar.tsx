"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye, Share2, Copy, FileDown, Plug } from "lucide-react"

interface AiWriterToolbarProps {
  className?: string
  onPreview?: () => void
  onShare?: () => void
  onCopy?: () => void
  onExport?: () => void
  onIntegrations?: () => void
}

export function AiWriterToolbar({
  className,
  onPreview,
  onShare,
  onCopy,
  onExport,
  onIntegrations
}: AiWriterToolbarProps) {
  return (
    <div className={cn("border rounded-lg shadow-sm mb-5", className)}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md relative group"
            onClick={onPreview}
          >
            <Eye className="h-4 w-4" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Preview
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md relative group"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M50 0 L100 50 L50 100 L0 50 Z"
                  fill="url(#gradient)"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              AI Writer
            </span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md relative group"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Share
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md relative group"
            title="Copy"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Copy to clipboard
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md relative group"
            onClick={onExport}
          >
            <FileDown className="h-4 w-4" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md relative group"
            onClick={onIntegrations}
          >
            <Plug className="h-4 w-4" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Integrations
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
} 