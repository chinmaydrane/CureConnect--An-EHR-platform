"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import {  Trash } from "lucide-react"
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Stethoscope,
  Pill,
  Activity,
  TestTube,
  Share,
  Heart,
} from "lucide-react"

export default function HealthRecordsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [recordDialog, setRecordDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock health records data
  const healthRecords = {
    prescriptions: [
      {
        id: "rx001",
        type: "prescription",
        date: "2024-01-20",
        title: "Hypertension Medication",
        doctor: "Dr. Michael Chen",
        medications: [
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
          { name: "Hydrochlorothiazide", dosage: "25mg", frequency: "Once daily", duration: "30 days" },
        ],
        instructions: "Take with food. Monitor blood pressure daily.",
        status: "active",
      },
      {
        id: "rx002",
        type: "prescription",
        date: "2024-01-15",
        title: "Diabetes Management",
        doctor: "Dr. Emily Rodriguez",
        medications: [{ name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "90 days" }],
        instructions: "Take with meals. Monitor blood glucose levels.",
        status: "active",
      },
    ],
    labReports: [
      {
        id: "lab001",
        type: "lab",
        date: "2024-01-25",
        title: "Comprehensive Metabolic Panel",
        doctor: "Dr. Michael Chen",
        facility: "Central Lab Services",
        tests: [
          { name: "Glucose", result: "145", range: "70-100", unit: "mg/dL", status: "elevated" },
          { name: "Creatinine", result: "0.9", range: "0.6-1.2", unit: "mg/dL", status: "normal" },
          { name: "Total Cholesterol", result: "185", range: "<200", unit: "mg/dL", status: "normal" },
          { name: "HDL Cholesterol", result: "45", range: ">40", unit: "mg/dL", status: "normal" },
          { name: "LDL Cholesterol", result: "120", range: "<100", unit: "mg/dL", status: "elevated" },
        ],
        summary: "Glucose and LDL cholesterol levels are elevated. Recommend dietary modifications.",
        status: "reviewed",
      },
      {
        id: "lab002",
        type: "lab",
        date: "2024-01-20",
        title: "HbA1c Test",
        doctor: "Dr. Emily Rodriguez",
        facility: "Central Lab Services",
        tests: [{ name: "HbA1c", result: "7.2", range: "<7.0", unit: "%", status: "elevated" }],
        summary: "HbA1c indicates suboptimal diabetes control. Consider medication adjustment.",
        status: "reviewed",
      },
    ],
    vitals: [
      {
        id: "vital001",
        type: "vitals",
        date: "2024-01-28",
        title: "Routine Vital Signs",
        doctor: "Dr. Michael Chen",
        measurements: [
          { name: "Blood Pressure", result: "128/82", unit: "mmHg", status: "normal" },
          { name: "Heart Rate", result: "72", unit: "bpm", status: "normal" },
          { name: "Temperature", result: "98.6", unit: "°F", status: "normal" },
          { name: "Weight", result: "68.5", unit: "kg", status: "normal" },
          { name: "BMI", result: "25.1", unit: "kg/m²", status: "normal" },
        ],
        notes: "All vital signs within normal limits.",
        status: "completed",
      },
    ],
    visitHistory: [
      {
        id: "visit001",
        type: "visit",
        date: "2024-01-28",
        title: "Cardiology Follow-up",
        doctor: "Dr. Michael Chen",
        department: "Cardiology",
        reason: "Hypertension management and routine follow-up",
        diagnosis: "Essential hypertension, well controlled",
        treatment: "Continue current medications, lifestyle modifications",
        nextAppointment: "2024-03-28",
        status: "completed",
      },
      {
        id: "visit002",
        type: "visit",
        date: "2024-01-15",
        title: "Endocrinology Consultation",
        doctor: "Dr. Emily Rodriguez",
        department: "Endocrinology",
        reason: "Diabetes management and HbA1c review",
        diagnosis: "Type 2 Diabetes Mellitus",
        treatment: "Metformin dosage adjustment, dietary counseling",
        nextAppointment: "2024-04-15",
        status: "completed",
      },
    ],
  }

  // Combine all records for "all" tab
  const allRecords = [
    ...healthRecords.prescriptions,
    ...healthRecords.labReports,
    ...healthRecords.vitals,
    ...healthRecords.visitHistory,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "prescription":
        return <Pill className="w-5 h-5 text-blue-600" />
      case "lab":
        return <TestTube className="w-5 h-5 text-green-600" />
      case "vitals":
        return <Activity className="w-5 h-5 text-purple-600" />
      case "visit":
        return <Stethoscope className="w-5 h-5 text-orange-600" />
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white"
      case "completed":
        return "bg-primary text-primary-foreground"
      case "reviewed":
        return "bg-blue-500 text-white"
      case "pending":
        return "bg-orange-500 text-white"
      case "elevated":
        return "bg-destructive text-destructive-foreground"
      case "normal":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const openRecordDialog = (record: any) => {
    setSelectedRecord(record)
    setRecordDialog(true)
  }

  const downloadRecord = (record: any) => {
    console.log("Downloading record:", record.id)
    // Implement download functionality
  }

  const shareRecord = (record: any) => {
    console.log("Sharing record:", record.id)
    // Implement share functionality
  }

  const RecordCard = ({ record }: { record: any }) => (
    <Card className="transition-all hover:shadow-md cursor-pointer" onClick={() => openRecordDialog(record)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-1">{getRecordIcon(record.type)}</div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{record.title}</h4>
              <p className="text-sm text-muted-foreground">Dr. {record.doctor}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{record.date}</span>
                </div>
                {record.facility && (
                  <div className="flex items-center space-x-1">
                    <span>{record.facility}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                downloadRecord(record)
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const RecordDetailDialog = () => {
    if (!selectedRecord) return null

    return (
      <Dialog open={recordDialog} onOpenChange={setRecordDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {getRecordIcon(selectedRecord.type)}
              <span>{selectedRecord.title}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedRecord.doctor} • {selectedRecord.date}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6">
              {/* Prescription Details */}
              {selectedRecord.type === "prescription" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Medications</h4>
                    <div className="space-y-3">
                      {selectedRecord.medications.map((med: any, index: number) => (
                        <div key={index} className="p-3 bg-accent rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-foreground">{med.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {med.dosage} • {med.frequency}
                              </p>
                            </div>
                            <Badge variant="outline">{med.duration}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedRecord.instructions && (
                    <div>
                      <h4 className="font-medium mb-2">Instructions</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">
                        {selectedRecord.instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Lab Report Details */}
              {selectedRecord.type === "lab" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Test Results</h4>
                    <div className="space-y-2">
                      {selectedRecord.tests.map((test: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                          <div>
                            <span className="font-medium text-foreground">{test.name}</span>
                            <p className="text-sm text-muted-foreground">Range: {test.range}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {test.result} {test.unit}
                              </span>
                              <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedRecord.summary && (
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">{selectedRecord.summary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Vitals Details */}
              {selectedRecord.type === "vitals" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Measurements</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedRecord.measurements.map((measurement: any, index: number) => (
                        <div key={index} className="p-3 bg-accent rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">{measurement.name}</span>
                            <Badge className={getStatusColor(measurement.status)}>{measurement.status}</Badge>
                          </div>
                          <div className="mt-1">
                            <span className="text-lg font-semibold text-foreground">{measurement.result}</span>
                            <span className="text-sm text-muted-foreground ml-1">{measurement.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedRecord.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">{selectedRecord.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Visit Details */}
              {selectedRecord.type === "visit" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Department</h4>
                      <p className="text-sm text-muted-foreground">{selectedRecord.department}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Reason for Visit</h4>
                      <p className="text-sm text-muted-foreground">{selectedRecord.reason}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Diagnosis</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">{selectedRecord.diagnosis}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Treatment</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-accent rounded-lg">{selectedRecord.treatment}</p>
                  </div>
                  {selectedRecord.nextAppointment && (
                    <div>
                      <h4 className="font-medium mb-2">Next Appointment</h4>
                      <p className="text-sm text-muted-foreground">{selectedRecord.nextAppointment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => shareRecord(selectedRecord)}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={() => downloadRecord(selectedRecord)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedReportUrl, setSelectedReportUrl] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [summarizingId, setSummarizingId] = useState<string | null>(null)
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)

 


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = sessionStorage.getItem("token")
        const patientId = sessionStorage.getItem("patientId") // store patientId at login
        if (!token || !patientId) {
          setError("Not authorized")
          return
        }

        const res = await api.get(`/report/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setReports(res.data)
      } catch (err: any) {
        console.error("Error fetching reports:", err)
        setError(err.response?.data?.message || "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    const storedToken = sessionStorage.getItem("token");
  setToken(storedToken);

    fetchReports()
  }, [])

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "prescriptions"
          ? r.type === "prescription"
          : activeTab === "lab"
            ? r.type === "labreport"
            : activeTab === "vitals"
              ? r.type === "vitals"
              : true
    return matchesSearch && matchesTab
  })

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error("Download failed", err)
    }
  }

  

  const handleSummarize = async (url: string, filename: string, reportId: string) => {
    if (!token) return
    setSummarizingId(reportId)
    setSummary(null)
    try {
      const res = await api.post(
        "/ai/summarize",
        { url, filename },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSummary(res.data.reply)
      setSummaryModalOpen(true)
    } catch (err: any) {
      console.error("Summarization failed", err)
      alert(err.response?.data?.reply || "Failed to summarize report")
    } finally {
      setSummarizingId(null)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Health Records</h1>
            <p className="text-sm text-muted-foreground">Your complete medical history</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="lab">Lab Reports</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <p>Loading reports...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredReports.length === 0 ? (
              <p>No reports found.</p>
            ) : (
              filteredReports.map((r) => (
                <Card key={r._id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle>{r.filename}</CardTitle>
                    <CardDescription>{r.type.toUpperCase()} Report</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end gap-2">
                    {r.filename.toLowerCase().endsWith(".pdf") ? (
                      // Only Download for PDF
                      <>                  
                        <Button
                          variant="outline"
                          onClick={() => handleDownload(r.url, r.filename)}
                        >
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button><Button
                          onClick={() => handleSummarize(r.url, r.filename, r._id)}
                          variant="secondary"
                          disabled={summarizingId === r._id}
                          className="flex items-center gap-1"
                        >
                          {summarizingId === r._id ? "Summarizing..." : "Summarize"}
                        </Button></>
                    ) : (
                      // Both View and Download for images/other files
                      <>
                        <Button variant="outline" onClick={() => setSelectedReportUrl(r.url)}>
                          View
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDownload(r.url, r.filename)}
                        >
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button>
                        <Button
                          onClick={() => handleSummarize(r.url, r.filename, r._id)}
                          variant="secondary"
                          disabled={summarizingId === r._id}
                          className="flex items-center gap-1"
                        >
                          {summarizingId === r._id ? "Summarizing..." : "Summarize"}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

        </Tabs>
      </div>

      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[70vw] max-w-2xl rounded-lg p-6 shadow-xl relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setSummaryModalOpen(false)}
            >
              Close
            </button>
            <h2 className="text-xl font-semibold mb-3">🩺 Report Summary</h2>
            {summary ? (
              <p className="whitespace-pre-wrap text-gray-800">{summary}</p>
            ) : (
              <p className="text-gray-500">Generating summary...</p>
            )}
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {selectedReportUrl && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[80vw] h-[80vh] rounded-lg overflow-hidden relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setSelectedReportUrl(null)}
            >
              Close
            </button>
            <iframe
              src={selectedReportUrl}
              className="w-full h-full"
              title="PDF Viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )
}
