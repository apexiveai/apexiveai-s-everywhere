
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileCheck,
  Globe2,
  Landmark,
  Radio,
  Recycle,
  ShieldCheck,
  Siren,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type EnergyModule = {
  number: string;
  title: string;
  image: string;
  category: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

const modules: EnergyModule[] = [
  {
    number: "01",
    title: "National Energy Planning",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85",
    category: "National Strategy",
    description:
      "National energy policy, long-term planning, feasibility studies and strategic energy development.",
    href: "/energy-os/national-energy-planning",
    icon: Globe2,
    accent: "from-cyan-400/20 to-blue-500/5",
  },
  {
    number: "02",
    title: "National Nuclear Programme",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=900&q=85",
    category: "Programme Governance",
    description:
      "National civilian nuclear programme governance, institutional coordination and programme milestones.",
    href: "/energy-os/national-nuclear-programme",
    icon: Landmark,
    accent: "from-violet-400/20 to-indigo-500/5",
  },
  {
    number: "03",
    title: "Nuclear Energy Dashboard",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=85",
    category: "National Overview",
    description:
      "A consolidated overview of programme progress, project portfolios, regulatory status and governance reporting.",
    href: "/energy-os/nuclear-energy-dashboard",
    icon: Activity,
    accent: "from-cyan-400/20 to-teal-500/5",
  },
  {
    number: "04",
    title: "Nuclear Project Management",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85",
    category: "Project Governance",
    description:
      "Project registers, documentation, schedules, milestones, budgets and approval workflows.",
    href: "/energy-os/nuclear-project-management",
    icon: ClipboardList,
    accent: "from-blue-400/20 to-indigo-500/5",
  },
  {
    number: "05",
    title: "Regulatory & Licensing",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=85",
    category: "Regulatory Governance",
    description:
      "Licensing documentation, regulatory reviews, inspection records and compliance management.",
    href: "/energy-os/regulatory-licensing",
    icon: FileCheck,
    accent: "from-emerald-400/20 to-teal-500/5",
  },
  {
    number: "06",
    title: "Electricity Generation",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85",
    category: "Energy Reporting",
    description:
      "Electricity generation records, energy statistics, grid integration documentation and reporting.",
    href: "/energy-os/electricity-generation",
    icon: Zap,
    accent: "from-amber-400/20 to-orange-500/5",
  },
  {
    number: "07",
    title: "Nuclear Safety & Compliance",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=85",
    category: "Safety Governance",
    description:
      "Safety governance policies, compliance assessments, independent audits and corrective actions.",
    href: "/energy-os/nuclear-safety",
    icon: ShieldCheck,
    accent: "from-emerald-400/20 to-green-500/5",
  },
  {
    number: "08",
    title: "Radiation & Environmental",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=85",
    category: "Environmental Governance",
    description:
      "Authorized monitoring records, environmental assessments and radiation protection documentation.",
    href: "/energy-os/radiation-environmental",
    icon: Radio,
    accent: "from-teal-400/20 to-cyan-500/5",
  },
  {
    number: "09",
    title: "Emergency Preparedness",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    category: "Emergency Governance",
    description:
      "Emergency plans, preparedness assessments, exercise records and response coordination.",
    href: "/energy-os/emergency-response",
    icon: Siren,
    accent: "from-rose-400/20 to-orange-500/5",
  },
  {
    number: "10",
    title: "Radioactive Waste Governance",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=85",
    category: "Waste Governance",
    description:
      "Licensed waste management documentation, institutional oversight and compliance records.",
    href: "/energy-os/radioactive-waste",
    icon: Recycle,
    accent: "from-lime-400/20 to-emerald-500/5",
  },
  {
    number: "11",
    title: "Workforce & Training",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85",
    category: "Human Resources",
    description:
      "Workforce profiles, qualifications, training programmes and competency documentation.",
    href: "/energy-os/workforce-training",
    icon: Users,
    accent: "from-sky-400/20 to-blue-500/5",
  },
  {
    number: "12",
    title: "Procurement & Financial",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    category: "Financial Governance",
    description:
      "Procurement registers, supplier records, contracts, budgets and financial reporting.",
    href: "/energy-os/procurement-financial",
    icon: Wallet,
    accent: "from-amber-400/20 to-yellow-500/5",
  },
  {
    number: "13",
    title: "Research & Knowledge Center",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85",
    category: "Research & Education",
    description:
      "Approved civilian research publications, education resources and institutional collaboration.",
    href: "/energy-os/research-knowledge",
    icon: BookOpen,
    accent: "from-violet-400/20 to-purple-500/5",
  },
  {
    number: "14",
    title: "Public Information & Transparency",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=85",
    category: "Public Information",
    description:
      "Public reports, approved announcements, environmental disclosures and transparency archives.",
    href: "/energy-os/public-transparency",
    icon: Eye,
    accent: "from-cyan-400/20 to-sky-500/5",
  },
];

const categories = [
  "National Strategy",
  "Programme Governance",
  "National Overview",
  "Project Governance",
  "Regulatory Governance",
  "Energy Reporting",
  "Safety Governance",
  "Environmental Governance",
  "Emergency Governance",
  "Waste Governance",
  "Human Resources",
  "Financial Governance",
  "Research & Education",
  "Public Information",
];

export default function EnergyOSHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070b12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.07] blur-[130px]" />
        <div className="absolute -right-40 top-[450px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-7 md:px-10 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Zap size={23} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-white">
                APEXIVEAI
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Enterprise Solutions
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300 sm:inline-flex">
              <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Development Preview
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
            >
              <ArrowRight size={14} className="rotate-180" />
              Main Platform
            </Link>
          </div>
        </header>

        <section className="relative mt-9 overflow-hidden rounded-[28px] border border-cyan-400/15 bg-gradient-to-br from-[#12263a] via-[#101a2a] to-[#0c111b] px-6 py-10 md:px-10 md:py-14">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-[55%] bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.13),transparent_65%)]" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-cyan-300/[0.08]" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-56 w-56 rounded-full border border-cyan-300/[0.08]" />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <Activity size={13} />
              National Energy Administration Platform
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Energy <span className="text-cyan-300">OS</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              A unified enterprise workspace for national energy planning,
              civilian nuclear programme governance, regulatory oversight,
              electricity reporting and institutional transparency.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/energy-os/nuclear-energy-dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#06121a] transition hover:bg-cyan-300"
              >
                Open National Dashboard
                <ArrowUpRight size={17} />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Explore Modules
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Management Modules",
              value: "14",
              detail: "Dedicated workspaces",
              icon: ClipboardList,
            },
            {
              label: "Platform Architecture",
              value: "Unified",
              detail: "Centralized navigation",
              icon: Globe2,
            },
            {
              label: "Governance Model",
              value: "Enterprise",
              detail: "Institutional oversight",
              icon: ShieldCheck,
            },
            {
              label: "Platform Status",
              value: "Preview",
              detail: "Development environment",
              icon: CheckCircle2,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-[#101722]/90 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{stat.label}</span>
                  <Icon size={18} className="text-cyan-300" />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
              </div>
            );
          })}
        </section>

        <section id="modules" className="mt-12 scroll-mt-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">
                Workspace Directory
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                Energy Management Modules
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Select a module to enter its dedicated management workspace.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-400">
              {modules.length} Modules Available
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101722] transition duration-500 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_20px_55px_rgba(0,0,0,0.45)]"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${item.image}")`,
                    }}
                  />

                  {/* Dark Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d14] via-[#080d14]/85 to-[#080d14]/20 transition duration-500 group-hover:from-[#080d14] group-hover:via-[#080d14]/75" />

                  {/* Accent Glow */}
                  <div
                    className={`pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${item.accent} opacity-60 blur-3xl transition group-hover:opacity-100`}
                  />

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-black/30 text-cyan-300 backdrop-blur-md transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/10">
                        <Icon size={23} />
                      </div>

                      <span className="rounded-lg border border-white/15 bg-black/30 px-3 py-1 font-mono text-xs tracking-widest text-white/70 backdrop-blur-md">
                        {item.number}
                      </span>
                    </div>

                    <div className="mt-auto pt-12">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                        {item.category}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold leading-snug text-white transition group-hover:text-cyan-200">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-md text-xs leading-6 text-slate-300/90">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                      <span className="text-xs font-semibold text-white/70 transition group-hover:text-cyan-300">
                        Open Workspace
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/30 text-white/80 backdrop-blur-md transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/15 group-hover:text-cyan-300">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/[0.08] bg-[#101722]/80 p-6 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Governance, Accountability & Data Integrity
              </h3>
              <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-400">
                Energy OS is structured for civilian energy administration,
                programme governance, regulatory documentation, institutional
                reporting and public accountability. Safety-critical
                operational control systems remain separate from this
                administrative platform.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-6 text-[10px] tracking-wide text-slate-500">
          <span>© 2026 APEXIVEAI · ENERGY OS</span>
          <span>National Energy Governance Workspace · Development Preview</span>
        </footer>
      </div>
    </main>
  );
}
