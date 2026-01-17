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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.preprocess((val) => Number(val), z.number().positive("Age must be positive")),
  bloodGroup: z.string().min(1, "Blood group is required"),
  height: z.preprocess((val) => Number(val), z.number().positive("Height is required")),
  weight: z.preprocess((val) => Number(val), z.number().positive("Weight is required")),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(1, "Address is required"),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  insurance: z.string().min(1, "Insurance is required"),
})

type PatientForm = z.infer<typeof patientSchema>

export default function PatientOnboardingPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  })

  useEffect(() => {
    try {
      const prefill = sessionStorage.getItem("pendingSignup")
      if (prefill) {
        const parsed = JSON.parse(prefill) as Partial<PatientForm>
        if (parsed.email) setValue("email", parsed.email)
        if (parsed.phone) setValue("phone", parsed.phone as any)
      }
    } catch {}
  }, [setValue])

  const onSubmit = async (data: PatientForm) => {
    try {
      const userId = sessionStorage.getItem("userId")
      if (!userId) {
        alert("User ID not found. Please sign up again.")
        return
      }

      const res = await fetch("http://localhost:5000/api/patient/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message)

      console.log("✅ Patient profile created:", result.patient)
      sessionStorage.removeItem("pendingSignup")
      router.push("/patient/dashboard")
    } catch (e) {
      console.error("❌ Patient onboarding error:", e)
      alert("Error saving profile. Check console.")
    }
  }

  return (
    <main className="min-h-dvh w-full flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Complete your patient profile</CardTitle>
          <CardDescription>Please provide your details to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Full name" {...register("name")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Age" {...register("age")} />
              {errors.age && <p className="text-destructive text-sm">{errors.age.message}</p>}
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select onValueChange={(v) => setValue("bloodGroup", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroup && <p className="text-destructive text-sm">{errors.bloodGroup.message}</p>}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="e.g., 172" {...register("height")} />
              {errors.height && <p className="text-destructive text-sm">{errors.height.message}</p>}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="e.g., 70" {...register("weight")} />
              {errors.weight && <p className="text-destructive text-sm">{errors.weight.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Phone number" {...register("phone")} />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Street, City, State, ZIP" {...register("address")} />
              {errors.address && <p className="text-destructive text-sm">{errors.address.message}</p>}
            </div>

            {/* Allergies */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="allergies">Allergies (optional)</Label>
              <Textarea id="allergies" placeholder="E.g., Penicillin, nuts" {...register("allergies")} />
            </div>

            {/* Conditions */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="conditions">Conditions (optional)</Label>
              <Textarea id="conditions" placeholder="E.g., Hypertension, Asthma" {...register("conditions")} />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" placeholder="Name and phone" {...register("emergencyContact")} />
              {errors.emergencyContact && <p className="text-destructive text-sm">{errors.emergencyContact.message}</p>}
            </div>

            {/* Insurance */}
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance</Label>
              <Input id="insurance" placeholder="Insurance provider / policy" {...register("insurance")} />
              {errors.insurance && <p className="text-destructive text-sm">{errors.insurance.message}</p>}
            </div>

            {/* Buttons */}
            <div className={cn("md:col-span-2 flex justify-end gap-3 pt-2")}>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
