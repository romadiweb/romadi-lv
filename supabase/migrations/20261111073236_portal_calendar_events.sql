create table public.portal_calendar_events (
  id bigint generated always as identity primary key,
  title text not null check (char_length(trim(title)) between 1 and 160),
  event_date date not null,
  event_type text not null check (event_type in ('event', 'social')),
  tag text not null default '' check (char_length(tag) <= 80),
  notes text not null default '' check (char_length(notes) <= 4000)
);
create index portal_calendar_events_date_idx on public.portal_calendar_events (event_date, id);
alter table public.portal_calendar_events enable row level security;
revoke all on public.portal_calendar_events from anon, authenticated;
grant select, insert on public.portal_calendar_events to authenticated;
grant usage on sequence public.portal_calendar_events_id_seq to authenticated;
create policy "CMS users read calendar events" on public.portal_calendar_events
  for select to authenticated using ((select auth.uid()) is not null and
    (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'));
create policy "CMS users create calendar events" on public.portal_calendar_events
  for insert to authenticated with check ((select auth.uid()) is not null and
    (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'));
