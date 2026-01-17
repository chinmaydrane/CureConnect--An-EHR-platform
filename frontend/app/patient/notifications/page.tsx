"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// 🧠 Define Notification type
interface Notification {
  _id: string;
  userId: string;
  senderName?: string;
  message: string;
  type: "access" | "system";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  relatedRequestId?: string;   // ⭐ NEW
}



export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Fetch token once and then notifications when token changes
  useEffect(() => {
    const t = sessionStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]); // 👈 runs only after token is available

  // ✅ Fetch notifications for the logged-in patient
  const fetchNotifications = async () => {
    try {
      if (!token) return;

      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };


  // ✅ Accept or Reject Access
  const handleResponse = async (requestId: string, response: "accepted" | "rejected") => {
    try {
      await api.post(
        "/access/respond",
        { requestId, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Access ${response}`);
      fetchNotifications();   // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update access request");
    }
  };


  // ✅ Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // ✅ Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your access requests</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {notifications.length === 0 && (
            <p className="text-gray-500 text-center">No notifications yet.</p>
          )}

          {notifications.map((n) => (
            <div key={n._id} className="border rounded-lg p-3 space-y-2">
              <div className="text-sm text-gray-600">
                {new Date(n.createdAt).toLocaleString()}
              </div>
              <div className="font-medium">{n.senderName || "System"}</div>
              <div>{n.message}</div>

              {n.type === "access" && n.relatedRequestId && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    disabled={n.read}
                    onClick={() => handleResponse(n.relatedRequestId!, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={n.read}
                    onClick={() => handleResponse(n.relatedRequestId!, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}



              <div className="flex gap-2 mt-2">
                {/* <Button variant="outline" size="sm" onClick={() => markAsRead(n._id)}>
                  Mark as Read
                </Button> */}
                <Button variant="ghost" size="sm" onClick={() => deleteNotification(n._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
