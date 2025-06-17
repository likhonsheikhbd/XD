"use client"

import type { Message } from "ai"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface SystemMessageProps {
  message: Message
}

export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className="flex justify-center">
      <Card className="bg-muted/50 border-dashed max-w-md">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>{message.content}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
