"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  Building2,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LoaderCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { apiRequest, type PaginatedResponse } from "@/lib/api";
import TenantOperations from "./TenantOperations";
import AdminInvoices from "./AdminInvoices";
import AdminHistory from "./AdminHistory";
import MarketplaceAccounts from "./MarketplaceAccounts";

type Overview = {
  tenants: number;
  active_tenants: number;
  plans: number;
  solutions: number;
  licenses: number;
};

type Tenant = {
  id: number;
  company_name: string;
  tenant_code: string;
  status: string;
  contact_email?: string;
};

type Plan = {
  id: number;
  code: string;
  name: string;
  billing_cycle: string;
  price_mmk: number;
  minimum_months: number;
  is_active: boolean;
};

type Solution = {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
};

type Tab = "Overview" | "Companies" | "Plans" | "Solutions" | "Operations" | "Marketplace Accounts" | "Invoices" | "History";

function PaginationControls({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm"
    >
      <div className="flex flex-wrap items-center gap-3 text-slate-400">
        <span>
          Showing {start}–{end} of {total}
        </span>
        <label className="flex items-center gap-2">
          Per page
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-white/10 bg-[#080b15] px-2 py-1.5 text-white"
            aria-label="Items per page"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((number, index) => (
          <span key={number} className="flex items-center gap-1">
            {index > 0 && pages[index - 1] !== number - 1 && (
              <span className="px-1 text-slate-500" aria-hidden="true">
                …
              </span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(number)}
              aria-current={page === number ? "page" : undefined}
              className={`min-w-9 rounded-lg border px-2.5 py-1.5 transition ${
                page === number
                  ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                  : "border-white/10 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100"
              }`}
            >
              {number}
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const hasLoaded = useRef(false);
  const requestVersion = useRef(0);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [tenantPagination, setTenantPagination] =
    useState<PaginatedResponse<Tenant> | null>(null);
  const [planPagination, setPlanPagination] =
    useState<PaginatedResponse<Plan> | null>(null);
  const [solutionPagination, setSolutionPagination] =
    useState<PaginatedResponse<Solution> | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"tenant" | "plan" | "solution" | null>(
    null,
  );

  const [company, setCompany] = useState({
    company_name: "",
    tenant_code: "",
    admin_username: "",
    admin_email: "",
    temporary_password: "",
    contact_phone: "",
  });

  const [plan, setPlan] = useState({
    code: "",
    name: "",
    billing_cycle: "MONTHLY",
    price_mmk: "0",
    minimum_months: "1",
  });

  const [solution, setSolution] = useState({
    code: "",
    name: "",
    description: "",
    api_url: "",
  });

  const loadData = useCallback(async () => {
    const currentRequest = ++requestVersion.current;
    setLoading(!hasLoaded.current);
    setError("");

    try {
      const [o, t, p, s] = await Promise.all([
        apiRequest<Overview>("/admin/overview"),
        apiRequest<PaginatedResponse<Tenant>>(
          `/admin/tenants?page=${page}&page_size=${pageSize}`,
        ),
        apiRequest<PaginatedResponse<Plan>>(
          `/admin/plans?page=${page}&page_size=${pageSize}`,
        ),
        apiRequest<PaginatedResponse<Solution>>(
          `/admin/solutions?page=${page}&page_size=${pageSize}`,
        ),
      ]);

      if (currentRequest !== requestVersion.current) return;

      setOverview(o);
      setTenants(t.items);
      setPlans(p.items);
      setSolutions(s.items);
      setTenantPagination(t);
      setPlanPagination(p);
      setSolutionPagination(s);
      hasLoaded.current = true;
    } catch (e) {
      if (currentRequest !== requestVersion.current) return;

      const message = e instanceof Error ? e.message : "Request failed";
      setError(
        message === "ADMIN_ACCESS_REQUIRED"
          ? "Super Admin permission မရှိပါ။"
          : message,
      );
    } finally {
      if (currentRequest === requestVersion.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!modal) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      if (modal === "tenant") {
        await apiRequest("/admin/tenants", {
          method: "POST",
          body: JSON.stringify(company),
        });
        setNotice("Company account created.");
        setCompany({
          company_name: "",
          tenant_code: "",
          admin_username: "",
          admin_email: "",
          temporary_password: "",
          contact_phone: "",
        });
      }

      if (modal === "plan") {
        await apiRequest("/admin/plans", {
          method: "POST",
          body: JSON.stringify({
            ...plan,
            price_mmk: Number(plan.price_mmk),
            minimum_months: Number(plan.minimum_months),
          }),
        });
        setNotice("Subscription plan created.");
        setPlan({
          code: "",
          name: "",
          billing_cycle: "MONTHLY",
          price_mmk: "0",
          minimum_months: "1",
        });
      }

      if (modal === "solution") {
        await apiRequest("/admin/solutions", {
          method: "POST",
          body: JSON.stringify({
            ...solution,
            api_url: solution.api_url || null,
          }),
        });
        setNotice("Solution added to the catalog.");
        setSolution({
          code: "",
          name: "",
          description: "",
          api_url: "",
        });
      }

      setModal(null);
      await loadData();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Request failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  const stats = [
    { label: "Total Companies", value: overview?.tenants ?? "—", icon: Building2 },
    { label: "Active Companies", value: overview?.active_tenants ?? "—", icon: Users },
    { label: "Subscription Plans", value: overview?.plans ?? "—", icon: CreditCard },
    { label: "Registered Solutions", value: overview?.solutions ?? "—", icon: Boxes },
    { label: "Active Licenses", value: overview?.licenses ?? "—", icon: ShieldCheck },
  ];

  return (
    <main className="admin-console min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(0,229,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,.06)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="relative w-full p-4 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-400/20 pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs tracking-[0.3em] text-cyan-300">
              <Activity size={15} /> APEXIVEAI / CONTROL CENTER
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              SUPER <span className="text-cyan-300">ADMIN</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Apexive operations · Tenant & License Management
            </p>
          </div>

          <button
            onClick={() => void loadData()}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-200 hover:bg-cyan-400/10"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {(["Overview", "Companies", "Plans", "Solutions", "Operations", "Marketplace Accounts", "Invoices", "History"] as Tab[]).map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setTab(item);
                  setPage(1);
                }}
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  tab === item
                    ? "border-cyan-300 bg-cyan-300/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-cyan-300/30"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </nav>

        {error && (
<div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">

            {error}

          </div>

        )}

        {notice && (

          <div className="mb-5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">

            {notice}

          </div>

        )}

        {loading ? (

          <div className="flex items-center gap-3 py-20 text-cyan-200">

            <LoaderCircle className="animate-spin" /> Loading control center...

          </div>

        ) : (

          <>

            {tab === "Overview" && (

              <>

                <div className="mb-6">

                  <p className="text-sm text-slate-400">

                    SYSTEM STATUS / LIVE API DATA

                  </p>

                  <h2 className="mt-1 text-2xl font-bold">Operations Overview</h2>

                </div>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                  {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (

                      <article

                        key={stat.label}

                        className="rounded-2xl border border-cyan-300/15 bg-[#0d1120]/90 p-5 shadow-[0_0_30px_rgba(0,229,255,.04)]"

                      >

                        <div className="mb-5 flex items-center justify-between">

                          <span className="text-sm text-slate-400">

                            {stat.label}

                          </span>

                          <Icon className="text-cyan-300" size={20} />

                        </div>

                        <div className="text-3xl font-bold">

                          {stat.value}

                        </div>

                      </article>

                    );

                  })}

                </section>

                <section className="mt-8 rounded-2xl border border-violet-400/20 bg-[#0d1120]/90 p-6">

                  <p className="text-xs tracking-[0.25em] text-violet-300">

                    ADMIN WORKFLOW

                  </p>

                  <h3 className="mt-3 text-xl font-semibold">

                    Company → Subscription → License → Solution Access

                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">

                    Company account ဖန်တီးပြီး plan, license နဲ့ product

                    permission တွေကို သတ်မှတ်ပါ။ Product access ကို Backend

                    က စစ်ဆေးရမယ်။

                  </p>

                </section>

              </>

            )}

            {tab === "Companies" && (

              <section className="rounded-2xl border border-cyan-300/15 bg-[#0d1120]/90 p-5">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                  <h2 className="text-xl font-bold">Company Accounts</h2>

                  <button

                    onClick={() => setModal("tenant")}

                    className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200"

                  >

                    <Plus size={17} /> Create Company

                  </button>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[650px] text-left text-sm">

                    <thead className="text-slate-400">

                      <tr>

                        <th className="p-3">Company</th>

                        <th className="p-3">Tenant Code</th>

                        <th className="p-3">Status</th>

                        <th className="p-3">Email</th>

                      </tr>

                    </thead>

                    <tbody>

                      {tenants.map((t) => (

                        <tr key={t.id} className="border-t border-white/5">

                          <td className="p-3 font-medium">{t.company_name}</td>

                          <td className="p-3 text-cyan-200">{t.tenant_code}</td>

                          <td className="p-3">{t.status}</td>

                          <td className="p-3 text-slate-400">

                            {t.contact_email || "—"}

                          </td>

                        </tr>
                        ))}

                      {tenants.length === 0 && (

                        <tr>

                          <td colSpan={4} className="p-8 text-center text-slate-500">

                            No company accounts found.

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

                {tenantPagination && (
                  <PaginationControls
                    page={tenantPagination.page}
                    pageSize={tenantPagination.page_size}
                    total={tenantPagination.total}
                    totalPages={tenantPagination.total_pages}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                )}

              </section>

            )}

            {tab === "Plans" && (

              <section className="rounded-2xl border border-cyan-300/15 bg-[#0d1120]/90 p-5">

                <div className="mb-5 flex items-center justify-between gap-3">

                  <h2 className="text-xl font-bold">Subscription Plans</h2>

                  <button

                    onClick={() => setModal("plan")}

                    className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"

                  >

                    <Plus size={17} /> Add Plan

                  </button>

                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {plans.map((p) => (

                    <article key={p.id} className="rounded-xl border border-white/10 p-5">

                      <div className="text-xs text-cyan-300">{p.code}</div>

                      <h3 className="mt-2 text-lg font-bold">{p.name}</h3>

                      <p className="mt-3 text-2xl font-bold">

                        {p.price_mmk.toLocaleString()} <span className="text-sm text-slate-400">MMK</span>

                      </p>

                      <p className="mt-2 text-sm text-slate-400">

                        {p.billing_cycle} · Minimum {p.minimum_months} months

                      </p>

                    </article>

                  ))}

                  {plans.length === 0 && (

                    <p className="text-sm text-slate-400">No plans found.</p>

                  )}

                </div>

                {planPagination && (
                  <PaginationControls
                    page={planPagination.page}
                    pageSize={planPagination.page_size}
                    total={planPagination.total}
                    totalPages={planPagination.total_pages}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                )}

              </section>

            )}

            {tab === "Solutions" && (

              <section className="rounded-2xl border border-cyan-300/15 bg-[#0d1120]/90 p-5">

                <div className="mb-5 flex items-center justify-between gap-3">

                  <h2 className="text-xl font-bold">Solution Catalog</h2>

                  <button

                    onClick={() => setModal("solution")}

                    className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"

                  >

                    <Plus size={17} /> Add Solution

                  </button>

                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {solutions.map((s) => (

                    <article key={s.id} className="rounded-xl border border-white/10 p-5">

                      <div className="flex items-start justify-between gap-3">

                        <Boxes className="text-cyan-300" />

                        <span className="text-xs text-slate-400">

                          {s.is_active ? "ACTIVE" : "DISABLED"}

                        </span>

                      </div>

                      <h3 className="mt-4 font-bold">{s.name}</h3>

                      <p className="mt-1 text-xs text-cyan-200">{s.code}</p>

                      <p className="mt-3 text-sm text-slate-400">

                        {s.description || "No description provided."}

                      </p>

                    </article>

                  ))}

                  {solutions.length === 0 && (

                    <p className="text-sm text-slate-400">No solutions registered.</p>

                  )}

                </div>

                {solutionPagination && (
                  <PaginationControls
                    page={solutionPagination.page}
                    pageSize={solutionPagination.page_size}
                    total={solutionPagination.total}
                    totalPages={solutionPagination.total_pages}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                )}

              </section>

            )}
            
            {tab === "Operations" && <TenantOperations />}
            {tab === "Marketplace Accounts" && <MarketplaceAccounts />}
            {tab === "Invoices" && <AdminInvoices />}
            {tab === "History" && <AdminHistory />}

          </>

        )}

      </div>

      {modal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">

          <form

            onSubmit={submitForm}

            className="my-8 w-full max-w-2xl rounded-2xl border border-cyan-300/25 bg-[#0b1020] p-6 shadow-[0_0_60px_rgba(0,229,255,.08)]"

          >

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">

                {modal === "tenant"

                  ? "Create Company Account"

                  : modal === "plan"

                    ? "Create Subscription Plan"

                    : "Register New Solution"}

              </h2>

              <button

                type="button"

                onClick={() => setModal(null)}

                className="text-slate-400 hover:text-white"

                aria-label="Close dialog"

              >

                <X />

              </button>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {modal === "tenant" &&

                (

                  [

                    ["company_name", "Company Name"],

                    ["tenant_code", "Tenant Code"],

                    ["admin_username", "Admin Username"],

                    ["admin_email", "Admin Email"],

                    ["temporary_password", "Temporary Password"],

                    ["contact_phone", "Contact Phone"],

                  ] as const

                ).map(([key, label]) => (

                  <label key={key} className="grid gap-2 text-sm text-slate-300">

                    {label}

                    <input

                      required={key !== "contact_phone"}

                      type={
                        key === "admin_email"
                          ? "email"
                          : key === "temporary_password"
                            ? "password"
                            : "text"
                      }
                      autoCapitalize={key === "temporary_password" ? "none" : undefined}
                      autoCorrect={key === "temporary_password" ? "off" : undefined}
                      minLength={key === "temporary_password" ? 12 : undefined}

                      value={company[key]}

                      onChange={(e) =>

                        setCompany({ ...company, [key]: e.target.value })

                      }

                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none focus:border-cyan-300"

                    />

                  </label>

                ))}

              {modal === "plan" && (

                <>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Plan Code

                    <input required value={plan.code} onChange={(e) => setPlan({ ...plan, code: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Plan Name

                    <input required value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Billing Cycle

                    <select value={plan.billing_cycle} onChange={(e) => setPlan({ ...plan, billing_cycle: e.target.value })} className="rounded-xl border border-white/10 bg-[#0b1020] px-3 py-3">

                      <option value="MONTHLY">Monthly</option>

                      <option value="YEARLY">Yearly</option>

                    </select>

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Price (MMK)

                    <input required type="number" min="0" value={plan.price_mmk} onChange={(e) => setPlan({ ...plan, price_mmk: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Minimum Months

                    <input required type="number" min="1" max="120" value={plan.minimum_months} onChange={(e) => setPlan({ ...plan, minimum_months: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                </>

              )}

              {modal === "solution" && (

                <>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Solution Code

                    <input required value={solution.code} onChange={(e) => setSolution({ ...solution, code: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300">

                    Solution Name

                    <input required value={solution.name} onChange={(e) => setSolution({ ...solution, name: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">

                    Description

                    <textarea value={solution.description} onChange={(e) => setSolution({ ...solution, description: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" rows={3} />

                  </label>

                  <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">

                    API URL (optional)

                    <input type="url" value={solution.api_url} onChange={(e) => setSolution({ ...solution, api_url: e.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3" />

                  </label>

                </>

              )}

            </div>

            <button

              disabled={busy}

              type="submit"

              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"

            >

              {busy && <LoaderCircle size={17} className="animate-spin" />}

              {busy ? "Saving..." : "Save"}

            </button>

          </form>

        </div>

      )}

    </main>

  );

}