"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Consultation = {
  id: string
  patientId: string
  patientName: string
  type: string
  notes: string
  date: string
}

export default function DoctorConsultationsPage() {
  const [items, setItems] = useState<Consultation[]>([
    {
      id: "C-10021",
      patientId: "P-20031",
      patientName: "Alice Johnson",
      type: "Video",
      notes: "Follow-up visit, stable condition.",
      date: "2025-01-24",
    },
  ])

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newItem: Consultation = {
      id: "C-" + Math.floor(Math.random() * 99999),
      patientId: String(fd.get("patientId") || ""),
      patientName: String(fd.get("patientName") || ""),
      type: String(fd.get("type") || "In-person"),
      notes: String(fd.get("notes") || ""),
      date: String(fd.get("date") || new Date().toISOString().slice(0, 10)),
    }
    setItems((prev) => [newItem, ...prev])
    e.currentTarget.reset()
  }

  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6">
      {/* New Consultation */}
      <Card>
        <CardHeader>
          <CardTitle>New Consultation</CardTitle>
          <CardDescription>Add a consultation entry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" name="patientId" placeholder="P-20031" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" name="patientName" placeholder="Alice Johnson" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" name="type" placeholder="Video / In-person" required />
            </div>

            <div className="grid gap-2 md:col-span-3">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>

            <div className="grid gap-2 md:col-span-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Symptoms, diagnosis, plan..." required />
            </div>

            <div className="md:col-span-3">
              <Button type="submit">Add Consultation</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Consultation History */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation History</CardTitle>
          <CardDescription>Recently added consultations</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {items.map((c) => (
            <div key={c.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">
                    {c.patientName} • {c.type}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {c.id} • {c.date} • {c.patientId}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground max-w-[50%]">{c.notes}</div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">No consultations yet.</div>}
        </CardContent>
      </Card>
    </main>
  )
}
