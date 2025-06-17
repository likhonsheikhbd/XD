"use client"

import { useState, useEffect } from "react"

export interface ChatSettings {
  model?: string
  temperature?: number
  topP?: number
  maxTokens?: number
  useSearchGrounding?: boolean
  autoTranslate?: boolean
  targetLanguage?: string
  enableSentiment?: boolean
  enableModeration?: boolean
  safetyLevel?: "low" | "medium" | "high" | "strict"
}

const defaultSettings: ChatSettings = {
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  useSearchGrounding: false,
  autoTranslate: false,
  targetLanguage: "en",
  enableSentiment: true,
  enableModeration: true,
  safetyLevel: "medium",
}

export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("chat-settings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  const updateSettings = (updates: Partial<ChatSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    localStorage.setItem("chat-settings", JSON.stringify(newSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem("chat-settings", JSON.stringify(defaultSettings))
  }

  return {
    settings,
    updateSettings,
    resetSettings,
  }
}
