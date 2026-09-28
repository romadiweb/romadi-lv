-- Shared outreach copy library for authenticated portal users.

create table public.portal_text_templates (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null,
  notes text,
  variants jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_text_templates_title_length
    check (char_length(title) between 1 and 160),
  constraint portal_text_templates_category_length
    check (char_length(category) between 1 and 100),
  constraint portal_text_templates_notes_length
    check (notes is null or char_length(notes) <= 2000),
  constraint portal_text_templates_variants_array
    check (
      jsonb_typeof(variants) = 'array'
      and jsonb_array_length(variants) between 1 and 12
    )
);

comment on table public.portal_text_templates is
  'Shared plain-text templates grouped by category with one or more named tone variants.';
comment on column public.portal_text_templates.variants is
  'Validated by the portal API as objects containing UUID id, label, and plain-text content.';

create index portal_text_templates_updated_idx
  on public.portal_text_templates (updated_at desc, id desc);
create index portal_text_templates_category_updated_idx
  on public.portal_text_templates (lower(category), updated_at desc, id desc);

alter table public.portal_text_templates enable row level security;

revoke all on table public.portal_text_templates from anon, authenticated;
grant select, insert, update, delete on table public.portal_text_templates to authenticated;
grant usage, select on sequence public.portal_text_templates_id_seq to authenticated;

create policy "portal users can read text templates"
  on public.portal_text_templates for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create text templates"
  on public.portal_text_templates for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update text templates"
  on public.portal_text_templates for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete text templates"
  on public.portal_text_templates for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

drop trigger if exists portal_text_templates_touch_updated_at on public.portal_text_templates;
create trigger portal_text_templates_touch_updated_at
before update on public.portal_text_templates
for each row execute function private.touch_updated_at();

alter table public.cms_audit_log
  drop constraint if exists cms_audit_log_table_name;
alter table public.cms_audit_log
  add constraint cms_audit_log_table_name check (
    table_name in ('projects', 'pricing_plans', 'reviews', 'portal_leads', 'portal_text_templates')
  );

drop trigger if exists portal_text_templates_audit_change on public.portal_text_templates;
create trigger portal_text_templates_audit_change
after insert or update or delete on public.portal_text_templates
for each row execute function private.log_cms_change();
