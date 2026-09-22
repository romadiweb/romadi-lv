-- Portal users and task ownership links.

create table if not exists public.portal_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_users_email_length
    check (char_length(email) between 3 and 320 and position('@' in email) > 1),
  constraint portal_users_display_name_length
    check (display_name is null or char_length(display_name) between 1 and 120),
  constraint portal_users_role
    check (role in ('admin', 'super-admin'))
);

comment on table public.portal_users is
  'Portal-visible user directory used for task assignment and profile summaries.';
comment on column public.portal_users.role is
  'Copied from Supabase Auth app_metadata.role for display and filtering. Authorization still uses JWT app_metadata.';

create index if not exists portal_users_active_email_idx
  on public.portal_users (is_active desc, lower(email));
create index if not exists portal_users_role_idx
  on public.portal_users (role, is_active);

alter table public.portal_users enable row level security;

revoke all on table public.portal_users from anon, authenticated;
grant select, insert, update on table public.portal_users to authenticated;

create policy "portal users can read users"
  on public.portal_users for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create own user row"
  on public.portal_users for insert to authenticated
  with check (
    id = (select auth.uid())
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update own profile"
  on public.portal_users for update to authenticated
  using (
    id = (select auth.uid())
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    id = (select auth.uid())
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );

drop trigger if exists portal_users_touch_updated_at on public.portal_users;
create trigger portal_users_touch_updated_at
before update on public.portal_users
for each row execute function private.touch_updated_at();

insert into public.portal_users (id, email, display_name, role, is_active, created_at, updated_at)
select
  users.id,
  users.email,
  nullif(coalesce(users.raw_user_meta_data ->> 'full_name', users.raw_user_meta_data ->> 'name'), ''),
  users.raw_app_meta_data ->> 'role',
  true,
  coalesce(users.created_at, statement_timestamp()),
  statement_timestamp()
from auth.users
where users.email is not null
  and users.raw_app_meta_data ->> 'role' in ('admin', 'super-admin')
on conflict (id) do update
set
  email = excluded.email,
  display_name = coalesce(public.portal_users.display_name, excluded.display_name),
  role = excluded.role,
  is_active = true,
  updated_at = statement_timestamp();

alter table public.portal_tasks
  add column if not exists assigned_to_user_id uuid,
  add column if not exists created_by_user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portal_tasks_assigned_to_user_id_fkey'
      and conrelid = 'public.portal_tasks'::regclass
  ) then
    alter table public.portal_tasks
      add constraint portal_tasks_assigned_to_user_id_fkey
      foreign key (assigned_to_user_id)
      references public.portal_users (id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portal_tasks_created_by_user_id_fkey'
      and conrelid = 'public.portal_tasks'::regclass
  ) then
    alter table public.portal_tasks
      add constraint portal_tasks_created_by_user_id_fkey
      foreign key (created_by_user_id)
      references public.portal_users (id)
      on delete set null;
  end if;
end $$;

create index if not exists portal_tasks_assigned_user_status_idx
  on public.portal_tasks (assigned_to_user_id, status, priority, due_date nulls last)
  where assigned_to_user_id is not null;
create index if not exists portal_tasks_created_by_user_status_idx
  on public.portal_tasks (created_by_user_id, status, created_at desc)
  where created_by_user_id is not null;

update public.portal_tasks
set assigned_to_user_id = portal_users.id
from public.portal_users
where public.portal_tasks.assigned_to_user_id is null
  and public.portal_tasks.assigned_to is not null
  and lower(public.portal_tasks.assigned_to) = lower(portal_users.email);

update public.portal_tasks
set created_by_user_id = portal_users.id
from public.portal_users
where public.portal_tasks.created_by_user_id is null
  and public.portal_tasks.created_by is not null
  and lower(public.portal_tasks.created_by) = lower(portal_users.email);
