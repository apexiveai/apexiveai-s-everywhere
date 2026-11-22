
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileCheck,
  Radio,
  Recycle,
  ShieldCheck,
  Siren,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import NuclearDashboard from "./NuclearDashboard";

const modules = [
  {
    slug: "nuclear-energy-dashboard",
    title: "Nuclear Energy Dashboard",
    category: "National Overview",
    description:
      "A centralized overview of civilian nuclear energy programmes, project governance, regulatory progress and authorized reporting.",
    icon: Activity,
    sections: [
      "National Programme Overview",
      "Project Portfolio",
      "Regulatory Status",
      "Safety Compliance",
      "Monitoring Reports",
      "Recent Activities",
    ],
  },
  {
    slug: "nuclear-project-management",
    title: "Nuclear Project Management",
    category: "Project Governance",
    description:
      "Manage project documentation, schedules, milestones, budgets and approval workflows.",
    icon: ClipboardList,
    sections: [
      "Project Register",
      "Milestone Tracking",
      "Project Documentation",
      "Budget Overview",
      "Approval Workflow",
      "Project Reports",
    ],
  },
  {
    slug: "regulatory-licensing",
    title: "Regulatory & Licensing Management",
    category: "Regulatory Governance",
    description:
      "Organize civilian nuclear programme licensing, regulatory documentation and inspection records.",
    icon: FileCheck,
    sections: [
      "Licensing Register",
      "Applications",
      "Regulatory Reviews",
      "Inspection Records",
      "Compliance Documents",
      "Renewal Calendar",
    ],
  },
  {
    slug: "electricity-generation",
    title: "Electricity Generation Management",
    category: "Energy Reporting",
    description:
      "Manage authorized electricity generation records, energy statistics and grid reporting.",
    icon: Zap,
    sections: [
      "Generation Reports",
      "Energy Statistics",
      "Grid Integration Records",
      "Supply Reporting",
      "Performance History",
      "Monthly Reports",
    ],
  },
  {
    slug: "nuclear-safety",
    title: "Nuclear Safety & Compliance",
    category: "Safety Governance",
    description:
      "Maintain safety governance documentation, independent audit records and corrective action tracking.",
    icon: ShieldCheck,
    sections: [
      "Safety Policy Register",
      "Compliance Assessments",
      "Audit Records",
      "Corrective Actions",
      "Inspection Reports",
      "Safety Documentation",
    ],
  },
  {
    slug: "radiation-environmental",
    title: "Radiation & Environmental Monitoring",
    category: "Environmental Governance",
    description:
      "Record authorized radiation protection measurements and environmental monitoring reports.",
    icon: Radio,
    sections: [
      "Monitoring Locations",
      "Authorized Measurement Records",
      "Environmental Reports",
      "Radiation Protection Records",
      "Review History",
      "Data Quality Reports",
    ],
  },
  {
    slug: "emergency-response",
    title: "Emergency Preparedness & Response",
    category: "Emergency Governance",
    description:
      "Manage emergency plans, exercises, public notification records and authorized response coordination.",
    icon: Siren,
    sections: [
      "Emergency Plans",
      "Preparedness Assessments",
      "Exercise Records",
      "Notification Register",
      "Response Contacts",
      "After-Action Reports",
    ],
  },
  {
    slug: "radioactive-waste",
    title: "Radioactive Waste Governance",
    category: "Waste Governance",
    description:
      "Maintain licensed waste management documentation, compliance records and institutional oversight.",
    icon: Recycle,
    sections: [
      "Waste Records",
      "Licensed Facility Register",
      "Compliance Documentation",
      "Transportation Records",
      "Storage Reports",
      "Audit History",
    ],
  },
  {
    slug: "workforce-training",
    title: "Workforce & Training Management",
    category: "Human Resources",
    description:
      "Manage workforce profiles, professional qualifications, training records and competency documentation.",
    icon: Users,
    sections: [
      "Workforce Directory",
      "Qualifications",
      "Training Programmes",
      "Certification Records",
      "Competency Reviews",
      "Training Calendar",
    ],
  },
  {
    slug: "procurement-financial",
    title: "Procurement & Financial Management",
    category: "Financial Governance",
    description:
      "Organize civilian programme procurement documentation, budgets, contracts and expenditure reporting.",
    icon: Wallet,
    sections: [
      "Procurement Register",
      "Contract Records",
      "Budget Management",
      "Expenditure Reports",
      "Supplier Documentation",
      "Financial Audit",
    ],
  },
  {
    slug: "research-knowledge",
    title: "Nuclear Research & Knowledge Center",
    category: "Research & Education",
    description:
      "Organize approved civilian research publications, educational resources and institutional collaboration.",
    icon: BookOpen,
    sections: [
      "Research Directory",
      "Publications",
      "Education Resources",
      "University Collaboration",
      "Knowledge Library",
      "Research Reports",
    ],
  },
  {
    slug: "public-transparency",
    title: "Public Information & Transparency",
    category: "Public Information",
    description:
      "Publish approved public reports, energy statistics, environmental disclosures and programme announcements.",
    icon: Eye,
    sections: [
      "Public Reports",
      "Energy Statistics",
      "Environmental Disclosures",
      "Public Announcements",
      "Published Documents",
      "Transparency Archive",
    ],
  },
];

export function generateStaticParams() {
  return modules.map((item) => ({
    module: item.slug,
  }));
}

export default async function NuclearModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;

  const selected = modules.find((item) => item.slug === module);

  if (!selected) {
    notFound();
  }

  if (module === "nuclear-energy-dashboard") {
    return <NuclearDashboard />;
  }

  const Icon = selected.icon;

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-10">

        <Link
          href="/energy-os"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Energy OS
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111d2c] via-[#101725] to-[#0b1019] p-7 md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                <Icon size={28} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                ApexiveAI Energy OS
              </span>
            </div>

            <p className="mb-3 text-sm text-slate-400">
              {selected.category}
            </p>

            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {selected.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              {selected.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300">
                Civilian Governance
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                Enterprise Workspace
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                Development Preview
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Workspace",
              value: "Ready for setup",
              icon: Activity,
            },
            {
              label: "Records",
              value: "No records yet",
              icon: ClipboardList,
            },
            {
              label: "Last Updated",
              value: "Not available",
              icon: CalendarDays,
            },
          ].map((item) => {
            const ItemIcon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#101722] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {item.label}
                  </span>
                  <ItemIcon size={19} className="text-cyan-300" />
                </div>

                <p className="mt-4 text-xl font-semibold">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Workspace Areas
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Available management areas for this module.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {selected.sections.length} areas
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {selected.sections.map((section, index) => (
              <div
                key={section}
                className="group rounded-2xl border border-white/10 bg-[#101722] p-5 transition hover:border-cyan-400/30 hover:bg-[#131f2d]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <span className="text-sm font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-500 transition group-hover:text-cyan-300"
                  />
                </div>

                <h3 className="mt-5 font-semibold">
                  {section}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Workspace section ready for authorized records,
                  document management and reporting.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#101722] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <h3 className="font-semibold">
                Governance & Data Integrity
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                This workspace is designed for civilian nuclear
                programme administration, regulatory documentation,
                authorized reporting and institutional oversight.
                Operational reactor controls and safety-critical
                systems remain completely separate.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
