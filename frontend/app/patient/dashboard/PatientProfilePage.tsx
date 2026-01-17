"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export default function PatientProfilePage() {
  const [patientData, setPatientData] = useState<any>({
    name: "",
    age: 0,
    weight: 0,
    height: 0,
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    phone: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [token, setToken] = useState<string | null>(null)

  // Get token safely
  useEffect(() => {
    const t = sessionStorage.getItem("token")
    if (t) setToken(t)
  }, [])

  // Fetch patient profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        const res = await api.get("/patient/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPatientData(res.data)
      } catch (err) {
        console.error("Failed to fetch patient profile:", err)
      }
    }
    fetchProfile()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setMessage("")
    try {
      const res = await api.post("/patient/profile", patientData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPatientData(res.data)
      setMessage("Profile saved successfully!")
    } catch (err) {
      console.error(err)
      setMessage("Error saving profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Patient Profile</CardTitle>
          <CardDescription>Fill in your details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {Object.entries(patientData)
              .filter(([key]) => !["_id", "createdAt", "updatedAt", "__v", "patientId", "user"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="grid gap-1">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <Input
                    name={key}
                    value={value as any}
                    onChange={handleChange}
                    type={["age", "weight", "height"].includes(key) ? "number" : "text"}
                    required
                  />
                  
                </div>
              ))}

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
          {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>
    </main>
  )
}
