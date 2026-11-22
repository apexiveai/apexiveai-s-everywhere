
"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardList,
  Download,
  FileText,
  Filter,
  Handshake,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

type ProjectStatus = "Planning" | "In Progress" | "Under Review" | "On Hold";

type Project = {
  id: string;
  name: string;
  category: string;
  owner: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  start: string;
  target: string;
  priority: "Critical" | "High" | "Normal";
};

const initialProjects: Project[] = [
  {
    id: "NPP-001",
    name: "National Nuclear Programme Development",
    category: "Programme Governance",
    owner: "National Programme Office",
    budget: 8500000,
    spent: 2150000,
    progress: 25,
    status: "In Progress",
    start: "2026-01-01",
    target: "2028-12-31",
    priority: "Critical",
  },
  {
    id: "NPP-002",
    name: "Regulatory Infrastructure Development",
    category: "Regulatory",
    owner: "Regulatory Development Team",
    budget: 4200000,
    spent: 650000,
    progress: 15,
    status: "Planning",
    start: "2026-06-01",
    target: "2029-06-30",
    priority: "Critical",
  },
  {
    id: "NPP-003",
    name: "National Electricity Grid Assessment",
    category: "Grid Infrastructure",
    owner: "Grid Planning Division",
    budget: 3100000,
    spent: 1240000,
    progress: 40,
    status: "In Progress",
    start: "2026-02-01",
    target: "2027-12-31",
    priority: "High",
  },
  {
    id: "NPP-004",
    name: "Environmental & Site Assessment Programme",
    category: "Environmental",
    owner: "Environmental Assessment Unit",
    budget: 5600000,
    spent: 800000,
    progress: 10,
    status: "Under Review",
    start: "2026-08-01",
    target: "2029-12-31",
    priority: "High",
  },
  {
    id: "NPP-005",
    name: "National Workforce Development",
    category: "Workforce",
    owner: "Human Resource Development Office",
    budget: 2700000,
    spent: 950000,
    progress: 35,
    status: "In Progress",
    start: "2026-03-01",
    target: "2028-06-30",
    priority: "High",
  },
  {
    id: "NPP-006",
    name: "Public Information & Consultation",
    category: "Public Engagement",
    owner: "Public Communications Office",
    budget: 900000,
    spent: 180000,
    progress: 20,
    status: "On Hold",
    start: "2026-05-01",
    target: "2027-12-31",
    priority: "Normal",
  },
];

const milestones = [
  {
    id: "MS-001",
    title: "National programme framework",
    project: "NPP-001",
    date: "2026-12-15",
    status: "In Progress",
    owner: "Programme Office",
  },
  {
    id: "MS-002",
    title: "Institutional responsibility mapping",
    project: "NPP-001",
    date: "2027-03-30",
    status: "Planned",
    owner: "Governance Team",
  },
  {
    id: "MS-003",
    title: "Regulatory framework review",
    project: "NPP-002",
    date: "2027-06-30",
    status: "Planned",
    owner: "Regulatory Team",
  },
  {
    id: "MS-004",
    title: "Grid assessment report",
    project: "NPP-003",
    date: "2027-02-28",
    status: "In Progress",
    owner: "Grid Planning Division",
  },
  {
    id: "MS-005",
    title: "Environmental assessment review",
    project: "NPP-004",
    date: "2027-09-30",
    status: "Under Review",
    owner: "Environmental Unit",
  },
];

const contractors = [
  {
    name: "Strategic Advisory Partner",
    specialty: "Programme advisory",
    project: "NPP-001",
    contract: "CTR-2026-001",
    status: "Under Evaluation",
  },
  {
    name: "Grid Assessment Consultant",
    specialty: "Grid planning and assessment",
    project: "NPP-003",
    contract: "CTR-2026-002",
    status: "Active",
  },
  {
    name: "Environmental Review Consultant",
    specialty: "Environmental assessment",
    project: "NPP-004",
    contract: "CTR-2026-003",
    status: "Pending Approval",
  },
  {
    name: "Workforce Development Partner",
    specialty: "Education and training",
    project: "NPP-005",
    contract: "CTR-2026-004",
    status: "Active",
  },
];

const risks = [
  {
    id: "RSK-001",
    title: "Regulatory capability development delay",
    category: "Institutional",
    impact: "High",
    likelihood: "Medium",
    response: "Capacity-building and independent review planning",
  },
  {
    id: "RSK-002",
    title: "Long-term financing uncertainty",
    category: "Financial",
    impact: "High",
    likelihood: "High",
    response: "Develop funding scenarios and fiscal risk assessment",
  },
  {
    id: "RSK-003",
    title: "Insufficient specialist workforce",
    category: "Workforce",
    impact: "High",
    likelihood: "Medium",
    response: "Establish education and qualification programmes",
  },
  {
    id: "RSK-004",
    title: "Grid infrastructure readiness gap",
    category: "Infrastructure",
    impact: "Medium",
    likelihood: "Medium",
    response: "Commission independent grid capability assessment",
  },
];

const statusClass: Record<string, string> = {
  Planning: "border-white/10 bg-white/[0.04] text-slate-400",
  "In Progress": "border-blue-400/20 bg-blue-400/10 text-blue-300",
  "Under Review": "border-amber-400/20 bg-amber-400/10 text-amber-300",
  "On Hold": "border-red-400/20 bg-red-400/10 text-red-300",
  Planned: "border-white/10 bg-white/[0.04] text-slate-400",
  Active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  "Under Evaluation": "border-blue-400/20 bg-blue-400/10 text-blue-300",
  "Pending Approval": "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
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

function Heading({
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
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </div>
  );
}

function Metric({
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
    <Panel className="p-5 transition hover:border-cyan-400/30">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] p-2.5 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </Panel>
  );
}

export default function NuclearProjectManagementPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<
    "Projects" | "Milestones" | "Contractors" | "Risks"
  >("Projects");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectOwner, setNewProjectOwner] = useState("");
  const [notice, setNotice] = useState("");

  const totalBudget = projects.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = projects.reduce((sum, item) => sum + item.spent, 0);
  const averageProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, item) => sum + item.progress, 0) /
            projects.length,
        )
      : 0;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        `${project.id} ${project.name} ${project.category} ${project.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  function createProject() {
    if (!newProjectName.trim() || !newProjectOwner.trim()) {
      setNotice("Please enter both project name and project owner.");
      return;
    }

    const newProject: Project = {
      id: `NPP-${String(projects.length + 1).padStart(3, "0")}`,
      name: newProjectName.trim(),
      category: "New Programme Workstream",
      owner: newProjectOwner.trim(),
      budget: 0,
      spent: 0,
      progress: 0,
      status: "Planning",
      start: new Date().toISOString().slice(0, 10),
      target: "Not scheduled",
      priority: "Normal",
    };

    setProjects((current) => [...current, newProject]);
    setNewProjectName("");
    setNewProjectOwner("");
    setShowCreateForm(false);
    setNotice("Demo project added to this session.");
  }

  return (
    <main className="min-h-screen bg-[#080d14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.055] blur-[150px]" />
        <div className="absolute -left-32 top-[650px] h-[420px] w-[420px] rounded-full bg-blue-600/[0.045] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 md:px-9">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/energy-os/national-energy-planning"
              aria-label="Back to energy planning"
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:bg-white/10"
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
                Project Delivery & Governance Workspace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-amber-400/20 bg-amber-400/[0.08] px-3 py-2 text-[10px] font-bold tracking-wider text-amber-300">
              DEMO ENVIRONMENT
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

        <section className="flex flex-col justify-between gap-6 py-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              Programme Delivery Office
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Nuclear Project
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Coordinate national programme workstreams, manage project
              portfolios, monitor budgets, track milestones and maintain
              accountable contractor and risk governance.
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setNotice("");
            }}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <Plus size={17} />
            Create Demo Project
          </button>
        </section>

        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-3 text-sm text-cyan-200">
            {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        {showCreateForm && (
          <Panel className="mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Create Demo Project</h2>
                <p className="mt-1 text-xs text-slate-500">
                  This record is stored in browser session state only.
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-xs text-slate-400">
                Project Name
                <input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b121c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                />
              </label>
              <label className="text-xs text-slate-400">
                Responsible Owner
                <input
                  value={newProjectOwner}
                  onChange={(e) => setNewProjectOwner(e.target.value)}
                  placeholder="Enter responsible department"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b121c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Add Project
              </button>
            </div>
          </Panel>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Active Projects"
            value={String(projects.filter((p) => p.status === "In Progress").length).padStart(2, "0")}
            description={`${projects.length} total portfolio records`}
            icon={BriefcaseBusiness}
          />
          <Metric
            label="Portfolio Budget"
            value={money(totalBudget)}
            description="Illustrative planning budget"
            icon={Wallet}
          />
          <Metric
            label="Reported Expenditure"
            value={money(totalSpent)}
            description="Illustrative expenditure records"
            icon={TrendingUp}
          />
          <Metric
            label="Average Progress"
            value={`${averageProgress}%`}
            description="Simple average of demo project progress"
            icon={Activity}
          />
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <Panel className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Budget Utilization</p>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative portfolio-level financial overview
                </p>
              </div>
              <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-2 text-xs text-cyan-300">
                {totalBudget > 0
                  ? Math.round((totalSpent / totalBudget) * 100)
                  : 0}
                % utilized
              </span>
            </div>
            <div className="mt-7 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold">{money(totalSpent)}</p>
                <p className="mt-1 text-xs text-slate-500">Reported expenditure</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-300">
                  {money(totalBudget)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Total budget</p>
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{
                  width: `${Math.min(
                    100,
                    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
                  )}%`,
                }}
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-4">
                <p className="text-xs text-slate-500">Remaining allocation</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {money(Math.max(0, totalBudget - totalSpent))}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-[#0b121c] p-4">
                <p className="text-xs text-slate-500">Financial records</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {projects.length} projects
                </p>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-400/10 p-2.5 text-amber-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">Governance Controls</p>
                <p className="mt-1 text-xs text-slate-500">
                  Programme oversight requirements
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {[
                "Budget approval and audit trail",
                "Independent procurement review",
                "Contractor due diligence",
                "Milestone evidence and sign-off",
                "Risk ownership and escalation",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="shrink-0 text-cyan-300" />
                  <p className="text-xs text-slate-300">{item}</p>
                  <span className="ml-auto text-[9px] text-slate-600">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Programme Portfolio
              </p>
              <h2 className="mt-2 text-xl font-semibold">Project Workspace</h2>
              <p className="mt-2 text-sm text-slate-500">
                Search, filter and review programme projects.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl border border-white/10 bg-[#101722] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["All", "Planning", "In Progress", "Under Review", "On Hold"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl border px-3 py-2.5 text-xs transition ${
                    statusFilter === status
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <Panel
                key={project.id}
                className="p-5 transition hover:border-cyan-400/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-cyan-300">
                      {project.id}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.category}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg border px-2.5 py-1.5 text-[10px] ${statusClass[project.status]}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500">Project Owner</p>
                    <p className="mt-1 text-xs text-slate-300">{project.owner}</p>
                  </div>
                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] ${
                      project.priority === "Critical"
                        ? "bg-red-400/10 text-red-300"
                        : project.priority === "High"
                        ? "bg-amber-400/10 text-amber-300"
                        : "bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    {project.priority} Priority
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Project progress</span>
                    <span className="font-semibold text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                  <div>
                    <p className="text-[10px] text-slate-500">Budget</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {money(project.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Expenditure</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {money(project.spent)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Start: {project.start}</span>
                  <span>Target: {project.target}</span>
                </div>
              </Panel>
            ))}
            {filteredProjects.length === 0 && (
              <Panel className="p-10 text-center text-sm text-slate-500 lg:col-span-2">
                No matching projects found.
              </Panel>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Delivery Management
            </p>
            <h2 className="mt-2 text-xl font-semibold">Project Control Center</h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
            {[
              { name: "Projects", icon: LayoutDashboard },
              { name: "Milestones", icon: Target },
              { name: "Contractors", icon: Handshake },
              { name: "Risks", icon: CircleAlert },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs transition ${
                  activeTab === tab.name
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/[0.05]"
                }`}
              >
                <tab.icon size={15} />
                {tab.name}
              </button>
            ))}
          </div>

          <Panel className="mt-4 overflow-hidden">
            {activeTab === "Projects" && (
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <ClipboardList className="text-cyan-300" size={20} />
                  <h3 className="font-semibold">Portfolio Summary</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  The portfolio provides a consolidated view of national
                  programme workstreams. Project-level approvals, financial
                  authorizations and contractual commitments require
                  designated institutional review.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#0b121c] p-4">
                    <p className="text-xs text-slate-500">Total projects</p>
                    <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
                  </div>
                  <div className="rounded-xl bg-[#0b121c] p-4">
                    <p className="text-xs text-slate-500">Under review</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {projects.filter((p) => p.status === "Under Review").length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#0b121c] p-4">
                    <p className="text-xs text-slate-500">On hold</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {projects.filter((p) => p.status === "On Hold").length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Milestones" && (
              <div>
                <div className="border-b border-white/[0.07] p-5">
                  <h3 className="font-semibold">Milestone Register</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Planned programme deliverables and review dates
                  </p>
                </div>
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="grid gap-3 border-b border-white/[0.06] p-5 last:border-0 md:grid-cols-[100px_1.5fr_1fr_130px] md:items-center"
                  >
                    <span className="text-xs text-cyan-300">{milestone.id}</span>
                    <div>
                      <p className="text-sm font-medium">{milestone.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Project: {milestone.project}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{milestone.owner}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {milestone.date}
                      </p>
                    </div>
                    <span
                      className={`w-fit rounded-lg border px-2.5 py-1.5 text-[10px] ${statusClass[milestone.status]}`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Contractors" && (
              <div>
                <div className="border-b border-white/[0.07] p-5">
                  <h3 className="font-semibold">Contractor Register</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Supplier and advisory partner governance records
                  </p>
                </div>
                {contractors.map((contractor) => (
                  <div
                    key={contractor.contract}
                    className="grid gap-3 border-b border-white/[0.06] p-5 last:border-0 md:grid-cols-[1.3fr_1fr_110px_150px] md:items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">{contractor.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {contractor.specialty}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">
                        {contractor.contract}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {contractor.project}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {contractor.project}
                    </span>
                    <span
                      className={`w-fit rounded-lg border px-2.5 py-1.5 text-[10px] ${statusClass[contractor.status]}`}
                    >
                      {contractor.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Risks" && (
              <div>
                <div className="border-b border-white/[0.07] p-5">
                  <h3 className="font-semibold">Programme Risk Register</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Institutional, financial and infrastructure risks
                  </p>
                </div>
                {risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="grid gap-3 border-b border-white/[0.06] p-5 last:border-0 md:grid-cols-[90px_1.2fr_110px_110px_1.4fr] md:items-center"
                  >
                    <span className="text-xs text-cyan-300">{risk.id}</span>
                    <div>
                      <p className="text-sm font-medium">{risk.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {risk.category}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      Impact: {risk.impact}
                    </span>
                    <span className="text-xs text-slate-400">
                      Likelihood: {risk.likelihood}
                    </span>
                    <p className="text-xs leading-5 text-slate-500">
                      {risk.response}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-400/10 p-2.5 text-blue-300">
                <CalendarDays size={20} />
              </div>
              <h3 className="font-semibold">Delivery Governance</h3>
            </div>
            <div className="mt-5 space-y-4">
              {[
                "Approved project charter",
                "Defined accountable project owner",
                "Verified milestone evidence",
                "Budget authorization records",
                "Independent quality review",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={15} className="text-cyan-300" />
                  <p className="text-xs text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold">Project Documentation</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Centralize project charters, contracts, budget approvals,
              environmental reviews, progress reports and audit evidence.
            </p>
            <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0b121c] p-4">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-cyan-300" />
                <div>
                  <p className="text-sm font-medium">Document Governance</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Version control · Review · Approval history
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </section>

        <section className="mt-12 rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-[#102438] to-[#101722] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <ShieldCheck size={17} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Next Development Stage
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">
                Regulatory & Licensing Management
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Establish licensing registers, regulatory submissions,
                inspection schedules, compliance evidence and independent
                review workflows.
              </p>
            </div>
            <Link
              href="/energy-os/regulatory-licensing"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Next Workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-600 md:flex-row">
          <p>© ApexiveAI Energy OS · Project Management</p>
          <p>DEMO DATA · SESSION-ONLY PROJECT CREATION · NOT LIVE SYSTEMS</p>
        </footer>
      </div>
    </main>
  );
}
