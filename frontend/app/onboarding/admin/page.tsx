"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role/Title is required"),
  hospital: z.string().min(1, "Hospital is required"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  notes: z.string().optional(),
})

type AdminForm = z.infer<typeof adminSchema>

export default function AdminOnboardingPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminForm>({ resolver: zodResolver(adminSchema) })

  const onSubmit = async (data: AdminForm) => {
    try {
      localStorage.setItem("adminProfile", JSON.stringify(data))
      localStorage.setItem("adminOnboardingComplete", "true")
      router.push("/admin/dashboard")
    } catch (e) {
      console.error("[v0] admin onboarding submit error:", e)
    }
  }

  return (
    <main className="min-h-dvh w-full flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Complete your admin profile</CardTitle>
          <CardDescription>Please provide your details to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Full name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input id="role" placeholder="e.g., Hospital Admin" {...register("role")} aria-invalid={!!errors.role} />
              {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Input
                id="hospital"
                placeholder="Hospital name"
                {...register("hospital")}
                aria-invalid={!!errors.hospital}
              />
              {errors.hospital && <p className="text-destructive text-sm">{errors.hospital.message}</p>}
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
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" placeholder="Any additional context" {...register("notes")} />
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
