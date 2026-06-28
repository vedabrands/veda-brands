import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SectionHeading } from "./home";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vedbrands" },
      { name: "description", content: "Get in touch with the Vedbrands team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(5).max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    toast.success("Message received. We'll reply within 24 hours.");
    setForm({ name: "", email: "", phone: "", message: "" });
  }
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-16">
        <SectionHeading eyebrow="Contact" title="Let's start a conversation." />
      </section>
      <section className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-3xl glass-strong p-7 space-y-3">
          <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40" required /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40" required /></Field>
          <Field label="Phone (optional)"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40" /></Field>
          <Field label="Message"><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-2xl glass px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40" required /></Field>
          <button className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground hover:opacity-90 transition">Send message</button>
        </form>
        <aside className="space-y-4">
          <InfoCard Icon={Mail} title="Email" content="vedabrandssupport@gmail.com" />
          <InfoCard Icon={Phone} title="Phone" content="+91 8368124957" />
          <InfoCard Icon={MapPin} title="Location" content="India · Working with clients worldwide" />
          <div className="overflow-hidden rounded-3xl glass">
            <div className="h-48 w-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center text-xs text-muted-ink">
              Google Maps embed (admin editable)
            </div>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-ink">{label}</span>{children}</label>;
}
function InfoCard({ Icon, title, content }: { Icon: typeof Mail; title: string; content: string }) {
  return (
    <div className="rounded-3xl glass p-5 flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl glass-strong">
        <Icon className="h-4 w-4" style={{ color: "var(--accent-blue)" }} />
      </div>
      <div>
        <div className="text-xs text-muted-ink">{title}</div>
        <div className="text-sm font-medium text-ink">{content}</div>
      </div>
    </div>
  );
}
