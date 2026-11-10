"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { submitSecurityGuardInquiry } from "@/lib/security-guards";

const guardLevels = [
  { level: "A", quality: "Higher than B level", price: 5_000_000 },
  { level: "B", quality: "Higher than C level", price: 4_000_000 },
  { level: "C", quality: "Higher than D level", price: 3_000_000 },
  { level: "D", quality: "Higher than E level", price: 2_000_000 },
  { level: "E", quality: "Higher than F level", price: 1_000_000 },
  { level: "F", quality: "Normal", price: 600_000 },
] as const;

const money = new Intl.NumberFormat("en-US");

export default function SecurityGuardServicePage() {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guardLevel, setGuardLevel] = useState("A");
  const [personnelCount, setPersonnelCount] = useState("1");
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
      setError("Please agree to the inquiry data-use statement.");
      return;
    }

    setLoading(true);
    try {
      await submitSecurityGuardInquiry({
        full_name: fullName.trim(),
        organization: organization.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        guard_level: guardLevel,
        personnel_count: Number(personnelCount),
        inquiry: inquiry.trim() || undefined,
        consent_given: true,
        website,
      });
      setSuccess(true);
      setFullName("");
      setOrganization("");
      setPhone("");
      setEmail("");
      setGuardLevel("A");
      setPersonnelCount("1");
      setInquiry("");
      setConsent(false);
      setWebsite("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your service inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <section className="relative overflow-hidden bg-[#081426] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(0,122,255,.25),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-200 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Apexive AI
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[.24em] text-blue-300">
            Government &amp; Public Sector · Security Services
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            လုံခြုံရေးဝန်ဆောင်မှု
            <span className="mt-2 block text-blue-300">Security Guard Services</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Paladin Security Services Co., Ltd. က သင့်လုပ်ငန်းခွင်လိုအပ်ချက်နှင့်
            ကိုက်ညီသော လုံခြုံရေးဝန်ဆောင်မှုများကို ပေးအပ်ရန် အသင့်ရှိပါသည်။
            အောက်ပါအဆင့်နှင့် လစဉ်နှုန်းထားများကို ကြည့်ရှုပြီး quotation
            တောင်းခံနိုင်ပါသည်။
          </p>
          <a
            href="#request-service"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#007aff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            ဝန်ဆောင်မှုတောင်းခံရန် <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
            Transparent monthly rates
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Security guard service rates
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            ဝန်ထမ်းတစ်ဦးလျှင် တစ်လစာနှုန်းထား (MMK)။ လုပ်ငန်းခွင်လိုအပ်ချက်နှင့်
            ဝန်ဆောင်မှုအတိုင်းအတာအလိုက် နောက်ဆုံး quotation ကို အတည်ပြုပါမည်။
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guardLevels.map(({ level, quality, price }) => (
            <article
              key={level}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">
                    Security guard
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold">Level {level}</h3>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <ShieldCheck size={22} />
                </span>
              </div>
              <p className="mt-3 min-h-6 text-sm text-slate-600">{quality}</p>
              <p className="mt-6 text-2xl font-bold tracking-tight">
                {money.format(price)} <span className="text-sm font-semibold text-slate-500">MMK</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">per guard · one month</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-950">
          ဝန်ဆောင်မှုကို စဉ်ဆက်မပြတ် စစ်ဆေးကြပ်မတ်ပေးရန် ရည်ရွယ်ထားပြီး
          တာဝန်အကျယ်အဝန်း၊ စတင်ရက်နှင့် နောက်ဆုံးသဘောတူညီချက်များကို
          quotation အတည်ပြုချိန်တွင် ညှိနှိုင်းပါမည်။
        </div>
      </section>

      <section
        id="request-service"
        className="scroll-mt-8 border-t border-slate-200 bg-white px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">
              Request a quotation
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              လုံခြုံရေးဝန်ဆောင်မှု တောင်းခံရန်
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              သင့်လိုအပ်ချက်ကို ပေးပို့ပါ။ Apexive AI admin team က
              လိုက်လံဆက်သွယ်နိုင်ရန် တောင်းခံချက်ကို သိမ်းဆည်းပေးပါမည်။
              အရေးပေါ်တုံ့ပြန်ရေးဝန်ဆောင်မှု မဟုတ်ပါ။
            </p>
            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold">Paladin Security Services Co., Ltd.</p>
              <p className="mt-1 text-sm text-slate-600">
                U Tin Oo · Managing Director
              </p>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                တောင်းခံမှုကို Apexive AI platform တွင် သိမ်းဆည်းမည်ဖြစ်ပြီး၊
                အလိုအလျောက် အရေးပေါ် dispatch မပြုလုပ်ပါ။
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
            {success ? (
              <div
                className="flex min-h-80 flex-col items-center justify-center text-center"
                role="status"
              >
                <CheckCircle2 className="text-emerald-600" size={38} />
                <h3 className="mt-4 text-xl font-semibold">တောင်းခံမှု လက်ခံရရှိပါပြီ</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  သင့် security service inquiry ကို သိမ်းဆည်းပြီးပါပြီ။
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-100"
                >
                  တောင်းခံမှုအသစ် ပေးပို့ရန်
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    အမည် *
                    <input
                      required
                      minLength={2}
                      maxLength={150}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    အဖွဲ့အစည်း / ကုမ္ပဏီ
                    <input
                      maxLength={200}
                      value={organization}
                      onChange={(event) => setOrganization(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    ဖုန်းနံပါတ် *
                    <input
                      required
                      type="tel"
                      minLength={6}
                      maxLength={40}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    အီးမေးလ်
                    <input
                      type="email"
                      maxLength={254}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    လုံခြုံရေးဝန်ထမ်းအဆင့် *
                    <select
                      required
                      value={guardLevel}
                      onChange={(event) => setGuardLevel(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      {guardLevels.map(({ level, price }) => (
                        <option key={level} value={level}>
                          Level {level} — {money.format(price)} MMK/month
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium">
                    လိုအပ်သော လူဦးရေ *
                    <input
                      required
                      type="number"
                      min={1}
                      max={500}
                      value={personnelCount}
                      onChange={(event) => setPersonnelCount(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium">
                  လုပ်ငန်းခွင်နှင့် လိုအပ်ချက်အသေးစိတ်
                  <textarea
                    rows={4}
                    maxLength={3000}
                    value={inquiry}
                    onChange={(event) => setInquiry(event.target.value)}
                    className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </label>
                <label className="hidden" aria-hidden="true">
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </label>
                <label className="flex items-start gap-3 text-xs leading-5 text-slate-600">
                  <input
                    required
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    ဤဝန်ဆောင်မှုတောင်းခံမှုကို ဆောင်ရွက်ရန်အတွက် ကျွန်ုပ်၏
                    အချက်အလက်များကို Apexive AI platform တွင် သိမ်းဆည်းပြီး
                    ဆက်သွယ်ရန် အသုံးပြုခြင်းကို သဘောတူပါသည်။
                  </span>
                </label>
                {error && (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#007aff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {loading ? "ပေးပို့နေသည်..." : "ဝန်ဆောင်မှုတောင်းခံမည်"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
