"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Palette, Zap, Shield } from "lucide-react"
import { useTelegram } from "../hooks/useTelegram"
import { translate } from "../lib/multilingual"
import type { VibeAnalysis } from "../lib/vibe-detection"

interface VibeFlowProps {
  vibe?: VibeAnalysis
  mood?: string
  visualDirection?: string
  children: React.ReactNode
  className?: string
  onNext?: () => void
  onPrevious?: () => void
  showNavigation?: boolean
  step?: number
  totalSteps?: number
  language?: string
}

export function VibeFlow({
  vibe,
  mood = "energetic",
  visualDirection = "clean",
  children,
  className = "",
  onNext,
  onPrevious,
  showNavigation = false,
  step = 1,
  totalSteps = 1,
  language = "en",
}: VibeFlowProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram()

  useEffect(() => {
    setIsVisible(true)
    
    // Set up Telegram main button if navigation is enabled
    if (showNavigation && onNext && step < totalSteps) {
      showMainButton(translate('next', language), () => {
        hapticFeedback('light')
        onNext()
      })
    } else {
      hideMainButton()
    }

    return () => {
      hideMainButton()
    }
  }, [step, totalSteps, onNext, showNavigation, language])

  const getVibeColors = (vibeType: string) => {
    const vibeMap: Record<string, { from: string; to: string; accent: string }> = {
      modern: { from: "from-blue-500/20", to: "to-purple-500/20", accent: "border-blue-500" },
      retro: { from: "from-orange-500/20", to: "to-pink-500/20", accent: "border-orange-500" },
      minimal: { from: "from-gray-500/20", to: "to-slate-500/20", accent: "border-gray-500" },
      vibrant: { from: "from-green-500/20", to: "to-yellow-500/20", accent: "border-green-500" },
      dark: { from: "from-gray-800/20", to: "to-black/20", accent: "border-gray-800" },
      elegant: { from: "from-purple-500/20", to: "to-indigo-500/20", accent: "border-purple-500" },
      playful: { from: "from-pink-500/20", to: "to-yellow-500/20", accent: "border-pink-500" },
      professional: { from: "from-blue-800/20", to: "to-gray-800/20", accent: "border-blue-800" },
    }
    return vibeMap[vibeType] || vibeMap.modern
  }

  const getVibeIcon = (vibeType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      modern: <Zap className="w-5 h-5" />,
      retro: <Sparkles className="w-5 h-5" />,
      minimal: <Palette className="w-5 h-5" />,
      vibrant: <Sparkles className="w-5 h-5" />,
      dark: <Shield className="w-5 h-5" />,
      elegant: <Palette className="w-5 h-5" />,
      playful: <Sparkles className="w-5 h-5" />,
      professional: <Shield className="w-5 h-5" />,
    }
    return iconMap[vibeType] || iconMap.modern
  }

  const vibeType = vibe?.primaryVibe || "modern"
  const colors = getVibeColors(vibeType)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-2xl border-2 ${colors.accent} bg-gradient-to-br ${colors.from} ${colors.to} backdrop-blur-sm ${className}`}
        style={{
          background: vibe?.colorPalette ? 
            `linear-gradient(135deg, ${vibe.colorPalette[0]}20, ${vibe.colorPalette[1] || vibe.colorPalette[0]}20)` : 
            undefined
        }}
      >
        {/* Progress indicator */}
        {showNavigation && totalSteps > 1 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5
