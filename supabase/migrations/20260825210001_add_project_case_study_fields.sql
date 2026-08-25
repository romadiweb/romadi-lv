alter table public.projects
  add column challenge text,
  add column solution text,
  add column features text[] not null default '{}',
  add column technologies text[] not null default '{}',
  add column integrations text[] not null default '{}';

comment on column public.projects.challenge is
  'Optional case-study challenge shown in the portfolio project dialog.';
comment on column public.projects.solution is
  'Optional case-study solution shown in the portfolio project dialog.';
comment on column public.projects.features is
  'Ordered list of delivered project capabilities shown in the portfolio project dialog.';
comment on column public.projects.technologies is
  'Ordered public-facing technology or implementation labels.';
comment on column public.projects.integrations is
  'Ordered list of key systems or integrations delivered for the project.';

update public.projects
set
  summary = 'Medību preču kataloga vietne ar Latvijā izstrādātu mednieku eksāmena testa sistēmu, lietotāju kontiem un īpašnieka pārvaldības vidi.',
  project_url = 'https://dianahunt.lv',
  challenge = 'Vienā saprotamā vietnē bija jāapvieno medību preču katalogs, mācību saturs un droša piekļuve eksāmena testa sistēmai.',
  solution = 'Izveidojām individuālu vietni ar lietotāju kontiem, mednieku eksāmena treniņtestu un īpašnieka CMS produktu un lietotāju pārvaldībai.',
  features = array[
    'Latvijas mednieku eksāmena testa sistēma',
    'Lietotāju konti un piekļuves pārvaldība',
    'Produktu katalogs bez tiešsaistes apmaksas',
    'CMS produktu un lietotāju pārvaldībai',
    'Pieteikuma forma ar nosūtīšanu uz e-pastu'
  ],
  technologies = array['Custom izstrāde', 'Pielāgots CMS'],
  integrations = array[
    'Lietotāju konti',
    'E-pasta forma',
    'Produktu kataloga pārvaldība',
    'Eksāmena testa sistēma'
  ],
  updated_at = now()
where slug = 'diana-hunt';
