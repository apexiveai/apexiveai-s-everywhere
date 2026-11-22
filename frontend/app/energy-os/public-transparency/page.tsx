
"use client";

import { useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Globe2,
  Mail,
  Megaphone,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type Tab =
  | "Overview"
  | "Announcements"
  | "Public Consultations"
  | "Published Documents"
  | "Transparency Reports"
  | "Media Register";

type Status = "Draft" | "Under Review" | "Approved" | "Published" | "Closed";

type Announcement = {
  id: string;
  title: string;
  category: string;
  audience: string;
  publishDate: string;
  status: Status;
};

type Consultation = {
  id: string;
  title: string;
  topic: string;
  openingDate: string;
  closingDate: string;
  responses: number;
  status: "Planned" | "Open" | "Closed";
};

type PublicDocument = {
  id: string;
  title: string;
  category: string;
  version: string;
  publicationDate: string;
  access: "Public" | "Restricted";
  status: Status;
};

type TransparencyReport = {
  id: string;
  title: string;
  period: string;
  owner: string;
  status: Status;
};

type MediaItem = {
  id: string;
  title: string;
  channel: string;
  owner: string;
  date: string;
  status: Status;
};

const initialAnnouncements: Announcement[] = [
  {
    id: "ANN-001",
    title: "National Energy Programme — Public Information Update",
    category: "Programme Update",
    audience: "General Public",
    publishDate: "22 Nov 2026",
    status: "Published",
  },
  {
    id: "ANN-002",
    title: "Public Consultation Framework — Information Notice",
    category: "Public Consultation",
    audience: "Public & Stakeholders",
    publishDate: "20 Nov 2026",
    status: "Under Review",
  },
  {
    id: "ANN-003",
    title: "Institutional Transparency and Disclosure Principles",
    category: "Governance",
    audience: "General Public",
    publishDate: "18 Nov 2026",
    status: "Approved",
  },
  {
    id: "ANN-004",
    title: "Research and Knowledge Programme Bulletin",
    category: "Research",
    audience: "Academic Community",
    publishDate: "15 Nov 2026",
    status: "Draft",
  },
];

const initialConsultations: Consultation[] = [
  {
    id: "CON-001",
    title: "Public Information and Disclosure Framework",
    topic: "Transparency & Public Access",
    openingDate: "25 Nov 2026",
    closingDate: "20 Dec 2026",
    responses: 0,
    status: "Planned",
  },
  {
    id: "CON-002",
    title: "National Energy Policy — Stakeholder Dialogue",
    topic: "Energy Policy",
    openingDate: "01 Nov 2026",
    closingDate: "30 Nov 2026",
    responses: 38,
    status: "Open",
  },
  {
    id: "CON-003",
    title: "Environmental Information Disclosure Principles",
    topic: "Environment",
    openingDate: "01 Oct 2026",
    closingDate: "31 Oct 2026",
    responses: 64,
    status: "Closed",
  },
];

const initialDocuments: PublicDocument[] = [
  {
    id: "PUBDOC-001",
    title: "Programme Governance — Public Summary",
    category: "Governance",
    version: "v1.0",
    publicationDate: "20 Nov 2026",
    access: "Public",
    status: "Published",
  },
  {
    id: "PUBDOC-002",
    title: "National Energy Policy — Public Information Record",
    category: "Policy",
    version: "v1.1",
    publicationDate: "18 Nov 2026",
    access: "Public",
    status: "Approved",
  },
  {
    id: "PUBDOC-003",
    title: "Environmental Reporting — Disclosure Review Copy",
    category: "Environment",
    version: "v0.9",
    publicationDate: "15 Nov 2026",
    access: "Restricted",
    status: "Under Review",
  },
  {
    id: "PUBDOC-004",
    title: "Public Consultation Summary — Demonstration Record",
    category: "Consultation",
    version: "v1.0",
    publicationDate: "10 Nov 2026",
    access: "Public",
    status: "Published",
  },
];

const initialReports: TransparencyReport[] = [
  {
    id: "TR-001",
    title: "Programme Transparency Overview",
    period: "Q4 2026",
    owner: "Public Information Office",
    status: "Under Review",
  },
  {
    id: "TR-002",
    title: "Public Consultation Activity Summary",
    period: "Q3 2026",
    owner: "Stakeholder Engagement Unit",
    status: "Published",
  },
  {
    id: "TR-003",
    title: "Public Disclosure Register Summary",
    period: "Q3 2026",
    owner: "Disclosure Management Office",
    status: "Approved",
  },
];

const initialMedia: MediaItem[] = [
  {
    id: "MED-001",
    title: "Programme Information Bulletin",
    channel: "Official Website",
    owner: "Communications Office",
    date: "22 Nov 2026",
    status: "Published",
  },
  {
    id: "MED-002",
    title: "Public Awareness Information Pack",
    channel: "Digital Media",
    owner: "Public Engagement Unit",
    date: "19 Nov 2026",
    status: "Under Review",
  },
  {
    id: "MED-003",
    title: "Stakeholder Briefing Notice",
    channel: "Email Bulletin",
    owner: "Stakeholder Relations",
    date: "16 Nov 2026",
    status: "Draft",
  },
];

const cn = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

function StatusPill({ value }: { value: string }) {
  const styles: Record<string, string> = {
    Draft: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    "Under Review": "border-amber-400/30 bg-amber-400/10 text-amber-300",
    Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Published: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    Closed: "border-slate-500/30 bg-slate-500/10 text-slate-400",
    Open: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Planned: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    Public: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    Restricted: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  };

  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        styles[value] || "border-white/10 bg-white/5 text-slate-300"
      )}
    >
      {value}
    </span>
  );
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  icon: ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5 transition hover:border-cyan-400/25 hover:bg-[#131e2b]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">{note}</p>
        </div>
        <div className={cn("rounded-xl border p-3", accent)}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

export default function PublicTransparencyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [documents, setDocuments] = useState(initialDocuments);
  const [reports, setReports] = useState(initialReports);
  const [media, setMedia] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState<Tab | null>(null);
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("Programme Update");
  const [formStatus, setFormStatus] = useState("Draft");

  const filteredAnnouncements = useMemo(
    () =>
      announcements.filter((item) => {
        const query = search.toLowerCase();
        return (
          (item.title.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)) &&
          (statusFilter === "All" || item.status === statusFilter)
        );
      }),
    [announcements, search, statusFilter]
  );

  const filteredConsultations = useMemo(
    () =>
      consultations.filter((item) => {
        const query = search.toLowerCase();
        return (
          (item.title.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query) ||
            item.topic.toLowerCase().includes(query)) &&
          (statusFilter === "All" || item.status === statusFilter)
        );
      }),
    [consultations, search, statusFilter]
  );

  const filteredDocuments = useMemo(
    () =>
      documents.filter((item) => {
        const query = search.toLowerCase();
        return (
          (item.title.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)) &&
          (statusFilter === "All" || item.status === statusFilter)
        );
      }),
    [documents, search, statusFilter]
  );

  const filteredReports = useMemo(
    () =>
      reports.filter((item) => {
        const query = search.toLowerCase();
        return (
          (item.title.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query) ||
            item.period.toLowerCase().includes(query)) &&
          (statusFilter === "All" || item.status === statusFilter)
        );
      }),
    [reports, search, statusFilter]
  );

  const filteredMedia = useMemo(
    () =>
      media.filter((item) => {
        const query = search.toLowerCase();
        return (
          (item.title.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query) ||
            item.channel.toLowerCase().includes(query)) &&
          (statusFilter === "All" || item.status === statusFilter)
        );
      }),
    [media, search, statusFilter]
  );

  const publishedCount =
    announcements.filter((item) => item.status === "Published").length +
    documents.filter((item) => item.status === "Published").length +
    media.filter((item) => item.status === "Published").length;

  const openConsultations = consultations.filter(
    (item) => item.status === "Open"
  ).length;

  const pendingReviews =
    announcements.filter((item) => item.status === "Under Review").length +
    documents.filter((item) => item.status === "Under Review").length +
    reports.filter((item) => item.status === "Under Review").length +
    media.filter((item) => item.status === "Under Review").length;

  const tabs: { name: Tab; icon: ElementType }[] = [
    { name: "Overview", icon: Activity },
    { name: "Announcements", icon: Megaphone },
    { name: "Public Consultations", icon: MessageSquareText },
    { name: "Published Documents", icon: BookOpen },
    { name: "Transparency Reports", icon: ClipboardCheck },
    { name: "Media Register", icon: Globe2 },
  ];

  function exportCSV(filename: string, rows: Record<string, string | number>[]) {
    if (!rows.length) {
      setNotice("There are no records available to export.");
      return;
    }

    const headers = Object.keys(rows[0]);
    const escapeCSV = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        headers.map((header) => escapeCSV(row[header] ?? "")).join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("CSV export prepared successfully.");
  }

  function closeModal() {
    setModal(null);
    setTitle("");
    setOwner("");
    setCategory("Programme Update");
    setFormStatus("Draft");
  }

  function openCreateModal(tab: Tab) {
    setTitle("");
    setOwner("");
    setFormStatus("Draft");

    const defaults: Partial<Record<Tab, string>> = {
      Announcements: "Programme Update",
      "Public Consultations": "Public Consultation",
      "Published Documents": "Governance",
      "Transparency Reports": "Quarterly Report",
      "Media Register": "Official Website",
    };

    setCategory(defaults[tab] || "Programme Update");
    setModal(tab);
  }

  function submitRecord() {
    if (!title.trim() || !owner.trim()) {
      setNotice("Please complete the title and responsible owner fields.");
      return;
    }

    const today = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    if (modal === "Announcements") {
      setAnnouncements((current) => [
        {
          id: `ANN-${String(current.length + 1).padStart(3, "0")}`,
          title: title.trim(),
          category,
          audience: owner.trim(),
          publishDate: today,
          status: formStatus as Status,
        },
        ...current,
      ]);
    } else if (modal === "Public Consultations") {
      setConsultations((current) => [
        {
          id: `CON-${String(current.length + 1).padStart(3, "0")}`,
          title: title.trim(),
          topic: category,
          openingDate: today,
          closingDate: "Not scheduled",
          responses: 0,
          status: "Planned",
        },
        ...current,
      ]);
    } else if (modal === "Published Documents") {
      setDocuments((current) => [
        {
          id: `PUBDOC-${String(current.length + 1).padStart(3, "0")}`,
          title: title.trim(),
          category,
          version: "v1.0",
          publicationDate: today,
          access: "Restricted",
          status: formStatus as Status,
        },
        ...current,
      ]);
    } else if (modal === "Transparency Reports") {
      setReports((current) => [
        {
          id: `TR-${String(current.length + 1).padStart(3, "0")}`,
          title: title.trim(),
          period: category,
          owner: owner.trim(),
          status: formStatus as Status,
        },
        ...current,
      ]);
    } else if (modal === "Media Register") {
      setMedia((current) => [
        {
          id: `MED-${String(current.length + 1).padStart(3, "0")}`,
          title: title.trim(),
          channel: category,
          owner: owner.trim(),
          date: today,
          status: formStatus as Status,
        },
        ...current,
      ]);
    }

    if (modal) setActiveTab(modal);
    setNotice("Record added to this demo session.");
    closeModal();
  }

  function updateAnnouncement(id: string, status: Status) {
    setAnnouncements((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function updateConsultation(
    id: string,
    status: Consultation["status"]
  ) {
    setConsultations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function updateDocument(id: string, status: Status) {
    setDocuments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function updateReport(id: string, status: Status) {
    setReports((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function updateMedia(id: string, status: Status) {
    setMedia((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function renderStatusFilter(options: string[]) {
    return (
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[#0b121c] px-3 pr-9 text-xs text-slate-300 outline-none focus:border-cyan-400/40 sm:w-40"
        >
          <option value="All">All statuses</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    );
  }

  function renderToolbar(options: string[]) {
    return (
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search records..."
            className="h-10 w-full rounded-xl border border-white/10 bg-[#0b121c] pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 sm:w-56"
          />
        </div>
        {renderStatusFilter(options)}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d14] text-slate-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.06] blur-[130px]" />
        <div className="absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/energy-os"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-cyan-300"
          >
            <ArrowLeft size={15} />
            Energy OS Workspace
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            DEMONSTRATION ENVIRONMENT
          </div>
        </div>

        <section className="relative mb-7 overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#142737] via-[#101b29] to-[#111522] p-6 sm:p-9">
          <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border border-cyan-300/[0.08]" />
          <div className="absolute right-0 top-2 h-52 w-52 rounded-full border border-cyan-300/[0.08]" />
          <div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-cyan-400/[0.06] blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              <Globe2 size={13} />
              Energy OS · Module 12 of 12
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Public Information & Transparency
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              A centralized public information governance workspace for
              programme announcements, public consultation, disclosure
              management, transparency reporting and institutional communications.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => openCreateModal("Announcements")}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                Create Announcement
              </button>
              <button
                onClick={() => setActiveTab("Public Consultations")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
              >
                <Users size={15} />
                Consultation Register
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.08] pt-5 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-400" />
              Disclosure governance
            </span>
            <span className="inline-flex items-center gap-2">
              <Users size={13} className="text-cyan-300" />
              Public participation
            </span>
            <span className="inline-flex items-center gap-2">
              <FileCheck2 size={13} className="text-violet-300" />
              Publication review
            </span>
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Published Records"
            value={String(publishedCount).padStart(2, "0")}
            note="Announcements, documents and media"
            icon={Megaphone}
            accent="border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300"
          />
          <MetricCard
            label="Open Consultations"
            value={String(openConsultations).padStart(2, "0")}
            note="Consultation windows marked open"
            icon={MessageSquareText}
            accent="border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
          />
          <MetricCard
            label="Pending Reviews"
            value={String(pendingReviews).padStart(2, "0")}
            note="Records awaiting review"
            icon={ClipboardCheck}
            accent="border-amber-400/20 bg-amber-400/[0.08] text-amber-300"
          />
          <MetricCard
            label="Transparency Reports"
            value={String(reports.length).padStart(2, "0")}
            note="Registered reporting records"
            icon={FileText}
            accent="border-violet-400/20 bg-violet-400/[0.08] text-violet-300"
          />
        </div>

        <div className="mb-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.045] p-4">
          <div className="flex gap-3">
            <CircleAlert size={17} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <p className="text-xs font-semibold text-amber-200">
                Public disclosure and accuracy notice
              </p>
              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                This is a demonstration workspace containing illustrative
                records only. It does not publish information to the public,
                receive real consultation submissions, send notifications or
                establish an official government disclosure. Actual publication
                should require authorized review, source verification, privacy
                assessment and applicable legal approval.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#101722] p-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition",
                    activeTab === tab.name
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <Icon size={14} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-xs text-cyan-200">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              <X size={15} />
            </button>
          </div>
        )}

        {activeTab === "Overview" && (
          <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
              <SectionHeading
                eyebrow="Disclosure operations"
                title="Public Information Overview"
                description="An administrative snapshot of public-facing information records."
              />
              <div className="space-y-4">
                {[
                  {
                    label: "Announcements",
                    count: announcements.length,
                    icon: Megaphone,
                    color: "bg-cyan-400",
                  },
                  {
                    label: "Consultations",
                    count: consultations.length,
                    icon: MessageSquareText,
                    color: "bg-violet-400",
                  },
                  {
                    label: "Public document records",
                    count: documents.length,
                    icon: BookOpen,
                    color: "bg-blue-400",
                  },
                  {
                    label: "Transparency reports",
                    count: reports.length,
                    icon: ClipboardCheck,
                    color: "bg-emerald-400",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="rounded-xl bg-white/[0.05] p-2.5 text-cyan-300">
                        <Icon size={17} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-300">{item.label}</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className={cn("h-full rounded-full", item.color)}
                            style={{ width: `${Math.min(item.count * 15, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-white">
                        {item.count.toString().padStart(2, "0")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
              <SectionHeading
                eyebrow="Information integrity"
                title="Disclosure Review Controls"
                description="Recommended administrative checks before information is released."
              />
              <div className="space-y-3">
                {[
                  ["Source verification", "Confirm source, date and responsible owner", FileCheck2],
                  ["Privacy assessment", "Review personal and confidential information", ShieldCheck],
                  ["Legal review", "Check applicable disclosure requirements", ClipboardCheck],
                  ["Accessibility", "Prepare accessible public-facing content", Globe2],
                  ["Publication approval", "Record authorized approval before release", CheckCircle2],
                ].map(([heading, description, Icon]) => {
                  const ItemIcon = Icon as ElementType;
                  return (
                    <div
                      key={heading as string}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b121c] p-3"
                    >
                      <div className="rounded-lg bg-cyan-400/[0.08] p-2 text-cyan-300">
                        <ItemIcon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          {heading as string}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {description as string}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5 xl:col-span-2">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <SectionHeading
                  eyebrow="Latest public information"
                  title="Recent Announcements"
                  description="Latest illustrative entries in the announcement register."
                />
                <button
                  onClick={() => setActiveTab("Announcements")}
                  className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  View announcement register <ArrowRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {announcements.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0b121c] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                      <Bell size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.id} · {item.category} · {item.publishDate}
                      </p>
                    </div>
                    <StatusPill value={item.status} />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5 xl:col-span-2">
              <SectionHeading
                eyebrow="Public engagement"
                title="Consultation Activity"
                description="Illustrative consultation records and their current administrative state."
              />
              <div className="grid gap-3 md:grid-cols-3">
                {consultations.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/[0.06] bg-[#0b121c] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500">{item.id}</span>
                      <StatusPill value={item.status} />
                    </div>
                    <p className="mt-3 text-xs font-semibold leading-5 text-white">{item.title}</p>
                    <p className="mt-2 text-[10px] text-slate-500">{item.topic}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <span className="text-[10px] text-slate-500">Illustrative responses</span>
                      <span className="text-sm font-semibold text-cyan-300">{item.responses}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "Announcements" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Public communications"
                title="Announcement Register"
                description="Manage programme notices, public updates and information bulletins."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV(
                      "apexiveai-announcements.csv",
                      announcements.map((item) => ({
                        ID: item.id,
                        Title: item.title,
                        Category: item.category,
                        Audience: item.audience,
                        Date: item.publishDate,
                        Status: item.status,
                      }))
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => openCreateModal("Announcements")}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> New Announcement
                </button>
              </div>
            </div>
            {renderToolbar(["Draft", "Under Review", "Approved", "Published"])}
            <div className="space-y-3">
              {filteredAnnouncements.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4 lg:flex-row lg:items-center">
                  <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                    <Megaphone size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {item.id} · {item.category} · {item.audience} · {item.publishDate}
                    </p>
                  </div>
                  <StatusPill value={item.status} />
                  <select
                    value={item.status}
                    onChange={(event) => updateAnnouncement(item.id, event.target.value as Status)}
                    className="rounded-lg border border-white/10 bg-[#101722] px-3 py-2 text-[10px] text-slate-300 outline-none"
                  >
                    <option>Draft</option>
                    <option>Under Review</option>
                    <option>Approved</option>
                    <option>Published</option>
                  </select>
                </div>
              ))}
              {filteredAnnouncements.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching announcements.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "Public Consultations" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Stakeholder engagement"
                title="Public Consultation Management"
                description="Track consultation topics, opening and closing dates, participation counts and status."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV(
                      "apexiveai-consultations.csv",
                      consultations.map((item) => ({
                        ID: item.id,
                        Title: item.title,
                        Topic: item.topic,
                        Opening: item.openingDate,
                        Closing: item.closingDate,
                        Responses: item.responses,
                        Status: item.status,
                      }))
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => openCreateModal("Public Consultations")}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> New Consultation
                </button>
              </div>
            </div>
            {renderToolbar(["Planned", "Open", "Closed"])}
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredConsultations.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">{item.id}</span>
                    <StatusPill value={item.status} />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-[11px] text-slate-400">{item.topic}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
                    <div>
                      <p className="text-[10px] text-slate-500">Opening date</p>
                      <p className="mt-1 text-xs text-slate-300">{item.openingDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Closing date</p>
                      <p className="mt-1 text-xs text-slate-300">{item.closingDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Illustrative responses</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-300">{item.responses}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Administrative status</p>
                      <select
                        value={item.status}
                        onChange={(event) =>
                          updateConsultation(item.id, event.target.value as Consultation["status"])
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#101722] px-2 py-2 text-[10px] text-slate-300 outline-none"
                      >
                        <option>Planned</option>
                        <option>Open</option>
                        <option>Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {filteredConsultations.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching consultations.</p>
              )}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-500">
              Consultation creation does not open a public submission portal or collect real responses.
            </p>
          </section>
        )}

        {activeTab === "Published Documents" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Disclosure register"
                title="Published Documents"
                description="Track document titles, versions, disclosure classification and publication review status."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV(
                      "apexiveai-public-documents.csv",
                      documents.map((item) => ({
                        ID: item.id,
                        Title: item.title,
                        Category: item.category,
                        Version: item.version,
                        PublicationDate: item.publicationDate,
                        Access: item.access,
                        Status: item.status,
                      }))
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => openCreateModal("Published Documents")}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> Register Document
                </button>
              </div>
            </div>
            {renderToolbar(["Draft", "Under Review", "Approved", "Published"])}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3">Document</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Access</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((item) => (
                    <tr key={item.id} className="border-b border-white/[0.045] last:border-0">
                      <td className="py-4 pr-4">
                        <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{item.id}</p>
                      </td>
                      <td className="py-4 text-xs text-slate-400">{item.category}</td>
                      <td className="py-4 text-xs font-semibold text-cyan-300">{item.version}</td>
                      <td className="py-4"><StatusPill value={item.access} /></td>
                      <td className="py-4 text-xs text-slate-400">{item.publicationDate}</td>
                      <td className="py-4"><StatusPill value={item.status} /></td>
                      <td className="py-4">
                        <select
                          value={item.status}
                          onChange={(event) => updateDocument(item.id, event.target.value as Status)}
                          className="rounded-lg border border-white/10 bg-[#0b121c] px-2 py-2 text-[10px] text-slate-300 outline-none"
                        >
                          <option>Draft</option>
                          <option>Under Review</option>
                          <option>Approved</option>
                          <option>Published</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDocuments.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching documents.</p>
              )}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-500">
              This register stores metadata only. No document files are uploaded or publicly distributed.
            </p>
          </section>
        )}

        {activeTab === "Transparency Reports" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Accountability reporting"
                title="Transparency Reports"
                description="Register periodic programme transparency summaries and disclosure reporting records."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV(
                      "apexiveai-transparency-reports.csv",
                      reports.map((item) => ({
                        ID: item.id,
                        Title: item.title,
                        Period: item.period,
                        Owner: item.owner,
                        Status: item.status,
                      }))
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => openCreateModal("Transparency Reports")}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> New Report
                </button>
              </div>
            </div>
            {renderToolbar(["Draft", "Under Review", "Approved", "Published"])}
            <div className="grid gap-3 md:grid-cols-2">
              {filteredReports.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">{item.id}</span>
                    <StatusPill value={item.status} />
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <div className="rounded-xl bg-violet-400/[0.08] p-3 text-violet-300">
                      <FileText size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{item.owner}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <span className="text-[10px] text-slate-500">Reporting period</span>
                    <span className="text-xs font-semibold text-cyan-300">{item.period}</span>
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-[10px] text-slate-500">Update report status</label>
                    <select
                      value={item.status}
                      onChange={(event) => updateReport(item.id, event.target.value as Status)}
                      className="w-full rounded-lg border border-white/10 bg-[#101722] px-3 py-2 text-[10px] text-slate-300 outline-none"
                    >
                      <option>Draft</option>
                      <option>Under Review</option>
                      <option>Approved</option>
                      <option>Published</option>
                    </select>
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching reports.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "Media Register" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Communications operations"
                title="Media & Communication Register"
                description="Track official website notices, digital media content, stakeholder bulletins and communication approvals."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV(
                      "apexiveai-media-register.csv",
                      media.map((item) => ({
                        ID: item.id,
                        Title: item.title,
                        Channel: item.channel,
                        Owner: item.owner,
                        Date: item.date,
                        Status: item.status,
                      }))
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => openCreateModal("Media Register")}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> New Media Record
                </button>
              </div>
            </div>
            {renderToolbar(["Draft", "Under Review", "Approved", "Published"])}
            <div className="space-y-3">
              {filteredMedia.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4 lg:flex-row lg:items-center">
                  <div className="rounded-xl bg-blue-400/[0.08] p-3 text-blue-300">
                    <Mail size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {item.id} · {item.channel} · {item.owner} · {item.date}
                    </p>
                  </div>
                  <StatusPill value={item.status} />
                  <select
                    value={item.status}
                    onChange={(event) => updateMedia(item.id, event.target.value as Status)}
                    className="rounded-lg border border-white/10 bg-[#101722] px-3 py-2 text-[10px] text-slate-300 outline-none"
                  >
                    <option>Draft</option>
                    <option>Under Review</option>
                    <option>Approved</option>
                    <option>Published</option>
                  </select>
                </div>
              ))}
              {filteredMedia.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching media records.</p>
              )}
            </div>
          </section>
        )}

        <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              ApexiveAI · Energy OS
            </p>
            <p className="mt-1 text-[10px] text-slate-600">
              Public Information & Transparency · Module 12 of 12
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/energy-os/research-knowledge"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] font-semibold text-slate-400 hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft size={13} /> Previous Module
            </Link>
            <Link
              href="/energy-os"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.07] px-3 py-2.5 text-[10px] font-semibold text-cyan-200 hover:bg-cyan-400/[0.12]"
            >
              Energy OS Home <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111a27] p-5 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Public information administration
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {modal === "Announcements"
                    ? "Create Announcement"
                    : modal === "Public Consultations"
                    ? "Create Consultation Record"
                    : modal === "Published Documents"
                    ? "Register Public Document"
                    : modal === "Transparency Reports"
                    ? "Register Transparency Report"
                    : "Register Media Record"}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">
                  Create a metadata record for this demo session.
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-400">
                  Record title
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter a descriptive title"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>

              {modal !== "Public Consultations" && (
                <div>
                  <label className="mb-2 block text-[11px] font-medium text-slate-400">
                    {modal === "Announcements"
                      ? "Target audience"
                      : modal === "Transparency Reports"
                      ? "Responsible owner"
                      : "Responsible office / owner"}
                  </label>
                  <input
                    value={owner}
                    onChange={(event) => setOwner(event.target.value)}
                    placeholder="Enter responsible office or audience"
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-400">
                  {modal === "Announcements"
                    ? "Announcement category"
                    : modal === "Public Consultations"
                    ? "Consultation topic"
                    : modal === "Published Documents"
                    ? "Document category"
                    : modal === "Transparency Reports"
                    ? "Reporting period"
                    : "Communication channel"}
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-slate-200 outline-none focus:border-cyan-400/40"
                >
                  {(modal === "Announcements"
                    ? ["Programme Update", "Public Consultation", "Governance", "Research", "Environment", "Public Notice"]
                    : modal === "Public Consultations"
                    ? ["Energy Policy", "Transparency & Public Access", "Environment", "Stakeholder Engagement", "Programme Governance"]
                    : modal === "Published Documents"
                    ? ["Governance", "Policy", "Environment", "Consultation", "Programme Update", "Public Information"]
                    : modal === "Transparency Reports"
                    ? ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "Annual Report 2026"]
                    : ["Official Website", "Digital Media", "Email Bulletin", "Press Release", "Stakeholder Briefing"]
                  ).map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>

              {modal !== "Public Consultations" && (
                <div>
                  <label className="mb-2 block text-[11px] font-medium text-slate-400">
                    Initial status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(event) => setFormStatus(event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-slate-200 outline-none focus:border-cyan-400/40"
                  >
                    <option>Draft</option>
                    <option>Under Review</option>
                    <option>Approved</option>
                    <option>Published</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={submitRecord}
                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300"
              >
                Save Demo Record
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
