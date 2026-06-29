import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function FloatingConnect() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Hide on the entry gate and the connect page itself
  if (pathname === "/" || pathname === "/connect") return null;
  return (
    <Link
      to="/connect"
      aria-label="Connect with Veda Brands"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full glass-strong text-ink animate-glow-pulse hover-float hover:scale-105 transition-transform"
    >
      <Sparkles className="h-6 w-6" style={{ color: "var(--accent-blue)" }} />
      <span className="sr-only">Connect</span>
    </Link>
  );
}
