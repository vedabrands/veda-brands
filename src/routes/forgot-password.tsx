import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassBlobs } from "@/components/glass-blobs";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Veda Brands" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ForgotPassword,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Check your inbox for the reset link.");
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
        <Link to="/admin-login" className="self-start mb-6 inline-flex items-center gap-1 text-sm text-muted-ink hover:text-ink transition">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
        <div className="w-full glass-strong rounded-3xl p-7 animate-fade-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass">
            <KeyRound className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Forgot your password?</h1>
          <p className="mt-1 text-sm text-muted-ink">
            Enter your email and we'll send you a secure reset link.
          </p>
          {sent ? (
            <div className="mt-6 rounded-2xl glass p-5 text-sm text-ink">
              We sent a reset link to <span className="font-medium">{email}</span>. The link
              expires in 1 hour. Don't see it? Check your spam folder.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-ink">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-2xl glass px-4 text-ink placeholder:text-muted-ink/70 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                  placeholder="you@brand.com"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Send reset link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
