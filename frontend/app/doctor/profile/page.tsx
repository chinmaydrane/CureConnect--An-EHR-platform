"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: "",
    phoneNo: "",
    speciality: "",
    certifications: "",
    email: "",
    licenceNo: "",
    experience: 0
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [token, setToken] = useState<string | null>(null)

  // Get token from sessionStorage safely in useEffect
  useEffect(() => {
    const t = sessionStorage.getItem("token")
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        const res = await api.get("/doctor/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProfile(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProfile()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setMessage("")
    try {
      const res = await api.post("/doctor/profile", profile, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile(res.data)
      setMessage("Profile saved successfully!")
    } catch (err) {
      console.log(err)
      setMessage("Error saving profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
          <CardDescription>Fill in your details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {Object.entries(profile)
              .filter(([key]) =>
                !["_id", "createdAt", "updatedAt", "__v", "profilePic", "user","doctorId"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="grid gap-1">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <Input
                    name={key}
                    value={value as any}
                    onChange={handleChange}
                    type={["experience", "phoneNo"].includes(key) ? "number" : "text"}
                    required={key !== "certifications"}
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
