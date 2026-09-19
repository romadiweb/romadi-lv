-- Portal CMS security foundation.
--
-- Application roles live only in auth.users.raw_app_meta_data and are read from
-- the signed JWT's app_metadata claim. Never authorize from user_metadata.

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table private.portal_login_limits (
  rate_key text primary key,
  attempts integer not null default 0,
  window_started_at timestamptz not null default clock_timestamp(),
  blocked_until timestamptz,
  updated_at timestamptz not null default clock_timestamp(),
  constraint portal_login_limits_attempts_nonnegative check (attempts >= 0),
  constraint portal_login_limits_rate_key_sha256 check (rate_key ~ '^[a-f0-9]{64}$')
);

comment on table private.portal_login_limits is
  'Server-only, hashed login attempt counters. Raw emails and IP addresses are never stored.';

create or replace function public.consume_portal_login_attempt(
  p_rate_key text,
  p_max_attempts integer default 5,
  p_window_seconds integer default 900,
  p_block_seconds integer default 900
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_entry private.portal_login_limits%rowtype;
begin
  if p_rate_key !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid rate limit key';
  end if;

  if p_max_attempts < 1 or p_window_seconds < 1 or p_block_seconds < 1 then
    raise exception 'Invalid rate limit configuration';
  end if;

  select *
    into v_entry
    from private.portal_login_limits
   where rate_key = p_rate_key
   for update;

  if not found then
    insert into private.portal_login_limits (rate_key, attempts, window_started_at, updated_at)
    values (p_rate_key, 1, v_now, v_now)
    returning * into v_entry;

    allowed := true;
    retry_after_seconds := 0;
    return next;
    return;
  end if;

  if v_entry.blocked_until is not null and v_entry.blocked_until > v_now then
    allowed := false;
    retry_after_seconds := greatest(
      1,
      ceil(extract(epoch from (v_entry.blocked_until - v_now)))::integer
    );
    return next;
    return;
  end if;

  if v_entry.window_started_at <= v_now - make_interval(secs => p_window_seconds) then
    v_entry.attempts := 1;
    v_entry.window_started_at := v_now;
    v_entry.blocked_until := null;
  else
    v_entry.attempts := v_entry.attempts + 1;
  end if;

  if v_entry.attempts > p_max_attempts then
    v_entry.blocked_until := v_now + make_interval(secs => p_block_seconds);
  end if;

  update private.portal_login_limits
     set attempts = v_entry.attempts,
         window_started_at = v_entry.window_started_at,
         blocked_until = v_entry.blocked_until,
         updated_at = v_now
   where rate_key = p_rate_key;

  allowed := v_entry.blocked_until is null;
  retry_after_seconds := case
    when v_entry.blocked_until is null then 0
    else greatest(1, ceil(extract(epoch from (v_entry.blocked_until - v_now)))::integer)
  end;
  return next;
end;
$$;

create or replace function public.reset_portal_login_attempts(p_rate_key text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from private.portal_login_limits where rate_key = p_rate_key;
$$;

revoke all on function public.consume_portal_login_attempt(text, integer, integer, integer)
  from public, anon, authenticated;
revoke all on function public.reset_portal_login_attempts(text)
  from public, anon, authenticated;
grant execute on function public.consume_portal_login_attempt(text, integer, integer, integer)
  to service_role;
grant execute on function public.reset_portal_login_attempts(text)
  to service_role;

create table public.cms_audit_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id bigint,
  operation text not null,
  actor_id uuid,
  actor_role text,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamptz not null default clock_timestamp(),
  constraint cms_audit_log_table_name check (
    table_name in ('projects', 'pricing_plans', 'reviews')
  ),
  constraint cms_audit_log_operation check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  constraint cms_audit_log_actor_role check (
    actor_role is null or actor_role in ('admin', 'super-admin', 'service_role')
  )
);

comment on table public.cms_audit_log is
  'Append-only audit history written by database triggers for all CMS content changes.';

create index cms_audit_log_changed_at_idx
  on public.cms_audit_log (changed_at desc);
create index cms_audit_log_actor_id_changed_at_idx
  on public.cms_audit_log (actor_id, changed_at desc);
create index cms_audit_log_record_idx
  on public.cms_audit_log (table_name, record_id, changed_at desc);

alter table public.cms_audit_log enable row level security;

revoke all on table public.cms_audit_log from anon, authenticated;
grant select on table public.cms_audit_log to authenticated;

create policy "super admins can read the cms audit log"
  on public.cms_audit_log
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

create or replace function private.log_cms_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb;
  v_new jsonb;
  v_actor_role text;
  v_record_id bigint;
begin
  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
  elsif tg_op = 'UPDATE' then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
  else
    v_old := to_jsonb(old);
  end if;

  v_actor_role := coalesce(
    (select auth.jwt()) -> 'app_metadata' ->> 'role',
    case when (select auth.role()) = 'service_role' then 'service_role' end
  );
  v_record_id := coalesce((v_new ->> 'id')::bigint, (v_old ->> 'id')::bigint);

  insert into public.cms_audit_log (
    table_name,
    record_id,
    operation,
    actor_id,
    actor_role,
    old_data,
    new_data
  )
  values (
    tg_table_name,
    v_record_id,
    tg_op,
    (select auth.uid()),
    v_actor_role,
    v_old,
    v_new
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := statement_timestamp();
  return new;
end;
$$;

revoke all on function private.log_cms_change() from public, anon, authenticated;
revoke all on function private.touch_updated_at() from public, anon, authenticated;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
before update on public.projects
for each row execute function private.touch_updated_at();

drop trigger if exists pricing_plans_touch_updated_at on public.pricing_plans;
create trigger pricing_plans_touch_updated_at
before update on public.pricing_plans
for each row execute function private.touch_updated_at();

drop trigger if exists reviews_touch_updated_at on public.reviews;
create trigger reviews_touch_updated_at
before update on public.reviews
for each row execute function private.touch_updated_at();

drop trigger if exists projects_audit_change on public.projects;
create trigger projects_audit_change
after insert or update or delete on public.projects
for each row execute function private.log_cms_change();

drop trigger if exists pricing_plans_audit_change on public.pricing_plans;
create trigger pricing_plans_audit_change
after insert or update or delete on public.pricing_plans
for each row execute function private.log_cms_change();

drop trigger if exists reviews_audit_change on public.reviews;
create trigger reviews_audit_change
after insert or update or delete on public.reviews
for each row execute function private.log_cms_change();

-- Replace public-only policies with role-aware CMS policies. The role is read
-- exclusively from the signed app_metadata claim.
drop policy if exists "published projects are publicly readable" on public.projects;
drop policy if exists "published pricing plans are publicly readable" on public.pricing_plans;
drop policy if exists "published reviews are publicly readable" on public.reviews;

revoke all on table public.projects, public.pricing_plans, public.reviews
  from anon, authenticated;
grant select on table public.projects, public.pricing_plans, public.reviews to anon;
grant select, insert, update, delete
  on table public.projects, public.pricing_plans, public.reviews
  to authenticated;
grant usage, select
  on sequence public.projects_id_seq, public.pricing_plans_id_seq, public.reviews_id_seq
  to authenticated;

create policy "published projects are publicly readable"
  on public.projects for select to anon
  using (is_published = true);
create policy "cms users can read projects"
  on public.projects for select to authenticated
  using (
    is_published = true
    or (
      (select auth.uid()) is not null
      and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
    )
  );
create policy "cms users can create projects"
  on public.projects for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "cms users can update projects"
  on public.projects for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete projects"
  on public.projects for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

create policy "published pricing plans are publicly readable"
  on public.pricing_plans for select to anon
  using (is_published = true);
create policy "cms users can read pricing plans"
  on public.pricing_plans for select to authenticated
  using (
    is_published = true
    or (
      (select auth.uid()) is not null
      and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
    )
  );
create policy "cms users can create pricing plans"
  on public.pricing_plans for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "cms users can update pricing plans"
  on public.pricing_plans for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete pricing plans"
  on public.pricing_plans for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

create policy "published reviews are publicly readable"
  on public.reviews for select to anon
  using (is_published = true);
create policy "cms users can read reviews"
  on public.reviews for select to authenticated
  using (
    is_published = true
    or (
      (select auth.uid()) is not null
      and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
    )
  );
create policy "cms users can create reviews"
  on public.reviews for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "cms users can update reviews"
  on public.reviews for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete reviews"
  on public.reviews for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

-- Public views are intentionally avoided. If one is added later, it must use
-- WITH (security_invoker = true) so the caller's RLS policies remain active.
