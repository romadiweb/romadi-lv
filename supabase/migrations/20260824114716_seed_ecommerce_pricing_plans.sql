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
    'interneta-veikalu-izstrade',
    'Pamata veikals',
    'Sākot no',
    '1 200 €',
    'Nelielam produktu klāstam un uzņēmumam, kas vēlas sākt pārdot tiešsaistē bez liekas sarežģītības.',
    array['Līdz 30 produktiem', 'Maksājumu integrācija', 'Piegādes veidu uzstādīšana', 'Responsīvs dizains'],
    'Pārrunāt pamata veikalu',
    null,
    10,
    false,
    true
  ),
  (
    'interneta-veikalu-izstrade',
    'Izaugsmes veikals',
    'Sākot no',
    '2 400 €',
    'Augošam uzņēmumam ar plašāku katalogu, pārdomātu pirkuma ceļu un nepieciešamām biznesa integrācijām.',
    array['Neierobežots produktu katalogs', 'UX un pārdošanas struktūra', 'Noliktavas vai CRM integrācija', 'Analītika un tehniskais SEO'],
    'Pārrunāt izaugsmes veikalu',
    null,
    20,
    true,
    true
  ),
  (
    'interneta-veikalu-izstrade',
    'Individuāla e-komercija',
    'Sākot no',
    '4 200 €',
    'Pielāgots e-komercijas risinājums sarežģītākiem procesiem, automatizācijai un lielākam pārdošanas apjomam.',
    array['Individuāla funkcionalitāte', 'ERP un ārējo sistēmu integrācijas', 'Procesu automatizācija', 'Mērogojama arhitektūra'],
    'Pārrunāt individuālu veikalu',
    null,
    30,
    false,
    true
  );
