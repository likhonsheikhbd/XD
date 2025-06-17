'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Mic, Square } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  input: string
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  placeholder?: string
}

export function ChatInput({ 
  input, 
  onInputChange, 
  onSubmit, 
  isLoading, 
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isRecording, setIsRecording] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  // Keyboard shortcuts
  useHotkeys('ctrl+enter,cmd+enter', (e) => {
    e.preventDefault()
    if (!isLoading && input.trim()) {
      onSubmit(e as any)
    }
  }, { enableOnFormTags: true })

  useHotkeys('escape', () => {
    if (textareaRef.current) {
      textareaRef.current.blur()
    }
  }, { enableOnFormTags: true })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        onSubmit(e as any)
      }
    }
  }

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false)
      // Stop recording logic here
    } else {
      setIsRecording(true)
      // Start recording logic here
    }
  }

  const handleFileAttach = () => {
    // File attachment logic here
    console.log('File attachment clicked')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "min-h-[60px] max-h-[200px] resize-none pr-24 focus-visible-ring",
            "scrollbar-thin"
          )}
          rows={1}
        />
        
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileAttach}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={cn(
              "h-8 w-8 p-0",
              isRecording && "text-red-500 animate-pulse"
            )}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, 
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">Shift+Enter</kbd> for new line
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          size="sm"
          className="focus-visible-ring"
        >
          {isLoading ? (
            <Square className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  )
}