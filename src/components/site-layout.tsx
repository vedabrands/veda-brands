import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { GlassBlobs } from "./glass-blobs";
import { FloatingConnect } from "./floating-connect";
import { useLogVisit } from "@/lib/visitor";

export function SiteLayout({ children }: { children: ReactNode }) {
  useLogVisit();
  return (
    <div className="relative min-h-dvh">
      <GlassBlobs />
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/home" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl glass-strong">
              <span className="font-display text-lg text-gradient">V</span>
            </span>
            <span className="font-display text-xl tracking-tight text-ink">
              Vedbrands
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/connect"
              className="hidden sm:inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Start a project
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <SiteFooter />
      <FloatingConnect />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h4 className="font-display text-xl text-ink">Vedbrands</h4>
            <p className="mt-2 text-sm text-muted-ink">
              A modern branding studio for ambitious companies.
            </p>
          </div>
          <FooterCol title="Company" items={[
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            { to: "/portfolio", label: "Portfolio" },
            { to: "/pricing", label: "Pricing" },
          ]} />
          <FooterCol title="Resources" items={[
            { to: "/blog", label: "Blog" },
            { to: "/reviews", label: "Reviews" },
            { to: "/faq", label: "FAQs" },
          ]} />
          <FooterCol title="Contact" items={[
            { to: "/contact", label: "Contact" },
            { to: "/connect", label: "Connect" },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/40 pt-6 text-xs text-muted-ink sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vedbrands. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ink transition">Privacy</a>
            <a href="#" className="hover:text-ink transition">Terms</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-ink transition">
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <h5 className="text-sm font-semibold text-ink">{title}</h5>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="text-sm text-muted-ink hover:text-ink transition">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
