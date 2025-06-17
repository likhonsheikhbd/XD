"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Shuffle, Download, Share } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VibeAnalysis } from "@/lib/vibe-detection"

interface MoodBoardProps {
  vibe: VibeAnalysis
  className?: string
}

interface MoodBoardElement {
  type: "color" | "typography" | "pattern" | "image"
  value: string
  label: string
}

export function MoodBoard({ vibe, className }: MoodBoardProps) {
  const [elements, setElements] = useState<MoodBoardElement[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateMoodBoard()
  }, [vibe])

  const generateMoodBoard = async () => {
    setIsGenerating(true)

    // Simulate mood board generation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newElements: MoodBoardElement[] = [
      // Colors
      ...vibe.colorPalette.map((color, index) => ({
        type: "color" as const,
        value: color,
        label: `Color ${index + 1}`,
      })),

      // Typography
      {
        type: "typography" as const,
        value: vibe.typography,
        label: "Primary Font",
      },

      // Patterns based on vibe
      ...getVibePatterns(vibe.primaryVibe).map((pattern, index) => ({
        type: "pattern" as const,
        value: pattern,
        label: `Pattern ${index + 1}`,
      })),

      // Sample images (placeholder URLs)
      ...Array.from({ length: 3 }, (_, index) => ({
        type: "image" as const,
        value: `/placeholder.svg?height=200&width=300&text=${vibe.primaryVibe}+${index + 1}`,
        label: `Inspiration ${index + 1}`,
      })),
    ]

    setElements(newElements)
    setIsGenerating(false)
  }

  const getVibePatterns = (vibe: string): string[] => {
    const patterns: Record<string, string[]> = {
      modern: ["geometric", "grid", "minimal-lines"],
      retro: ["dots", "stripes", "vintage-texture"],
      minimal: ["clean-lines", "whitespace", "subtle-grid"],
      vibrant: ["gradients", "color-blocks", "dynamic-shapes"],
      dark: ["shadows", "glow-effects", "dark-gradients"],
      elegant: ["ornate-borders", "refined-patterns", "luxury-textures"],
    }
    return patterns[vibe] || patterns.modern
  }

  const exportMoodBoard = () => {
    const data = {
      vibe: vibe.primaryVibe,
      mood: vibe.mood,
      elements: elements,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mood-board-${vibe.primaryVibe}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareMoodBoard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vibe.primaryVibe} Mood Board`,
          text: `Check out this ${vibe.primaryVibe} mood board with ${vibe.mood} vibes!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <CardTitle>Mood Board</CardTitle>
            <Badge variant="secondary">{vibe.primaryVibe}</Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generateMoodBoard} disabled={isGenerating}>
              <Shuffle className="w-4 h-4 mr-1" />
              {isGenerating ? "Generating..." : "Regenerate"}
            </Button>

            <Button variant="outline" size="sm" onClick={exportMoodBoard}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>

            <Button variant="outline" size="sm" onClick={shareMoodBoard}>
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {elements.map((element, index) => (
            <MoodBoardItem key={index} element={element} />
          ))}
        </div>

        {elements.length === 0 && !isGenerating && (
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Click "Generate" to create your mood board</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MoodBoardItem({ element }: { element: MoodBoardElement }) {
  const renderElement = () => {
    switch (element.type) {
      case "color":
        return (
          <div className="aspect-square rounded-lg border-2 border-border overflow-hidden">
            <div className="w-full h-full" style={{ backgroundColor: element.value }} />
          </div>
        )

      case "typography":
        return (
          <div className="aspect-square rounded-lg border-2 border-border p-4 flex items-center justify-center bg-muted">
            <div className="text-lg font-medium text-center" style={{ fontFamily: element.value }}>
              Aa
            </div>
          </div>
        )

      case "pattern":
        return (
          <div className="aspect-square rounded-lg border-2 border-border p-4 flex items-center justify-center bg-muted">
            <div className="text-xs text-center text-muted-foreground">{element.value}</div>
          </div>
        )

      case "image":
        return (
          <div className="aspect-square rounded-lg border-2 border-border overflow-hidden">
            <img src={element.value || "/placeholder.svg"} alt={element.label} className="w-full h-full object-cover" />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {renderElement()}
      <p className="text-xs text-center text-muted-foreground font-medium">{element.label}</p>
    </div>
  )
}
