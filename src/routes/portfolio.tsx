import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Vedbrands" },
      { name: "description", content: "Selected work across brand identity, websites, and growth campaigns." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

const items = [
  { t: "Lumen Co.", c: "Brand identity", h: "from-blue-200 to-violet-200" },
  { t: "Northwind", c: "Website + SEO", h: "from-sky-200 to-blue-200" },
  { t: "Fable Studios", c: "Launch campaign", h: "from-violet-200 to-pink-200" },
  { t: "Avani Beauty", c: "E-commerce", h: "from-pink-200 to-orange-200" },
  { t: "Helix Health", c: "Identity + UX", h: "from-teal-200 to-blue-200" },
  { t: "Forma Living", c: "Brand system", h: "from-indigo-200 to-blue-200" },
];

function Portfolio() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Portfolio" title="Selected work." />
      </section>
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article key={p.t} className="group overflow-hidden rounded-3xl glass hover-float hover:[transform:translateY(-6px)] hover:[box-shadow:var(--glass-shadow-lg)]">
              <div className={`h-48 bg-gradient-to-br ${p.h} transition-transform duration-700 group-hover:scale-105`} />
              <div className="p-5">
                <h3 className="font-display text-xl text-ink">{p.t}</h3>
                <p className="text-xs text-muted-ink">{p.c}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
