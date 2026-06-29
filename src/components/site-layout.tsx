import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
              Veda Brands
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
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-2xl text-ink">Veda Brands</h4>
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

        <OurStory />

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/40 pt-6 text-xs text-muted-ink sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Veda Brands. All rights reserved.</p>
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

function OurStory() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section
      ref={ref}
      aria-labelledby="our-story-heading"
      className={`mt-12 rounded-[28px] glass-strong p-7 sm:p-10 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="inline-flex items-center gap-2 rounded-full glass-subtle px-3 py-1 text-xs font-medium text-muted-ink">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-blue)" }} />
        Our Story
      </div>
      <h3
        id="our-story-heading"
        className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl"
      >
        Built for brands that <span className="ink-gradient">people remember.</span>
      </h3>
      <div className="mt-5 grid grid-cols-1 gap-4 text-[15px] leading-relaxed text-muted-ink sm:gap-5 sm:text-base md:grid-cols-3">
        <p>
          Veda Brands was founded with a simple belief: every great business deserves a brand that
          people remember. What started as an idea to help ambitious businesses stand out has grown
          into a creative branding studio focused on strategy, design, and digital experiences.
        </p>
        <p>
          We don't just create logos or websites — we build identities that communicate trust,
          inspire confidence, and leave a lasting impression. Every project is approached with
          curiosity, creativity, and attention to detail.
        </p>
        <p>
          Whether it's launching a startup, refreshing an existing identity, or creating a complete
          digital presence, Veda Brands is committed to transforming ideas into meaningful brands
          that grow with the businesses behind them.
        </p>
      </div>
    </section>
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
