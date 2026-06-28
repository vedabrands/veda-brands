
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can add a guest" ON public.guests;
CREATE POLICY "Anyone can add a guest" ON public.guests FOR INSERT TO anon, authenticated
  WITH CHECK (length(trim(name)) BETWEEN 1 AND 80);

DROP POLICY IF EXISTS "Anyone can log a visit" ON public.site_visits;
CREATE POLICY "Anyone can log a visit" ON public.site_visits FOR INSERT TO anon, authenticated
  WITH CHECK (visited_at <= now() + INTERVAL '1 minute');
