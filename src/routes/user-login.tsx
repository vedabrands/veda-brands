import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassBlobs } from "@/components/glass-blobs";
import { supabase } from "@/integrations/supabase/client";
import { User as UserIcon, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/user-login")({
  head: () => ({
    meta: [{ title: "Sign in — Veda Brands" }],
  }),
  component: UserLogin,
});

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
});

function UserLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      // Magic-link style passwordless: try signup with a random password; if exists, sign in.
      const pw = crypto.randomUUID() + "Aa1!";
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: pw,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
          data: { name: parsed.data.name },
        },
      });
      if (error && !/already/i.test(error.message)) throw error;
      // Try to sign in with same magic-style: send magic link
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: parsed.data.email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/home`,
          data: { name: parsed.data.name },
        },
      });
      if (otpError) throw otpError;
      toast.success(`Welcome, ${parsed.data.name}! Check your email to finish signing in.`);
      navigate({ to: "/home" });
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
        <Link to="/" className="self-start mb-6 inline-flex items-center gap-1 text-sm text-muted-ink hover:text-ink transition">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="w-full glass-strong rounded-3xl p-7 animate-fade-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass">
            <UserIcon className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Sign in as User</h1>
          <p className="mt-1 text-sm text-muted-ink">Tell us who you are and we'll send a secure sign-in link.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <Field label="Your name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                placeholder="Aarav Mehta"
                required
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-2xl glass px-4 text-ink focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                placeholder="you@email.com"
                required
              />
            </Field>
            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Send sign-in link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-ink">{label}</span>
      {children}
    </label>
  );
}
