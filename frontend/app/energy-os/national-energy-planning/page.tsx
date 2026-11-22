
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Download,
  Factory,
  Globe2,
  Leaf,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

type EnergySource = {
  name: string;
  share: number;
  description: string;
  color: string;
};

type Scenario = {
  name: string;
  description: string;
  demand: number;
  growth: number;
  label: string;
};

const energySources: EnergySource[] = [
  {
    name: "Hydropower",
    share: 45,
    description: "Illustrative existing generation mix",
    color: "#38bdf8",
  },
  {
    name: "Natural Gas",
    share: 28,
    description: "Illustrative existing generation mix",
    color: "#a78bfa",
  },
  {
    name: "Solar",
    share: 12,
    description: "Illustrative existing generation mix",
    color: "#fbbf24",
  },
  {
    name: "Other Sources",
    share: 15,
    description: "Illustrative existing generation mix",
    color: "#64748b",
  },
];

const scenarios: Scenario[] = [
  {
    name: "Conservative",
    description: "Lower demand growth assumption",
    demand: 18000,
    growth: 2.5,
    label: "Low-growth scenario",
  },
  {
    name: "Reference",
    description: "Central planning assumption",
    demand: 24000,
    growth: 4.0,
    label: "Reference scenario",
  },
  {
    name: "High Growth",
    description: "Higher electrification and demand",
    demand: 31000,
    growth: 5.8,
    label: "High-growth scenario",
  },
];

const planningPriorities = [
  {
    title: "National electricity demand baseline",
    description: "Establish verified historical demand and consumption data.",
    owner: "Energy Planning Authority",
    status: "Needs data",
  },
  {
    title: "Generation capacity assessment",
    description: "Review installed, available and dependable generation capacity.",
    owner: "Generation & Grid Agencies",
    status: "In review",
  },
  {
    title: "Transmission and grid readiness",
    description: "Assess grid stability, transmission capability and planned upgrades.",
    owner: "Grid Operator",
    status: "Needs data",
  },
  {
    title: "Technology-neutral alternatives",
    description: "Compare nuclear, renewables, storage, gas and efficiency options.",
    owner: "Planning & Technical Team",
    status: "In progress",
  },
  {
    title: "Long-term financing strategy",
    description: "Evaluate affordability, financing structures and fiscal exposure.",
    owner: "Finance Ministry / Project Team",
    status: "Not started",
  },
];

const fmt = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#101722] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function Metric({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <Panel className="p-5 transition hover:border-cyan-400/30">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] p-2.5 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </Panel>
  );
}

export default function NationalEnergyPlanningPage() {
  const [scenarioIndex, setScenarioIndex] = useState(1);
  const [selectedYear, setSelectedYear] = useState("2035");
  const [search, setSearch] = useState("");

  const activeScenario = scenarios[scenarioIndex];

  const forecast = useMemo(() => {
    const baseDemand = 12000;
    const growthRate = activeScenario.growth / 100;
    const startYear = 2026;
    const endYear = Number(selectedYear);

    return Array.from(
      { length: Math.max(1, endYear - startYear + 1) },
      (_, index) => {
        const year = startYear + index;
        const demand = Math.round(
          baseDemand * Math.pow(1 + growthRate, index),
        );

        return { year, demand };
      },
    );
  }, [activeScenario, selectedYear]);

  const maxDemand = Math.max(...forecast.map((item) => item.demand), 1);

  const filteredPriorities = planningPriorities.filter((item) =>
    `${item.title} ${item.description} ${item.owner}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalMix = energySources.reduce(
    (total, source) => total + source.share,
    0,
  );

  return (
    <main className="min-h-screen bg-[#080d14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.055] blur-[150px]" />
        <div className="absolute -left-32 top-[600px] h-[450px] w-[450px] rounded-full bg-blue-600/[0.045] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 md:px-9">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/energy-os/national-nuclear-programme"
              aria-label="Back to programme roadmap"
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 hover:bg-white/10"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  ApexiveAI Energy OS
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                National Energy Planning Workspace
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-amber-400/20 bg-amber-400/[0.08] px-3 py-2 text-[10px] font-bold tracking-wider text-amber-300">
              DEMO DATA
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10"
            >
              <Download size={16} />
              Export / Print
            </button>
          </div>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              Strategic Energy Infrastructure
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              National Energy
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Planning & Feasibility
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Evaluate national electricity demand, generation resources,
              long-term energy scenarios, infrastructure requirements and
              investment feasibility through one planning workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#demand-forecast"
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Explore Demand Forecast
                <ArrowRight size={16} />
              </a>
              <a
                href="#feasibility"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white hover:bg-white/[0.08]"
              >
                <Calculator size={16} />
                Feasibility Areas
              </a>
            </div>
          </div>

          <Panel className="relative overflow-hidden bg-gradient-to-br from-[#142738] to-[#0c121d] p-6">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-cyan-300/10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-cyan-300">
                <Globe2 size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Planning Horizon
                </span>
              </div>
              <p className="mt-7 text-5xl font-semibold">2026–2050</p>
              <p className="mt-2 text-sm text-slate-400">
                Illustrative long-term planning window
              </p>
              <div className="mt-7 grid grid-cols-3 gap-2">
                {["DEMAND", "SUPPLY", "INVESTMENT"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <p className="text-[9px] font-bold tracking-wider text-cyan-300">
                      {item}
                    </p>
                    <p className="mt-2 text-[10px] text-slate-400">
                      Planning
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="Planning Horizon"
            value="25 Years"
            detail="Illustrative planning period"
            icon={TrendingUp}
          />
          <Metric
            title="Energy Sources"
            value="04"
            detail="Example generation mix categories"
            icon={Zap}
          />
          <Metric
            title="Demand Scenario"
            value="03"
            detail="Conservative, reference and high growth"
            icon={BarChart3}
          />
          <Metric
            title="Planning Priorities"
            value="05"
            detail="Demo governance workstreams"
            icon={ShieldCheck}
          />
        </section>

        <section id="demand-forecast" className="mt-12">
          <SectionHeading
            eyebrow="Electricity Demand Modelling"
            title="National Electricity Demand Forecast"
            description="Explore illustrative demand scenarios. Replace the example assumptions with verified national statistics before using them for decisions."
          />

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <Panel className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Demand Projection</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Illustrative annual electricity demand · GWh
                  </p>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0b121c] px-4 py-2.5 text-xs text-slate-300 outline-none focus:border-cyan-400/50"
                >
                  <option value="2030">To 2030</option>
                  <option value="2035">To 2035</option>
                  <option value="2040">To 2040</option>
                  <option value="2050">To 2050</option>
                </select>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {scenarios.map((scenario, index) => (
                  <button
                    key={scenario.name}
                    onClick={() => setScenarioIndex(index)}
                    className={`rounded-xl border px-3 py-2.5 text-xs transition ${
                      scenarioIndex === index
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
                    }`}
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>

              <div className="mt-7 rounded-xl border border-white/[0.06] bg-[#0b121c] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      {activeScenario.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {fmt(forecast[forecast.length - 1]?.demand ?? 0)} GWh
                    </p>
                  </div>
                  <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-2 text-xs text-cyan-300">
                    {activeScenario.growth}% annual assumption
                  </span>
                </div>

                <div className="mt-7 flex h-52 items-end gap-1.5 overflow-hidden">
                  {forecast.map((item) => {
                    const height = Math.max(
                      5,
                      (item.demand / maxDemand) * 100,
                    );

                    return (
                      <div
                        key={item.year}
                        className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
                      >
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#172334] px-2.5 py-2 text-[10px] text-white group-hover:block">
                          {item.year}: {fmt(item.demand)} GWh
                        </div>
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-300 opacity-80 transition hover:opacity-100"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-between text-[10px] text-slate-600">
                  <span>2026</span>
                  <span>{selectedYear}</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Model assumption: 12,000 GWh starting baseline and the
                selected annual growth rate. This is synthetic demo data,
                not a national demand forecast.
              </p>
            </Panel>

            <Panel className="p-6">
              <p className="text-sm font-semibold">Scenario Assumptions</p>
              <p className="mt-1 text-xs text-slate-500">
                Select a planning case
              </p>
              <div className="mt-5 space-y-3">
                {scenarios.map((scenario, index) => (
                  <button
                    key={scenario.name}
                    onClick={() => setScenarioIndex(index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      scenarioIndex === index
                        ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                        : "border-white/[0.07] bg-[#0b121c] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {scenario.name}
                      </p>
                      {scenarioIndex === index && (
                        <CheckCircle2 size={16} className="text-cyan-300" />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {scenario.description}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-cyan-300">
                      {scenario.growth}%{" "}
                      <span className="text-xs font-normal text-slate-500">
                        annual growth
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-2">
          <Panel className="p-6">
            <SectionHeading
              eyebrow="Generation Portfolio"
              title="Illustrative National Energy Mix"
              description="Example shares for interface demonstration only."
            />

            <div className="mt-7 flex h-5 overflow-hidden rounded-full bg-white/[0.05]">
              {energySources.map((source) => (
                <div
                  key={source.name}
                  style={{
                    width: `${source.share}%`,
                    backgroundColor: source.color,
                  }}
                  title={`${source.name}: ${source.share}%`}
                />
              ))}
            </div>

            <div className="mt-7 space-y-4">
              {energySources.map((source) => (
                <div key={source.name}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-sm text-slate-300">
                        {source.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {source.share}%
                    </span>
                  </div>
                  <p className="ml-5 mt-1 text-[10px] text-slate-600">
                    {source.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-slate-500">
              Total illustrative mix: {totalMix}%
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionHeading
              eyebrow="Technology-Neutral Assessment"
              title="Energy Options Comparison"
              description="Compare alternatives using consistent, evidence-based evaluation criteria."
            />

            <div className="mt-6 space-y-3">
              {[
                {
                  name: "Hydropower",
                  note: "Water resources and seasonal availability",
                  icon: Activity,
                },
                {
                  name: "Solar & Wind",
                  note: "Renewable resources and system flexibility",
                  icon: Leaf,
                },
                {
                  name: "Natural Gas",
                  note: "Fuel supply, costs and emissions exposure",
                  icon: Factory,
                },
                {
                  name: "Nuclear Power",
                  note: "Long-term baseload planning and institutional readiness",
                  icon: Zap,
                },
                {
                  name: "Storage & Efficiency",
                  note: "Demand management and grid flexibility",
                  icon: BarChart3,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <div className="rounded-xl bg-cyan-400/[0.08] p-2.5 text-cyan-300">
                    <item.icon size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.note}
                    </p>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-600" />
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section id="feasibility" className="mt-12">
          <SectionHeading
            eyebrow="Economic & Institutional Assessment"
            title="Project Feasibility Workstreams"
            description="A complete assessment requires verified data, independent review and transparent assumptions."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Capital Investment",
                description: "Capital expenditure, financing structure and fiscal exposure.",
                icon: Wallet,
              },
              {
                title: "Economic Analysis",
                description: "Affordability, electricity costs and economic impact.",
                icon: Calculator,
              },
              {
                title: "Grid Infrastructure",
                description: "Transmission, system flexibility and grid development.",
                icon: Zap,
              },
              {
                title: "Environmental Review",
                description: "Environmental impact, water use and sustainability.",
                icon: Leaf,
              },
              {
                title: "Institutional Capacity",
                description: "Government capability and organizational readiness.",
                icon: Building2,
              },
              {
                title: "Financing Strategy",
                description: "Public funding, private capital and financial risk.",
                icon: CircleDollarSign,
              },
              {
                title: "International Cooperation",
                description: "Technical cooperation and institutional partnerships.",
                icon: Globe2,
              },
              {
                title: "Independent Review",
                description: "External review, verification and assurance records.",
                icon: ShieldCheck,
              },
            ].map((item) => (
              <Panel
                key={item.title}
                className="p-5 transition hover:border-cyan-400/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300">
                  <item.icon size={19} />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </Panel>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Planning Governance"
              title="National Planning Priorities"
              description="Illustrative workstreams requiring verified evidence and assigned institutional ownership."
            />
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search priorities..."
                className="w-full rounded-xl border border-white/10 bg-[#101722] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
              />
            </div>
          </div>

          <Panel className="mt-5 overflow-hidden">
            {filteredPriorities.map((item, index) => (
              <div
                key={item.title}
                className="grid gap-3 border-b border-white/[0.06] p-5 last:border-0 md:grid-cols-[40px_1.4fr_1fr_auto] md:items-center"
              >
                <span className="text-xs text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
                <p className="text-xs text-slate-400">{item.owner}</p>
                <span className="w-fit rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] text-slate-400">
                  {item.status}
                </span>
              </div>
            ))}
            {filteredPriorities.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">
                No matching priorities found.
              </p>
            )}
          </Panel>
        </section>

        <section className="mt-12 rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-[#102438] to-[#101722] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <TrendingUp size={17} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Next Development Stage
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">
                Nuclear Project Management
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Manage programme portfolios, project schedules, milestones,
                budgets, contracts and institutional responsibilities.
              </p>
            </div>
            <Link
              href="/energy-os/nuclear-project-management"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Next Workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-600 md:flex-row">
          <p>© ApexiveAI Energy OS · National Energy Planning</p>
          <p>ILLUSTRATIVE DEMO DATA · NOT CONNECTED TO LIVE SYSTEMS</p>
        </footer>
      </div>
    </main>
  );
}
