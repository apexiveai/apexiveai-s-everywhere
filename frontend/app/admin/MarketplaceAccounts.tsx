"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  apiRequest,
  fetchAllPages,
  getBearerTokenHeader,
} from "@/lib/api";

type Tenant = {
  id: number;
  company_name: string;
  status: string;
};

type Solution = {
  code: string;
  api_url: string | null;
  is_active: boolean;
};

type CommunityUser = {
  id: number;
  username: string;
  email: string;
  role: "SELLER" | "BUYER";
  tenant_id: number;
};

type AccountForm = {
  tenant_id: string;
  role: "SELLER" | "BUYER";
  username: string;
  email: string;
  temporary_password: string;
  seller_code: string;
  shop_name: string;
  description: string;
  commission_rate: string;
  buyer_code: string;
  display_name: string;
};

type PendingProvision = {
  user: CommunityUser;
  tenant: Tenant;
  form: AccountForm;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#080b15] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300";

function marketplaceApiBase(apiUrl: string) {
  const base = apiUrl.trim().replace(/\/+$/, "");
  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;
  return `${base}/api/v1`;
}

export default function MarketplaceAccounts() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [form, setForm] = useState<AccountForm>({
    tenant_id: "",
    role: "SELLER",
    username: "",
    email: "",
    temporary_password: "",
    seller_code: "",
    shop_name: "",
    description: "",
    commission_rate: "10",
    buyer_code: "",
    display_name: "",
  });
  const [pending, setPending] = useState<PendingProvision | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void Promise.all([
      fetchAllPages<Tenant>("/admin/tenants"),
      fetchAllPages<Solution>("/admin/solutions"),
    ])
      .then(([items, solutions]) => {
        const active = items.filter((tenant) => tenant.status === "ACTIVE");
        const marketplace = solutions.find(
          (solution) =>
            solution.code.trim().toUpperCase() === "MULTI_VENDOR_MARKETPLACE" &&
            solution.is_active,
        );
        setApiUrl(marketplace?.api_url ?? null);
        setTenants(active);
        setForm((current) => ({
          ...current,
          tenant_id:
            current.tenant_id &&
            active.some((tenant) => String(tenant.id) === current.tenant_id)
              ? current.tenant_id
              : String(active[0]?.id ?? ""),
        }));
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Unable to load companies.");
      });
  }, []);

  async function linkMarketplaceProfile(account: PendingProvision) {
    if (!apiUrl) {
      throw new Error(
        "Marketplace API URL is missing. Add the API URL to the MULTI_VENDOR_MARKETPLACE solution.",
      );
    }

    const authorization = getBearerTokenHeader();
    if (!authorization) {
      throw new Error("Sign in to create Marketplace accounts.");
    }

    const profile =
      account.user.role === "SELLER"
        ? {
            seller: {
              seller_code: account.form.seller_code.trim(),
              shop_name: account.form.shop_name.trim(),
              description: account.form.description.trim() || null,
              commission_rate: Number(account.form.commission_rate),
            },
          }
        : {
            buyer: {
              buyer_code: account.form.buyer_code.trim(),
              display_name: account.form.display_name.trim(),
            },
          };

    const response = await fetch(`${marketplaceApiBase(apiUrl)}/admin/accounts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        community_tenant_id: String(account.tenant.id),
        tenant_name: account.tenant.company_name,
        community_user_id: String(account.user.id),
        role: account.user.role,
        ...profile,
      }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      const detail = result?.detail ?? `Request failed (${response.status})`;
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
  }

  async function finishProvision(account: PendingProvision) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await linkMarketplaceProfile(account);
      setPending(null);
      setNotice(
        `${account.user.role} account "${account.user.username}" is ready. The user can sign in through the marketplace.`,
      );
      setForm((current) => ({
        ...current,
        username: "",
        email: "",
        temporary_password: "",
        seller_code: "",
        shop_name: "",
        description: "",
        buyer_code: "",
        display_name: "",
      }));
    } catch (cause) {
      setError(
        `Community account ${account.user.id} was created, but the Marketplace profile was not. Retry the profile setup below. ${
          cause instanceof Error ? cause.message : "Marketplace provisioning failed."
        }`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const tenant = tenants.find((item) => String(item.id) === form.tenant_id);
    if (!tenant) {
      setError("Select an active company first.");
      return;
    }
    if (form.role === "SELLER" && (!form.seller_code.trim() || !form.shop_name.trim())) {
      setError("Seller code and shop name are required.");
      return;
    }
    if (form.role === "BUYER" && (!form.buyer_code.trim() || !form.display_name.trim())) {
      setError("Buyer code and display name are required.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest<{ user: CommunityUser }>("/admin/marketplace-accounts", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          tenant_id: Number(form.tenant_id),
          username: form.username.trim(),
          email: form.email.trim(),
          commission_rate: Number(form.commission_rate),
        }),
      });
      const account = { user: result.user, tenant, form };
      setPending(account);
      setBusy(false);
      await finishProvision(account);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Account creation failed.");
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Marketplace accounts</h2>
        <p className="mt-2 text-sm text-slate-400">
          Only Super Admin can create accounts. Community handles sign-in; the
          Marketplace profile is linked automatically.
        </p>
      </div>

      {!apiUrl && (
        <p className="mb-5 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
          Configure the API URL for the MULTI_VENDOR_MARKETPLACE solution before
          creating accounts.
        </p>
      )}
      {error && (
        <p className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100" role="status">
          {notice}
        </p>
      )}
      {pending && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4">
          <p className="text-sm text-amber-100">
            Community account {pending.user.username} exists, but still needs a Marketplace profile.
          </p>
          <button
            type="button"
            onClick={() => void finishProvision(pending)}
            disabled={busy}
            className="rounded-lg bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
          >
            Retry profile setup
          </button>
        </div>
      )}

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Company
          <select
            required
            value={form.tenant_id}
            onChange={(event) => setForm({ ...form, tenant_id: event.target.value })}
            className={inputClass}
          >
            <option value="">Select company</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.company_name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Account type
          <select
            value={form.role}
            onChange={(event) =>
              setForm({
                ...form,
                role: event.target.value === "BUYER" ? "BUYER" : "SELLER",
              })
            }
            className={inputClass}
          >
            <option value="SELLER">Seller</option>
            <option value="BUYER">Buyer</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Username
          <input required minLength={3} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Email
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          Temporary password (at least 12 characters)
          <input required minLength={12} type="password" autoComplete="new-password" value={form.temporary_password} onChange={(event) => setForm({ ...form, temporary_password: event.target.value })} className={inputClass} />
        </label>

        {form.role === "SELLER" ? (
          <>
            <label className="grid gap-2 text-sm text-slate-300">
              Seller code
              <input required value={form.seller_code} onChange={(event) => setForm({ ...form, seller_code: event.target.value })} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Shop name
              <input required value={form.shop_name} onChange={(event) => setForm({ ...form, shop_name: event.target.value })} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Commission rate (%)
              <input required type="number" min="0" max="100" step="0.01" value={form.commission_rate} onChange={(event) => setForm({ ...form, commission_rate: event.target.value })} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
              Shop description
              <textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={inputClass} />
            </label>
          </>
        ) : (
          <>
            <label className="grid gap-2 text-sm text-slate-300">
              Buyer code
              <input required value={form.buyer_code} onChange={(event) => setForm({ ...form, buyer_code: event.target.value })} className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Display name
              <input required value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} className={inputClass} />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={busy || Boolean(pending) || tenants.length === 0 || !apiUrl}
          className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
        >
          {busy ? "Creating account…" : "Create marketplace account"}
        </button>
      </form>
    </section>
  );
}
