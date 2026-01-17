"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminNotificationsPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>System and staff updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-3">
            <div className="font-medium">Staff Shift Update</div>
            <div className="text-sm text-muted-foreground">ER staffing increased for tonight’s shift.</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="font-medium">Compliance Report</div>
            <div className="text-sm text-muted-foreground">New quarterly compliance report available.</div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
