
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  Database,
  Eye,
  FilePlus2,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

type SpaceModule = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  status: string;
  records: string;
  accent: string;
  capabilities: string[];
  columns: string[];
};

type RecordStatus = "Active" | "Draft" | "Under Review" | "Archived";

type SpaceRecord = {
  id: string;
  values: string[];
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

type ActivityItem = {
  id: string;
  action: string;
  recordName: string;
  time: string;
};

const MODULE_FIELDS: Record<string, string[]> = {
  "satellite-fleet": [
    "Satellite Name",
    "Satellite ID",
    "Operator",
    "Orbit Type",
    "Launch Date",
  ],
  "ground-stations": [
    "Station Name",
    "Station Code",
    "Country / Region",
    "Facility Type",
    "Contact Organization",
  ],
  missions: [
    "Mission Name",
    "Mission Code",
    "Mission Type",
    "Lead Organization",
    "Scheduled Date",
  ],
  "earth-observation": [
    "Dataset / Collection",
    "Observation Type",
    "Region",
    "Source",
    "Acquisition Date",
  ],
  "satellite-telecommunications": [
    "Service Name",
    "Service Code",
    "Frequency Band",
    "Coverage Region",
    "Provider",
  ],
  navigation: [
    "Service Name",
    "Service ID",
    "Service Type",
    "Coverage Area",
    "Provider",
  ],
  "data-intelligence": [
    "Dataset",
    "Data Type",
    "Source",
    "Updated",
    "Owner",
  ],
  "weather-climate": [
    "Dataset",
    "Observation",
    "Region",
    "Updated",
    "Source",
  ],
  "disaster-response": [
    "Event",
    "Event Type",
    "Region",
    "Reported",
    "Reporting Agency",
  ],
  sustainability: [
    "Record",
    "Category",
    "Organization",
    "Review Date",
    "Reference",
  ],
  research: [
    "Project",
    "Institution",
    "Research Area",
    "Updated",
    "Project Lead",
  ],
  "international-cooperation": [
    "Partner",
    "Country",
    "Programme",
    "Agreement",
    "Contact Organization",
  ],
};

const STATUS_OPTIONS: RecordStatus[] = [
  "Active",
  "Draft",
  "Under Review",
  "Archived",
];

const STORAGE_PREFIX = "apexiveai-space-os-records-v1:";

function makeSeedRecords(module: SpaceModule): SpaceRecord[] {
  const now = new Date().toISOString();

  const examples: Record<string, string[][]> = {
    "satellite-fleet": [
      ["ASTER-01", "SAT-001", "Apexive Research", "LEO", "2026-01-15"],
      ["ORBIT-02", "SAT-002", "Research Institute", "LEO", "2026-04-20"],
    ],
    "ground-stations": [
      ["Yangon Ground Station", "YGN-GS-01", "Myanmar", "Research Facility", "Apexive Research"],
      ["Mandalay Station", "MDY-GS-02", "Myanmar", "Tracking Facility", "Space Research Group"],
    ],
    missions: [
      ["Earth Observation Mission", "M-001", "Earth Observation", "Research Institute", "2026-12-01"],
      ["Climate Data Programme", "M-002", "Climate Research", "Apexive Research", "2027-01-15"],
    ],
    "earth-observation": [
      ["Myanmar Land Cover", "Optical Imagery", "Myanmar", "Research Archive", "2026-11-20"],
      ["Coastal Observation", "Remote Sensing", "Ayeyarwady", "Data Provider", "2026-11-18"],
    ],
    "satellite-telecommunications": [
      ["Regional Data Link", "COM-001", "Ku Band", "Southeast Asia", "Telecom Provider"],
      ["Research Connectivity", "COM-002", "Ka Band", "Myanmar", "Research Network"],
    ],
    navigation: [
      ["Regional Positioning", "NAV-001", "Positioning", "Southeast Asia", "Service Provider"],
      ["Research Navigation", "NAV-002", "Navigation Data", "Myanmar", "Research Institute"],
    ],
    "data-intelligence": [
      ["Regional Climate Dataset", "Climate", "Research Archive", "2026-11-22", "Data Office"],
      ["Satellite Imagery Index", "Imagery", "Observation Centre", "2026-11-20", "Data Office"],
    ],
    "weather-climate": [
      ["Myanmar Weather Records", "Weather Observation", "Myanmar", "2026-11-22", "Climate Centre"],
      ["Regional Climate Archive", "Climate Data", "Southeast Asia", "2026-11-19", "Research Institute"],
    ],
    "disaster-response": [
      ["Flood Monitoring Record", "Flood", "Ayeyarwady", "2026-11-22", "Monitoring Centre"],
      ["Weather Situation Report", "Severe Weather", "Central Myanmar", "2026-11-20", "Research Group"],
    ],
    sustainability: [
      ["Data Governance Review", "Governance", "Apexive Research", "2026-12-15", "SG-001"],
      ["Sustainability Assessment", "Sustainability", "Research Institute", "2027-01-10", "SG-002"],
    ],
    research: [
      ["Satellite Data Research", "Research Institute", "Remote Sensing", "2026-11-22", "Research Lead"],
      ["Space Education Programme", "Apexive Research", "Education", "2026-11-18", "Programme Lead"],
    ],
    "international-cooperation": [
      ["Regional Research Partnership", "Singapore", "Joint Research", "Under Discussion", "Partner Office"],
      ["Space Education Exchange", "Japan", "Education", "Draft Agreement", "Research Office"],
    ],
  };

  return (examples[module.slug] || []).map((values, index) => ({
    id: `${module.slug}-${index + 1}`,
    values,
    status: index === 0 ? "Active" : "Under Review",
    createdAt: now,
    updatedAt: now,
  }));
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
}

function statusClass(status: RecordStatus) {
  switch (status) {
    case "Active":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "Draft":
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    case "Under Review":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "Archived":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }
}

export default function SpaceWorkspaceEngine({
  module,
}: {
  module: SpaceModule;
}) {
  const fields = MODULE_FIELDS[module.slug] || module.columns.slice(0, 5);

  const [records, setRecords] = useState<SpaceRecord[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<SpaceRecord | null>(null);
  const [formValues, setFormValues] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<RecordStatus>("Draft");
  const [formError, setFormError] = useState("");

  const storageKey = `${STORAGE_PREFIX}${module.slug}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored) as SpaceRecord[];
        setRecords(Array.isArray(parsed) ? parsed : makeSeedRecords(module));
      } else {
        setRecords(makeSeedRecords(module));
      }

      const savedActivities = localStorage.getItem(`${storageKey}:activity`);
      setActivities(savedActivities ? JSON.parse(savedActivities) : []);
    } catch {
      setRecords(makeSeedRecords(module));
      setActivities([]);
    }

    setLoaded(true);
  }, [storageKey, module]);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(storageKey, JSON.stringify(records));
    localStorage.setItem(`${storageKey}:activity`, JSON.stringify(activities));
  }, [records, activities, loaded, storageKey]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.values.some((value) => value.toLowerCase().includes(query)) ||
        record.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const activeCount = records.filter((item) => item.status === "Active").length;
  const reviewCount = records.filter((item) => item.status === "Under Review").length;
  const draftCount = records.filter((item) => item.status === "Draft").length;

  function addActivity(action: string, recordName: string) {
    const item: ActivityItem = {
      id: `${Date.now()}`,
      action,
      recordName,
      time: new Date().toLocaleString(),
    };

    setActivities((current) => [item, ...current].slice(0, 20));
  }

  function openCreate() {
    setSelected(null);
    setFormValues(fields.map(() => ""));
    setFormStatus("Draft");
    setFormError("");
    setModalMode("create");
  }

  function openEdit(record: SpaceRecord) {
    setSelected(record);
    setFormValues([...record.values]);
    setFormStatus(record.status);
    setFormError("");
    setModalMode("edit");
  }

  function openView(record: SpaceRecord) {
    setSelected(record);
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelected(null);
    setFormError("");
  }

  function saveRecord() {
    if (formValues.some((value) => !value.trim())) {
      setFormError("Please complete all required fields.");
      return;
    }

    const now = new Date().toISOString();
    const recordName = formValues[0] || "Untitled record";

    if (modalMode === "edit" && selected) {
      const updated: SpaceRecord = {
        ...selected,
        values: formValues,
        status: formStatus,
        updatedAt: now,
      };

      setRecords((current) =>
        current.map((item) => item.id === selected.id ? updated : item)
      );
      addActivity("Record updated", recordName);
    } else {
      const created: SpaceRecord = {
        id: `${module.slug}-${Date.now()}`,
        values: formValues,
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      };

      setRecords((current) => [created, ...current]);
      addActivity("Record created", recordName);
    }

    closeModal();
  }

  function deleteRecord(record: SpaceRecord) {
    const confirmed = window.confirm(
      `Delete "${record.values[0]}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setRecords((current) => current.filter((item) => item.id !== record.id));
    addActivity("Record deleted", record.values[0]);
  }

  function resetDemoData() {
    const confirmed = window.confirm(
      "Reset this module to its original demo records?"
    );

    if (!confirmed) return;

    setRecords(makeSeedRecords(module));
    setActivities([]);
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-4 pb-16 pt-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <a
            href="/space-os"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Space OS Command Center
          </a>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            CIVILIAN SPACE DATA WORKSPACE
          </div>
        </div>

        <section className="relative mb-7 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111c31] via-[#101827] to-[#0b1020] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-cyan-400/10" />
          <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-violet-400/10" />

          <div className="relative max-w-4xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-cyan-300">
              {module.category}
            </p>

            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {module.name}
            </h1>

            <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              {module.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {module.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Records", value: records.length, icon: Database },
            { label: "Active Records", value: activeCount, icon: ShieldCheck },
            { label: "Under Review", value: reviewCount, icon: Clock3 },
            { label: "Draft Records", value: draftCount, icon: FilePlus2 },
          ].map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-[#101827] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <Icon size={18} className="text-cyan-300" />
                </div>
                <div className="text-3xl font-semibold text-white">
                  {metric.value.toString().padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0e1625]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Data Registry</h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage, review and maintain module records
              </p>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#07111c] transition hover:bg-cyan-300"
            >
              <Plus size={17} />
              Create Record
            </button>
          </div>

          <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${module.shortName} records...`}
                className="w-full rounded-xl border border-white/10 bg-[#080f1c] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#080f1c] py-3 pl-9 pr-9 text-sm text-slate-300 outline-none focus:border-cyan-400/50 sm:w-48"
              >
                <option value="All">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            <button
              onClick={resetDemoData}
              title="Reset demo records"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              <RefreshCw size={15} />
              Reset Demo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-white/[0.025]">
                  {module.columns.map((column) => (
                    <th
                      key={column}
                      className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {column}
                    </th>
                  ))}
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Lifecycle
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-white/[0.06] transition hover:bg-white/[0.025]"
                  >
                    {module.columns.map((column, index) => (
                      <td key={column} className="px-5 py-4 text-sm">
                        <span className={index === 0 ? "font-medium text-white" : "text-slate-400"}>
                          {record.values[index] || "—"}
                        </span>
                      </td>
                    ))}

                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openView(record)}
                          title="View record"
                          className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-cyan-300"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(record)}
                          title="Edit record"
                          className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteRecord(record)}
                          title="Delete record"
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={module.columns.length + 2}
                      className="px-5 py-16 text-center"
                    >
                      <Database size={28} className="mx-auto mb-3 text-slate-600" />
                      <p className="text-sm font-medium text-slate-300">No records found</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Change your search or create a new record.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-slate-500">
            <span>
              Showing {filteredRecords.length} of {records.length} records
            </span>
            <span>Local demo storage · {module.slug}</span>
          </div>
        </section>

        <section className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-[#101827] p-5">
            <div className="mb-5 flex items-center gap-2">
              <Activity size={17} className="text-cyan-300" />
              <h3 className="font-semibold text-white">Recent Activity</h3>
            </div>

            {activities.length === 0 ? (
              <p className="py-5 text-sm text-slate-500">
                No activity recorded yet. Changes made in this workspace will appear here.
              </p>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-200">{item.action}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{item.recordName}</p>
                      <p className="mt-1 text-[10px] text-slate-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101827] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-300" />
              <h3 className="font-semibold text-white">Data Governance</h3>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              This workspace currently stores demonstration records in this browser.
              It is not yet connected to the central Space OS API or PostgreSQL database.
            </p>
            <div className="mt-5 rounded-xl border border-amber-400/15 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200/80">
              Demo environment. Do not enter confidential, sensitive or operational data.
            </div>
          </div>
        </section>
      </div>

      {modalMode && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
                  {module.category}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {modalMode === "create" ? "Create Record" : modalMode === "edit" ? "Edit Record" : "Record Details"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {modalMode === "view" && selected ? (
              <div className="space-y-4 p-5 sm:p-6">
                {fields.map((field, index) => (
                  <div key={field} className="grid grid-cols-1 gap-1 border-b border-white/[0.06] pb-3 sm:grid-cols-[180px_1fr]">
                    <span className="text-xs text-slate-500">{field}</span>
                    <span className="text-sm text-slate-200">{selected.values[index] || "—"}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">Lifecycle Status</span>
                  <span className={`rounded-full border px-3 py-1 text-xs ${statusClass(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button onClick={closeModal} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300">
                    Close
                  </button>
                  <button onClick={() => openEdit(selected)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950">
                    <Pencil size={15} /> Edit Record
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5 sm:p-6">
                {fields.map((field, index) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-xs font-medium text-slate-400">
                      {field} <span className="text-cyan-400">*</span>
                    </span>
                    <input
                      value={formValues[index] || ""}
                      onChange={(event) => {
                        const next = [...formValues];
                        next[index] = event.target.value;
                        setFormValues(next);
                      }}
                      placeholder={`Enter ${field.toLowerCase()}`}
                      className="w-full rounded-xl border border-white/10 bg-[#080f1c] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-slate-400">Lifecycle Status</span>
                  <select
                    value={formStatus}
                    onChange={(event) => setFormStatus(event.target.value as RecordStatus)}
                    className="w-full rounded-xl border border-white/10 bg-[#080f1c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>

                {formError && (
                  <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-300">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={closeModal}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveRecord}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    <Check size={16} />
                    {modalMode === "edit" ? "Save Changes" : "Create Record"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
