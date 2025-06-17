"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Palette, Zap, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface VibeFlowProps {
  vibe?: string
  mood?: string
  visualDirection?: string
  children: React.ReactNode
  className?: string
}

export function VibeFlow({
  vibe = "modern",
  mood = "energetic",
  visualDirection = "clean",
  children,
  className,
}: VibeFlowProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getVibeColors = (vibe: string) => {
    const vibeMap: Record<string, string> = {
      modern: "from-blue-500/20 to-purple-500/20",
      retro: "from-orange-500/20 to-pink-500/20",
      minimal: "from-gray-500/20 to-slate-500/20",
      vibrant: "from-green-500/20 to-yellow-500/20",
      dark: "from-gray-800/20 to-black/20",
      elegant: "from-purple-500/20 to-indigo-500/20",
    }
    return vibeMap[vibe] || vibeMap.modern
  }

  const getVibeIcon = (vibe: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      modern: <Zap className="w-4 h-4" />,
      retro: <Sparkles className="w-4 h-4" />,
      minimal: <Palette className="w-4 h-4" />,
      vibrant: <Sparkles className="w-4 h-4" />,
      dark: <Shield className="w-4 h-4" />,
      elegant: <Palette className="w-4 h-4" />,
    }
    return iconMap[vibe] || iconMap.modern
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-700 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", getVibeColors(vibe))} />

      <CardContent className="relative p-6">
        <div className="flex items-center gap-2 mb-4">
          {getVibeIcon(vibe)}
          <h3 className="text-lg font-semibold">Vision Analysis</h3>
          <div className="flex gap-2 ml-auto">
            <Badge variant="secondary" className="text-xs">
              {vibe}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {mood}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Primary Vibe:</span>
            <span className="text-muted-foreground">{vibe}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Mood:</span>
            <span className="text-muted-foreground">{mood}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Visual Direction:</span>
            <span className="text-muted-foreground">{visualDirection}</span>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert">{children}</div>
      </CardContent>
    </Card>
  )
}
