
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Target,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";

type FindingStatus = "Open" | "In Progress" | "Resolved" | "Overdue";
type Priority = "Critical" | "High" | "Medium" | "Low";

type Finding = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  owner: string;
  dueDate: string;
  status: FindingStatus;
};

type Audit = {
  id: string;
  title: string;
  department: string;
  lead: string;
  date: string;
  status: "Planned" | "In Progress" | "Completed";
};

const initialFindings: Finding[] = [
  {
    id: "SAF-001",
    title: "Governance documentation requires review",
    category: "Governance",
    priority: "High",
    owner: "Safety Governance Office",
    dueDate: "2026-11-28",
    status: "In Progress",
  },
  {
    id: "SAF-002",
    title: "Independent review evidence not completed",
    category: "Independent Oversight",
    priority: "Critical",
    owner: "Independent Review Team",
    dueDate: "2026-11-24",
    status: "Open",
  },
  {
    id: "SAF-003",
    title: "Training records require reconciliation",
    category: "Workforce",
    priority: "Medium",
    owner: "Workforce Office",
    dueDate: "2026-12-05",
    status: "In Progress",
  },
  {
    id: "SAF-004",
    title: "Previous audit documentation verified",
    category: "Documentation",
    priority: "Low",
    owner: "Quality Assurance Office",
    dueDate: "2026-11-15",
    status: "Resolved",
  },
  {
    id: "SAF-005",
    title: "Environmental compliance evidence overdue",
    category: "Environmental Governance",
    priority: "High",
    owner: "Environment Office",
    dueDate: "2026-11-18",
    status: "Overdue",
  },
];

const initialAudits: Audit[] = [
  {
    id: "AUD-2026-001",
    title: "Institutional Safety Governance Audit",
    department: "Safety Governance",
    lead: "Independent Review Team",
    date: "2026-11-26",
    status: "Planned",
  },
  {
    id: "AUD-2026-002",
    title: "Document Control & Evidence Audit",
    department: "Quality Assurance",
    lead: "Quality Review Office",
    date: "2026-11-20",
    status: "In Progress",
  },
  {
    id: "AUD-2026-003",
    title: "Workforce Competency Records Review",
    department: "Workforce",
    lead: "Training Review Team",
    date: "2026-11-12",
    status: "Completed",
  },
];

const statusStyles: Record<string, string> = {
  Open: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  "In Progress": "border-sky-400/20 bg-sky-400/10 text-sky-300",
  Resolved: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Overdue: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  Planned: "border-white/10 bg-white/5 text-slate-300",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

const priorityStyles: Record<Priority, string> = {
  Critical: "text-rose-300",
  High: "text-amber-300",
  Medium: "text-sky-300",
  Low: "text-slate-400",
};

const panel =
  "rounded-2xl border border-white/[0.08] bg-[#101722]/90 shadow-[0_12px_45px_rgba(0,0,0,0.18)]";

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status] ?? statusStyles.Open}`}
    >
      {status}
    </span>
  );
}

function Metric({
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
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-xl border border-white/10 p-3 ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

export default function NuclearSafetyPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [findings, setFindings] = useState(initialFindings);
  const [audits, setAudits] = useState(initialAudits);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Governance");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newOwner, setNewOwner] = useState("");
  const [newDueDate, setNewDueDate] = useState("2026-12-15");

  const tabs = ["Overview", "Safety Findings", "Audit Register", "Corrective Actions"];

  const filteredFindings = useMemo(() => {
    return findings.filter((item) => {
      const matchesSearch =
        `${item.id} ${item.title} ${item.category} ${item.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [findings, search, filterStatus]);

  const openCount = findings.filter(
    (item) => item.status === "Open" || item.status === "Overdue"
  ).length;

  const resolvedCount = findings.filter(
    (item) => item.status === "Resolved"
  ).length;

  function createFinding() {
    if (!newTitle.trim() || !newOwner.trim()) return;

    const item: Finding = {
      id: `SAF-${String(findings.length + 1).padStart(3, "0")}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      owner: newOwner.trim(),
      dueDate: newDueDate,
      status: "Open",
    };

    setFindings((current) => [item, ...current]);
    setNewTitle("");
    setNewOwner("");
    setNewCategory("Governance");
    setNewPriority("Medium");
    setNewDueDate("2026-12-15");
    setShowModal(false);
    setActiveTab("Safety Findings");
  }

  function updateFindingStatus(id: string, status: FindingStatus) {
    setFindings((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  }

  function exportFindings() {
    const header = [
      "ID",
      "Title",
      "Category",
      "Priority",
      "Owner",
      "Due Date",
      "Status",
    ];

    const rows = findings.map((item) => [
      item.id,
      item.title,
      item.category,
      item.priority,
      item.owner,
      item.dueDate,
      item.status,
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
    anchor.download = "apexiveai-nuclear-safety-findings.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function updateAuditStatus(id: string, status: Audit["status"]) {
    setAudits((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
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
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                APEXIVEAI · ENERGY OS
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Nuclear Safety & Compliance
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
              <ShieldAlert size={13} />
              Independent Safety Oversight
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Safety accountability.
              <span className="block text-slate-400">Continuous oversight.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
              A centralized governance workspace for safety audits,
              compliance findings, corrective action tracking and institutional
              accountability throughout a civilian nuclear energy programme.
            </p>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <UserCheck size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Independent Oversight
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Governance safeguard
                </p>
              </div>
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              Safety reviews, findings and verification should have clear
              accountability, independent review authority and documented
              decision-making.
            </p>
            <div className="mt-4 border-t border-white/[0.08] pt-4 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              Oversight and accountability
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Safety Findings"
            value={String(findings.length).padStart(2, "0")}
            detail="Total illustrative records"
            icon={ClipboardList}
            tone="bg-cyan-400/10 text-cyan-300"
          />
          <Metric
            label="Open / Overdue"
            value={String(openCount).padStart(2, "0")}
            detail="Requires management attention"
            icon={AlertCircle}
            tone="bg-rose-400/10 text-rose-300"
          />
          <Metric
            label="Resolved Findings"
            value={String(resolvedCount).padStart(2, "0")}
            detail="Recorded as resolved"
            icon={CheckCircle2}
            tone="bg-emerald-400/10 text-emerald-300"
          />
          <Metric
            label="Audit Programmes"
            value={String(audits.length).padStart(2, "0")}
            detail="Planned and completed reviews"
            icon={ClipboardCheck}
            tone="bg-sky-400/10 text-sky-300"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className={`${panel} p-5 md:p-6`}>
            <div className="flex items-center gap-2">
              <Target size={17} className="text-cyan-300" />
              <h2 className="text-base font-semibold text-white">
                Safety Governance Framework
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Administrative oversight and institutional safety management
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Safety Policy",
                  description: "Approved policy ownership and revision records",
                  icon: Shield,
                },
                {
                  title: "Independent Reviews",
                  description: "Documented review and oversight assignments",
                  icon: UserCheck,
                },
                {
                  title: "Compliance Monitoring",
                  description: "Obligations, findings and review schedules",
                  icon: FileCheck2,
                },
                {
                  title: "Corrective Actions",
                  description: "Assigned actions and closure verification",
                  icon: CheckCircle2,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <item.icon size={19} className="text-cyan-300" />
                  <h3 className="mt-3 text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${panel} p-5 md:p-6`}>
            <div className="flex items-center gap-2">
              <Activity size={17} className="text-cyan-300" />
              <h2 className="text-base font-semibold text-white">
                Findings Overview
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Current status distribution
            </p>

            <div className="mt-6 space-y-5">
              {[
                {
                  label: "Open",
                  count: findings.filter((x) => x.status === "Open").length,
                  color: "bg-amber-400",
                },
                {
                  label: "In Progress",
                  count: findings.filter((x) => x.status === "In Progress").length,
                  color: "bg-sky-400",
                },
                {
                  label: "Resolved",
                  count: findings.filter((x) => x.status === "Resolved").length,
                  color: "bg-emerald-400",
                },
                {
                  label: "Overdue",
                  count: findings.filter((x) => x.status === "Overdue").length,
                  color: "bg-rose-400",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${findings.length ? (item.count / findings.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3">
              <div className="flex items-center gap-2 text-amber-300">
                <AlertCircle size={15} />
                <span className="text-xs font-semibold">Attention Required</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Open and overdue findings should be reviewed by the
                responsible governance teams and escalated according to
                approved institutional procedures.
              </p>
            </div>
          </div>
        </section>

        <section className={`${panel} mt-6 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] p-5 md:px-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Safety Management Workspace
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Findings, audits and corrective action registers
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportFindings}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
              >
                <Download size={14} />
                Export Findings
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-[#07111b] hover:bg-cyan-300"
              >
                <Plus size={15} />
                New Finding
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
                  title: "Audit & Inspection",
                  description:
                    "Plan institutional reviews and preserve independent audit evidence.",
                  icon: ClipboardCheck,
                },
                {
                  title: "Findings Management",
                  description:
                    "Record issues, assign accountable owners and track review status.",
                  icon: AlertCircle,
                },
                {
                  title: "Corrective Action",
                  description:
                    "Document improvement actions and independent closure verification.",
                  icon: CheckCircle2,
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
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Safety Findings" && (
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
                    placeholder="Search finding, category, ID or owner..."
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
                    className="min-w-[160px] appearance-none rounded-lg border border-white/10 bg-[#0a111b] py-2.5 pl-9 pr-4 text-xs text-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pr-4">Finding</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Priority</th>
                      <th className="pb-3 pr-4">Owner</th>
                      <th className="pb-3 pr-4">Due Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFindings.map((item) => (
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
                        <td
                          className={`py-4 pr-4 text-xs font-semibold ${priorityStyles[item.priority]}`}
                        >
                          {item.priority}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {item.owner}
                        </td>
                        <td className="py-4 pr-4 text-xs text-slate-400">
                          {item.dueDate}
                        </td>
                        <td className="py-4">
                          <StatusPill status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredFindings.length === 0 && (
                  <p className="py-10 text-center text-xs text-slate-500">
                    No matching findings found.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Audit Register" && (
            <div className="space-y-3 p-5 md:p-6">
              {audits.map((audit) => (
                <div
                  key={audit.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <div className="rounded-lg bg-cyan-400/10 p-3 text-cyan-300">
                    <ClipboardCheck size={19} />
                  </div>
                  <div className="min-w-[220px] flex-1">
                    <p className="text-sm font-semibold text-white">
                      {audit.title}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {audit.id} · {audit.department}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600">
                      Lead: {audit.lead}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays size={14} />
                    {audit.date}
                  </div>
                  <select
                    value={audit.status}
                    onChange={(event) =>
                      updateAuditStatus(
                        audit.id,
                        event.target.value as Audit["status"]
                      )
                    }
                    className="rounded-lg border border-white/10 bg-[#101722] px-3 py-2 text-xs text-slate-300 outline-none"
                    aria-label={`Update ${audit.id} status`}
                  >
                    <option>Planned</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Corrective Actions" && (
            <div className="space-y-3 p-5 md:p-6">
              {findings.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4"
                >
                  <div className="rounded-lg bg-amber-400/10 p-3 text-amber-300">
                    <CheckCircle2 size={19} />
                  </div>
                  <div className="min-w-[220px] flex-1">
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {item.id} · Responsible: {item.owner}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    Due {item.dueDate}
                  </div>
                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateFindingStatus(
                        item.id,
                        event.target.value as FindingStatus
                      )
                    }
                    className="rounded-lg border border-white/10 bg-[#101722] px-3 py-2 text-xs text-slate-300 outline-none"
                    aria-label={`Update ${item.id} corrective action status`}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Overdue</option>
                  </select>
                </div>
              ))}
              <p className="text-[10px] leading-5 text-slate-600">
                Status changes are illustrative. Actual closure should require
                evidence review and authorized verification.
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <FileText size={17} className="text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">
                Safety Evidence Management
              </h3>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Maintain controlled records of policies, review reports,
              compliance evidence, management responses and approved decisions.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/[0.07] bg-[#0b121c] p-3">
                <p className="text-[10px] text-slate-500">Version History</p>
                <p className="mt-1 text-xs font-semibold text-white">Required</p>
              </div>
              <div className="rounded-lg border border-white/[0.07] bg-[#0b121c] p-3">
                <p className="text-[10px] text-slate-500">Evidence Verification</p>
                <p className="mt-1 text-xs font-semibold text-white">Required</p>
              </div>
            </div>
          </div>

          <div className={`${panel} p-5`}>
            <div className="flex items-center gap-2">
              <Siren size={17} className="text-amber-300" />
              <h3 className="text-sm font-semibold text-white">
                Escalation & Accountability
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Assign a responsible owner to every finding",
                "Record review deadlines and escalation history",
                "Require independent verification before closure",
                "Preserve immutable audit history in production",
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
              Continue to Radiation & Environmental Monitoring
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Next: environmental records, monitoring governance and reporting
            </p>
          </div>
          <Link
            href="/energy-os/radiation-environmental"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#07111b] hover:bg-cyan-300"
          >
            Next Module
            <ArrowRight size={15} />
          </Link>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-[10px] text-slate-600">
          <span>APEXIVEAI ENERGY OS · NUCLEAR SAFETY & COMPLIANCE</span>
          <span>ILLUSTRATIVE DEMO DATA · SESSION ONLY · NOT A LIVE SAFETY SYSTEM</span>
        </footer>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create Safety Finding
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add an illustrative governance finding
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
                  Finding Title
                </label>
                <input
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Enter finding title"
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-slate-200 outline-none"
                >
                  <option>Governance</option>
                  <option>Independent Oversight</option>
                  <option>Workforce</option>
                  <option>Documentation</option>
                  <option>Environmental Governance</option>
                  <option>Compliance</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(event) =>
                      setNewPriority(event.target.value as Priority)
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-slate-200 outline-none"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(event) => setNewDueDate(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0a111b] px-3 py-3 text-sm text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Responsible Owner
                </label>
                <input
                  value={newOwner}
                  onChange={(event) => setNewOwner(event.target.value)}
                  placeholder="Enter responsible office or team"
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
                onClick={createFinding}
                disabled={!newTitle.trim() || !newOwner.trim()}
                className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#07111b] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Finding
              </button>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-600">
              Demo only. No actual safety assessment or regulatory decision
              is performed by this interface.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
