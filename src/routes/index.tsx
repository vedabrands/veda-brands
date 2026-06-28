import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, User as UserIcon, Footprints, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { GlassBlobs } from "@/components/glass-blobs";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vedbrands — Welcome" },
      { name: "description", content: "Enter Vedbrands as Admin, User, or Guest." },
    ],
  }),
  component: EntryGate,
});

const options = [
  {
    to: "/admin-login" as const,
    title: "Admin Dashboard",
    description: "Manage every part of the website — content, reviews, settings, users.",
    Icon: ShieldCheck,
    tone: "from-blue-200/60 to-blue-100/40",
  },
  {
    to: "/user-login" as const,
    title: "User",
    description: "Sign in to save your details and unlock a personal experience.",
    Icon: UserIcon,
    tone: "from-violet-200/60 to-violet-100/40",
  },
  {
    to: "/guest" as const,
    title: "Guest",
    description: "Just here to look around. Tell us your name and step inside.",
    Icon: Footprints,
    tone: "from-sky-200/60 to-sky-100/40",
  },
];

function EntryGate() {
  const navigate = useNavigate();
  const { loading, user, isAdmin, guestName } = useAuth();

  // If already signed in / guest, jump straight to home
  useEffect(() => {
    if (loading) return;
    if (isAdmin) navigate({ to: "/admin", replace: true });
    else if (user || guestName) navigate({ to: "/home", replace: true });
  }, [loading, user, isAdmin, guestName, navigate]);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <GlassBlobs />
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="text-center animate-fade-up">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass-subtle px-4 py-1.5 text-xs font-medium text-muted-ink">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-blue)" }} />
            A branding studio for ambitious companies
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
            Welcome to <span className="ink-gradient">Vedbrands</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-ink sm:text-lg">
            Choose how you'd like to enter.
          </p>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          {options.map((opt, i) => (
            <Link
              key={opt.to}
              to={opt.to}
              className="group relative block rounded-3xl glass p-6 sm:p-7 hover-float hover:[transform:translateY(-8px)] hover:[box-shadow:var(--glass-shadow-lg)]"
              style={{ animation: `fade-up 700ms ${i * 120}ms cubic-bezier(0.16,1,0.3,1) both` }}
            >
              <div
                className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${opt.tone} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass-strong">
                <opt.Icon className="h-5 w-5" style={{ color: "var(--accent-blue)" }} />
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink">{opt.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-ink">{opt.description}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-muted-ink">
          We Build Brands That People Remember.
        </p>
      </div>
    </div>
  );
}
