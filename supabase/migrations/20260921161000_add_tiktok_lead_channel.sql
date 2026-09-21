alter table public.portal_leads
  drop constraint if exists portal_leads_contact_channel;

alter table public.portal_leads
  add constraint portal_leads_contact_channel check (
    contact_channel in ('instagram', 'facebook', 'linkedin', 'tiktok', 'email', 'phone', 'other')
  );
