"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const mainNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={17} strokeWidth={1.7} />,
  },
  {
    label: "Forums",
    href: "/forums",
    icon: <Users size={17} strokeWidth={1.7} />,
  },
  {
    label: "Articles",
    href: "/articles",
    icon: <BookOpen size={17} strokeWidth={1.7} />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderKanban size={17} strokeWidth={1.7} />,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: <Sparkles size={17} strokeWidth={1.7} />,
  },
  {
    label: "Clone Detector",
    href: "/clone-detector",
    icon: <ShieldCheck size={17} strokeWidth={1.7} />,
  },
  {
    label: "Search",
    href: "/search",
    icon: <Search size={17} strokeWidth={1.7} />,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/" || pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function CommunityCyberpunkShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname() || "/";

  const activeItem =
    mainNavigation.find((item) => isActivePath(pathname, item.href))?.label ||
    "Community";

  return (
    <div className="ac-app">
      <div className="ac-city-background" aria-hidden="true">
        <div className="ac-city-haze ac-city-haze-one" />
        <div className="ac-city-haze ac-city-haze-two" />

        <div className="ac-city-sun" />

        <div className="ac-city-orbit ac-city-orbit-one" />
        <div className="ac-city-orbit ac-city-orbit-two" />

        <div className="ac-city-buildings ac-buildings-back">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              style={{
                height: `${55 + ((index * 37) % 130)}px`,
              }}
            />
          ))}
        </div>

        <div className="ac-city-buildings ac-buildings-front">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              style={{
                height: `${90 + ((index * 53) % 180)}px`,
              }}
            />
          ))}
        </div>

        <div className="ac-city-tower ac-tower-left">
          <div className="ac-tower-cap" />
          <div className="ac-tower-body" />
          <div className="ac-tower-beacon" />
        </div>

        <div className="ac-city-tower ac-tower-right">
          <div className="ac-tower-cap" />
          <div className="ac-tower-body" />
          <div className="ac-tower-beacon" />
        </div>

        <div className="ac-pagoda">
          <div className="ac-pagoda-spire" />
          <div className="ac-pagoda-top" />
          <div className="ac-pagoda-level ac-pagoda-level-one" />
          <div className="ac-pagoda-level ac-pagoda-level-two" />
          <div className="ac-pagoda-level ac-pagoda-level-three" />
          <div className="ac-pagoda-base" />
          <div className="ac-pagoda-platform" />
        </div>

        <div className="ac-city-road">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="ac-city-horizon" />
        <div className="ac-city-vignette" />
      </div>

      <div className="ac-layout">
        <aside className="ac-sidebar">
          <Link href="/dashboard" className="ac-brand">
            <span className="ac-brand-mark">
              <span>A</span>
              <i />
            </span>

            <span className="ac-brand-copy">
              <strong>APEXIVE</strong>
              <small>AI COMMUNITY</small>
            </span>
          </Link>

          <div className="ac-sidebar-system">
            <span className="ac-system-light" />
            <span>NEURAL NETWORK</span>
            <strong>ONLINE</strong>
          </div>

          <p className="ac-section-label">MAIN INTERFACE</p>

          <nav className="ac-nav" aria-label="Main navigation">
            {mainNavigation.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ac-nav-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="ac-nav-icon">{item.icon}</span>

                  <span className="ac-nav-label">{item.label}</span>

                  {item.label === "Clone Detector" && (
                    <span className="ac-nav-count">AI</span>
                  )}

                  <span className="ac-nav-arrow">↗</span>
                </Link>
              );
            })}
          </nav>

          <div className="ac-sidebar-bottom">
            <div className="ac-city-card">
              <div className="ac-city-card-top">
                <span>
                  <Waves size={14} />
                  CITY NODE
                </span>

                <span className="ac-live-pill">
                  <i />
                  LIVE
                </span>
              </div>

              <strong>TOKYO</strong>
              <span>JAPAN / 35.6762° N</span>

              <div className="ac-city-bars">
                {Array.from({ length: 12 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      height: `${8 + ((index * 7) % 18)}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="ac-sidebar-footer">
              APEXIVE AI · 2026
            </p>
          </div>
        </aside>

        <main className="ac-main">
          <header className="ac-topbar">
            <div className="ac-breadcrumb">
              <span>APEXIVE</span>
              <b>/</b>
              <span>COMMUNITY</span>
              <b>/</b>
              <strong>{activeItem.toUpperCase()}</strong>
            </div>

            <div className="ac-top-actions">
              <div className="ac-network-status">
                <span />
                <div>
                  <small>NETWORK</small>
                  <strong>STABLE</strong>
                </div>
              </div>

              <Link
                href="/profile"
                className="ac-avatar"
                aria-label="Open profile"
                title="Profile"
              >
                A
              </Link>
            </div>
          </header>

          <div className="ac-page-content">{children}</div>

          <footer className="ac-footer">
            <div>
              <span className="ac-footer-mark">A</span>
              <span>APEXIVE AI</span>
            </div>

            <span>TOKYO CYBER CITY · COMMUNITY NETWORK</span>

            <span className="ac-footer-online">
              <Activity size={12} />
              SYSTEM OPERATIONAL
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}