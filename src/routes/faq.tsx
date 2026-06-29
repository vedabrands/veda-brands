import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Veda Brands" },
      { name: "description", content: "Common questions about working with Veda Brands." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: Faq,
});

const items = [
  { q: "What does a typical engagement look like?", a: "We start with a discovery call, then run a focused 2-week strategy sprint, followed by design and launch over 4-8 weeks depending on scope." },
  { q: "Do you work with startups?", a: "Yes — we work with seed and Series A teams as well as established brands." },
  { q: "How fast can you start?", a: "We can usually kick off within 1-2 weeks. Rush starts available." },
  { q: "Do you offer retainers?", a: "Yes, monthly retainers for ongoing brand, content and growth work." },
  { q: "Where are you based?", a: "We're headquartered in India and work with clients globally." },
];

function Faq() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="FAQs" title="Questions, answered." />
      </section>
      <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl glass p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/40 last:border-0">
                <AccordionTrigger className="px-4 py-4 text-left text-base font-medium text-ink hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-muted-ink">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
}
