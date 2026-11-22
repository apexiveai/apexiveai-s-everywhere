
"use client";

import { useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardList,
  FileCheck2,
  FileText,
  FlaskConical,
  Globe2,
  GraduationCap,
  Handshake,
  Library,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type Tab =
  | "Overview"
  | "Research Projects"
  | "Publications"
  | "Knowledge Library"
  | "Collaboration";

type ResearchProject = {
  id: string;
  title: string;
  institution: string;
  theme: string;
  lead: string;
  stage: "Concept" | "In Review" | "Approved" | "Completed";
  updated: string;
};

type Publication = {
  id: string;
  title: string;
  author: string;
  type: string;
  date: string;
  review: "Draft" | "Under Review" | "Published";
};

type KnowledgeDocument = {
  id: string;
  title: string;
  category: string;
  owner: string;
  version: string;
  updated: string;
  access: "Public Reference" | "Internal";
  status: "Draft" | "In Review" | "Approved";
};

const initialProjects: ResearchProject[] = [
  {
    id: "RES-001",
    title: "National Nuclear Energy Policy Research",
    institution: "Energy Policy Research Unit",
    theme: "Policy & Governance",
    lead: "Programme Research Office",
    stage: "In Review",
    updated: "21 Nov 2026",
  },
  {
    id: "RES-002",
    title: "Electricity Grid Readiness Assessment",
    institution: "Power Systems Research Group",
    theme: "Grid Readiness",
    lead: "Grid Planning Division",
    stage: "Concept",
    updated: "19 Nov 2026",
  },
  {
    id: "RES-003",
    title: "Environmental Baseline Data Framework",
    institution: "Environmental Studies Unit",
    theme: "Environment",
    lead: "Environmental Research Office",
    stage: "Approved",
    updated: "17 Nov 2026",
  },
  {
    id: "RES-004",
    title: "National Nuclear Workforce Capacity Study",
    institution: "Human Capital Development Centre",
    theme: "Workforce",
    lead: "Training & Research Division",
    stage: "Completed",
    updated: "12 Nov 2026",
  },
  {
    id: "RES-005",
    title: "Institutional Governance Benchmarking",
    institution: "Public Administration Research Unit",
    theme: "Institutional Capacity",
    lead: "Governance Research Office",
    stage: "In Review",
    updated: "10 Nov 2026",
  },
];

const initialPublications: Publication[] = [
  {
    id: "PUB-001",
    title: "National Nuclear Energy Programme: Governance Considerations",
    author: "Programme Research Office",
    type: "Policy Brief",
    date: "20 Nov 2026",
    review: "Under Review",
  },
  {
    id: "PUB-002",
    title: "Electricity Infrastructure Readiness: Research Overview",
    author: "Power Systems Research Group",
    type: "Research Paper",
    date: "16 Nov 2026",
    review: "Published",
  },
  {
    id: "PUB-003",
    title: "Environmental Governance and Public Reporting",
    author: "Environmental Studies Unit",
    type: "Technical Report",
    date: "13 Nov 2026",
    review: "Draft",
  },
  {
    id: "PUB-004",
    title: "Institutional Capacity Development Framework",
    author: "Human Capital Development Centre",
    type: "Research Paper",
    date: "08 Nov 2026",
    review: "Published",
  },
];

const initialDocuments: KnowledgeDocument[] = [
  {
    id: "DOC-001",
    title: "National Energy Policy — Reference Register",
    category: "National Policy",
    owner: "Policy Research Unit",
    version: "v1.2",
    updated: "21 Nov 2026",
    access: "Internal",
    status: "In Review",
  },
  {
    id: "DOC-002",
    title: "International Nuclear Safety Standards — Reference Register",
    category: "Safety Governance",
    owner: "Safety Governance Office",
    version: "v1.0",
    updated: "18 Nov 2026",
    access: "Public Reference",
    status: "Approved",
  },
  {
    id: "DOC-003",
    title: "Grid Readiness Assessment Framework",
    category: "Grid Readiness",
    owner: "Power Systems Research Group",
    version: "v1.1",
    updated: "15 Nov 2026",
    access: "Internal",
    status: "Draft",
  },
  {
    id: "DOC-004",
    title: "Environmental Governance Reference Notes",
    category: "Environment",
    owner: "Environmental Studies Unit",
    version: "v1.0",
    updated: "11 Nov 2026",
    access: "Public Reference",
    status: "Approved",
  },
  {
    id: "DOC-005",
    title: "Emergency Preparedness Governance Framework",
    category: "Emergency Preparedness",
    owner: "Emergency Planning Office",
    version: "v1.0",
    updated: "07 Nov 2026",
    access: "Internal",
    status: "In Review",
  },
];

const partners = [
  {
    name: "National Research Institutions",
    type: "Academic & Research",
    focus: "Research coordination and knowledge exchange",
    status: "Prospective",
  },
  {
    name: "International Cooperation Network",
    type: "International Cooperation",
    focus: "Policy dialogue and institutional capacity",
    status: "Under Discussion",
  },
  {
    name: "University Collaboration Programme",
    type: "Higher Education",
    focus: "Education, research and workforce development",
    status: "Prospective",
  },
  {
    name: "Energy Sector Research Group",
    type: "Industry & Energy",
    focus: "Grid readiness and energy policy research",
    status: "Active",
  },
];

const themes = [
  "Policy & Governance",
  "Grid Readiness",
  "Environment",
  "Workforce",
  "Institutional Capacity",
  "Safety Governance",
  "Emergency Preparedness",
  "Waste Governance",
];

const knowledgeCategories = [
  "Legislation",
  "International References",
  "National Policy",
  "Project Governance",
  "Environment",
  "Grid Readiness",
  "Workforce",
  "Safety Governance",
  "Emergency Preparedness",
  "Waste Governance",
  "Procurement & Finance",
];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function StatusPill({ value }: { value: string }) {
  const styles: Record<string, string> = {
    Concept: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    "In Review": "border-amber-400/30 bg-amber-400/10 text-amber-300",
    Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Completed: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    Draft: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    "Under Review": "border-amber-400/30 bg-amber-400/10 text-amber-300",
    Published: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    "Public Reference": "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    Internal: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Prospective: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    "Under Discussion": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  };

  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide",
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
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#101722] p-5 transition hover:border-cyan-400/25 hover:bg-[#131e2b]">
      <div className="flex items-start justify-between">
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

export default function ResearchKnowledgePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [projects, setProjects] = useState(initialProjects);
  const [publications, setPublications] = useState(initialPublications);
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [modal, setModal] = useState<"project" | "publication" | "document" | null>(null);
  const [notice, setNotice] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formOwner, setFormOwner] = useState("");
  const [formCategory, setFormCategory] = useState(themes[0]);
  const [formStatus, setFormStatus] = useState("Concept");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.institution.toLowerCase().includes(query) ||
        project.id.toLowerCase().includes(query) ||
        project.theme.toLowerCase().includes(query);
      const matchesStage =
        stageFilter === "All" || project.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [projects, search, stageFilter]);

  const filteredPublications = useMemo(() => {
    const query = search.toLowerCase();
    return publications.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  }, [publications, search]);

  const filteredDocuments = useMemo(() => {
    const query = search.toLowerCase();
    return documents.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  }, [documents, search]);

  const projectCount = projects.length;
  const publicationCount = publications.length;
  const documentCount = documents.length;
  const pendingReviews =
    projects.filter((item) => item.stage === "In Review").length +
    publications.filter((item) => item.review === "Under Review").length +
    documents.filter((item) => item.status === "In Review").length;

  function exportCSV(filename: string, rows: Record<string, string>[]) {
    if (!rows.length) {
      setNotice("There are no records available to export.");
      return;
    }

    const headers = Object.keys(rows[0]);
    const escapeCSV = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`;
    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        headers.map((header) => escapeCSV(row[header] || "")).join(",")
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

  function resetModal() {
    setModal(null);
    setFormTitle("");
    setFormOwner("");
    setFormCategory(themes[0]);
    setFormStatus("Concept");
  }

  function submitRecord() {
    if (!formTitle.trim() || !formOwner.trim()) {
      setNotice("Please complete the title and owner fields.");
      return;
    }

    const today = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    if (modal === "project") {
      setProjects((current) => [
        {
          id: `RES-${String(current.length + 1).padStart(3, "0")}`,
          title: formTitle.trim(),
          institution: formOwner.trim(),
          theme: formCategory,
          lead: formOwner.trim(),
          stage: formStatus as ResearchProject["stage"],
          updated: today,
        },
        ...current,
      ]);
      setActiveTab("Research Projects");
    }

    if (modal === "publication") {
      setPublications((current) => [
        {
          id: `PUB-${String(current.length + 1).padStart(3, "0")}`,
          title: formTitle.trim(),
          author: formOwner.trim(),
          type: formCategory,
          date: today,
          review: formStatus as Publication["review"],
        },
        ...current,
      ]);
      setActiveTab("Publications");
    }

    if (modal === "document") {
      setDocuments((current) => [
        {
          id: `DOC-${String(current.length + 1).padStart(3, "0")}`,
          title: formTitle.trim(),
          category: formCategory,
          owner: formOwner.trim(),
          version: "v1.0",
          updated: today,
          access: "Internal",
          status: formStatus as KnowledgeDocument["status"],
        },
        ...current,
      ]);
      setActiveTab("Knowledge Library");
    }

    setNotice("Record added to this demo session.");
    resetModal();
  }

  function updateProjectStage(id: string, stage: ResearchProject["stage"]) {
    setProjects((current) =>
      current.map((item) =>
        item.id === id ? { ...item, stage, updated: "22 Nov 2026" } : item
      )
    );
  }

  function updatePublicationReview(
    id: string,
    review: Publication["review"]
  ) {
    setPublications((current) =>
      current.map((item) => (item.id === id ? { ...item, review } : item))
    );
  }

  function updateDocumentStatus(
    id: string,
    status: KnowledgeDocument["status"]
  ) {
    setDocuments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  const tabs: { name: Tab; icon: React.ElementType }[] = [
    { name: "Overview", icon: Activity },
    { name: "Research Projects", icon: FlaskConical },
    { name: "Publications", icon: BookOpen },
    { name: "Knowledge Library", icon: Library },
    { name: "Collaboration", icon: Handshake },
  ];

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
          <div className="absolute -right-1 top-2 h-52 w-52 rounded-full border border-cyan-300/[0.08]" />
          <div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-cyan-400/[0.06] blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              <Sparkles size={13} />
              Energy OS · Module 11 of 12
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Research & Knowledge Center
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              A centralized institutional workspace for civilian nuclear energy
              research, policy knowledge, publications, document governance and
              international collaboration.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setModal("project")}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                Register Research Project
              </button>
              <button
                onClick={() => setActiveTab("Knowledge Library")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
              >
                <Library size={15} />
                Open Knowledge Library
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.08] pt-5 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-400" />
              Governance-led research
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 size={13} className="text-cyan-300" />
              International knowledge exchange
            </span>
            <span className="inline-flex items-center gap-2">
              <FileCheck2 size={13} className="text-violet-300" />
              Document review tracking
            </span>
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Research Projects"
            value={String(projectCount).padStart(2, "0")}
            note="Registered programme records"
            icon={FlaskConical}
            accent="border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300"
          />
          <MetricCard
            label="Publications"
            value={String(publicationCount).padStart(2, "0")}
            note="Papers, reports and policy briefs"
            icon={BookOpen}
            accent="border-violet-400/20 bg-violet-400/[0.08] text-violet-300"
          />
          <MetricCard
            label="Knowledge Records"
            value={String(documentCount).padStart(2, "0")}
            note="Document metadata entries"
            icon={Library}
            accent="border-blue-400/20 bg-blue-400/[0.08] text-blue-300"
          />
          <MetricCard
            label="Pending Reviews"
            value={String(pendingReviews).padStart(2, "0")}
            note="Items awaiting review"
            icon={ClipboardList}
            accent="border-amber-400/20 bg-amber-400/[0.08] text-amber-300"
          />
        </div>

        <div className="mb-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.045] p-4">
          <div className="flex gap-3">
            <CircleAlert className="mt-0.5 shrink-0 text-amber-300" size={17} />
            <div>
              <p className="text-xs font-semibold text-amber-200">
                Data governance notice
              </p>
              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                This workspace contains illustrative demonstration records.
                Entries are stored only in the current browser session and are
                not connected to an institutional repository, verified
                research source, document storage service or approval system.
                A record marked approved in this demo does not represent an
                official regulatory or institutional approval.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#101722] p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setSearch("");
                    setStageFilter("All");
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

          {activeTab !== "Overview" && activeTab !== "Collaboration" && (
            <div className="flex flex-col gap-2 sm:flex-row">
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
              {activeTab === "Research Projects" && (
                <div className="relative">
                  <select
                    value={stageFilter}
                    onChange={(event) => setStageFilter(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[#0b121c] px-3 pr-9 text-xs text-slate-300 outline-none focus:border-cyan-400/40 sm:w-36"
                  >
                    <option>All</option>
                    <option>Concept</option>
                    <option>In Review</option>
                    <option>Approved</option>
                    <option>Completed</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              )}
            </div>
          )}
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
          <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
              <SectionHeading
                eyebrow="Portfolio intelligence"
                title="Research Portfolio"
                description="Current illustrative research activities across programme knowledge domains."
              />
              <div className="space-y-3">
                {themes.slice(0, 5).map((theme, index) => {
                  const count = projects.filter((item) => item.theme === theme).length;
                  const percentage = Math.max(count * 20, 8);
                  return (
                    <div key={theme}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-slate-300">{theme}</span>
                        <span className="text-[10px] tabular-nums text-slate-500">
                          {count} project{count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                          style={{ width: `${Math.min(percentage + index * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
                <div className="rounded-xl bg-[#0b121c] p-4">
                  <p className="text-[10px] text-slate-500">Completed projects</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-300">
                    {projects.filter((item) => item.stage === "Completed").length}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0b121c] p-4">
                  <p className="text-[10px] text-slate-500">Approved projects</p>
                  <p className="mt-2 text-2xl font-semibold text-cyan-300">
                    {projects.filter((item) => item.stage === "Approved").length}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
              <SectionHeading
                eyebrow="Knowledge governance"
                title="Research Governance Framework"
                description="Administrative controls for research integrity and institutional knowledge management."
              />
              <div className="space-y-3">
                {[
                  ["Research registration", "Project ownership and scope records", FlaskConical],
                  ["Peer and policy review", "Documented review workflow", FileCheck2],
                  ["Version management", "Controlled document metadata", FileText],
                  ["Institutional collaboration", "Partner and coordination records", Handshake],
                  ["Public transparency", "Publication and disclosure tracking", Globe2],
                ].map(([title, description, Icon]) => {
                  const ItemIcon = Icon as React.ElementType;
                  return (
                    <div
                      key={title as string}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b121c] p-3"
                    >
                      <div className="rounded-lg bg-cyan-400/[0.08] p-2 text-cyan-300">
                        <ItemIcon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200">
                          {title as string}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {description as string}
                        </p>
                      </div>
                      <CheckCircle2 className="ml-auto shrink-0 text-emerald-400" size={15} />
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5 xl:col-span-2">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <SectionHeading
                  eyebrow="Latest activity"
                  title="Recently Updated Research"
                  description="Latest records from the illustrative research portfolio."
                />
                <button
                  onClick={() => setActiveTab("Research Projects")}
                  className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  View all projects <ArrowRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="pb-3 font-semibold">Research project</th>
                      <th className="pb-3 font-semibold">Research theme</th>
                      <th className="pb-3 font-semibold">Last updated</th>
                      <th className="pb-3 font-semibold">Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 4).map((project) => (
                      <tr key={project.id} className="border-b border-white/[0.045] last:border-0">
                        <td className="py-4 pr-4">
                          <p className="text-xs font-semibold text-slate-200">
                            {project.title}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {project.id} · {project.institution}
                          </p>
                        </td>
                        <td className="py-4 text-xs text-slate-400">{project.theme}</td>
                        <td className="py-4 text-xs text-slate-400">{project.updated}</td>
                        <td className="py-4"><StatusPill value={project.stage} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5 xl:col-span-2">
              <SectionHeading
                eyebrow="Knowledge domains"
                title="Institutional Knowledge Map"
                description="Suggested knowledge domains to organize a civilian nuclear energy programme research repository."
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {knowledgeCategories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveTab("Knowledge Library");
                      setSearch(category);
                    }}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b121c] p-3 text-left transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.04]"
                  >
                    <div className="rounded-lg bg-white/[0.05] p-2 text-cyan-300 transition group-hover:bg-cyan-400/10">
                      {index % 3 === 0 ? <BookOpen size={15} /> : index % 3 === 1 ? <FileText size={15} /> : <GraduationCap size={15} />}
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">{category}</span>
                    <ArrowRight size={13} className="ml-auto text-slate-600 transition group-hover:text-cyan-300" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "Research Projects" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <SectionHeading
                eyebrow="Research administration"
                title="Research Project Register"
                description="Register and track institutional research initiatives, ownership, themes and review stages."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV("apexiveai-research-projects.csv", projects.map((item) => ({
                      ID: item.id,
                      Title: item.title,
                      Institution: item.institution,
                      Theme: item.theme,
                      Lead: item.lead,
                      Stage: item.stage,
                      Updated: item.updated,
                    })))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => setModal("project")}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> New Project
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Institution</th>
                    <th className="pb-3">Theme</th>
                    <th className="pb-3">Last updated</th>
                    <th className="pb-3">Stage</th>
                    <th className="pb-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-white/[0.045] last:border-0">
                      <td className="py-4 pr-4">
                        <p className="text-xs font-semibold text-white">{project.title}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{project.id}</p>
                      </td>
                      <td className="py-4 text-xs text-slate-400">{project.institution}</td>
                      <td className="py-4 text-xs text-slate-400">{project.theme}</td>
                      <td className="py-4 text-xs text-slate-400">{project.updated}</td>
                      <td className="py-4"><StatusPill value={project.stage} /></td>
                      <td className="py-4">
                        <select
                          value={project.stage}
                          onChange={(event) =>
                            updateProjectStage(project.id, event.target.value as ResearchProject["stage"])
                          }
                          className="rounded-lg border border-white/10 bg-[#0b121c] px-2 py-2 text-[10px] text-slate-300 outline-none"
                        >
                          <option>Concept</option>
                          <option>In Review</option>
                          <option>Approved</option>
                          <option>Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching research projects.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "Publications" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <SectionHeading
                eyebrow="Research outputs"
                title="Publications & Review Management"
                description="Maintain a record of research papers, technical reports, policy briefs and publication review status."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV("apexiveai-publications.csv", publications.map((item) => ({
                      ID: item.id,
                      Title: item.title,
                      Author: item.author,
                      Type: item.type,
                      Date: item.date,
                      Review: item.review,
                    })))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setFormCategory("Research Paper");
                    setFormStatus("Draft");
                    setModal("publication");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> Register Publication
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              {filteredPublications.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4 lg:flex-row lg:items-center">
                  <div className="rounded-xl bg-violet-400/[0.08] p-3 text-violet-300">
                    <BookOpen size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {item.id} · {item.author} · {item.type} · {item.date}
                    </p>
                  </div>
                  <StatusPill value={item.review} />
                  <select
                    value={item.review}
                    onChange={(event) =>
                      updatePublicationReview(item.id, event.target.value as Publication["review"])
                    }
                    className="rounded-lg border border-white/10 bg-[#101722] px-3 py-2 text-[10px] text-slate-300 outline-none"
                  >
                    <option>Draft</option>
                    <option>Under Review</option>
                    <option>Published</option>
                  </select>
                </div>
              ))}
              {filteredPublications.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching publications.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "Knowledge Library" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <SectionHeading
                eyebrow="Institutional repository"
                title="Knowledge Library"
                description="Organize document metadata, version references, ownership, access classification and review status."
              />
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() =>
                    exportCSV("apexiveai-knowledge-library.csv", documents.map((item) => ({
                      ID: item.id,
                      Title: item.title,
                      Category: item.category,
                      Owner: item.owner,
                      Version: item.version,
                      Updated: item.updated,
                      Access: item.access,
                      Status: item.status,
                    })))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                >
                  <ArrowDownToLine size={14} /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setFormCategory("National Policy");
                    setFormStatus("Draft");
                    setModal("document");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Plus size={14} /> Register Document
                </button>
              </div>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-[#0b121c] p-4">
                <p className="text-[10px] text-slate-500">All document records</p>
                <p className="mt-2 text-2xl font-semibold text-white">{documents.length}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0b121c] p-4">
                <p className="text-[10px] text-slate-500">Public reference entries</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-300">
                  {documents.filter((item) => item.access === "Public Reference").length}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#0b121c] p-4">
                <p className="text-[10px] text-slate-500">Internal records</p>
                <p className="mt-2 text-2xl font-semibold text-violet-300">
                  {documents.filter((item) => item.access === "Internal").length}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3">Document record</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Access</th>
                    <th className="pb-3">Updated</th>
                    <th className="pb-3">Review status</th>
                    <th className="pb-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((item) => (
                    <tr key={item.id} className="border-b border-white/[0.045] last:border-0">
                      <td className="py-4 pr-4">
                        <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{item.id} · {item.owner}</p>
                      </td>
                      <td className="py-4 text-xs text-slate-400">{item.category}</td>
                      <td className="py-4 text-xs font-semibold text-cyan-300">{item.version}</td>
                      <td className="py-4"><StatusPill value={item.access} /></td>
                      <td className="py-4 text-xs text-slate-400">{item.updated}</td>
                      <td className="py-4"><StatusPill value={item.status} /></td>
                      <td className="py-4">
                        <select
                          value={item.status}
                          onChange={(event) =>
                            updateDocumentStatus(item.id, event.target.value as KnowledgeDocument["status"])
                          }
                          className="rounded-lg border border-white/10 bg-[#0b121c] px-2 py-2 text-[10px] text-slate-300 outline-none"
                        >
                          <option>Draft</option>
                          <option>In Review</option>
                          <option>Approved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDocuments.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">No matching knowledge records.</p>
              )}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-slate-500">
              Document registration stores metadata only. It does not upload,
              preserve, verify or distribute document files.
            </p>
          </section>
        )}

        {activeTab === "Collaboration" && (
          <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
              <SectionHeading
                eyebrow="Institutional network"
                title="Collaboration Directory"
                description="Illustrative partner categories for research coordination and institutional knowledge exchange."
              />
              <div className="space-y-3">
                {partners.map((partner) => (
                  <div key={partner.name} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4 sm:flex-row sm:items-center">
                    <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                      <Building2 size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">{partner.name}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{partner.type}</p>
                      <p className="mt-2 text-[11px] text-slate-400">{partner.focus}</p>
                    </div>
                    <StatusPill value={partner.status} />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5">
              <SectionHeading
                eyebrow="Cooperation framework"
                title="Collaboration Priorities"
                description="Potential institutional cooperation workstreams."
              />
              <div className="space-y-3">
                {[
                  ["Academic research exchange", "Research methods, publications and education"],
                  ["Institutional capacity", "Governance, regulatory independence and public administration"],
                  ["Energy system research", "Electricity planning and grid readiness studies"],
                  ["Environmental research", "Baseline studies and transparent reporting"],
                  ["Knowledge development", "Training materials and institutional learning"],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-xl border border-white/[0.06] bg-[#0b121c] p-4">
                    <p className="text-xs font-semibold text-slate-200">{title}</p>
                    <p className="mt-1 text-[10px] leading-5 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.045] p-4">
                <p className="text-xs font-semibold text-cyan-200">Partner verification</p>
                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                  No named institution is represented as a confirmed partner.
                  Formal agreements, due diligence and authorized approvals
                  would be required before recording an active relationship.
                </p>
              </div>
            </section>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              ApexiveAI · Energy OS
            </p>
            <p className="mt-1 text-[10px] text-slate-600">
              Research & Knowledge Center · Module 11 of 12
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/energy-os/procurement-financial"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] font-semibold text-slate-400 hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft size={13} /> Previous Module
            </Link>
            <Link
              href="/energy-os/public-transparency"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.07] px-3 py-2.5 text-[10px] font-semibold text-cyan-200 hover:bg-cyan-400/[0.12]"
            >
              Next Module <ArrowRight size={13} />
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
                  Research administration
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {modal === "project"
                    ? "Register Research Project"
                    : modal === "publication"
                    ? "Register Publication"
                    : "Register Knowledge Document"}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">
                  Create an illustrative record for this demo session.
                </p>
              </div>
              <button
                onClick={resetModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-400">
                  {modal === "project" ? "Project title" : modal === "publication" ? "Publication title" : "Document title"}
                </label>
                <input
                  value={formTitle}
                  onChange={(event) => setFormTitle(event.target.value)}
                  placeholder="Enter a descriptive title"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-400">
                  {modal === "publication" ? "Author / Institution" : "Institution / Owner"}
                </label>
                <input
                  value={formOwner}
                  onChange={(event) => setFormOwner(event.target.value)}
                  placeholder="Enter responsible institution or owner"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-400">
                  {modal === "project" ? "Research theme" : modal === "publication" ? "Publication type" : "Knowledge category"}
                </label>
                <select
                  value={formCategory}
                  onChange={(event) => setFormCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-slate-200 outline-none focus:border-cyan-400/40"
                >
                  {(modal === "project"
                    ? themes
                    : modal === "publication"
                    ? ["Research Paper", "Policy Brief", "Technical Report", "Working Paper", "Conference Paper"]
                    : knowledgeCategories
                  ).map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium text-slate-400">
                  Initial status
                </label>
                <select
                  value={formStatus}
                  onChange={(event) => setFormStatus(event.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0a111b] px-3 text-xs text-slate-200 outline-none focus:border-cyan-400/40"
                >
                  {(modal === "project"
                    ? ["Concept", "In Review", "Approved", "Completed"]
                    : modal === "publication"
                    ? ["Draft", "Under Review", "Published"]
                    : ["Draft", "In Review", "Approved"]
                  ).map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={resetModal}
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
