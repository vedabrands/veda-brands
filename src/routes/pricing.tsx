import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Vedbrands" },
      { name: "description", content: "Transparent pricing for branding, websites and ongoing growth retainers." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

const plans = [
  { name: "Launch", price: "₹85k", desc: "For new brands needing identity + a clean website.", features: ["Brand identity essentials", "5-page website", "Basic SEO setup", "2 weeks turnaround"] },
  { name: "Grow", price: "₹2.4L", desc: "For growing companies investing in brand + marketing.", features: ["Full brand system", "10-page website", "SEO + content plan", "Social setup", "Monthly review"], featured: true },
  { name: "Scale", price: "Custom", desc: "For teams who need a senior partner across surfaces.", features: ["Brand + UX + growth", "Custom roadmap", "Senior team weekly", "Dedicated support"] },
];

function Pricing() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Pricing" title="Simple, honest pricing." />
      </section>
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-7 ${p.featured ? "glass-strong ring-soft" : "glass"}`}
            >
              <h3 className="font-display text-2xl text-ink">{p.name}</h3>
              <div className="mt-2 font-display text-4xl ink-gradient">{p.price}</div>
              <p className="mt-3 text-sm text-muted-ink">{p.desc}</p>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-blue)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/connect" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">
                Start <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
