"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useTelegram } from "./hooks/useTelegram"
import { useAuth } from "./contexts/AuthContext"
import { useVibe } from "./contexts/VibeContext"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { LoadingScreen } from "./components/LoadingScreen"
import { Layout } from "./components/Layout"
import { HomePage } from "./pages/HomePage"
import { VibeDetectionPage } from "./pages/VibeDetectionPage"
import { MoodBoardPage } from "./pages/MoodBoardPage"
import { SecurityPage } from "./pages/SecurityPage"
import { SettingsPage } from "./pages/SettingsPage"
import { PaymentPage } from "./pages/PaymentPage"
import { ProfilePage } from "./pages/ProfilePage"
import "./App.css"

function App() {
  const { webApp, user, isReady } = useTelegram()
  const { isAuthenticated, login, loading: authLoading } = useAuth()
  const { currentVibe } = useVibe()
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      if (isReady && user) {
        try {
          // Authenticate with backend
          await login(webApp?.initData || "")

          // Set up haptic feedback for better UX
          if (webApp?.HapticFeedback) {
            webApp.HapticFeedback.impactOccurred("light")
          }

          // Configure main button
          if (webApp?.MainButton) {
            webApp.MainButton.setParams({
              color: currentVibe?.colorPalette?.[0] || "#2481cc",
              text_color: "#ffffff",
            })
          }
        } catch (error) {
          console.error("App initialization failed:", error)
          webApp?.showAlert("Failed to initialize app. Please try again.")
        }
      }

      setAppLoading(false)
    }

    initializeApp()
  }, [isReady, user, login, webApp, currentVibe])

  // Show loading screen while app initializes
  if (appLoading || authLoading || !isReady) {
    return <LoadingScreen />
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="auth-error">
        <h2>Authentication Required</h2>
        <p>Please restart the app from Telegram</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vibe" element={<VibeDetectionPage />} />
            <Route path="/moodboard" element={<MoodBoardPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
