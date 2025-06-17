"use client"

import type { Message } from "ai"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ErrorMessageProps {
  message: Message
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex justify-center">
      <Card className="bg-destructive/10 border-destructive/20 max-w-md">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>{message.content}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
