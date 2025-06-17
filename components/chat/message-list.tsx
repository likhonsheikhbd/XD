"use client"

import type { Message } from "ai"
import { MessageBubble } from "./message-bubble"
import { SystemMessage } from "./system-message"
import { ErrorMessage } from "./error-message"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        if (message.role === "system") {
          return <SystemMessage key={message.id} message={message} />
        }

        if (message.role === "error") {
          return <ErrorMessage key={message.id} message={message} />
        }

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
            showSources={true}
            showReasoning={true}
          />
        )
      })}
    </div>
  )
}
