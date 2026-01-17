"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// Match backend Notification model
type Notification = {
  _id: string;
  userId: string;
  senderName?: string;
  message: string;
  type: "access" | "system";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  relatedRequestId?: string; // may exist for access requests
};

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get token from sessionStorage on client
  useEffect(() => {
    const t = sessionStorage.getItem("token");
    setToken(t);
  }, []);

  // Fetch notifications once token is available
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
          <CardDescription>Updates about your access requests and system events</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

          {!loading && notifications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No notifications yet.
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`rounded-lg border p-3 space-y-1 ${
                n.read ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {n.senderName || "System"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {n.message}
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={n.read}               // disable after read
                  onClick={() => markAsRead(n._id)}
                >
                  {n.read ? "Read" : "Mark as Read"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteNotification(n._id)}
                >
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
