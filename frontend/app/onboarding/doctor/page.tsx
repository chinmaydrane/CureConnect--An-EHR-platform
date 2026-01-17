"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  speciality: z.string().min(1, "Speciality is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  experience: z.coerce.number().min(0, "Experience must be a positive number"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  education: z.string().min(1, "Education is required"),
  certifications: z.string().min(1, "Certifications are required"),
})

type DoctorForm = z.infer<typeof doctorSchema>

export default function DoctorOnboardingPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DoctorForm>({ resolver: zodResolver(doctorSchema) })

  // Prefill email/phone if provided during signup
  useEffect(() => {
    try {
      const prefill = sessionStorage.getItem("pendingSignup")
      if (prefill) {
        const parsed = JSON.parse(prefill) as Partial<DoctorForm>
        if (parsed.email) setValue("email", parsed.email)
        if (parsed.phone) setValue("phone", parsed.phone as any)
      }
    } catch {}
  }, [setValue])

  const onSubmit = async (data: DoctorForm) => {
    try {
      localStorage.setItem("doctorProfile", JSON.stringify(data))
      localStorage.setItem("doctorOnboardingComplete", "true")
      router.push("/doctor/dashboard")
    } catch (e) {
      console.error("[v0] doctor onboarding submit error:", e)
    }
  }

  return (
    <main className="min-h-dvh w-full flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Complete your doctor profile</CardTitle>
          <CardDescription>Please provide your professional details to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Full name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="speciality">Speciality</Label>
              <Input
                id="speciality"
                placeholder="e.g., Cardiologist"
                {...register("speciality")}
                aria-invalid={!!errors.speciality}
              />
              {errors.speciality && <p className="text-destructive text-sm">{errors.speciality.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="License / Registration no."
                {...register("licenseNumber")}
                aria-invalid={!!errors.licenseNumber}
              />
              {errors.licenseNumber && <p className="text-destructive text-sm">{errors.licenseNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g., 8"
                {...register("experience")}
                aria-invalid={!!errors.experience}
              />
              {errors.experience && <p className="text-destructive text-sm">{errors.experience.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Phone number" {...register("phone")} aria-invalid={!!errors.phone} />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                placeholder="Degrees, Institutions, Years"
                {...register("education")}
                aria-invalid={!!errors.education}
              />
              {errors.education && <p className="text-destructive text-sm">{errors.education.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                placeholder="Board certifications, fellowships, etc."
                {...register("certifications")}
                aria-invalid={!!errors.certifications}
              />
              {errors.certifications && <p className="text-destructive text-sm">{errors.certifications.message}</p>}
            </div>

            <div className={cn("md:col-span-2 flex justify-end gap-3 pt-2")}>
              <Button type="button" variant="ghost" onClick={() => history.back()}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
