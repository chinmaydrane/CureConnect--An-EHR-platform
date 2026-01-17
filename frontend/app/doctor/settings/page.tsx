"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DoctorSettingsPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="notif-email">Notification Email</Label>
            <Input id="notif-email" type="email" placeholder="you@hospital.org" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notif-sms">SMS Number</Label>
            <Input id="notif-sms" type="tel" placeholder="+1 555 0199" />
          </div>
          <Button className="mt-2">Save</Button>
        </CardContent>
      </Card>
    </main>
  )
}
