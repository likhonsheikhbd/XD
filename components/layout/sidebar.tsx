'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Folder, 
  Plus, 
  Search, 
  MoreHorizontal,
  X,
  Edit,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  files: Record<string, string>
  activeFile: string
  onFileSelect: (filename: string) => void
  onFileCreate: (filename: string) => void
  onFileDelete: (filename: string) => void
  onFileRename: (oldName: string, newName: string) => void
}

export function Sidebar({ 
  open, 
  files, 
  activeFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onFileRename 
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState('')

  const filteredFiles = Object.keys(files).filter(filename =>
    filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    // You could expand this with more specific icons
    return <FileText className="h-4 w-4" />
  }

  const handleCreateFile = () => {
    const filename = prompt('Enter filename:')
    if (filename && !files[filename]) {
      onFileCreate(filename)
    }
  }

  const handleRenameFile = (filename: string) => {
    setEditingFile(filename)
    setNewFileName(filename)
  }

  const handleRenameSubmit = () => {
    if (editingFile && newFileName && newFileName !== editingFile) {
      onFileRename(editingFile, newFileName)
    }
    setEditingFile(null)
    setNewFileName('')
  }

  const handleRenameCancel = () => {
    setEditingFile(null)
    setNewFileName('')
  }

  if (!open) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateFile}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <Separator className="w-6" />
        
        {Object.keys(files).slice(0, 5).map((filename) => (
          <Button
            key={filename}
            variant={activeFile === filename ? "default" : "ghost"}
            size="sm"
            onClick={() => onFileSelect(filename)}
            className="h-8 w-8 p-0"
            title={filename}
          >
            {getFileIcon(filename)}
          </Button>
        ))}
      </div>
    )
  }

  

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Explorer</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateFile}
            className="h-7 w-7 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2 px-2 py-1">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Project</span>
          </div>
          
          <div className="ml-4 space-y-1">
            {filteredFiles.map((filename) => (
              <div
                key={filename}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer group",
                  "hover:bg-accent/50 transition-colors",
                  activeFile === filename && "bg-accent"
                )}
                onClick={() => onFileSelect(filename)}
              >
                {getFileIcon(filename)}
                
                {editingFile === filename ? (
                  <div className="flex-1 flex items-center gap-1">
                    <Input
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit()
                        if (e.key === 'Escape') handleRenameCancel()
                      }}
                      onBlur={handleRenameSubmit}
                      className="h-6 text-xs"
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-sm flex-1 truncate" title={filename}>
                      {filename}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRenameFile(filename)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onFileDelete(filename)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="text-xs text-muted-foreground">
          {Object.keys(files).length} file{Object.keys(files).length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}