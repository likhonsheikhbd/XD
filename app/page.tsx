"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { ThemeProvider } from "@/components/theme-provider"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 flex flex-col">
          <Header onSettingsClick={() => setSettingsOpen(true)} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 overflow-hidden">
            <ChatInterface />
          </main>
        </div>

        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </ThemeProvider>
  )
}
