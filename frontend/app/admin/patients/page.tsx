"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminPatientsPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>All patients overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Sample listing. Navigate here from Admin dashboard.</div>
        </CardContent>
      </Card>
    </main>
  )
}
