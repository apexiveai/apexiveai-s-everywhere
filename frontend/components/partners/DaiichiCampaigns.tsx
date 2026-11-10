
"use client";

import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { trackDaiichiEvent } from "@/lib/daiichi";

const campaigns = [
  {
    label: "DAILY FEATURE",
    title: "Understanding Life Insurance",
    description:
      "Explore general information about life insurance and prepare the questions that matter to you.",
    icon: Sparkles,
    key: "daily_feature",
  },
  {
    label: "WEEKLY FEATURE",
    title: "Plan a Conversation About Your Future",
    description:
      "Request information and discuss your questions with an appropriate representative.",
    icon: CalendarDays,
    key: "weekly_feature",
  },
];

export default function DaiichiCampaigns() {
  function openInquiry(key: string) {
    void trackDaiichiEvent("cta_click", key);
    document.getElementById("daiichi-inquiry")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section
      id="daiichi-campaigns"
      className="bg-[#0a0f1d] px-5 py-20 text-white sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold tracking-[.25em] text-cyan-300">
              PARTNER CONTENT
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Explore & Learn
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Featured information from the Daiichi Life Myanmar partner
              section.
            </p>
          </div>

          <span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-4 py-2 text-[10px] font-semibold tracking-wider text-amber-200">
            CONTENT SUBJECT TO PARTNER APPROVAL
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {campaigns.map((campaign) => {
            const Icon = campaign.icon;

            return (
              <article
                key={campaign.key}
                className="group rounded-3xl border border-white/10 bg-gradient-to-br from-[#121d31] to-[#0c1220] p-7 transition hover:-translate-y-1 hover:border-cyan-200/30 sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/5 text-cyan-200">
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[.2em] text-cyan-200">
                    {campaign.label}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold">
                  {campaign.title}
                </h3>

                <p className="mt-4 min-h-14 text-sm leading-7 text-slate-400">
                  {campaign.description}
                </p>

                <button
                  type="button"
                  onClick={() => openInquiry(campaign.key)}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 transition group-hover:text-white"
                >
                  Request More Information
                  <ArrowUpRight size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
