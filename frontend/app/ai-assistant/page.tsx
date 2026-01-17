"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import axios from "axios"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  isVoice?: boolean
}

type LangCode = "en-US" | "hi-IN" | "mr-IN"

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm your AI health assistant. Ask me about symptoms, medications, lab results, or health advice.",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // ⭐ current language (default English)
  const [language, setLanguage] = useState<LangCode>("en-US")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Init SpeechRecognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = language // ⭐ initial language

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript) // will now be in Hindi/Marathi script if engine supports it
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
  }, []) // only once

  // ⭐ Update recognition language when user changes language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language
    }
  }, [language])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  // ⭐ Speak in chosen language
  const speakMessage = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    // 1) Clean markdown / symbols that cause "asterisk asterisk" etc.
    let cleaned = text
      .replace(/\*\*/g, "")        // remove bold **text**
      .replace(/\*/g, "")          // any stray *
      .replace(/`/g, "")           // inline code backticks
      .replace(/[_#>]/g, "")       // _, #, > from markdown
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1"); // [link](url) -> link text only

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(cleaned);

    // 2) Choose language for TTS
    let ttsLang = language; // "en-US" | "hi-IN" | "mr-IN"

    const voices = window.speechSynthesis.getVoices();

    // Try to find exact voice
    let voice = voices.find((v) => v.lang === ttsLang);

    // If Marathi voice not available, fallback to Hindi
    if (!voice && language === "mr-IN") {
      ttsLang = "hi-IN";
      voice =
        voices.find((v) => v.lang === "hi-IN") ||
        voices.find((v) => v.lang.startsWith("hi"));
    }

    // If still nothing, try general match by language family
    if (!voice) {
      voice = voices.find((v) => v.lang.startsWith(ttsLang.split("-")[0]));
    }

    utterance.lang = ttsLang;
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };


  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const sendMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return

    const userMessage: Message = { id: Date.now().toString(), type: "user", content, isVoice }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/health`, {
        message: content,
        language, // ⭐ tell backend which language we want
      })

      const replyText: string = res.data.reply
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: replyText,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Speak the reply in same language
      speakMessage(replyText)
    } catch (err: any) {
      console.error("AI Assistant request failed:", err)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I couldn’t process your request. Please try again.",
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">AI Health Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Your personal health guidance companion
            </p>
          </div>
        </div>

        {/* ⭐ Language selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Language:</span>
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LangCode)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="mr-IN">मराठी (Marathi)</option>
          </select>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex space-x-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback>
                    {msg.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <Card className={msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-card"}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.type === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => (isSpeaking ? stopSpeaking() : speakMessage(msg.content))}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card/50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              language === "en-US"
                ? "Ask me about your health..."
                : language === "hi-IN"
                  ? "स्वास्थ्य से जुड़ा सवाल पूछें..."
                  : "आपल्या आरोग्याबद्दल प्रश्न विचारा..."
            }
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button type="submit" disabled={!inputMessage.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
