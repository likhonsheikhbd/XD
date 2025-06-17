'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Menu, 
  Terminal, 
  Save, 
  Download, 
  Share, 
  Settings,
  Zap,
  Github
} from 'lucide-react'
import { useAssistantStore } from '@/lib/store'
import { toast } from 'sonner'

interface HeaderProps {
  onToggleSidebar: () => void
  onToggleTerminal: () => void
  sidebarOpen: boolean
  terminalOpen: boolean
}

export function Header({ onToggleSidebar, onToggleTerminal, sidebarOpen, terminalOpen }: HeaderProps) {
  const { files, activeFile } = useAssistantStore()

  const handleSave = () => {
    // Auto-save is handled by the store
    toast.success('Files saved automatically')
  }

  const handleDownload = () => {
    // Create a zip file with all files
    const fileContents = Object.entries(files).map(([filename, content]) => ({
      filename,
      content,
    }))

    // For now, just download the active file
    const content = files[activeFile]
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success(`Downloaded ${activeFile}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Coding Assistant Project',
          text: 'Check out this code I created with AI Coding Assistant',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Coding Assistant</h1>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            {Object.keys(files).length} files
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-8 gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-2"
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTerminal}
            className="h-8 gap-2"
          >
            <Terminal className="h-4 w-4" />
            <span className="hidden sm:inline">Terminal</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}