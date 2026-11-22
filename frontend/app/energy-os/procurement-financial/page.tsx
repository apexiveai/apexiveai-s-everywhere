
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Coins,
  Download,
  FileCheck2,
  FileText,
  Filter,
  HandCoins,
  Landmark,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

type Procurement = {
  id: string;
  reference: string;
  title: string;
  category: string;
  department: string;
  estimatedValue: number;
  currency: string;
  deadline: string;
  status: "Planning" | "Open" | "Under Evaluation" | "Awarded" | "Closed";
};

type Contract = {
  id: string;
  reference: string;
  supplier: string;
  title: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Pending Review" | "Completed";
};

type Invoice = {
  id: string;
  reference: string;
  supplier: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
};

type Tab =
  | "Overview"
  | "Budget Planning"
  | "Procurement Register"
  | "Suppliers"
  | "Contracts"
  | "Invoices";

const initialProcurements: Procurement[] = [
  {
    id: "1",
    reference: "PR-2026-001",
    title: "Programme Management Consultancy",
    category: "Professional Services",
    department: "Programme Governance",
    estimatedValue: 450000,
    currency: "USD",
    deadline: "2026-12-15",
    status: "Open",
  },
  {
    id: "2",
    reference: "PR-2026-002",
    title: "Environmental Assessment Services",
    category: "Environmental Services",
    department: "Environmental Governance",
    estimatedValue: 280000,
    currency: "USD",
    deadline: "2026-12-20",
    status: "Under Evaluation",
  },
  {
    id: "3",
    reference: "PR-2026-003",
    title: "Enterprise Records Management Platform",
    category: "Information Technology",
    department: "Digital Administration",
    estimatedValue: 175000,
    currency: "USD",
    deadline: "2027-01-10",
    status: "Planning",
  },
  {
    id: "4",
    reference: "PR-2026-004",
    title: "Workforce Development Services",
    category: "Training & Education",
    department: "Human Capital",
    estimatedValue: 320000,
    currency: "USD",
    deadline: "2026-11-28",
    status: "Awarded",
  },
  {
    id: "5",
    reference: "PR-2026-005",
    title: "Independent Governance Advisory",
    category: "Professional Services",
    department: "Regulatory Affairs",
    estimatedValue: 210000,
    currency: "USD",
    deadline: "2027-01-15",
    status: "Open",
  },
];

const initialContracts: Contract[] = [
  {
    id: "1",
    reference: "CON-2026-001",
    supplier: "Global Advisory Partners",
    title: "Programme Governance Advisory",
    value: 450000,
    currency: "USD",
    startDate: "2026-08-01",
    endDate: "2027-07-31",
    status: "Active",
  },
  {
    id: "2",
    reference: "CON-2026-002",
    supplier: "Environmental Consulting Group",
    title: "Environmental Assessment",
    value: 280000,
    currency: "USD",
    startDate: "2026-09-01",
    endDate: "2027-03-31",
    status: "Pending Review",
  },
  {
    id: "3",
    reference: "CON-2026-003",
    supplier: "Professional Learning Institute",
    title: "Institutional Training Programme",
    value: 320000,
    currency: "USD",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    status: "Active",
  },
];

const initialInvoices: Invoice[] = [
  {
    id: "1",
    reference: "INV-2026-001",
    supplier: "Global Advisory Partners",
    description: "Quarterly advisory services",
    amount: 75000,
    currency: "USD",
    dueDate: "2026-11-25",
    status: "Pending",
  },
  {
    id: "2",
    reference: "INV-2026-002",
    supplier: "Environmental Consulting Group",
    description: "Assessment milestone payment",
    amount: 45000,
    currency: "USD",
    dueDate: "2026-10-30",
    status: "Overdue",
  },
  {
    id: "3",
    reference: "INV-2026-003",
    supplier: "Professional Learning Institute",
    description: "Training programme delivery",
    amount: 32000,
    currency: "USD",
    dueDate: "2026-11-12",
    status: "Paid",
  },
  {
    id: "4",
    reference: "INV-2026-004",
    supplier: "Global Advisory Partners",
    description: "Documentation and reporting",
    amount: 25000,
    currency: "USD",
    dueDate: "2026-12-05",
    status: "Pending",
  },
];

const suppliers = [
  {
    name: "Global Advisory Partners",
    category: "Professional Services",
    country: "Singapore",
    contracts: 1,
    status: "Approved",
  },
  {
    name: "Environmental Consulting Group",
    category: "Environmental Services",
    country: "Australia",
    contracts: 1,
    status: "Under Review",
  },
  {
    name: "Professional Learning Institute",
    category: "Training & Education",
    country: "United Kingdom",
    contracts: 1,
    status: "Approved",
  },
  {
    name: "Enterprise Digital Solutions",
    category: "Information Technology",
    country: "Japan",
    contracts: 0,
    status: "Pending Review",
  },
];

const initialBudget = [
  {
    department: "Programme Governance",
    allocation: 1800000,
    committed: 950000,
    spent: 620000,
  },
  {
    department: "Environmental Governance",
    allocation: 1200000,
    committed: 680000,
    spent: 410000,
  },
  {
    department: "Human Capital",
    allocation: 950000,
    committed: 510000,
    spent: 290000,
  },
  {
    department: "Digital Administration",
    allocation: 750000,
    committed: 220000,
    spent: 140000,
  },
  {
    department: "Regulatory Affairs",
    allocation: 1300000,
    committed: 760000,
    spent: 390000,
  },
];

const tabs: Tab[] = [
  "Overview",
  "Budget Planning",
  "Procurement Register",
  "Suppliers",
  "Contracts",
  "Invoices",
];

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Awarded: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Open: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    Planning: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    Pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    "Pending Review": "border-amber-500/20 bg-amber-500/10 text-amber-400",
    "Under Review": "border-violet-500/20 bg-violet-500/10 text-violet-400",
    "Under Evaluation": "border-violet-500/20 bg-violet-500/10 text-violet-400",
    Overdue: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    Closed: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    Completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[status] ?? styles.Planning}`}
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
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Wallet;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10141c] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
        </div>
        <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.07] p-3 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
        {trend === "up" && <ArrowUpRight size={13} className="text-emerald-400" />}
        {trend === "down" && <ArrowDownRight size={13} className="text-amber-400" />}
        {detail}
      </div>
    </div>
  );
}

export default function ProcurementFinancialPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [procurements, setProcurements] = useState(initialProcurements);
  const [contracts, setContracts] = useState(initialContracts);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [procurementTitle, setProcurementTitle] = useState("");
  const [procurementCategory, setProcurementCategory] = useState(
    "Professional Services",
  );
  const [procurementDepartment, setProcurementDepartment] = useState(
    "Programme Governance",
  );
  const [procurementValue, setProcurementValue] = useState("");
  const [procurementDeadline, setProcurementDeadline] = useState("");

  const [invoiceSupplier, setInvoiceSupplier] = useState(
    "Global Advisory Partners",
  );
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");

  const totalBudget = initialBudget.reduce(
    (sum, item) => sum + item.allocation,
    0,
  );

  const totalCommitted = initialBudget.reduce(
    (sum, item) => sum + item.committed,
    0,
  );

  const totalSpent = initialBudget.reduce(
    (sum, item) => sum + item.spent,
    0,
  );

  const outstandingInvoices = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const filteredProcurements = useMemo(() => {
    const query = search.toLowerCase();

    return procurements.filter((item) => {
      const matchesSearch =
        item.reference.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [procurements, search, statusFilter]);

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.reference.toLowerCase().includes(query) ||
        invoice.supplier.toLowerCase().includes(query) ||
        invoice.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  function addProcurement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = Number(procurementValue);

    if (!Number.isFinite(value) || value <= 0) {
      setNotice("Please enter a valid estimated value.");
      return;
    }

    const item: Procurement = {
      id: String(Date.now()),
      reference: `PR-2026-${String(procurements.length + 1).padStart(3, "0")}`,
      title: procurementTitle.trim(),
      category: procurementCategory,
      department: procurementDepartment,
      estimatedValue: value,
      currency: "USD",
      deadline: procurementDeadline,
      status: "Planning",
    };

    setProcurements((current) => [item, ...current]);
    setProcurementTitle("");
    setProcurementValue("");
    setProcurementDeadline("");
    setShowProcurementModal(false);
    setActiveTab("Procurement Register");
    setNotice("Procurement record added to this session.");
  }

  function addInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = Number(invoiceAmount);

    if (!Number.isFinite(value) || value <= 0) {
      setNotice("Please enter a valid invoice amount.");
      return;
    }

    const invoice: Invoice = {
      id: String(Date.now()),
      reference: `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
      supplier: invoiceSupplier,
      description: invoiceDescription.trim(),
      amount: value,
      currency: "USD",
      dueDate: invoiceDueDate,
      status: "Pending",
    };

    setInvoices((current) => [invoice, ...current]);
    setInvoiceDescription("");
    setInvoiceAmount("");
    setInvoiceDueDate("");
    setShowInvoiceModal(false);
    setActiveTab("Invoices");
    setNotice("Invoice record added to this session.");
  }

  function updateProcurementStatus(
    id: string,
    status: Procurement["status"],
  ) {
    setProcurements((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  function updateContractStatus(id: string, status: Contract["status"]) {
    setContracts((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  function updateInvoiceStatus(id: string, status: Invoice["status"]) {
    setInvoices((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  function exportProcurements() {
    const headers = [
      "Reference",
      "Title",
      "Category",
      "Department",
      "Estimated Value",
      "Currency",
      "Deadline",
      "Status",
    ];

    const rows = filteredProcurements.map((item) => [
      item.reference,
      item.title,
      item.category,
      item.department,
      item.estimatedValue,
      item.currency,
      item.deadline,
      item.status,
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
    anchor.download = "apexiveai-procurement-register.csv";
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
              <Landmark size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-white">
                APEXIVE<span className="text-cyan-300">AI</span>
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Energy OS / Finance & Procurement
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
                  Module 10 / 12
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Public Finance & Institutional Procurement
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Procurement & Financial
                <span className="block text-cyan-300">
                  Management System
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                Centralised financial planning, budget utilisation,
                procurement governance, supplier management, contract
                administration and invoice tracking for a national civilian
                energy programme.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportProcurements}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07]"
              >
                <Download size={15} />
                Export Register
              </button>
              <button
                onClick={() => setShowProcurementModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-semibold text-[#071018] transition hover:bg-cyan-300"
              >
                <Plus size={15} />
                New Procurement
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Programme Budget"
            value={money(totalBudget)}
            detail="Illustrative approved allocation"
            icon={Landmark}
          />
          <MetricCard
            label="Committed Budget"
            value={money(totalCommitted)}
            detail={`${Math.round((totalCommitted / totalBudget) * 100)}% of total allocation`}
            icon={HandCoins}
            trend="up"
          />
          <MetricCard
            label="Recorded Expenditure"
            value={money(totalSpent)}
            detail={`${Math.round((totalSpent / totalBudget) * 100)}% of total allocation`}
            icon={TrendingUp}
          />
          <MetricCard
            label="Outstanding Invoices"
            value={money(outstandingInvoices)}
            detail="Pending and overdue invoice records"
            icon={Wallet}
          />
        </section>

        <section className="mb-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.045] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-amber-400/10 p-2 text-amber-300">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-200">
                Financial Integrity & Procurement Governance
              </p>
              <p className="mt-1 text-xs leading-6 text-zinc-400">
                All displayed financial figures are illustrative demo data.
                Real procurement requires transparent competition, documented
                evaluation, conflict-of-interest controls, independent
                approvals, segregation of duties and applicable public
                financial management requirements. This application does not
                execute payments or award contracts.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10141c]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Financial Operations Workspace
              </h2>
              <p className="mt-1 text-[11px] text-zinc-500">
                Budget, procurement, suppliers, contracts and accounts payable
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
                onClick={() => {
                  setActiveTab(tab);
                  setSearch("");
                  setStatusFilter("All");
                }}
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
                      <Wallet size={17} />
                      <h3 className="text-sm font-semibold text-white">
                        Budget Utilisation
                      </h3>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-3xl font-semibold text-white">
                          {Math.round((totalSpent / totalBudget) * 100)}%
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          Recorded expenditure
                        </p>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {money(totalSpent)} / {money(totalBudget)}
                      </p>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{
                          width: `${(totalSpent / totalBudget) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      {initialBudget.map((item) => (
                        <div key={item.department}>
                          <div className="mb-1.5 flex justify-between gap-3 text-[11px]">
                            <span className="text-zinc-400">
                              {item.department}
                            </span>
                            <span className="text-zinc-300">
                              {money(item.spent)}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-cyan-400/80"
                              style={{
                                width: `${(item.spent / item.allocation) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <ClipboardList size={17} />
                      <h3 className="text-sm font-semibold text-white">
                        Procurement Pipeline
                      </h3>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        {
                          label: "Planning",
                          value: procurements.filter(
                            (item) => item.status === "Planning",
                          ).length,
                          color: "bg-zinc-400",
                        },
                        {
                          label: "Open",
                          value: procurements.filter(
                            (item) => item.status === "Open",
                          ).length,
                          color: "bg-sky-400",
                        },
                        {
                          label: "Under Evaluation",
                          value: procurements.filter(
                            (item) => item.status === "Under Evaluation",
                          ).length,
                          color: "bg-violet-400",
                        },
                        {
                          label: "Awarded",
                          value: procurements.filter(
                            (item) => item.status === "Awarded",
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
                      onClick={() => setActiveTab("Procurement Register")}
                      className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      Open procurement register <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Financial Control Priorities
                    </h3>
                    <span className="text-[10px] text-zinc-600">
                      Enterprise governance
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      ["01", "Budget Accountability", "Departmental allocation, commitments and expenditure reporting"],
                      ["02", "Transparent Procurement", "Competitive processes, evaluation records and award governance"],
                      ["03", "Supplier Due Diligence", "Vendor registration, verification and conflict-of-interest declarations"],
                      ["04", "Contract Administration", "Contract milestones, obligations, amendments and expiry monitoring"],
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

            {activeTab === "Budget Planning" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Departmental Budget Allocation
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Illustrative national programme budget in USD
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[750px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Allocation</th>
                        <th className="px-4 py-3 font-medium">Committed</th>
                        <th className="px-4 py-3 font-medium">Expenditure</th>
                        <th className="px-4 py-3 font-medium">Available</th>
                        <th className="px-4 py-3 font-medium">Utilisation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {initialBudget.map((item) => {
                        const available =
                          item.allocation - item.committed;
                        const utilisation =
                          (item.spent / item.allocation) * 100;

                        return (
                          <tr
                            key={item.department}
                            className="text-xs text-zinc-300"
                          >
                            <td className="px-4 py-4 font-medium text-zinc-200">
                              {item.department}
                            </td>
                            <td className="px-4 py-4">
                              {money(item.allocation)}
                            </td>
                            <td className="px-4 py-4">
                              {money(item.committed)}
                            </td>
                            <td className="px-4 py-4">
                              {money(item.spent)}
                            </td>
                            <td className="px-4 py-4 text-emerald-400">
                              {money(available)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.07]">
                                  <div
                                    className="h-full rounded-full bg-cyan-400"
                                    style={{
                                      width: `${utilisation}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[10px]">
                                  {Math.round(utilisation)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-4">
                    <p className="text-[11px] text-zinc-500">
                      Total Allocation
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {money(totalBudget)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-4">
                    <p className="text-[11px] text-zinc-500">
                      Total Committed
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {money(totalCommitted)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-4">
                    <p className="text-[11px] text-zinc-500">
                      Uncommitted Balance
                    </p>
                    <p className="mt-2 text-xl font-semibold text-emerald-400">
                      {money(totalBudget - totalCommitted)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Procurement Register" && (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Procurement Register
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Procurement planning and administrative status tracking
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProcurementModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-[#071018]"
                  >
                    <Plus size={14} /> New Procurement
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
                      placeholder="Search procurement, department or reference..."
                      className="w-full rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
                    />
                  </div>
                  <div className="relative">
                    <Filter
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={14}
                    />
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="appearance-none rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-9 text-xs text-zinc-300 outline-none"
                    >
                      <option>All</option>
                      <option>Planning</option>
                      <option>Open</option>
                      <option>Under Evaluation</option>
                      <option>Awarded</option>
                      <option>Closed</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={13}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">Reference</th>
                        <th className="px-4 py-3 font-medium">Procurement</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Estimated Value</th>
                        <th className="px-4 py-3 font-medium">Deadline</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredProcurements.map((item) => (
                        <tr
                          key={item.id}
                          className="text-xs text-zinc-300 hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-4 font-semibold text-cyan-300">
                            {item.reference}
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-zinc-200">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[10px] text-zinc-500">
                              {item.category}
                            </p>
                          </td>
                          <td className="px-4 py-4">{item.department}</td>
                          <td className="px-4 py-4">
                            {money(item.estimatedValue, item.currency)}
                          </td>
                          <td className="px-4 py-4">{item.deadline}</td>
                          <td className="px-4 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              aria-label={`Update ${item.reference} status`}
                              value={item.status}
                              onChange={(event) =>
                                updateProcurementStatus(
                                  item.id,
                                  event.target.value as Procurement["status"],
                                )
                              }
                              className="rounded-md border border-white/10 bg-[#0b0f16] px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                            >
                              <option>Planning</option>
                              <option>Open</option>
                              <option>Under Evaluation</option>
                              <option>Awarded</option>
                              <option>Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredProcurements.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-10 text-center text-xs text-zinc-500"
                          >
                            No matching procurement records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Suppliers" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Supplier & Vendor Directory
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Illustrative supplier registration and due diligence records
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier.name}
                      className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                          <Building2 size={19} />
                        </div>
                        <StatusBadge status={supplier.status} />
                      </div>
                      <h4 className="mt-4 text-sm font-semibold text-white">
                        {supplier.name}
                      </h4>
                      <p className="mt-1 text-xs text-zinc-500">
                        {supplier.category}
                      </p>
                      <div className="mt-5 flex justify-between border-t border-white/[0.06] pt-4 text-[11px]">
                        <span className="text-zinc-500">
                          {supplier.country}
                        </span>
                        <span className="text-zinc-300">
                          {supplier.contracts} contract(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.035] p-4">
                  <p className="text-xs font-semibold text-amber-200">
                    Supplier Due Diligence
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    A production supplier registry should include beneficial
                    ownership checks, sanctions screening where legally
                    applicable, tax and registration verification, conflicts
                    of interest, financial standing and documented evaluation.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Contracts" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">
                    Contract Administration Register
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Contract values, supplier obligations and validity periods
                  </p>
                </div>

                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="rounded-xl border border-white/[0.07] bg-[#0b0f16] p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-cyan-400/[0.08] p-3 text-cyan-300">
                            <FileCheck2 size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {contract.title}
                            </p>
                            <p className="mt-1 text-[11px] text-zinc-500">
                              {contract.reference} · {contract.supplier}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-cyan-300">
                              {money(contract.value, contract.currency)}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={contract.status} />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                        <div className="flex flex-wrap gap-4 text-[11px] text-zinc-500">
                          <span>Start: {contract.startDate}</span>
                          <span>End: {contract.endDate}</span>
                        </div>
                        <select
                          aria-label={`Update ${contract.reference} status`}
                          value={contract.status}
                          onChange={(event) =>
                            updateContractStatus(
                              contract.id,
                              event.target.value as Contract["status"],
                            )
                          }
                          className="rounded-md border border-white/10 bg-[#10141c] px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                        >
                          <option>Active</option>
                          <option>Pending Review</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Invoices" && (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Invoice & Accounts Payable Register
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Administrative invoice tracking — no actual payment execution
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-[#071018]"
                  >
                    <Plus size={14} /> Add Invoice
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
                      placeholder="Search invoice, supplier or description..."
                      className="w-full rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
                    />
                  </div>
                  <div className="relative">
                    <Filter
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={14}
                    />
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="appearance-none rounded-lg border border-white/10 bg-[#0b0f16] py-2.5 pl-9 pr-9 text-xs text-zinc-300 outline-none"
                    >
                      <option>All</option>
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Overdue</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={13}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[800px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[10px] uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">Invoice</th>
                        <th className="px-4 py-3 font-medium">Supplier</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Due Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="text-xs text-zinc-300 hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-4 font-semibold text-cyan-300">
                            {invoice.reference}
                          </td>
                          <td className="px-4 py-4">{invoice.supplier}</td>
                          <td className="px-4 py-4">{invoice.description}</td>
                          <td className="px-4 py-4">
                            {money(invoice.amount, invoice.currency)}
                          </td>
                          <td className="px-4 py-4">{invoice.dueDate}</td>
                          <td className="px-4 py-4">
                            <StatusBadge status={invoice.status} />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              aria-label={`Update ${invoice.reference} status`}
                              value={invoice.status}
                              onChange={(event) =>
                                updateInvoiceStatus(
                                  invoice.id,
                                  event.target.value as Invoice["status"],
                                )
                              }
                              className="rounded-md border border-white/10 bg-[#0b0f16] px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                            >
                              <option>Pending</option>
                              <option>Paid</option>
                              <option>Overdue</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredInvoices.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-10 text-center text-xs text-zinc-500"
                          >
                            No matching invoices found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-[#10141c] p-5">
            <div className="flex items-center gap-2 text-cyan-300">
              <Coins size={17} />
              <h3 className="text-xs font-semibold text-white">
                Financial Management Scope
              </h3>
            </div>
            <p className="mt-3 text-xs leading-6 text-zinc-500">
              Budget allocation, commitment control, expenditure reporting,
              supplier administration, contract registers, invoice tracking
              and financial audit preparation.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#10141c] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <ShieldCheck size={17} />
              <h3 className="text-xs font-semibold text-white">
                Independent Financial Controls
              </h3>
            </div>
            <p className="mt-3 text-xs leading-6 text-zinc-500">
              Production implementation must enforce role separation,
              approval limits, immutable audit logs, financial reconciliation
              and independently authorised payment processes.
            </p>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] py-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-400">
              APEXIVEAI ENERGY OS
            </p>
            <p className="mt-1 text-[10px] text-zinc-600">
              Procurement & Financial Management · Demonstration Workspace
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/energy-os/workforce-training"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={13} /> Previous Module
            </Link>
            <Link
              href="/energy-os/research-knowledge"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-[11px] text-cyan-300 hover:bg-cyan-400/10"
            >
              Next Module <ArrowRight size={13} />
            </Link>
          </div>
        </footer>
      </div>

      {showProcurementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#111722] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Create Procurement Record
                </h2>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Planning-stage administrative record
                </p>
              </div>
              <button
                onClick={() => setShowProcurementModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={addProcurement} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Procurement Title
                </label>
                <input
                  required
                  value={procurementTitle}
                  onChange={(event) =>
                    setProcurementTitle(event.target.value)
                  }
                  placeholder="Enter procurement title"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Category
                </label>
                <select
                  value={procurementCategory}
                  onChange={(event) =>
                    setProcurementCategory(event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  <option>Professional Services</option>
                  <option>Environmental Services</option>
                  <option>Information Technology</option>
                  <option>Training & Education</option>
                  <option>Administrative Services</option>
                  <option>Other Services</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Department
                </label>
                <select
                  value={procurementDepartment}
                  onChange={(event) =>
                    setProcurementDepartment(event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  {[
                    "Programme Governance",
                    "Environmental Governance",
                    "Human Capital",
                    "Digital Administration",
                    "Regulatory Affairs",
                  ].map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-zinc-400">
                    Estimated Value (USD)
                  </label>
                  <input
                    required
                    min="1"
                    type="number"
                    value={procurementValue}
                    onChange={(event) =>
                      setProcurementValue(event.target.value)
                    }
                    placeholder="100000"
                    className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-zinc-400">
                    Deadline
                  </label>
                  <input
                    required
                    type="date"
                    value={procurementDeadline}
                    onChange={(event) =>
                      setProcurementDeadline(event.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={() => setShowProcurementModal(false)}
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

      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#111722] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Add Invoice Record
                </h2>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Accounts payable documentation
                </p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={addInvoice} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Supplier
                </label>
                <select
                  value={invoiceSupplier}
                  onChange={(event) => setInvoiceSupplier(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier.name}>{supplier.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] text-zinc-400">
                  Invoice Description
                </label>
                <input
                  required
                  value={invoiceDescription}
                  onChange={(event) =>
                    setInvoiceDescription(event.target.value)
                  }
                  placeholder="Enter invoice description"
                  className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none placeholder:text-zinc-700"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-zinc-400">
                    Amount (USD)
                  </label>
                  <input
                    required
                    min="1"
                    type="number"
                    value={invoiceAmount}
                    onChange={(event) => setInvoiceAmount(event.target.value)}
                    placeholder="25000"
                    className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-zinc-400">
                    Due Date
                  </label>
                  <input
                    required
                    type="date"
                    value={invoiceDueDate}
                    onChange={(event) => setInvoiceDueDate(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#090d14] px-3 py-3 text-xs text-zinc-300 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#071018] hover:bg-cyan-300"
                >
                  Add Invoice
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
