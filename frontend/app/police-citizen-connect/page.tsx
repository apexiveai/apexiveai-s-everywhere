import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Fingerprint,
  Globe2,
  Languages,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Police Citizen Connect | ApexiveAI",
  description:
    "A concept for accessible citizen services and accountable public-service administration, designed with privacy and human-rights safeguards.",
};

const services = [
  {
    icon: MessageSquareText,
    title: "Service requests",
    description:
      "Accessible forms for non-emergency complaints and public-service requests, with a private reference for follow-up.",
  },
  {
    icon: Bell,
    title: "Emergency information",
    description:
      "A clear directory of verified emergency contacts and guidance. Live dispatch requires approved agency integration.",
  },
  {
    icon: MapPin,
    title: "Public directories",
    description:
      "Searchable, reviewed listings for public offices, service hours and contact channels.",
  },
  {
    icon: FileCheck2,
    title: "Application tracking",
    description:
      "Show only the user's own permitted service updates, document requests and appointment details.",
  },
];

const controls = [
  ["Private by design", "Collect only the minimum information a specific service needs."],
  ["Human review", "People make consequential decisions; software supports administration."],
  ["Auditable access", "Sensitive record access requires a role, purpose and traceable log."],
  ["No citizen scoring", "No predictive risk scores, political profiling or facial recognition."],
];

const deliverables = [
  ["01", "Software Requirements", "Scope, actors, workflows and measurable acceptance criteria."],
  ["02", "Database & ERD", "Data domains, relationships, classification and retention boundaries."],
  ["03", "Backend API", "Versioned endpoints, authorization, payloads and error conventions."],
  ["04", "Roles & Permissions", "Least-privilege access matrix for staff and public users."],
  ["05", "Police Admin UX", "Dashboard structure, review queues and audit-oriented workflows."],
  ["06", "Citizen App UX", "Mobile-first service journeys, privacy controls and offline drafts."],
  ["07", "Security & Governance", "Threat controls, data rights, oversight and human-rights safeguards."],
  ["08", "Infrastructure", "Environment separation, deployment, monitoring and recovery plan."],
  ["09", "Tests & Acceptance", "Functional, security, accessibility and operational test cases."],
  ["10", "Proposal & Estimate", "Phased delivery plan and a clearly qualified planning estimate."],
];

const adminNavigation = [
  "Overview",
  "Service requests",
  "Appointments",
  "Public information",
  "Directory",
  "Audit & access",
];

export default function PoliceCitizenConnectPage() {
  return (
    <main id="top" className="min-h-screen bg-[#f5f7fb] text-[#17243b]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="ApexiveAI home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf2ff] text-[#1674e8]">
              <ShieldCheck size={22} />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[.12em]">APEXIVE AI</span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[.16em] text-slate-500">
                GOVERNMENT &amp; PUBLIC SECTOR
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-medium text-slate-600 md:flex">
            <a className="transition hover:text-blue-700" href="#services">Services</a>
            <a className="transition hover:text-blue-700" href="#experience">Experience</a>
            <a className="transition hover:text-blue-700" href="#safeguards">Safeguards</a>
            <a className="transition hover:text-blue-700" href="#deliverables">Project pack</a>
          </nav>
          <a
            href="#deliverables"
            className="rounded-full bg-[#1769d2] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1057b7]"
          >
            View project pack
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8">
        <div
          role="note"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950"
        >
          <ClipboardList className="mt-0.5 shrink-0" size={17} />
          <p>
            <strong>Concept preview only.</strong> This page is not an official
            government service, is not connected to police systems and does not
            accept real reports or emergency requests.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-12 shadow-[0_24px_70px_rgba(27,52,93,.08)] sm:px-10 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-blue-100/80 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 right-1/4 h-[340px] w-[340px] rounded-full bg-cyan-50 blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-bold tracking-[.17em] text-blue-800">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                CIVIC DIGITAL SERVICES · PRODUCT CONCEPT
              </div>
              <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#12223b] sm:text-5xl lg:text-6xl">
                Police Citizen
                <span className="block text-[#1769d2]">Connect</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                A proposed digital service experience that helps people find
                public information, submit permitted service requests and
                follow up privately—while giving authorized staff accountable
                tools to manage service workflows.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                မြန်မာဘာသာနှင့် English ကို ထောက်ပံ့နိုင်သော၊ ကိုယ်ရေးအချက်အလက်ကို
                အနည်းဆုံးသာ အသုံးပြုသည့် ပြည်သူ့ဝန်ဆောင်မှု platform concept ဖြစ်သည်။
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#experience"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1769d2] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#1057b7]"
                >
                  Explore the concept <ArrowDown size={16} />
                </a>
                <a
                  href="#deliverables"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  See all 10 deliverables <ArrowRight size={16} />
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><Languages size={15} className="text-blue-600" /> Myanmar / English</span>
                <span className="inline-flex items-center gap-2"><Smartphone size={15} className="text-blue-600" /> Web + mobile concept</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-blue-600" /> Privacy-led design</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-100 to-cyan-50 blur-xl" />
              <div className="relative rounded-[1.6rem] border border-slate-200 bg-[#f8faff] p-4 shadow-xl sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-700"><ShieldCheck size={18} /></span>
                    <span>
                      <strong className="block text-xs text-slate-800">Citizen services</strong>
                      <small className="text-[10px] text-slate-500">Concept preview · Sample data</small>
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-bold text-amber-800">NOT LIVE</span>
                </div>
                <div className="mt-4 rounded-2xl bg-[#163865] p-5 text-white">
                  <span className="text-[10px] font-semibold tracking-[.16em] text-blue-200">WELCOME</span>
                  <h2 className="mt-2 text-xl font-semibold">How can we help?</h2>
                  <p className="mt-2 text-xs leading-5 text-blue-100/80">Choose a service to see information and available next steps.</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      ["Report a concern", MessageSquareText],
                      ["Emergency contacts", Bell],
                      ["Track a request", ClipboardList],
                      ["Find a service office", MapPin],
                    ].map(([label, Icon]) => {
                      const ServiceIcon = Icon as typeof Bell;
                      return (
                        <div key={label as string} className="flex min-h-[72px] items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-3 text-[10px] font-medium leading-4 text-white">
                          <ServiceIcon size={16} className="shrink-0 text-cyan-200" />
                          {label as string}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold text-slate-700">Service status</span>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-700"><CheckCircle2 size={12} /> Sample only</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 rounded-full bg-blue-500" /></div>
                  <p className="mt-2 text-[9px] text-slate-400">A real status is shown only to the authenticated request owner.</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
                <span className="flex items-center gap-2 text-[10px] font-semibold text-slate-700"><Fingerprint size={15} className="text-blue-600" /> Private by design</span>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[.2em] text-blue-700">ONE ACCESSIBLE FRONT DOOR</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#15243a] sm:text-4xl">Public services, clearly organized</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Service availability, responsible agencies and emergency contacts
              must be verified before any production launch.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(27,52,93,.04)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={20} /></span>
                  <span className="text-[10px] font-bold tracking-widest text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-800">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 rounded-[2rem] bg-[#102542] p-6 text-white sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-bold tracking-[.2em] text-blue-200">TWO CONNECTED EXPERIENCES</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Designed around people and accountable service teams.</h2>
              <p className="mt-5 text-sm leading-7 text-blue-100/70">
                Public users see only their own permitted service information.
                Staff access is limited by role, office scope and documented
                purpose.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[.06] p-6">
                <Smartphone className="text-cyan-200" size={22} />
                <h3 className="mt-5 text-lg font-semibold">Citizen mobile &amp; web</h3>
                <ul className="mt-4 space-y-3 text-xs leading-5 text-blue-100/75">
                  <li>• Find public information and verified contacts</li>
                  <li>• Submit a non-emergency service request</li>
                  <li>• Follow up with a private reference</li>
                  <li>• Save an encrypted local draft when offline</li>
                </ul>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[.06] p-6">
                <Users className="text-cyan-200" size={22} />
                <h3 className="mt-5 text-lg font-semibold">Police administration</h3>
                <ul className="mt-4 space-y-3 text-xs leading-5 text-blue-100/75">
                  <li>• Review assigned requests and service queues</li>
                  <li>• Request more information with an audit trail</li>
                  <li>• Publish reviewed public announcements</li>
                  <li>• View aggregate operational service metrics</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="safeguards" className="scroll-mt-24 py-20">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-[10px] font-bold tracking-[.2em] text-blue-700">NON-NEGOTIABLE GUARDRAILS</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#15243a] sm:text-4xl">Public trust is part of the architecture.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                Legal authority, independent review and a human-rights impact
                assessment are prerequisites—not later add-ons.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {controls.map(([title, detail]) => (
                <article key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><ShieldCheck size={19} /></span>
                  <div><h3 className="text-sm font-bold text-slate-800">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-[.2em] text-blue-700">POLICE ADMIN CONCEPT</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#15243a]">A focused service operations workspace</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A screen-design preview only. Sample figures and records are illustrative; no live police or citizen data is shown.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold tracking-wider text-slate-500">STATIC CONCEPT</span>
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-[190px_1fr]">
            <nav aria-label="Admin preview navigation" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:block lg:space-y-1">
              {adminNavigation.map((item, index) => (
                <div key={item} className={`rounded-lg px-3 py-2.5 text-xs ${index === 0 ? "bg-blue-50 font-semibold text-blue-800" : "text-slate-500"}`}>{item}</div>
              ))}
            </nav>
            <div className="min-w-0 rounded-2xl bg-[#f7f9fc] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="text-sm font-bold text-slate-800">Service overview</h3><p className="mt-1 text-[10px] text-slate-500">Illustrative pilot dashboard</p></div>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">Last 7 days <ArrowDown size={12} className="ml-1 inline" /></span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Open requests", "—", "Live metrics disabled"],
                  ["Awaiting review", "—", "Permission required"],
                  ["Announcements", "—", "No demo data stored"],
                ].map(([label, value, note]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[10px] text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-700">{value}</p><p className="mt-1 text-[9px] text-slate-400">{note}</p></div>
                ))}
              </div>
              <div className="mt-3 flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 text-center">
                <Globe2 size={20} className="text-blue-500" />
                <p className="mt-2 text-xs font-semibold text-slate-700">Operational reports are intentionally not populated</p>
                <p className="mt-1 max-w-lg text-[10px] leading-5 text-slate-400">Production analytics require lawful purpose, authorized access, aggregation thresholds and an approved retention policy.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="deliverables" className="scroll-mt-24 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[.2em] text-blue-700">PROJECT DEFINITION PACK</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#15243a] sm:text-4xl">Ten deliverables before implementation</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">The complete technical and delivery specifications are maintained as project documents and require government, legal and independent review.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {deliverables.map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="text-[10px] font-bold tracking-widest text-blue-600">{number} / 10</span>
                <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4">
            <p className="max-w-3xl text-xs leading-5 text-blue-950">
              Proposed delivery is phased. Any production use depends on written
              government authorization, validated legal basis, independent
              security review and a separately approved procurement.
            </p>
            <a href="#top" className="inline-flex items-center gap-2 text-xs font-bold text-blue-800 hover:text-blue-950">
              Back to top <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-[10px] leading-5 text-slate-500 sm:flex-row">
          <span>© 2026 ApexiveAI · Product concept</span>
          <span>Not an official government website. No live service or emergency response is provided here.</span>
        </footer>
      </div>
    </main>
  );
}
