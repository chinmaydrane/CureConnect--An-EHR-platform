"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminStaffPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
          <CardDescription>All staff members and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Sample staff directory.</div>
        </CardContent>
      </Card>
    </main>
  )
}
