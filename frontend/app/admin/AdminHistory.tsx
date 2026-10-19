"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { fetchAllPages } from "@/lib/api";

type Tenant = { id: number; company_name: string };
type Event = {
  id: number;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export default function AdminHistory() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllPages<Tenant>("/admin/tenants")
      .then((data) => {
        setTenants(data);
        setTenantId(data[0] ? String(data[0].id) : "");
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to load tenants."));
  }, []);

  const load = useCallback(async () => {
    if (!tenantId) {
      setEvents([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await fetchAllPages<Event>(`/admin/tenants/${tenantId}/history`);
      setEvents(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load tenant history.");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  return (
    <section className="admin-history">
      <header className="billing-heading">
        <div><span className="ac-eyebrow">SuperAdmin audit view</span><h2>Tenant account history</h2><p>Review actions and payment, invoice, access, sign-in, and messaging events by user.</p></div>
        <button type="button" className="billing-refresh" onClick={() => void load()}><RefreshCw size={16} /> Refresh</button>
      </header>
      <label className="history-tenant-picker">Tenant
        <select value={tenantId} onChange={(event) => setTenantId(event.target.value)}>
          {tenants.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.company_name}</option>)}
        </select>
      </label>
      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {loading ? <div className="billing-loading"><LoaderCircle className="animate-spin" /> Loading history…</div> : events.length ? (
        <ol className="history-list">
          {events.map((event) => (
            <li key={event.id}>
              <div><strong>{event.action.replaceAll("_", " ")}</strong><p>{event.actor_name} · {event.entity_type}{event.entity_id ? ` #${event.entity_id}` : ""}{event.details ? ` · ${JSON.stringify(event.details)}` : ""}</p><small>{new Date(event.created_at).toLocaleString()}</small></div>
            </li>
          ))}
        </ol>
      ) : <div className="invoice-empty">No history for this tenant yet.</div>}
    </section>
  );
}
