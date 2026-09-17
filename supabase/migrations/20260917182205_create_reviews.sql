create table public.reviews (
  id bigint generated always as identity primary key,
  slug text not null unique,
  client_name text not null,
  client_url text,
  logo_url text,
  quote text,
  reviewer_name text,
  reviewer_role text,
  rating smallint,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint reviews_client_name_not_blank check (length(btrim(client_name)) > 0),
  constraint reviews_quote_not_blank check (quote is null or length(btrim(quote)) > 0),
  constraint reviews_reviewer_name_not_blank check (
    reviewer_name is null or length(btrim(reviewer_name)) > 0
  ),
  constraint reviews_reviewer_role_not_blank check (
    reviewer_role is null or length(btrim(reviewer_role)) > 0
  ),
  constraint reviews_rating_range check (rating is null or rating between 1 and 5),
  constraint reviews_sort_order_nonnegative check (sort_order >= 0)
);

comment on table public.reviews is
  'Curated client testimonials that may be selected by slug and reused across public pages.';
comment on column public.reviews.quote is
  'Approved client review copy. Null means the final text has not been supplied yet.';
comment on column public.reviews.slug is
  'Stable public identifier used by reusable review sections to select a specific review.';

create index reviews_published_order_idx
  on public.reviews (sort_order, id)
  where is_published = true;

alter table public.reviews enable row level security;

revoke all on table public.reviews from anon, authenticated;
grant select on table public.reviews to anon, authenticated;

create policy "published reviews are publicly readable"
  on public.reviews
  for select
  to anon, authenticated
  using (is_published = true);

insert into public.reviews (
  slug,
  client_name,
  client_url,
  logo_url,
  quote,
  sort_order,
  is_published
)
values
  (
    'liepajasteltis-lv',
    'Liepājas Teltis',
    'https://liepajasteltis.lv',
    '/images/projects/liepajasteltis-logo-metallic.webp',
    'Pateicoties sadarbībai ar ROMADI, ieguvām pozitīvus rezultātus — pieauga pasūtījumu skaits un uzlabojās pozīcijas meklētājos.',
    10,
    true
  ),
  (
    'dianahunt-lv',
    'Diana Hunt',
    'https://dianahunt.lv',
    '/images/projects/diana-logo-metallic.webp',
    'Profesionāla komanda. Augstu vērtēju viņu darbu, jo uzsvars vienmēr tiek likts uz kvalitāti. Pieņemot viņu piedāvājumu izveidot eksāmenu sistēmu, ievērojami uzlabojusies mācību kvalitāte, un no studentiem saņemam ļoti pozitīvas atsauksmes!',
    20,
    true
  );
