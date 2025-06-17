"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Download } from "lucide-react"
import { detectVibe, type VibeAnalysis } from "@/lib/vibe-detection"
import { detectLanguage, translate } from "@/lib/multilingual"
import { cn } from "@/lib/utils"

interface VibeAnalyzerProps {
  className?: string
}

export function VibeAnalyzer({ className }: VibeAnalyzerProps) {
  const [input, setInput] = useState("")
  const [code, setCode] = useState("")
  const [vibe, setVibe] = useState<VibeAnalysis | null>(null)
  const [language, setLanguage] = useState("en")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeVibe = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)

    // Detect language
    const detectedLang = detectLanguage(input)
    setLanguage(detectedLang)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Analyze vibe
    const vibeAnalysis = detectVibe(input)
    setVibe(vibeAnalysis)

    setIsAnalyzing(false)
  }

  const generateCode = async () => {
    if (!vibe) return

    // Generate sample code based on vibe
    const sampleCode = `
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ${vibe.primaryVibe.charAt(0).toUpperCase() + vibe.primaryVibe.slice(1)}Component() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: '${vibe.typography}' }}>
          ${vibe.primaryVibe.charAt(0).toUpperCase() + vibe.primaryVibe.slice(1)} Design
        </h2>
        <p className="text-muted-foreground mb-4">
          This component embodies a ${vibe.mood} ${vibe.primaryVibe} aesthetic.
        </p>
        <Button 
          className="w-full"
          style={{ backgroundColor: '${vibe.colorPalette[0]}' }}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
}
    `.trim()

    setCode(sampleCode)
  }

  const exportAnalysis = () => {
    if (!vibe) return

    const analysis = {
      input,
      language,
      vibe,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vibe-analysis-${vibe.primaryVibe}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {translate("vibeQuestion", language)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your project vision, aesthetic preferences, or design goals..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex gap-2">
            <Button onClick={analyzeVibe} disabled={!input.trim() || isAnalyzing} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Vibe"}
            </Button>

            {vibe && (
              <>
                <Button variant="outline" onClick={generateCode}>
                  Generate Code
                </Button>
                <Button variant="outline" onClick={exportAnalysis}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </>
            )}
          </div>

          {language !== "en" && <div>Translated from {language}</div>}
        </CardContent>
      </Card>

      {code && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 rounded-md p-4">
              <code>{code}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
