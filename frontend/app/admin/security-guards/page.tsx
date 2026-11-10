"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Inquiry = {
  id: number;
  full_name: string;
  organization: string | null;
  phone: string;
  email: string | null;
  guard_level: string;
  personnel_count: number;
  inquiry: string | null;
  consent_given: boolean;
  created_at: string;
};

type InquiryResponse = {
  items: Inquiry[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

function fetchInquiries(page: number) {
  return apiRequest<InquiryResponse>(
    `/admin/security-guards/inquiries?page=${page}&page_size=20`,
  );
}

export default function SecurityGuardInquiriesPage() {
  const [result, setResult] = useState<InquiryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    fetchInquiries(page)
      .then((response) => {
        if (active) setResult(response);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load security service inquiries.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, refreshKey]);

  function refresh() {
    setError("");
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  return (
    <main className="min-h-screen bg-[#080c16] px-4 py-8 text-white sm:px-7">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-cyan-200"
            >
              <ArrowLeft size={15} /> Back to Admin
            </Link>
            <p className="text-[11px] font-bold tracking-[.25em] text-cyan-300">
              APEXIVE AI · SERVICE INQUIRIES
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Security Guard Inquiries
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Review and follow up on Paladin Security Services requests.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10 disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {error && (
          <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
            {error}
          </p>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101727]">
          <div className="border-b border-white/10 px-5 py-4 text-sm text-slate-400">
            {result?.total ?? 0} {result?.total === 1 ? "inquiry" : "inquiries"}
          </div>
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-400">Loading inquiries…</p>
          ) : result?.items.length ? (
            <div className="divide-y divide-white/10">
              {result.items.map((item) => (
                <article key={item.id} className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_1.4fr]">
                  <div>
                    <h2 className="font-semibold">{item.full_name}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.organization || "Individual customer"}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>{item.phone}</p>
                    {item.email && <p className="mt-1 text-slate-400">{item.email}</p>}
                    <p className="mt-3 text-cyan-200">
                      Level {item.guard_level} · {item.personnel_count} guard{item.personnel_count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {item.inquiry || "No additional details provided."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-slate-400">
              {result ? "No service inquiries yet." : "Unable to load inquiries."}
            </p>
          )}
          {result && result.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => {
                  setLoading(true);
                  setPage((current) => Math.max(1, current - 1));
                }}
                className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-400">
                Page {result.page} of {result.total_pages}
              </span>
              <button
                type="button"
                disabled={page >= result.total_pages || loading}
                onClick={() => {
                  setLoading(true);
                  setPage((current) => Math.min(result.total_pages, current + 1));
                }}
                className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
