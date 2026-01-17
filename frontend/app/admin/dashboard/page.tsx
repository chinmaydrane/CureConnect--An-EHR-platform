"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Heart,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Building,
  UserCheck,
  FileText,
  AlertTriangle,
  Settings,
  Bell,
  LogOut,
} from "lucide-react"
import AdminProfilePage from "./adminProfilePage"
import api from "@/lib/api"
import { add } from "date-fns"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [adminProfile, setAdminProfile] = useState<any | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminProfile")
      if (raw) setAdminProfile(JSON.parse(raw))
    } catch {}
  }, [])

  // Mock admin data
  const adminData = {
    name: "Dr. Sarah Wilson",
    role: "Hospital Administrator",
    hospital: "Central Medical Center",
  }

  const hospitalStats = [
    { label: "Total Patients", value: "2,847", icon: Users, color: "text-primary", change: "+12%" },
    { label: "Active Doctors", value: "45", icon: UserCheck, color: "text-green-600", change: "+2%" },
    { label: "Today's Appointments", value: "156", icon: Calendar, color: "text-blue-600", change: "+8%" },
    { label: "Bed Occupancy", value: "78%", icon: Building, color: "text-orange-600", change: "-3%" },
  ]

  const patientsData = [
    { month: "Jan", admitted: 245, discharged: 230, emergency: 89 },
    { month: "Feb", admitted: 267, discharged: 251, emergency: 95 },
    { month: "Mar", admitted: 289, discharged: 275, emergency: 102 },
    { month: "Apr", admitted: 312, discharged: 298, emergency: 87 },
    { month: "May", admitted: 298, discharged: 285, emergency: 93 },
    { month: "Jun", admitted: 334, discharged: 320, emergency: 108 },
  ]

  const staffData = [
    { department: "Nursing", count: 120, color: "#8884d8" },
    { department: "Doctors", count: 45, color: "#82ca9d" },
    { department: "Administration", count: 28, color: "#ffc658" },
    { department: "Support", count: 67, color: "#ff7300" },
    { department: "Lab Technicians", count: 23, color: "#00ff88" },
  ]

  const reportsData = [
    { type: "Lab Reports", count: 1245, trend: "+15%" },
    { type: "Radiology", count: 567, trend: "+8%" },
    { type: "Pathology", count: 234, trend: "-3%" },
    { type: "Cardiology", count: 189, trend: "+12%" },
    { type: "Neurology", count: 98, trend: "+5%" },
  ]

  const handleNotifications = () => {
    toast({ title: "Notifications", description: "Opening notification center..." })
    window.location.href = "/admin/notifications"
  }

  const handleSettings = () => {
    toast({ title: "Settings", description: "Opening admin settings panel..." })
    window.location.href = "/admin/settings"
  }

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "Redirecting to login page...",
    })
    setTimeout(() => {
      window.location.href = "/"
    }, 1500)
  }

   const [adData, setAdData] = useState<any>({
    name: "",
    hospitalName: "",
    designation: "",
    phone: "",
    email: "",
    address: ""
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
      const t = sessionStorage.getItem("token")
      if (t) setToken(t)
    }, [])

    useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return
      try {
        const res = await api.get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAdData(res.data)
      } catch (err) {
        console.error("❌ Failed to fetch patient profile:", err)
      }
    }
    fetchProfile()
  }, [token])

  const initials = adData?.name
    ? adData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "PT";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Cure Connect</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative" onClick={handleNotifications}>
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">7</Badge>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Info */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {(adData.name || "Admin")
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{adData.name || "Admin"}</h2>
            <p className="text-muted-foreground">{adData.designation || "Administrator"}</p>
            <p className="text-sm text-muted-foreground">{adData.hospitalName || "Hospital"}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {hospitalStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <Badge variant="outline" className="text-xs mt-1">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>Hospital Activity</span>
                  </CardTitle>
                  <CardDescription>Real-time hospital operations overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Emergency Department</span>
                      <Badge className="bg-green-500 text-white">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ICU Capacity</span>
                      <Badge className="bg-orange-500 text-white">85% Full</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Surgery Schedule</span>
                      <Badge className="bg-primary text-primary-foreground">12 Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Lab Processing</span>
                      <Badge className="bg-blue-500 text-white">45 Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Alerts & Notifications</span>
                  </CardTitle>
                  <CardDescription>Important system alerts and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Equipment Maintenance Due</span>
                      </div>
                      <p className="text-xs text-orange-700 mt-1">MRI Machine #2 requires scheduled maintenance</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Staff Schedule Update</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">New nursing shifts for next week available</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Performance Metrics</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">Patient satisfaction scores improved by 8%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Staff</CardTitle>
                <CardDescription>Distribution and staff metrics</CardDescription>
              </div>
              <Button variant="outline" onClick={() => (window.location.href = "/admin/staff")}>
                Open Full Page
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Distribution by Department</CardTitle>
                  <CardDescription>Current staff allocation across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Staff Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={staffData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ department, count }) => `${department}: ${count}`}
                        >
                          {staffData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staff Performance Metrics</CardTitle>
                  <CardDescription>Monthly staff efficiency and satisfaction scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Satisfaction</span>
                      <Badge className="bg-green-500 text-white">92%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Attendance Rate</span>
                      <Badge className="bg-blue-500 text-white">96%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Training Completion</span>
                      <Badge className="bg-orange-500 text-white">87%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Performance Score</span>
                      <Badge className="bg-primary text-primary-foreground">4.6/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Patient Flow Analytics</CardTitle>
                <CardDescription>Monthly patient admission, discharge, and emergency trends</CardDescription>
              </div>
              <Button variant="outline" onClick={() => (window.location.href = "/admin/patients")}>
                Open Full Page
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Patient Flow Analytics</CardTitle>
                <CardDescription>Monthly patient admission, discharge, and emergency trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    admitted: {
                      label: "Admitted",
                      color: "#3b82f6",
                    },
                    discharged: {
                      label: "Discharged",
                      color: "#10b981",
                    },
                    emergency: {
                      label: "Emergency",
                      color: "#ef4444",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patientsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="admitted" fill="#3b82f6" name="Admitted" />
                      <Bar dataKey="discharged" fill="#10b981" name="Discharged" />
                      <Bar dataKey="emergency" fill="#ef4444" name="Emergency" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Report statistics and processing analytics</CardDescription>
              </div>
              <Button variant="outline" onClick={() => (window.location.href = "/admin/reports")}>
                Open Full Page
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Generation Statistics</CardTitle>
                  <CardDescription>Monthly report generation by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{report.type}</p>
                          <p className="text-sm text-muted-foreground">{report.count} reports</p>
                        </div>
                        <Badge variant={report.trend.startsWith("+") ? "default" : "destructive"}>{report.trend}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Processing Analytics</CardTitle>
                  <CardDescription>Processing time and efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <ChartContainer
                      config={{
                        time: {
                          label: "Processing Time (hours)",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { type: "Lab", time: 2.5 },
                            { type: "Radiology", time: 4.2 },
                            { type: "Pathology", time: 6.8 },
                            { type: "Cardiology", time: 3.1 },
                            { type: "Neurology", time: 5.4 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="time"
                            stroke="var(--color-time)"
                            strokeWidth={3}
                            dot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-accent rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">94%</p>
                        <p className="text-sm text-muted-foreground">On-time Delivery</p>
                      </div>
                      <div className="p-4 bg-accent rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">3.8h</p>
                        <p className="text-sm text-muted-foreground">Avg Processing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
           <AdminProfilePage/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
