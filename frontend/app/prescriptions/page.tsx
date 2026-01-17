"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pill,
  Download,
  Share,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Heart,
  QrCode,
  Printer,
} from "lucide-react"

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [prescriptionDialog, setPrescriptionDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock prescription data
  const prescriptions = {
    active: [
      {
        id: "rx001",
        status: "active",
        date: "2024-01-20",
        doctor: "Dr. Michael Chen",
        specialty: "Cardiologist",
        title: "Hypertension Management",
        medications: [
          {
            name: "Lisinopril",
            genericName: "Lisinopril",
            strength: "10mg",
            form: "Tablet",
            quantity: "30 tablets",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take with or without food. Take at the same time each day.",
            refillsRemaining: 2,
            nextRefillDate: "2024-02-19",
          },
          {
            name: "Hydrochlorothiazide",
            genericName: "HCTZ",
            strength: "25mg",
            form: "Tablet",
            quantity: "30 tablets",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take in the morning. May cause increased urination.",
            refillsRemaining: 2,
            nextRefillDate: "2024-02-19",
          },
        ],
        diagnosis: "Essential Hypertension",
        instructions: "Monitor blood pressure daily. Return for follow-up in 4 weeks.",
        pharmacy: "Central Pharmacy",
        prescriptionNumber: "RX123456789",
        expiryDate: "2024-07-20",
      },
      {
        id: "rx002",
        status: "active",
        date: "2024-01-15",
        doctor: "Dr. Emily Rodriguez",
        specialty: "Endocrinologist",
        title: "Diabetes Management",
        medications: [
          {
            name: "Metformin",
            genericName: "Metformin HCl",
            strength: "500mg",
            form: "Extended Release Tablet",
            quantity: "90 tablets",
            frequency: "Twice daily",
            duration: "90 days",
            instructions: "Take with meals to reduce stomach upset. Do not crush or chew.",
            refillsRemaining: 5,
            nextRefillDate: "2024-04-15",
          },
        ],
        diagnosis: "Type 2 Diabetes Mellitus",
        instructions: "Monitor blood glucose levels. Follow diabetic diet. Exercise regularly.",
        pharmacy: "Central Pharmacy",
        prescriptionNumber: "RX987654321",
        expiryDate: "2024-10-15",
      },
    ],
    completed: [
      {
        id: "rx003",
        status: "completed",
        date: "2023-12-10",
        doctor: "Dr. Sarah Wilson",
        specialty: "Family Medicine",
        title: "Antibiotic Course",
        medications: [
          {
            name: "Amoxicillin",
            genericName: "Amoxicillin",
            strength: "500mg",
            form: "Capsule",
            quantity: "21 capsules",
            frequency: "Three times daily",
            duration: "7 days",
            instructions: "Take with food. Complete entire course even if feeling better.",
            refillsRemaining: 0,
            completedDate: "2023-12-17",
          },
        ],
        diagnosis: "Bacterial Sinusitis",
        instructions: "Complete full course of antibiotics. Return if symptoms persist.",
        pharmacy: "Central Pharmacy",
        prescriptionNumber: "RX555666777",
        completedDate: "2023-12-17",
      },
    ],
    expired: [
      {
        id: "rx004",
        status: "expired",
        date: "2023-06-15",
        doctor: "Dr. Michael Chen",
        specialty: "Cardiologist",
        title: "Previous Hypertension Treatment",
        medications: [
          {
            name: "Amlodipine",
            genericName: "Amlodipine Besylate",
            strength: "5mg",
            form: "Tablet",
            quantity: "30 tablets",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take at the same time each day.",
            refillsRemaining: 0,
            expiredDate: "2023-12-15",
          },
        ],
        diagnosis: "Essential Hypertension",
        instructions: "Discontinued due to medication change.",
        pharmacy: "Central Pharmacy",
        prescriptionNumber: "RX111222333",
        expiryDate: "2023-12-15",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white"
      case "completed":
        return "bg-primary text-primary-foreground"
      case "expired":
        return "bg-muted text-muted-foreground"
      case "pending":
        return "bg-orange-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "expired":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Pill className="w-4 h-4" />
    }
  }

  const openPrescriptionDialog = (prescription: any) => {
    setSelectedPrescription(prescription)
    setPrescriptionDialog(true)
  }

  const downloadPrescription = (prescription: any) => {
    console.log("Downloading prescription:", prescription.id)
    // Implement download functionality
  }

  const sharePrescription = (prescription: any) => {
    console.log("Sharing prescription:", prescription.id)
    // Implement share functionality
  }

  const printPrescription = (prescription: any) => {
    console.log("Printing prescription:", prescription.id)
    // Implement print functionality
  }

  const requestRefill = (prescription: any, medication: any) => {
    console.log("Requesting refill for:", medication.name)
    // Implement refill request functionality
  }

  const PrescriptionCard = ({ prescription }: { prescription: any }) => (
    <Card
      className="transition-all hover:shadow-md cursor-pointer"
      onClick={() => openPrescriptionDialog(prescription)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{prescription.title}</h4>
              <p className="text-sm text-muted-foreground">Dr. {prescription.doctor}</p>
              <p className="text-xs text-muted-foreground">{prescription.specialty}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{prescription.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Pill className="w-3 h-3" />
                  <span>{prescription.medications.length} medication(s)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(prescription.status)} flex items-center space-x-1`}>
              {getStatusIcon(prescription.status)}
              <span>{prescription.status}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PrescriptionDetailDialog = () => {
    if (!selectedPrescription) return null

    return (
      <Dialog open={prescriptionDialog} onOpenChange={setPrescriptionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-primary" />
              <span>{selectedPrescription.title}</span>
            </DialogTitle>
            <DialogDescription>
              Prescribed by Dr. {selectedPrescription.doctor} on {selectedPrescription.date}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {/* Prescription Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Prescription Number</h4>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.prescriptionNumber}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Pharmacy</h4>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.pharmacy}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Diagnosis</h4>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.diagnosis}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Status</h4>
                  <Badge className={getStatusColor(selectedPrescription.status)}>
                    {selectedPrescription.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-medium mb-4">Medications</h4>
                <div className="space-y-4">
                  {selectedPrescription.medications.map((medication: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="font-medium text-foreground">{medication.name}</h5>
                              <Badge variant="outline">{medication.strength}</Badge>
                              <Badge variant="outline">{medication.form}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Generic: {medication.genericName}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Quantity:</span> {medication.quantity}
                              </div>
                              <div>
                                <span className="font-medium">Frequency:</span> {medication.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {medication.duration}
                              </div>
                              {medication.refillsRemaining !== undefined && (
                                <div>
                                  <span className="font-medium">Refills:</span> {medication.refillsRemaining} remaining
                                </div>
                              )}
                            </div>
                            <div className="mt-3 p-3 bg-accent rounded-lg">
                              <h6 className="font-medium text-foreground mb-1">Instructions</h6>
                              <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                            </div>
                          </div>
                          {selectedPrescription.status === "active" && medication.refillsRemaining > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => requestRefill(selectedPrescription, medication)}
                              className="ml-4"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Request Refill
                            </Button>
                          )}
                        </div>
                        {medication.nextRefillDate && (
                          <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Next refill available: {medication.nextRefillDate}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Doctor Instructions */}
              {selectedPrescription.instructions && (
                <div>
                  <h4 className="font-medium mb-2">Doctor's Instructions</h4>
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="text-sm text-muted-foreground">{selectedPrescription.instructions}</p>
                  </div>
                </div>
              )}

              {/* Prescription QR Code */}
              <div className="flex items-center justify-center p-6 bg-accent rounded-lg">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3">
                    <QrCode className="w-24 h-24 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Scan for pharmacy verification</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => printPrescription(selectedPrescription)}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={() => sharePrescription(selectedPrescription)}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={() => downloadPrescription(selectedPrescription)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
              <h1 className="font-semibold text-foreground">Prescriptions</h1>
              <p className="text-sm text-muted-foreground">Manage your medications and prescriptions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{prescriptions.active.length}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{prescriptions.completed.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{prescriptions.expired.length}</p>
                  <p className="text-sm text-muted-foreground">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Expired</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {prescriptions.active.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {prescriptions.completed.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {prescriptions.expired.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <PrescriptionDetailDialog />
    </div>
  )
}
