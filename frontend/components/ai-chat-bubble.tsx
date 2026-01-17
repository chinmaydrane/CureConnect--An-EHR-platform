"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Volume2, VolumeX, Mic } from "lucide-react"

interface ChatBubbleProps {
  message: {
    id: string
    type: "user" | "assistant"
    content: string
    timestamp: Date
    isVoice?: boolean
    suggestions?: string[]
  }
  onSuggestionClick?: (suggestion: string) => void
  onSpeak?: (content: string) => void
  isSpeaking?: boolean
}

export function ChatBubble({ message, onSuggestionClick, onSpeak, isSpeaking }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={message.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}>
            {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Card className={message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card"}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.type === "assistant" && onSpeak && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSpeak(message.content)}
                    className="ml-2 flex-shrink-0"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs ${message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {formatTime(message.timestamp)}
                </span>
                {message.isVoice && (
                  <Badge variant="outline" className="text-xs">
                    <Mic className="w-3 h-3 mr-1" />
                    Voice
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && onSuggestionClick && (
            <div className="flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-xs h-8"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
