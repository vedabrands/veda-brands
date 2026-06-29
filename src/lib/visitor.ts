import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VISIT_KEY = "veda-brands:visit_logged_at";

/** Logs an anonymous visit at most once per 30 minutes per browser. */
export function useLogVisit() {
  useEffect(() => {
    try {
      const last = Number(window.localStorage.getItem(VISIT_KEY) || 0);
      if (Date.now() - last < 30 * 60 * 1000) return;
      window.localStorage.setItem(VISIT_KEY, String(Date.now()));
    } catch {}
    supabase.from("site_visits").insert({}).then(() => {});
  }, []);
}
