'use client'

import { useState, useCallback, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { ChatInterface } from './chat/chat-interface'
import { CodeEditor } from './editor/code-editor'
import { PreviewPanel } from './preview/preview-panel'
import { TerminalPanel } from './terminal/terminal-panel'
import { Header } from './layout/header'
import { Sidebar } from './layout/sidebar'
import { useAssistantStore } from '@/lib/store'
import { useChatStore } from '@/lib/chat-store'
import { useHotkeys } from 'react-hotkeys-hook'
import { cn } from '@/lib/utils'
import type { SandpackFiles } from '@/lib/types'

export function CodingAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<'editor' | 'preview'>('editor')
  
  const { 
    files, 
    activeFile, 
    updateFile, 
    setActiveFile,
    addFile,
    deleteFile,
    renameFile 
  } = useAssistantStore()
  
  const { messages, isLoading } = useChatStore()

  // Keyboard shortcuts
  useHotkeys('ctrl+b,cmd+b', () => setSidebarOpen(!sidebarOpen), { preventDefault: true })
  useHotkeys('ctrl+`,cmd+`', () => setTerminalOpen(!terminalOpen), { preventDefault: true })
  useHotkeys('ctrl+1,cmd+1', () => setActivePanel('editor'), { preventDefault: true })
  useHotkeys('ctrl+2,cmd+2', () => setActivePanel('preview'), { preventDefault: true })
  useHotkeys('ctrl+s,cmd+s', () => {
    // Auto-save is handled by the store
  }, { preventDefault: true })

  const handleFileChange = useCallback((filename: string, content: string) => {
    updateFile(filename, content)
  }, [updateFile])

  const handleFileCreate = useCallback((filename: string, content = '') => {
    addFile(filename, content)
    setActiveFile(filename)
  }, [addFile, setActiveFile])

  const handleFileDelete = useCallback((filename: string) => {
    deleteFile(filename)
  }, [deleteFile])

  const handleFileRename = useCallback((oldName: string, newName: string) => {
    renameFile(oldName, newName)
  }, [renameFile])

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-save logic is handled by the store
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
        sidebarOpen={sidebarOpen}
        terminalOpen={terminalOpen}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          open={sidebarOpen}
          files={files}
          activeFile={activeFile}
          onFileSelect={setActiveFile}
          onFileCreate={handleFileCreate}
          onFileDelete={handleFileDelete}
          onFileRename={handleFileRename}
        />
        
        <div className="flex-1 flex flex-col">
          <PanelGroup direction="horizontal" className="flex-1">
            {/* Chat Panel */}
            <Panel defaultSize={35} minSize={25} maxSize={50}>
              <ChatInterface 
                onCodeGenerated={(files: SandpackFiles) => {
                  Object.entries(files).forEach(([filename, fileData]) => {
                    if (typeof fileData === 'string') {
                      updateFile(filename, fileData)
                    } else {
                      updateFile(filename, fileData.code)
                    }
                  })
                }}
                currentFiles={files}
                activeFile={activeFile}
              />
            </Panel>
            
            <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" />
            
            {/* Editor/Preview Panel */}
            <Panel defaultSize={65} minSize={30}>
              <div className="h-full flex flex-col">
                {/* Panel Tabs */}
                <div className="flex border-b bg-muted/30">
                  <button
                    onClick={() => setActivePanel('editor')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      activePanel === 'editor'
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setActivePanel('preview')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      activePanel === 'preview'
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Preview
                  </button>
                </div>
                
                {/* Panel Content */}
                <div className="flex-1 relative">
                  {activePanel === 'editor' ? (
                    <CodeEditor
                      files={files}
                      activeFile={activeFile}
                      onFileChange={handleFileChange}
                      onFileSelect={setActiveFile}
                    />
                  ) : (
                    <PreviewPanel
                      files={files}
                      activeFile={activeFile}
                    />
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
          
          {/* Terminal Panel */}
          {terminalOpen && (
            <>
              <PanelResizeHandle className="h-2 bg-border hover:bg-accent transition-colors" />
              <div className="h-64 border-t">
                <TerminalPanel />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}