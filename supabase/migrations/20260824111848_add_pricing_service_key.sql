alter table public.pricing_plans
  add column service_key text;

update public.pricing_plans
set service_key = 'majaslapu-izstrade'
where service_key is null;

alter table public.pricing_plans
  alter column service_key set not null,
  add constraint pricing_plans_service_key_not_blank
    check (length(btrim(service_key)) > 0);

comment on column public.pricing_plans.service_key is
  'Service page slug that controls where this pricing card is displayed.';

drop index if exists public.pricing_plans_published_order_idx;

create index pricing_plans_published_service_order_idx
  on public.pricing_plans (service_key, sort_order, id)
  where is_published = true;
