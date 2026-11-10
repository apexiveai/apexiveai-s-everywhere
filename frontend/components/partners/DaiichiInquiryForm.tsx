"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Send, ShieldCheck } from "lucide-react";
import { submitDaiichiLead, trackDaiichiEvent } from "@/lib/daiichi";

export default function DaiichiInquiryForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!consent) {
      setError("Please read and accept the consent statement.");
      return;
    }

    setLoading(true);

    try {
      await submitDaiichiLead({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        inquiry: inquiry.trim() || undefined,
        consent_given: true,
        consent_text_version: "v1",
        website,
      });

      setSuccess(true);
      void trackDaiichiEvent("cta_click", "inquiry_submitted");
      setFullName("");
      setPhone("");
      setEmail("");
      setInquiry("");
      setConsent(false);
      setWebsite("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="daiichi-inquiry"
      className="scroll-mt-20 bg-[#070b16] px-5 py-20 text-white sm:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <p className="text-xs font-bold tracking-[.25em] text-cyan-300">
            GET IN TOUCH
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Start a Conversation
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-8 text-slate-400">
            Submit your inquiry through Apexive AI. Your request will be
            reviewed by the authorized team. Any insurance product information,
            eligibility and terms must be confirmed directly with Daiichi Life
            Myanmar.
          </p>

          <div className="mt-9 flex gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <ShieldCheck className="mt-1 shrink-0 text-cyan-300" size={23} />
            <div>
              <h3 className="font-semibold">Your Information</h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                Your inquiry is stored in the Apexive AI system for follow-up.
                It is not automatically sent to Daiichi Life Myanmar.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101727] p-6 shadow-2xl sm:p-9">
          {success ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300">
                <CheckCircle2 size={34} />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">
                Inquiry Received
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                Thank you for contacting us. Your inquiry has been submitted
                successfully.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-7 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold">Request Information</h3>
                <p className="mt-2 text-xs text-slate-400">
                  Fields marked * are required.
                </p>
              </div>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-300">Full Name *</span>
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-[#090e19] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2 text-sm">
                  <span className="text-slate-300">Phone Number *</span>
                  <input
                    required
                    minLength={6}
                    maxLength={40}
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xxxxxxxxx"
                    className="w-full rounded-xl border border-white/10 bg-[#090e19] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>

                <label className="block space-y-2 text-sm">
                  <span className="text-slate-300">Email Address</span>
                  <input
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-white/10 bg-[#090e19] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-300">
                  What would you like to know?
                </span>
                <textarea
                  rows={4}
                  maxLength={3000}
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  placeholder="Write your inquiry..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#090e19] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              {/* Honeypot: hidden from normal visitors. */}
              <div
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
              >
                <label>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-slate-400">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-cyan-300"
                />
                <span>
                  I consent to Apexive AI collecting and storing the
                  information I provide for the purpose of reviewing and
                  responding to this inquiry. I understand that my information
                  will not automatically be shared with Daiichi Life Myanmar.
                  *
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-200"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !consent}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-300 px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>

              <p className="text-center text-[11px] leading-5 text-slate-500">
                Submission does not constitute an insurance application,
                policy issuance or coverage confirmation.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
