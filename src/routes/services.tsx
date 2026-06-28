import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Vedbrands" },
      { name: "description", content: "Brand identity, website design, social media marketing, SEO, performance marketing and growth consulting." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const groups = [
  {
    title: "Website Design",
    items: ["Landing Pages", "Business Websites", "E-Commerce Websites", "Portfolio Websites"],
  },
  {
    title: "Social Media Marketing",
    items: ["Instagram", "X / Twitter", "Telegram", "Facebook", "LinkedIn", "YouTube"],
  },
  {
    title: "Search & Growth",
    items: ["Google SEO", "Google Ranking", "Performance Marketing", "Business Growth Consultation"],
  },
  {
    title: "Brand & UX",
    items: ["Brand Identity", "Logo Design", "Brand Guidelines", "UI/UX Design", "Digital Branding"],
  },
];

function Services() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Services" title="A full stack for modern brand growth." />
        <p className="mt-5 max-w-2xl text-base text-muted-ink sm:text-lg">
          We work end-to-end — from positioning and identity, to launch, to ongoing growth.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="rounded-3xl glass p-7 hover-float hover:[transform:translateY(-4px)]">
              <h3 className="font-display text-2xl text-ink">{g.title}</h3>
              <ul className="mt-4 space-y-2">
                {g.items.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-ink">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-blue)" }} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="rounded-[28px] glass-strong p-8 sm:p-12 text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Need a custom scope?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-ink">Tell us your goals — we'll send a tailored proposal in 48 hours.</p>
          <Link to="/connect" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
