"use client"

import { useEffect, useState } from "react"
import type { TelegramWebApp, TelegramUser } from "../types/telegram"

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const app = window.Telegram?.WebApp
    if (app) {
      app.ready()
      setWebApp(app)
      setUser(app.initDataUnsafe.user || null)
      setIsReady(true)

      // Expand the app to full height
      app.expand()

      // Set up theme
      document.documentElement.style.setProperty("--tg-theme-bg-color", app.backgroundColor)
      document.documentElement.style.setProperty("--tg-theme-text-color", app.themeParams.text_color || "#000000")
      document.documentElement.style.setProperty("--tg-theme-hint-color", app.themeParams.hint_color || "#999999")
      document.documentElement.style.setProperty("--tg-theme-link-color", app.themeParams.link_color || "#2481cc")
      document.documentElement.style.setProperty("--tg-theme-button-color", app.themeParams.button_color || "#2481cc")
      document.documentElement.style.setProperty(
        "--tg-theme-button-text-color",
        app.themeParams.button_text_color || "#ffffff",
      )

      // Handle theme changes
      app.onEvent("themeChanged", () => {
        document.documentElement.style.setProperty("--tg-theme-bg-color", app.backgroundColor)
        document.documentElement.style.setProperty("--tg-theme-text-color", app.themeParams.text_color || "#000000")
      })
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

  const showAlert = (message: string) => {
    return new Promise<void>((resolve) => {
      if (webApp) {
        webApp.showAlert(message, () => resolve())
      } else {
        alert(message)
        resolve()
      }
    })
  }

  const showConfirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed))
      } else {
        resolve(confirm(message))
      }
    })
  }

  const openInvoice = (url: string) => {
    return new Promise<string>((resolve) => {
      if (webApp) {
        webApp.openInvoice(url, (status) => resolve(status))
      } else {
        window.open(url, "_blank")
        resolve("opened")
      }
    })
  }

  return {
    webApp,
    user,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    openInvoice,
  }
}
