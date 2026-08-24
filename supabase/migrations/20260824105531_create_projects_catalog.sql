create table public.projects (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  type text not null,
  summary text,
  logo_url text,
  portfolio_image_url text,
  project_url text,
  alt_text text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  completed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint projects_name_not_blank check (length(btrim(name)) > 0),
  constraint projects_type_not_blank check (length(btrim(type)) > 0),
  constraint projects_sort_order_nonnegative check (sort_order >= 0)
);

comment on column public.projects.type is
  'Filterable project category such as website, logo, branding, application, or other.';
comment on column public.projects.logo_url is
  'Optional transparent/metallic logo used in compact project proof marks.';
comment on column public.projects.portfolio_image_url is
  'Optional editorial image used on portfolio cards and project pages; intentionally separate from logo_url.';

create index projects_published_type_order_idx
  on public.projects (type, sort_order, id)
  where is_published = true;

alter table public.projects enable row level security;

revoke all on table public.projects from anon, authenticated;
grant select on table public.projects to anon, authenticated;

create policy "published projects are publicly readable"
  on public.projects
  for select
  to anon, authenticated
  using (is_published = true);
