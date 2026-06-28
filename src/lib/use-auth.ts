import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  guestName: string | null;
}

const GUEST_KEY = "vedbrands:guest_name";

export function getGuestName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(GUEST_KEY);
  } catch {
    return null;
  }
}

export function setGuestName(name: string) {
  try {
    window.localStorage.setItem(GUEST_KEY, name);
  } catch {}
}

export function clearGuestName() {
  try {
    window.localStorage.removeItem(GUEST_KEY);
  } catch {}
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    user: null,
    isAdmin: false,
    guestName: null,
  });

  useEffect(() => {
    let mounted = true;

    async function loadRoles(user: User | null) {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      return !!data?.some((r) => r.role === "admin");
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const isAdmin = await loadRoles(data.session?.user ?? null);
      if (!mounted) return;
      setState({
        loading: false,
        session: data.session,
        user: data.session?.user ?? null,
        isAdmin,
        guestName: getGuestName(),
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isAdmin = await loadRoles(session?.user ?? null);
      if (!mounted) return;
      setState({
        loading: false,
        session,
        user: session?.user ?? null,
        isAdmin,
        guestName: getGuestName(),
      });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
