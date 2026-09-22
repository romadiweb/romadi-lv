-- Editable price catalog used by the internal portal calculator.

create table public.portal_pricing_items (
  id bigint generated always as identity primary key,
  item_key text not null unique,
  name text not null,
  category text not null,
  unit text not null,
  price_eur numeric(10, 2) not null,
  default_quantity numeric(10, 2) not null default 1,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint portal_pricing_items_key_format
    check (item_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portal_pricing_items_name_length
    check (char_length(name) between 1 and 160),
  constraint portal_pricing_items_category
    check (category in ('base', 'page', 'integration', 'addon', 'hourly', 'adjustment')),
  constraint portal_pricing_items_unit
    check (unit in ('project', 'page', 'item', 'hour')),
  constraint portal_pricing_items_price_nonnegative
    check (price_eur >= 0 and price_eur <= 1000000),
  constraint portal_pricing_items_quantity_positive
    check (default_quantity > 0 and default_quantity <= 10000),
  constraint portal_pricing_items_description_length
    check (description is null or char_length(description) <= 1000),
  constraint portal_pricing_items_sort_order_nonnegative
    check (sort_order >= 0 and sort_order <= 1000000)
);

comment on table public.portal_pricing_items is
  'Internal editable pricing catalog for building estimates in the ROMADI portal.';
comment on column public.portal_pricing_items.category is
  'Calculator grouping: base, page, integration, addon, hourly, or adjustment.';
comment on column public.portal_pricing_items.unit is
  'How quantity is labelled in calculator rows: project, page, item, or hour.';

create index portal_pricing_items_category_order_idx
  on public.portal_pricing_items (category, sort_order, id);
create index portal_pricing_items_active_order_idx
  on public.portal_pricing_items (is_active, sort_order, id);

alter table public.portal_pricing_items enable row level security;

revoke all on table public.portal_pricing_items from anon, authenticated;
grant select, insert, update, delete on table public.portal_pricing_items to authenticated;
grant usage, select on sequence public.portal_pricing_items_id_seq to authenticated;

create policy "portal users can read pricing items"
  on public.portal_pricing_items for select to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can create pricing items"
  on public.portal_pricing_items for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "portal users can update pricing items"
  on public.portal_pricing_items for update to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );
create policy "super admins can delete pricing items"
  on public.portal_pricing_items for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
  );

drop trigger if exists portal_pricing_items_touch_updated_at on public.portal_pricing_items;
create trigger portal_pricing_items_touch_updated_at
before update on public.portal_pricing_items
for each row execute function private.touch_updated_at();

alter table public.cms_audit_log
  drop constraint if exists cms_audit_log_table_name;
alter table public.cms_audit_log
  add constraint cms_audit_log_table_name check (
    table_name in (
      'projects',
      'pricing_plans',
      'reviews',
      'portal_leads',
      'portal_text_templates',
      'portal_pricing_items'
    )
  );

drop trigger if exists portal_pricing_items_audit_change on public.portal_pricing_items;
create trigger portal_pricing_items_audit_change
after insert or update or delete on public.portal_pricing_items
for each row execute function private.log_cms_change();

insert into public.portal_pricing_items (
  item_key,
  name,
  category,
  unit,
  price_eur,
  default_quantity,
  description,
  sort_order,
  is_active
)
values
  (
    'landing-lapas-pamats',
    'Landing lapas pamats',
    'base',
    'project',
    500,
    1,
    'Vienas skaidras pārdošanas vai pieteikuma lapas sākuma komplekts.',
    10,
    true
  ),
  (
    'biznesa-majaslapas-pamats',
    'Biznesa mājaslapas pamats',
    'base',
    'project',
    1100,
    1,
    'Profesionāla uzņēmuma mājaslapa ar struktūru, sākuma dizainu un publicēšanu.',
    20,
    true
  ),
  (
    'tuksa-lapa-bez-integracijam',
    'Tukša lapa bez integrācijām',
    'page',
    'page',
    180,
    1,
    'Papildu vienkārša satura lapa bez formām, automatizācijas vai ārējām sistēmām.',
    30,
    true
  ),
  (
    'epasta-forma',
    'E-pasta forma',
    'integration',
    'item',
    120,
    1,
    'Kontaktforma ar validāciju un nosūtīšanu uz e-pastu.',
    40,
    true
  ),
  (
    'analytics-search-console',
    'Analytics un Search Console',
    'integration',
    'item',
    90,
    1,
    'Google Analytics, Search Console un pamata notikumu pieslēgšana.',
    50,
    true
  ),
  (
    'cms-satura-parvaldiba',
    'CMS satura pārvaldība',
    'addon',
    'project',
    350,
    1,
    'Vienkārša pārvaldības sadaļa tekstiem, attēliem vai sarakstiem.',
    60,
    true
  ),
  (
    'maksajumu-integracija',
    'Maksājumu integrācija',
    'integration',
    'item',
    350,
    1,
    'Tiešsaistes maksājumu pieslēgšana ar pamata pirkuma plūsmu.',
    70,
    true
  ),
  (
    'rezervacijas-integracija',
    'Rezervācijas integrācija',
    'integration',
    'item',
    450,
    1,
    'Rezervācijas vai pierakstu plūsma ar paziņojumiem.',
    80,
    true
  ),
  (
    'papildu-programmesana',
    'Papildu programmēšana',
    'hourly',
    'hour',
    50,
    1,
    'Papildu individuāls izstrādes darbs ārpus sākotnējā apjoma.',
    90,
    true
  )
on conflict (item_key) do update set
  name = excluded.name,
  category = excluded.category,
  unit = excluded.unit,
  price_eur = excluded.price_eur,
  default_quantity = excluded.default_quantity,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
