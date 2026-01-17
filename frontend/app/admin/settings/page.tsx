"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Organization-wide preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="org-email">Org Contact Email</Label>
            <Input id="org-email" type="email" placeholder="admin@hospital.org" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alerts">Alerts Webhook</Label>
            <Input id="alerts" placeholder="https://hooks.example.com/alerts" />
          </div>
          <Button className="mt-2">Save</Button>
        </CardContent>
      </Card>
    </main>
  )
}
