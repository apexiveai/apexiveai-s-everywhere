
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";

type LicenceStatus = "Approved" | "Under Review" | "Draft" | "Action Required";
type Priority = "High" | "Medium" | "Low";

type Licence = {
  id: string;
  title: string;
  category: string;
  authority: string;
  stage: string;
  status: LicenceStatus;
  submitted: string;
  due: string;
  owner: string;
};

type Inspection = {
  id: string;
  title: string;
  area: string;
  date: string;
  inspector: string;
  status: "Scheduled" | "Completed" | "Follow-up Required";
};

type Obligation = {
  id: string;
  title: string;
  reference: string;
  owner: string;
  due: string;
  priority: Priority;
  status: "Compliant" | "In Progress" | "Overdue";
};

const initialLicences: Licence[] = [
  {
    id: "LIC-2026-001",
    title: "National Programme Notification",
    category: "Programme Governance",
    authority: "Independent Regulatory Authority",
    stage: "Initial Submission",
    status: "Approved",
    submitted: "2026-08-12",
    due: "2026-08-30",
    owner: "Programme Office",
  },
  {
    id: "LIC-2026-002",
    title: "Site Evaluation Documentation",
    category: "Site Assessment",
    authority: "Independent Regulatory Authority",
    stage: "Document Review",
    status: "Under Review",
    submitted: "2026-09-04",
    due: "2026-12-15",
    owner: "Site Assessment Team",
  },
  {
    id: "LIC-2026-003",
    title: "Environmental Assessment Submission",
    category: "Environmental Governance",
    authority: "Environmental Review Office",
    stage: "Evidence Collection",
    status: "Action Required",
    submitted: "2026-09-18",
    due: "2026-11-30",
    owner: "Environment Office",
  },
  {
    id: "LIC-2026-004",
    title: "Construction Authorization Dossier",
    category: "Project Authorization",
    authority: "Independent Regulatory Authority",
    stage: "Preparation",
    status: "Draft",
    submitted: "—",
    due: "2027-03-01",
    owner: "Project Delivery Office",
  },
  {
    id: "LIC-2026-005",
    title: "Workforce Competency Framework",
    category: "Institutional Capacity",
    authority: "Workforce Standards Office",
    stage: "Document Review",
    status: "Under Review",
    submitted: "2026-10-02",
    due: "2026-12-20",
    owner: "Human Resources",
  },
];

const initialInspections: Inspection[] = [
  {
    id: "INSP-001",
    title: "Institutional Governance Review",
    area: "Governance & Independence",
    date: "2026-11-26",
    inspector: "Regulatory Review Team",
    status: "Scheduled",
  },
  {
    id: "INSP-002",
    title: "Environmental Documentation Audit",
    area: "Environmental Management",
    date: "2026-11-18",
    inspector: "Environmental Review Team",
    status: "Follow-up Required",
  },
  {
    id: "INSP-003",
    title: "Records Management Assessment",
    area: "Document Control",
    date: "2026-11-12",
    inspector: "Compliance Review Team",
    status: "Completed",
  },
];

const initialObligations: Obligation[] = [
  {
    id: "OBL-001",
    title: "Maintain regulatory independence records",
    reference: "GOV-STD-001",
    owner: "Governance Office",
    due: "2026-12-01",
    priority: "High",
    status: "Compliant",
  },
  {
    id: "OBL-002",
    title: "Complete environmental evidence register",
    reference: "ENV-STD-004",
    owner: "Environment Office",
    due: "2026-11-28",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "OBL-003",
    title: "Update public consultation records",
    reference: "PUB-STD-002",
    owner: "Public Information Office",
    due: "2026-11-15",
    priority: "Medium",
    status: "Overdue",
  },
  {
    id: "OBL-004",
    title: "Review workforce qualification records",
    reference: "HR-STD-006",
    owner: "Workforce Office",
    due: "2026-12-10",
    priority: "Medium",
    status: "In Progress",
  },
];

const licensingStages = [
  {
    number: "01",
    title: "Programme Notification",
    description: "National policy, institutional responsibilities and programme notification records.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Site Evaluation Review",
    description: "Administrative review of site assessment evidence and submissions.",
    state: "In Progress",
  },
  {
    number: "03",
    title: "Environmental Review",
    description: "Environmental assessment records and public consultation evidence.",
    state: "In Progress",
  },
  {
    number: "04",
    title: "Construction Authorization",
    description: "Formal authorization workflow and documented regulatory decisions.",
    state: "Upcoming",
  },
  {
    number: "05",
    title: "Commissioning Authorization",
    description: "Regulatory review and authorization records before commissioning.",
    state: "Upcoming",
  },
  {
    number: "06",
    title: "Operating Licence",
    description: "Licensing decision records and ongoing compliance obligations.",
    state: "Upcoming",
  },
  {
    number: "07",
    title: "Periodic Safety Review",
    description: "Scheduled independent review records and regulatory follow-up.",
    state: "Upcoming",
  },
  {
    number: "08",
    title: "Decommissioning Planning",
    description: "Long-term governance, financial assurance and planning documentation.",
    state: "Upcoming",
  },
];

const statusStyles: Record<string, string> = {
  Approved: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "Under Review": "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Draft: "border-white/10 bg-white/5 text-slate-300",
  "Action Required": "border-amber-500/25 bg-amber-500/10 text-amber-300",
  Scheduled: "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Completed: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "Follow-up Required": "border-amber-500/25 bg-amber-500/10 text-amber-300",
  Compliant: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "In Progress": "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Overdue: "border-rose-500/25 bg-rose-500/10 text-rose-300",
  CompletedStage: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  Upcoming: "border-white/10 bg-white/5 text-slate-400",
};

const panel =
  "rounded-2xl border border-white/[0.08] bg-[#101722]/90 shadow-[0_12px_50px_rgba(0,0,0,0.18)]";

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
        statusStyles[status] ?? statusStyles.Draft
      }`}
    >
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Shield;
  tone: string;
}) {
  return (
    <div className={`${panel} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-xl border border-white/10 p-3 ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

export default function RegulatoryLicensingPage() {
  const [activeTab, setActiveTab] = useState("Licences");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [licences, setLicences] = useState(initialLicences);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Programme Governance");
  const [newOwner, setNewOwner] = useState("");

  const tabs = ["Licences", "Lifecycle", "Inspections", "Obligations"];

  const filteredLicences = useMemo(() => {
    return licences.filter((item) => {
      const matchesSearch =
        `${item.id} ${item.title} ${item.category} ${item.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [licences, search, filterStatus]);

  function addLicence() {
    if (!newTitle.trim() || !newOwner.trim()) return;

    const item: Licence = {
      id: `LIC-2026-${String(licences.length + 1).padStart(3, "0")}`,
      title: newTitle.trim(),
      category: newCategory,
      authority: "Independent Regulatory Authority",
      stage: "Preparation",
      status: "Draft",
      submitted: "—",
      due: "Not assigned",
      owner: newOwner.trim(),
    };

    setLicences((current) => [item, ...current]);
    setNewTitle("");
    setNewOwner("");
    setNewCategory("Programme Governance");
    setShowModal(false);
    setActiveTab("Licences");
  }

  function exportRegister() {
    const header = [
      "ID",
      "Title",
      "Category",
      "Authority",
      "Stage",
      "Status",
      "Submitted",
      "Due",
      "Owner",
    ];
    const rows = licences.map((item) => [
      item.id,
      item.title,
      item.category,
      item.authority,
      item.stage,
      item.status,
      item.submitted,
      item.due,
      item.owner,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "apexiveai-regulatory-licensing-register.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#080d14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 right-[-10%] h-[480px] w-[480px] rounded-full bg-cyan-500/[0.07] blur-[120px]" />
        <div className="absolute left-[-15%] top-[38%] h-[420px] w-[420px] rounded-full bg-blue-600/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-7 md:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                APEXIVEAI · ENERGY OS
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Regulatory & Licensing Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-amber-300 sm:inline-flex">
              DEMO ENVIRONMENT
            </span>
            <Link
              href="/energy-os"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            >
              <ArrowLeft size={14} />
              Energy OS
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-9 lg:grid-cols-[1.45fr_0.55fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Shield size={13} />
              Independent Oversight Workspace
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Regulatory oversight.
              <span className="block text-slate-400">Transparent licensing.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
              A central workspace for managing licensing submissions,
              regulatory decisions, inspection records and compliance
              obligations across a civilian nuclear energy programme.
            </p>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <Building2 size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Regulatory Independence
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Governance principle
                </p>
              </div>
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Regulatory decisions, reviews and oversight records should be
              managed independently from project development and operator
              delivery functions.
            </p>
            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <BadgeCheck size={14} />
              Independence principle highlighted
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Licensing Records"
            value={String(licences.length).padStart(2, "0")}
            detail="All programme submissions"
            icon={FileCheck2}
            tone="bg-cyan-400/10 text-cyan-300"
          />
          <MetricCard
            label="Under Review"
            value={String(licences.filter((x) => x.status === "Under Review").length).padStart(2, "0")}
            detail="Awaiting review outcome"
            icon={Clock3}
            tone="bg-sky-400/10 text-sky-300"
          />
          <MetricCard
            label="Action Required"
            value={String(licences.filter((x) => x.status === "Action Required").length).padStart(2, "0")}
            detail="Requires follow-up"
            icon={CircleAlert}
            tone="bg-amber-400/10 text-amber-300"
          />
          <MetricCard
            label="Approved Records"
            value={String(licences.filter((x) => x.status === "Approved").length).padStart(2, "0")}
            detail="Recorded demo decisions"
            icon={CheckCircle2}
            tone="bg-emerald-400/10 text-emerald-300"
          />
        </section>

        <section className={`${panel} mt-6 p-5 md:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={17} className="text-cyan-300" />
                <h2 className="text-base font-semibold text-white">
                  Licensing Lifecycle
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                High-level administrative lifecycle overview
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              8 Governance Stages
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {licensingStages.map((stage, index) => (
              <div
                key={stage.number}
                className="relative rounded-xl border border-white/[0.08] bg-[#0b121c] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-cyan-300">
                    {stage.number}
                  </span>
                  <StatusPill
                    status={
                      stage.state === "Completed"
                        ? "Completed"
                        : stage.state === "In Progress"
                          ? "In Progress"
                          : "Upcoming"
                    }
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {stage.title}
                </h3>
                <p className="mt-2 min-h-[54px] text-xs leading-5 text-slate-500">
                  {stage.description}
                </p>
                {index < licensingStages.length - 1 && (
                  <div className="mt-4 hidden text-slate-700 xl:block">
                    <ChevronRight size={15} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-6 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] p-5 md:px-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Regulatory Workspace
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage records, reviews, inspections and obligations
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportRegister}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10"
              >
                <Download size={14} />
                Export Register
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-[#07111b] transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                New Record
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
                    : "border-transparent text-slate-500 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Licences" && (
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
                    placeholder="Search licence ID, title, category or owner..."
                    className="w-full rounded-lg border border-white/10 bg-[#0a111b] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </div>
                <div className="relative">
                  <Filter
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    value={filterStatus}
                    onChange={(event) => setFilterStatus(event.target.value)}
                    className="min-w-[170px] appearance-none rounded-lg border border-white/10 bg-[#0a111b] py-2.5 pl-9 pr-4 text-xs text-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>Approved</option>
                    <option>Under Review</option>
                    <option>Draft</option>
                    <option>Action Required</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pr-4 font-semibold">Record</th>
                      <th className="pb-3 pr-4 font-semibold">Category</th>
                      <th className="pb-3 pr-4 font-semibold">Authority</th>
                      <th className="pb-3 pr-4 font-semibold">Stage</th>
                      <th className="pb-3 pr-4 font-semibold">Status</th>
                      <th className="pb-3 pr-4 font-semibold">Due Date</th>
                      <th className="pb-3 font-semibold">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLicences.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/[0.05] last:border-0"
                      >
                        <td className="py-4 pr-4">
                          <p className="text-xs font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.id}
                          </p>
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {item.category}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {item.authority}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {item.stage}
                        </td>
                        <td className="py-4 pr-4">
                          <StatusPill status={item.status} />
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {item.due}
                        </td>
                        <td className="py-4 text-xs text-slate-400">
                          {item.owner}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLicences.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-500">
                    No matching records found.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Lifecycle" && (
            <div className="space-y-3 p-5 md:p-6">
              {licensingStages.map((stage) => (
                <div
                  key={stage.number}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-300">
                    {stage.number}
                  </div>
                  <div className="min-w-[220px] flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      {stage.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {stage.description}
                    </p>
                  </div>
                  <StatusPill
                    status={
                      stage.state === "Completed"
                        ? "Completed"
                        : stage.state === "In Progress"
                          ? "In Progress"
                          : "Upcoming"
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Inspections" && (
            <div className="space-y-3 p-5 md:p-6">
              {initialInspections.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <div className="rounded-lg bg-sky-400/10 p-3 text-sky-300">
                    <ClipboardCheck size={18} />
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.id} · {item.area}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600">
                      {item.inspector}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays size={14} />
                    {item.date}
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Obligations" && (
            <div className="overflow-x-auto p-5 md:p-6">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Obligation</th>
                    <th className="pb-3 pr-4 font-semibold">Reference</th>
                    <th className="pb-3 pr-4 font-semibold">Owner</th>
                    <th className="pb-3 pr-4 font-semibold">Due Date</th>
                    <th className="pb-3 pr-4 font-semibold">Priority</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {initialObligations.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/[0.05] last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <p className="text-xs font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {item.id}
                        </p>
                      </td>
                      <td className="py-4 pr-4 text-xs text-slate-400">
                        {item.reference}
                      </td>
                      <td className="py-4 pr-4 text-xs text-slate-400">
                        {item.owner}
                      </td>
                      <td className="py-4 pr-4 text-xs text-slate-400">
                        {item.due}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`text-xs font-semibold ${
                            item.priority === "High"
                              ? "text-rose-300"
                              : item.priority === "Medium"
                                ? "text-amber-300"
                                : "text-slate-400"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-4">
                        <StatusPill status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <FileText size={17} className="text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">
                Document & Evidence Control
              </h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              A future document repository should maintain version history,
              submission references, review comments, access permissions and
              a complete decision audit trail.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/[0.07] bg-[#0b121c] p-3">
                <p className="text-[10px] text-slate-500">Document Versioning</p>
                <p className="mt-1 text-xs font-semibold text-white">Required</p>
              </div>
              <div className="rounded-lg border border-white/[0.07] bg-[#0b121c] p-3">
                <p className="text-[10px] text-slate-500">Decision Audit Trail</p>
                <p className="mt-1 text-xs font-semibold text-white">Required</p>
              </div>
            </div>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <ClipboardList size={17} className="text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">
                Governance Safeguards
              </h3>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                "Independent regulatory decision-making",
                "Role-based access and separation of duties",
                "Traceable review and approval records",
                "Public transparency and accountability",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-400"
                >
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
          <div>
            <p className="text-sm font-semibold text-white">
              Continue to Electricity Generation Management
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Next module: generation reporting and grid integration governance
            </p>
          </div>
          <Link
            href="/energy-os/electricity-generation"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#07111b] transition hover:bg-cyan-300"
          >
            Next Module
            <ArrowRight size={15} />
          </Link>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-[10px] text-slate-600">
          <span>APEXIVEAI ENERGY OS · REGULATORY & LICENSING</span>
          <span>ILLUSTRATIVE DEMO DATA · SESSION ONLY · NOT A LIVE REGULATORY SYSTEM</span>
        </footer>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create Licensing Record
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add a new illustrative register entry
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Record Title
                </label>
                <input
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Enter record title"
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-slate-200 outline-none"
                >
                  <option>Programme Governance</option>
                  <option>Site Assessment</option>
                  <option>Environmental Governance</option>
                  <option>Project Authorization</option>
                  <option>Institutional Capacity</option>
                  <option>Public Information</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Responsible Owner
                </label>
                <input
                  value={newOwner}
                  onChange={(event) => setNewOwner(event.target.value)}
                  placeholder="Enter responsible team or office"
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
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
                onClick={addLicence}
                disabled={!newTitle.trim() || !newOwner.trim()}
                className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#07111b] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Record
              </button>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-600">
              Demo only. Records are stored in the current browser session
              state and are not submitted to a real authority.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}