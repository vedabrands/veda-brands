import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassBlobs } from "@/components/glass-blobs";
import { supabase } from "@/integrations/supabase/client";
import { setGuestName } from "@/lib/use-auth";
import { Footprints, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/guest")({
  head: () => ({ meta: [{ title: "Continue as Guest — Vedbrands" }] }),
  component: GuestEntry,
});

const schema = z.object({ name: z.string().trim().min(1).max(80) });

function GuestEntry() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name });
    if (!parsed.success) { toast.error("Please enter your name"); return; }
    setBusy(true);
    try {
      await supabase.from("guests").insert({ name: parsed.data.name });
      setGuestName(parsed.data.name);
      toast.success(`Welcome, ${parsed.data.name}`);
      navigate({ to: "/home" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-dvh">
      <GlassBlobs />
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="self-start mb-6 inline-flex items-center gap-1 text-sm text-muted-ink hover:text-ink transition">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="w-full glass-strong rounded-3xl p-7 animate-fade-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass">
            <Footprints className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Continue as Guest</h1>
          <p className="mt-1 text-sm text-muted-ink">Just tell us your name. No password needed.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-ink">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                placeholder="Your name"
                required
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Enter site
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
