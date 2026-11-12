create table public.portal_self_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) between 1 and 60),
  last_name text not null check (char_length(btrim(last_name)) between 1 and 60),
  photo text check (char_length(photo) <= 100000 and photo like 'data:image/jpeg;base64,%')
);
alter table public.portal_self_profiles enable row level security;
revoke all on public.portal_self_profiles from anon, authenticated;
grant select, insert, update on public.portal_self_profiles to authenticated;
create policy "CMS users manage own profile" on public.portal_self_profiles
  for all to authenticated
  using (id = (select auth.uid()) and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'))
  with check (id = (select auth.uid()) and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'));
