"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock3, LoaderCircle } from "lucide-react";
import { fetchAllPages } from "@/lib/api";

type AuditEvent = {
  id: number;
  actor_id: number | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export default function TenantHistoryPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAllPages<AuditEvent>("/history");
      setEvents(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load account history.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  return (
    <main className="history-page">
      <span className="ac-eyebrow">Tenant account</span>
      <h1>Account history</h1>
      <p>Activity is recorded per user and tenant account.</p>
      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {loading ? <div className="billing-loading"><LoaderCircle className="animate-spin" /> Loading history…</div> : events.length ? (
        <ol className="history-list">
          {events.map((event) => (
            <li key={event.id}>
              <Clock3 size={17} />
              <div><strong>{event.action.replaceAll("_", " ")}</strong><p>{event.entity_type}{event.entity_id ? ` #${event.entity_id}` : ""}{event.details ? ` · ${JSON.stringify(event.details)}` : ""}</p><small>{new Date(event.created_at).toLocaleString()} · User ID {event.actor_id ?? "system"}</small></div>
            </li>
          ))}
        </ol>
      ) : <div className="invoice-empty">No history has been recorded yet.</div>}
    </main>
  );
}
