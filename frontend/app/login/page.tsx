"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import api from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const email = new FormData(form).get("email") as string
    const password = new FormData(form).get("password") as string

    try {
      const res = await api.post("/auth/login", { email, password, role })
      const { token, user } = res.data

      // store in session or local storage
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("user", JSON.stringify(user))

      // ✅ also store patientId (only if patient role)
      if (user.role === "patient" && user.patientId) {
        sessionStorage.setItem("patientId", user.patientId)
      }

      // redirect based on role
      if (user.role === "patient") router.push("/patient/dashboard")
      else if (user.role === "doctor") router.push("/doctor/dashboard")
      else router.push("/admin/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center gap-4">
            <Button variant="default" size="sm">
              Login
            </Button>
            <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground">
              Sign Up
            </Link>
          </div>
          <CardTitle className="mt-3 text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="role-patient" value="patient" />
                  <Label htmlFor="role-patient" className="cursor-pointer">
                    Patient
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="role-doctor" value="doctor" />
                  <Label htmlFor="role-doctor" className="cursor-pointer">
                    Doctor
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="role-admin" value="admin" />
                  <Label htmlFor="role-admin" className="cursor-pointer">
                    Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <span className="text-sm text-muted-foreground">
            Don{"'"}t have an account?{" "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              Sign Up
            </Link>
          </span>
        </CardFooter>
      </Card>
    </main>
  )
}
