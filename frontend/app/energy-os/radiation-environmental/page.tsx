
"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileBarChart,
  FileCheck2,
  FileText,
  FlaskConical,
  Leaf,
  MapPin,
  Plus,
  RadioTower,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MonitoringRecord = {
  id: string;
  title: string;
  station: string;
  category: "Radiation" | "Water" | "Air" | "Soil";
  value: string;
  unit: string;
  collected: string;
  status: "Reviewed" | "Pending Review" | "Flagged";
  assignedTo: string;
};

type LabResult = {
  id: string;
  sample: string;
  laboratory: string;
  submitted: string;
  result: string;
  status: "Completed" | "In Progress" | "Awaiting Sample";
};

type Station = {
  id: string;
  name: string;
  location: string;
  type: string;
  lastUpdated: string;
  status: "Active" | "Maintenance" | "Offline";
};

type EnvironmentalAlert = {
  id: string;
  title: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  date: string;
  status: "Open" | "Under Review" | "Closed";
};

const initialRecords: MonitoringRecord[] = [
  {
    id: "MON-2026-001",
    title: "Perimeter monitoring record",
    station: "North Perimeter Station",
    category: "Radiation",
    value: "0.12",
    unit: "µSv/h",
    collected: "2026-11-21",
    status: "Reviewed",
    assignedTo: "Environmental Team A",
  },
  {
    id: "MON-2026-002",
    title: "Surface water sample",
    station: "River Monitoring Point 01",
    category: "Water",
    value: "—",
    unit: "Laboratory result",
    collected: "2026-11-21",
    status: "Pending Review",
    assignedTo: "Water Quality Team",
  },
  {
    id: "MON-2026-003",
    title: "Ambient air sample",
    station: "East Boundary Station",
    category: "Air",
    value: "—",
    unit: "Laboratory result",
    collected: "2026-11-20",
    status: "Reviewed",
    assignedTo: "Environmental Team B",
  },
  {
    id: "MON-2026-004",
    title: "Soil sampling record",
    station: "Site Reference Area",
    category: "Soil",
    value: "—",
    unit: "Laboratory result",
    collected: "2026-11-19",
    status: "Flagged",
    assignedTo: "Environmental Team A",
  },
  {
    id: "MON-2026-005",
    title: "Boundary monitoring record",
    station: "South Perimeter Station",
    category: "Radiation",
    value: "0.10",
    unit: "µSv/h",
    collected: "2026-11-18",
    status: "Reviewed",
    assignedTo: "Monitoring Operations",
  },
];

const initialLabResults: LabResult[] = [
  {
    id: "LAB-2026-021",
    sample: "Surface Water / SW-021",
    laboratory: "National Environmental Laboratory",
    submitted: "2026-11-21",
    result: "Awaiting report",
    status: "In Progress",
  },
  {
    id: "LAB-2026-020",
    sample: "Soil / SL-020",
    laboratory: "Environmental Testing Unit",
    submitted: "2026-11-19",
    result: "Report requires review",
    status: "Completed",
  },
  {
    id: "LAB-2026-019",
    sample: "Air Filter / AF-019",
    laboratory: "National Environmental Laboratory",
    submitted: "2026-11-18",
    result: "Report received",
    status: "Completed",
  },
];

const initialStations: Station[] = [
  {
    id: "STA-001",
    name: "North Perimeter Station",
    location: "Northern boundary",
    type: "Environmental monitoring",
    lastUpdated: "2026-11-21 09:15",
    status: "Active",
  },
  {
    id: "STA-002",
    name: "East Boundary Station",
    location: "Eastern boundary",
    type: "Air quality monitoring",
    lastUpdated: "2026-11-21 08:40",
    status: "Active",
  },
  {
    id: "STA-003",
    name: "River Monitoring Point 01",
    location: "Surface water sampling point",
    type: "Water sampling",
    lastUpdated: "2026-11-20 14:10",
    status: "Active",
  },
  {
    id: "STA-004",
    name: "South Perimeter Station",
    location: "Southern boundary",
    type: "Environmental monitoring",
    lastUpdated: "2026-11-19 16:30",
    status: "Maintenance",
  },
  {
    id: "STA-005",
    name: "Site Reference Area",
    location: "Reference sampling area",
    type: "Soil sampling",
    lastUpdated: "2026-11-18 11:20",
    status: "Offline",
  },
];

const initialAlerts: EnvironmentalAlert[] = [
  {
    id: "ALT-2026-011",
    title: "Soil sample record requires review",
    location: "Site Reference Area",
    priority: "High",
    date: "2026-11-21",
    status: "Open",
  },
  {
    id: "ALT-2026-010",
    title: "Laboratory report is awaiting approval",
    location: "Water Monitoring Programme",
    priority: "Medium",
    date: "2026-11-20",
    status: "Under Review",
  },
  {
    id: "ALT-2026-009",
    title: "Monitoring station maintenance follow-up",
    location: "South Perimeter Station",
    priority: "Low",
    date: "2026-11-18",
    status: "Closed",
  },
];

const tabs = [
  "Overview",
  "Monitoring Records",
  "Laboratory Results",
  "Monitoring Stations",
  "Alerts & Escalations",
] as const;

type Tab = (typeof tabs)[number];

const statusStyles: Record<string, string> = {
  Reviewed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  "Pending Review": "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Flagged: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  "In Progress": "border-sky-400/20 bg-sky-400/10 text-sky-300",
  "Awaiting Sample": "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Maintenance: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Offline: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  Open: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  "Under Review": "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Closed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  High: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  Medium: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Low: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
        statusStyles[value] ??
        "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      {value}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 transition hover:border-white/[0.14]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-xl border border-white/[0.06] p-3 ${accent}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function RadiationEnvironmentalPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [records, setRecords] = useState(initialRecords);
  const [labResults] = useState(initialLabResults);
  const [stations, setStations] = useState(initialStations);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    title: "",
    station: "",
    category: "Radiation",
    value: "",
    unit: "µSv/h",
    collected: "2026-11-22",
    assignedTo: "",
  });

  const [alertForm, setAlertForm] = useState({
    title: "",
    location: "",
    priority: "Medium",
    date: "2026-11-22",
  });

  const filteredRecords = useMemo(() => {
    const term = search.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.id,
          record.title,
          record.station,
          record.category,
          record.assignedTo,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        categoryFilter === "All" || record.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [records, search, categoryFilter, statusFilter]);

  const openFindings = alerts.filter(
    (alert) => alert.status !== "Closed",
  ).length;

  function exportCSV() {
    const rows = [
      [
        "Record ID",
        "Title",
        "Station",
        "Category",
        "Value",
        "Unit",
        "Collection Date",
        "Status",
        "Assigned Team",
      ],
      ...filteredRecords.map((record) => [
        record.id,
        record.title,
        record.station,
        record.category,
        record.value,
        record.unit,
        record.collected,
        record.status,
        record.assignedTo,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "apexiveai-environmental-monitoring-records.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextRecord: MonitoringRecord = {
      id: `MON-2026-${String(records.length + 1).padStart(3, "0")}`,
      title: form.title,
      station: form.station,
      category: form.category as MonitoringRecord["category"],
      value: form.value || "—",
      unit: form.unit,
      collected: form.collected,
      status: "Pending Review",
      assignedTo: form.assignedTo || "Unassigned",
    };

    setRecords((current) => [nextRecord, ...current]);
    setShowRecordModal(false);
    setForm({
      title: "",
      station: "",
      category: "Radiation",
      value: "",
      unit: "µSv/h",
      collected: "2026-11-22",
      assignedTo: "",
    });
    setNotice("Monitoring record added to this demo session.");
  }

  function addAlert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextAlert: EnvironmentalAlert = {
      id: `ALT-2026-${String(alerts.length + 9).padStart(3, "0")}`,
      title: alertForm.title,
      location: alertForm.location,
      priority: alertForm.priority as EnvironmentalAlert["priority"],
      date: alertForm.date,
      status: "Open",
    };

    setAlerts((current) => [nextAlert, ...current]);
    setShowAlertModal(false);
    setAlertForm({
      title: "",
      location: "",
      priority: "Medium",
      date: "2026-11-22",
    });
    setNotice("Environmental alert created in this demo session.");
  }

  function updateAlertStatus(id: string, status: EnvironmentalAlert["status"]) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, status } : alert,
      ),
    );
  }

  function updateStationStatus(id: string, status: Station["status"]) {
    setStations((current) =>
      current.map((station) =>
        station.id === id ? { ...station, status } : station,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#080d14] text-slate-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.06] blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <Leaf className="text-cyan-300" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.16em] text-white">
                APEXIVE<span className="text-cyan-400">AI</span>
              </p>
              <p className="text-[10px] tracking-[0.16em] text-slate-500">
                ENERGY OS / ENVIRONMENTAL INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-amber-300 sm:inline-flex">
              DEMO ENVIRONMENT
            </span>
            <button
              onClick={() => setNotice("No new notifications in this demo.")}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-200">
              EA
            </div>
          </div>
        </header>

        <div className="mb-7">
          <Link
            href="/energy-os"
            className="mb-5 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-cyan-300"
          >
            <ArrowLeft size={14} />
            Back to Energy OS
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Module 06 / 12
                </span>
                <span className="text-[10px] text-slate-600">
                  ENVIRONMENTAL GOVERNANCE
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Radiation & Environmental
                <span className="block text-cyan-300">
                  Monitoring
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Centralized oversight for environmental monitoring records,
                radiation measurement documentation, laboratory workflows,
                monitoring stations and compliance follow-up.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08]"
              >
                <Download size={15} />
                Export Records
              </button>
              <button
                onClick={() => setShowRecordModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                New Monitoring Record
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-300" size={17} />
          <div>
            <p className="text-xs font-semibold text-amber-200">
              Demonstration data — not connected to live monitoring systems
            </p>
            <p className="mt-1 text-[11px] leading-5 text-amber-100/60">
              All values, station statuses and records shown here are
              illustrative. This workspace is for administrative record
              management only and must not be used for operational safety
              decisions or exposure assessment.
            </p>
          </div>
        </div>

        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-xs text-emerald-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} />
              {notice}
            </span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Monitoring Records"
            value={String(records.length).padStart(2, "0")}
            detail="Records in this demo workspace"
            icon={Activity}
            accent="bg-cyan-400/10 text-cyan-300"
          />
          <MetricCard
            label="Pending Review"
            value={String(
              records.filter((record) => record.status === "Pending Review")
                .length,
            ).padStart(2, "0")}
            detail="Records awaiting administrative review"
            icon={ClipboardCheck}
            accent="bg-amber-400/10 text-amber-300"
          />
          <MetricCard
            label="Active Stations"
            value={String(
              stations.filter((station) => station.status === "Active").length,
            ).padStart(2, "0")}
            detail="Illustrative station registry status"
            icon={RadioTower}
            accent="bg-emerald-400/10 text-emerald-300"
          />
          <MetricCard
            label="Open Alerts"
            value={String(openFindings).padStart(2, "0")}
            detail="Alerts not yet marked closed"
            icon={AlertCircle}
            accent="bg-rose-400/10 text-rose-300"
          />
        </section>

        <div className="mb-6 overflow-x-auto border-b border-white/[0.08]">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-xs font-medium transition ${
                  activeTab === tab
                    ? "text-cyan-300"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Overview" && (
          <div className="space-y-6">
            <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 sm:p-6">
                <SectionHeading
                  eyebrow="Monitoring programme"
                  title="Environmental Coverage"
                  description="Administrative overview of registered monitoring categories."
                />
                <div className="space-y-5">
                  {[
                    {
                      name: "Radiation Records",
                      count: records.filter((r) => r.category === "Radiation")
                        .length,
                      total: 8,
                      color: "bg-cyan-400",
                    },
                    {
                      name: "Water Sampling",
                      count: records.filter((r) => r.category === "Water")
                        .length,
                      total: 6,
                      color: "bg-sky-400",
                    },
                    {
                      name: "Air Monitoring",
                      count: records.filter((r) => r.category === "Air")
                        .length,
                      total: 5,
                      color: "bg-violet-400",
                    },
                    {
                      name: "Soil Sampling",
                      count: records.filter((r) => r.category === "Soil")
                        .length,
                      total: 5,
                      color: "bg-emerald-400",
                    },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-slate-300">
                          {item.name}
                        </span>
                        <span className="text-[11px] tabular-nums text-slate-500">
                          {item.count} / {item.total} demo records
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{
                            width: `${Math.min(
                              (item.count / item.total) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[10px] leading-5 text-slate-600">
                  Coverage bars represent sample administrative record counts,
                  not physical monitoring coverage or safety performance.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 sm:p-6">
                <SectionHeading
                  eyebrow="Data governance"
                  title="Record Status"
                  description="Current review status across the demo register."
                />
                <div className="space-y-3">
                  {[
                    {
                      label: "Reviewed",
                      count: records.filter((r) => r.status === "Reviewed")
                        .length,
                      color: "bg-emerald-400",
                    },
                    {
                      label: "Pending Review",
                      count: records.filter(
                        (r) => r.status === "Pending Review",
                      ).length,
                      color: "bg-amber-400",
                    },
                    {
                      label: "Flagged",
                      count: records.filter((r) => r.status === "Flagged")
                        .length,
                      color: "bg-rose-400",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
                    >
                      <span className="flex items-center gap-2 text-xs text-slate-300">
                        <span
                          className={`h-2 w-2 rounded-full ${item.color}`}
                        />
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-white">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-semibold">
                      Governance workflow
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    Maintain traceable records, reviewer assignments,
                    laboratory evidence and documented approvals.
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5">
                <SectionHeading
                  eyebrow="Latest activity"
                  title="Recent Monitoring Records"
                  description="Most recently registered monitoring entries."
                  action={
                    <button
                      onClick={() => setActiveTab("Monitoring Records")}
                      className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      View all <ArrowRight className="ml-1 inline" size={13} />
                    </button>
                  }
                />
                <div className="space-y-2">
                  {records.slice(0, 4).map((record) => (
                    <div
                      key={record.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-200">
                          {record.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {record.id} · {record.station}
                        </p>
                      </div>
                      <StatusBadge value={record.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5">
                <SectionHeading
                  eyebrow="Environmental oversight"
                  title="Alert & Escalation Queue"
                  description="Items requiring documented follow-up."
                  action={
                    <button
                      onClick={() => setActiveTab("Alerts & Escalations")}
                      className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      Open queue{" "}
                      <ArrowRight className="ml-1 inline" size={13} />
                    </button>
                  }
                />
                <div className="space-y-2">
                  {alerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-200">
                          {alert.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {alert.location} · {alert.date}
                        </p>
                      </div>
                      <StatusBadge value={alert.priority} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "Monitoring Records" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 sm:p-6">
            <SectionHeading
              eyebrow="Environmental data registry"
              title="Monitoring Records"
              description="Search, filter and manage administrative monitoring entries."
              action={
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} />
                  Export CSV
                </button>
              }
            />

            <div className="mb-5 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={15}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search records, stations, teams..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0b111a] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#0b111a] px-4 py-3 text-xs text-slate-300 outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Radiation">Radiation</option>
                <option value="Water">Water</option>
                <option value="Air">Air</option>
                <option value="Soil">Soil</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#0b111a] px-4 py-3 text-xs text-slate-300 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3 font-semibold">Record</th>
                    <th className="px-3 py-3 font-semibold">Station</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Recorded Value</th>
                    <th className="px-3 py-3 font-semibold">Date</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-white/[0.04] text-xs transition hover:bg-white/[0.02]"
                    >
                      <td className="px-3 py-4">
                        <p className="font-medium text-slate-200">
                          {record.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-600">
                          {record.id}
                        </p>
                      </td>
                      <td className="px-3 py-4 text-slate-400">
                        {record.station}
                      </td>
                      <td className="px-3 py-4 text-slate-400">
                        {record.category}
                      </td>
                      <td className="px-3 py-4 tabular-nums text-slate-300">
                        {record.value}{" "}
                        <span className="text-slate-600">{record.unit}</span>
                      </td>
                      <td className="px-3 py-4 text-slate-400">
                        {record.collected}
                      </td>
                      <td className="px-3 py-4">
                        <StatusBadge value={record.status} />
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-xs text-slate-500"
                      >
                        No monitoring records match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[10px] text-slate-600">
              Showing {filteredRecords.length} of {records.length} demo records.
            </p>
          </section>
        )}

        {activeTab === "Laboratory Results" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 sm:p-6">
            <SectionHeading
              eyebrow="Sample & laboratory workflow"
              title="Laboratory Results"
              description="Track sample submissions, laboratory reports and review status."
            />
            <div className="mb-5 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Total Submissions"
                value={String(labResults.length).padStart(2, "0")}
                detail="Illustrative sample submissions"
                icon={FlaskConical}
                accent="bg-cyan-400/10 text-cyan-300"
              />
              <MetricCard
                label="Completed"
                value={String(
                  labResults.filter((item) => item.status === "Completed")
                    .length,
                ).padStart(2, "0")}
                detail="Reports received in demo data"
                icon={FileCheck2}
                accent="bg-emerald-400/10 text-emerald-300"
              />
              <MetricCard
                label="In Progress"
                value={String(
                  labResults.filter((item) => item.status === "In Progress")
                    .length,
                ).padStart(2, "0")}
                detail="Awaiting laboratory workflow completion"
                icon={FileBarChart}
                accent="bg-amber-400/10 text-amber-300"
              />
            </div>
            <div className="space-y-3">
              {labResults.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 md:flex-row md:items-center"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                      <FlaskConical size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {item.sample}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.id} · {item.laboratory}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        Submitted {item.submitted}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <span className="text-[11px] text-slate-400">
                      {item.result}
                    </span>
                    <StatusBadge value={item.status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
                <FileText size={15} />
                Laboratory evidence management
              </p>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                A production workflow should retain original laboratory
                reports, sample chain-of-custody documentation, reviewer
                identity, approval history and immutable audit events.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Monitoring Stations" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 sm:p-6">
            <SectionHeading
              eyebrow="Station directory"
              title="Monitoring Stations"
              description="Administrative inventory of registered monitoring and sampling locations."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="rounded-xl border border-white/[0.07] bg-[#0c131d] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] p-3 text-cyan-300">
                      <RadioTower size={18} />
                    </div>
                    <StatusBadge value={station.status} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {station.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {station.id}
                  </p>
                  <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-3">
                    <p className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin size={13} className="text-slate-600" />
                      {station.location}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Activity size={13} className="text-slate-600" />
                      {station.type}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] text-slate-500">
                      <CalendarDays size={13} className="text-slate-600" />
                      Updated {station.lastUpdated}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-white/[0.06] pt-3">
                    <label className="mb-2 block text-[10px] text-slate-500">
                      Demo registry status
                    </label>
                    <select
                      value={station.status}
                      onChange={(e) =>
                        updateStationStatus(
                          station.id,
                          e.target.value as Station["status"],
                        )
                      }
                      className="w-full rounded-lg border border-white/[0.08] bg-[#101722] px-3 py-2 text-[11px] text-slate-300 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Alerts & Escalations" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#101722] p-5 sm:p-6">
            <SectionHeading
              eyebrow="Environmental follow-up"
              title="Alerts & Escalations"
              description="Document review items, assign priority and track closure."
              action={
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} />
                  Create Alert
                </button>
              }
            />
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              {(["High", "Medium", "Low"] as const).map((priority) => (
                <div
                  key={priority}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {priority} priority
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {alerts.filter((item) => item.priority === priority).length}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#0c131d] p-4 lg:flex-row lg:items-center"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-rose-400/15 bg-rose-400/[0.07] p-3 text-rose-300">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {alert.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {alert.id} · {alert.location}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        Reported {alert.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge value={alert.priority} />
                    <select
                      value={alert.status}
                      onChange={(e) =>
                        updateAlertStatus(
                          alert.id,
                          e.target.value as EnvironmentalAlert["status"],
                        )
                      }
                      className="rounded-lg border border-white/[0.08] bg-[#101722] px-3 py-2 text-[11px] text-slate-300 outline-none"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-[#101722] p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">
                  Environmental Governance & Accountability
                </h3>
                <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-500">
                  The production platform should support independent review,
                  controlled access, evidence retention, audit trails and
                  transparent reporting under the applicable national
                  regulatory framework.
                </p>
              </div>
            </div>
            <span className="whitespace-nowrap rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5 text-[9px] font-semibold tracking-wider text-amber-300">
              SESSION-ONLY DATA
            </span>
          </div>
        </section>

        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-white/[0.07] pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center">
          <p>APEXIVEAI ENERGY OS · RADIATION & ENVIRONMENTAL MONITORING</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>DEMO DATA</span>
            <span>•</span>
            <span>NOT CONNECTED TO LIVE SYSTEMS</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </footer>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Link
            href="/energy-os/nuclear-safety"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            <ArrowLeft size={14} />
            Previous: Nuclear Safety
          </Link>
          <Link
            href="/energy-os/emergency-response"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Next: Emergency Preparedness
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#111a26] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Environmental registry
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  New Monitoring Record
                </h2>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addRecord} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Record Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Environmental sampling record"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Monitoring Station *
                  </label>
                  <input
                    required
                    value={form.station}
                    onChange={(e) =>
                      setForm({ ...form, station: e.target.value })
                    }
                    placeholder="Station name"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                  >
                    <option value="Radiation">Radiation</option>
                    <option value="Water">Water</option>
                    <option value="Air">Air</option>
                    <option value="Soil">Soil</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Recorded Value
                  </label>
                  <input
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: e.target.value })
                    }
                    placeholder="Optional"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Unit / Result Type
                  </label>
                  <input
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Collection Date
                  </label>
                  <input
                    type="date"
                    value={form.collected}
                    onChange={(e) =>
                      setForm({ ...form, collected: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Assigned Team
                  </label>
                  <input
                    value={form.assignedTo}
                    onChange={(e) =>
                      setForm({ ...form, assignedTo: e.target.value })
                    }
                    placeholder="Team or reviewer"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111a26] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Environmental governance
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  Create Follow-up Alert
                </h2>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addAlert} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Alert Description *
                </label>
                <input
                  required
                  value={alertForm.title}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, title: e.target.value })
                  }
                  placeholder="Describe the item requiring follow-up"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Location / Programme *
                </label>
                <input
                  required
                  value={alertForm.location}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, location: e.target.value })
                  }
                  placeholder="Location or programme name"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Priority
                  </label>
                  <select
                    value={alertForm.priority}
                    onChange={(e) =>
                      setAlertForm({
                        ...alertForm,
                        priority: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Report Date
                  </label>
                  <input
                    type="date"
                    value={alertForm.date}
                    onChange={(e) =>
                      setAlertForm({ ...alertForm, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
