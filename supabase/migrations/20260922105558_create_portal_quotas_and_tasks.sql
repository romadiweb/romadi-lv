-- Weekly quota targets and general task management for the internal portal.

create table public.portal_quota_targets (
  id bigint generated always as identity primary key,
  week_start date not null,
  module text not null,
  metric_key text not null,
  label text not null,
  target_value integer not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_quota_targets_week_start_monday
    check (extract(isodow from week_start) = 1),
  constraint portal_quota_targets_module_format
    check (module ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_quota_targets_metric_key_format
    check (metric_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_quota_targets_label_length
    check (char_length(label) between 1 and 160),
  constraint portal_quota_targets_value_positive
    check (target_value between 1 and 1000000),
  constraint portal_quota_targets_sort_order_nonnegative
    check (sort_order between 0 and 1000000),
  constraint portal_quota_targets_unique_week_metric
    unique (week_start, module, metric_key)
);

comment on table public.portal_quota_targets is
  'Calendar-week quota targets by reusable module and metric key. week_start is always ISO Monday.';
comment on column public.portal_quota_targets.module is
  'Future-ready module namespace such as leads, tasks, marketing, accounting, or custom.';
comment on column public.portal_quota_targets.metric_key is
  'Metric identifier used by the portal to calculate progress where a source exists.';

create index portal_quota_targets_week_idx
  on public.portal_quota_targets (week_start desc, sort_order, id);
create index portal_quota_targets_metric_idx
  on public.portal_quota_targets (module, metric_key, week_start desc);

alter table public.portal_quota_targets enable row level security;

revoke all on table public.portal_quota_targets from anon, authenticated;
grant select, insert, update, delete on table public.portal_quota_targets to authenticated;
grant usage, select on sequence public.portal_quota_targets_id_seq to authenticated;

create policy "portal users can read quota targets"
  on public.portal_quota_targets for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create quota targets"
  on public.portal_quota_targets for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update quota targets"
  on public.portal_quota_targets for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete quota targets"
  on public.portal_quota_targets for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

drop trigger if exists portal_quota_targets_touch_updated_at on public.portal_quota_targets;
create trigger portal_quota_targets_touch_updated_at
before update on public.portal_quota_targets
for each row execute function private.touch_updated_at();

create table public.portal_tasks (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  assigned_to text,
  status text not null default 'todo',
  priority text not null default 'normal',
  task_type text not null default 'manual',
  due_date date,
  source_module text,
  source_record_id bigint,
  completed_at timestamptz,
  created_by text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_tasks_title_length
    check (char_length(title) between 1 and 180),
  constraint portal_tasks_description_length
    check (description is null or char_length(description) <= 4000),
  constraint portal_tasks_assigned_to_length
    check (assigned_to is null or char_length(assigned_to) <= 160),
  constraint portal_tasks_status
    check (status in ('todo', 'in_progress', 'done', 'blocked', 'cant_do')),
  constraint portal_tasks_priority
    check (priority in ('low', 'normal', 'high', 'max', 'critical')),
  constraint portal_tasks_type
    check (task_type in ('manual', 'new_client', 'bug', 'lead_followup', 'quota')),
  constraint portal_tasks_source_module_format
    check (source_module is null or source_module ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_tasks_created_by_length
    check (created_by is null or char_length(created_by) <= 180)
);

comment on table public.portal_tasks is
  'General portal tasks with assignee, status, priority, and optional future module linkage.';
comment on column public.portal_tasks.priority is
  'critical is reserved for functionality-breaking issues; max is for new clients and top business urgency.';

create index portal_tasks_status_priority_idx
  on public.portal_tasks (status, priority, due_date nulls last, created_at desc);
create index portal_tasks_assigned_to_idx
  on public.portal_tasks (lower(assigned_to), status)
  where assigned_to is not null;
create index portal_tasks_due_date_idx
  on public.portal_tasks (due_date)
  where due_date is not null and status not in ('done', 'cant_do');

alter table public.portal_tasks enable row level security;

revoke all on table public.portal_tasks from anon, authenticated;
grant select, insert, update, delete on table public.portal_tasks to authenticated;
grant usage, select on sequence public.portal_tasks_id_seq to authenticated;

create policy "portal users can read tasks"
  on public.portal_tasks for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create tasks"
  on public.portal_tasks for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update tasks"
  on public.portal_tasks for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete tasks"
  on public.portal_tasks for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

drop trigger if exists portal_tasks_touch_updated_at on public.portal_tasks;
create trigger portal_tasks_touch_updated_at
before update on public.portal_tasks
for each row execute function private.touch_updated_at();

alter table public.cms_audit_log
  drop constraint if exists cms_audit_log_table_name;
alter table public.cms_audit_log
  add constraint cms_audit_log_table_name check (
    table_name in (
      'projects',
      'pricing_plans',
      'reviews',
      'portal_leads',
      'portal_text_templates',
      'portal_pricing_items',
      'portal_quota_targets',
      'portal_tasks'
    )
  );

drop trigger if exists portal_quota_targets_audit_change on public.portal_quota_targets;
create trigger portal_quota_targets_audit_change
after insert or update or delete on public.portal_quota_targets
for each row execute function private.log_cms_change();

drop trigger if exists portal_tasks_audit_change on public.portal_tasks;
create trigger portal_tasks_audit_change
after insert or update or delete on public.portal_tasks
for each row execute function private.log_cms_change();
