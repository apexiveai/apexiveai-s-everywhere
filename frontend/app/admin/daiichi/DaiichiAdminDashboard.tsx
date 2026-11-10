
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  LoaderCircle,
  RefreshCw,
  Search,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

type Analytics = {
  total_leads: number;
  new_leads: number;
  converted_leads: number;
  conversion_rate: number;
  today_page_views: number;
  today_cta_clicks: number;
  weekly_page_views: number;
  weekly_cta_clicks: number;
  status_counts: Record<string, number>;
};

type Lead = {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  inquiry: string | null;
  consent_given: boolean;
  consent_text_version: string;
  consent_at: string;
  status: string;
  admin_note: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};

type LeadResponse = {
  items: Lead[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

type LeadStatusHistory = {
  id: number;
  lead_id: number;
  actor_user_id: number | null;
  from_status: string;
  to_status: string;
  created_at: string;
};

const STATUSES = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "QUALIFIED",
  "REFERRED",
  "CONVERTED",
  "CLOSED_LOST",
] as const;

const statusStyles: Record<string, string> = {
  NEW: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  CONTACTED: "border-blue-300/20 bg-blue-300/10 text-blue-200",
  FOLLOW_UP: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  QUALIFIED: "border-violet-300/20 bg-violet-300/10 text-violet-200",
  REFERRED: "border-indigo-300/20 bg-indigo-300/10 text-indigo-200",
  CONVERTED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  CLOSED_LOST: "border-red-300/20 bg-red-300/10 text-red-200",
};

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Users;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101727] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="rounded-xl border border-cyan-300/15 bg-cyan-300/5 p-2 text-cyan-200">
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

export default function DaiichiAdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [result, setResult] = useState<LeadResponse | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadHistory, setLeadHistory] = useState<LeadStatusHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [note, setNote] = useState("");
  const [nextStatus, setNextStatus] = useState("CONTACTED");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });

      if (status) params.set("status", status);
      if (search.trim()) params.set("search", search.trim());

      const [a, leads] = await Promise.all([
        apiRequest<Analytics>("/admin/daiichi/analytics"),
        apiRequest<LeadResponse>(
          `/admin/daiichi/leads?${params.toString()}`,
        ),
      ]);

      setAnalytics(a);
      setResult(leads);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load Daiichi dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function loadLeadHistory(leadId: number) {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const history = await apiRequest<LeadStatusHistory[]>(
        `/admin/daiichi/leads/${leadId}/history`,
      );
      setLeadHistory(history);
    } catch (e) {
      setHistoryError(
        e instanceof Error ? e.message : "Unable to load lead status history.",
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setNote(lead.admin_note || "");
    setNextStatus(lead.status);
    setLeadHistory([]);
    setNotice("");
    void loadLeadHistory(lead.id);
  }

  async function updateLead() {
    if (!selectedLead) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const updated = await apiRequest<Lead>(
        `/admin/daiichi/leads/${selectedLead.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: nextStatus,
            admin_note: note.trim() || null,
          }),
        },
      );

      setSelectedLead(updated);
      setNotice("Lead record updated successfully.");
      await loadLeadHistory(selectedLead.id);
      await loadDashboard();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to update lead record.",
      );
    } finally {
      setSaving(false);
    }
  }

  function changePage(nextPage: number) {
    setPage(Math.max(1, nextPage));
  }

  return (
    <main className="min-h-screen bg-[#080c16] px-4 py-8 text-white sm:px-7">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-cyan-200"
            >
              <ArrowLeft size={15} />
              Back to Admin
            </Link>

            <p className="text-[11px] font-bold tracking-[.25em] text-cyan-300">
              APEXIVE AI · PARTNER OPERATIONS
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Daiichi Life Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Campaign performance and customer inquiry management.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-cyan-300/40 hover:text-cyan-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-300/20 bg-red-300/5 p-4 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-200">
            {notice}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Leads"
            value={analytics?.total_leads ?? "—"}
            detail={`${analytics?.new_leads ?? 0} new inquiries`}
            icon={Users}
          />
          <MetricCard
            label="Page Views Today"
            value={analytics?.today_page_views ?? "—"}
            detail={`${analytics?.weekly_page_views ?? 0} in the last 7 days`}
            icon={Eye}
          />
          <MetricCard
            label="CTA Clicks Today"
            value={analytics?.today_cta_clicks ?? "—"}
            detail={`${analytics?.weekly_cta_clicks ?? 0} in the last 7 days`}
            icon={Activity}
          />
          <MetricCard
            label="Lead Conversion"
            value={
              analytics ? `${analytics.conversion_rate.toFixed(2)}%` : "—"
            }
            detail={`${analytics?.converted_leads ?? 0} converted leads`}
            icon={BarChart3}
          />
        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-[#101727] p-5">
          <div className="mb-5 flex items-center gap-2">
            <Clock3 size={18} className="text-cyan-200" />
            <h2 className="font-semibold">Lead Pipeline</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {STATUSES.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  setStatus(item);
                  setPage(1);
                }}
                className={`rounded-xl border p-4 text-left transition ${
                  status === item
                    ? "border-cyan-300/40 bg-cyan-300/10"
                    : "border-white/10 bg-black/10 hover:border-white/20"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider text-slate-400">
                  {item}
                </span>
                <span className="mt-2 block text-2xl font-bold">
                  {analytics?.status_counts?.[item] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#101727] p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Customer Inquiries</h2>
              <p className="mt-1 text-xs text-slate-400">
                Personal information is visible to authorized administrators.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, phone, email"
                  className="w-full rounded-xl border border-white/10 bg-[#080c16] py-3 pl-9 pr-3 text-sm outline-none focus:border-cyan-300/50"
                />
              </label>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-white/10 bg-[#080c16] px-3 py-3 text-sm outline-none focus:border-cyan-300/50"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && !result ? (
            <div className="flex min-h-48 items-center justify-center text-slate-400">
              <LoaderCircle className="mr-3 animate-spin" size={20} />
              Loading customer inquiries...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="text-xs text-slate-400">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Consent</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result?.items.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-white/5 transition hover:bg-white/[.02]"
                      >
                        <td className="p-3">
                          <div className="font-semibold">{lead.full_name}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            Lead #{lead.id}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>{lead.phone}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {lead.email || "No email"}
                          </div>
                        </td>
                        <td className="p-3 text-xs text-slate-400">
                          {new Date(lead.created_at).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
                              statusStyles[lead.status] ||
                              "border-white/10 text-slate-300"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs">
                          {lead.consent_given ? (
                            <span className="text-emerald-300">
                              <CheckCircle2
                                size={14}
                                className="mr-1 inline"
                              />
                              Recorded
                            </span>
                          ) : (
                            <span className="text-red-300">Not recorded</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => openLead(lead)}
                            className="rounded-lg border border-cyan-300/20 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/10"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}

                    {(!result || result.items.length === 0) && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-10 text-center text-slate-500"
                        >
                          No customer inquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-xs text-slate-400">
                  {result?.total ?? 0} total records · Page {result?.page ?? 1}{" "}
                  of {result?.total_pages ?? 0}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!result || page <= 1 || loading}
                    onClick={() => changePage(page - 1)}
                    className="rounded-lg border border-white/10 p-2 disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    type="button"
                    disabled={
                      !result ||
                      page >= result.total_pages ||
                      loading
                    }
                    onClick={() => changePage(page + 1)}
                    className="rounded-lg border border-white/10 p-2 disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-dialog-title"
            className="my-8 w-full max-w-2xl rounded-2xl border border-cyan-300/20 bg-[#101727] p-6 shadow-2xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-widest text-cyan-300">
                  CUSTOMER INQUIRY · #{selectedLead.id}
                </p>
                <h2
                  id="lead-dialog-title"
                  className="mt-2 text-2xl font-bold"
                >
                  {selectedLead.full_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="mt-2 font-semibold">{selectedLead.phone}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-2 break-all font-semibold">
                  {selectedLead.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs text-slate-500">Inquiry</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {selectedLead.inquiry || "No additional message."}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4 text-xs leading-6 text-slate-400">
              <p>Consent: {selectedLead.consent_given ? "Yes" : "No"}</p>
              <p>Consent version: {selectedLead.consent_text_version}</p>
              <p>
                Consent time: {new Date(selectedLead.consent_at).toLocaleString()}
              </p>
              <p>Source: {selectedLead.source}</p>
            </div>

            <section className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">
              <h3 className="text-sm font-semibold">Status History</h3>
              {historyError ? (
                <p role="alert" className="mt-3 text-xs text-red-200">
                  {historyError}
                </p>
              ) : historyLoading ? (
                <p className="mt-3 text-xs text-slate-400">
                  Loading status history...
                </p>
              ) : leadHistory.length ? (
                <ol className="mt-3 space-y-3">
                  {leadHistory.map((entry) => (
                    <li
                      key={entry.id}
                      className="border-l border-cyan-300/30 pl-3 text-xs"
                    >
                      <p className="text-slate-200">
                        {entry.from_status} → {entry.to_status}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {new Date(entry.created_at).toLocaleString()}
                        {entry.actor_user_id
                          ? ` · Admin #${entry.actor_user_id}`
                          : ""}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-xs text-slate-400">
                  No status changes recorded.
                </p>
              )}
            </section>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-300">
                Lead Status
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#080c16] px-3 py-3 text-white outline-none focus:border-cyan-300/50"
                >
                  {STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Admin Note
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={3000}
                  placeholder="Internal follow-up note"
                  className="rounded-xl border border-white/10 bg-[#080c16] px-3 py-3 text-white outline-none focus:border-cyan-300/50"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => void updateLead()}
              disabled={saving}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {saving ? "Saving..." : "Save Lead Update"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
