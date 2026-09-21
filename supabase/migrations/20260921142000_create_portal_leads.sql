-- Authenticated portal leads for the future sales/task workflow.

create table public.portal_leads (
  id bigint generated always as identity primary key,
  company_name text not null,
  found_on text not null,
  has_website boolean not null default false,
  industry text,
  contacted_at date,
  outreach_owner text not null,
  contact_channel text not null default 'instagram',
  status text not null default 'not_contacted',
  notes text,
  follow_up_enabled boolean not null default false,
  follow_up_due_at date generated always as (
    case
      when follow_up_enabled
        and contacted_at is not null
        and status not in ('client', 'rejected', 'no_response')
      then contacted_at + 7
      else null
    end
  ) stored,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_leads_company_name_length check (char_length(company_name) between 1 and 180),
  constraint portal_leads_found_on_length check (char_length(found_on) between 1 and 180),
  constraint portal_leads_industry_length check (industry is null or char_length(industry) <= 120),
  constraint portal_leads_outreach_owner_length check (char_length(outreach_owner) between 1 and 120),
  constraint portal_leads_notes_length check (notes is null or char_length(notes) <= 4000),
  constraint portal_leads_contact_channel check (
    contact_channel in ('instagram', 'facebook', 'linkedin', 'email', 'phone', 'other')
  ),
  constraint portal_leads_status check (
    status in (
      'not_contacted',
      'contacted',
      'answered',
      'interested',
      'offer_sent',
      'negotiation',
      'client',
      'rejected',
      'no_response',
      'deferred'
    )
  )
);

comment on table public.portal_leads is
  'Internal lead pipeline. follow_up_due_at is intentionally queryable by the later task quota system.';
comment on column public.portal_leads.follow_up_due_at is
  'Generated from contacted_at + 7 days when follow-up is enabled and the lead is still open.';

create index portal_leads_status_created_idx
  on public.portal_leads (status, created_at desc);
create index portal_leads_follow_up_due_idx
  on public.portal_leads (follow_up_due_at)
  where follow_up_due_at is not null;
create index portal_leads_outreach_owner_idx
  on public.portal_leads (outreach_owner);

alter table public.portal_leads enable row level security;

revoke all on table public.portal_leads from anon, authenticated;
grant select, insert, update, delete on table public.portal_leads to authenticated;
grant usage, select on sequence public.portal_leads_id_seq to authenticated;

create policy "portal users can read leads"
  on public.portal_leads for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create leads"
  on public.portal_leads for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update leads"
  on public.portal_leads for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete leads"
  on public.portal_leads for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

drop trigger if exists portal_leads_touch_updated_at on public.portal_leads;
create trigger portal_leads_touch_updated_at
before update on public.portal_leads
for each row execute function private.touch_updated_at();

alter table public.cms_audit_log
  drop constraint if exists cms_audit_log_table_name;
alter table public.cms_audit_log
  add constraint cms_audit_log_table_name check (
    table_name in ('projects', 'pricing_plans', 'reviews', 'portal_leads')
  );

drop trigger if exists portal_leads_audit_change on public.portal_leads;
create trigger portal_leads_audit_change
after insert or update or delete on public.portal_leads
for each row execute function private.log_cms_change();
