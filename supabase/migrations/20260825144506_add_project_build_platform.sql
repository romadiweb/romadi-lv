alter table public.projects
  add column build_platform text not null default 'Custom izstrāde';

alter table public.projects
  add constraint projects_build_platform_not_blank
  check (length(btrim(build_platform)) > 0);

comment on column public.projects.build_platform is
  'Display label for the platform or implementation approach, such as Custom izstrāde, Shopify, or WordPress.';
