'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { X, Plus, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorTabsProps {
  files: string[]
  activeFile: string
  onFileSelect: (filename: string) => void
  onFileClose: (filename: string) => void
}

export function EditorTabs({ files, activeFile, onFileSelect, onFileClose }: EditorTabsProps) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    // You could expand this with more specific icons
    return <FileText className="h-3 w-3" />
  }

  const handleTabClose = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation()
    onFileClose(filename)
  }

  const handleDragStart = (e: React.DragEvent, filename: string) => {
    setDraggedTab(filename)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFilename: string) => {
    e.preventDefault()
    if (draggedTab && draggedTab !== targetFilename) {
      // Handle tab reordering logic here
      console.log(`Move ${draggedTab} to position of ${targetFilename}`)
    }
    setDraggedTab(null)
  }

  return (
    <div className="border-b bg-muted/30">
      <ScrollArea className="w-full">
        <div className="flex items-center">
          {files.map((filename) => (
            <div
              key={filename}
              draggable
              onDragStart={(e) => handleDragStart(e, filename)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, filename)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer group min-w-0 max-w-48",
                "hover:bg-accent/50 transition-colors",
                activeFile === filename && "bg-background border-b-2 border-b-primary"
              )}
              onClick={() => onFileSelect(filename)}
            >
              {getFileIcon(filename)}
              <span className="text-sm truncate flex-1" title={filename}>
                {filename}
              </span>
              
              {files.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleTabClose(e, filename)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-2"
            onClick={() => {
              // Handle new file creation
              console.log('Create new file')
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}