insert into public.projects (
  slug,
  name,
  type,
  logo_url,
  portfolio_image_url,
  sort_order,
  is_featured,
  is_published
)
values
  ('diana-hunt', 'Diana Hunt', 'website', '/images/projects/diana-logo-metallic.webp', null, 10, true, true),
  ('liepajas-teltis', 'Liepājas Teltis', 'website', '/images/projects/liepajasteltis-logo-metallic.webp', null, 20, true, true),
  ('rtu-liepajas-jurniecibas-koledza', 'RTU Liepājas Jūrniecības koledža', 'website', '/images/projects/ljk-logo-metallic.webp', null, 30, true, true),
  ('loadmaster-simulator', 'Loadmaster Simulator', 'website', '/images/projects/loadmaster-logo-metallic.webp', null, 40, true, true),
  ('ship-stability-simulator', 'Ship Stability Simulator', 'website', '/images/projects/shipstability-logo-metallic.webp', null, 50, true, true),
  ('pabeigts-projekts-6', 'Pabeigts projekts 6', 'website', null, null, 60, false, true),
  ('pabeigts-projekts-7', 'Pabeigts projekts 7', 'website', null, null, 70, false, true)
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  logo_url = excluded.logo_url,
  portfolio_image_url = excluded.portfolio_image_url,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  updated_at = now();

insert into public.pricing_plans (
  service_key,
  name,
  price_prefix,
  price_label,
  description,
  features,
  cta_label,
  cta_href,
  sort_order,
  is_featured,
  is_published
)
values
  (
    'majaslapu-izstrade',
    'Landing lapa',
    'Sākot no',
    '500 €',
    'Vienam piedāvājumam, pakalpojumam vai kampaņai ar vienu skaidru konversijas mērķi.',
    array['Līdz 5 satura sadaļām', 'Individuāls responsīvs dizains', 'Pieteikuma forma', 'SEO pamati'],
    'Pārrunāt landing lapu',
    null,
    10,
    false,
    true
  ),
  (
    'majaslapu-izstrade',
    'Biznesa mājaslapa',
    'Sākot no',
    '1 100 €',
    'Uzņēmumam, kam vajadzīga profesionāla klātbūtne, skaidrs piedāvājums un vieta izaugsmei.',
    array['Līdz 12 lapām', 'Satura un UX struktūra', 'Analītika un integrācijas', 'Tehniskais SEO'],
    'Pārrunāt biznesa lapu',
    null,
    20,
    true,
    true
  ),
  (
    'majaslapu-izstrade',
    'Individuāls risinājums',
    'Sākot no',
    '2 700 €',
    'Sarežģītākiem projektiem ar īpašu funkcionalitāti, integrācijām vai pielāgotām darba plūsmām.',
    array['Pielāgota funkcionalitāte', 'Ārējo sistēmu integrācijas', 'Mērogojama arhitektūra', 'Prioritāra attīstība'],
    'Pārrunāt risinājumu',
    null,
    30,
    false,
    true
  );
