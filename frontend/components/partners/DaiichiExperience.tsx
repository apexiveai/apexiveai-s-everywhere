
"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

const solutions = [
  {
    number: "01",
    title: "Life Protection",
    subtitle: "Protect the people who matter most.",
    description:
      "Explore how life insurance may help provide financial protection for your loved ones and support long-term family planning.",
    icon: "◈",
  },
  {
    number: "02",
    title: "Health Protection",
    subtitle: "Prepare for life's uncertainties.",
    description:
      "Learn about health-related insurance protection and the importance of understanding policy coverage and exclusions.",
    icon: "✳",
  },
  {
    number: "03",
    title: "Financial Planning",
    subtitle: "Build confidence for tomorrow.",
    description:
      "Discover how insurance can form part of a broader financial planning strategy based on your individual needs.",
    icon: "◇",
  },
];

const faqs = [
  {
    q: "What is life insurance?",
    a: "Life insurance is a contract between an insurer and a policyholder. Subject to the policy terms, the insurer provides specified benefits when covered events occur in exchange for premiums.",
  },
  {
    q: "How do I choose an insurance plan?",
    a: "Consider your financial responsibilities, protection needs, budget, policy duration, exclusions and the benefits offered. Ask a qualified insurance representative to explain the official policy documents before making a decision.",
  },
  {
    q: "How are insurance claims submitted?",
    a: "The claim process depends on the policy and type of claim. Generally, the policyholder or beneficiary contacts the insurer, obtains the required forms, submits supporting documents and follows the insurer's assessment process.",
  },
  {
    q: "Does every policy cover medical expenses?",
    a: "No. Coverage varies by product. Medical benefits, exclusions, waiting periods and claim limits must be confirmed in the specific policy contract.",
  },
  {
    q: "Can I request a consultation?",
    a: "Yes. You can submit an enquiry through this page. Your enquiry will need to be routed through an approved contact channel before a consultation can be arranged.",
  },
];

const steps = [
  ["01", "Understand", "Identify your family's protection priorities."],
  ["02", "Explore", "Review available insurance information and policy terms."],
  ["03", "Consult", "Ask questions and seek qualified advice."],
  ["04", "Decide", "Review official documents before making a decision."],
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-9 bg-[#D8B779]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B99A64]">
        {children}
      </span>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function DaiichiExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "Life Protection",
    message: "",
    consent: false,
  });

  const endpoint =
    process.env.NEXT_PUBLIC_DAIICHI_INQUIRY_ENDPOINT;

  async function submitInquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");

    if (!form.consent) {
      setStatus("Please agree to the privacy notice before submitting.");
      return;
    }

    if (!endpoint) {
      setStatus(
        "The consultation channel has not been configured yet. Please contact the website administrator."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          interest: form.interest,
          message: form.message,
          source: "apexiveai-daiichi-landing-page",
          consent: form.consent,
        }),
      });

      if (!response.ok) {
        throw new Error("Inquiry submission failed.");
      }

      setStatus(
        "Your enquiry has been submitted successfully. Thank you."
      );
      setForm({
        name: "",
        phone: "",
        email: "",
        interest: "Life Protection",
        message: "",
        consent: false,
      });
    } catch {
      setStatus(
        "We could not submit your enquiry. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F7F3] text-[#17233B] selection:bg-[#D8B779] selection:text-[#101B30]">

      {/* NAVIGATION */}
      <header className="absolute left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#101B30]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8B779]/60 text-xl text-[#D8B779]">
              ◈
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.16em] text-white">
                DAIICHI LIFE
              </div>
              <div className="mt-1 text-[8px] tracking-[0.22em] text-[#C8B17D]">
                INSURANCE EXPERIENCE
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-xs text-white/75 lg:flex">
            <a href="#about" className="transition hover:text-[#D8B779]">About</a>
            <a href="#solutions" className="transition hover:text-[#D8B779]">Solutions</a>
            <a href="#journey" className="transition hover:text-[#D8B779]">How It Works</a>
            <a href="#claims" className="transition hover:text-[#D8B779]">Claims Guide</a>
            <a href="#faq" className="transition hover:text-[#D8B779]">FAQ</a>
          </nav>

          <a
            href="#consultation"
            className="hidden rounded-full border border-[#D8B779] px-5 py-3 text-[10px] font-semibold tracking-wider text-[#E9D3A7] transition hover:bg-[#D8B779] hover:text-[#101B30] lg:block"
          >
            REQUEST A CONSULTATION ↗
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="text-2xl text-white lg:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-5 border-t border-white/10 bg-[#101B30] px-7 py-7 text-sm text-white lg:hidden">
            {[
              ["About", "#about"],
              ["Solutions", "#solutions"],
              ["How It Works", "#journey"],
              ["Claims Guide", "#claims"],
              ["FAQ", "#faq"],
              ["Consultation", "#consultation"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label} ↗
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-[740px] items-center bg-[#101B30] pt-28 lg:min-h-[850px]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #101B30 0%, rgba(16,27,48,.93) 38%, rgba(16,27,48,.25) 100%), url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B30] via-transparent to-[#101B30]/30" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D8B779]" />
              <span className="text-[10px] font-semibold tracking-[0.3em] text-[#D8B779]">
                LIFE PROTECTION · FINANCIAL CONFIDENCE
              </span>
            </div>

            <h1 className="text-5xl font-light leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
              A Future
              <br />
              Worth <span className="font-semibold text-[#D8B779]">Protecting.</span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-8 text-white/70 sm:text-base">
              Every life has a story. Every family has dreams.
              Discover the importance of preparing for tomorrow
              with thoughtful life protection and financial planning.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#solutions"
                className="rounded-full bg-[#D8B779] px-8 py-4 text-xs font-semibold tracking-wider text-[#101B30] transition hover:bg-white"
              >
                EXPLORE PROTECTION <Arrow />
              </a>
              <a
                href="#about"
                className="rounded-full border border-white/35 px-8 py-4 text-xs font-semibold tracking-wider text-white transition hover:border-[#D8B779] hover:text-[#D8B779]"
              >
                DISCOVER MORE
              </a>
            </div>

            <div className="mt-16 grid max-w-lg grid-cols-2 gap-6 border-t border-white/15 pt-7">
              <div>
                <div className="text-2xl font-light text-[#D8B779]">1902</div>
                <p className="mt-2 text-[10px] tracking-widest text-white/55">
                  GROUP HERITAGE
                </p>
              </div>
              <div>
                <div className="text-2xl font-light text-[#D8B779]">MYANMAR</div>
                <p className="mt-2 text-[10px] tracking-widest text-white/55">
                  LOCAL MARKET
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative ml-auto max-w-[440px]">
              <div className="absolute -inset-5 rounded-[220px_220px_20px_20px] border border-[#D8B779]/40" />
              <div
                className="h-[530px] rounded-[220px_220px_20px_20px] bg-cover bg-center shadow-2xl"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1000&q=85')",
                }}
              />
              <div className="absolute -bottom-5 -left-12 max-w-[260px] border border-[#D8B779]/40 bg-[#172641] p-6 shadow-xl">
                <div className="text-xs tracking-widest text-[#D8B779]">
                  YOUR TOMORROW
                </div>
                <p className="mt-3 text-lg font-light leading-7 text-white">
                  Protection begins with understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 right-10 hidden text-[9px] tracking-[0.35em] text-white/40 md:block">
          SCROLL TO DISCOVER ↓
        </div>
      </section>

      {/* INTRO */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel>THE IMPORTANCE OF PROTECTION</SectionLabel>
            <h2 className="max-w-xl text-4xl font-light leading-tight sm:text-5xl">
              Confidence comes from
              <span className="font-semibold"> preparation.</span>
            </h2>
            <p className="mt-7 text-sm leading-8 text-slate-600">
              Financial protection is about more than today. It is about
              understanding potential risks, preparing for life's
              uncertainties and making informed decisions for the people
              and goals that matter to you.
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              This experience introduces Daiichi Life-related information
              and general insurance concepts to help you begin exploring
              your protection needs.
            </p>
            <a href="#solutions" className="mt-9 inline-flex items-center gap-3 text-xs font-bold tracking-widest text-[#9A7943]">
              EXPLORE INSURANCE SOLUTIONS <Arrow />
            </a>
          </div>

          <div className="relative">
            <div
              className="h-[420px] rounded-sm bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute -bottom-7 -left-5 max-w-[260px] bg-[#101B30] p-7 text-white shadow-xl sm:-left-8">
              <div className="text-3xl font-light text-[#D8B779]">1902</div>
              <p className="mt-2 text-xs leading-6 text-white/70">
                The beginning of Daiichi Life Group's long history in
                the life insurance industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="bg-[#101B30] px-6 py-20 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>DAIICHI LIFE GROUP</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <h2 className="text-4xl font-light leading-tight sm:text-5xl">
              A heritage built around
              <span className="text-[#D8B779]"> life's possibilities.</span>
            </h2>
            <div>
              <p className="text-sm leading-8 text-white/65">
                Daiichi Life Group traces its origins to Japan in 1902.
                Its history reflects the development of the life
                insurance industry and the importance of long-term
                financial protection.
              </p>
              <a
                href="https://www.daiichilife.com.mm/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-3 border-b border-[#D8B779] pb-2 text-xs tracking-widest text-[#D8B779]"
              >
                VERIFY OFFICIAL COMPANY INFORMATION <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionLabel>EXPLORE PROTECTION</SectionLabel>
          <h2 className="text-4xl font-light sm:text-5xl">
            Protection for
            <span className="font-semibold"> what matters.</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-slate-500">
            Explore general insurance categories and learn what to
            consider before choosing a policy.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {solutions.map((item) => (
            <article
              key={item.number}
              className="group border border-[#E6E0D5] bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-[#D8B779] hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest text-[#A58A5D]">
                  {item.number}
                </span>
                <span className="text-3xl text-[#B79B6A]">{item.icon}</span>
              </div>
              <h3 className="mt-12 text-2xl font-medium">{item.title}</h3>
              <p className="mt-3 text-xs font-semibold text-[#9A7943]">
                {item.subtitle}
              </p>
              <p className="mt-6 min-h-24 text-sm leading-7 text-slate-500">
                {item.description}
              </p>
              <a
                href="#consultation"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#D8B779] pb-2 text-[10px] font-bold tracking-widest transition group-hover:text-[#9A7943]"
              >
                ASK FOR INFORMATION <Arrow />
              </a>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-slate-400">
          These are general information categories, not confirmed Daiichi
          Life Myanmar insurance product names or a representation of
          available policy benefits.
        </p>
      </section>

      {/* PROTECTION BANNER */}
      <section className="relative overflow-hidden bg-[#EDE8DD]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <SectionLabel>THINK BEYOND TODAY</SectionLabel>
            <h2 className="text-4xl font-light leading-tight sm:text-5xl">
              Because tomorrow
              <br />
              deserves <span className="font-semibold">a plan.</span>
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-8 text-slate-600">
              The right financial decisions begin with the right
              questions. Understand your responsibilities, evaluate
              your needs and review policy details carefully.
            </p>
            <a
              href="#consultation"
              className="mt-9 inline-flex rounded-full bg-[#101B30] px-8 py-4 text-xs font-semibold tracking-widest text-white transition hover:bg-[#9A7943]"
            >
              START A CONVERSATION ↗
            </a>
          </div>
          <div
            className="h-[380px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85')",
            }}
          />
        </div>
      </section>

      {/* CUSTOMER JOURNEY */}
      <section id="journey" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="max-w-xl">
          <SectionLabel>YOUR NEXT STEPS</SectionLabel>
          <h2 className="text-4xl font-light sm:text-5xl">
            A clearer path to
            <span className="font-semibold"> informed decisions.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description]) => (
            <div key={number} className="border-t border-[#D8B779] pt-7">
              <div className="text-sm tracking-widest text-[#B79B6A]">{number}</div>
              <h3 className="mt-7 text-xl font-semibold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CLAIMS GUIDE */}
      <section id="claims" className="bg-[#101B30] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel>CLAIMS INFORMATION</SectionLabel>
            <h2 className="text-4xl font-light leading-tight sm:text-5xl">
              Understand the
              <span className="text-[#D8B779]"> claims journey.</span>
            </h2>
            <p className="mt-7 text-sm leading-8 text-white/60">
              Knowing how to prepare documentation and contact the
              insurer can help you navigate a claim more confidently.
              Always follow the instructions and requirements of the
              actual insurance policy.
            </p>
            <a
              href="https://www.daiichilife.com.mm/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#D8B779] pb-2 text-xs tracking-widest text-[#D8B779]"
            >
              VISIT OFFICIAL CLAIMS RESOURCES <Arrow />
            </a>
          </div>

          <div className="space-y-0">
            {[
              ["01", "Contact the insurer", "Ask about the correct claim procedure."],
              ["02", "Prepare documents", "Confirm the required forms and supporting records."],
              ["03", "Submit your claim", "Use the official submission channel."],
              ["04", "Follow up", "Check assessment status with the insurer."],
            ].map(([number, title, desc]) => (
              <div key={number} className="flex gap-6 border-b border-white/10 py-6">
                <div className="text-sm text-[#D8B779]">{number}</div>
                <div>
                  <h3 className="text-base">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24 lg:py-32">
        <div className="mb-14 text-center">
          <SectionLabel>HELP & INFORMATION</SectionLabel>
          <h2 className="text-4xl font-light">Frequently asked questions.</h2>
        </div>

        <div className="divide-y divide-[#E6E0D5] border-y border-[#E6E0D5]">
          {faqs.map((faq, index) => (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                aria-expanded={activeFaq === index}
                className="flex w-full items-center justify-between gap-5 py-7 text-left"
              >
                <span className="text-sm font-medium sm:text-base">{faq.q}</span>
                <span className="text-xl text-[#B79B6A]">
                  {activeFaq === index ? "−" : "+"}
                </span>
              </button>
              {activeFaq === index && (
                <p className="max-w-3xl pb-7 text-sm leading-8 text-slate-500">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONSULTATION */}
      <section id="consultation" className="bg-[#EDE8DD] px-6 py-24 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <SectionLabel>LET'S CONNECT</SectionLabel>
            <h2 className="text-4xl font-light leading-tight sm:text-5xl">
              Your questions.
              <br />
              Your future.
              <br />
              <span className="font-semibold">Your next step.</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-8 text-slate-600">
              Interested in learning more? Share your enquiry and
              preferred area of interest. An approved contact channel
              must be configured to receive submissions.
            </p>

            <div className="mt-12 border-l-2 border-[#D8B779] pl-6">
              <div className="text-xs font-semibold tracking-widest text-[#9A7943]">
                APEXIVEAI DIGITAL EXPERIENCE
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                A digital information and enquiry experience.
                Insurance policies are issued and administered by the
                relevant licensed insurer, subject to its terms.
              </p>
            </div>
          </div>

          <form
            onSubmit={submitInquiry}
            className="bg-white p-7 shadow-xl sm:p-10"
          >
            <h3 className="text-2xl font-medium">Request Information</h3>
            <p className="mt-2 text-xs text-slate-400">
              Complete the form below to express your interest.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Full Name *
                <input
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="mt-3 w-full border-b border-slate-200 bg-transparent px-0 py-3 text-sm font-normal outline-none transition focus:border-[#B79B6A]"
                />
              </label>

              <label className="text-xs font-semibold text-slate-600">
                Phone Number *
                <input
                  required
                  type="tel"
                  maxLength={30}
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+95 ..."
                  className="mt-3 w-full border-b border-slate-200 bg-transparent px-0 py-3 text-sm font-normal outline-none transition focus:border-[#B79B6A]"
                />
              </label>

              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                Email Address
                <input
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="mt-3 w-full border-b border-slate-200 bg-transparent px-0 py-3 text-sm font-normal outline-none transition focus:border-[#B79B6A]"
                />
              </label>

              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                Area of Interest
                <select
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="mt-3 w-full border-b border-slate-200 bg-white px-0 py-3 text-sm font-normal outline-none focus:border-[#B79B6A]"
                >
                  <option>Life Protection</option>
                  <option>Health Protection</option>
                  <option>Financial Planning</option>
                  <option>Claims Information</option>
                  <option>General Enquiry</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                Your Message
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what information you would like to know..."
                  className="mt-3 w-full resize-y border-b border-slate-200 bg-transparent px-0 py-3 text-sm font-normal outline-none focus:border-[#B79B6A]"
                />
              </label>
            </div>

            <label className="mt-7 flex items-start gap-3 text-xs leading-6 text-slate-500">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-1 accent-[#9A7943]"
              />
              I consent to the handling of the information I provide
              for the purpose of responding to my enquiry. *
            </label>

            {status && (
              <div
                role="status"
                className="mt-6 border border-[#D8B779] bg-[#FBF8F0] p-4 text-xs leading-6 text-slate-700"
              >
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-3 bg-[#101B30] px-7 py-5 text-xs font-semibold tracking-[0.18em] text-white transition hover:bg-[#9A7943] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT ENQUIRY ↗"}
            </button>
            <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
              Do not submit sensitive financial information or identity
              documents through this general enquiry form.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1425] px-6 pb-8 pt-16 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-3">
            <div>
              <div className="text-lg font-semibold tracking-[0.18em]">
                DAIICHI LIFE
              </div>
              <div className="mt-2 text-[9px] tracking-[0.25em] text-[#D8B779]">
                LIFE PROTECTION EXPERIENCE
              </div>
              <p className="mt-6 max-w-xs text-xs leading-7 text-white/45">
                Discover insurance information and explore the
                importance of preparing for tomorrow.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#D8B779]">
                EXPLORE
              </h4>
              <div className="mt-6 flex flex-col gap-4 text-xs text-white/55">
                <a href="#about">About</a>
                <a href="#solutions">Insurance Solutions</a>
                <a href="#claims">Claims Guide</a>
                <a href="#faq">Frequently Asked Questions</a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#D8B779]">
                OFFICIAL RESOURCE
              </h4>
              <a
                href="https://www.daiichilife.com.mm/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#D8B779]"
              >
                Daiichi Life Myanmar <Arrow />
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 pt-8 text-[10px] leading-6 text-white/35 md:flex-row">
            <div>
              © 2026 Apexive AI. All rights reserved.
              <p>Digital experience designed and developed by ApexiveAI.</p>
            </div>
            <div className="max-w-xl">
              Independent informational and marketing experience.
              Unless separately authorized in writing, ApexiveAI does
              not represent itself as Daiichi Life's agent or official
              representative. Product availability, coverage,
              premiums and claims are subject to official insurer
              documentation and policy terms.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
