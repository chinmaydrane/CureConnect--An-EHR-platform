"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  FileText,
  Activity,
  Pill,
  Clock,
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  Camera,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react"
import { useEffect, useRef } from "react";
import io from "socket.io-client";


export default function ConsultationPage({
  params,
}: {
  params: { appointmentId: string };
}) {

  useEffect(() => {
    console.log("APPOINTMENT ID:", params.appointmentId);
  }, []);

  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)
  const [consultationMode, setConsultationMode] = useState<"video" | "audio">("video")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [consultationNotes, setConsultationNotes] = useState("")
  const [expandedSections, setExpandedSections] = useState<string[]>(["vitals"])


  const socket = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isInitiator = useRef(false);
  const isReady = useRef(false);
  const role = useRef<"initiator" | "receiver" | null>(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: process.env.NEXT_PUBLIC_TURN_USERNAME!,
        credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL!,
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: process.env.NEXT_PUBLIC_TURN_USERNAME!,
        credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL!,
      },
    ],
  };



  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.current.on("role", (r) => {
      role.current = r;
    });


    // ✅ JOIN APPOINTMENT ROOM
    socket.current.emit("join-room", params.appointmentId);

    socket.current.on("both-ready", async () => {
      if (!peerConnection.current) return;
      if (role.current !== "initiator") return;

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.current.emit("offer", {
        roomId: params.appointmentId,
        offer,
      });
    });



    socket.current.on("offer", async (offer) => {
      if (!peerConnection.current) return;

      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current.emit("answer", {
        roomId: params.appointmentId,
        answer,
      });
    });

    socket.current.on("answer", async (answer) => {
      await peerConnection.current?.setRemoteDescription(answer);
    });

    socket.current.on("ice-candidate", async (candidate) => {
      await peerConnection.current?.addIceCandidate(candidate);
    });


    return () => {
      socket.current.disconnect();
      peerConnection.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);




  // Mock patient data
  const patientData = {
    id: params.appointmentId,
    name: "Sarah Johnson",
    age: 34,
    bloodGroup: "O+",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    currentVitals: {
      bloodPressure: "128/82 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      oxygenSaturation: "98%",
      weight: "68.5 kg",
      height: "165 cm",
    },
    medicalHistory: [
      {
        date: "2024-01-15",
        condition: "Hypertension",
        treatment: "Lisinopril 10mg daily",
        doctor: "Dr. Michael Chen",
      },
      {
        date: "2023-12-10",
        condition: "Type 2 Diabetes",
        treatment: "Metformin 500mg twice daily",
        doctor: "Dr. Emily Rodriguez",
      },
    ],
    currentMedications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        prescribedDate: "2024-01-15",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        prescribedDate: "2023-12-10",
      },
    ],
    labReports: [
      {
        date: "2024-01-20",
        test: "HbA1c",
        result: "7.2%",
        range: "< 7.0%",
        status: "elevated",
      },
      {
        date: "2024-01-20",
        test: "Total Cholesterol",
        result: "185 mg/dL",
        range: "< 200 mg/dL",
        status: "normal",
      },
    ],
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const startCall = async () => {
    setIsCallActive(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    peerConnection.current = new RTCPeerConnection(iceServers);

    // Add tracks
    stream.getTracks().forEach((track) => {
      peerConnection.current!.addTrack(track, stream);
    });

    // Receive remote tracks
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", {
          roomId: params.appointmentId,
          candidate: event.candidate,
        });
      }
    };

    isReady.current = true;
    socket.current.emit("ready-for-call", params.appointmentId);

  };




  const endCall = () => {
    // ❌ DON'T stop tracks unless leaving page
    peerConnection.current?.close();
    peerConnection.current = null;

    setIsCallActive(false);
    setIsVideoOn(true);
    setIsAudioOn(true);
  };


  const toggleVideo = () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current
      .getVideoTracks()
      .find((track) => track.kind === "video");

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
  };


  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioOn(audioTrack.enabled);
  };



  const switchToAudio = () => {
    setConsultationMode("audio")
    setIsVideoOn(false)
  }

  const switchToVideo = () => {
    setConsultationMode("video")
    setIsVideoOn(true)
  }

  const saveNotes = () => {
    console.log("Saving consultation notes:", consultationNotes)
    // Here you would save to backend
  }




  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              ← Back
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Consultation</h1>
              <p className="text-sm text-muted-foreground">{patientData.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>45:23</span>
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Video Call Section */}
        <div className={`${isFullscreen ? "w-full" : "w-2/3"} bg-slate-900 relative transition-all duration-300`}>
          {/* Video Display */}
          <div className="h-full flex items-center justify-center relative">
            {isCallActive && consultationMode === "video" ? (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* REMOTE VIDEO */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />


                  {/* LOCAL VIDEO */}
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`absolute top-4 right-4 w-48 h-36 rounded-lg object-cover"
                      }`}
                  />

                  {!isVideoOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <VideoOff className="w-20 h-20 mb-3 text-slate-400" />
                      <p className="text-lg">Camera Off</p>
                    </div>
                  )}
                </div>

              </div>
            ) : isCallActive && consultationMode === "audio" ? (
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-16 h-16 text-primary-foreground" />
                </div>
                <p className="text-2xl font-medium mb-2">Audio Call Active</p>
                <p className="text-slate-300">Connected with {patientData.name}</p>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400">Call in progress</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-white">
                <Monitor className="w-24 h-24 mx-auto mb-4 text-slate-400" />
                <p className="text-xl font-medium mb-4">Ready to Start Consultation</p>
                <p className="text-slate-300 mb-6">Click start to begin video or audio call</p>
                <div className="flex items-center justify-center space-x-4">
                  <Button onClick={startCall} className="bg-primary hover:bg-primary/90">
                    <Video className="w-5 h-5 mr-2" />
                    Start Video Call
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConsultationMode("audio")
                      startCall()
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Audio Only
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          {isCallActive && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudio}
                className={`rounded-full w-12 h-12 ${isAudioOn ? "bg-white/20 text-white" : "bg-destructive text-destructive-foreground"
                  }`}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {consultationMode === "video" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVideo}
                  className={`rounded-full w-12 h-12 ${isVideoOn ? "bg-white/20 text-white" : "bg-destructive text-destructive-foreground"
                    }`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              )}

              {/* <Button
                variant="ghost"
                size="sm"
                onClick={consultationMode === "video" ? switchToAudio : switchToVideo}
                className="rounded-full w-12 h-12 bg-white/20 text-white"
              >
                {consultationMode === "video" ? <Phone className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </Button> */}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-full w-12 h-12 bg-white/20 text-white"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={endCall}
                className="rounded-full w-12 h-12 bg-destructive text-destructive-foreground"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Patient Information Panel */}
        {!isFullscreen && (
          <div className="w-1/3 bg-card border-l border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {patientData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{patientData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {patientData.age} years • {patientData.bloodGroup}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Current Vitals */}
                <Collapsible open={expandedSections.includes("vitals")}>
                  <CollapsibleTrigger
                    onClick={() => toggleSection("vitals")}
                    className="flex items-center justify-between w-full p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span className="font-medium">Current Vitals</span>
                    </div>
                    {expandedSections.includes("vitals") ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {Object.entries(patientData.currentVitals).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-background rounded">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-sm font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Medical History */}
                <Collapsible open={expandedSections.includes("history")}>
                  <CollapsibleTrigger
                    onClick={() => toggleSection("history")}
                    className="flex items-center justify-between w-full p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium">Medical History</span>
                    </div>
                    {expandedSections.includes("history") ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {patientData.medicalHistory.map((record, index) => (
                      <div key={index} className="p-3 bg-background rounded border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-foreground">{record.condition}</span>
                          <span className="text-xs text-muted-foreground">{record.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{record.treatment}</p>
                        <p className="text-xs text-muted-foreground">Dr: {record.doctor}</p>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Current Medications */}
                <Collapsible open={expandedSections.includes("medications")}>
                  <CollapsibleTrigger
                    onClick={() => toggleSection("medications")}
                    className="flex items-center justify-between w-full p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Pill className="w-5 h-5 text-primary" />
                      <span className="font-medium">Current Medications</span>
                    </div>
                    {expandedSections.includes("medications") ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {patientData.currentMedications.map((medication, index) => (
                      <div key={index} className="p-3 bg-background rounded border border-border">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-foreground">{medication.name}</span>
                          <span className="text-sm text-muted-foreground">{medication.dosage}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                        <p className="text-xs text-muted-foreground">Since: {medication.prescribedDate}</p>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Allergies */}
                <div className="p-3 bg-accent rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {patientData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Consultation Notes */}
            <div className="p-4 border-t border-border">
              <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Consultation Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Enter consultation notes..."
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                className="min-h-[100px] mb-3"
              />
              <div className="flex space-x-2">
                <Button onClick={saveNotes} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notes
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Send className="w-4 h-4 mr-2" />
                  Send Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
