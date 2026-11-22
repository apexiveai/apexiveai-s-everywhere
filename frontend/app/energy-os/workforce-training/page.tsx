
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileCheck2,
  GraduationCap,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";

type Employee = {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  qualification: string;
  status: "Active" | "On Leave" | "Under Review";
  training: "Compliant" | "Due Soon" | "Overdue";
};

type Training = {
  id: string;
  title: string;
  category: string;
  audience: string;
  dueDate: string;
  status: "Scheduled" | "In Progress" | "Completed";
  participants: number;
};

type Tab =
  | "Overview"
  | "Workforce Register"
  | "Training Programmes"
  | "Qualifications"
  | "Compliance";

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Dr. Aung Min Thu",
    employeeId: "EMP-001",
    department: "Programme Governance",
    role: "Programme Director",
    qualification: "Engineering Management",
    status: "Active",
    training: "Compliant",
  },
  {
    id: "2",
    name: "Daw Thandar Win",
    employeeId: "EMP-002",
    department: "Regulatory Affairs",
    role: "Compliance Manager",
    qualification: "Regulatory Management",
    status: "Active",
    training: "Due Soon",
  },
  {
    id: "3",
    name: "U Kyaw Zin",
    employeeId: "EMP-003",
    department: "Project Management",
    role: "Project Coordinator",
    qualification: "Project Management",
    status: "Active",
    training: "Compliant",
  },
  {
    id: "4",
    name: "Daw Hnin Pwint",
    employeeId: "EMP-004",
    department: "Environmental Governance",
    role: "Environmental Officer",
    qualification: "Environmental Science",
    status: "Active",
    training: "Overdue",
  },
  {
    id: "5",
    name: "U Nay Lin",
    employeeId: "EMP-005",
    department: "Administration",
    role: "Records Administrator",
    qualification: "Information Management",
    status: "On Leave",
    training: "Compliant",
  },
  {
    id: "6",
    name: "Dr. May Thu",
    employeeId: "EMP-006",
    department: "Research & Development",
    role: "Research Coordinator",
    qualification: "Applied Science",
    status: "Under Review",
    training: "Due Soon",
  },
];

const initialTraining: Training[] = [
  {
    id: "TR-001",
    title: "Nuclear Governance & Institutional Responsibilities",
    category: "Governance",
    audience: "Programme Leadership",
    dueDate: "2026-12-05",
    status: "Scheduled",
    participants: 18,
  },
  {
    id: "TR-002",
    title: "Regulatory Compliance & Documentation",
    category: "Compliance",
    audience: "Regulatory Affairs",
    dueDate: "2026-12-12",
    status: "In Progress",
    participants: 24,
  },
  {
    id: "TR-003",
    title: "Environmental Reporting & Oversight",
    category: "Environment",
    audience: "Environmental Teams",
    dueDate: "2026-11-30",
    status: "Scheduled",
    participants: 16,
  },
  {
    id: "TR-004",
    title: "Emergency Preparedness Governance",
    category: "Preparedness",
    audience: "Institutional Management",
    dueDate: "2026-10-20",
    status: "Completed",
    participants: 32,
  },
];

const tabs: Tab[] = [
  "Overview",
  "Workforce Register",
  "Training Programmes",
  "Qualifications",
  "Compliance",
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Compliant: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    "On Leave": "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    "Under Review": "border-violet-500/20 bg-violet-500/10 text-violet-400",
    "Due Soon": "border-amber-500/20 bg-amber-500/10 text-amber-400",
    "Pending Review": "border-amber-500/20 bg-amber-500/10 text-amber-400",
    Overdue: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    Scheduled: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    "In Progress": "border-violet-500/20 bg-violet-500/10 text-violet-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[status] ?? styles["Under Review"]}`}
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
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10141c] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.07] p-3 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

export default function WorkforceTrainingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [employees, setEmployees] = useState(initialEmployees);
  const [training, setTraining] = useState(initialTraining);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [employeeName, setEmployeeName] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState(
    "Programme Governance",
  );
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeQualification, setEmployeeQualification] = useState("");

  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainingCategory, setTrainingCategory] = useState("Governance");
  const [trainingAudience, setTrainingAudience] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [trainingParticipants, setTrainingParticipants] = useState("10");

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.employeeId.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active",
  ).length;

  const compliantEmployees = employees.filter(
    (employee) => employee.training === "Compliant",
  ).length;

  const overdueEmployees = employees.filter(
    (employee) => employee.training === "Overdue",
  ).length;

  const departments = Array.from(
    new Set(employees.map((employee) => employee.department)),
  );

  function addEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const employee: Employee = {
      id: String(Date.now()),
      employeeId: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      name: employeeName.trim(),
      department: employeeDepartment,
      role: employeeRole.trim(),
      qualification: employeeQualification.trim(),
      status: "Under Review",
      training: "Due Soon",
    };

    setEmployees((current) => [employee, ...current]);
    setEmployeeName("");
    setEmployeeRole("");
    setEmployeeQualification("");
    setShowEmployeeModal(false);
    setActiveTab("Workforce Register");
    setNotice("Workforce record added to this session.");
  }

  function addTraining(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const item: Training = {
      id: `TR-${String(Date.now()).slice(-6)}`,
      title: trainingTitle.trim(),
      category: trainingCategory,
      audience: trainingAudience.trim(),
      dueDate: trainingDate,
      status: "Scheduled",
      participants: Math.max(1, Number(trainingParticipants) || 1),
    };

    setTraining((current) => [item, ...current]);
    setTrainingTitle("");
    setTrainingAudience("");
    setTrainingDate("");
    setTrainingParticipants("10");
    setShowTrainingModal(false);
    setActiveTab("Training Programmes");
    setNotice("Training programme added to this session.");
  }

  function updateEmployeeStatus(
    id: string,
    status: Employee["status"],
  ) {
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === id ? { ...employee, status } : employee,
      ),
    );
  }

  function updateTrainingStatus(id: string, status: Training["status"]) {
    setTraining((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  function exportWorkforce() {
    const headers = [
      "Employee ID",
      "Name",
      "Department",
      "Role",
      "Qualification",
      "Employment Status",
      "Training Status",
    ];

    const rows = filteredEmployees.map((employee) => [
      employee.employeeId,
      employee.name,
      employee.department,
      employee.role,
      employee.qualification,
      employee.status,
      employee.training,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "apexiveai-workforce-register.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#080b11] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.045] blur-[120px]" />
        <div className="absolute -left-40 top-[45%] h-[420px] w-[420px] rounded-full bg-blue-600/[0.035] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
              <GraduationCap size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-white">
                APEXIVE<span className="text-cyan-300">AI</span>
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Energy OS / Workforce Workspace
              </p>
            </div>
          </div>

          <Link
            href="/energy-os"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-cyan-400/30 hover:text-white"
          >
            <ArrowLeft size={14} />
            Energy OS Modules
          </Link>
        </header>

        <section className="py-9">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  Module 09 / 12
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Human Capital & Institutional Capacity
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Workforce & Training
                <span className="block text-cyan-300">
                  Management System
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                Manage workforce records, institutional roles, professional
                qualifications, training programmes, certification tracking
                and organisational capability development across the national
                civilian nuclear energy programme.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportWorkforce}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07]"
              >
                <Download size={15} />
                Export Workforce
              </button>
              <button
                onClick={() => setShowEmployeeModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-semibold text-[#071018] transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                Add Personnel
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Personnel"
            value={String(employees.length).padStart(2, "0")}
            detail="Registered workforce records"
            icon={Users}
          />
          <MetricCard
            label="Active Personnel"
            value={String(activeEmployees).padStart(2, "0")}
            detail="Currently marked active"
            icon={Activity}
          />
          <MetricCard
            label="Training Compliant"
            value={String(compliantEmployees).padStart(2, "0")}
            detail="Personnel with compliant demo status"
            icon={BadgeCheck}
          />
          <MetricCard
            label="Training Overdue"
            value={String(overdueEmployees).padStart(2, "0")}
            detail="Requires administrative follow-up"
            icon={ShieldAlert}
          />
        </section>

        <section className="mb-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.045] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-amber-400/10 p-2 text-amber-300">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-200">
                Qualification & Authorisation Governance
              </p>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                Training completion and qualification records do not
                independently grant permission to perform regulated or
                safety-critical work. Real-world role authorisation must be
                verified by the responsible institution and applicable
                independent regulatory authorities.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10141c]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Workforce Intelligence Workspace
              </h2>
              <p className="mt-1 text-[11px] text-zinc-500">
                Personnel, training, qualifications and compliance records
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1.5 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              DEMO ENVIRONMENT
            </span>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-3 pt-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-t-lg px-4 py-3 text-xs font-medium transition ${
                  activeTab === tab
                    ? "border-b-2 border-cyan-300 bg-cyan-300/[0.05] text-cyan-300"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            {activeTab === "Overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <Users size={17} />
                      <h3 className="text-sm font-semibold text-white">
                        Workforce Distribution
                      </h3>
                    </div>
                    <div className="mt-5 space-y-4">
                      {departments.map((department) => {
                        const count = employees.filter(
                          (employee) => employee.department === department,
                        ).length;
                        const percentage = Math.round(
                          (count / Math.max(employees.length, 1)) * 100,
                        );

                        return (
                          <div key={department}>
                            <div className="mb-2 flex justify-between gap-3 text-xs">
                              <span className="text-zinc-400">
                                {department}
                              </span>
                              <span className="text-zinc-300">
                                {count} personnel
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-cyan-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <GraduationCap size={17} />
                      <h3 className="text-sm font-semibold text-white">
                        Training Portfolio
                      </h3>
                    </div>
                    <div className="mt-5 space-y-4">
                      {[
                        {
                          label: "Scheduled",
                          value: training.filter(
                            (item) => item.status === "Scheduled",
                          ).length,
                          color: "bg-sky-400",
                        },
                        {
                          label: "In Progress",
                          value: training.filter(
                            (item) => item.status === "In Progress",
                          ).length,
                          color: "bg-violet-400",
                        },
                        {
                          label: "Completed",
                          value: training.filter(
                            (item) => item.status === "Completed",
                          ).length,
                          color: "bg-emerald-400",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.015] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2 w-2 rounded-full ${item.color}`}
                            />
                            <span className="text-xs text-zinc-400">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowTrainingModal(true)}
                      className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      <Plus size={14} /> Create Training Programme
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Institutional Capability Priorities
                    </h3>
                    <span className="text-[10px] text-zinc-600">
                      Strategic development
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      ["01", "Leadership & Governance", "Programme leadership and institutional accountability"],
                      ["02", "Regulatory Competence", "Independent oversight and regulatory administration"],
                      ["03", "Project Delivery", "Project controls, procurement and contract management"],
                      ["04", "Safety Culture", "Safety governance, reporting and organisational learning"],
                    ].map(([number, title, detail]) => (
                      <div
                        key={number}
                        className="flex gap-3 rounded-lg border border-white/[0.05] p-4"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.08] text-[10px] font-semibold text-cyan-300">
                          {number}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">
                            {title}
                          </p>
                          <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                            {detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Workforce Register" && (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Personnel Register
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Search and manage illustrative workforce records
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmployeeModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-[#071018]"
                  >
                    <Plus size={14} /> Add Personnel
                  </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                  <div className="relative min-w-[220px] flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={15}
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search name, ID, role or department..."
                      className="w-full rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={departmentFilter}
                      onChange={(event) =>
                        setDepartmentFilter(event.target.value)
                      }
                      className="appearance-none rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-3 pr-9 text-xs text-zinc-300 outline-none"
                    >
                      <option>All</option>
                      {departments.map((department) => (
                        <option key={department}>{department}</option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={13}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[950px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">Personnel</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Qualification</th>
                        <th className="px-4 py-3 font-medium">Training</th>
                        <th className="px-4 py-3 font-medium">Employment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="text-xs text-zinc-300 hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-4">
                            <p className="font-semibold text-white">
                              {employee.name}
                            </p>
                            <p className="mt-1 text-[10px] text-cyan-300">
                              {employee.employeeId}
                            </p>
                          </td>
                          <td className="px-4 py-4">{employee.department}</td>
                          <td className="px-4 py-4">{employee.role}</td>
                          <td className="px-4 py-4">
                            {employee.qualification}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={employee.training} />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              aria-label={`Update ${employee.name} employment status`}
                              value={employee.status}
                              onChange={(event) =>
                                updateEmployeeStatus(
                                  employee.id,
                                  event.target.value as Employee["status"],
                                )
                              }
                              className="rounded-md border border-white/10 bg-[#0b0f16] px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                            >
                              <option>Active</option>
                              <option>On Leave</option>
                              <option>Under Review</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-10 text-center text-xs text-zinc-500"
                          >
                            No matching personnel records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[10px] text-zinc-600">
                  Showing {filteredEmployees.length} of {employees.length} personnel
                </p>
              </div>
            )}

            {activeTab === "Training Programmes" && (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Training Programme Register
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Institutional learning and professional development
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTrainingModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-[#071018]"
                  >
                    <Plus size={14} /> New Programme
                  </button>
                </div>

                <div className="space-y-3">
                  {training.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[11px] text-zinc-500">
                              {item.id} · {item.category}
                            </p>
                            <p className="mt-2 text-[11px] text-zinc-400">
                              Audience: {item.audience}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                        <div className="flex flex-wrap gap-4 text-[11px] text-zinc-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            {item.dueDate}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users size={13} />
                            {item.participants} participants
                          </span>
                        </div>
                        <select
                          aria-label={`Update ${item.title} status`}
                          value={item.status}
                          onChange={(event) =>
                            updateTrainingStatus(
                              item.id,
                              event.target.value as Training["status"],
                            )
                          }
                          className="rounded-md border border-white/10 bg-[#10141c] px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                        >
                          <option>Scheduled</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Qualifications" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Professional Qualifications & Credentials
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Administrative credential register and verification status
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Academic Qualifications",
                      detail: "Degree, university and academic credential records.",
                      icon: GraduationCap,
                    },
                    {
                      title: "Professional Certifications",
                      detail: "Professional memberships and certification references.",
                      icon: Award,
                    },
                    {
                      title: "Role Competency Records",
                      detail: "Institutionally verified role requirements and assessment history.",
                      icon: ClipboardCheck,
                    },
                    {
                      title: "Credential Verification",
                      detail: "Issuing body, verification date and evidence references.",
                      icon: FileCheck2,
                    },
                  ].map(({ title, detail, icon: Icon }) => (
                    <div
                      key={title}
                      className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5"
                    >
                      <Icon size={19} className="text-cyan-300" />
                      <h4 className="mt-4 text-xs font-semibold text-zinc-200">
                        {title}
                      </h4>
                      <p className="mt-2 text-[11px] leading-5 text-zinc-500">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                  <h4 className="text-xs font-semibold text-white">
                    Personnel Qualification Summary
                  </h4>
                  <div className="mt-4 space-y-3">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-xs text-zinc-200">
                            {employee.name}
                          </p>
                          <p className="mt-1 text-[10px] text-zinc-500">
                            {employee.qualification}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {employee.employeeId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Compliance" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Workforce Compliance Centre
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Training status, records governance and institutional review
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5">
                    <CheckCircle2 size={19} className="text-emerald-400" />
                    <p className="mt-4 text-2xl font-semibold text-white">
                      {compliantEmployees}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Training compliant
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-5">
                    <CalendarDays size={19} className="text-amber-400" />
                    <p className="mt-4 text-2xl font-semibold text-white">
                      {employees.filter((e) => e.training === "Due Soon").length}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Due soon
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.04] p-5">
                    <ShieldAlert size={19} className="text-rose-400" />
                    <p className="mt-4 text-2xl font-semibold text-white">
                      {overdueEmployees}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Overdue
                    </p>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">Personnel</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Training Status</th>
                        <th className="px-4 py-3 font-medium">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {employees.map((employee) => (
                        <tr key={employee.id} className="text-xs">
                          <td className="px-4 py-4 text-zinc-200">
                            {employee.name}
                          </td>
                          <td className="px-4 py-4 text-zinc-400">
                            {employee.department}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={employee.training} />
                          </td>
                          <td className="px-4 py-4 text-zinc-500">
                            {employee.training === "Overdue"
                              ? "Follow-up required"
                              : employee.training === "Due Soon"
                                ? "Review schedule"
                                : "Recorded"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-white/[0.07] bg-[#10141c] p-5">
          <div className="flex items-center gap-2 text-cyan-300">
            <Shield size={17} />
            <h3 className="text-xs font-semibold text-white">
              Workforce Governance Principles
            </h3>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ["Competence", "Documented qualifications and verified credentials."],
              ["Accountability", "Clear institutional roles and responsible officers."],
              ["Continuous Learning", "Structured training and periodic review."],
            ].map(([title, detail]) => (
              <div key={title}>
                <p className="text-xs font-medium text-zinc-200">{title}</p>
                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] py-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-400">
              APEXIVEAI ENERGY OS
            </p>
            <p className="mt-1 text-[10px] text-zinc-600">
              Workforce & Training Management · Demonstration Workspace
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/energy-os/radioactive-waste"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={13} /> Previous Module
            </Link>
            <Link
              href="/energy-os/procurement-financial"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-[11px] text-cyan-300 hover:bg-cyan-400/10"
            >
              Next Module <ArrowRight size={13} />
            </Link>
          </div>
        </footer>
      </div>

      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#111722] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Add Personnel
                </h2>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Create an administrative workforce record
                </p>
              </div>
              <button
                onClick={() => setShowEmployeeModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={addEmployee} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Full Name
                </label>
                <input
                  required
                  value={employeeName}
                  onChange={(event) => setEmployeeName(event.target.value)}
                  placeholder="Enter personnel name"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Department
                </label>
                <select
                  value={employeeDepartment}
                  onChange={(event) =>
                    setEmployeeDepartment(event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  {[
                    "Programme Governance",
                    "Regulatory Affairs",
                    "Project Management",
                    "Environmental Governance",
                    "Administration",
                    "Research & Development",
                  ].map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Position / Role
                </label>
                <input
                  required
                  value={employeeRole}
                  onChange={(event) => setEmployeeRole(event.target.value)}
                  placeholder="Enter position"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Qualification
                </label>
                <input
                  required
                  value={employeeQualification}
                  onChange={(event) =>
                    setEmployeeQualification(event.target.value)
                  }
                  placeholder="Enter qualification"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#071018] hover:bg-cyan-300"
                >
                  Create Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTrainingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#111722] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Create Training Programme
                </h2>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Add a professional development programme
                </p>
              </div>
              <button
                onClick={() => setShowTrainingModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={addTraining} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Programme Title
                </label>
                <input
                  required
                  value={trainingTitle}
                  onChange={(event) => setTrainingTitle(event.target.value)}
                  placeholder="Enter programme title"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Category
                </label>
                <select
                  value={trainingCategory}
                  onChange={(event) => setTrainingCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  <option>Governance</option>
                  <option>Compliance</option>
                  <option>Environment</option>
                  <option>Preparedness</option>
                  <option>Project Management</option>
                  <option>Professional Development</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Target Audience
                </label>
                <input
                  required
                  value={trainingAudience}
                  onChange={(event) => setTrainingAudience(event.target.value)}
                  placeholder="Enter target audience"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-zinc-400">
                    Scheduled Date
                  </label>
                  <input
                    required
                    type="date"
                    value={trainingDate}
                    onChange={(event) => setTrainingDate(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-zinc-400">
                    Participants
                  </label>
                  <input
                    required
                    min="1"
                    type="number"
                    value={trainingParticipants}
                    onChange={(event) =>
                      setTrainingParticipants(event.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={() => setShowTrainingModal(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#071018] hover:bg-cyan-300"
                >
                  Create Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-5 right-5 z-40 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-400/20 bg-[#101a19] px-4 py-3 text-xs text-emerald-300 shadow-xl">
          <CheckCircle2 size={16} />
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="ml-2 text-zinc-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}
