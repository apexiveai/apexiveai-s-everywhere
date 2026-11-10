
"use client";

import { useEffect } from "react";
import { ArrowDown, ArrowUpRight, ShieldCheck } from "lucide-react";
import { trackDaiichiEvent } from "@/lib/daiichi";

export default function DaiichiHero() {
  function goToInquiry() {
    void trackDaiichiEvent("cta_click", "hero");
    document.getElementById("daiichi-inquiry")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  useEffect(() => {
    void trackDaiichiEvent("page_view", "main");
  }, []);

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070b16] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-32 h-[440px] w-[440px] rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="absolute -bottom-48 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-[11px] font-bold tracking-[.2em] text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            APEXIVE AI · FEATURED PARTNER
          </div>

          <p className="mt-8 text-xs font-semibold tracking-[.28em] text-slate-400">
            DAIICHI LIFE INSURANCE MYANMAR
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Your Life.
            <span className="block bg-gradient-to-r from-cyan-200 via-white to-blue-300 bg-clip-text text-transparent">
              Your Future.
            </span>
            Your Choices.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore information about life insurance and request a
            conversation to learn more about planning for the future.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={goToInquiry}
              className="inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Request Information
              <ArrowUpRight size={18} />
            </button>

            <a
              href="#daiichi-campaigns"
              className="inline-flex items-center gap-3 rounded-xl border border-white/15 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyan-200/50 hover:bg-white/5"
            >
              Explore Features
              <ArrowDown size={17} />
            </a>
          </div>

          <div className="mt-9 flex items-start gap-3 text-xs leading-6 text-slate-400">
            <ShieldCheck className="mt-1 shrink-0 text-cyan-300" size={17} />
            <p>
              Information page operated by Apexive AI. Product details,
              eligibility and terms must be confirmed directly with Daiichi
              Life Myanmar.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-8 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#15233b] via-[#10182a] to-[#090d18] p-7 shadow-2xl sm:p-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[.25em] text-cyan-200">
                LIFE & FUTURE
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-400">
                PARTNER FEATURE
              </span>
            </div>

            <div className="flex min-h-[300px] flex-col items-center justify-center py-10 text-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-300/5 shadow-[0_0_70px_rgba(103,232,249,.12)]">
                <div className="absolute inset-3 rounded-full border border-white/10" />
                <span className="text-7xl font-light text-cyan-100">D</span>
              </div>

              <h2 className="mt-8 text-2xl font-semibold tracking-wide">
                By Your Side
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-slate-400">
                Discover information and explore your questions about life
                insurance.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-semibold tracking-[.15em] text-slate-500">
              <span>APEXIVE AI</span>
              <span>PARTNER INFORMATION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
