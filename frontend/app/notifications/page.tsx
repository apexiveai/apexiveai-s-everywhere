"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ items: NotificationItem[] }>("/notifications");
      setItems(result.items);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function markRead(id: number) {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
      setItems((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update notification.");
    }
  }

  async function markAllRead() {
    try {
      await apiRequest("/notifications/read-all", { method: "POST" });
      setItems((current) => current.map((item) => ({ ...item, is_read: true })));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update notifications.");
    }
  }

  return (
    <main className="notifications-page">
      <header className="billing-heading">
        <div><span className="ac-eyebrow">Account updates</span><h1>Notifications</h1><p>Invoices, payment checks, messages, and product access updates.</p></div>
        <button type="button" className="billing-refresh" onClick={() => void markAllRead()}><CheckCheck size={16} /> Mark all read</button>
      </header>
      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {loading ? <div className="billing-loading"><LoaderCircle className="animate-spin" /> Loading notifications…</div> : items.length ? (
        <div className="notification-list">
          {items.map((item) => (
            <article key={item.id} className={item.is_read ? "" : "is-unread"}>
              <span className="notification-bell"><Bell size={17} /></span>
              <div><strong>{item.title}</strong><p>{item.body}</p><small>{item.type.replaceAll("_", " ")} · {new Date(item.created_at).toLocaleString()}</small></div>
              {!item.is_read && <button type="button" onClick={() => void markRead(item.id)}>Mark read</button>}
            </article>
          ))}
        </div>
      ) : <div className="invoice-empty">No notifications yet.</div>}
    </main>
  );
}
