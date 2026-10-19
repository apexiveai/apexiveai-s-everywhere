"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { apiRequest, fetchAllPages } from "@/lib/api";

type Tenant = { id: number; company_name: string };
type Plan = { id: number; name: string; billing_cycle: string };
type Solution = { id: number; name: string };
type Invoice = {
  id: number;
  invoice_number: string;
  tenant_name: string;
  invoice_type: "SOFTWARE_LICENSE" | "SUPPORT_MAINTENANCE";
  currency: "USD" | "MMK";
  amount: string;
  description: string;
  solution_name: string | null;
  duration_months: number | null;
  status: string;
  payment_reference: string | null;
  payer_name: string | null;
  review_note: string | null;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white px-3 py-3 text-sm text-[#1d1d1f]";

export default function AdminInvoices() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [invoiceType, setInvoiceType] = useState<Invoice["invoice_type"]>("SOFTWARE_LICENSE");
  const [currency, setCurrency] = useState<"USD" | "MMK">("MMK");
  const [planId, setPlanId] = useState("");
  const [solutionId, setSolutionId] = useState("");
  const [durationMonths, setDurationMonths] = useState("12");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [tenantData, planData, solutionData, invoiceData] = await Promise.all([
        fetchAllPages<Tenant>("/admin/tenants"),
        fetchAllPages<Plan>("/admin/plans"),
        fetchAllPages<Solution>("/admin/solutions"),
        fetchAllPages<Invoice>("/admin/invoices"),
      ]);
      setTenants(tenantData);
      setPlans(planData);
      setSolutions(solutionData);
      setInvoices(invoiceData);
      setTenantId((current) => current || (tenantData[0] ? String(tenantData[0].id) : ""));
      setPlanId((current) => current || (planData[0] ? String(planData[0].id) : ""));
      setSolutionId((current) => current || (solutionData[0] ? String(solutionData[0].id) : ""));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load invoice data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/admin/invoices", {
        method: "POST",
        body: JSON.stringify({
          tenant_id: Number(tenantId),
          invoice_type: invoiceType,
          currency,
          amount,
          description,
          payment_instructions: paymentInstructions || null,
          plan_id: invoiceType === "SOFTWARE_LICENSE" ? Number(planId) : null,
          solution_id: invoiceType === "SOFTWARE_LICENSE" ? Number(solutionId) : null,
          duration_months: invoiceType === "SOFTWARE_LICENSE" ? Number(durationMonths) : null,
        }),
      });
      setNotice("Invoice issued. The tenant can report a bank transfer from Billing.");
      setAmount("");
      setDescription("");
      setPaymentInstructions("");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to issue invoice.");
    } finally {
      setBusy(false);
    }
  }

  async function review(invoice: Invoice, decision: "PAID" | "REJECTED") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/admin/invoices/${invoice.id}/review`, {
        method: "PATCH",
        body: JSON.stringify({
          decision,
          review_note: reviewNotes[invoice.id] || null,
        }),
      });
      setNotice(
        decision === "PAID"
          ? `${invoice.invoice_number} verified. License access is now active when applicable.`
          : `${invoice.invoice_number} was rejected. The tenant can report a corrected transfer.`,
      );
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to review payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-invoice-workspace">
      <header className="admin-invoice-heading">
        <div>
          <p className="text-sm text-slate-400">BANK TRANSFER / SERVER-SIDE VERIFICATION</p>
          <h2 className="mt-1 text-2xl font-bold">Invoices &amp; renewals</h2>
        </div>
        <button type="button" onClick={() => void load()} className="billing-refresh"><RefreshCw size={16} /> Refresh</button>
      </header>

      <aside className="billing-gateway-notice">
        <p><strong>2C2P card integration pending.</strong> Enable only after the merchant account is ready and supported USD/MMK currencies and settlement are confirmed.</p>
      </aside>
      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {notice && <p className="billing-alert" role="status">{notice}</p>}

      <form className="admin-invoice-form" onSubmit={(event) => void createInvoice(event)}>
        <h3>Issue an invoice</h3>
        <div className="admin-invoice-fields">
          <label>Tenant
            <select required className={inputClass} value={tenantId} onChange={(event) => setTenantId(event.target.value)}>
              {tenants.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.company_name}</option>)}
            </select>
          </label>
          <label>Invoice type
            <select className={inputClass} value={invoiceType} onChange={(event) => setInvoiceType(event.target.value as Invoice["invoice_type"])}>
              <option value="SOFTWARE_LICENSE">Software license / renewal</option>
              <option value="SUPPORT_MAINTENANCE">Support &amp; Maintenance (separate)</option>
            </select>
          </label>
          <label>Currency
            <select className={inputClass} value={currency} onChange={(event) => setCurrency(event.target.value as "USD" | "MMK")}>
              <option value="MMK">MMK</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label>Invoice amount
            <input required type="number" min="0.01" step="0.01" className={inputClass} value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          {invoiceType === "SOFTWARE_LICENSE" && <>
            <label>Subscription plan
              <select required className={inputClass} value={planId} onChange={(event) => setPlanId(event.target.value)}>
                {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.billing_cycle}</option>)}
              </select>
            </label>
            <label>Product
              <select required className={inputClass} value={solutionId} onChange={(event) => setSolutionId(event.target.value)}>
                {solutions.map((solution) => <option key={solution.id} value={solution.id}>{solution.name}</option>)}
              </select>
            </label>
            <label>Term (months)
              <input required type="number" min="1" max="120" className={inputClass} value={durationMonths} onChange={(event) => setDurationMonths(event.target.value)} />
            </label>
          </>}
          <label className="admin-invoice-wide">Description
            <input required minLength={3} maxLength={2000} className={inputClass} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Example: Annual Trademark AI license renewal" />
          </label>
          <label className="admin-invoice-wide">Bank transfer instructions
            <textarea rows={3} maxLength={2000} className={inputClass} value={paymentInstructions} onChange={(event) => setPaymentInstructions(event.target.value)} placeholder="Enter verified bank name, account details, and transfer instructions for this invoice." />
          </label>
        </div>
        <button type="submit" disabled={busy || !tenantId || (invoiceType === "SOFTWARE_LICENSE" && (!planId || !solutionId))}>
          {busy && <LoaderCircle size={16} className="animate-spin" />} Issue invoice
        </button>
      </form>

      <div className="admin-invoice-list">
        <h3>Issued invoices</h3>
        {loading ? <p className="billing-loading"><LoaderCircle className="animate-spin" /> Loading…</p> : invoices.length ? invoices.map((invoice) => (
          <article className="admin-invoice-row" key={invoice.id}>
            <div className="admin-invoice-row-top">
              <div><strong>{invoice.invoice_number}</strong><small>{invoice.tenant_name} · {invoice.invoice_type.replaceAll("_", " ")}</small></div>
              <span className={`invoice-status status-${invoice.status.toLowerCase().replaceAll("_", "-")}`}>{invoice.status.replaceAll("_", " ")}</span>
            </div>
            <p>{invoice.description} · <b>{Number(invoice.amount).toLocaleString()} {invoice.currency}</b></p>
            {invoice.status === "PAYMENT_REPORTED" && <>
              <p className="invoice-meta">Transfer reference: <strong>{invoice.payment_reference}</strong> · Payer: {invoice.payer_name}</p>
              <label className="admin-review-note">Verification note
                <input className={inputClass} value={reviewNotes[invoice.id] ?? ""} onChange={(event) => setReviewNotes((current) => ({ ...current, [invoice.id]: event.target.value }))} placeholder="Optional note for this review" />
              </label>
              <div className="admin-review-actions">
                <button type="button" disabled={busy} onClick={() => void review(invoice, "PAID")}>Verify bank transfer</button>
                <button type="button" disabled={busy} onClick={() => void review(invoice, "REJECTED")}>Reject / request correction</button>
              </div>
            </>}
            {invoice.status === "PAID" && invoice.invoice_type === "SOFTWARE_LICENSE" && <small className="invoice-success">Verified; license access activated for {invoice.solution_name}.</small>}
            {invoice.status === "PAID" && invoice.invoice_type === "SUPPORT_MAINTENANCE" && <small className="invoice-success">Verified; recorded separately from software access.</small>}
            {invoice.review_note && <small className="invoice-review-note">Review note: {invoice.review_note}</small>}
          </article>
        )) : <p className="invoice-empty">No invoices have been issued.</p>}
      </div>
    </section>
  );
}
