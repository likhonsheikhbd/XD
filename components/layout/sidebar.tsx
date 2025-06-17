"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Plus, Settings, History, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [conversations] = useState([
    { id: "1", title: "AI Development Discussion", timestamp: "2 hours ago" },
    { id: "2", title: "Machine Learning Concepts", timestamp: "1 day ago" },
    { id: "3", title: "Google AI Integration", timestamp: "2 days ago" },
  ])

  return (
    <div className={cn("relative transition-all duration-300", isOpen ? "w-80" : "w-16")}>
      <Card className="h-full rounded-none border-r">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            {isOpen && <CardTitle className="text-lg">Conversations</CardTitle>}
            <Button variant="ghost" size="icon" onClick={onToggle}>
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <Button className={cn("w-full", !isOpen && "px-2")} variant="default">
            <Plus className="h-4 w-4" />
            {isOpen && <span className="ml-2">New Chat</span>}
          </Button>

          {isOpen && (
            <>
              <Separator className="my-4" />

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <Button key={conv.id} variant="ghost" className="w-full justify-start h-auto p-3 text-left">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
