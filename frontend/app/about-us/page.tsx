import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Network, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Apexive AI",
  description:
    "Learn about Apexive AI and the intelligent systems we build for modern organizations.",
};

const capabilities = [
  {
    number: "01",
    title: "AI & Intelligent Agents",
    text: "Artificial intelligence solutions that automate work, process information, support decisions, and create practical digital capabilities.",
  },
  {
    number: "02",
    title: "Modern Software Systems",
    text: "Web applications, enterprise platforms, APIs, databases, dashboards, backend systems, and scalable digital architectures.",
  },
  {
    number: "03",
    title: "Business Transformation",
    text: "We transform manual and disconnected workflows into connected, automated, data-driven, and intelligent operations.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="about-us-page">
      <section className="about-us-hero">
        <div className="about-us-overlay" />
        <div className="about-us-hero-inner">
          <div className="about-us-kicker">
            <span />
            Apexive AI Company Limited
          </div>

          <div className="about-us-hero-grid">
            <div className="about-us-who">
              <span className="about-us-index">01 / About Us</span>
              <h1>Technology built around real business problems.</h1>
              <p>
                We build intelligent systems that help organizations work
                faster, operate smarter, and compete in a rapidly changing
                digital world.
              </p>
              <Link href="/login" className="about-us-primary">
                Build with Apexive
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="about-us-what">
              <span className="about-us-index">02 / What We Do</span>
              <h2>Practical intelligence for modern organizations.</h2>
              <p>
                From enterprise software and AI agents to automation and
                digital government systems, our work turns difficult
                operational problems into reliable technology.
              </p>
              <Link href="/resources" className="about-us-read-more">
                Read more
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us-capabilities" aria-labelledby="capabilities-title">
        <div className="about-us-section-heading">
          <span className="about-us-index">Our capabilities</span>
          <h2 id="capabilities-title">Three ways we create lasting impact.</h2>
        </div>

        <div className="about-us-card-grid">
          {capabilities.map((capability) => (
            <article className="about-us-card" key={capability.number}>
              <div className="about-us-card-top">
                <span>{capability.number}</span>
                {capability.number === "01" ? (
                  <BrainCircuit size={24} />
                ) : capability.number === "02" ? (
                  <Workflow size={24} />
                ) : (
                  <Network size={24} />
                )}
              </div>
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
