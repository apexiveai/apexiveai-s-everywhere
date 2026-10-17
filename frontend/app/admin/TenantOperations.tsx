
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, fetchAllPages } from "@/lib/api";
import {
  ShieldCheck,
  KeyRound,
  Power,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

type Tenant = {
  id: number;
  company_name: string;
  tenant_code: string;
  status: string;
};

type Plan = {
  id: number;
  name: string;
  code: string;
  price_mmk: number;
  billing_cycle: string;
  minimum_months: number;
  is_active: boolean;
};

type Solution = {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
};

type LicenseResult = {
  license_key: string;
  expires_at: string;
  max_users: number;
  max_devices: number;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#080b15] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300";

const buttonClass =
  "flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-50";

function todayString() {
  return new Date().toLocaleDateString("en-CA");
}

function dateAfterMonths(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString("en-CA");
}

export default function TenantOperations() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [planId, setPlanId] = useState("");
  const [solutionId, setSolutionId] = useState("");
  const [subscriptionStart, setSubscriptionStart] = useState(todayString());
  const [subscriptionEnd, setSubscriptionEnd] = useState(dateAfterMonths(1));
  const [licenseExpiry, setLicenseExpiry] = useState(dateAfterMonths(12));
  const [maxUsers, setMaxUsers] = useState("5");
  const [maxDevices, setMaxDevices] = useState("5");
  const [granted, setGranted] = useState(true);
  const [accessExpiry, setAccessExpiry] = useState("");
  const [licenseResult, setLicenseResult] = useState<LicenseResult | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [tenantData, planData, solutionData] = await Promise.all([
        fetchAllPages<Tenant>("/admin/tenants"),
        fetchAllPages<Plan>("/admin/plans"),
        fetchAllPages<Solution>("/admin/solutions"),
      ]);

      setTenants(tenantData);
      setPlans(planData.filter((p) => p.is_active));
      setSolutions(solutionData.filter((s) => s.is_active));

      setTenantId((current) =>
        current && tenantData.some((t) => String(t.id) === current)
          ? current
          : tenantData[0]
            ? String(tenantData[0].id)
            : "",
      );

      setPlanId((current) =>
        current && planData.some((p) => String(p.id) === current && p.is_active)
          ? current
          : planData.find((p) => p.is_active)
            ? String(planData.find((p) => p.is_active)!.id)
            : "",
      );

      setSolutionId((current) =>
        current && solutionData.some((s) => String(s.id) === current && s.is_active)
          ? current
          : solutionData.find((s) => s.is_active)
            ? String(solutionData.find((s) => s.is_active)!.id)
            : "",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function runAction(
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    setBusy(true);
    setError("");
    setNotice("");
    setLicenseResult(null);

    try {
      await action();
      setNotice(successMessage);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const selectedTenant = tenants.find((t) => String(t.id) === tenantId);

  async function assignPlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tenantId || !planId) {
      setError("Company နဲ့ subscription plan ကို ရွေးပါ။");
      return;
    }

    if (subscriptionEnd < subscriptionStart) {
      setError("Subscription end date က start date ထက် မစောရပါ။");
      return;
    }

    await runAction(
      () =>
        apiRequest(`/admin/tenants/${tenantId}/subscription`, {
          method: "POST",
          body: JSON.stringify({
            plan_id: Number(planId),
            start_date: subscriptionStart,
            end_date: subscriptionEnd,
          }),
        }),
      "Subscription assignment request completed.",
    );
  }

  async function issueLicense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tenantId) {
      setError("Company ကို ရွေးပါ။");
      return;
    }

    if (licenseExpiry < todayString()) {
      setError("License expiry က ယနေ့ထက် စောမနေရပါ။");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    setLicenseResult(null);

    try {
      const result = await apiRequest<LicenseResult>(
        `/admin/tenants/${tenantId}/license`,
        {
          method: "POST",
          body: JSON.stringify({
            expires_at: licenseExpiry,
            max_users: Number(maxUsers),
            max_devices: Number(maxDevices),
            license_type: "SUBSCRIPTION",
          }),
        },
      );

      setLicenseResult(result);
      setNotice("License issued. Copy the key and store it securely.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "License issuance failed");
    } finally {
      setBusy(false);
    }
  }

  async function updateAccess() {
    if (!tenantId || !solutionId) {
      setError("Company နဲ့ solution ကို ရွေးပါ။");
      return;
    }

    await runAction(
      () =>
        apiRequest(
          `/admin/tenants/${tenantId}/solutions/${solutionId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              granted,
              expires_at: accessExpiry || null,
            }),
          },
        ),
      granted
        ? "Solution access grant request completed."
        : "Solution access revoke request completed.",
    );
  }

  async function updateTenantStatus() {
    if (!selectedTenant) return;

    const nextStatus =
      selectedTenant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    const confirmed = window.confirm(
      `${selectedTenant.company_name} ကို ${nextStatus} လုပ်မှာ သေချာပါသလား?`,
    );

    if (!confirmed) return;

    await runAction(
      () =>
        apiRequest(`/admin/tenants/${tenantId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus }),
        }),
      `Company status changed to ${nextStatus}.`,
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-cyan-200">
        <LoaderCircle className="animate-spin" />
        Loading tenant operations...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.25em] text-cyan-300">
            TENANT CONTROL / ACCESS GOVERNANCE
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Company Operations
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Subscription, software licenses and solution permissions
          </p>
        </div>

        <button className={buttonClass} onClick={() => void load()}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {notice && (
        <div role="status" className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm text-cyan-100">
          {notice}
        </div>
      )}

      <div className="rounded-2xl border border-cyan-300/20 bg-[#0d1120] p-5">
        <label className="mb-2 block text-sm text-slate-300">
          Select Company / Tenant
        </label>
        <select
          className={inputClass}
          value={tenantId}
          onChange={(e) => {
            setTenantId(e.target.value);
            setLicenseResult(null);
            setError("");
            setNotice("");
          }}
        >
          {tenants.length === 0 && <option value="">No companies found</option>}
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.company_name} — {t.tenant_code} ({t.status})
            </option>
          ))}
        </select>

        {selectedTenant && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{selectedTenant.company_name}</p>
              <p className="text-xs text-slate-400">
                Tenant ID: {selectedTenant.id}
              </p>
            </div>
            <button
              disabled={busy}
              onClick={() => void updateTenantStatus()}
              className={buttonClass}
            >
              <Power size={16} />
              {selectedTenant.status === "ACTIVE"
                ? "Suspend Company"
                : "Reactivate Company"}
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <form
          onSubmit={assignPlan}
          className="space-y-4 rounded-2xl border border-cyan-300/20 bg-[#0d1120] p-5"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyan-300" />
            <h3 className="text-lg font-bold">Assign Subscription</h3>
          </div>

          <label className="block text-sm text-slate-300">
            Subscription Plan
            <select
              className={`${inputClass} mt-2`}
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
            >
              <option value="">Choose a plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.price_mmk.toLocaleString()} MMK / {p.billing_cycle}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Start Date
              <input
                type="date"
                required
                className={`${inputClass} mt-2`}
                value={subscriptionStart}
                onChange={(e) => setSubscriptionStart(e.target.value)}
              />
            </label>
            <label className="text-sm text-slate-300">
              End Date
              <input
                type="date"
                required
                min={subscriptionStart}
                className={`${inputClass} mt-2`}
                value={subscriptionEnd}
                onChange={(e) => setSubscriptionEnd(e.target.value)}
              />
            </label>
          </div>

          <button
            disabled={busy || !tenantId || !planId}
            className={`${buttonClass} w-full`}
          >
            Assign Plan
          </button>
        </form>

        <form
          onSubmit={issueLicense}
          className="space-y-4 rounded-2xl border border-violet-300/20 bg-[#0d1120] p-5"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="text-violet-300" />
            <h3 className="text-lg font-bold">Issue Software License</h3>
          </div>

          <label className="block text-sm text-slate-300">
            License Expiry
            <input
              type="date"
              required
              min={todayString()}
              className={`${inputClass} mt-2`}
              value={licenseExpiry}
              onChange={(e) => setLicenseExpiry(e.target.value)}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Maximum Users
              <input
                type="number"
                min="1"
                max="100000"
                required
                className={`${inputClass} mt-2`}
                value={maxUsers}
                onChange={(e) => setMaxUsers(e.target.value)}
              />
            </label>
            <label className="text-sm text-slate-300">
              Maximum Devices
              <input
                type="number"
                min="1"
                max="100000"
                required
                className={`${inputClass} mt-2`}
                value={maxDevices}
                onChange={(e) => setMaxDevices(e.target.value)}
              />
            </label>
          </div>

          <button
            disabled={busy || !tenantId}
            className={`${buttonClass} w-full`}
          >
            Issue License
          </button>

          {licenseResult && (
            <div className="break-words rounded-xl border border-violet-300/30 bg-violet-300/5 p-4">
              <p className="text-sm font-semibold text-violet-200">
                Newly Issued License
              </p>
              <code className="mt-3 block select-all text-sm text-white">
                {licenseResult.license_key}
              </code>
              <p className="mt-2 text-xs text-slate-400">
                Expires: {String(licenseResult.expires_at).slice(0, 10)}
              </p>
              <button
                type="button"
                className={`${buttonClass} mt-3`}
                onClick={() => {
                  void navigator.clipboard.writeText(licenseResult.license_key);
                }}
              >
                Copy License Key
              </button>
            </div>
          )}
        </form>
      </div>

      <section className="rounded-2xl border border-cyan-300/20 bg-[#0d1120] p-5">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="text-cyan-300" />
          <div>
            <h3 className="text-lg font-bold">Solution Access Control</h3>
            <p className="text-sm text-slate-400">
              Grant or revoke one solution for the selected company.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Solution
            <select
              className={`${inputClass} mt-2`}
              value={solutionId}
              onChange={(e) => setSolutionId(e.target.value)}
            >
              <option value="">Choose a solution</option>
              {solutions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-300">
            Access Expiry (optional)
            <input
              type="date"
              min={todayString()}
              className={`${inputClass} mt-2`}
              value={accessExpiry}
              onChange={(e) => setAccessExpiry(e.target.value)}
            />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={granted}
            onChange={(e) => setGranted(e.target.checked)}
            className="h-4 w-4 accent-cyan-300"
          />
          Grant access to this solution
        </label>

        <button
          disabled={busy || !tenantId || !solutionId}
          onClick={() => void updateAccess()}
          className={`${buttonClass} mt-5 w-full`}
        >
          {granted ? "Grant Solution Access" : "Revoke Solution Access"}
        </button>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Security note: these controls call protected APIs. Before production,
        verify subscription and license enforcement in every solution backend.
        A granted permission alone must not bypass expired subscriptions,
        expired licenses or suspended tenant status.
      </p>
    </section>
  );
}
