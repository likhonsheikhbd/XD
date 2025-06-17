"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { ChatControls } from "./chat-controls"
import { useToast } from "@/hooks/use-toast"
import { useChatSettings } from "@/hooks/use-chat-settings"

export function ChatInterface() {
  const { toast } = useToast()
  const { settings } = useChatSettings()
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop, append, setMessages } =
    useChat({
      api: "/api/chat/google",
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      },
      onResponse: () => {
        setIsTyping(false)
      },
      onFinish: (message) => {
        // Log conversation for analytics
        logConversation(message)
      },
    })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsTyping(true)
    await handleSubmit(e)
  }

  const logConversation = async (message: any) => {
    try {
      await fetch("/api/analytics/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          settings,
        }),
      })
    } catch (error) {
      console.error("Failed to log conversation:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ChatControls onClear={() => setMessages([])} onReload={reload} onStop={stop} isLoading={isLoading} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleFormSubmit}
          isLoading={isLoading}
          onFileUpload={(files) => {
            // Handle file uploads for multimodal chat
            handleFileUpload(files, append)
          }}
        />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border-t border-destructive/20">
          <p className="text-sm text-destructive">Error: {error.message}</p>
        </div>
      )}
    </div>
  )
}

async function handleFileUpload(files: FileList, append: Function) {
  for (const file of Array.from(files)) {
    if (file.type.startsWith("image/")) {
      const base64 = await fileToBase64(file)
      append({
        role: "user",
        content: [
          { type: "text", text: "Please analyze this image:" },
          { type: "image", image: base64 },
        ],
      })
    }
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}
