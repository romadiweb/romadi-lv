alter table public.portal_leads
  add column if not exists high_priority boolean not null default false;

comment on column public.portal_leads.high_priority is
  'Marks a lead as important so portal lists can surface it before regular leads.';

create index if not exists portal_leads_priority_status_idx
  on public.portal_leads (high_priority desc, status, created_at desc);
