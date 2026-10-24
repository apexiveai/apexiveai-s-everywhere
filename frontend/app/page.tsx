
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  CircleDot,
  Code2,
  Cpu,
  Globe2,
  Gavel,
  Layers3,
  Menu,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { getExternalProductUrl } from "@/lib/community";

const FONT = {
  brand: "Apexive AI",
  home: "Home",
  dashboard: "Dashboard",
  resources: "Resources",
  signIn: "Sign in",
  getStarted: "Tenant sign in",
};

const products = [
  {
    id: "01",
    name: "Trademark Intelligence",
    subtitle: "Visual matching · Conflict analysis",
    description:
      "Compare trademark documents and logos with an AI-assisted review workflow.",
    href: "/workspace",
    external: false,
    icon: ShieldCheck,
    tag: "AI intelligence",
    color: "cyan",
  },
  {
    id: "02",
    name: "RPA Automation",
    subtitle: "Robotic process automation",
    description:
      "Automate repetitive business processes with intelligent workflows.",
    href: "/workspace",
    external: false,
    icon: BrainCircuit,
    tag: "Autonomous AI",
    color: "purple",
  },
  {
    id: "03",
    name: "Apexive Community",
    subtitle: "Discover · Share · Build",
    description:
      "Connect with builders, explore projects, and share ideas across the network.",
    href: "/forums",
    icon: Network,
    tag: "Community network",
    color: "pink",
  },
  {
    id: "04",
    name: "ApexiveAI RPA Platform",
    subtitle: "Robotic process automation",
    description:
      "Design and run intelligent workflows with the ApexiveAI RPA Platform.",
    href: getExternalProductUrl(process.env.NEXT_PUBLIC_RPA_PLATFORM_URL),
    external: true,
    icon: BrainCircuit,
    tag: "Workflow automation",
    color: "purple",
  },
  {
    id: "05",
    name: "ApexiveAI Cyclone RPA",
    subtitle: "Cyclone automation studio",
    description:
      "Build and manage automation workflows with the Cyclone RPA studio.",
    href: getExternalProductUrl(process.env.NEXT_PUBLIC_CYCLONE_RPA_URL),
    external: true,
    icon: Workflow,
    tag: "RPA studio",
    color: "cyan",
  },
  {
    id: "06",
    name: "ApexiveAI MultiVendor Marketplace",
    subtitle: "Multi-vendor commerce",
    description:
      "Explore a multi-vendor marketplace for products, sellers, and buyers.",
    href: getExternalProductUrl(process.env.NEXT_PUBLIC_MULTIVENDOR_MARKETPLACE_URL),
    external: true,
    icon: Store,
    tag: "Marketplace",
    color: "pink",
  },
];

function EcosystemPreview() {
  return (
    <div className="product-preview" aria-label="Apexive AI platform overview">
      <div className="preview-glow" aria-hidden="true" />
      <div className="preview-orbit preview-orbit-one" aria-hidden="true" />
      <div className="preview-orbit preview-orbit-two" aria-hidden="true" />
      <div className="preview-center-mark">
        <Layers3 size={42} strokeWidth={1.4} />
      </div>
      <div className="preview-module preview-module-trademark">
        <ShieldCheck size={17} />
        <span>
          <strong>Trademark intelligence</strong>
          <small>Visual matching &amp; analysis</small>
        </span>
      </div>
      <div className="preview-module preview-module-automation">
        <BrainCircuit size={17} />
        <span>
          <strong>Intelligent workflows</strong>
          <small>Automation that moves work forward</small>
        </span>
      </div>
      <div className="preview-module preview-module-community">
        <Network size={17} />
        <span>
          <strong>A connected community</strong>
          <small>Ideas, people, and projects</small>
        </span>
      </div>
      <span className="preview-caption">Technology designed around people</span>
    </div>
  );
}

function LiveClock() {
  const [clock, setClock] = useState("--:--:--");
  const [date, setDate] = useState("INITIALIZING");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      );

      setDate(
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
          .format(now)
          .toUpperCase()
      );
    };

    update();
    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="live-clock">
      <span className="clock-indicator" />
      <div>
        <strong>{clock}</strong>
        <small>{date}</small>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return products;

    return products.filter((product) =>
      [
        product.name,
        product.subtitle,
        product.description,
        product.tag,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [query]);

  const navItemsBeforeExplore = [
    { label: FONT.home, href: "/" },
    { label: FONT.dashboard, href: "/dashboard" },
  ];

  const exploreNavItems = [
    { label: "Forums", href: "/forums" },
    { label: "Articles", href: "/articles" },
    { label: "Projects", href: "/projects" },
    { label: "Auctions", href: "/auctions" },
    { label: "Security", href: "/security" },
  ];

  const navItemsAfterExplore = [
    { label: FONT.resources, href: "/resources" },
  ];

  return (
    <main className="home-page">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Apexive AI home">
          <span className="brand-symbol">
            <Layers3 size={22} strokeWidth={1.7} />
            <i />
          </span>

          <span className="brand-copy">
            <strong>{FONT.brand}</strong>
            <small>Intelligence, thoughtfully connected</small>
          </span>
        </Link>

        <nav className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
          {navItemsBeforeExplore.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={item.href === "/" ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
          <details className="home-nav-group">
            <summary className="nav-link">
              Explore <ChevronDown size={13} />
            </summary>
            <div className="home-nav-menu">
              {exploreNavItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          {navItemsAfterExplore.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/login" className="signin-link">
            {FONT.signIn}
            <ArrowUpRight size={14} />
          </Link>

          <Link href="/login" className="header-cta">
            {FONT.getStarted}
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-pulse" />
            <span>A more thoughtful way to work with AI</span>
            <span className="eyebrow-line" />
          </div>

          <h1>
            BUILD BEYOND
            <br />
            <span>THE ORDINARY.</span>
          </h1>

          <p className="hero-description">
            An autonomous digital ecosystem for enterprise intelligence,
            intelligent workflows, and a community built for what comes next.
          </p>

          <div className="hero-actions">
            <Link href="/login" className="primary-button">
              <Sparkles size={17} />
              Explore Apexive
              <ArrowRight size={17} />
            </Link>

            <Link href="/auctions" className="secondary-button">
              <Gavel size={17} />
              Explore auctions
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="trust-icon">
              <ShieldCheck size={16} />
            </div>
            <span>Enterprise-ready AI</span>
            <span className="trust-separator">/</span>
            <span>One connected platform</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-topline">
            <span>
              <CircleDot size={12} />
              The Apexive ecosystem
            </span>
            <span>One platform, many possibilities</span>
          </div>

          <EcosystemPreview />

          <div className="visual-bottomline">
            <span>Designed for clarity. Built to scale.</span>
            <span className="visual-coordinates">Apexive AI</span>
          </div>
        </div>
      </section>

      <section className="auction-intro" aria-labelledby="auction-intro-title">
        <div className="auction-intro-icon">
          <Gavel size={25} />
        </div>
        <div className="auction-intro-copy">
          <span className="auction-intro-kicker">APEXIVE AUCTIONS · ONLINE MARKETPLACE</span>
          <h2 id="auction-intro-title">လေလံတင်ပါ။ လေလံဆွဲပါ။</h2>
          <p>
            eBay ဟာ ကမ္ဘာတစ်ဝန်း လူသိများတဲ့ online auction marketplace တစ်ခုပါ။
            Apexive မှာလည်း ပစ္စည်းတွေကို လေလံတင်ပြီး community နဲ့အတူ လေလံဝင်ဆွဲနိုင်ပါပြီ။
          </p>
        </div>
        <div className="auction-intro-actions">
          <Link href="/auctions" className="auction-intro-primary">
            လေလံများကြည့်ရန် <ArrowRight size={16} />
          </Link>
          <Link href="/auctions#create-auction" className="auction-intro-secondary">
            ပစ္စည်းတင်ရန် <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <section className="system-strip" aria-label="Platform information">
        <div className="system-strip-heading">
          <span className="status-dot" />
          <span>Platform overview</span>
        </div>

        <div className="system-item">
          <Activity size={16} />
          <div>
            <span>Community</span>
            <strong>Open to everyone</strong>
          </div>
        </div>

        <div className="system-item">
          <Cpu size={16} />
          <div>
            <span>AI platform</span>
            <strong>Modular architecture</strong>
          </div>
        </div>

        <div className="system-item">
          <Globe2 size={16} />
          <div>
            <span>Built for</span>
            <strong>Global teams</strong>
          </div>
        </div>

        <div className="system-clock">
          <LiveClock />
        </div>
      </section>

      <section className="platform-section">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              <span>01</span>
              <span>              The ecosystem</span>
            </div>

            <h2>
              ONE ECOSYSTEM.
              <br />
              BUILT AROUND YOU.
            </h2>

            <p>
              Explore the intelligence, automation, and people that make the
              Apexive ecosystem useful.
            </p>
          </div>

          <div className="section-side-note">
            <span className="side-note-icon">
              <Zap size={18} />
            </span>
            <span>
              <strong>Designed for what&apos;s next</strong>
              <small>Modular · Expandable · AI-ready</small>
            </span>
          </div>
        </div>

        <div className="product-toolbar">
          <div className="toolbar-label">
            <Code2 size={15} />
            <span>Platform modules</span>
          </div>

          <label className="product-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search platform modules..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search platform modules"
            />
            <span>⌘ K</span>
          </label>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => {
            const Icon = product.icon;

            return (
              <article
                key={product.id}
                className={`product-card product-${product.color}`}
              >
                <div className="product-card-top">
                  <span className="product-number">/{product.id}</span>
                  <span className="product-tag">{product.tag}</span>
                </div>

                <div className="product-icon-wrap">
                  <Icon size={25} strokeWidth={1.6} />
                  <span />
                </div>

                <div className="product-card-content">
                  <span className="product-subtitle">{product.subtitle}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>

                {product.external ? (
                  product.href ? (
                    <a
                      href={product.href}
                      className="product-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Open module</span>
                      <ArrowUpRight size={17} />
                    </a>
                  ) : (
                    <span
                      className="product-link product-link-unavailable"
                      aria-disabled="true"
                    >
                      Launch URL not configured
                    </span>
                  )
                ) : product.href ? (
                  <Link href={product.href} className="product-link">
                    <span>Open module</span>
                    <ArrowUpRight size={17} />
                  </Link>
                ) : (
                  <span
                    className="product-link product-link-unavailable"
                    aria-disabled="true"
                  >
                    Module URL not configured
                  </span>
                )}

                <div className="product-card-glow" />
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-search">
            <Search size={24} />
            <strong>No matching modules</strong>
            <span>Try a different search term.</span>
          </div>
        )}
      </section>

      <section className="community-banner">
        <div className="community-banner-grid" />

        <div className="community-banner-icon">
          <MessageSquare size={27} />
          <span />
        </div>

        <div className="community-banner-copy">
          <span className="section-kicker">
            <span>02</span>
            <span>The community</span>
          </span>

          <h2>
            YOUR IDEAS.
            <br />
            <span>OUR NEXT FRONTIER.</span>
          </h2>

          <p>
            Discover projects, exchange knowledge, and build meaningful
            connections with the Apexive community.
          </p>
        </div>

        <Link href="/forums" className="community-cta">
          Explore the community
          <ArrowUpRight size={17} />
        </Link>

        <ArrowDownRight className="community-decoration" size={100} />
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <Link href="/" className="brand footer-brand">
            <span className="brand-symbol">
              <Layers3 size={21} strokeWidth={1.7} />
              <i />
            </span>

            <span className="brand-copy">
              <strong>{FONT.brand}</strong>
              <small>Intelligence, thoughtfully connected</small>
            </span>
          </Link>

          <p>
            Building the next generation of digital intelligence.
          </p>

          <Image
            src="/copyright-bhone-htet-naing.png"
            alt="Copyright — Bhone Htet Naing. All rights reserved."
            width={144}
            height={96}
            className="home-copyright-art"
          />

          <Link href="/projects" className="footer-explore">
            Explore Apexive
            <ChevronDown size={14} />
          </Link>
        </div>

        <div className="footer-bottom">
          <span>© APEXIVE AI</span>
          <span className="footer-status">
            <span className="status-dot" />
            Thoughtful technology for everyone
          </span>
          <Link href="/privacy">Privacy</Link>
        </div>
      </footer>
    </main>
  );
}
