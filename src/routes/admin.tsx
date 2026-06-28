import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GlassBlobs } from "@/components/glass-blobs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, clearGuestName } from "@/lib/use-auth";
import { toast } from "sonner";
import {
  Users, UserCircle2, Eye, Star, LogOut, Settings as SettingsIcon,
  Pin, Trash2, Plus, Save, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Vedbrands" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const { loading, user, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/admin-login", replace: true });
    else if (!isAdmin) navigate({ to: "/home", replace: true });
  }, [loading, user, isAdmin, navigate]);

  const qc = useQueryClient();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    clearGuestName();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-dvh grid place-items-center">
        <p className="text-sm text-muted-ink">Loading…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh">
      <GlassBlobs />
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-ink hover:text-ink transition">
            <ArrowLeft className="h-4 w-4" /> View site
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-muted-ink">{user.email}</span>
            <button onClick={signOut} className="inline-flex h-10 items-center gap-2 rounded-full glass px-4 text-sm font-medium text-ink hover:bg-white/70 transition">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mt-2">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-ink">Manage content, reviews, and site settings.</p>
        </div>

        <Overview />
        <UsersAndGuests />
        <ReviewsManager />
        <SettingsManager />
      </main>
    </div>
  );
}

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [profiles, guests, visitsTotal, visitsToday, reviews] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("guests").select("*", { count: "exact", head: true }),
        supabase.from("site_visits").select("*", { count: "exact", head: true }),
        supabase.from("site_visits").select("*", { count: "exact", head: true }).gte("visited_at", startOfDay.toISOString()),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
      ]);
      return {
        users: profiles.count ?? 0,
        guests: guests.count ?? 0,
        visitsTotal: visitsTotal.count ?? 0,
        visitsToday: visitsToday.count ?? 0,
        reviews: reviews.count ?? 0,
      };
    },
  });
  const cards = [
    { Icon: Eye, label: "Visits today", value: data?.visitsToday ?? "—" },
    { Icon: Eye, label: "Visits all time", value: data?.visitsTotal ?? "—" },
    { Icon: Users, label: "Registered users", value: data?.users ?? "—" },
    { Icon: UserCircle2, label: "Guests", value: data?.guests ?? "—" },
    { Icon: Star, label: "Reviews", value: data?.reviews ?? "—" },
  ];
  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl glass p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl glass-strong">
              <c.Icon className="h-4 w-4" style={{ color: "var(--accent-blue)" }} />
            </div>
            <div className="mt-4 font-display text-3xl ink-gradient">{c.value}</div>
            <div className="text-xs text-muted-ink">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function UsersAndGuests() {
  const { data: users } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, name, email, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: guests } = useQuery({
    queryKey: ["admin", "guests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("id, name, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  return (
    <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Panel title="Users" desc="People who signed in with email">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-ink">
            <tr><th className="py-2">Name</th><th>Email</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t border-white/40">
                <td className="py-2 text-ink">{u.name}</td>
                <td className="text-muted-ink">{u.email}</td>
                <td className="text-muted-ink">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!users?.length && <tr><td colSpan={3} className="py-4 text-muted-ink">No users yet.</td></tr>}
          </tbody>
        </table>
      </Panel>
      <Panel title="Guests" desc="Visitors who entered with just a name">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-ink">
            <tr><th className="py-2">Name</th><th>When</th></tr>
          </thead>
          <tbody>
            {guests?.map((g) => (
              <tr key={g.id} className="border-t border-white/40">
                <td className="py-2 text-ink">{g.name}</td>
                <td className="text-muted-ink">{new Date(g.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {!guests?.length && <tr><td colSpan={2} className="py-4 text-muted-ink">No guests yet.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </section>
  );
}

function ReviewsManager() {
  const qc = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [form, setForm] = useState({ author_name: "", author_role: "", rating: 5, content: "" });
  async function addReview(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("reviews").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Review added");
    setForm({ author_name: "", author_role: "", rating: 5, content: "" });
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  }
  async function togglePin(id: string, pinned: boolean) {
    await supabase.from("reviews").update({ pinned: !pinned }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  }
  async function del(id: string) {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  }
  return (
    <section className="mt-10">
      <Panel title="Reviews" desc="Add, pin, or remove customer reviews">
        <form onSubmit={addReview} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input className="h-11 rounded-2xl glass px-4 text-sm" placeholder="Author name" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} required />
          <input className="h-11 rounded-2xl glass px-4 text-sm" placeholder="Author role (optional)" value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} />
          <textarea className="rounded-2xl glass px-4 py-3 text-sm sm:col-span-2" placeholder="Review content" rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <div className="flex items-center gap-3 sm:col-span-2">
            <label className="text-xs text-muted-ink">Rating</label>
            <input type="number" min={1} max={5} className="h-10 w-20 rounded-2xl glass px-3 text-sm" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            <button className="ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>
          </div>
        </form>
        <ul className="mt-6 space-y-2">
          {reviews?.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 rounded-2xl glass-subtle p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">{r.author_name}</span>
                  {r.author_role && <span className="text-xs text-muted-ink">· {r.author_role}</span>}
                  <span className="text-xs text-muted-ink">· {r.rating}★</span>
                  {r.pinned && <span className="text-xs text-gradient">· Pinned</span>}
                </div>
                <p className="mt-1 text-sm text-muted-ink line-clamp-2">{r.content}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => togglePin(r.id, r.pinned)} className="inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:bg-white/70" title="Pin"><Pin className="h-4 w-4" /></button>
                <button onClick={() => del(r.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:bg-white/70" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}

function SettingsManager() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value").order("key");
      if (error) throw error;
      return data;
    },
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function save(key: string) {
    const raw = drafts[key];
    if (raw == null) return;
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      return toast.error("Invalid JSON for " + key);
    }
    const { error } = await supabase.from("site_settings").update({ value }).eq("key", key);
    if (error) return toast.error(error.message);
    toast.success(`Saved ${key}`);
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    qc.invalidateQueries({ queryKey: ["settings"] });
  }

  return (
    <section className="mt-10">
      <Panel title="Site Settings" desc="Edit brand, hero, contact info and more (JSON)">
        <div className="space-y-3">
          {rows?.map((r) => {
            const value = drafts[r.key] ?? JSON.stringify(r.value, null, 2);
            return (
              <div key={r.key} className="rounded-2xl glass-subtle p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <SettingsIcon className="h-4 w-4" /> {r.key}
                  </div>
                  <button onClick={() => save(r.key)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground">
                    <Save className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={value}
                  onChange={(e) => setDrafts({ ...drafts, [r.key]: e.target.value })}
                  className="mt-3 w-full rounded-2xl glass px-4 py-3 font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                />
              </div>
            );
          })}
        </div>
      </Panel>
    </section>
  );
}

function Panel({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl glass-strong p-6 sm:p-7 overflow-hidden">
      <div className="mb-4">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {desc && <p className="text-xs text-muted-ink">{desc}</p>}
      </div>
      <div className="overflow-auto">{children}</div>
    </div>
  );
}
