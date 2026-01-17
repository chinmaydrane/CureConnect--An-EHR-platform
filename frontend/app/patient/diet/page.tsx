"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { Upload, Send, ArrowBigDownDash, ArrowDownLeftFromCircle, ArrowUpFromDot, ArrowRightSquare } from "lucide-react"
// import dotenv from "dotenv";
// dotenv.config();


export default function PatientDietPage() {
  const [query, setQuery] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dietPlan, setDietPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return alert("Please select a report first.")
    setLoading(true)
    setError(null)
    setDietPlan(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/diet-report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDietPlan(res.data.reply);
    } catch (err: any) {
      console.error(err)
      setError("Failed to analyze report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setDietPlan(null)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/diet-text`, { message: query })
      setDietPlan(res.data.reply)
    } catch (err: any) {
      console.error(err)
      setError("Failed to get diet recommendations.")
    } finally {
      setLoading(false)
    }
  }

  // Helper: Split diet plan text into sections like Morning, Afternoon, etc.
  const formatDietPlan = (text: string) => {
    const sections = text
      .split(/\n\s*(?=Morning|Breakfast|Afternoon|Lunch|Evening|Dinner|Night)/i)
      .map((section) => section.trim())
      .filter(Boolean)

    if (sections.length === 0) return [{ title: "Diet Plan", content: text }]

    return sections.map((section) => {
      const [title, ...content] = section.split(/\n/)
      return { title, content: content.join("\n").trim() }
    })
  }

  const colorMap: Record<string, string> = {
    morning: "bg-amber-50 border-amber-200",
    breakfast: "bg-yellow-50 border-yellow-200",
    afternoon: "bg-orange-50 border-orange-200",
    lunch: "bg-green-50 border-green-200",
    evening: "bg-blue-50 border-blue-200",
    dinner: "bg-indigo-50 border-indigo-200",
    night: "bg-purple-50 border-purple-200",
  }

 const handleModelReport = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_FLASK_URL}`;// Flask app homepage
};



  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">AI-Powered Diet Recommendations</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Upload your health report or describe your condition to get a personalized plan.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your health condition (e.g., I have diabetes, high cholesterol...)"
              className="flex-1 min-h-[120px]"
            />
            <Button type="submit" disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button onClick={handleUpload} disabled={!file || loading}>
              <Upload className="w-4 h-4 mr-2" /> Upload Report
            </Button>
          </div>

          <Button onClick={handleModelReport}>
            <ArrowRightSquare className="w-4 h-4 mr-2" /> Nutrition Recommender
          </Button>

          {loading && <p className="text-sm text-muted-foreground animate-pulse">Analyzing your health data...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {dietPlan && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4 text-xl flex items-center gap-2">
                🩺 Personalized Diet Plan
              </h3>
              <div className="grid gap-4">
                {formatDietPlan(dietPlan).map((section, i) => {
                  const key = section.title.toLowerCase()
                  const colorClass =
                    Object.keys(colorMap).find((k) => key.includes(k)) ? colorMap[key.split(" ")[0]] : "bg-gray-50"
                  return (
                    <Card
                      key={i}
                      className={`border ${colorClass} shadow-sm transition-all hover:shadow-md duration-200`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="capitalize text-lg font-semibold">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                          {section.content}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
