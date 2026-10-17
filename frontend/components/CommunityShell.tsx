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
} from "lucide-react";
import { externalModules } from "../lib/community";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
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

const productNavigation: NavItem[] = [
  {
    ...externalModules.trademark,
    icon: <ShieldCheck size={17} strokeWidth={1.7} />,
    external: true,
  },
  {
    ...externalModules.rpa,
    icon: <Activity size={17} strokeWidth={1.7} />,
    external: true,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/" || pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function CommunityShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname() || "/";

  if (pathname === "/") {
    return children;
  }

  const activeItem =
    mainNavigation.find((item) => isActivePath(pathname, item.href))?.label ||
    "Community";

  return (
    <div className="ac-app">
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
            <span>COMMUNITY</span>
            <strong>ACTIVE</strong>
          </div>

          <p className="ac-section-label">COMMUNITY</p>

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

          <p className="ac-section-label ac-product-section-label">
            OUR PRODUCTS
          </p>

          <nav className="ac-nav ac-product-nav" aria-label="Apexive products">
            {productNavigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="ac-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="ac-nav-icon">{item.icon}</span>
                <span className="ac-nav-label">{item.label}</span>
                <span className="ac-nav-arrow">↗</span>
              </a>
            ))}
          </nav>

          <div className="ac-sidebar-bottom">
            <div className="ac-city-card">
              <div className="ac-city-card-top">
                <span>
                  <Activity size={14} />
                  COMMUNITY STATUS
                </span>

                <span className="ac-live-pill">
                  <i />
                  LIVE
                </span>
              </div>

              <strong>GLOBAL</strong>
              <span>Open to the world</span>

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
              <strong>{activeItem}</strong>
            </div>

            <div className="ac-top-actions">
              <div className="ac-network-status">
                <span />
                <div>
                  <small>STATUS</small>
                  <strong>Active</strong>
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

            <span>A GLOBAL COMMUNITY FOR BUILDERS</span>

            <span className="ac-footer-online">
              <Activity size={12} />
              All systems operational
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}