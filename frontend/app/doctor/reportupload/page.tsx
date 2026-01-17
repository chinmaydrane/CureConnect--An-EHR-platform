"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"

export default function ReportUploadPage() {
  const [patientId, setPatientId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState("prescription") // default type
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpload = async () => {
  if (!patientId || !file) {
    setMessage("Please enter Patient ID and select a file.")
    return
  }

  setLoading(true)
  setMessage("")

  try {
    const token = sessionStorage.getItem("token")
    if (!token) {
      setMessage("Not authorized. Please login.")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("patientId", patientId)
    formData.append("type", type)
    formData.append("file", file)

    const res = await api.post("/report/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })

    setMessage("Report uploaded successfully ✅")
    setPatientId("")
    setFile(null)
  } catch (err: any) {
    console.error(err)
    if (err.response?.status === 404) {
      setMessage("Patient not found ❌")
    } else {
      setMessage(err.response?.data?.message || "Something went wrong ❌")
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="p-6 max-w-3xl mx-auto grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Patient Report</CardTitle>
          <CardDescription>Upload PDF or Image and categorize it</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="prescription">Prescription</option>
            <option value="labreport">Lab Report</option>
            <option value="vitals">Vitals</option>
          </select>

          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />

          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>

          {message && <p className="text-center mt-2">{message}</p>}
        </CardContent>
      </Card>
    </main>
  )
}
