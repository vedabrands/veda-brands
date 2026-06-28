import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";
import { supabase } from "@/integrations/supabase/client";
import { Quote, Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Vedbrands" },
      { name: "description", content: "What founders and marketing leaders say about working with Vedbrands." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: Reviews,
});

function Reviews() {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Reviews" title="Our wall of love." />
      </section>
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        {isLoading && <p className="text-sm text-muted-ink">Loading…</p>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((r) => (
            <article key={r.id} className="rounded-3xl glass p-6">
              <Quote className="h-5 w-5 text-muted-ink" />
              <p className="mt-3 text-sm leading-relaxed text-ink">{r.content}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">{r.author_name}</div>
                  {r.author_role && <div className="text-xs text-muted-ink">{r.author_role}</div>}
                </div>
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "var(--accent-blue)" }} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
