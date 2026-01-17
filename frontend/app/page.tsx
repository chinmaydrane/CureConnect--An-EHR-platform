"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Heart, Shield, Users } from "lucide-react"

export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState("patient")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/login")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect based on role
      if (selectedRole === "patient") {
        window.location.href = "/patient/dashboard"
      } else if (selectedRole === "doctor") {
        window.location.href = "/doctor/dashboard"
      } else {
        window.location.href = "/admin/dashboard"
      }
    }, 2000)
  }

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get("email") || "")

    try {
      sessionStorage.setItem("pendingSignup", JSON.stringify({ email }))
    } catch {}

    setTimeout(() => {
      setIsLoading(false)
      if (selectedRole === "patient") {
        window.location.href = "/onboarding/patient"
      } else if (selectedRole === "doctor") {
        window.location.href = "/onboarding/doctor"
      } else {
        window.location.href = "/onboarding/admin"
      }
    }, 800)
  }

  const roles = [
    {
      id: "patient",
      title: "Patient",
      description: "Access your health records and book appointments",
      icon: Heart,
      color: "text-medical-primary",
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Manage patients and consultations",
      icon: Shield,
      color: "text-medical-secondary",
    },
    {
      id: "admin",
      title: "Hospital Admin",
      description: "Oversee hospital operations and staff",
      icon: Users,
      color: "text-medical-success",
    },
  ]

  return <div className="sr-only">Redirecting...</div>
}
