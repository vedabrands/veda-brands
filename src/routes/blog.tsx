import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Veda Brands" },
      { name: "description", content: "Notes on brand, design, and growth from the Veda Brands team." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const posts = [
  { t: "The shape of a memorable brand", d: "Why simple identities outlast complex ones.", c: "Brand" },
  { t: "What conversion design actually means", d: "Beyond hero buttons: the small choices that move the needle.", c: "Design" },
  { t: "SEO without sounding like SEO", d: "How to rank without ruining your voice.", c: "Growth" },
];

function Blog() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Blog" title="Field notes from the studio." />
      </section>
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <article key={p.t} className="rounded-3xl glass p-6 hover-float hover:[transform:translateY(-4px)]">
              <span className="inline-flex items-center rounded-full glass-subtle px-3 py-1 text-xs text-muted-ink">{p.c}</span>
              <h3 className="mt-4 font-display text-xl text-ink">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-ink">{p.d}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
