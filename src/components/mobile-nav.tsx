import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { useAuth, clearGuestName } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const links = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/reviews", label: "Reviews" },
  { to: "/faq", label: "FAQs" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/connect", label: "Connect" },
] as const;

export function MobileNav() {
  const { user, isAdmin, guestName } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await qc.cancelQueries();
    qc.clear();
    clearGuestName();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full glass hover:scale-105 transition-transform"
        >
          <Menu className="h-5 w-5 text-ink" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="glass-strong border-glass-border w-[88vw] sm:w-96 p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="font-display text-2xl">Veda Brands</SheetTitle>
          {(user || guestName) && (
            <p className="text-xs text-muted-ink">
              Welcome, {user ? (user.user_metadata?.name as string) ?? user.email : guestName}
              {isAdmin && " · Admin"}
            </p>
          )}
        </SheetHeader>
        <nav className="flex flex-col px-3 py-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition hover:bg-white/60"
              activeProps={{ className: "rounded-2xl px-4 py-3 text-base font-semibold bg-white/70 text-ink" }}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-gradient"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>
        <div className="px-6 pb-6">
          {(user || guestName) && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-full glass px-4 py-3 text-sm font-medium text-ink hover:bg-white/70 transition"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
