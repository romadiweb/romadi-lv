create table public.pricing_plans (
  id bigint generated always as identity primary key,
  name text not null,
  price_prefix text not null default 'Sākot no',
  price_label text not null,
  description text not null,
  features text[] not null default '{}'::text[],
  cta_label text not null,
  cta_href text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_plans_name_not_blank check (length(btrim(name)) > 0),
  constraint pricing_plans_price_label_not_blank check (length(btrim(price_label)) > 0),
  constraint pricing_plans_description_not_blank check (length(btrim(description)) > 0),
  constraint pricing_plans_cta_label_not_blank check (length(btrim(cta_label)) > 0),
  constraint pricing_plans_sort_order_nonnegative check (sort_order >= 0)
);

comment on column public.pricing_plans.price_label is
  'Display-ready price text, for example 500 € or Pēc vienošanās.';
comment on column public.pricing_plans.features is
  'Ordered feature labels rendered as the card checklist.';
comment on column public.pricing_plans.cta_href is
  'Optional per-card destination; when null the website contact URL is used.';

create index pricing_plans_published_order_idx
  on public.pricing_plans (sort_order, id)
  where is_published = true;

alter table public.pricing_plans enable row level security;

revoke all on table public.pricing_plans from anon, authenticated;
grant select on table public.pricing_plans to anon, authenticated;

create policy "published pricing plans are publicly readable"
  on public.pricing_plans
  for select
  to anon, authenticated
  using (is_published = true);
