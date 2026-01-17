"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import PatientProfile from "./PatientProfilePage"
import api from "@/lib/api"
import {
  Heart,
  Calendar,
  FileText,
  Video,
  MessageSquare,
  Activity,
  Pill,
  User,
  Bell,
  Settings,
  Clock,
  MapPin,
  Stethoscope,
  LogOut,
  Download,
  Eye,
} from "lucide-react"
import axios from "axios"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const { toast } = useToast()


  // Mock patient data
  const patientData = {
    name: "Sarah Johnson",
    age: 34,
    bloodGroup: "O+",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-10",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Main St, City, State 12345",
    emergencyContact: "John Johnson - +1 (555) 987-6543",
    insurance: "Blue Cross Blue Shield",
    height: "5'6\"",
    weight: "150 lbs",
  }



  const [patData, setPatData] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Get token from sessionStorage
  useEffect(() => {
    const t = sessionStorage.getItem("token")
    if (t) setToken(t)
  }, [])

  // Fetch patient profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        const res = await api.get("/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPatData(res.data)
      } catch (err) {
        console.error("❌ Failed to fetch patient profile:", err)
      }
    }
    fetchProfile()
  }, [token])



  const initials = patData?.name
    ? patData.name
    : "PT";








  // const upcomingAppointments = [
  //   {
  //     id: 1,
  //     doctor: "Dr. Michael Chen",
  //     specialty: "Cardiologist",
  //     date: "2024-02-10",
  //     time: "10:30 AM",
  //     type: "Video Call",
  //     status: "confirmed",
  //   },
  //   {
  //     id: 2,
  //     doctor: "Dr. Emily Rodriguez",
  //     specialty: "Endocrinologist",
  //     date: "2024-02-15",
  //     time: "2:00 PM",
  //     type: "In-Person",
  //     status: "pending",
  //   },
  // ]

  const recentPrescriptions = [
    {
      id: 1,
      medication: "Metformin 500mg",
      dosage: "Twice daily",
      prescribedBy: "Dr. Emily Rodriguez",
      date: "2024-01-20",
      refillsLeft: 2,
    },
    {
      id: 2,
      medication: "Lisinopril 10mg",
      dosage: "Once daily",
      prescribedBy: "Dr. Michael Chen",
      date: "2024-01-18",
      refillsLeft: 1,
    },
  ]

  const vitals = [
    { label: "Blood Pressure", value: "128/82", unit: "mmHg", status: "normal" },
    { label: "Heart Rate", value: "72", unit: "bpm", status: "normal" },
    { label: "Blood Sugar", value: "145", unit: "mg/dL", status: "elevated" },
    { label: "Weight", value: "68.5", unit: "kg", status: "normal" },
  ]

  const consultationHistory = [
    {
      id: 1,
      doctor: "Dr. Michael Chen",
      date: "2024-01-15",
      type: "Video Call",
      duration: "30 min",
      diagnosis: "Hypertension management",
      notes: "Blood pressure well controlled. Continue current medication.",
      prescription: "Lisinopril 10mg - Continue current dosage",
      symptoms: "Mild headaches, occasional dizziness",
      followUp: "Follow-up in 4 weeks",
    },
    {
      id: 2,
      doctor: "Dr. Emily Rodriguez",
      date: "2024-01-08",
      type: "In-Person",
      duration: "45 min",
      diagnosis: "Diabetes follow-up",
      notes: "HbA1c levels improved. Dietary changes showing positive results.",
      prescription: "Metformin 500mg - Twice daily with meals",
      symptoms: "Increased thirst, fatigue after meals",
      followUp: "Lab work in 3 months",
    },
    {
      id: 3,
      doctor: "Dr. Sarah Wilson",
      date: "2023-12-20",
      type: "Video Call",
      duration: "25 min",
      diagnosis: "Annual checkup",
      notes: "Overall health good. Recommended lifestyle modifications.",
      prescription: "Multivitamin - Once daily",
      symptoms: "General wellness check",
      followUp: "Annual checkup next year",
    },
  ]

  const uploadedFiles = [
    {
      id: 1,
      name: "Blood Test Results - Jan 2024.pdf",
      type: "Lab Report",
      uploadedBy: "Dr. Michael Chen",
      date: "2024-01-20",
      size: "2.3 MB",
      category: "lab",
    },
    {
      id: 2,
      name: "Chest X-Ray Report.pdf",
      type: "Radiology Report",
      uploadedBy: "Dr. Sarah Wilson",
      date: "2024-01-15",
      size: "1.8 MB",
      category: "radiology",
    },
    {
      id: 3,
      name: "Prescription - Hypertension Meds.pdf",
      type: "Prescription",
      uploadedBy: "Dr. Michael Chen",
      date: "2024-01-18",
      size: "0.5 MB",
      category: "prescription",
    },
    {
      id: 4,
      name: "Diabetes Management Plan.pdf",
      type: "Treatment Plan",
      uploadedBy: "Dr. Emily Rodriguez",
      date: "2024-01-10",
      size: "1.2 MB",
      category: "treatment",
    },
  ]

  const quickActions = [
    {
      title: "Book Appointment",
      description: "Schedule with your doctor",
      icon: Calendar,
      color: "bg-primary text-primary-foreground",
      action: () => {
        toast({ title: "Booking Appointment", description: "Opening appointment booking..." })
        window.location.href = "/patient/appointments"
      },
    },
    {
      title: "AI Assistant",
      description: "Health guidance & reports",
      icon: MessageSquare,
      color: "bg-secondary text-secondary-foreground",
      action: () => {
        toast({ title: "AI Assistant", description: "Opening health assistant..." })
        window.location.href = "/ai-assistant"
      },
    },
    {
      title: "Diet Recommendations",
      description: "Personalized nutrition",
      icon: Heart,
      color: "bg-accent text-accent-foreground",
      action: () => {
        toast({ title: "Diet Recommendations", description: "Loading personalized plan..." })
        window.location.href = "/patient/diet"
      },
    },
  ]

  const handleNotifications = () => {
    toast({ title: "Notifications", description: "Opening notification center..." })
    window.location.href = "/patient/notifications"
  }

  const handleSettings = () => {
    toast({ title: "Settings", description: "Opening patient settings..." })
    window.location.href = "/patient/settings"
  }

  const handleLogout = () => {
    toast({ title: "Logging Out", description: "Redirecting to login page..." })
    setTimeout(() => {
      window.location.href = "/login"
    }, 800)
  }

  const handleAppointmentAction = (appointment: any, action: string) => {
    if (action === "join" && appointment.type === "Video Call") {
      toast({
        title: "Joining Video Call",
        description: `Connecting to consultation with ${appointment.doctor}...`,
      })
      window.location.href = `/consultation/${appointment.id}`
    } else if (action === "reschedule") {
      toast({
        title: "Reschedule Appointment",
        description: "Opening reschedule options...",
      })
    }
  }

  const handlePrescriptionAction = (prescription: any, action: string) => {
    if (action === "refill") {
      toast({
        title: "Refill Request",
        description: `Requesting refill for ${prescription.medication}...`,
      })
    } else if (action === "view") {
      toast({
        title: "Prescription Details",
        description: `Viewing details for ${prescription.medication}...`,
      })
    }
  }

  const handleFileDownload = (file: any) => {
    toast({
      title: "Downloading File",
      description: `Downloading ${file.name}...`,
    })
  }

  const handleFileView = (file: any) => {
    toast({
      title: "Opening File",
      description: `Opening ${file.name} in viewer...`,
    })
  }

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all touch-target ${isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
  const [patientId, setPatientId] = useState<string | null>(null)

  useEffect(() => {
    // runs only in browser
    const id = sessionStorage.getItem("patientId")
    setPatientId(id)
  }, [])

  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await 
         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Transform DB data → UI data
        const formatted = res.data.appointments.map((a: any) => ({
          id: a.appointmentId,        // ✅ USE THIS
          doctor: a.doctor?.name || "Doctor",
          specialty: a.doctor?.speciality || "General",
          date: a.preferredDate,
          time: a.preferredTime,
          status: "confirmed",
          type: "Video Call",
        }));


        setUpcomingAppointments(formatted);
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };

    fetchAppointments();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Cure Connect</h1>
              <p className="text-sm text-muted-foreground">Patient Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative" onClick={handleNotifications}>
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">3</Badge>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {activeTab === "home" && (
          <div className="space-y-6 animate-slide-in">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/patient-avatar.jpg" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground">
                      Welcome back, {patData?.name || "Patient"}!
                    </h2>
                    <p className="text-muted-foreground">
                      Your next appointment is on {patData?.nextAppointment || "23dec 2025"}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">Age: {patData?.age || "N/A"}</Badge>
                      <Badge variant="outline">Blood: {patData?.bloodGroup || "N/A"}</Badge>
                      <Badge variant="outline">Your Patient ID: {patData?.patientId || "Id"}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card
                    key={index}
                    className="cursor-pointer transition-all hover:shadow-md hover:scale-105 touch-target"
                    onClick={action.action}
                  >
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium text-foreground text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Current Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Current Vitals</span>
                </CardTitle>
                <CardDescription>Latest readings from your devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {vitals.map((vital, index) => (
                    <div key={index} className="p-3 rounded-lg bg-accent/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{vital.label}</span>
                        <Badge variant={vital.status === "normal" ? "default" : "destructive"} className="text-xs">
                          {vital.status}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <span className="text-lg font-semibold text-foreground">{vital.value}</span>
                        <span className="text-sm text-muted-foreground ml-1">{vital.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{appointment.doctor}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        </div>
                      </div>
                      <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {appointment.type === "Video Call" ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      {appointment.type === "Video Call" && appointment.status === "confirmed" && (
                        <Button size="sm" onClick={() => handleAppointmentAction(appointment, "join")}>
                          <Video className="w-4 h-4 mr-1" />
                          Join Call
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAppointmentAction(appointment, "reschedule")}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Prescriptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-primary" />
                  <span>Recent Prescriptions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{prescription.medication}</h4>
                        <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Prescribed by {prescription.prescribedBy} on {prescription.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{prescription.refillsLeft} refills left</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" onClick={() => handlePrescriptionAction(prescription, "refill")}>
                        <Pill className="w-4 h-4 mr-1" />
                        Request Refill
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrescriptionAction(prescription, "view")}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "records" && (
          <div className="space-y-6 animate-slide-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Health Records</span>
                </CardTitle>
                <CardDescription>Your complete medical history and documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => (window.location.href = "/records")}
                  >
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="text-sm">View All Records</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => (window.location.href = "/records?tab=prescriptions")}
                  >
                    <Pill className="w-6 h-6 text-blue-600" />
                    <span className="text-sm">Prescriptions</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => (window.location.href = "/records?tab=lab")}
                  >
                    <Activity className="w-6 h-6 text-green-600" />
                    <span className="text-sm">Lab Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => (window.location.href = "/records?tab=vitals")}
                  >
                    <Heart className="w-6 h-6 text-red-600" />
                    <span className="text-sm">Vitals</span>
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">📋 Recent Medical Records</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-accent rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-foreground">Hypertension Management</h5>
                          <Badge className="bg-green-500 text-white">Active Treatment</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Diagnosis:</strong> Essential hypertension, well-controlled with current medication
                          regimen
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Current Medication:</strong> Lisinopril 10mg daily, taken in the morning
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Last BP Reading:</strong> 128/82 mmHg (Jan 25, 2024) - Target: &lt;130/80
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Treatment Notes:</strong> Patient responding well to ACE inhibitor therapy. Continue
                          current dosage and monitor monthly.
                        </p>
                      </div>

                      <div className="p-4 bg-accent rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-foreground">Type 2 Diabetes Management</h5>
                          <Badge className="bg-blue-500 text-white">Monitoring</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>HbA1c:</strong> 7.2% (improved from 8.1% in Oct 2023) - Target: &lt;7.0%
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Current Medication:</strong> Metformin 500mg twice daily with meals
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Dietary Compliance:</strong> Following low-carb diet plan, 85% adherence
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Next Lab Work:</strong> April 2024 - Comprehensive metabolic panel and HbA1c
                        </p>
                      </div>

                      <div className="p-4 bg-accent rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-foreground">Annual Physical Examination</h5>
                          <Badge className="bg-gray-500 text-white">Completed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Date:</strong> December 20, 2023 - Dr. Sarah Wilson
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Overall Assessment:</strong> Good general health with well-managed chronic conditions
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Recommendations:</strong> Continue current medications, increase physical activity to
                          150 min/week
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Follow-up:</strong> Annual physical scheduled for December 2024
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">📁 Uploaded Documents & Files</h4>
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h5 className="font-medium text-foreground">{file.name}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {file.type} • Uploaded by {file.uploadedBy}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {file.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {file.date} • {file.size}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleFileView(file)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleFileDownload(file)}>
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">📊 Treatment Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">85%</div>
                          <div className="text-sm text-green-700">Medication Adherence</div>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-blue-700">Consultations This Year</div>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">8</div>
                          <div className="text-sm text-purple-700">Lab Tests Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "consultations" && (
          <div className="space-y-6 animate-slide-in">
            <Card>
              <CardHeader>
                <CardTitle>Consultation History</CardTitle>
                <CardDescription>Your past video and in-person consultations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {consultationHistory.map((consultation) => (
                  <div key={consultation.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{consultation.doctor}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{consultation.type}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          <strong>Date:</strong> {consultation.date}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Duration:</strong> {consultation.duration}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Symptoms:</strong> {consultation.symptoms}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-foreground">
                          <strong>Notes:</strong> {consultation.notes}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Follow-up:</strong> {consultation.followUp}
                        </p>
                      </div>
                    </div>

                    {consultation.prescription && (
                      <div className="mt-3 p-3 bg-accent rounded-lg">
                        <p className="text-sm font-medium text-foreground">Prescription:</p>
                        <p className="text-sm text-muted-foreground">{consultation.prescription}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "profile" && <PatientProfile />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex items-center justify-around">
          <TabButton id="home" label="Home" icon={Heart} isActive={activeTab === "home"} onClick={setActiveTab} />
          {/* <TabButton id="records" label="Records" icon={FileText} isActive={activeTab === "records"} onClick={setActiveTab} /> */}
          {/* <TabButton id="consultations" label="Consults" icon={Video} isActive={activeTab === "consultations"} onClick={setActiveTab} /> */}
          {/* route bottom navigation Records and Consults to new routes */}
          <button
            onClick={() => (window.location.href = "/records")}
            className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all touch-target text-muted-foreground hover:text-foreground hover:bg-accent`}
            aria-label="Open Records"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">Records</span>
          </button>
          <button
            onClick={() => (window.location.href = "/consults")}
            className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all touch-target text-muted-foreground hover:text-foreground hover:bg-accent`}
            aria-label="Open Consults"
          >
            <Video className="w-5 h-5" />
            <span className="text-xs font-medium">Consults</span>
          </button>
          <TabButton
            id="profile"
            label="Profile"
            icon={User}
            isActive={activeTab === "profile"}
            onClick={setActiveTab}
          />
        </div>
      </nav>
    </div>
  )
}
