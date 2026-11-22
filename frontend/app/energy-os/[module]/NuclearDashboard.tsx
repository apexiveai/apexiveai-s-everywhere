
"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  FileText,
  Globe2,
  Leaf,
  Radio,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const periods = ["7 Days", "30 Days", "90 Days", "12 Months"];

const projects = [
  {
    name: "National Nuclear Energy Programme",
    category: "National Programme",
    progress: 68,
    status: "In progress",
    date: "Q4 2027",
  },
  {
    name: "Regulatory Framework Development",
    category: "Regulatory",
    progress: 84,
    status: "In review",
    date: "Q2 2027",
  },
  {
    name: "Environmental Monitoring Network",
    category: "Environment",
    progress: 42,
    status: "In progress",
    date: "Q1 2028",
  },
  {
    name: "Workforce Education Initiative",
    category: "Education",
    progress: 91,
    status: "On track",
    date: "Q1 2027",
  },
];

const activities = [
  {
    icon: FileText,
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
    title: "Regulatory documentation updated",
    detail: "Regulatory & Licensing Management",
    time: "Today · 09:42",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    title: "Compliance review recorded",
    detail: "Safety & Compliance",
    time: "Today · 08:15",
  },
  {
    icon: Leaf,
    color: "text-lime-300",
    bg: "bg-lime-400/10",
    title: "Environmental report submitted",
    detail: "Environmental Monitoring",
    time: "Yesterday · 16:30",
  },
  {
    icon: Users,
    color: "text-violet-300",
    bg: "bg-violet-400/10",
    title: "Training programme reviewed",
    detail: "Workforce & Training",
    time: "Yesterday · 11:20",
  },
];

const metrics = [
  {
    label: "Active Projects",
    value: "18",
    change: "+3 this quarter",
    icon: ClipboardCheck,
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
  },
  {
    label: "Regulatory Records",
    value: "246",
    change: "12 awaiting review",
    icon: FileText,
    color: "text-violet-300",
    bg: "bg-violet-400/10",
  },
  {
    label: "Compliance Reviews",
    value: "94.8%",
    change: "+2.4% from previous period",
    icon: ShieldCheck,
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Monitoring Reports",
    value: "128",
    change: "All demo records",
    icon: Radio,
    color: "text-amber-300",
    bg: "bg-amber-400/10",
  },
];

const monthlyData = [
  { month: "Jan", value: 38 },
  { month: "Feb", value: 52 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 68 },
  { month: "May", value: 58 },
  { month: "Jun", value: 78 },
  { month: "Jul", value: 64 },
  { month: "Aug", value: 86 },
  { month: "Sep", value: 73 },
  { month: "Oct", value: 92 },
  { month: "Nov", value: 81 },
  { month: "Dec", value: 96 },
];

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  bg,
}: (typeof metrics)[number]) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#101824] p-5 transition hover:border-cyan-400/25">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <TrendingUp size={13} className="text-emerald-400" />
        {change}
      </div>
    </article>
  );
}

export default function NuclearDashboard() {
  const [period, setPeriod] = useState("30 Days");
  const [showAll, setShowAll] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#080d15] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-9 lg:py-9">

        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              <Globe2 size={15} />
              ApexiveAI · Energy OS
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              National Energy Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Civilian nuclear energy programme governance, project oversight,
              regulatory progress and institutional reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setRefreshed(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.08]"
            >
              <RefreshCw size={15} />
              {refreshed ? "Demo refreshed" : "Refresh"}
            </button>
            <button className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 hover:bg-white/[0.08]">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </button>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111b28] px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-xs font-bold text-cyan-300">
                AO
              </div>
              <div>
                <p className="text-xs font-medium">Programme Office</p>
                <p className="text-[10px] text-slate-500">Demo workspace</p>
              </div>
            </div>
          </div>
        </header>

        {/* Status banner */}
        <section className="relative mb-7 overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-[#102638] via-[#10202e] to-[#111b29] p-5 sm:p-6">
          <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.07] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-300">
                <Activity size={25} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">Programme Governance Workspace</h2>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                    Development Preview
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Centralized visibility across civilian programme planning,
                  regulatory records, environmental reporting and institutional
                  accountability.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
              <CalendarDays size={15} />
              Reporting period: 2026
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        {/* Main Analytics */}
        <section className="mt-7 grid gap-5 xl:grid-cols-[1.65fr_1fr]">

          {/* Programme chart */}
          <article className="rounded-2xl border border-white/[0.08] bg-[#101824] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold">Programme Activity Overview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative governance activity index
                </p>
              </div>
              <div className="flex flex-wrap gap-1 rounded-xl border border-white/[0.06] bg-[#0b121c] p-1">
                {periods.map((item) => (
                  <button
                    key={item}
                    onClick={() => setPeriod(item)}
                    className={`rounded-lg px-3 py-2 text-[11px] transition ${
                      period === item
                        ? "bg-cyan-400/15 text-cyan-300"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-500">Activity index</p>
                  <p className="mt-1 text-3xl font-semibold">
                    86.4<span className="ml-1 text-sm text-slate-500">/100</span>
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight size={14} />
                  Illustrative trend
                </span>
              </div>

              <div className="relative h-52 border-b border-l border-white/[0.08] px-2 pb-1 pt-3">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-1">
                  {[100, 75, 50, 25, 0].map((value) => (
                    <div key={value} className="flex items-center gap-3">
                      <span className="w-5 text-[9px] text-slate-600">{value}</span>
                      <div className="h-px flex-1 border-t border-dashed border-white/[0.06]" />
                    </div>
                  ))}
                </div>
                <div className="relative flex h-full items-end justify-between gap-1 pl-7">
                  {monthlyData.map((item) => (
                    <div
                      key={item.month}
                      className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        title={`${item.month}: ${item.value}`}
                        className="w-full max-w-7 rounded-t-md bg-gradient-to-t from-cyan-600/40 to-cyan-300 transition hover:from-cyan-500 hover:to-white"
                        style={{ height: `${item.value}%` }}
                      />
                      <span className="text-[9px] text-slate-500">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-600">
                Selected period: {period} · Illustrative demo values, not live
                operational measurements.
              </p>
            </div>
          </article>

          {/* Governance status */}
          <article className="rounded-2xl border border-white/[0.08] bg-[#101824] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Governance Status</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative review distribution
                </p>
              </div>
              <ShieldCheck className="text-emerald-300" size={21} />
            </div>

            <div className="mt-7 flex items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(#22d3ee 0% 68%, #34d399 68% 89%, #fbbf24 89% 96%, #334155 96% 100%)",
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#101824]">
                  <span className="text-3xl font-semibold">89%</span>
                  <span className="mt-1 text-[10px] text-slate-500">
                    Review progress
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {[
                ["Reviewed", "68%", "bg-cyan-400"],
                ["Approved", "21%", "bg-emerald-400"],
                ["Pending", "7%", "bg-amber-400"],
                ["Other", "4%", "bg-slate-600"],
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
                  <span className="flex-1 text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Projects */}
        <section className="mt-7 rounded-2xl border border-white/[0.08] bg-[#101824] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Strategic Programme Portfolio</h2>
              <p className="mt-1 text-xs text-slate-500">
                Civilian programme planning and governance milestones
              </p>
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              {showAll ? "Show less" : "View all projects"}
              <ChevronDown
                size={14}
                className={showAll ? "rotate-180" : ""}
              />
            </button>
          </div>

          <div className="hidden grid-cols-[1.5fr_1fr_1fr_100px] gap-4 border-b border-white/[0.07] pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 md:grid">
            <span>Programme</span>
            <span>Category</span>
            <span>Progress</span>
            <span>Target</span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {visibleProjects.map((project) => (
              <div
                key={project.name}
                className="grid gap-3 py-4 md:grid-cols-[1.5fr_1fr_1fr_100px] md:items-center"
              >
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="mt-1 text-[10px] text-slate-500 md:hidden">
                    {project.category}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    {project.status}
                  </p>
                </div>
                <span className="hidden text-xs text-slate-400 md:block">
                  {project.category}
                </span>
                <div>
                  <div className="mb-2 flex justify-between text-[10px]">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-cyan-300">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-400">{project.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lower panels */}
        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/[0.08] bg-[#101824] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Governance Priorities</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative administrative review queue
                </p>
              </div>
              <CircleAlert className="text-amber-300" size={20} />
            </div>
            <div className="space-y-3">
              {[
                ["Regulatory documents awaiting review", "12", "amber"],
                ["Project milestones requiring updates", "04", "cyan"],
                ["Environmental reports to verify", "03", "violet"],
              ].map(([label, count, tone]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0b121c] p-4"
                >
                  <span className="text-xs leading-5 text-slate-300">{label}</span>
                  <span
                    className={`text-lg font-semibold ${
                      tone === "amber"
                        ? "text-amber-300"
                        : tone === "cyan"
                          ? "text-cyan-300"
                          : "text-violet-300"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-[#101824] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Recent Activities</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Sample institutional activity log
                </p>
              </div>
              <Activity className="text-cyan-300" size={20} />
            </div>
            <div className="space-y-5">
              {activities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3">
                    <div className={`h-fit rounded-lg p-2 ${item.bg} ${item.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.detail}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        {item.time}
                      </p>
                    </div>
                    <CheckCircle2 className="shrink-0 text-emerald-400" size={15} />
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-white/[0.07] py-5 text-[10px] text-slate-600 sm:flex-row sm:items-center">
          <span>APEXIVEAI ENERGY OS · NATIONAL GOVERNANCE WORKSPACE</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            DEMO ENVIRONMENT · NOT CONNECTED TO LIVE SYSTEMS
          </span>
        </footer>
      </div>
    </main>
  );
}
