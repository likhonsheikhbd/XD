import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { TelegramProvider } from "./contexts/TelegramContext"
import { AuthProvider } from "./contexts/AuthContext"
import { VibeProvider } from "./contexts/VibeContext"
import { I18nextProvider } from "react-i18next"
import i18n from "./lib/i18n"

// Initialize Telegram Web App
const initTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp

    // Configure the app
    tg.ready()
    tg.expand()
    tg.enableClosingConfirmation()
    tg.enableVerticalSwipes()

    // Set theme colors
    tg.setHeaderColor(tg.themeParams.bg_color || "#ffffff")
    tg.setBackgroundColor(tg.themeParams.bg_color || "#ffffff")

    // Update CSS variables with Telegram theme
    const root = document.documentElement
    root.style.setProperty("--tg-theme-bg-color", tg.backgroundColor)
    root.style.setProperty("--tg-theme-text-color", tg.themeParams.text_color || "#000000")
    root.style.setProperty("--tg-theme-hint-color", tg.themeParams.hint_color || "#999999")
    root.style.setProperty("--tg-theme-link-color", tg.themeParams.link_color || "#2481cc")
    root.style.setProperty("--tg-theme-button-color", tg.themeParams.button_color || "#2481cc")
    root.style.setProperty("--tg-theme-button-text-color", tg.themeParams.button_text_color || "#ffffff")
    root.style.setProperty("--tg-theme-secondary-bg-color", tg.themeParams.secondary_bg_color || "#f1f1f1")
    root.style.setProperty("--tg-viewport-height", `${tg.viewportHeight}px`)
    root.style.setProperty("--tg-viewport-stable-height", `${tg.viewportStableHeight}px`)

    // Handle viewport changes
    tg.onEvent("viewportChanged", () => {
      root.style.setProperty("--tg-viewport-height", `${tg.viewportHeight}px`)
      root.style.setProperty("--tg-viewport-stable-height", `${tg.viewportStableHeight}px`)
    })

    // Handle theme changes
    tg.onEvent("themeChanged", () => {
      root.style.setProperty("--tg-theme-bg-color", tg.backgroundColor)
      root.style.setProperty("--tg-theme-text-color", tg.themeParams.text_color || "#000000")
      tg.setHeaderColor(tg.themeParams.bg_color || "#ffffff")
      tg.setBackgroundColor(tg.themeParams.bg_color || "#ffffff")
    })

    return true
  }
  return false
}

// Check if running in Telegram
const isTelegram = initTelegramApp()

// Hide loading screen and show appropriate content
const loadingElement = document.getElementById("loading")
const authRequiredElement = document.getElementById("auth-required")

if (loadingElement) {
  loadingElement.style.display = "none"
}

if (!isTelegram || !window.Telegram?.WebApp?.initDataUnsafe?.user) {
  // Show auth required screen if not in Telegram or no user data
  if (authRequiredElement) {
    authRequiredElement.style.display = "flex"
  }
} else {
  // Mount React app if authenticated
  const root = ReactDOM.createRoot(document.getElementById("app")!)

  root.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <TelegramProvider>
          <AuthProvider>
            <VibeProvider>
              <App />
            </VibeProvider>
          </AuthProvider>
        </TelegramProvider>
      </I18nextProvider>
    </React.StrictMode>,
  )
}
