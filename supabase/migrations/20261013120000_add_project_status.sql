alter table public.projects
  drop constraint if exists projects_build_platform_not_blank;

alter table public.projects
  alter column build_platform drop not null,
  alter column build_platform drop default,
  add column if not exists status text not null default 'completed';

alter table public.projects
  add constraint projects_status_valid
  check (status in ('completed', 'in_progress', 'planned', 'paused', 'archived'));

comment on column public.projects.status is
  'Portfolio display status shown as a card overlay: completed, in_progress, planned, paused, or archived.';
