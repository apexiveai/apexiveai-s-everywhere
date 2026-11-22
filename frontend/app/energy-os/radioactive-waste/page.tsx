"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileText,
  Filter,
  LockKeyhole,
  Package,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  Truck,
  X,
} from "lucide-react";

type WasteRecord = {
  id: string;
  reference: string;
  category: string;
  source: string;
  facility: string;
  recordedDate: string;
  approval: "Approved" | "Pending Review" | "Under Review";
  status: "Registered" | "Under Review" | "Archived";
};

type Facility = {
  name: string;
  type: string;
  region: string;
  status: "Registered" | "Under Review";
  records: number;
};

const initialRecords: WasteRecord[] = [
  {
    id: "1",
    reference: "RWG-2026-001",
    category: "Institutional Research",
    source: "Research Institution A",
    facility: "Central Records Facility",
    recordedDate: "2026-10-12",
    approval: "Approved",
    status: "Registered",
  },
  {
    id: "2",
    reference: "RWG-2026-002",
    category: "Medical & Healthcare",
    source: "Healthcare Institution B",
    facility: "Regional Records Facility",
    recordedDate: "2026-10-18",
    approval: "Pending Review",
    status: "Under Review",
  },
  {
    id: "3",
    reference: "RWG-2026-003",
    category: "Industrial Applications",
    source: "Industrial License Holder C",
    facility: "Central Records Facility",
    recordedDate: "2026-10-22",
    approval: "Under Review",
    status: "Under Review",
  },
  {
    id: "4",
    reference: "RWG-2026-004",
    category: "Research & Education",
    source: "University Research Unit",
    facility: "Regional Records Facility",
    recordedDate: "2026-11-02",
    approval: "Approved",
    status: "Registered",
  },
];

const initialFacilities: Facility[] = [
  {
    name: "Central Records Facility",
    type: "National Registry",
    region: "National Administration",
    status: "Registered",
    records: 128,
  },
  {
    name: "Regional Records Facility",
    type: "Regional Registry",
    region: "Regional Administration",
    status: "Registered",
    records: 46,
  },
  {
    name: "Research Documentation Centre",
    type: "Research Records",
    region: "Research Administration",
    status: "Under Review",
    records: 18,
  },
];

const tabs = [
  "Overview",
  "Waste Inventory",
  "Facilities",
  "Transfer Records",
  "Approvals",
  "Audit & Compliance",
] as const;

type Tab = (typeof tabs)[number];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Registered: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    "Pending Review": "border-amber-500/20 bg-amber-500/10 text-amber-400",
    "Under Review": "border-violet-500/20 bg-violet-500/10 text-violet-400",
    Archived: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
        styles[status] ?? styles.Archived
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
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Shield;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10141c] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">{label}</p>
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

export default function RadioactiveWastePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newReference, setNewReference] = useState("");
  const [newCategory, setNewCategory] = useState("Institutional Research");
  const [newSource, setNewSource] = useState("");
  const [newFacility, setNewFacility] = useState("Central Records Facility");
  const [notice, setNotice] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const query = search.toLowerCase();
      const matchesSearch =
        record.reference.toLowerCase().includes(query) ||
        record.category.toLowerCase().includes(query) ||
        record.source.toLowerCase().includes(query) ||
        record.facility.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        record.status === filter ||
        record.approval === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  const approvedCount = records.filter(
    (record) => record.approval === "Approved",
  ).length;

  const pendingCount = records.filter(
    (record) =>
      record.approval === "Pending Review" ||
      record.approval === "Under Review",
  ).length;

  function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newReference.trim() || !newSource.trim()) {
      setNotice("Reference ID and source organisation are required.");
      return;
    }

    const record: WasteRecord = {
      id: `${Date.now()}`,
      reference: newReference.trim(),
      category: newCategory,
      source: newSource.trim(),
      facility: newFacility,
      recordedDate: new Date().toISOString().slice(0, 10),
      approval: "Pending Review",
      status: "Under Review",
    };

    setRecords((current) => [record, ...current]);
    setNewReference("");
    setNewSource("");
    setShowModal(false);
    setNotice("New administrative record added to this session.");
    setActiveTab("Waste Inventory");
  }

  function updateStatus(id: string, status: WasteRecord["status"]) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status,
              approval:
                status === "Archived" ? record.approval : "Under Review",
            }
          : record,
      ),
    );
  }

  function exportRecords() {
    const headers = [
      "Reference",
      "Category",
      "Source",
      "Facility",
      "Recorded Date",
      "Approval",
      "Status",
    ];

    const rows = filteredRecords.map((record) => [
      record.reference,
      record.category,
      record.source,
      record.facility,
      record.recordedDate,
      record.approval,
      record.status,
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
    anchor.download = "apexiveai-waste-governance-register.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const facilities = initialFacilities;

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
              <Shield size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-white">
                APEXIVE<span className="text-cyan-300">AI</span>
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Energy OS / Governance Workspace
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
                  Module 08 / 12
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  National Programme Administration
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Radioactive Waste
                <span className="block text-cyan-300">
                  Governance & Registry
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                A central administrative workspace for waste inventory
                documentation, institutional records, regulatory approvals,
                facility registers, transfer traceability and compliance
                oversight.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportRecords}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07]"
              >
                <Download size={15} />
                Export Register
              </button>
              <button
                onClick={() => {
                  setNotice("");
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-semibold text-[#071018] transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                New Record
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Registered Records"
            value={String(records.length).padStart(2, "0")}
            detail="Administrative inventory entries"
            icon={Archive}
          />
          <MetricCard
            label="Approved Records"
            value={String(approvedCount).padStart(2, "0")}
            detail="Approval status in this demo register"
            icon={BadgeCheck}
          />
          <MetricCard
            label="Pending Reviews"
            value={String(pendingCount).padStart(2, "0")}
            detail="Awaiting administrative review"
            icon={FileCheck2}
          />
          <MetricCard
            label="Registered Facilities"
            value={String(facilities.length).padStart(2, "0")}
            detail="Illustrative registry locations"
            icon={Building2}
          />
        </section>

        <section className="mb-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.045] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-amber-400/10 p-2 text-amber-300">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-200">
                Governance & Safety Boundary
              </p>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                This workspace is for administrative records and regulatory
                oversight only. It does not provide instructions for handling,
                processing, transporting, treating or disposing of radioactive
                materials. All real-world activities require appropriately
                authorised institutions, qualified professionals and
                independent regulatory oversight.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10141c]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Governance Workspace
              </h2>
              <p className="mt-1 text-[11px] text-zinc-500">
                Registry, documentation and institutional oversight
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
                      <ClipboardCheck size={17} />
                      <h3 className="text-sm font-semibold text-white">
                        Registry Overview
                      </h3>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-zinc-500">
                      Maintain an auditable administrative record of
                      institutional declarations, classification references,
                      approval history and responsible organisations.
                    </p>
                    <div className="mt-5 space-y-3">
                      {[
                        ["Inventory records", records.length],
                        ["Approved entries", approvedCount],
                        ["Pending reviews", pendingCount],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0"
                        >
                          <span className="text-xs text-zinc-400">
                            {label}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <LockKeyhole size={17} />
                      <h3 className="text-sm font-semibold text-white">
                        Governance Priorities
                      </h3>
                    </div>
                    <div className="mt-4 space-y-4">
                      {[
                        ["Institutional accountability", "Organisation ownership and responsible officers"],
                        ["Regulatory traceability", "Approval references and review history"],
                        ["Document integrity", "Controlled records and audit evidence"],
                        ["Public accountability", "Approved transparency reporting"],
                      ].map(([title, description], index) => (
                        <div key={title} className="flex gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.08] text-[10px] font-semibold text-cyan-300">
                            0{index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-medium text-zinc-200">
                              {title}
                            </p>
                            <p className="mt-1 text-[11px] text-zinc-500">
                              {description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Recent Registry Entries
                    </h3>
                    <button
                      onClick={() => setActiveTab("Waste Inventory")}
                      className="text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      View all <ArrowRight className="ml-1 inline" size={13} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {records.slice(0, 3).map((record) => (
                      <div
                        key={record.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.015] p-3"
                      >
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">
                            {record.reference}
                          </p>
                          <p className="mt-1 text-[11px] text-zinc-500">
                            {record.category} · {record.source}
                          </p>
                        </div>
                        <StatusBadge status={record.approval} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Waste Inventory" && (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Administrative Inventory Register
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Search and review illustrative registry entries
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-[#071018]"
                  >
                    <Plus size={14} /> Add Entry
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
                      placeholder="Search reference, source or facility..."
                      className="w-full rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
                    />
                  </div>
                  <div className="relative">
                    <Filter
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={14}
                    />
                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="appearance-none rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-9 text-xs text-zinc-300 outline-none"
                    >
                      <option>All</option>
                      <option>Registered</option>
                      <option>Under Review</option>
                      <option>Archived</option>
                      <option>Approved</option>
                      <option>Pending Review</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={13}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">Reference</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Facility</th>
                        <th className="px-4 py-3 font-medium">Approval</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="text-xs text-zinc-300 hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-4 font-semibold text-cyan-300">
                            {record.reference}
                          </td>
                          <td className="px-4 py-4">{record.category}</td>
                          <td className="px-4 py-4">{record.source}</td>
                          <td className="px-4 py-4">{record.facility}</td>
                          <td className="px-4 py-4">
                            <StatusBadge status={record.approval} />
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={record.status} />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              aria-label={`Update ${record.reference} status`}
                              value={record.status}
                              onChange={(event) =>
                                updateStatus(
                                  record.id,
                                  event.target.value as WasteRecord["status"],
                                )
                              }
                              className="rounded-md border border-white/10 bg-[#0b0f16] px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                            >
                              <option>Registered</option>
                              <option>Under Review</option>
                              <option>Archived</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredRecords.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-10 text-center text-xs text-zinc-500"
                          >
                            No matching records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[10px] text-zinc-600">
                  Showing {filteredRecords.length} of {records.length} records
                </p>
              </div>
            )}

            {activeTab === "Facilities" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Facility & Institution Register
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Administrative directory of registered record custodians
                  </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {facilities.map((facility) => (
                    <div
                      key={facility.name}
                      className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                          <Building2 size={19} />
                        </div>
                        <StatusBadge status={facility.status} />
                      </div>
                      <h4 className="mt-4 text-sm font-semibold text-white">
                        {facility.name}
                      </h4>
                      <p className="mt-1 text-xs text-zinc-500">
                        {facility.type}
                      </p>
                      <div className="mt-5 flex justify-between border-t border-white/[0.06] pt-4">
                        <span className="text-[11px] text-zinc-500">
                          {facility.region}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200">
                          {facility.records} records
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Transfer Records" && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                    <Truck size={19} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Transfer Documentation Register
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Administrative chain-of-custody and authorisation records
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                  <p className="text-xs leading-6 text-zinc-400">
                    This register is reserved for documenting approved
                    institutional transfers, responsible organisations,
                    authorisation references, document receipt confirmations
                    and audit history. It does not provide routes, handling
                    procedures, transport specifications or operational
                    instructions.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Transfer Request", "Institutional request documentation"],
                      ["Authorisation", "Regulatory approval reference"],
                      ["Receipt Confirmation", "Custody acknowledgement record"],
                    ].map(([title, description]) => (
                      <div
                        key={title}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                      >
                        <FileText size={17} className="text-cyan-300" />
                        <p className="mt-3 text-xs font-semibold text-zinc-200">
                          {title}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 rounded-lg border border-amber-400/10 bg-amber-400/[0.04] p-3 text-[11px] leading-5 text-amber-200/80">
                    No live transfer workflow is enabled in this demonstration.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Approvals" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Regulatory Approval Tracking
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Review status of illustrative administrative records
                  </p>
                </div>
                <div className="space-y-3">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#0b0f16] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-cyan-400/[0.08] p-2.5 text-cyan-300">
                          <FileCheck2 size={17} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {record.reference}
                          </p>
                          <p className="mt-1 text-[11px] text-zinc-500">
                            {record.source} · {record.recordedDate}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={record.approval} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Audit & Compliance" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Audit & Compliance Centre
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Oversight framework and evidence management
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Document Control",
                      detail: "Version history, ownership and document integrity.",
                      icon: FileText,
                    },
                    {
                      title: "Regulatory Reviews",
                      detail: "Review references, findings and approval history.",
                      icon: Shield,
                    },
                    {
                      title: "Institutional Accountability",
                      detail: "Responsible organisations and designated officers.",
                      icon: Building2,
                    },
                    {
                      title: "Audit Evidence",
                      detail: "Evidence register, review notes and corrective-action tracking.",
                      icon: ClipboardCheck,
                    },
                    {
                      title: "Records Retention",
                      detail: "Retention schedules and authorised archive references.",
                      icon: Archive,
                    },
                    {
                      title: "Compliance Reporting",
                      detail: "Management summaries and approved public reports.",
                      icon: CheckCircle2,
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
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-[#10141c] p-5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Package size={17} />
              <h3 className="text-xs font-semibold text-white">
                Administrative Scope
              </h3>
            </div>
            <p className="mt-3 text-xs leading-6 text-zinc-500">
              Inventory metadata, institutional declarations, document
              registers, approval references, audit evidence and transparency
              reporting.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#10141c] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <LockKeyhole size={17} />
              <h3 className="text-xs font-semibold text-white">
                Data & Operational Boundary
              </h3>
            </div>
            <p className="mt-3 text-xs leading-6 text-zinc-500">
              Demonstration data only. No real radioactive material inventory,
              facility access, transfer authorisation or operational safety
              system is connected.
            </p>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] py-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-400">
              APEXIVEAI ENERGY OS
            </p>
            <p className="mt-1 text-[10px] text-zinc-600">
              Radioactive Waste Governance · Demonstration Workspace
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/energy-os/emergency-response"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={13} /> Previous Module
            </Link>
            <Link
              href="/energy-os/workforce-training"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-[11px] text-cyan-300 hover:bg-cyan-400/10"
            >
              Next Module <ArrowRight size={13} />
            </Link>
          </div>
        </footer>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#111722] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Create Inventory Record
                </h2>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Administrative metadata only
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={createRecord} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Reference ID
                </label>
                <input
                  required
                  value={newReference}
                  onChange={(event) => setNewReference(event.target.value)}
                  placeholder="e.g. RWG-2026-005"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Administrative Category
                </label>
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  <option>Institutional Research</option>
                  <option>Medical & Healthcare</option>
                  <option>Industrial Applications</option>
                  <option>Research & Education</option>
                  <option>Other Licensed Institution</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Source Organisation
                </label>
                <input
                  required
                  value={newSource}
                  onChange={(event) => setNewSource(event.target.value)}
                  placeholder="Organisation name"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Registry Facility
                </label>
                <select
                  value={newFacility}
                  onChange={(event) => setNewFacility(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  {facilities.map((facility) => (
                    <option key={facility.name}>{facility.name}</option>
                  ))}
                </select>
              </div>

              {notice && (
                <p className="rounded-lg border border-amber-400/15 bg-amber-400/[0.05] p-3 text-[11px] text-amber-200">
                  {notice}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#071018] hover:bg-cyan-300"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && !showModal && (
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