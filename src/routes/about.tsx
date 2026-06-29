import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Veda Brands" },
      { name: "description", content: "Veda Brands is a small senior-led branding studio working with ambitious teams worldwide." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { t: "Taste", d: "We obsess over the small details that separate good from unforgettable." },
  { t: "Clarity", d: "Strong strategy turns brand into a tool for growth — not decoration." },
  { t: "Speed", d: "We move fast without dropping the bar. Momentum is a feature." },
];

const timeline = [
  { y: "2021", t: "Veda Brands founded" },
  { y: "2022", t: "First international clients" },
  { y: "2023", t: "Crossed 100 projects" },
  { y: "2024", t: "Senior-led team of 12" },
  { y: "2025", t: "Launched growth division" },
];

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="About" title="A senior-led studio for ambitious companies." />
        <p className="mt-5 max-w-2xl text-base text-muted-ink sm:text-lg">
          Veda Brands is a tight team of strategists, designers and marketers. We help founders, marketing leaders and operators build brands that earn attention and convert it into revenue.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-3xl glass p-7">
              <h3 className="font-display text-xl text-ink">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-ink">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Timeline" title="Our story so far." />
        <ol className="mt-10 space-y-3">
          {timeline.map((s) => (
            <li key={s.y} className="flex items-center gap-5 rounded-3xl glass px-5 py-4">
              <span className="font-display text-2xl ink-gradient w-16">{s.y}</span>
              <span className="text-sm text-ink">{s.t}</span>
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
