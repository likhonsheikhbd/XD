'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatHeader } from './chat-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/lib/chat-store'
import { useAssistantStore } from '@/lib/store'
import { extractCodeBlocks, generateFileStructure } from '@/lib/code-parser'
import { toast } from 'sonner'
import { Loader2, RotateCcw, Trash2 } from 'lucide-react'
import type { SandpackFiles } from '@/lib/types'

interface ChatInterfaceProps {
  onCodeGenerated: (files: SandpackFiles) => void
  currentFiles: Record<string, string>
  activeFile: string
}

export function ChatInterface({ onCodeGenerated, currentFiles, activeFile }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { conversations, activeConversationId, createConversation, addMessage } = useChatStore()
  const { getEditorContext } = useAssistantStore()
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setMessages,
  } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      if (!response.ok) {
        toast.error('Failed to get response from AI')
      }
    },
    onFinish: (message) => {
      // Extract code blocks and update files
      const codeBlocks = extractCodeBlocks(message.content)
      if (codeBlocks.length > 0) {
        const files = generateFileStructure(codeBlocks)
        onCodeGenerated(files)
        toast.success(`Generated ${Object.keys(files).length} file(s)`)
      }
      
      // Save to conversation history
      addMessage(activeConversationId, {
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: new Date(),
      })
    },
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error('An error occurred while processing your request')
    },
    body: {
      context: getEditorContext(activeFile),
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleClearChat = () => {
    setMessages([])
    toast.success('Chat cleared')
  }

  const handleRetry = () => {
    if (messages.length > 0) {
      reload()
    }
  }

  const handleStop = () => {
    stop()
    toast.info('Generation stopped')
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    // Add user message to conversation
    addMessage(activeConversationId, {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    })
    
    handleSubmit(e)
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <ChatHeader 
        onClear={handleClearChat}
        onNewConversation={() => createConversation()}
        messageCount={messages.length}
      />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-lg font-medium mb-2">Welcome to AI Coding Assistant</div>
              <p className="text-sm">
                Ask me to generate, explain, debug, or optimize code. I can help with multiple programming languages and frameworks.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCodeInsert={(code, filename) => {
                  onCodeGenerated({ [filename]: code })
                  toast.success(`Code inserted into ${filename}`)
                }}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="text-destructive font-medium mb-2">Error</div>
              <p className="text-sm text-destructive/80">{error.message}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="flex gap-2 mb-3">
          {isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
            >
              Stop
            </Button>
          )}
          
          {messages.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </>
          )}
        </div>
        
        <ChatInput
          input={input}
          onInputChange={handleInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          placeholder="Ask me to generate, explain, debug, or optimize code..."
        />
      </div>
    </div>
  )
}