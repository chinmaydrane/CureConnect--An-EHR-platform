"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { Download, Trash } from "lucide-react"

type Patient = {
  patientId: string
  name?: string
  age?: number
  bloodGroup?: string
  allergies?: string[]
  phone?: string
  height?: number
  weight?: number
}

type Report = {
  _id: string
  filename: string
  type: string
  url: string
  createdAt: string
}

export default function DoctorPatientsPage() {
  const [pid, setPid] = useState("")
  const [result, setResult] = useState<Patient | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [notFound, setNotFound] = useState(false)
  const [selectedReportUrl, setSelectedReportUrl] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [summarizingId, setSummarizingId] = useState<string | null>(null)
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)


  // Get token safely on client
  useEffect(() => {
    setToken(sessionStorage.getItem("token"))
  }, [])

  const search = async () => {
    if (!pid.trim()) {
      setError("Please enter a Patient ID");
      setResult(null);
      setReports([]);
      setNotFound(false);
      return;
    }

    if (!token) {
      setError("Not authorized");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setReports([]);
    setNotFound(false);

    try {
      // 1️⃣ Check access first
      const accessRes = await api.get(`/access/check/${pid.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!accessRes.data.allowed) {
        setError("You don't have access to this patient's data. Send a request and wait for approval.");
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch patient details (you already had this)
      const res = await api.get(`/doctor/lookup/${pid.trim()}`);
      if (res.data) {
        const p = res.data;
        setResult({
          patientId: p.patientId || pid,
          name: p.name || "N/A",
          age: p.age ?? undefined,
          bloodGroup: p.bloodGroup || undefined,
          height: p.height ?? undefined,
          weight: p.weight ?? undefined,
          phone: p.phone || "N/A",
        });
      } else {
        setNotFound(true);
      }

      // 3️⃣ Fetch reports only if access allowed
      const reportsRes = await api.get(`/report/patient/${pid.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(reportsRes.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error fetching patient data");
    } finally {
      setLoading(false);
    }
  };


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

  const handleDelete = async (reportId: string) => {
    if (!token) return
    if (!confirm("Are you sure you want to delete this report?")) return

    try {
      await api.delete(`/report/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReports((prev) => prev.filter((r) => r._id !== reportId))
    } catch (err: any) {
      console.error("Delete failed", err)
      alert(err.response?.data?.message || "Failed to delete report")
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

  const sendAccessRequest = async () => {
    try {
      // 1️⃣ Send access request
      const res = await api.post(
        "/access/request",
        { patientId: pid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Access request sent to patient for approval.");

      // 2️⃣ (Optional) If you want, you can poll later or check manually whether access is approved
      // Example: Wait for patient approval before checking access
      // const accessRes = await api.get(`/doctor/access-check/${pid}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (!accessRes.data.allowed) {
      //   setError("Access not granted by patient or expired.");
      //   setLoading(false);
      //   return;
      // }

    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send access request.");
    }
  };






  return (
    <main className="p-6 max-w-3xl mx-auto grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Patient</CardTitle>
          <CardDescription>Search by Patient ID</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Enter Patient ID (e.g., PAT688885)"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />



          <Button onClick={search} disabled={loading || !pid.trim()}>
            {loading ? "Checking Access..." : "Search"}
          </Button>
          <Button onClick={sendAccessRequest} disabled={!pid || loading}>
            Request Access
          </Button>




        </CardContent>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </Card>

      {notFound && (
        <Card className="bg-red-100 border-red-400">
          <CardContent className="text-center">
            <CardTitle className="text-red-700">Patient Not Found ❌</CardTitle>
            <CardDescription className="text-red-600">
              No records found for ID: <span className="font-semibold">{pid}</span>
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {result && !loading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Name: {result.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div>Age: {result.age ?? "N/A"}</div>
              <div>Blood Group: {result.bloodGroup || "N/A"}</div>
              <div>Height: {result.height ?? "N/A"} cm</div>
              <div>Weight: {result.weight ?? "N/A"} kg</div>
              <div>Phone: {result.phone || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {reports.length === 0 && <p>No reports uploaded yet.</p>}
              {reports.map((r) => (
                <Card key={r._id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle>{r.filename}</CardTitle>
                    <CardDescription>{r.type.toUpperCase()} Report</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2 justify-end">
                    {r.filename.endsWith(".pdf") ? (
                      <Button onClick={() => handleDownload(r.url, r.filename)} variant="outline">
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => setSelectedReportUrl(r.url)} variant="outline">
                          View
                        </Button>
                        <Button onClick={() => handleDownload(r.url, r.filename)} variant="outline">
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleDelete(r._id)}
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <Trash className="w-4 h-4" /> Delete
                    </Button>
                    <Button
                      onClick={() => handleSummarize(r.url, r.filename, r._id)}
                      variant="secondary"
                      disabled={summarizingId === r._id}
                      className="flex items-center gap-1"
                    >
                      {summarizingId === r._id ? "Summarizing..." : "Summarize"}
                    </Button>

                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Summary Modal */}
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

          {/* PDF/Image Modal */}
          {selectedReportUrl && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="bg-white w-[80vw] h-[80vh] rounded-lg overflow-hidden relative">
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedReportUrl(null)}
                >
                  Close
                </button>
                <iframe src={selectedReportUrl} title="Viewer" className="w-full h-full" />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
