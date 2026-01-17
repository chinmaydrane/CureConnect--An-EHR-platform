"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function AdminProfilePage() {
  const [adminData, setAdminData] = useState<any>({
    name: "",
    hospitalName: "",
    designation: "",
    phone: "",
    email: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Get token safely
  useEffect(() => {
    const t = sessionStorage.getItem("token")
    if (t) setToken(t)
  }, [])

  // Fetch admin profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await api.get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminData(res.data);
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/admin/profile", adminData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminData(res.data);
      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Edit your hospital and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {Object.entries(adminData)
              .filter(([key]) => !["_id", "createdAt", "updatedAt", "__v", "user"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="grid gap-1">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <Input
                    name={key}
                    value={value as any}
                    onChange={handleChange}
                    type={key === "phone" ? "tel" : "text"}
                    required={key !== "address"}   // make address optional   // prevent editing email
                  />
                </div>
              ))}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
          {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
