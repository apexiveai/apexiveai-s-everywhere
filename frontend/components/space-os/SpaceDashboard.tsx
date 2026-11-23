"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Database,
  Globe2,
  Orbit,
  RadioTower,
  Satellite,
  ShieldCheck,
  Signal,
  Sparkles,
} from "lucide-react";
import {
  SPACE_ACTIVITY,
  SPACE_METRICS,
  SPACE_MODULES,
} from "../../lib/space-os";

const metricIcons = [
  Satellite,
  RadioTower,
  Orbit,
  Database,
];

const quickActions = [
  { title: "Register Satellite", detail: "Add a new satellite asset", href: "/space-os/satellite-fleet", icon: Satellite },
  { title: "Ground Stations", detail: "Manage station facilities", href: "/space-os/ground-stations", icon: RadioTower },
  { title: "Create Mission", detail: "Open mission workspace", href: "/space-os/missions", icon: Orbit },
];

export default function SpaceDashboard() {
  return (
    <>
      <section className="spaceos-hero">
        <div className="spaceos-hero-content">
          <div className="spaceos-eyebrow">
            <span className="spaceos-eyebrow-line" />
            APEXIVEAI · SPACE INFRASTRUCTURE
          </div>
          <h1>
            Space Operations
            <br />
            <span>Command Center</span>
          </h1>
          <p>
            A unified workspace for managing satellite assets, ground
            infrastructure, missions and civilian space data programmes.
          </p>
          <div className="spaceos-hero-actions">
            <Link href="/space-os/satellite-fleet" className="spaceos-primary-button">
              Explore Space Assets <ArrowRight size={16} />
            </Link>
            <Link href="/space-os/missions" className="spaceos-secondary-button">
              Mission Workspace
            </Link>
          </div>
        </div>

        <div className="spaceos-orbit-visual" aria-hidden="true">
          <div className="spaceos-orbit-ring ring-one" />
          <div className="spaceos-orbit-ring ring-two" />
          <div className="spaceos-orbit-ring ring-three" />
          <div className="spaceos-orbit-core">
            <Globe2 size={76} strokeWidth={0.8} />
          </div>
          <span className="orbit-point point-one" />
          <span className="orbit-point point-two" />
          <span className="orbit-point point-three" />
          <span className="orbit-label label-one">ORBITAL ASSETS</span>
          <span className="orbit-label label-two">MISSION NETWORK</span>
        </div>

        <div className="spaceos-hero-bottom">
          <span><i /> PLATFORM ENVIRONMENT</span>
          <span>DEMO DATA · NOT LIVE SATELLITE TELEMETRY</span>
        </div>
      </section>

      <section className="spaceos-section">
        <div className="spaceos-section-heading">
          <div>
            <span className="spaceos-section-kicker">SYSTEM OVERVIEW</span>
            <h2>Infrastructure at a glance</h2>
            <p>Centralized visibility across your space infrastructure portfolio.</p>
          </div>
          <span className="spaceos-updated"><Activity size={14} /> DEMO ENVIRONMENT</span>
        </div>

        <div className="spaceos-metrics">
          {SPACE_METRICS.map((metric, index) => {
            const Icon = metricIcons[index];
            return (
              <article className="spaceos-metric-card" key={metric.label}>
                <div className="spaceos-metric-top">
                  <span>{metric.label}</span>
                  <span className="spaceos-metric-icon"><Icon size={19} /></span>
                </div>
                <strong>{metric.value}</strong>
                <small>{metric.change}</small>
                <div className="spaceos-metric-line"><i style={{ width: `${68 + index * 7}%` }} /></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="spaceos-dashboard-grid">
        <div className="spaceos-panel spaceos-module-panel">
          <div className="spaceos-panel-heading">
            <div>
              <span className="spaceos-section-kicker">WORKSPACE DIRECTORY</span>
              <h2>Space OS modules</h2>
            </div>
            <span className="spaceos-count-pill">12 MODULES</span>
          </div>

          <div className="spaceos-module-grid">
            {SPACE_MODULES.map((module, index) => (
              <Link
                href={`/space-os/${module.slug}`}
                className={`spaceos-module-card accent-${module.accent}`}
                key={module.slug}
              >
                <span className="spaceos-module-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="spaceos-module-arrow"><ArrowUpRight size={16} /></span>
                <strong>{module.shortName}</strong>
                <small>{module.category}</small>
                <span className={`spaceos-module-status ${module.status === "Operational" ? "ready" : ""}`}>
                  <i /> {module.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="spaceos-side-column">
          <div className="spaceos-panel">
            <div className="spaceos-panel-heading">
              <div>
                <span className="spaceos-section-kicker">QUICK ACCESS</span>
                <h2>Workspace actions</h2>
              </div>
              <Sparkles size={18} className="spaceos-muted-icon" />
            </div>
            <div className="spaceos-quick-actions">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link href={action.href} key={action.title}>
                    <span className="spaceos-quick-icon"><Icon size={18} /></span>
                    <span><strong>{action.title}</strong><small>{action.detail}</small></span>
                    <ArrowUpRight size={16} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="spaceos-panel spaceos-activity-panel">
            <div className="spaceos-panel-heading">
              <div>
                <span className="spaceos-section-kicker">WORKSPACE HISTORY</span>
                <h2>Recent activity</h2>
              </div>
              <Activity size={18} className="spaceos-muted-icon" />
            </div>
            <div className="spaceos-activity-list">
              {SPACE_ACTIVITY.map((activity) => (
                <div className="spaceos-activity-item" key={activity.title}>
                  <span className="spaceos-activity-dot" />
                  <div>
                    <strong>{activity.title}</strong>
                    <small>{activity.detail}</small>
                    <time>{activity.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="spaceos-security-note">
            <ShieldCheck size={20} />
            <div>
              <strong>Governance-ready foundation</strong>
              <p>Designed for tenant-aware access, auditability and responsible civilian data management.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="spaceos-bottom-strip">
        <div><Signal size={17} /><span>SPACE OS WORKSPACE</span></div>
        <span>12 MODULES · UNIFIED PLATFORM</span>
        <span>PREVIEW ENVIRONMENT <ArrowUpRight size={14} /></span>
      </section>
    </>
  );
}