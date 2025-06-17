"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTelegram } from "./TelegramContext"
import { authAPI } from "../lib/api"

interface User {
  id: number
  telegramId: number
  username?: string
  firstName: string
  lastName?: string
  languageCode: string
  isPremium: boolean
  vibePreferences: {
    primaryVibe: string
    colorPalette: string[]
    typography: string
    animations: string[]
    culturalContext?: string
  }
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (initData: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { webApp, user: telegramUser } = useTelegram()

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("auth_token")
    if (token && telegramUser) {
      // Validate token with backend
      validateSession(token)
    } else {
      setLoading(false)
    }
  }, [telegramUser])

  const validateSession = async (token: string) => {
    try {
      const response = await authAPI.validateToken(token)
      if (response.user) {
        setUser(response.user)
      } else {
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      console.error("Session validation failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (initData: string) => {
    try {
      setLoading(true)

      const response = await authAPI.login(initData)

      if (response.token && response.user) {
        localStorage.setItem("auth_token", response.token)
        setUser(response.user)

        // Show success feedback
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.notificationOccurred("success")
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Login failed:", error)

      // Show error feedback
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred("error")
      }

      if (webApp?.showAlert) {
        await webApp.showAlert("Authentication failed. Please try again.")
      }

      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)

    // Close the mini app
    if (webApp?.close) {
      webApp.close()
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) throw new Error("No auth token")

      const response = await authAPI.updateUser(updates, token)

      if (response.user) {
        setUser(response.user)

        // Show success feedback
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.notificationOccurred("success")
        }
      }
    } catch (error) {
      console.error("User update failed:", error)

      // Show error feedback
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred("error")
      }

      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
