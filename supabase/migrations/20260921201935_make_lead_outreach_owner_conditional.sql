alter table public.portal_leads
  alter column outreach_owner drop not null;

alter table public.portal_leads
  drop constraint if exists portal_leads_outreach_owner_length;

alter table public.portal_leads
  add constraint portal_leads_outreach_owner_length check (
    outreach_owner is null or char_length(outreach_owner) between 1 and 120
  ),
  add constraint portal_leads_contact_requires_owner check (
    status = 'not_contacted' or outreach_owner is not null
  );
