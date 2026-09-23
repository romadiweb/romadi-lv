-- Database-backed quota areas and indicators.

create table if not exists public.portal_quota_metrics (
  id bigint generated always as identity primary key,
  area_key text not null,
  area_label text not null,
  metric_key text not null,
  metric_label text not null,
  description text,
  calculation_key text not null default 'manual',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_quota_metrics_area_key_format
    check (area_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_quota_metrics_metric_key_format
    check (metric_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_quota_metrics_calculation_key_format
    check (calculation_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_quota_metrics_area_label_length
    check (char_length(area_label) between 1 and 120),
  constraint portal_quota_metrics_metric_label_length
    check (char_length(metric_label) between 1 and 160),
  constraint portal_quota_metrics_description_length
    check (description is null or char_length(description) <= 500),
  constraint portal_quota_metrics_sort_order_nonnegative
    check (sort_order between 0 and 1000000),
  constraint portal_quota_metrics_unique_metric
    unique (area_key, metric_key)
);

comment on table public.portal_quota_metrics is
  'Catalog of quota areas (jomas) and indicators (raditaji) used by weekly quota targets.';
comment on column public.portal_quota_metrics.area_key is
  'Stable area key stored on portal_quota_targets.module for backwards compatibility.';
comment on column public.portal_quota_metrics.calculation_key is
  'Portal-side calculation identifier. Use manual when the metric has no implemented source yet.';

create index if not exists portal_quota_metrics_area_idx
  on public.portal_quota_metrics (is_active desc, area_key, sort_order, id);
create index if not exists portal_quota_metrics_calculation_idx
  on public.portal_quota_metrics (calculation_key)
  where is_active;

alter table public.portal_quota_metrics enable row level security;

revoke all on table public.portal_quota_metrics from anon, authenticated;
grant select, insert, update, delete on table public.portal_quota_metrics to authenticated;
grant usage, select on sequence public.portal_quota_metrics_id_seq to authenticated;

create policy "portal users can read quota metrics"
  on public.portal_quota_metrics for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create quota metrics"
  on public.portal_quota_metrics for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update quota metrics"
  on public.portal_quota_metrics for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete quota metrics"
  on public.portal_quota_metrics for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

drop trigger if exists portal_quota_metrics_touch_updated_at on public.portal_quota_metrics;
create trigger portal_quota_metrics_touch_updated_at
before update on public.portal_quota_metrics
for each row execute function private.touch_updated_at();

insert into public.portal_quota_metrics (
  area_key,
  area_label,
  metric_key,
  metric_label,
  description,
  calculation_key,
  sort_order
)
values
  (
    'leads',
    'Leads',
    'new-leads',
    'Jauni lead',
    'Lead ieraksti, kas izveidoti izvēlētajā kalendāra nedēļā.',
    'new-leads',
    10
  ),
  (
    'leads',
    'Leads',
    'contacted-leads',
    'Sazinātie lead',
    'Lead, kuriem sazināšanās datums ir izvēlētajā kalendāra nedēļā.',
    'contacted-leads',
    20
  ),
  (
    'leads',
    'Leads',
    'followups-due',
    'Follow-up termiņi',
    'Lead follow-up termiņi izvēlētajā kalendāra nedēļā.',
    'followups-due',
    30
  ),
  (
    'leads',
    'Leads',
    'followups-completed',
    'Follow-up izpildīti',
    'Rezervēts rādītājs nākamajam follow-up izpildes laukam.',
    'manual',
    40
  ),
  (
    'leads',
    'Leads',
    'offers-sent',
    'Nosūtīti piedāvājumi',
    'Lead, kas šajā nedēļā pārvietoti uz piedāvājuma statusu.',
    'offers-sent',
    50
  ),
  (
    'leads',
    'Leads',
    'new-clients',
    'Jauni klienti',
    'Lead, kas šajā nedēļā pārvietoti uz klienta statusu.',
    'new-clients',
    60
  ),
  (
    'tasks',
    'Uzdevumi',
    'completed-tasks',
    'Pabeigti uzdevumi',
    'Uzdevumi, kas pabeigti izvēlētajā kalendāra nedēļā.',
    'completed-tasks',
    10
  ),
  (
    'tasks',
    'Uzdevumi',
    'max-priority-tasks',
    'Max prioritātes uzdevumi',
    'Atvērtie max vai critical prioritātes uzdevumi.',
    'max-priority-tasks',
    20
  ),
  (
    'collaborations',
    'Sadarbības',
    'new-collaboration-offers-sent',
    'Jauni sadarbības piedāvājumi izsūtīti',
    'Nākotnes sadarbību sadaļas rādītājs.',
    'manual',
    10
  ),
  (
    'marketing',
    'Mārketings',
    'campaigns-launched',
    'Palaistas kampaņas',
    'Nākotnes mārketinga sadaļas rādītājs.',
    'manual',
    10
  )
on conflict (area_key, metric_key) do update
set
  area_label = excluded.area_label,
  metric_label = excluded.metric_label,
  description = excluded.description,
  calculation_key = excluded.calculation_key,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = statement_timestamp();

insert into public.portal_quota_metrics (
  area_key,
  area_label,
  metric_key,
  metric_label,
  description,
  calculation_key,
  sort_order,
  is_active
)
select distinct
  targets.module,
  initcap(replace(targets.module, '-', ' ')),
  targets.metric_key,
  targets.label,
  'Migrated from existing weekly quota targets.',
  targets.metric_key,
  900,
  true
from public.portal_quota_targets targets
where not exists (
  select 1
  from public.portal_quota_metrics metrics
  where metrics.area_key = targets.module
    and metrics.metric_key = targets.metric_key
)
on conflict (area_key, metric_key) do nothing;

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
      'portal_quota_metrics',
      'portal_tasks'
    )
  );

drop trigger if exists portal_quota_metrics_audit_change on public.portal_quota_metrics;
create trigger portal_quota_metrics_audit_change
after insert or update or delete on public.portal_quota_metrics
for each row execute function private.log_cms_change();
