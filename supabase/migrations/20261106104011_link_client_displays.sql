-- One client/portfolio record powers every public client section. Existing CMS
-- policies and audit triggers on projects continue to protect these fields.
alter table public.projects
  add column metallic_logo_url text,
  add column show_in_partners boolean not null default true;

comment on column public.projects.metallic_logo_url is
  'Approved metallic pink mark. Only completed, published websites with this asset appear in project proof.';
comment on column public.projects.show_in_partners is
  'Include this published client in the homepage partner belt.';

update public.projects
set metallic_logo_url = logo_url
where slug in ('diana-hunt', 'liepajas-teltis', 'rtu-liepajas-jurniecibas-koledza');

update public.projects
set portfolio_image_url = '/images/projects/lr-events-home.webp',
    alt_text = 'LR Events autosporta pasākumu vietnes sākumlapa'
where slug = 'lr-events';
