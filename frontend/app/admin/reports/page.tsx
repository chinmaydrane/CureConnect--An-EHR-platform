"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminReportsPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Operational and clinical reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Charts and KPIs would appear here.</div>
        </CardContent>
      </Card>
    </main>
  )
}
