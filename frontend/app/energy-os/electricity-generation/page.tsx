
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BatteryCharging,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Factory,
  FileText,
  Gauge,
  Globe2,
  Grid2X2,
  Leaf,
  Network,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

type GenerationRecord = {
  id: string;
  facility: string;
  region: string;
  technology: string;
  output: number;
  target: number;
  status: "Reporting" | "Under Review" | "Verified";
  period: string;
};

const initialRecords: GenerationRecord[] = [
  {
    id: "GEN-001",
    facility: "National Energy Programme — Phase 1",
    region: "Central Region",
    technology: "Programme Planning",
    output: 0,
    target: 0,
    status: "Reporting",
    period: "November 2026",
  },
  {
    id: "GEN-002",
    facility: "Grid Readiness Assessment",
    region: "National",
    technology: "Grid Integration",
    output: 0,
    target: 0,
    status: "Under Review",
    period: "November 2026",
  },
  {
    id: "GEN-003",
    facility: "Renewable Energy Coordination",
    region: "Southern Region",
    technology: "Renewable",
    output: 125,
    target: 150,
    status: "Verified",
    period: "November 2026",
  },
  {
    id: "GEN-004",
    facility: "National Electricity Demand Study",
    region: "National",
    technology: "Demand Planning",
    output: 0,
    target: 0,
    status: "Verified",
    period: "October 2026",
  },
];

const monthlyData = [
  { month: "Jun", demand: 62, supply: 54 },
  { month: "Jul", demand: 68, supply: 58 },
  { month: "Aug", demand: 72, supply: 63 },
  { month: "Sep", demand: 69, supply: 60 },
  { month: "Oct", demand: 78, supply: 66 },
  { month: "Nov", demand: 84, supply: 71 },
];

const panel =
  "rounded-2xl border border-white/[0.08] bg-[#101722]/90 shadow-[0_12px_45px_rgba(0,0,0,0.18)]";

const statusStyles: Record<string, string> = {
  Reporting: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  "Under Review": "border-sky-400/20 bg-sky-400/10 text-sky-300",
  Verified: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

function Status({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[value] ?? statusStyles.Reporting}`}
    >
      {value}
    </span>
  );
}

function Metric({
  title,
  value,
  unit,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  unit: string;
  description: string;
  icon: typeof Zap;
  color: string;
}) {
  return (
    <div className={`${panel} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">
              {value}
            </span>
            <span className="text-xs text-slate-500">{unit}</span>
          </div>
        </div>
        <div className={`rounded-xl border border-white/10 p-3 ${color}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default function ElectricityGenerationPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [period, setPeriod] = useState("Monthly");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [records, setRecords] = useState(initialRecords);
  const [showModal, setShowModal] = useState(false);
  const [facility, setFacility] = useState("");
  const [region, setRegion] = useState("National");
  const [technology, setTechnology] = useState("Programme Planning");

  const tabs = ["Overview", "Generation Records", "Grid Readiness", "Reports"];

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const matchesSearch =
          `${record.id} ${record.facility} ${record.region} ${record.technology}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || record.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [records, search, statusFilter]
  );

  function createRecord() {
    if (!facility.trim()) return;

    const newRecord: GenerationRecord = {
      id: `GEN-${String(records.length + 1).padStart(3, "0")}`,
      facility: facility.trim(),
      region,
      technology,
      output: 0,
      target: 0,
      status: "Reporting",
      period: "November 2026",
    };

    setRecords((current) => [newRecord, ...current]);
    setFacility("");
    setRegion("National");
    setTechnology("Programme Planning");
    setShowModal(false);
    setActiveTab("Generation Records");
  }

  function exportRecords() {
    const header = [
      "ID",
      "Facility",
      "Region",
      "Technology",
      "Output",
      "Target",
      "Status",
      "Period",
    ];

    const rows = records.map((record) => [
      record.id,
      record.facility,
      record.region,
      record.technology,
      record.output,
      record.target,
      record.status,
      record.period,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "apexiveai-generation-register.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#080d14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.07] blur-[140px]" />
        <div className="absolute -left-40 top-[45%] h-[450px] w-[450px] rounded-full bg-blue-600/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-7 md:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Zap size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                APEXIVEAI · ENERGY OS
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Electricity Generation Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-amber-300">
              DEMO ENVIRONMENT
            </span>
            <Link
              href="/energy-os"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
            >
              <ArrowLeft size={14} />
              Energy OS
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-9 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Activity size={13} />
              National Electricity Intelligence
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Generation intelligence.
              <span className="block text-slate-400">Grid readiness.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
              Monitor national generation reporting, electricity demand,
              programme readiness and institutional coordination through one
              enterprise management workspace.
            </p>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <Network size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  National Grid Readiness
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Assessment workspace
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Track institutional planning, grid studies, transmission
              coordination and readiness documentation before any future
              generation programme is considered operational.
            </p>
            <div className="mt-4 border-t border-white/[0.08] pt-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Planning & assessment mode
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="Illustrative National Demand"
            value="8,420"
            unit="MW"
            description="Sample planning reference only"
            icon={TrendingUp}
            color="bg-cyan-400/10 text-cyan-300"
          />
          <Metric
            title="Illustrative Available Supply"
            value="7,150"
            unit="MW"
            description="Sample reporting reference only"
            icon={BatteryCharging}
            color="bg-emerald-400/10 text-emerald-300"
          />
          <Metric
            title="Generation Records"
            value={String(records.length).padStart(2, "0")}
            unit="records"
            description="Programme reporting register"
            icon={Factory}
            color="bg-sky-400/10 text-sky-300"
          />
          <Metric
            title="Grid Readiness Reviews"
            value="04"
            unit="reviews"
            description="Illustrative planning workstreams"
            icon={Grid2X2}
            color="bg-violet-400/10 text-violet-300"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
          <div className={`${panel} p-5 md:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={17} className="text-cyan-300" />
                  <h2 className="text-base font-semibold text-white">
                    National Energy Balance
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative demand and supply index
                </p>
              </div>
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="rounded-lg border border-white/10 bg-[#0b121c] px-3 py-2 text-xs text-slate-300 outline-none"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annual</option>
              </select>
            </div>

            <div className="mt-8 flex items-center gap-5 text-[10px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Demand index
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Supply index
              </span>
            </div>

            <div className="mt-5 flex h-52 items-end justify-between gap-3 border-b border-white/[0.08] pb-3">
              {monthlyData.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full flex-1 items-end justify-center gap-1.5"
                >
                  <div
                    title={`Demand index: ${item.demand}`}
                    className="w-[35%] rounded-t-md bg-cyan-400/80 transition hover:bg-cyan-300"
                    style={{ height: `${item.demand}%` }}
                  />
                  <div
                    title={`Supply index: ${item.supply}`}
                    className="w-[35%] rounded-t-md bg-emerald-400/70 transition hover:bg-emerald-300"
                    style={{ height: `${item.supply}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-slate-500">
              {monthlyData.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-600">
              The chart is an illustrative normalized index. It does not
              represent actual national electricity statistics or operating
              plant output.
            </p>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <Gauge size={17} className="text-cyan-300" />
              <h2 className="text-sm font-semibold text-white">
                Programme Readiness
              </h2>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-white/[0.06]">
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-cyan-400 border-r-cyan-400/60 rotate-45" />
                <div className="text-center">
                  <p className="text-4xl font-semibold text-white">42%</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Demo index
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ["Institutional planning", 75],
                ["Grid assessment", 48],
                ["Data governance", 60],
                ["Reporting coverage", 35],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-[10px]">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-300">{value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${panel} mt-6 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] p-5 md:px-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Generation Intelligence Workspace
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                National reporting and grid coordination
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportRecords}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
              >
                <Download size={14} />
                Export
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-[#07111b] hover:bg-cyan-300"
              >
                <Plus size={15} />
                Add Record
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-white/[0.08] px-5 pt-3 md:px-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-3 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "border-cyan-300 text-cyan-300"
                    : "border-transparent text-slate-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
              {[
                {
                  icon: Globe2,
                  title: "National Planning",
                  text: "Centralized electricity demand and generation planning records.",
                },
                {
                  icon: Network,
                  title: "Grid Coordination",
                  text: "Transmission planning, institutional coordination and readiness evidence.",
                },
                {
                  icon: ShieldCheck,
                  title: "Reporting Governance",
                  text: "Controlled submissions, source records and accountable review workflows.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-5"
                >
                  <item.icon size={21} className="text-cyan-300" />
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Generation Records" && (
            <div className="p-5 md:p-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search facility, ID or region..."
                    className="w-full rounded-lg border border-white/10 bg-[#0a111b] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border border-white/10 bg-[#0a111b] px-3 py-2.5 text-xs text-slate-300 outline-none"
                >
                  <option>All</option>
                  <option>Reporting</option>
                  <option>Under Review</option>
                  <option>Verified</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pr-4">Facility / Workstream</th>
                      <th className="pb-3 pr-4">Region</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Output</th>
                      <th className="pb-3 pr-4">Reporting Period</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-white/[0.05] last:border-0"
                      >
                        <td className="py-4 pr-4">
                          <p className="text-xs font-semibold text-white">
                            {record.facility}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {record.id}
                          </p>
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {record.region}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {record.technology}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {record.output === 0
                            ? "Not reported"
                            : `${record.output} index`}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {record.period}
                        </td>
                        <td className="py-4">
                          <Status value={record.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <p className="py-10 text-center text-xs text-slate-500">
                    No matching records found.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Grid Readiness" && (
            <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
              {[
                {
                  title: "National Grid Assessment",
                  status: "In Progress",
                  description:
                    "Institutional assessment of national grid planning, transmission coordination and demand forecasts.",
                  progress: 48,
                },
                {
                  title: "Electricity Demand Forecasting",
                  status: "In Progress",
                  description:
                    "Planning studies for future electricity demand, regional needs and long-term scenarios.",
                  progress: 62,
                },
                {
                  title: "Interconnection Governance",
                  status: "Planning",
                  description:
                    "Documentation of grid stakeholder roles, interconnection governance and review responsibilities.",
                  progress: 25,
                },
                {
                  title: "Energy Data Standards",
                  status: "In Progress",
                  description:
                    "Common reporting definitions, data provenance and national information governance.",
                  progress: 70,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <span className="shrink-0 rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-[10px] text-sky-300">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-slate-500">
                    {item.description}
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-[10px] text-slate-500">
                      <span>Illustrative workstream progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
              {[
                ["National Generation Summary", "Monthly reporting template"],
                ["Electricity Demand Outlook", "Planning and forecasting report"],
                ["Grid Readiness Assessment", "Institutional readiness report"],
                ["Energy Programme Review", "Programme performance report"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <div className="rounded-lg bg-cyan-400/10 p-3 text-cyan-300">
                    <FileText size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">{title}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600">Template</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <Leaf size={17} className="text-emerald-300" />
              <h3 className="text-sm font-semibold text-white">
                Energy Mix Governance
              </h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Maintain a balanced national energy portfolio through transparent
              reporting across existing and future energy sources.
            </p>
            <div className="mt-5 space-y-3">
              {[
                ["Hydropower", 42],
                ["Natural Gas", 30],
                ["Renewable Energy", 18],
                ["Other Sources", 10],
              ].map(([name, percentage]) => (
                <div key={String(name)}>
                  <div className="mb-2 flex justify-between text-[10px]">
                    <span className="text-slate-400">{name}</span>
                    <span className="text-slate-300">{percentage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-emerald-400/80"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-slate-600">
              Illustrative portfolio distribution. Not official national data.
            </p>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">
                Data Integrity & Governance
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              {[
                "Source attribution for every generation report",
                "Independent review before publication",
                "Role-based access to reporting records",
                "Historical revisions and audit trail",
                "Clear separation of planned and actual output",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
          <div>
            <p className="text-sm font-semibold text-white">
              Continue to Nuclear Safety & Compliance
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Next: institutional safety oversight, audit records and compliance governance
            </p>
          </div>
          <Link
            href="/energy-os/nuclear-safety"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#07111b] hover:bg-cyan-300"
          >
            Next Module
            <ArrowRight size={15} />
          </Link>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-[10px] text-slate-600">
          <span>APEXIVEAI ENERGY OS · ELECTRICITY GENERATION</span>
          <span>ILLUSTRATIVE DEMO DATA · SESSION ONLY · NOT A LIVE GRID SYSTEM</span>
        </footer>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add Generation Record
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create an illustrative reporting entry
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Facility / Workstream Name
                </label>
                <input
                  value={facility}
                  onChange={(event) => setFacility(event.target.value)}
                  placeholder="Enter facility or workstream"
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-slate-200 outline-none"
                >
                  <option>National</option>
                  <option>Central Region</option>
                  <option>Northern Region</option>
                  <option>Southern Region</option>
                  <option>Eastern Region</option>
                  <option>Western Region</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Category
                </label>
                <select
                  value={technology}
                  onChange={(event) => setTechnology(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-slate-200 outline-none"
                >
                  <option>Programme Planning</option>
                  <option>Grid Integration</option>
                  <option>Renewable</option>
                  <option>Demand Planning</option>
                  <option>Generation Reporting</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={createRecord}
                disabled={!facility.trim()}
                className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#07111b] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Record
              </button>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-600">
              Demo only. Entries remain in local component state and are not
              connected to an actual generation facility or grid.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
