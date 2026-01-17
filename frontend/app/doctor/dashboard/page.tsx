"use client"

import type React from "react"
import api from "@/lib/api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Heart,
  Users,
  Video,
  FileText,
  Clock,
  Stethoscope,
  Pill,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Bell,
  Settings,
  Plus,
  Upload,
  Eye,
  LogOut,
  User,
  Bot,
} from "lucide-react"
import axios from "axios"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("queue")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [prescriptionDialog, setPrescriptionDialog] = useState(false)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [newConsultationDialog, setNewConsultationDialog] = useState(false)
  const [patientLookupDialog, setPatientLookupDialog] = useState(false)
  const [doctorProfileDialog, setDoctorProfileDialog] = useState(false)
  const [uploadType, setUploadType] = useState<"report" | "prescription">("report")
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [patientIdSearch, setPatientIdSearch] = useState("")
  const [foundPatient, setFoundPatient] = useState<any>(null)
  const [newConsultationData, setNewConsultationData] = useState({
    patientName: "",
    patientId: "",
    consultationType: "",
    date: "",
    time: "",
    reason: "",
    priority: "normal",
  })
  const [prescriptionData, setPrescriptionData] = useState({
    symptoms: "",
    diagnosis: "",
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    date: new Date().toISOString().split("T")[0],
  })


  const [doctorProfile, setDoctorProfile] = useState<any | null>(null)

  const { toast } = useToast()

  // Mock doctor data
  const doctorData = {
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    license: "MD12345",
    patientsToday: 12,
    completedConsultations: 8,
    pendingReports: 3,
    experience: "15 years",
    education: "Harvard Medical School",
    certifications: ["Board Certified Cardiologist", "Advanced Cardiac Life Support"],
    phone: "+1 (555) 234-5678",
    email: "michael.chen@cureconnect.com",
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("doctorProfile")
      if (raw) setDoctorProfile(JSON.parse(raw))
    } catch { }
  }, [])

  const [docData, setDocData] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Get token from sessionStorage safely
  useEffect(() => {
    const t = sessionStorage.getItem("token")
    if (t) setToken(t)
  }, [])

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        const res = await api.get("/doctor/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setDocData(res.data)
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err)
      }
    }
    fetchProfile()
  }, [token])


  const consultationTrends = [
    { month: "Jan", consultations: 145, avgDuration: 32 },
    { month: "Feb", consultations: 167, avgDuration: 35 },
    { month: "Mar", consultations: 189, avgDuration: 31 },
    { month: "Apr", consultations: 201, avgDuration: 33 },
    { month: "May", consultations: 178, avgDuration: 36 },
    { month: "Jun", consultations: 223, avgDuration: 34 },
  ]

  const patientConditions = [
    { condition: "Hypertension", count: 45, color: "#8884d8" },
    { condition: "Diabetes", count: 32, color: "#82ca9d" },
    { condition: "Heart Disease", count: 28, color: "#ffc658" },
    { condition: "Arrhythmia", count: 19, color: "#ff7300" },
    { condition: "Other", count: 23, color: "#00ff88" },
  ]

  const prescriptionStats = [
    { medication: "Lisinopril", prescribed: 34 },
    { medication: "Metformin", prescribed: 28 },
    { medication: "Atorvastatin", prescribed: 22 },
    { medication: "Amlodipine", prescribed: 19 },
    { medication: "Metoprolol", prescribed: 16 },
  ]

  // Mock patient queue with enhanced data
  const [patientQueue, setPatientQueue] = useState([
    {
      id: 1,
      patientId: "PAT-2024-001",
      name: "Sarah Johnson",
      age: 34,
      condition: "Hypertension Follow-up",
      appointmentTime: "10:30 AM",
      status: "waiting",
      priority: "normal",
      lastVisit: "2024-01-15",
      vitals: { bp: "128/82", hr: "72", temp: "98.6" },
      reports: [],
      prescriptions: [],
    },
    {
      id: 2,
      patientId: "PAT-2024-002",
      name: "Robert Martinez",
      age: 58,
      condition: "Chest Pain",
      appointmentTime: "11:00 AM",
      status: "urgent",
      priority: "high",
      lastVisit: "2024-01-20",
      vitals: { bp: "145/95", hr: "88", temp: "99.1" },
      reports: [],
      prescriptions: [],
    },
    {
      id: 3,
      patientId: "PAT-2024-003",
      name: "Emily Davis",
      age: 42,
      condition: "Routine Checkup",
      appointmentTime: "11:30 AM",
      status: "scheduled",
      priority: "normal",
      lastVisit: "2023-12-10",
      vitals: { bp: "118/75", hr: "65", temp: "98.4" },
      reports: [],
      prescriptions: [],
    },
    {
      id: 4,
      patientId: "PAT-2024-004",
      name: "James Wilson",
      age: 67,
      condition: "Diabetes Management",
      appointmentTime: "12:00 PM",
      status: "in-consultation",
      priority: "normal",
      lastVisit: "2024-01-25",
      vitals: { bp: "135/85", hr: "78", temp: "98.7" },
      reports: [],
      prescriptions: [],
    },
  ])

  const [recentConsultations, setRecentConsultations] = useState([
    {
      id: 1,
      patient: "Anna Thompson",
      patientId: "PAT-2024-005",
      condition: "Arrhythmia",
      date: "2024-01-28",
      time: "2:30 PM",
      duration: "45 min",
      type: "Video Call",
      outcome: "Prescribed medication, follow-up in 2 weeks",
      status: "completed",
    },
    {
      id: 2,
      patient: "David Lee",
      patientId: "PAT-2024-006",
      condition: "High Blood Pressure",
      date: "2024-01-28",
      time: "1:00 PM",
      duration: "30 min",
      type: "In-Person",
      outcome: "Lifestyle changes recommended, medication adjusted",
      status: "completed",
    },
    {
      id: 3,
      patient: "Maria Garcia",
      patientId: "PAT-2024-007",
      condition: "Diabetes Check",
      date: "2024-01-29",
      time: "10:00 AM",
      duration: "35 min",
      type: "Video Call",
      outcome: "Blood sugar levels stable, continue current treatment",
      status: "scheduled",
    },
  ])

  const todayStats = [
    { label: "Patients Today", value: doctorData.patientsToday, icon: Users, color: "text-primary" },
    { label: "Completed", value: doctorData.completedConsultations, icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Reports", value: doctorData.pendingReports, icon: FileText, color: "text-orange-600" },
    { label: "Avg. Consultation", value: "35 min", icon: Clock, color: "text-blue-600" },
  ]

  const handleNotifications = () => {
    toast({ title: "Notifications", description: "Opening notification center..." })
    window.location.href = "/doctor/notifications"
  }

  const handleSettings = () => {
    toast({ title: "Settings", description: "Opening doctor settings panel..." })
    window.location.href = "/doctor/settings"
  }

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "Redirecting to login page...",
    })
    setTimeout(() => {
      window.location.href = "/"
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-destructive text-destructive-foreground"
      case "waiting":
        return "bg-orange-500 text-white"
      case "in-consultation":
        return "bg-primary text-primary-foreground"
      case "scheduled":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityIcon = (priority: string) => {
    return priority === "high" ? <AlertCircle className="w-4 h-4 text-destructive" /> : null
  }

  const handleStartConsultation = (patient: any) => {
    // Update patient status to in-consultation
    setPatientQueue((prev) => prev.map((p) => (p.id === patient.id ? { ...p, status: "in-consultation" } : p)))

    toast({
      title: "Consultation Started",
      description: `Video consultation with ${patient.name} has begun.`,
    })

    // Navigate to consultation screen
    setTimeout(() => {
      window.location.href = `/consultation/${patient.id}`
    }, 1000)
  }

  const handleGeneratePrescription = (patient: any) => {
    setSelectedPatient(patient)
    setPrescriptionDialog(true)
    // Reset form data
    setPrescriptionData({
      symptoms: "",
      diagnosis: "",
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleFileUpload = (patient: any, type: "report" | "prescription") => {
    setSelectedPatient(patient)
    setUploadType(type)
    setUploadDialog(true)
  }

  const processFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedPatient) return

    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      category: uploadType,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Update patient data with new files
    setPatientQueue((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? {
            ...p,
            [uploadType === "report" ? "reports" : "prescriptions"]: [
              ...(uploadType === "report" ? p.reports : p.prescriptions),
              ...newFiles,
            ],
          }
          : p,
      ),
    )

    toast({
      title: `${uploadType === "report" ? "Report" : "Prescription"} Uploaded`,
      description: `Successfully uploaded ${newFiles.length} file(s) for ${selectedPatient.name}.`,
    })

    setUploadDialog(false)
  }

  const generatePrescription = () => {
    if (!selectedPatient) return

    const prescription = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      ...prescriptionData,
      prescribedBy: doctorData.name,
      generatedDate: new Date().toISOString(),
    }

    // Update patient prescriptions
    setPatientQueue((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? { ...p, prescriptions: [...p.prescriptions, prescription] } : p)),
    )

    toast({
      title: "Prescription Generated",
      description: `E-prescription created for ${selectedPatient.name}.`,
    })

    setPrescriptionDialog(false)
  }

  const viewPatientFiles = (patient: any) => {
    const totalFiles = patient.reports.length + patient.prescriptions.length
    if (totalFiles === 0) {
      toast({
        title: "No Files",
        description: `No reports or prescriptions found for ${patient.name}.`,
      })
      return
    }

    toast({
      title: "Patient Files",
      description: `${patient.name} has ${patient.reports.length} reports and ${patient.prescriptions.length} prescriptions.`,
    })
  }

  const handleNewConsultation = () => {
    setNewConsultationDialog(true)
    setNewConsultationData({
      patientName: "",
      patientId: "",
      consultationType: "",
      date: "",
      time: "",
      reason: "",
      priority: "normal",
    })
  }

  const createNewConsultation = () => {
    if (!newConsultationData.patientName || !newConsultationData.date || !newConsultationData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newConsultation = {
      id: Date.now(),
      patient: newConsultationData.patientName,
      patientId: newConsultationData.patientId || `PAT-${Date.now()}`,
      condition: newConsultationData.reason,
      date: newConsultationData.date,
      time: newConsultationData.time,
      duration: "Scheduled",
      type: newConsultationData.consultationType,
      outcome: "Scheduled consultation",
      status: "scheduled",
    }

    setRecentConsultations((prev) => [newConsultation, ...prev])

    toast({
      title: "New Consultation Created",
      description: `Consultation scheduled for ${newConsultationData.patientName} on ${newConsultationData.date} at ${newConsultationData.time}`,
    })
    setNewConsultationDialog(false)
  }



  const [patientId, setPatientId] = useState("")
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePatientLookup = async () => {
    console.log("🔎 handlePatientLookup called with ID:", patientId)

    if (!patientId.trim()) {
      console.log("⚠️ Empty Patient ID")
      setError("Please enter a valid Patient ID")
      return
    }

    try {
      setLoading(true)
      setError("")
      setPatientData(null)

      console.log("🌍 Sending request to:", `/doctor/lookup/${patientId}`)
      const res = await api.get(`/doctor/lookup/${patientId}`)

      console.log("✅ Response received:", res.data)
      setPatientData(res.data)
    } catch (err) {
      console.error("❌ Error fetching patient:", err)
      setError("Failed to fetch patient")
    } finally {
      setLoading(false)
    }
  }


  const searchPatientById = () => {
    const patient = patientQueue.find((p) => p.patientId === patientIdSearch)
    if (patient) {
      setFoundPatient(patient)
      toast({
        title: "Patient Found",
        description: `Found ${patient.name} (${patient.patientId})`,
      })
    } else {
      toast({
        title: "Patient Not Found",
        description: `No patient found with ID: ${patientIdSearch}`,
        variant: "destructive",
      })
      setFoundPatient(null)
    }
  }

  const summarizePatientProfile = (patient: any) => {
    toast({
      title: "AI Summary Generated",
      description: `Generated comprehensive profile summary for ${patient.name}`,
    })

    const summaryWindow = window.open("", "_blank", "width=700,height=600")
    if (summaryWindow) {
      summaryWindow.document.write(`
        <html>
          <head>
            <title>AI Patient Summary - ${patient.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
              .container { max-width: 650px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #6366f1; margin-bottom: 20px; }
              .summary-section { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1; }
              .summary-title { font-weight: bold; color: #374151; margin-bottom: 10px; font-size: 16px; }
              .highlight { background: #fef3c7; padding: 2px 4px; border-radius: 3px; }
              .risk-high { background: #fef2f2; color: #dc2626; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
              .risk-moderate { background: #fef3c7; color: #d97706; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
              .risk-low { background: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
              .vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
              .vital-item { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🤖 AI Patient Summary</h1>
              <h2>${patient.name} (${patient.patientId})</h2>
              
              <div class="summary-section">
                <div class="summary-title">📊 Current Health Status</div>
                <p>Patient presents with <span class="highlight">${patient.condition}</span>. Age: ${patient.age} years old.</p>
                <div class="vitals-grid">
                  <div class="vital-item">
                    <strong>Blood Pressure:</strong> ${patient.vitals.bp} mmHg
                  </div>
                  <div class="vital-item">
                    <strong>Heart Rate:</strong> ${patient.vitals.hr} bpm
                  </div>
                  <div class="vital-item">
                    <strong>Temperature:</strong> ${patient.vitals.temp}°F
                  </div>
                  <div class="vital-item">
                    <strong>Last Visit:</strong> ${patient.lastVisit}
                  </div>
                </div>
              </div>

              <div class="summary-section">
                <div class="summary-title">⚠️ Risk Assessment</div>
                <p>Based on age (${patient.age}) and current condition, patient has 
                ${patient.priority === "high"
          ? '<span class="risk-high">HIGH RISK</span>'
          : patient.age > 60
            ? '<span class="risk-moderate">MODERATE RISK</span>'
            : '<span class="risk-low">LOW RISK</span>'
        } cardiovascular profile.</p>
                <p><strong>Key Risk Factors:</strong> ${patient.age > 60 ? "Advanced age, " : ""}${patient.condition.includes("Hypertension") ? "Hypertension, " : ""}${patient.condition.includes("Diabetes") ? "Diabetes, " : ""}${patient.condition.includes("Chest Pain") ? "Cardiac symptoms" : "Standard monitoring required"}</p>
              </div>

              <div class="summary-section">
                <div class="summary-title">💊 Treatment Recommendations</div>
                <p><strong>Current Plan:</strong> ${patient.condition.includes("Follow-up") ? "Continue current treatment regimen with regular monitoring." : "Initiate appropriate treatment based on current symptoms."}</p>
                <p><strong>Next Steps:</strong> ${patient.priority === "high" ? "Immediate intervention required. Consider hospitalization if symptoms worsen." : "Follow-up in 2-4 weeks. Monitor vital signs and symptom progression."}</p>
                <p><strong>Lifestyle Modifications:</strong> Diet counseling, exercise program, stress management, medication compliance monitoring.</p>
              </div>

              <div class="summary-section">
                <div class="summary-title">📋 Clinical Notes</div>
                <p><strong>Priority Level:</strong> <span class="highlight">${patient.priority.toUpperCase()}</span></p>
                <p><strong>Appointment Status:</strong> ${patient.status.replace("-", " ").toUpperCase()}</p>
                <p><strong>Files on Record:</strong> ${patient.reports.length} reports, ${patient.prescriptions.length} prescriptions</p>
                <p><strong>AI Confidence:</strong> 94% (Based on available data and clinical guidelines)</p>
              </div>

              <div class="summary-section">
                <div class="summary-title">🎯 Action Items</div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Review latest lab results and imaging studies</li>
                  <li>Assess medication compliance and side effects</li>
                  <li>Update treatment plan based on current symptoms</li>
                  <li>Schedule appropriate follow-up appointments</li>
                  <li>Patient education on condition management</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `)
    }
  }

  const handleDoctorProfile = () => {
    setDoctorProfileDialog(true)
  }

  const PrescriptionDialog = () => (
    <Dialog open={prescriptionDialog} onOpenChange={setPrescriptionDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate E-Prescription</DialogTitle>
          <DialogDescription>Create prescription for {selectedPatient?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="Enter patient symptoms..."
                className="min-h-[80px]"
                value={prescriptionData.symptoms}
                onChange={(e) => setPrescriptionData((prev) => ({ ...prev, symptoms: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis..."
                className="min-h-[80px]"
                value={prescriptionData.diagnosis}
                onChange={(e) => setPrescriptionData((prev) => ({ ...prev, diagnosis: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Medications</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicine">Medicine Name</Label>
                <Input
                  id="medicine"
                  placeholder="e.g., Lisinopril"
                  value={prescriptionData.medicine}
                  onChange={(e) => setPrescriptionData((prev) => ({ ...prev, medicine: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg"
                  value={prescriptionData.dosage}
                  onChange={(e) => setPrescriptionData((prev) => ({ ...prev, dosage: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={prescriptionData.frequency}
                  onValueChange={(value) => setPrescriptionData((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="thrice">Three times daily</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 30 days"
                  value={prescriptionData.duration}
                  onChange={(e) => setPrescriptionData((prev) => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={prescriptionData.date}
                  onChange={(e) => setPrescriptionData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Take with food, avoid alcohol, etc."
              className="min-h-[60px]"
              value={prescriptionData.instructions}
              onChange={(e) => setPrescriptionData((prev) => ({ ...prev, instructions: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPrescriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={generatePrescription}>Generate Prescription</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const UploadDialog = () => (
    <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {uploadType === "report" ? "Report" : "Prescription"}</DialogTitle>
          <DialogDescription>
            Upload {uploadType === "report" ? "medical reports" : "prescription documents"} for {selectedPatient?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">Click to select files or drag and drop</p>
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={processFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="w-full bg-transparent">
                Select Files
              </Button>
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</p>
        </div>
      </DialogContent>
    </Dialog>
  )

  const NewConsultationDialog = () => (
    <Dialog open={newConsultationDialog} onOpenChange={setNewConsultationDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Consultation</DialogTitle>
          <DialogDescription>Add a new consultation to your schedule</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient Name *</Label>
              <Input
                placeholder="Enter patient name"
                value={newConsultationData.patientName}
                onChange={(e) => setNewConsultationData((prev) => ({ ...prev, patientName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Patient ID (Optional)</Label>
              <Input
                placeholder="e.g., PAT-2024-001"
                value={newConsultationData.patientId}
                onChange={(e) => setNewConsultationData((prev) => ({ ...prev, patientId: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Consultation Type *</Label>
              <Select
                value={newConsultationData.consultationType}
                onValueChange={(value) => setNewConsultationData((prev) => ({ ...prev, consultationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select
                value={newConsultationData.priority}
                onValueChange={(value) => setNewConsultationData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={newConsultationData.date}
                onChange={(e) => setNewConsultationData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Time *</Label>
              <Input
                type="time"
                value={newConsultationData.time}
                onChange={(e) => setNewConsultationData((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason for Consultation</Label>
            <Textarea
              placeholder="Describe the reason for consultation..."
              value={newConsultationData.reason}
              onChange={(e) => setNewConsultationData((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setNewConsultationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewConsultation}>Schedule Consultation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const PatientLookupDialog = () => (
    <Dialog open={patientLookupDialog} onOpenChange={setPatientLookupDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Lookup</DialogTitle>
          <DialogDescription>Search for patient records by Patient ID</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Patient ID (e.g., PAT-2024-001)"
              value={patientIdSearch}
              onChange={(e) => setPatientIdSearch(e.target.value)}
            />
            <Button onClick={searchPatientById}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {foundPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{foundPatient.name}</span>
                  <Badge>{foundPatient.patientId}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age: {foundPatient.age}</p>
                    <p className="text-sm text-muted-foreground">Condition: {foundPatient.condition}</p>
                    <p className="text-sm text-muted-foreground">Last Visit: {foundPatient.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">BP: {foundPatient.vitals.bp}</p>
                    <p className="text-sm text-muted-foreground">HR: {foundPatient.vitals.hr}</p>
                    <p className="text-sm text-muted-foreground">Temp: {foundPatient.vitals.temp}°F</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => summarizePatientProfile(foundPatient)}>
                    <Bot className="w-4 h-4 mr-2" />
                    AI Summary
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleGeneratePrescription(foundPatient)}>
                    <Pill className="w-4 h-4 mr-2" />
                    Prescribe
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => viewPatientFiles(foundPatient)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  const DoctorProfileDialog = () => (
    <Dialog open={doctorProfileDialog} onOpenChange={setDoctorProfileDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
          <DialogDescription>Update your professional information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/doctor-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {doctorData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{doctorData.name}</h3>
              <p className="text-muted-foreground">{doctorData.specialty}</p>
              <p className="text-sm text-muted-foreground">License: {doctorData.license}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={doctorData.name} />
            </div>
            <div className="space-y-2">
              <Label>Specialty</Label>
              <Input defaultValue={doctorData.specialty} />
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input defaultValue={doctorData.license} />
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <Input defaultValue={doctorData.experience} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue={doctorData.phone} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={doctorData.email} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Education</Label>
            <Input defaultValue={doctorData.education} />
          </div>

          <div className="space-y-2">
            <Label>Certifications</Label>
            <Textarea defaultValue={doctorData.certifications.join(", ")} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDoctorProfileDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Profile Updated",
                  description: "Your profile has been successfully updated.",
                })
                setDoctorProfileDialog(false)
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )


  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  useEffect(() => {
    if (activeTab !== "queue") return;

    const fetchTodayAppointments = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await 
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/doctor/today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedAppointments = res.data.appointments.map((a: any) => ({
          appointmentId : a.appointmentId,          // ✅ FIXED
          mongoId: a._id,               // (optional, keep if needed)
          name: a.patient?.name || "Patient",
          age: a.patient?.age || "--",
          condition: a.notes || "No notes provided",
          appointmentTime: a.preferredTime,
          lastVisit: "—",
          priority: "normal",
          status: "waiting",
          vitals: {
            bp: "--",
            hr: "--",
          },
          reports: [],
          prescriptions: [],
        }));


        setTodayAppointments(formattedAppointments);
      } catch (err) {
        console.error("Failed to load today's appointments", err);
      }
    };

    fetchTodayAppointments();
  }, [activeTab]);


  const handleJoinCall = (appointmentId: string) => {
    // later this will open WebRTC room
    // for now just navigate or log
    console.log("Joining call for appointment:", appointmentId);
    window.location.href = `/consultation/${appointmentId}`

    // example navigation (adjust route as needed)
    // router.push(`/doctor/call/${appointmentId}`);
  };



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
              <p className="text-sm text-muted-foreground">Doctor Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative" onClick={handleNotifications}>
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">5</Badge>
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

      {/* Doctor Info */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/doctor-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {docData?.name
                  ? docData.name.split(" ").map((n: string) => n[0]).join("")
                  : "Dr"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">{docData?.name || "Dr. Name"}</h2>
              <p className="text-muted-foreground">{docData?.speciality || docData?.specialty || "Specialty"}</p>
              <p className="text-sm text-muted-foreground">
                License: {docData?.licenceNo || docData?.license || "License"}
              </p>
              <p className="text-sm text-muted-foreground">
                DoctorId: {docData?.doctorId || docData?.doctorId || "DoctorId"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {todayStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
          {/* change tab buttons to navigate to dedicated per-section routes */}
          <Button variant="ghost" onClick={() => (window.location.href = "/doctor/dashboard")} className="flex-1 cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            Patient Queue
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/doctor/reportupload")} className="flex-1 cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            Report Upload
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/doctor/consultations")} className="flex-1 cursor-pointer">
            <Stethoscope className="w-4 h-4 mr-2" />
            Consultations
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/doctor/analytics")} className="flex-1 cursor-pointer">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/doctor/patients")} className="flex-1 cursor-pointer">
            <Search className="w-4 h-4 mr-2" />
            Patient Lookup
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/doctor/profile")} className="flex-1 cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>

        {/* Patient Queue Tab */}
        {activeTab === "queue" && (
          <div className="space-y-4 animate-slide-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Today's Patient Queue</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-9 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {todayAppointments.map((patient) => (
                <Card key={patient.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {patient.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground">{patient.name}</h4>
                            <span className="text-sm text-muted-foreground">({patient.age}y)</span>
                            {getPriorityIcon(patient.priority)}
                          </div>

                          <p className="text-sm text-muted-foreground">{patient.condition}</p>

                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{patient.appointmentTime}</span>
                            </span>
                            <span>Last visit: {patient.lastVisit}</span>
                            <span className="flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>{patient.reports.length + patient.prescriptions.length} files</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.replace("-", " ")}
                        </Badge>

                        <Button
                          size="sm"
                          onClick={() => handleJoinCall(patient.appointmentId)}
                          className="cursor-pointer">
                          <Video className="w-4 h-4 mr-1" />
                          Join Call
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}

            </div>
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === "consultations" && (
          <div className="space-y-4 animate-slide-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Consultations</h3>
              <Button onClick={handleNewConsultation}>
                <Plus className="w-4 h-4 mr-2" />
                New Consultation
              </Button>
            </div>

            <div className="space-y-3">
              {recentConsultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {consultation.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">{consultation.patient}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.condition}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                            <span>{consultation.date}</span>
                            <span>{consultation.time}</span>
                            <span>Duration: {consultation.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {consultation.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right max-w-md">
                        <Badge
                          className={
                            consultation.status === "completed" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                          }
                        >
                          {consultation.status}
                        </Badge>
                        <p className="text-sm text-foreground mt-2">{consultation.outcome}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8 animate-slide-in">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Comprehensive insights into your practice performance</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <span>Consultation Trends</span>
                  </CardTitle>
                  <CardDescription>Monthly consultation volume and average duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      consultations: {
                        label: "Consultations",
                        color: "hsl(var(--chart-1))",
                      },
                      avgDuration: {
                        label: "Avg Duration (min)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[320px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={consultationTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="consultations"
                          stroke="var(--color-consultations)"
                          strokeWidth={3}
                          dot={{ r: 6, fill: "var(--color-consultations)" }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgDuration"
                          stroke="var(--color-avgDuration)"
                          strokeWidth={3}
                          dot={{ r: 6, fill: "var(--color-avgDuration)" }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-primary" />
                    <span>Patient Conditions</span>
                  </CardTitle>
                  <CardDescription>Distribution of conditions in your practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Patient Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[320px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientConditions}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ condition, count }) => `${condition}: ${count}`}
                          labelLine={false}
                        >
                          {patientConditions.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <Pill className="w-6 h-6 text-primary" />
                    <span>Prescription Analytics</span>
                  </CardTitle>
                  <CardDescription>Most prescribed medications this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      prescribed: {
                        label: "Times Prescribed",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[320px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prescriptionStats}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" stroke="#666" />
                        <YAxis dataKey="medication" type="category" width={90} stroke="#666" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="prescribed" fill="var(--color-prescribed)" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                  <CardDescription>Your practice performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-800">Patient Satisfaction</span>
                      </div>
                      <Badge className="bg-green-500 text-white text-lg px-4 py-2">4.8/5</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-blue-800">On-time Rate</span>
                      </div>
                      <Badge className="bg-blue-500 text-white text-lg px-4 py-2">94%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        <span className="font-medium text-purple-800">Follow-up Compliance</span>
                      </div>
                      <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">87%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium text-emerald-800">Treatment Success Rate</span>
                      </div>
                      <Badge className="bg-emerald-500 text-white text-lg px-4 py-2">92%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span className="font-medium text-orange-800">Avg Response Time</span>
                      </div>
                      <Badge className="bg-orange-500 text-white text-lg px-4 py-2">2.3 hrs</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* {activeTab === "lookup" && (
          <div className="space-y-6 animate-slide-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Patient Lookup</span>
                </CardTitle>
                <CardDescription>Search for patient records and view basic details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Patient ID (e.g. PAT688885)"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                  <Button onClick={handlePatientLookup} disabled={loading} className="cursor-pointer">
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {patientData && (
                  <div className="p-4 bg-accent rounded-lg space-y-2 mt-4">
                    <p className="font-semibold text-lg">Patient Found ✅</p>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground">{patientData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="text-foreground">{patientData.age}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )} */}


        {activeTab === "profile" && (
          <div className="space-y-6 animate-slide-in">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Profile</CardTitle>
                <CardDescription>Your professional and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {(doctorProfile?.name || doctorData.name)
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{doctorProfile?.name || doctorData.name}</h3>
                    <p className="text-muted-foreground">{doctorProfile?.speciality || doctorData.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      License: {doctorProfile?.licenseNumber || doctorData.license}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Professional</h4>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="text-foreground">
                        {doctorProfile?.experience != null
                          ? `${doctorProfile.experience} years`
                          : doctorData.experience}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Education:</span>
                      <span className="text-foreground">{doctorProfile?.education || doctorData.education}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certifications:</span>
                      <span className="text-foreground">
                        {doctorProfile?.certifications || doctorData.certifications?.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Contact</h4>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground">{doctorProfile?.phone || doctorData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{doctorProfile?.email || doctorData.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleDoctorProfile}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <PrescriptionDialog />
      <UploadDialog />
      <NewConsultationDialog />
      <PatientLookupDialog />
      <DoctorProfileDialog />
    </div>
  )
}
