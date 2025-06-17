"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { TelegramWebApp, TelegramUser } from "../types/telegram"

interface TelegramContextType {
  webApp: TelegramWebApp | null
  user: TelegramUser | null
  isReady: boolean
  platform: string
  colorScheme: "light" | "dark"
  viewportHeight: number
  viewportStableHeight: number
  safeAreaInsets: {
    top: number
    bottom: number
    left: number
    right: number
  }
  showMainButton: (text: string, onClick: () => void) => void
  hideMainButton: () => void
  showBackButton: (onClick: () => void) => void
  hideBackButton: () => void
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => void
  showAlert: (message: string) => Promise<void>
  showConfirm: (message: string) => Promise<boolean>
  openInvoice: (url: string) => Promise<string>
  shareToStory: (mediaUrl: string, params?: any) => void
  requestFullscreen: () => void
  exitFullscreen: () => void
  lockOrientation: () => void
  unlockOrientation: () => void
  addToHomeScreen: () => void
}

const TelegramContext = createContext<TelegramContextType | null>(null)

interface TelegramProviderProps {
  children: ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [platform, setPlatform] = useState("")
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light")
  const [viewportHeight, setViewportHeight] = useState(0)
  const [viewportStableHeight, setViewportStableHeight] = useState(0)
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  useEffect(() => {
    const app = window.Telegram?.WebApp
    if (app) {
      setWebApp(app)
      setUser(app.initDataUnsafe.user || null)
      setPlatform(app.platform)
      setColorScheme(app.colorScheme)
      setViewportHeight(app.viewportHeight)
      setViewportStableHeight(app.viewportStableHeight)

      // Set safe area insets if available
      if (app.safeAreaInset) {
        setSafeAreaInsets({
          top: app.safeAreaInset.top || 0,
          bottom: app.safeAreaInset.bottom || 0,
          left: app.safeAreaInset.left || 0,
          right: app.safeAreaInset.right || 0,
        })
      }

      // Set up event listeners
      const handleViewportChanged = () => {
        setViewportHeight(app.viewportHeight)
        setViewportStableHeight(app.viewportStableHeight)
      }

      const handleThemeChanged = () => {
        setColorScheme(app.colorScheme)
      }

      app.onEvent("viewportChanged", handleViewportChanged)
      app.onEvent("themeChanged", handleThemeChanged)

      setIsReady(true)

      // Cleanup
      return () => {
        app.offEvent("viewportChanged", handleViewportChanged)
        app.offEvent("themeChanged", handleThemeChanged)
      }
    }
  }, [])

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text)
      webApp.MainButton.onClick(onClick)
      webApp.MainButton.show()
    }
  }

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide()
    }
  }

  const showBackButton = (onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick)
      webApp.BackButton.show()
    }
  }

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide()
    }
  }

  const hapticFeedback = (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => {
    if (webApp?.HapticFeedback) {
      if (["success", "error", "warning"].includes(type)) {
        webApp.HapticFeedback.notificationOccurred(type as "success" | "error" | "warning")
      } else {
        webApp.HapticFeedback.impactOccurred(type as "light" | "medium" | "heavy")
      }
    }
  }

  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showAlert(message, () => resolve())
      } else {
        alert(message)
        resolve()
      }
    })
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed))
      } else {
        resolve(confirm(message))
      }
    })
  }

  const openInvoice = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.openInvoice(url, (status) => resolve(status))
      } else {
        window.open(url, "_blank")
        resolve("opened")
      }
    })
  }

  const shareToStory = (mediaUrl: string, params?: any) => {
    if (webApp?.shareToStory) {
      webApp.shareToStory(mediaUrl, params)
    }
  }

  const requestFullscreen = () => {
    if (webApp?.requestFullscreen) {
      webApp.requestFullscreen()
    }
  }

  const exitFullscreen = () => {
    if (webApp?.exitFullscreen) {
      webApp.exitFullscreen()
    }
  }

  const lockOrientation = () => {
    if (webApp?.lockOrientation) {
      webApp.lockOrientation()
    }
  }

  const unlockOrientation = () => {
    if (webApp?.unlockOrientation) {
      webApp.unlockOrientation()
    }
  }

  const addToHomeScreen = () => {
    if (webApp?.addToHomeScreen) {
      webApp.addToHomeScreen()
    }
  }

  const value: TelegramContextType = {
    webApp,
    user,
    isReady,
    platform,
    colorScheme,
    viewportHeight,
    viewportStableHeight,
    safeAreaInsets,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    openInvoice,
    shareToStory,
    requestFullscreen,
    exitFullscreen,
    lockOrientation,
    unlockOrientation,
    addToHomeScreen,
  }

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider")
  }
  return context
}
