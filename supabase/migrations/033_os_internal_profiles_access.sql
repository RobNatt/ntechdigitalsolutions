-- Internal team can list and update profiles (workspace admin UI in dashboard settings).

DROP POLICY IF EXISTS "profiles_select_os_internal" ON public.profiles;
CREATE POLICY "profiles_select_os_internal" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_os_internal());

DROP POLICY IF EXISTS "profiles_update_os_internal" ON public.profiles;
CREATE POLICY "profiles_update_os_internal" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());
