"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CreditCard, FileText, LoaderCircle, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Invoice = {
  id: number;
  invoice_number: string;
  invoice_type: "SOFTWARE_LICENSE" | "SUPPORT_MAINTENANCE";
  currency: "USD" | "MMK";
  amount: string;
  description: string;
  payment_instructions: string | null;
  solution_name: string | null;
  duration_months: number | null;
  status: string;
  payment_reference: string | null;
  review_note: string | null;
  due_at: string | null;
};

function money(value: string, currency: string) {
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

export default function BillingClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [references, setReferences] = useState<Record<number, string>>({});
  const [payerNames, setPayerNames] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ items: Invoice[] }>("/invoices");
      setInvoices(result.items);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function reportPayment(event: FormEvent<HTMLFormElement>, invoice: Invoice) {
    event.preventDefault();
    setBusyId(invoice.id);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/invoices/${invoice.id}/payment-report`, {
        method: "POST",
        body: JSON.stringify({
          payment_reference: references[invoice.id],
          payer_name: payerNames[invoice.id],
          amount: invoice.amount,
          currency: invoice.currency,
        }),
      });
      setNotice(`Transfer reported for ${invoice.invoice_number}. Access remains locked until SuperAdmin verification.`);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to report payment.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="billing-page">
      <header className="billing-heading">
        <div>
          <span className="ac-eyebrow">Tenant account</span>
          <h1>Invoices &amp; bank transfer</h1>
          <p>Pay the invoice using the transfer instructions from your SuperAdmin, then submit the bank reference for verification.</p>
        </div>
        <button type="button" onClick={() => void load()} className="billing-refresh"><RefreshCw size={16} /> Refresh</button>
      </header>

      <aside className="billing-gateway-notice">
        <CreditCard size={20} />
        <p><strong>Card checkout is not enabled yet.</strong> 2C2P will be integrated after its merchant account is available and USD/MMK currency and settlement support are confirmed. No card details are collected here.</p>
      </aside>
      <p className="billing-transfer-note">Support &amp; Maintenance is invoiced separately from software license and renewal fees.</p>

      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {notice && <p className="billing-alert" role="status">{notice}</p>}
      {loading ? (
        <div className="billing-loading"><LoaderCircle className="animate-spin" /> Loading invoices…</div>
      ) : invoices.length ? (
        <div className="invoice-grid">
          {invoices.map((invoice) => (
            <article key={invoice.id} className="invoice-card">
              <header>
                <span className="invoice-type">{invoice.invoice_type === "SOFTWARE_LICENSE" ? "SOFTWARE LICENSE" : "SUPPORT & MAINTENANCE"}</span>
                <span className={`invoice-status status-${invoice.status.toLowerCase().replaceAll("_", "-")}`}>{invoice.status.replaceAll("_", " ")}</span>
              </header>
              <h2>{invoice.invoice_number}</h2>
              <p className="invoice-description">{invoice.description}</p>
              <strong className="invoice-amount">{money(invoice.amount, invoice.currency)}</strong>
              {invoice.solution_name && <p className="invoice-meta">Product: {invoice.solution_name}{invoice.duration_months ? ` · ${invoice.duration_months} months` : ""}</p>}
              {invoice.due_at && <p className="invoice-meta">Due: {new Date(invoice.due_at).toLocaleDateString()}</p>}
              {invoice.payment_instructions && (
                <div className="transfer-instructions"><strong>Bank transfer instructions</strong><p>{invoice.payment_instructions}</p></div>
              )}
              {invoice.review_note && <p className="invoice-review-note">SuperAdmin note: {invoice.review_note}</p>}
              {["ISSUED", "REJECTED"].includes(invoice.status) && (
                <form className="transfer-form" onSubmit={(event) => void reportPayment(event, invoice)}>
                  <label>
                    Bank transaction reference
                    <input required minLength={3} value={references[invoice.id] ?? ""} onChange={(event) => setReferences((current) => ({ ...current, [invoice.id]: event.target.value }))} />
                  </label>
                  <label>
                    Account holder name
                    <input required minLength={2} value={payerNames[invoice.id] ?? ""} onChange={(event) => setPayerNames((current) => ({ ...current, [invoice.id]: event.target.value }))} />
                  </label>
                  <button type="submit" disabled={busyId === invoice.id}>{busyId === invoice.id ? "Submitting…" : "Report transfer for verification"}</button>
                </form>
              )}
              {invoice.status === "PAYMENT_REPORTED" && <p className="invoice-pending">Transfer {invoice.payment_reference} is waiting for SuperAdmin verification.</p>}
              {invoice.status === "PAID" && invoice.invoice_type === "SOFTWARE_LICENSE" && <p className="invoice-success">Payment verified. Your product access has been activated.</p>}
              {invoice.status === "PAID" && invoice.invoice_type === "SUPPORT_MAINTENANCE" && <p className="invoice-success">Payment verified for this separate support invoice.</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="invoice-empty"><FileText size={25} /><strong>No invoices yet</strong><span>Your SuperAdmin will issue invoices to this tenant account.</span></div>
      )}
    </main>
  );
}
