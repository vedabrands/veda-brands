import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";
import { Phone, Mail, MessageCircle, MapPin, Clock, Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect — Veda Brands" },
      { name: "description", content: "Call, email, WhatsApp or visit Veda Brands." },
      { property: "og:url", content: "/connect" },
    ],
    links: [{ rel: "canonical", href: "/connect" }],
  }),
  component: Connect,
});

type Contact = { phone?: string; email?: string; whatsapp?: string; address?: string; hours?: string };

function Connect() {
  const { data } = useQuery({
    queryKey: ["settings", "contact"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "contact").maybeSingle();
      return (data?.value ?? {}) as Contact;
    },
  });
  const c = data ?? {};
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Connect" title="One tap, many ways to reach us." />
      </section>
      <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Action href={`tel:${(c.phone ?? "").replace(/\s/g, "")}`} Icon={Phone} title="Call us" value={c.phone ?? "+91 8368124957"} />
          <Action href={`mailto:${c.email ?? "vedabrandssupport@gmail.com"}`} Icon={Mail} title="Email" value={c.email ?? "vedabrandssupport@gmail.com"} />
          <Action href={`https://wa.me/${(c.whatsapp ?? "+918368124957").replace(/[^0-9]/g, "")}`} Icon={MessageCircle} title="WhatsApp" value="Chat with us" />
          <Action Icon={MapPin} title="Location" value={c.address ?? "India"} />
          <Action Icon={Clock} title="Business Hours" value={c.hours ?? "Mon–Sat, 10am – 7pm IST"} />
          <Action Icon={Instagram} title="Instagram" value="Coming soon" />
        </div>
        <div className="mt-6 overflow-hidden rounded-3xl glass">
          <div className="h-56 w-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center text-xs text-muted-ink">
            Google Maps embed (admin editable)
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Action({ Icon, title, value, href }: { Icon: typeof Phone; title: string; value: string; href?: string }) {
  const Tag: any = href ? "a" : "div";
  return (
    <Tag
      {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" } : {})}
      className="flex items-start gap-4 rounded-3xl glass p-5 hover-float hover:[transform:translateY(-4px)] hover:[box-shadow:var(--glass-shadow-lg)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl glass-strong">
        <Icon className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
      </div>
      <div>
        <div className="text-xs text-muted-ink">{title}</div>
        <div className="text-sm font-medium text-ink">{value}</div>
      </div>
    </Tag>
  );
}
