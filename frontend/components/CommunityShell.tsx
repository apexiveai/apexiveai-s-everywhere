"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Activity,
  CreditCard,
  LogIn,
  LogOut,
  ShieldCheck,
  BriefcaseBusiness,
  ChevronDown,
} from "lucide-react";

type NavLinkItem = {
  label: string;
  href: string;
};

type NavGroupItem = {
  label: string;
  items: NavLinkItem[];
};

type NavigationItem = NavLinkItem | NavGroupItem;

const mainNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Explore",
    items: [
      { label: "Forums", href: "/forums" },
      { label: "Articles", href: "/articles" },
      { label: "Projects", href: "/projects" },
      { label: "Auctions", href: "/auctions" },
      { label: "Security", href: "/security" },
    ],
  },
  { label: "Resources", href: "/resources" },
  { label: "Clone Detector", href: "/clone-detector" },
  { label: "Search", href: "/search" },
  { label: "My Products", href: "/workspace" },
  { label: "Invoices", href: "/billing" },
  { label: "Messages", href: "/messages" },
  { label: "Notifications", href: "/notifications" },
  { label: "History", href: "/history" },
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);

  useEffect(() => {
    void Promise.resolve().then(() => {
      const token = localStorage.getItem("apexive_token");
      const userText = localStorage.getItem("apexive_user");
      setSignedIn(Boolean(token));
      if (userText) {
        try {
          const user = JSON.parse(userText) as { role?: string };
          setSuperAdmin(user.role === "SUPER_ADMIN");
        } catch {
          localStorage.removeItem("apexive_user");
        }
      }
    });
  }, [pathname]);

  if (pathname === "/") {
    return children;
  }

  return (
    <div className="ac-app">
      <header className="ac-global-header">
        <Link href="/dashboard" className="ac-global-brand" onClick={() => setMenuOpen(false)}>
          <span className="ac-brand-mark"><span>A</span><i /></span>
          <span className="ac-brand-copy"><strong>APEXIVE</strong><small>AI COMMUNITY</small></span>
        </Link>
        <button
          className="ac-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <nav className={`ac-global-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {mainNavigation.map((item) => {
            if ("items" in item) {
              const active = item.items.some((link) =>
                isActivePath(pathname, link.href),
              );
              return (
                <details
                  className="ac-global-menu"
                  key={`${item.label}-${pathname}`}
                >
                  <summary className={`ac-global-link${active ? " is-active" : ""}`}>
                    {item.label}
                    <ChevronDown size={13} />
                  </summary>
                  <div className="ac-global-menu-items">
                    {item.items.map((link) => {
                      const linkActive = isActivePath(pathname, link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`ac-global-menu-item${linkActive ? " is-active" : ""}`}
                          aria-current={linkActive ? "page" : undefined}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              );
            }

            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`ac-global-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ac-header-account">
          {superAdmin && <Link href="/admin" className="ac-header-action"><BriefcaseBusiness size={15} /> Admin</Link>}
          {signedIn ? (
            <button
              type="button"
              className="ac-header-action"
              onClick={() => {
                localStorage.removeItem("apexive_token");
                localStorage.removeItem("apexive_user");
                setSignedIn(false);
                setSuperAdmin(false);
                router.replace("/");
              }}
            >
              <LogOut size={15} /> Sign out
            </button>
          ) : (
            <Link href="/login" className="ac-header-action"><LogIn size={15} /> Sign in</Link>
          )}
        </div>
      </header>

      <div className="ac-main">
        <div className="ac-page-content">{children}</div>
        <footer className="ac-footer">
          <div className="ac-footer-copy">
            <Image
              src="/copyright-bhone-htet-naing.png"
              alt="Copyright — Bhone Htet Naing. All rights reserved."
              width={144}
              height={96}
              className="ac-copyright-art"
            />
            <span>© Bhone Htet Naing · All rights reserved</span>
          </div>
          <span>A GLOBAL COMMUNITY FOR BUILDERS</span>
          <span className="ac-footer-online"><Activity size={12} /> All systems operational</span>
          <span className="ac-footer-links">
            <Link href="/billing"><CreditCard size={13} /> Billing</Link>
            <Link href="/workspace"><ShieldCheck size={13} /> My products</Link>
          </span>
        </footer>
      </div>
    </div>
  );
}