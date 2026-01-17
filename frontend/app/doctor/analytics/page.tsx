"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// shadcn charts (Recharts)
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts"

const monthly = [
  { month: "Jan", consultations: 145, avgDuration: 32 },
  { month: "Feb", consultations: 167, avgDuration: 35 },
  { month: "Mar", consultations: 189, avgDuration: 31 },
  { month: "Apr", consultations: 201, avgDuration: 33 },
  { month: "May", consultations: 178, avgDuration: 36 },
  { month: "Jun", consultations: 223, avgDuration: 34 },
]

export default function DoctorAnalyticsPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto grid gap-6">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Consultations Trend</CardTitle>
          <CardDescription>Monthly consultations overview</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consultations"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Average Duration</CardTitle>
          <CardDescription>Minutes per consultation</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="avgDuration" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
