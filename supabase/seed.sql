insert into public.projects (
  slug,
  name,
  type,
  build_platform,
  logo_url,
  portfolio_image_url,
  project_url,
  summary,
  challenge,
  solution,
  features,
  technologies,
  integrations,
  sort_order,
  is_featured,
  is_published
)
values
  (
    'diana-hunt',
    'Diana Hunt',
    'website',
    'Custom izstrāde',
    '/images/projects/diana-logo-metallic.webp',
    null,
    'https://dianahunt.lv',
    'Medību preču kataloga vietne ar Latvijā izstrādātu mednieku eksāmena testa sistēmu, lietotāju kontiem un īpašnieka pārvaldības vidi.',
    'Vienā saprotamā vietnē bija jāapvieno medību preču katalogs, mācību saturs un droša piekļuve eksāmena testa sistēmai.',
    'Izveidojām individuālu vietni ar lietotāju kontiem, mednieku eksāmena treniņtestu un īpašnieka CMS produktu un lietotāju pārvaldībai.',
    array[
      'Latvijas mednieku eksāmena testa sistēma',
      'Lietotāju konti un piekļuves pārvaldība',
      'Produktu katalogs bez tiešsaistes apmaksas',
      'CMS produktu un lietotāju pārvaldībai',
      'Pieteikuma forma ar nosūtīšanu uz e-pastu'
    ],
    array['Custom izstrāde', 'Pielāgots CMS'],
    array['Lietotāju konti', 'E-pasta forma', 'Produktu kataloga pārvaldība', 'Eksāmena testa sistēma'],
    10,
    true,
    true
  ),
  ('liepajas-teltis', 'Liepājas Teltis', 'website', 'Custom izstrāde', '/images/projects/liepajasteltis-logo-metallic.webp', null, 'https://liepajasteltis.lv', 'Telšu un pasākumu inventāra nomas vietne ar pārskatāmu katalogu, nomas sarakstu un rezervācijas pieprasījumu vienuviet.', 'Palīdzēt pasākumu rīkotājiem atrast piemērotas teltis un inventāru un ērti nosūtīt vienotu nomas pieprasījumu.', 'Izveidojām vietni ar inventāra kategorijām, nomas sarakstu un pieteikuma formu, kur norādīt pasākuma datumu, vietu un vajadzīgo aprīkojumu.', array['Telšu un inventāra katalogs', 'Nomas saraksts', 'Rezervācijas pieprasījuma forma', 'Piegādes un kontaktinformācija'], '{}', '{}', 20, true, true),
  ('rtu-liepajas-jurniecibas-koledza', 'RTU Liepājas Jūrniecības koledža', 'website', 'Custom izstrāde', '/images/projects/ljk-logo-metallic.webp', null, 'https://ljk.lv', 'Jūrniecības koledžas vietne, kas apvieno studiju programmas, aktualitātes un ikdienā nepieciešamo informāciju topošajiem un esošajiem studentiem.', 'Sakārtot plašo koledžas informāciju tā, lai studiju interesenti un studenti ātri atrastu sev vajadzīgo.', 'Veidojām pārskatāmu informācijas struktūru ar studiju programmām, aktualitātēm, dokumentiem un koledžas kontaktinformāciju.', array['Studiju programmu pārskats', 'Koledžas aktualitātes', 'Dokumenti un noderīga informācija', 'Kontaktinformācija'], '{}', '{}', 30, true, true),
  ('pabeigts-projekts-6', 'Pabeigts projekts 6', 'website', 'Custom izstrāde', null, null, null, null, null, null, '{}', '{}', '{}', 60, false, true),
  ('pabeigts-projekts-7', 'Pabeigts projekts 7', 'website', 'Custom izstrāde', null, null, null, null, null, null, '{}', '{}', '{}', 70, false, true)
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  build_platform = excluded.build_platform,
  logo_url = excluded.logo_url,
  portfolio_image_url = excluded.portfolio_image_url,
  project_url = excluded.project_url,
  summary = excluded.summary,
  challenge = excluded.challenge,
  solution = excluded.solution,
  features = excluded.features,
  technologies = excluded.technologies,
  integrations = excluded.integrations,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  updated_at = now();

insert into public.reviews (
  slug,
  client_name,
  client_url,
  logo_url,
  quote,
  reviewer_name,
  reviewer_role,
  rating,
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
    null,
    null,
    null,
    10,
    true
  ),
  (
    'dianahunt-lv',
    'Diana Hunt',
    'https://dianahunt.lv',
    '/images/projects/diana-logo-metallic.webp',
    'Profesionāla komanda. Augstu vērtēju viņu darbu, jo uzsvars vienmēr tiek likts uz kvalitāti. Pieņemot viņu piedāvājumu izveidot eksāmenu sistēmu, ievērojami uzlabojusies mācību kvalitāte, un no studentiem saņemam ļoti pozitīvas atsauksmes!',
    null,
    null,
    null,
    20,
    true
  )
on conflict (slug) do update set
  client_name = excluded.client_name,
  client_url = excluded.client_url,
  logo_url = excluded.logo_url,
  quote = excluded.quote,
  reviewer_name = excluded.reviewer_name,
  reviewer_role = excluded.reviewer_role,
  rating = excluded.rating,
  sort_order = excluded.sort_order,
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
  ),
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
-- No screenshot yet: a null portfolio_image_url selects the gradient preview.
insert into public.projects (
  slug, name, type, status, build_platform, logo_url, portfolio_image_url,
  project_url, summary, sort_order, is_featured, is_published
) values (
  'lr-events', 'LR Events', 'website', 'in_progress', 'Custom izstrāde',
  '/images/projects/lr-events-logo.png', null, 'https://lrevents-lv.vercel.app/',
  'Top autosporta pasākumu vietne ar informāciju par auto, moto un sporta pasākumiem Latvijā, reģistrāciju, nolikumiem un rezultātiem.',
  40, false, true
)
on conflict (slug) do nothing;
