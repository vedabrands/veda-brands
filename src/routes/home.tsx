import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import heroImg from "@/assets/hero.jpg";
import {
  ArrowRight, Sparkles, Globe, Megaphone, Search, Palette, BarChart3,
  Star, Quote, Award, Users, Briefcase, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Vedbrands — We Build Brands That People Remember" },
      { name: "description", content: "Brand strategy, web design, SEO, and social media marketing. Premium results for ambitious companies." },
      { property: "og:title", content: "Vedbrands — Premium branding agency" },
      { property: "og:url", content: "/home" },
    ],
    links: [{ rel: "canonical", href: "/home" }],
  }),
  component: Home,
});

function Home() {
  const { user, guestName } = useAuth();
  const welcomeName = (user?.user_metadata?.name as string) || user?.email || guestName;
  return (
    <SiteLayout>
      <Hero welcomeName={welcomeName ?? null} />
      <Stats />
      <ServicesPreview />
      <WhyUs />
      <ReviewsPreview />
      <CTA />
    </SiteLayout>
  );
}

function Hero({ welcomeName }: { welcomeName: string | null }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="relative overflow-hidden rounded-[28px] glass-strong">
        <img
          src={heroImg}
          alt=""
          width={1600}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/50 to-white/85" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 md:py-28">
          {welcomeName && (
            <div className="inline-flex items-center gap-2 rounded-full glass-subtle px-4 py-1.5 text-xs font-medium text-muted-ink animate-fade-up">
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent-blue)" }} />
              Welcome, {welcomeName}
            </div>
          )}
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl md:text-7xl animate-fade-up">
            We build brands that <span className="ink-gradient">people remember.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-ink sm:text-lg animate-fade-up">
            Brand strategy · Website design · Social media marketing · Google SEO · Digital growth.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up">
            <Link to="/connect" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/portfolio" className="inline-flex h-12 items-center rounded-full glass px-6 text-sm font-medium text-ink transition hover:bg-white/70">
              See our work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "150+", label: "Projects shipped" },
  { value: "98%", label: "Client retention" },
  { value: "12+", label: "Industries served" },
  { value: "3.4×", label: "Avg. growth in 90 days" },
];

function Stats() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl glass p-5 text-center hover-float hover:[transform:translateY(-4px)]">
            <div className="font-display text-3xl ink-gradient sm:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs text-muted-ink sm:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const servicesPreview = [
  { Icon: Globe, title: "Website Design", body: "Landing pages, business sites, e-commerce, portfolios." },
  { Icon: Megaphone, title: "Social Media", body: "Instagram, X, LinkedIn, YouTube, Facebook, Telegram." },
  { Icon: Search, title: "Google SEO", body: "Ranking, content, on-page, technical and local SEO." },
  { Icon: Palette, title: "Brand Identity", body: "Logos, guidelines, visual systems and UI/UX." },
  { Icon: BarChart3, title: "Performance Marketing", body: "Paid acquisition with creative that performs." },
  { Icon: Briefcase, title: "Growth Consultation", body: "Strategy that ties brand to revenue." },
];

function ServicesPreview() {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6">
      <SectionHeading eyebrow="Services" title="Everything your brand needs, under one roof." />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {servicesPreview.map((s) => (
          <div key={s.title} className="group rounded-3xl glass p-6 hover-float hover:[transform:translateY(-6px)] hover:[box-shadow:var(--glass-shadow-lg)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl glass-strong">
              <s.Icon className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
            </div>
            <h3 className="mt-5 font-display text-2xl text-ink">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-gradient">
          All services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const why = [
  { Icon: Award, title: "Award-grade craft", body: "Design that feels editorial, not template." },
  { Icon: Users, title: "Senior-led team", body: "You work with seniors, not handoffs." },
  { Icon: CheckCircle2, title: "Outcomes over outputs", body: "We're measured by your growth, not deliverables." },
];

function WhyUs() {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6">
      <SectionHeading eyebrow="Why Vedbrands" title="Built for companies that want to feel premium." />
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {why.map((w) => (
          <div key={w.title} className="rounded-3xl glass p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl glass-strong">
              <w.Icon className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
            </div>
            <h3 className="mt-5 font-display text-xl text-ink">{w.title}</h3>
            <p className="mt-2 text-sm text-muted-ink">{w.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsPreview() {
  const { data } = useQuery({
    queryKey: ["reviews", "pinned"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });
  if (!data?.length) return null;
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6">
      <SectionHeading eyebrow="Reviews" title="Loved by founders and marketing leaders." />
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((r) => (
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
      <div className="mt-8">
        <Link to="/reviews" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
          Read all reviews <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6">
      <div className="relative overflow-hidden rounded-[28px] glass-strong px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="font-display text-3xl text-ink sm:text-5xl">Ready to build something memorable?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-ink sm:text-base">
          Book a free consultation. We'll map a plan within 48 hours.
        </p>
        <Link to="/connect" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition hover:opacity-90">
          Get in touch <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full glass-subtle px-3 py-1 text-xs font-medium text-muted-ink">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-blue)" }} />
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-5xl">{title}</h2>
    </div>
  );
}
