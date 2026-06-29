import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlassBlobs } from "@/components/glass-blobs";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Veda Brands" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPassword,
});

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  // Supabase's reset link delivers a recovery session via the URL hash.
  // The client picks it up automatically; we just wait for it.
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setValidSession(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setValidSession(!!session);
        setReady(true);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-dvh">
      <GlassBlobs />
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-12">
        <div className="w-full glass-strong rounded-3xl p-7 animate-fade-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass">
            <ShieldCheck className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Set a new password</h1>
          {!ready ? (
            <p className="mt-3 text-sm text-muted-ink">
              <Loader2 className="inline h-4 w-4 animate-spin" /> Verifying your reset link…
            </p>
          ) : !validSession ? (
            <div className="mt-3 space-y-3 text-sm text-muted-ink">
              <p>This reset link is invalid or has expired.</p>
              <Link
                to="/forgot-password"
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-ink">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                  required
                  minLength={8}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-ink">Confirm new password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                  required
                  minLength={8}
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Update password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
