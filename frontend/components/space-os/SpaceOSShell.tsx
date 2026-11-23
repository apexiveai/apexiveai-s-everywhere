"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Command,
  Database,
  Globe2,
  Menu,
  Orbit,
  RadioTower,
  Search,
  Settings2,
  ShieldCheck,
  Satellite,
  X,
} from "lucide-react";
import { SPACE_MODULES } from "../../lib/space-os";

const iconMap = [
  Satellite,
  RadioTower,
  Orbit,
  Globe2,
  Activity,
  NavigationIcon,
  Database,
  Activity,
  ShieldCheck,
  Settings2,
  Command,
  Globe2,
];

function NavigationIcon({ size = 17 }: { size?: number }) {
  return <Orbit size={size} />;
}

function SpaceOSShellContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(
    () =>
      SPACE_MODULES.filter((module) =>
        `${module.name} ${module.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  const currentModule = SPACE_MODULES.find(
    (module) => pathname === `/space-os/${module.slug}`,
  );

  return (
    <div className="spaceos">
      <header className="spaceos-header">
        <Link
          href="/space-os"
          className="spaceos-brand"
          onClick={() => setMobileOpen(false)}
        >
          <span className="spaceos-brand-icon">
            <Orbit size={24} strokeWidth={1.7} />
          </span>
          <span className="spaceos-brand-text">
            <strong>
              APEXIVE<span>AI</span>
            </strong>
            <small>SPACE OPERATIONS SYSTEM</small>
          </span>
        </Link>

        <div className="spaceos-header-center">
          <span className="spaceos-environment">
            <i />
            CIVILIAN SPACE INFRASTRUCTURE
          </span>
        </div>

        <div className="spaceos-header-actions">
          <button
            className={`spaceos-icon-button ${searchOpen ? "active" : ""}`}
            aria-label="Search modules"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Search size={18} />
          </button>
          <button className="spaceos-icon-button" aria-label="Notifications">
            <Bell size={18} />
            <i className="spaceos-notification-dot" />
          </button>
          <span className="spaceos-header-divider" />
          <div className="spaceos-user">
            <span className="spaceos-avatar">A</span>
            <span>
              <strong>Workspace</strong>
              <small>Space Administrator</small>
            </span>
            <ChevronDown size={14} />
          </div>
          <button
            className="spaceos-mobile-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="spaceos-search-panel">
          <div className="spaceos-search-input">
            <Search size={18} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Space OS modules..."
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={17} />
            </button>
          </div>
          <div className="spaceos-search-results">
            {filteredModules.map((module) => (
              <Link
                key={module.slug}
                href={`/space-os/${module.slug}`}
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
              >
                <span>{module.shortName}</span>
                <ArrowUpRight size={15} />
              </Link>
            ))}
            {filteredModules.length === 0 && (
              <p>No matching modules found.</p>
            )}
          </div>
        </div>
      )}

      <nav
        className={`spaceos-nav ${mobileOpen ? "is-open" : ""}`}
        aria-label="Space OS navigation"
      >
        <div className="spaceos-nav-inner">
          <Link
            href="/space-os"
            className={`spaceos-nav-link ${pathname === "/space-os" ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <Command size={16} />
            <span>Command Center</span>
          </Link>

          <span className="spaceos-nav-separator" />

          {SPACE_MODULES.map((module, index) => {
            const Icon = iconMap[index] ?? Orbit;
            const active = pathname === `/space-os/${module.slug}`;

            return (
              <Link
                key={module.slug}
                href={`/space-os/${module.slug}`}
                className={`spaceos-nav-link ${active ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{module.shortName}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="spaceos-main">
        <div className="spaceos-breadcrumb">
          <Link href="/space-os">SPACE OS</Link>
          {currentModule && (
            <>
              <span>/</span>
              <strong>{currentModule.shortName.toUpperCase()}</strong>
            </>
          )}
        </div>
        {children}
      </main>

      <footer className="spaceos-footer">
        <span>APEXIVEAI SPACE OS</span>
        <span>SPACE INFRASTRUCTURE MANAGEMENT PLATFORM</span>
        <span>
          <i /> WORKSPACE READY
        </span>
      </footer>
    </div>
  );
}

export default function SpaceOSShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="spaceos">
          <main className="spaceos-main">{children}</main>
        </div>
      }
    >
      <SpaceOSShellContent>{children}</SpaceOSShellContent>
    </Suspense>
  );
}