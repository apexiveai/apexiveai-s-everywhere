
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  FileText,
  Globe2,
  Landmark,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";

type Phase = "all" | "1" | "2" | "3";

type InfrastructureIssue = {
  id: number;
  title: string;
  description: string;
  category: string;
  phase: string;
  status: "Not Started" | "In Progress" | "Under Review" | "Completed";
  priority: "Critical" | "High" | "Normal";
};

const phases = [
  {
    id: "1",
    number: "PHASE 01",
    title: "Consider",
    subtitle: "Before programme commitment",
    description:
      "Assess national needs, strategic justification, infrastructure readiness and the implications of introducing nuclear power.",
    milestone: "Milestone 1",
    milestoneTitle: "Ready for a knowledgeable commitment",
    period: "Pre-project preparation",
  },
  {
    id: "2",
    number: "PHASE 02",
    title: "Prepare",
    subtitle: "Before contracting",
    description:
      "Establish the national institutions, independent regulatory capability, legal framework and project infrastructure.",
    milestone: "Milestone 2",
    milestoneTitle: "Ready to invite bids or negotiate",
    period: "Project preparation",
  },
  {
    id: "3",
    number: "PHASE 03",
    title: "Construct",
    subtitle: "Implementation and readiness",
    description:
      "Oversee project implementation, construction governance, regulatory reviews and readiness for commissioning.",
    milestone: "Milestone 3",
    milestoneTitle: "Ready to commission and operate",
    period: "Project implementation",
  },
];

const issues: InfrastructureIssue[] = [
  {
    id: 1,
    title: "National Position",
    description: "National strategy, policy direction and programme justification.",
    category: "Government",
    phase: "1,2,3",
    status: "In Progress",
    priority: "Critical",
  },
  {
    id: 2,
    title: "Nuclear Safety",
    description: "National safety policy, oversight and independent safety governance.",
    category: "Safety",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Critical",
  },
  {
    id: 3,
    title: "Management",
    description: "Programme implementation organization and institutional responsibilities.",
    category: "Governance",
    phase: "1,2,3",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 4,
    title: "Funding & Financing",
    description: "Financial strategy, funding structure and long-term financial commitments.",
    category: "Finance",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Critical",
  },
  {
    id: 5,
    title: "Legal Framework",
    description: "National legislation, international obligations and legal responsibilities.",
    category: "Legal",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Critical",
  },
  {
    id: 6,
    title: "Safeguards",
    description: "International safeguards obligations and institutional arrangements.",
    category: "International",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 7,
    title: "Regulatory Framework",
    description: "Independent regulatory authority, licensing and inspection governance.",
    category: "Regulatory",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Critical",
  },
  {
    id: 8,
    title: "Radiation Protection",
    description: "Radiation protection policy, institutional responsibilities and oversight.",
    category: "Safety",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 9,
    title: "Electrical Grid",
    description: "National grid capability, transmission planning and system readiness.",
    category: "Energy",
    phase: "1,2,3",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 10,
    title: "Human Resource Development",
    description: "Workforce planning, professional qualifications and education programmes.",
    category: "Workforce",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 11,
    title: "Stakeholder Involvement",
    description: "Public engagement, institutional coordination and transparent consultation.",
    category: "Public",
    phase: "1,2,3",
    status: "In Progress",
    priority: "Normal",
  },
  {
    id: 12,
    title: "Site & Supporting Facilities",
    description: "Site evaluation governance and supporting infrastructure assessments.",
    category: "Infrastructure",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 13,
    title: "Environmental Protection",
    description: "Environmental impact assessment and environmental governance.",
    category: "Environment",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 14,
    title: "Emergency Planning",
    description: "Emergency preparedness policy, inter-agency coordination and exercises.",
    category: "Safety",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Critical",
  },
  {
    id: 15,
    title: "Nuclear Security",
    description: "National security policy, institutional accountability and oversight.",
    category: "Security",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Critical",
  },
  {
    id: 16,
    title: "Nuclear Fuel Cycle",
    description: "National policy, legal obligations and fuel-cycle governance.",
    category: "Governance",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 17,
    title: "Radioactive Waste Management",
    description: "Waste policy, institutional responsibilities and long-term governance.",
    category: "Environment",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
  {
    id: 18,
    title: "Industrial Involvement",
    description: "Domestic industry capability, supplier qualification and quality governance.",
    category: "Industry",
    phase: "1,2,3",
    status: "Not Started",
    priority: "Normal",
  },
  {
    id: 19,
    title: "Procurement",
    description: "Transparent procurement policy, supplier oversight and contract governance.",
    category: "Finance",
    phase: "1,2,3",
    status: "Not Started",
    priority: "High",
  },
];

const statusStyles: Record<string, string> = {
  "Not Started": "border-white/10 bg-white/[0.04] text-slate-400",
  "In Progress": "border-blue-400/20 bg-blue-400/10 text-blue-300",
  "Under Review": "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5 transition hover:border-cyan-400/30">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] p-2.5 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default function NationalNuclearProgrammePage() {
  const [selectedPhase, setSelectedPhase] = useState<Phase>("all");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const categories = [
    "All",
    ...Array.from(new Set(issues.map((issue) => issue.category))),
  ];

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesPhase =
        selectedPhase === "all" || issue.phase.split(",").includes(selectedPhase);

      const matchesCategory =
        selectedCategory === "All" || issue.category === selectedCategory;

      const matchesSearch =
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.description.toLowerCase().includes(search.toLowerCase());

      return matchesPhase && matchesCategory && matchesSearch;
    });
  }, [selectedPhase, selectedCategory, search]);

  const visibleIssues = showAll ? filteredIssues : filteredIssues.slice(0, 8);

  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const completed = issues.filter((i) => i.status === "Completed").length;

  return (
    <main className="min-h-screen bg-[#080d14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />
        <div className="absolute left-0 top-[500px] h-[400px] w-[400px] rounded-full bg-blue-600/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 md:px-9">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/energy-os"
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:bg-white/10"
              aria-label="Back to Energy OS"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  ApexiveAI Energy OS
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                National Energy Programme Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-amber-400/20 bg-amber-400/[0.08] px-3 py-2 text-[10px] font-bold tracking-wider text-amber-300">
              DEMO ENVIRONMENT
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <ArrowDownToLine size={16} />
              Export / Print
            </button>
          </div>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.5fr_0.7fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">
              National Strategic Infrastructure
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              National Nuclear
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Programme Roadmap
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              A unified governance workspace for planning, evaluating and
              overseeing the national civilian nuclear power programme —
              from strategic assessment to long-term operational readiness.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#infrastructure"
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore Infrastructure
                <ArrowRight size={16} />
              </a>
              <a
                href="#milestones"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white transition hover:bg-white/[0.08]"
              >
                <Target size={16} />
                View Milestones
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#142738] to-[#0c121d] p-6">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-cyan-300/10" />
            <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full border border-cyan-300/10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-cyan-300">
                <Globe2 size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Programme Framework
                </span>
              </div>
              <p className="mt-7 text-5xl font-semibold">19</p>
              <p className="mt-1 text-sm text-slate-300">
                Infrastructure Issues
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["CONSIDER", "PREPARE", "CONSTRUCT"].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <p className="text-[9px] font-bold tracking-wider text-cyan-300">
                      0{index + 1}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500">
                Based on the IAEA Milestones Approach. This workspace is a
                planning and governance tool, not a regulatory approval.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Infrastructure Issues"
            value="19"
            description="IAEA programme framework"
            icon={Layers3}
          />
          <MetricCard
            label="Development Phases"
            value="03"
            description="Consider · Prepare · Construct"
            icon={Target}
          />
          <MetricCard
            label="In Progress"
            value={String(inProgress).padStart(2, "0")}
            description="Illustrative demo records"
            icon={Activity}
          />
          <MetricCard
            label="Completed"
            value={String(completed).padStart(2, "0")}
            description="No real programme data connected"
            icon={CheckCircle2}
          />
        </section>

        <section id="milestones" className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Development Framework
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Three Programme Phases</h2>
              <p className="mt-2 text-sm text-slate-500">
                Each phase concludes with a formal programme milestone assessment.
              </p>
            </div>
            <span className="text-xs text-slate-500">IAEA Milestones Approach</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {phases.map((phase, index) => (
              <article
                key={phase.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101722] p-6 transition hover:border-cyan-400/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.18em] text-cyan-300">
                    {phase.number}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-slate-400">
                    {phase.period}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
                    {index === 0 ? (
                      <Search size={22} />
                    ) : index === 1 ? (
                      <ClipboardCheck size={22} />
                    ) : (
                      <Building2 size={22} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{phase.title}</h3>
                    <p className="text-xs text-slate-500">{phase.subtitle}</p>
                  </div>
                </div>
                <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-400">
                  {phase.description}
                </p>
                <div className="mt-5 border-t border-white/[0.07] pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {phase.milestone}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {phase.milestoneTitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-400/10 p-2.5 text-blue-300">
                <Landmark size={20} />
              </div>
              <div>
                <h3 className="font-semibold">National Programme Governance</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Three fundamental institutional roles
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  icon: Landmark,
                  title: "Government",
                  description:
                    "National policy, strategic direction, coordination and public accountability.",
                },
                {
                  icon: ShieldCheck,
                  title: "Regulatory Body",
                  description:
                    "Independent licensing, inspection, regulatory review and compliance oversight.",
                },
                {
                  icon: Building2,
                  title: "Owner / Operator",
                  description:
                    "Project development, organizational capability and operational responsibility.",
                },
              ].map((role) => (
                <div
                  key={role.title}
                  className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <role.icon size={20} className="text-cyan-300" />
                  <h4 className="mt-4 text-sm font-semibold">{role.title}</h4>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Readiness Overview</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative demo status
                </p>
              </div>
            </div>
            <div className="mt-7">
              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-400">Demo progress</span>
                <span className="text-2xl font-semibold text-white">16%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full w-[16%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Example visualization only. This is not an assessment of any
                country&apos;s actual readiness.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ["In Progress", inProgress, "text-blue-300"],
                ["Completed", completed, "text-emerald-300"],
                ["Not Started", issues.length - inProgress - completed, "text-slate-400"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className={String(color)}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="infrastructure" className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                National Infrastructure Tracker
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                19 Infrastructure Issues
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Track institutional readiness, responsibilities and programme documentation.
              </p>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400">
              {filteredIssues.length} issues displayed
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#101722] p-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search infrastructure issues..."
                className="w-full rounded-xl border border-white/10 bg-[#0b121c] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b121c] px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["all", "All Phases"],
              ["1", "Phase 01"],
              ["2", "Phase 02"],
              ["3", "Phase 03"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSelectedPhase(value as Phase)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition ${
                  selectedPhase === value
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101722]">
            <div className="hidden grid-cols-[55px_1.5fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-white/[0.07] bg-white/[0.025] px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:grid">
              <span>ID</span>
              <span>Infrastructure Issue</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {visibleIssues.length > 0 ? (
              visibleIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="grid gap-3 border-b border-white/[0.06] px-5 py-4 last:border-0 md:grid-cols-[55px_1.5fr_0.8fr_0.8fr_0.8fr] md:items-center md:gap-4"
                >
                  <span className="text-xs font-semibold text-slate-600">
                    {String(issue.id).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{issue.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {issue.description}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{issue.category}</span>
                  <span
                    className={`w-fit rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                      issue.priority === "Critical"
                        ? "bg-red-400/10 text-red-300"
                        : issue.priority === "High"
                        ? "bg-amber-400/10 text-amber-300"
                        : "bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    {issue.priority}
                  </span>
                  <span
                    className={`w-fit rounded-lg border px-2.5 py-1.5 text-[10px] font-medium ${statusStyles[issue.status]}`}
                  >
                    {issue.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-sm text-slate-500">
                No matching infrastructure issues found.
              </div>
            )}
          </div>

          {filteredIssues.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-300 transition hover:bg-white/[0.08]"
            >
              {showAll ? "Show Less" : `View All ${filteredIssues.length} Issues`}
              <ChevronDown
                size={15}
                className={showAll ? "rotate-180 transition" : "transition"}
              />
            </button>
          )}
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-400/10 p-2.5 text-amber-300">
                <CircleAlert size={20} />
              </div>
              <h3 className="font-semibold">Programme Governance Priorities</h3>
            </div>
            <div className="mt-5 space-y-4">
              {[
                "Independent regulatory capability",
                "National legal and policy framework",
                "Sustainable funding and financing",
                "Human resource development",
                "Environmental and public engagement",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-xs text-cyan-300">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold">Reference & Documentation</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Programme planning should follow recognized international
              guidance and be evaluated by competent national institutions.
            </p>
            <a
              href="https://www.iaea.org/publications/15516/milestones-in-the-development-of-a-national-infrastructure-for-nuclear-power"
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0b121c] p-4 transition hover:border-cyan-400/30"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={19} className="text-cyan-300" />
                <div>
                  <p className="text-sm font-medium text-white">
                    IAEA Milestones Guide
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    NG-G-3.1 (Rev. 2), 2024
                  </p>
                </div>
              </div>
              <ArrowUpRight size={17} className="text-slate-500" />
            </a>
            <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <LockKeyhole size={14} className="mt-0.5 shrink-0" />
              Regulatory decisions and approvals remain with authorized independent authorities.
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-[#102438] to-[#101722] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Zap size={17} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Next Development Stage
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">
                National Energy Planning & Feasibility
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Assess national electricity demand, energy alternatives,
                economic feasibility, funding and long-term programme commitments.
              </p>
            </div>
            <Link
              href="/energy-os/national-energy-planning"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Next Workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-600 md:flex-row">
          <p>© ApexiveAI Energy OS · National Programme Governance</p>
          <p>DEMO DATA · NOT CONNECTED TO LIVE SYSTEMS</p>
        </footer>
      </div>
    </main>
  );
}
