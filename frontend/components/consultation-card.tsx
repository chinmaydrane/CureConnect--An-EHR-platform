"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, Phone, Clock, Calendar } from "lucide-react"

interface ConsultationCardProps {
  consultation: {
    id: string
    patientName: string
    patientAge: number
    condition: string
    scheduledTime: string
    type: "video" | "audio"
    status: "scheduled" | "in-progress" | "completed"
    duration?: string
  }
  onStartConsultation: (id: string) => void
}

export function ConsultationCard({ consultation, onStartConsultation }: ConsultationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-primary text-primary-foreground"
      case "completed":
        return "bg-green-500 text-white"
      case "scheduled":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {consultation.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-foreground">{consultation.patientName}</h4>
              <p className="text-sm text-muted-foreground">
                {consultation.patientAge}y • {consultation.condition}
              </p>
              <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{consultation.scheduledTime}</span>
                </div>
                {consultation.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{consultation.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(consultation.status)}>{consultation.status.replace("-", " ")}</Badge>
            <Button
              size="sm"
              onClick={() => onStartConsultation(consultation.id)}
              disabled={consultation.status === "completed"}
            >
              {consultation.type === "video" ? <Video className="w-4 h-4 mr-1" /> : <Phone className="w-4 h-4 mr-1" />}
              {consultation.status === "in-progress" ? "Join" : "Start"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
