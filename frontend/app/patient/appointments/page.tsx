"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type FormState = {
  doctorId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

export default function PatientAppointmentsPage() {
  const [formData, setFormData] = useState<FormState>({
    doctorId: "", // DOCxxxxx or Mongo _id
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<null | { id: string; date: string; time: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessInfo(null);

    try {
      const payload = {
        doctorId: formData.doctorId,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.notes,
      };
      ;

      // <-- New: log payload to browser console so we can confirm what's being sent
      console.log("DEBUG payload about to be sent:", payload);

      const token = sessionStorage.getItem("token");

      const { data } = await axios.post(
         `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment submitted!");

      const appt = data?.appointment;
      setSuccessInfo({
        id: appt?.appointmentId || appt?._id,
        date: appt?.preferredDate,
        time: appt?.preferredTime,
      });

      setFormData({
        doctorId: "",
        preferredDate: "",
        preferredTime: "",
        notes: "",
      });
    } catch (err: any) {
      console.error("axios error full:", err);
      toast.error(err.response?.data?.message || "Failed to submit appointment.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Book Appointment</CardTitle>
          <CardDescription>Request an appointment with your preferred doctor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="doctorId">Doctor ID</Label>
                <Input
                  id="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  placeholder="DOC298880 or 6624ab..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input id="preferredDate" type="date" value={formData.preferredDate} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input id="preferredTime" type="time" value={formData.preferredTime} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes} onChange={handleChange} placeholder="Briefly describe your concern..." />
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>

            {successInfo && (
              <div className="mt-4 rounded-md border p-3 text-sm">
                <p className="font-medium">✅ Appointment booked</p>
                <p className="opacity-80">
                  ID: <span className="font-mono">{successInfo.id}</span> • {successInfo.date} at {successInfo.time}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
