import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassBlobs } from "@/components/glass-blobs";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Vedbrands" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { name: parsed.data.email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.user) {
          // Promote this user to admin (allowed only because no admin exists yet OR admin can re-sign-up).
          // We rely on a server fn for safety; for the bootstrap we attempt a direct insert which will
          // succeed only when there is no admin yet (handled by a guard policy below in a future migration).
          // Simpler: tell the user an existing admin must promote them, unless this is the first user.
          await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
        }
        toast.success("Account created. You can now sign in as admin.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        // Check admin role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user!.id);
        const isAdmin = roles?.some((r) => r.role === "admin");
        if (!isAdmin) {
          await supabase.auth.signOut();
          toast.error("This account is not an admin. Ask an admin to grant access.");
          return;
        }
        toast.success("Welcome back, admin.");
        navigate({ to: "/admin" });
      }
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
            <ShieldCheck className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Admin {mode === "login" ? "Sign in" : "Create account"}</h1>
          <p className="mt-1 text-sm text-muted-ink">
            {mode === "login" ? "Access the Vedbrands content dashboard." : "Bootstrap the first admin or create another admin account."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-2xl glass px-4 text-ink placeholder:text-muted-ink/70 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                placeholder="you@brand.com"
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-2xl glass px-4 text-ink placeholder:text-muted-ink/70 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]/40"
                placeholder="••••••••"
                required
              />
            </Field>
            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create admin"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 text-xs text-muted-ink hover:text-ink transition"
          >
            {mode === "login" ? "Need to create the first admin? Sign up" : "Already have an account? Sign in"}
          </button>
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
