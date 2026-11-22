
"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  Headphones,
  MapPin,
  Plus,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Incident = {
  id: string;
  title: string;
  category: string;
  location: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Coordinating" | "Under Review" | "Closed";
  reportedAt: string;
  lead: string;
};

type EmergencyPlan = {
  id: string;
  name: string;
  category: string;
  owner: string;
  lastReviewed: string;
  nextReview: string;
  status: "Approved" | "Under Review" | "Draft";
};

type Drill = {
  id: string;
  name: string;
  type: string;
  scheduled: string;
  coordinator: string;
  status: "Scheduled" | "Completed" | "Planning";
};

type ResponseTeam = {
  id: string;
  name: string;
  organization: string;
  coordinator: string;
  contact: string;
  status: "Available" | "Assigned" | "Standby";
};

const initialIncidents: Incident[] = [
  {
    id: "INC-2026-014",
    title: "Emergency notification workflow review",
    category: "Communication",
    location: "Programme Coordination Office",
    priority: "High",
    status: "Coordinating",
    reportedAt: "2026-11-22 08:30",
    lead: "Coordination Team A",
  },
  {
    id: "INC-2026-013",
    title: "Preparedness documentation discrepancy",
    category: "Governance",
    location: "Document Control Unit",
    priority: "Medium",
    status: "Under Review",
    reportedAt: "2026-11-21 15:20",
    lead: "Compliance Office",
  },
  {
    id: "INC-2026-012",
    title: "Scheduled exercise follow-up",
    category: "Exercise",
    location: "Training Coordination Centre",
    priority: "Low",
    status: "Closed",
    reportedAt: "2026-11-20 10:00",
    lead: "Training Unit",
  },
  {
    id: "INC-2026-011",
    title: "Inter-agency contact register update",
    category: "Coordination",
    location: "National Coordination Desk",
    priority: "Medium",
    status: "Open",
    reportedAt: "2026-11-19 09:45",
    lead: "External Relations Team",
  },
];

const initialPlans: EmergencyPlan[] = [
  {
    id: "ERP-001",
    name: "National Emergency Preparedness Framework",
    category: "National Governance",
    owner: "Programme Secretariat",
    lastReviewed: "2026-10-15",
    nextReview: "2027-01-15",
    status: "Approved",
  },
  {
    id: "ERP-002",
    name: "Emergency Communication Plan",
    category: "Communication",
    owner: "Public Information Office",
    lastReviewed: "2026-09-22",
    nextReview: "2026-12-22",
    status: "Approved",
  },
  {
    id: "ERP-003",
    name: "Inter-agency Coordination Plan",
    category: "Coordination",
    owner: "Coordination Secretariat",
    lastReviewed: "2026-11-01",
    nextReview: "2027-02-01",
    status: "Under Review",
  },
  {
    id: "ERP-004",
    name: "Emergency Exercise Programme",
    category: "Training & Exercises",
    owner: "Training Directorate",
    lastReviewed: "2026-08-10",
    nextReview: "2026-12-10",
    status: "Draft",
  },
];

const initialDrills: Drill[] = [
  {
    id: "EX-2026-008",
    name: "National Coordination Tabletop Exercise",
    type: "Tabletop Exercise",
    scheduled: "2026-12-10",
    coordinator: "Training Directorate",
    status: "Scheduled",
  },
  {
    id: "EX-2026-007",
    name: "Public Information Coordination Exercise",
    type: "Communication Exercise",
    scheduled: "2026-11-15",
    coordinator: "Public Information Office",
    status: "Completed",
  },
  {
    id: "EX-2026-006",
    name: "Inter-agency Readiness Workshop",
    type: "Readiness Workshop",
    scheduled: "2026-12-18",
    coordinator: "Programme Secretariat",
    status: "Planning",
  },
];

const initialTeams: ResponseTeam[] = [
  {
    id: "TEAM-001",
    name: "National Coordination Desk",
    organization: "Programme Secretariat",
    coordinator: "Coordination Lead",
    contact: "Internal directory",
    status: "Available",
  },
  {
    id: "TEAM-002",
    name: "Public Information Team",
    organization: "Public Information Office",
    coordinator: "Communications Lead",
    contact: "Internal directory",
    status: "Available",
  },
  {
    id: "TEAM-003",
    name: "Emergency Planning Unit",
    organization: "Emergency Preparedness Directorate",
    coordinator: "Planning Lead",
    contact: "Internal directory",
    status: "Standby",
  },
  {
    id: "TEAM-004",
    name: "Regulatory Liaison Team",
    organization: "Regulatory Liaison Office",
    coordinator: "Liaison Lead",
    contact: "Internal directory",
    status: "Assigned",
  },
];

const tabs = [
  "Overview",
  "Incident Register",
  "Emergency Plans",
  "Drills & Exercises",
  "Response Teams",
] as const;

type Tab = (typeof tabs)[number];

const badgeStyles: Record<string, string> = {
  Critical: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  High: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Low: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  Open: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  Coordinating: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  "Under Review": "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Closed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Approved: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Draft: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  Scheduled: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  Completed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Planning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Available: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Assigned: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  Standby: "border-amber-400/25 bg-amber-400/10 text-amber-300",
};

function Badge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
        badgeStyles[value] ??
        "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      {value}
    </span>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5 transition hover:border-white/[0.14]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-xl border border-white/[0.06] p-3 ${color}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-[10px] text-slate-500">{detail}</p>
    </div>
  );
}

function Heading({
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

export default function EmergencyResponsePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [incidents, setIncidents] = useState(initialIncidents);
  const [plans, setPlans] = useState(initialPlans);
  const [drills, setDrills] = useState(initialDrills);
  const [teams, setTeams] = useState(initialTeams);
  const [search, setSearch] = useState("");
  const [incidentFilter, setIncidentFilter] = useState("All");
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [incidentForm, setIncidentForm] = useState({
    title: "",
    category: "Governance",
    location: "",
    priority: "Medium",
    lead: "",
  });

  const [planForm, setPlanForm] = useState({
    name: "",
    category: "National Governance",
    owner: "",
    nextReview: "2027-01-15",
  });

  const [drillForm, setDrillForm] = useState({
    name: "",
    type: "Tabletop Exercise",
    scheduled: "2026-12-20",
    coordinator: "",
  });

  const filteredIncidents = useMemo(() => {
    const term = search.toLowerCase().trim();

    return incidents.filter((incident) => {
      const matchesSearch =
        !term ||
        [
          incident.id,
          incident.title,
          incident.category,
          incident.location,
          incident.lead,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        incidentFilter === "All" || incident.status === incidentFilter;

      return matchesSearch && matchesStatus;
    });
  }, [incidents, search, incidentFilter]);

  const openIncidents = incidents.filter(
    (item) => item.status !== "Closed",
  ).length;

  const pendingPlans = plans.filter(
    (item) => item.status !== "Approved",
  ).length;

  function exportIncidents() {
    const rows = [
      [
        "Incident ID",
        "Title",
        "Category",
        "Location",
        "Priority",
        "Status",
        "Reported At",
        "Lead",
      ],
      ...filteredIncidents.map((item) => [
        item.id,
        item.title,
        item.category,
        item.location,
        item.priority,
        item.status,
        item.reportedAt,
        item.lead,
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
    anchor.download = "apexiveai-emergency-incident-register.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function createIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Incident = {
      id: `INC-2026-${String(incidents.length + 11).padStart(3, "0")}`,
      title: incidentForm.title,
      category: incidentForm.category,
      location: incidentForm.location,
      priority: incidentForm.priority as Incident["priority"],
      status: "Open",
      reportedAt: new Date().toLocaleString(),
      lead: incidentForm.lead || "Unassigned",
    };

    setIncidents((current) => [next, ...current]);
    setShowIncidentModal(false);
    setIncidentForm({
      title: "",
      category: "Governance",
      location: "",
      priority: "Medium",
      lead: "",
    });
    setNotice("Incident record created in this demo session.");
  }

  function createPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: EmergencyPlan = {
      id: `ERP-${String(plans.length + 1).padStart(3, "0")}`,
      name: planForm.name,
      category: planForm.category,
      owner: planForm.owner || "Unassigned",
      lastReviewed: "Not yet reviewed",
      nextReview: planForm.nextReview,
      status: "Draft",
    };

    setPlans((current) => [next, ...current]);
    setShowPlanModal(false);
    setPlanForm({
      name: "",
      category: "National Governance",
      owner: "",
      nextReview: "2027-01-15",
    });
    setNotice("Emergency plan added as a draft in this demo session.");
  }

  function createDrill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Drill = {
      id: `EX-2026-${String(drills.length + 6).padStart(3, "0")}`,
      name: drillForm.name,
      type: drillForm.type,
      scheduled: drillForm.scheduled,
      coordinator: drillForm.coordinator || "Unassigned",
      status: "Planning",
    };

    setDrills((current) => [next, ...current]);
    setShowDrillModal(false);
    setDrillForm({
      name: "",
      type: "Tabletop Exercise",
      scheduled: "2026-12-20",
      coordinator: "",
    });
    setNotice("Exercise added to the demo planning register.");
  }

  function updateIncidentStatus(
    id: string,
    status: Incident["status"],
  ) {
    setIncidents((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  function updatePlanStatus(id: string, status: EmergencyPlan["status"]) {
    setPlans((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  function updateDrillStatus(id: string, status: Drill["status"]) {
    setDrills((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  function updateTeamStatus(id: string, status: ResponseTeam["status"]) {
    setTeams((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#080d14] text-slate-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.07] blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-500/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldAlert className="text-cyan-300" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.16em] text-white">
                APEXIVE<span className="text-cyan-400">AI</span>
              </p>
              <p className="text-[10px] tracking-[0.16em] text-slate-500">
                ENERGY OS / EMERGENCY OPERATIONS
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
              EO
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
                  Module 07 / 12
                </span>
                <span className="text-[10px] text-slate-600">
                  NATIONAL PREPAREDNESS & COORDINATION
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Emergency Preparedness
                <span className="block text-cyan-300">& Response</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                A centralized administrative workspace for preparedness
                planning, incident documentation, inter-agency coordination,
                emergency exercises and accountability reporting.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportIncidents}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08]"
              >
                <Download size={15} />
                Export Register
              </button>
              <button
                onClick={() => setShowIncidentModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                New Incident Record
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={17} />
          <div>
            <p className="text-xs font-semibold text-amber-200">
              Demonstration workspace — not an operational emergency system
            </p>
            <p className="mt-1 text-[11px] leading-5 text-amber-100/60">
              All incidents, teams, plans and exercise entries are illustrative.
              This module does not dispatch responders, issue official public
              warnings or replace national emergency authorities and approved
              emergency procedures.
            </p>
          </div>
        </div>

        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-xs text-emerald-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} />
              {notice}
            </span>
            <button onClick={() => setNotice("")} aria-label="Dismiss message">
              <X size={15} />
            </button>
          </div>
        )}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Registered Incidents"
            value={String(incidents.length).padStart(2, "0")}
            detail="Illustrative incident register"
            icon={AlertOctagon}
            color="bg-rose-400/10 text-rose-300"
          />
          <Metric
            label="Open Work Items"
            value={String(openIncidents).padStart(2, "0")}
            detail="Incidents not marked closed"
            icon={Activity}
            color="bg-amber-400/10 text-amber-300"
          />
          <Metric
            label="Preparedness Plans"
            value={String(plans.length).padStart(2, "0")}
            detail={`${pendingPlans} require review or drafting`}
            icon={FileText}
            color="bg-cyan-400/10 text-cyan-300"
          />
          <Metric
            label="Response Teams"
            value={String(teams.length).padStart(2, "0")}
            detail="Registered coordination groups"
            icon={Users}
            color="bg-emerald-400/10 text-emerald-300"
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
            <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111a26]">
                <div className="relative border-b border-white/[0.06] bg-gradient-to-r from-cyan-500/[0.09] to-transparent p-6">
                  <div className="absolute right-6 top-6 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3 text-cyan-300">
                    <Radio size={22} />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Coordination workspace
                  </p>
                  <h2 className="mt-2 max-w-lg text-xl font-semibold text-white">
                    National Preparedness Coordination
                  </h2>
                  <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400">
                    Organize institutional responsibilities, maintain
                    controlled documentation and coordinate authorized
                    stakeholders through approved channels.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] text-slate-300">
                      <ShieldCheck className="mr-1 inline" size={12} />
                      Governance oversight
                    </span>
                    <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] text-slate-300">
                      <Users className="mr-1 inline" size={12} />
                      Inter-agency coordination
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  {[
                    ["Plans", plans.length, "Registered"],
                    ["Exercises", drills.length, "In programme"],
                    ["Teams", teams.length, "In directory"],
                  ].map(([label, value, detail]) => (
                    <div
                      key={String(label)}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <p className="text-[10px] text-slate-500">{label}</p>
                      <p className="mt-1 text-2xl font-semibold text-white">
                        {value}
                      </p>
                      <p className="text-[10px] text-slate-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5">
                <Heading
                  eyebrow="Incident overview"
                  title="Register Status"
                  description="Current administrative status of demo records."
                />
                <div className="space-y-3">
                  {(
                    [
                      ["Open", "bg-rose-400"],
                      ["Coordinating", "bg-sky-400"],
                      ["Under Review", "bg-amber-400"],
                      ["Closed", "bg-emerald-400"],
                    ] as const
                  ).map(([status, color]) => {
                    const count = incidents.filter(
                      (item) => item.status === status,
                    ).length;
                    const percentage = incidents.length
                      ? (count / incidents.length) * 100
                      : 0;

                    return (
                      <div key={status}>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-slate-400">{status}</span>
                          <span className="tabular-nums text-slate-300">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
                    <Shield size={15} />
                    Accountability principle
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    Every record should have an accountable owner, documented
                    status, review history and authorized closure.
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5">
                <Heading
                  eyebrow="Latest register entries"
                  title="Incident Management"
                  description="Recently recorded coordination and governance items."
                  action={
                    <button
                      onClick={() => setActiveTab("Incident Register")}
                      className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      View register <ChevronRight className="inline" size={13} />
                    </button>
                  }
                />
                <div className="space-y-2">
                  {incidents.slice(0, 4).map((incident) => (
                    <div
                      key={incident.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-200">
                          {incident.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {incident.id} · {incident.location}
                        </p>
                      </div>
                      <Badge value={incident.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5">
                <Heading
                  eyebrow="Preparedness calendar"
                  title="Upcoming Exercises"
                  description="Illustrative programme schedule."
                  action={
                    <button
                      onClick={() => setActiveTab("Drills & Exercises")}
                      className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      View calendar{" "}
                      <ChevronRight className="inline" size={13} />
                    </button>
                  }
                />
                <div className="space-y-3">
                  {drills.slice(0, 4).map((drill) => (
                    <div
                      key={drill.id}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                    >
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
                        <CalendarDays size={15} />
                        <span className="mt-0.5 text-[8px] font-semibold">
                          {drill.scheduled.slice(5)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-200">
                          {drill.name}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {drill.type} · {drill.coordinator}
                        </p>
                      </div>
                      <Badge value={drill.status} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5">
              <Heading
                eyebrow="Institutional workflow"
                title="Preparedness Management Lifecycle"
                description="Administrative stages for programme governance."
              />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    number: "01",
                    title: "Plan & Approve",
                    description:
                      "Maintain approved preparedness plans and responsibilities.",
                    icon: FileText,
                  },
                  {
                    number: "02",
                    title: "Coordinate",
                    description:
                      "Maintain authorized stakeholder and contact directories.",
                    icon: Users,
                  },
                  {
                    number: "03",
                    title: "Exercise & Review",
                    description:
                      "Record exercises, findings and improvement actions.",
                    icon: ClipboardCheck,
                  },
                  {
                    number: "04",
                    title: "Report & Improve",
                    description:
                      "Track lessons learned, accountability and plan updates.",
                    icon: ShieldCheck,
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400">
                        {step.number}
                      </span>
                      <step.icon size={17} className="text-slate-500" />
                    </div>
                    <h3 className="mt-4 text-xs font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "Incident Register" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5 sm:p-6">
            <Heading
              eyebrow="Incident administration"
              title="Incident Register"
              description="Search, review and manage incident documentation."
              action={
                <button
                  onClick={exportIncidents}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <Download size={14} />
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
                  placeholder="Search incident, location, category or owner..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>
              <select
                value={incidentFilter}
                onChange={(e) => setIncidentFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Coordinating">Coordinating</option>
                <option value="Under Review">Under Review</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3 font-semibold">Incident</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Location</th>
                    <th className="px-3 py-3 font-semibold">Priority</th>
                    <th className="px-3 py-3 font-semibold">Lead</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="border-b border-white/[0.04] text-xs hover:bg-white/[0.02]"
                    >
                      <td className="px-3 py-4">
                        <p className="font-medium text-slate-200">
                          {incident.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-600">
                          {incident.id} · {incident.reportedAt}
                        </p>
                      </td>
                      <td className="px-3 py-4 text-slate-400">
                        {incident.category}
                      </td>
                      <td className="px-3 py-4 text-slate-400">
                        {incident.location}
                      </td>
                      <td className="px-3 py-4">
                        <Badge value={incident.priority} />
                      </td>
                      <td className="px-3 py-4 text-slate-400">
                        {incident.lead}
                      </td>
                      <td className="px-3 py-4">
                        <Badge value={incident.status} />
                      </td>
                      <td className="px-3 py-4">
                        <select
                          value={incident.status}
                          onChange={(e) =>
                            updateIncidentStatus(
                              incident.id,
                              e.target.value as Incident["status"],
                            )
                          }
                          className="rounded-lg border border-white/[0.08] bg-[#101a27] px-2 py-2 text-[10px] text-slate-300 outline-none"
                        >
                          <option value="Open">Open</option>
                          <option value="Coordinating">Coordinating</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredIncidents.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-xs text-slate-500"
                      >
                        No incident records match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[10px] text-slate-600">
              Showing {filteredIncidents.length} of {incidents.length} demo
              records.
            </p>
          </section>
        )}

        {activeTab === "Emergency Plans" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5 sm:p-6">
            <Heading
              eyebrow="Preparedness documentation"
              title="Emergency Plans"
              description="Manage plan ownership, review cycles and document approval status."
              action={
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} />
                  Add Plan
                </button>
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl border border-white/[0.07] bg-[#0c131d] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] p-3 text-cyan-300">
                      <FileText size={18} />
                    </div>
                    <Badge value={plan.status} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {plan.id} · {plan.category}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
                    <div>
                      <p className="text-[10px] text-slate-600">Plan Owner</p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        {plan.owner}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600">
                        Next Review
                      </p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        {plan.nextReview}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-600">
                        Last Reviewed
                      </p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        {plan.lastReviewed}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-white/[0.06] pt-3">
                    <label className="mb-2 block text-[10px] text-slate-500">
                      Demo approval status
                    </label>
                    <select
                      value={plan.status}
                      onChange={(e) =>
                        updatePlanStatus(
                          plan.id,
                          e.target.value as EmergencyPlan["status"],
                        )
                      }
                      className="w-full rounded-lg border border-white/[0.08] bg-[#111a26] px-3 py-2 text-[11px] text-slate-300 outline-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Drills & Exercises" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5 sm:p-6">
            <Heading
              eyebrow="Training & readiness"
              title="Drills & Exercises"
              description="Schedule institutional exercises and record programme completion."
              action={
                <button
                  onClick={() => setShowDrillModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} />
                  Schedule Exercise
                </button>
              }
            />
            <div className="mb-5 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Scheduled",
                  value: drills.filter((d) => d.status === "Scheduled").length,
                  icon: CalendarDays,
                },
                {
                  label: "Completed",
                  value: drills.filter((d) => d.status === "Completed").length,
                  icon: CheckCircle2,
                },
                {
                  label: "In Planning",
                  value: drills.filter((d) => d.status === "Planning").length,
                  icon: Clock3,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500">{item.label}</p>
                    <item.icon size={16} className="text-cyan-300" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {drills.map((drill) => (
                <div
                  key={drill.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#0c131d] p-4 md:flex-row md:items-center"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] p-3 text-cyan-300">
                      <ClipboardCheck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {drill.name}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {drill.id} · {drill.type}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        {drill.scheduled} · {drill.coordinator}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge value={drill.status} />
                    <select
                      value={drill.status}
                      onChange={(e) =>
                        updateDrillStatus(
                          drill.id,
                          e.target.value as Drill["status"],
                        )
                      }
                      className="rounded-lg border border-white/[0.08] bg-[#101a27] px-3 py-2 text-[10px] text-slate-300 outline-none"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
              <p className="text-xs font-semibold text-cyan-200">
                Exercise evaluation & improvement
              </p>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                A production version should capture approved exercise
                objectives, participant attendance, independent observations,
                findings, corrective actions and management sign-off.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Response Teams" && (
          <section className="rounded-2xl border border-white/[0.07] bg-[#111a26] p-5 sm:p-6">
            <Heading
              eyebrow="Stakeholder directory"
              title="Response Teams"
              description="Maintain authorized institutional coordination groups and directory status."
            />
            <div className="mb-5 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Headphones size={15} />
                Directory is illustrative
              </p>
              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                No real telephone numbers or dispatch functions are configured.
                Production contact information must be access-controlled and
                verified by the responsible authorities.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-xl border border-white/[0.07] bg-[#0c131d] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] p-3 text-cyan-300">
                      <Users size={18} />
                    </div>
                    <Badge value={team.status} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {team.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">{team.id}</p>
                  <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-3">
                    <p className="text-[11px] text-slate-400">
                      <span className="text-slate-600">Organization: </span>
                      {team.organization}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <span className="text-slate-600">Coordinator: </span>
                      {team.coordinator}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <span className="text-slate-600">Contact: </span>
                      {team.contact}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-white/[0.06] pt-3">
                    <label className="mb-2 block text-[10px] text-slate-500">
                      Demo directory status
                    </label>
                    <select
                      value={team.status}
                      onChange={(e) =>
                        updateTeamStatus(
                          team.id,
                          e.target.value as ResponseTeam["status"],
                        )
                      }
                      className="w-full rounded-lg border border-white/[0.08] bg-[#111a26] px-3 py-2 text-[11px] text-slate-300 outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Standby">Standby</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-7 rounded-2xl border border-white/[0.07] bg-[#111a26] p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">
                  Governance, Authorization & Auditability
                </h3>
                <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-500">
                  A production system must enforce role-based permissions,
                  independent regulatory oversight, verified contact
                  directories, controlled document access and auditable
                  approval workflows.
                </p>
              </div>
            </div>
            <span className="whitespace-nowrap rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5 text-[9px] font-semibold tracking-wider text-amber-300">
              SESSION-ONLY DATA
            </span>
          </div>
        </section>

        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-white/[0.07] pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center">
          <p>APEXIVEAI ENERGY OS · EMERGENCY PREPAREDNESS & RESPONSE</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>DEMO DATA</span>
            <span>•</span>
            <span>NOT AN OPERATIONAL DISPATCH SYSTEM</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </footer>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Link
            href="/energy-os/radiation-environmental"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            <ArrowLeft size={14} />
            Previous: Environmental Monitoring
          </Link>
          <Link
            href="/energy-os/radioactive-waste"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Next: Radioactive Waste Governance
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#111a26] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Incident administration
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  New Incident Record
                </h2>
              </div>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={createIncident} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Incident Title *
                </label>
                <input
                  required
                  value={incidentForm.title}
                  onChange={(e) =>
                    setIncidentForm({ ...incidentForm, title: e.target.value })
                  }
                  placeholder="Enter administrative incident title"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Category
                  </label>
                  <select
                    value={incidentForm.category}
                    onChange={(e) =>
                      setIncidentForm({
                        ...incidentForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                  >
                    <option>Governance</option>
                    <option>Communication</option>
                    <option>Coordination</option>
                    <option>Exercise</option>
                    <option>Documentation</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">
                    Priority
                  </label>
                  <select
                    value={incidentForm.priority}
                    onChange={(e) =>
                      setIncidentForm({
                        ...incidentForm,
                        priority: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Location / Department *
                </label>
                <input
                  required
                  value={incidentForm.location}
                  onChange={(e) =>
                    setIncidentForm({
                      ...incidentForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter location or department"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Responsible Lead
                </label>
                <input
                  value={incidentForm.lead}
                  onChange={(e) =>
                    setIncidentForm({ ...incidentForm, lead: e.target.value })
                  }
                  placeholder="Team or responsible office"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111a26] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Preparedness documentation
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  Add Emergency Plan
                </h2>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={createPlan} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Plan Name *
                </label>
                <input
                  required
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, name: e.target.value })
                  }
                  placeholder="Enter plan name"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Category
                </label>
                <select
                  value={planForm.category}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                >
                  <option>National Governance</option>
                  <option>Communication</option>
                  <option>Coordination</option>
                  <option>Training & Exercises</option>
                  <option>Documentation</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Plan Owner
                </label>
                <input
                  value={planForm.owner}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, owner: e.target.value })
                  }
                  placeholder="Responsible department"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Next Review Date
                </label>
                <input
                  type="date"
                  value={planForm.nextReview}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, nextReview: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDrillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111a26] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Training programme
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  Schedule Exercise
                </h2>
              </div>
              <button
                onClick={() => setShowDrillModal(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={createDrill} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Exercise Name *
                </label>
                <input
                  required
                  value={drillForm.name}
                  onChange={(e) =>
                    setDrillForm({ ...drillForm, name: e.target.value })
                  }
                  placeholder="Enter exercise name"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Exercise Type
                </label>
                <select
                  value={drillForm.type}
                  onChange={(e) =>
                    setDrillForm({ ...drillForm, type: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                >
                  <option>Tabletop Exercise</option>
                  <option>Communication Exercise</option>
                  <option>Readiness Workshop</option>
                  <option>Coordination Exercise</option>
                  <option>Policy Review Workshop</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={drillForm.scheduled}
                  onChange={(e) =>
                    setDrillForm({ ...drillForm, scheduled: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-slate-300 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">
                  Coordinator
                </label>
                <input
                  value={drillForm.coordinator}
                  onChange={(e) =>
                    setDrillForm({
                      ...drillForm,
                      coordinator: e.target.value,
                    })
                  }
                  placeholder="Responsible department"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0a111b] px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() => setShowDrillModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-400 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Add to Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
