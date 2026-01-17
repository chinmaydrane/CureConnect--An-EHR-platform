"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function PatientConsultsPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Consultations</CardTitle>
          <CardDescription>Past video and in-person visits</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Dr. John Smith • Cardiology</div>
                <div className="text-muted-foreground text-sm">Video consult • 24 Jan 2025 • 30 min</div>
              </div>
              <div className="text-sm text-muted-foreground">Follow-up in 3 months</div>
            </div>
          </div>
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Dr. Emily Clark • Endocrinology</div>
                <div className="text-muted-foreground text-sm">In-person • 12 Dec 2024 • 25 min</div>
              </div>
              <div className="text-sm text-muted-foreground">Diet plan updated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
