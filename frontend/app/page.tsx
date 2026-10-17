
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Layers3,
  Menu,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";

const FONT = {
  brand: "ᴀᴘᴇxɪᴠᴇ ᴀɪ",
  home: "ʜᴏᴍᴇ",
  dashboard: "ᴅᴀsʜʙᴏᴀʀᴅ",
  forums: "ꜰᴏʀᴜᴍs",
  articles: "ᴀʀᴛɪᴄʟᴇs",
  projects: "ᴘʀᴏᴊᴇᴄᴛs",
  resources: "ʀᴇsᴏᴜʀᴄᴇs",
  signIn: "sɪɢɴ ɪɴ",
  getStarted: "ɢᴇᴛ sᴛᴀʀᴛᴇᴅ",
};

const products = [
  {
    id: "01",
    name: "Trademark Intelligence",
    subtitle: "ᴠɪsᴜᴀʟ ᴍᴀᴛᴄʜɪɴɢ · ᴄᴏɴꜰʟɪᴄᴛ ᴀɴᴀʟʏsɪs",
    description:
      "Compare trademark documents and logos with an AI-assisted review workflow.",
    href: "/trademark-intelligence",
    icon: ShieldCheck,
    tag: "AI INTELLIGENCE",
    color: "cyan",
  },
  {
    id: "02",
    name: "Autonomous Workforce",
    subtitle: "ᴀɢᴇɴᴛs · ᴡᴏʀᴋꜰʟᴏᴡ · ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ",
    description:
      "Coordinate enterprise tasks through planned, executed, and verified workflows.",
    href: "/workforce",
    icon: BrainCircuit,
    tag: "AUTONOMOUS AI",
    color: "purple",
  },
  {
    id: "03",
    name: "Apexive Community",
    subtitle: "ᴅɪsᴄᴏᴠᴇʀ · sʜᴀʀᴇ · ʙᴜɪʟᴅ",
    description:
      "Connect with builders, explore projects, and share ideas across the network.",
    href: "/forums",
    icon: Network,
    tag: "COMMUNITY NETWORK",
    color: "pink",
  },
];

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let animationFrame = 0;
    let lastFrame = 0;

    const fontSize = 14;
    const characters =
      "01アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.ceil(width / fontSize);
      drops = Array.from(
        { length: columns },
        () => Math.random() * (height / fontSize)
      );
    };

    const draw = (timestamp: number) => {
      if (timestamp - lastFrame < 65) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      lastFrame = timestamp;

      ctx.fillStyle = "rgba(3, 8, 18, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );

        ctx.fillStyle =
          Math.random() > 0.985
            ? "rgba(130, 255, 244, 0.8)"
            : "rgba(28, 230, 190, 0.24)";

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (
          drops[i] * fontSize > height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }

        drops[i] += 0.45 + Math.random() * 0.35;
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}

function TokyoCity() {
  return (
    <div className="city-scene" aria-label="Neon Tokyo city at night">
      <div className="city-sky-glow" />
      <div className="city-moon" />
      <div className="city-orbit city-orbit-one" />
      <div className="city-orbit city-orbit-two" />

      <div className="city-distant city-distant-one">
        {Array.from({ length: 15 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="city-distant city-distant-two">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="city-tower tower-left">
        <div className="tower-roof" />
        <div className="tower-lights" />
      </div>

      <div className="city-tower tower-right">
        <div className="tower-roof" />
        <div className="tower-lights" />
      </div>

      <div className="city-tower tower-center-left">
        <div className="tower-roof" />
        <div className="tower-lights" />
      </div>

      <div className="city-tower tower-center-right">
        <div className="tower-roof" />
        <div className="tower-lights" />
      </div>

      <div className="pagoda">
        <div className="pagoda-spire" />
        <div className="pagoda-top" />
        <div className="pagoda-level pagoda-level-one" />
        <div className="pagoda-level pagoda-level-two" />
        <div className="pagoda-level pagoda-level-three" />
        <div className="pagoda-base" />
        <div className="pagoda-platform" />
        <div className="pagoda-glow" />
      </div>

      <div className="city-road">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="city-scanline" />

      <div className="city-hud hud-left">
        <span className="hud-label">ᴊᴘ / ᴛᴏᴋʏᴏ</span>
        <strong>35.6762° N</strong>
        <strong>139.6503° E</strong>
        <span className="hud-divider" />
        <span>ɴᴇᴛᴡᴏʀᴋ ᴏɴʟɪɴᴇ</span>
      </div>

      <div className="city-hud hud-right">
        <span className="hud-label">ᴄɪᴛʏ ᴍᴏᴅᴇ</span>
        <strong>CYBER / 07</strong>
        <span className="hud-bars">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
        <span>ꜱʏsᴛᴇᴍ ɴᴏʀᴍᴀʟ</span>
      </div>

      <div className="city-bottom-label">
        <span className="city-bottom-dot" />
        TOKYO // JAPAN
      </div>
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
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      );

      setDate(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Tokyo",
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
        <small>{date} · MMT</small>
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

  const navItems = [
    { label: FONT.home, href: "/" },
    { label: FONT.dashboard, href: "/dashboard" },
    { label: FONT.forums, href: "/forums" },
    { label: FONT.articles, href: "/articles" },
    { label: FONT.projects, href: "/projects" },
    { label: FONT.resources, href: "/resources" },
  ];

  return (
    <main className="cyber-home">
      <MatrixRain />
      <div className="ambient-grid" />
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <header className="site-header">
        <Link href="/" className="brand" aria-label="Apexive AI home">
          <span className="brand-symbol">
            <Layers3 size={22} strokeWidth={1.7} />
            <i />
          </span>

          <span className="brand-copy">
            <strong>{FONT.brand}</strong>
            <small>ᴛʜᴇ ᴀᴜᴛᴏɴᴏᴍᴏᴜs ɴᴇᴛᴡᴏʀᴋ</small>
          </span>
        </Link>

        <nav className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={item.href === "/" ? "nav-link active" : "nav-link"}
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

          <Link href="/register" className="header-cta">
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
            <span>ᴛʜᴇ ɴᴇxᴛ ᴇʀᴀ ᴏꜰ ᴀɪ ɪs ʜᴇʀᴇ</span>
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
            <Link href="/register" className="primary-button">
              <Sparkles size={17} />
              ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴇᴛᴡᴏʀᴋ
              <ArrowRight size={17} />
            </Link>

            <Link href="/projects" className="secondary-button">
              <Terminal size={17} />
              ᴇxᴘʟᴏʀᴇ ᴘʀᴏᴊᴇᴄᴛs
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="trust-icon">
              <ShieldCheck size={16} />
            </div>
            <span>ᴇɴᴛᴇʀᴘʀɪsᴇ-ꜰᴏᴄᴜsᴇᴅ ᴀɪ</span>
            <span className="trust-separator">/</span>
            <span>ᴍᴏᴅᴜʟᴀʀ ᴘʟᴀᴛꜰᴏʀᴍ</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-topline">
            <span>
              <CircleDot size={12} />
              ᴠɪsᴜᴀʟ ᴇɴᴠɪʀᴏɴᴍᴇɴᴛ
            </span>
            <span>RNG / 001</span>
          </div>

          <TokyoCity />

          <div className="visual-bottomline">
            <span>ᴛᴏᴋʏᴏ ᴅɪɢɪᴛᴀʟ ꜰʀᴏɴᴛɪᴇʀ</span>
            <span className="visual-coordinates">139° 39&apos; 01.1&quot; E</span>
          </div>
        </div>
      </section>

      <section className="system-strip" aria-label="Platform information">
        <div className="system-strip-heading">
          <span className="status-dot" />
          <span>ᴘʟᴀᴛꜰᴏʀᴍ sᴛᴀᴛᴜs</span>
        </div>

        <div className="system-item">
          <Activity size={16} />
          <div>
            <span>ɴᴇᴛᴡᴏʀᴋ</span>
            <strong>ᴏɴʟɪɴᴇ ᴍᴏᴅᴇ</strong>
          </div>
        </div>

        <div className="system-item">
          <Cpu size={16} />
          <div>
            <span>ᴀɪ ᴇɴɢɪɴᴇ</span>
            <strong>ᴍᴏᴅᴜʟᴀʀ ᴀʀᴄʜɪᴛᴇᴄᴛᴜʀᴇ</strong>
          </div>
        </div>

        <div className="system-item">
          <Globe2 size={16} />
          <div>
            <span>ʀᴇɢɪᴏɴ</span>
            <strong>ᴛᴏᴋʏᴏ · ᴊᴘ</strong>
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
              <span>ᴛʜᴇ ᴇᴄᴏsʏsᴛᴇᴍ</span>
            </div>

            <h2>
              ONE NETWORK.
              <br />
              <span>ENDLESS POSSIBILITIES.</span>
            </h2>

            <p>
              Explore the intelligence, automation, and people powering the
              Apexive digital ecosystem.
            </p>
          </div>

          <div className="section-side-note">
            <span className="side-note-icon">
              <Zap size={18} />
            </span>
            <span>
              <strong>ᴅᴇsɪɢɴᴇᴅ ꜰᴏʀ ᴡʜᴀᴛ&apos;s ɴᴇxᴛ</strong>
              <small>ᴍᴏᴅᴜʟᴀʀ · ᴇxᴘᴀɴᴅᴀʙʟᴇ · ᴀɪ-ʀᴇᴀᴅʏ</small>
            </span>
          </div>
        </div>

        <div className="product-toolbar">
          <div className="toolbar-label">
            <Code2 size={15} />
            <span>ᴘʟᴀᴛꜰᴏʀᴍ ᴍᴏᴅᴜʟᴇs</span>
          </div>

          <label className="product-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="ᴛʏᴘᴇ sᴏᴍᴇᴛʜɪɴɢ ᴛᴏ sᴛᴀʀᴛ..."
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

                <Link href={product.href} className="product-link">
                  <span>ᴏᴘᴇɴ ᴍᴏᴅᴜʟᴇ</span>
                  <ArrowUpRight size={17} />
                </Link>

                <div className="product-card-glow" />
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-search">
            <Search size={24} />
            <strong>ɴᴏ ᴍᴀᴛᴄʜɪɴɢ ᴍᴏᴅᴜʟᴇs</strong>
            <span>ᴛʀʏ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ sᴇᴀʀᴄʜ ᴛᴇʀᴍ.</span>
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
            <span>ᴛʜᴇ ᴄᴏᴍᴍᴜɴɪᴛʏ</span>
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
          ᴇxᴘʟᴏʀᴇ ᴛʜᴇ ᴄᴏᴍᴍᴜɴɪᴛʏ
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
              <small>ᴛʜᴇ ᴀᴜᴛᴏɴᴏᴍᴏᴜs ɴᴇᴛᴡᴏʀᴋ</small>
            </span>
          </Link>

          <p>
            ʙᴜɪʟᴅɪɴɢ ᴛʜᴇ ɴᴇxᴛ ɢᴇɴᴇʀᴀᴛɪᴏɴ ᴏꜰ ᴅɪɢɪᴛᴀʟ ɪɴᴛᴇʟʟɪɢᴇɴᴄᴇ.
          </p>

          <Link href="/projects" className="footer-explore">
            ᴇxᴘʟᴏʀᴇ ᴀᴘᴇxɪᴠᴇ
            <ChevronDown size={14} />
          </Link>
        </div>

        <div className="footer-bottom">
          <span>© APEXIVE AI</span>
          <span className="footer-status">
            <span className="status-dot" />
            ᴅɪɢɪᴛᴀʟ ꜰʀᴏɴᴛɪᴇʀ · ᴛᴏᴋʏᴏ
          </span>
          <Link href="/privacy">ᴘʀɪᴠᴀᴄʏ</Link>
        </div>
      </footer>
    </main>
  );
}
