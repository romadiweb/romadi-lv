export type ServiceVisualKind =
  'website' | 'commerce' | 'product' | 'design' | 'automation' | 'growth' | 'support';

export interface ServiceDetail {
  title: string;
  text: string;
}

export interface ServiceDefinition {
  id: string;
  slug: string;
  href: string;
  number: string;
  label: string;
  shortLabel: string;
  description: string;
  eyebrow: string;
  headline: readonly string[];
  intro: string;
  seoTitle: string;
  seoDescription: string;
  visual: ServiceVisualKind;
  visualTabs: readonly [string, string, string];
  details: readonly [ServiceDetail, ServiceDetail, ServiceDetail];
}

export const SERVICES: readonly ServiceDefinition[] = [
  {
    id: 'website-development',
    slug: 'majaslapu-izstrade',
    href: '/pakalpojumi/majaslapu-izstrade',
    number: '01',
    label: 'Mājaslapu izstrāde',
    shortLabel: 'Mājaslapas',
    description: 'Ātras, pārdomātas un viegli uzturamas mājaslapas uzņēmuma izaugsmei.',
    eyebrow: 'MĀJASLAPU IZSTRĀDE',
    headline: ['Mājaslapas, kas', 'pārliecina un strādā.'],
    intro:
      'Veidojam individuālas uzņēmumu mājaslapas ar skaidru struktūru, pārliecinošu dizainu un tehnisko pamatu, kas saglabā ātrumu arī augot saturam un ambīcijām.',
    seoTitle: 'Mājaslapu izstrāde uzņēmumiem',
    seoDescription:
      'Profesionāla mājaslapu izstrāde uzņēmumiem: UX, dizains, programmēšana, ātrdarbība un SEO pamati vienā pārdomātā risinājumā.',
    visual: 'website',
    visualTabs: ['Struktūra', 'Dizains', 'Ātrums'],
    details: [
      {
        title: 'Skaidra struktūra',
        text: 'Saturs un navigācija, kas palīdz apmeklētājam ātri nonākt līdz svarīgākajam.',
      },
      {
        title: 'Individuāls dizains',
        text: 'Vizuālā valoda, kas turpina jūsu zīmolu, nevis atkārto gatavu šablonu.',
      },
      {
        title: 'Stabils pamats',
        text: 'Ātra, pieejama un viegli attīstāma vietne ar sakārtotu tehnisko SEO.',
      },
    ],
  },
  {
    id: 'ecommerce-development',
    slug: 'interneta-veikalu-izstrade',
    href: '/pakalpojumi/interneta-veikalu-izstrade',
    number: '02',
    label: 'Interneta veikalu izstrāde',
    shortLabel: 'E-komercija',
    description: 'E-komercijas risinājumi ar ērtu pirkšanas plūsmu un pārdomātām integrācijām.',
    eyebrow: 'E-KOMERCIJA',
    headline: ['Interneta veikali', 'ērtākai pārdošanai.'],
    intro:
      'Izstrādājam interneta veikalus, kuros produktu atrašana, izvēle un apmaksa veido vienotu plūsmu. Savienojam maksājumus, piegādi, uzskaiti un analītiku bez liekas sarežģītības.',
    seoTitle: 'Interneta veikalu un e-komercijas izstrāde',
    seoDescription:
      'Interneta veikalu izstrāde ar ērtu produktu katalogu, drošiem maksājumiem, piegādes integrācijām un izmērāmu e-komercijas izaugsmi.',
    visual: 'commerce',
    visualTabs: ['Katalogs', 'Pirkums', 'Integrācijas'],
    details: [
      {
        title: 'Produktu katalogs',
        text: 'Saprotama kategoriju, filtru un produktu informācijas sistēma.',
      },
      {
        title: 'Pirkšanas plūsma',
        text: 'Mazāk šķēršļu no pirmā klikšķa līdz veiksmīgam pasūtījumam.',
      },
      {
        title: 'Savienoti procesi',
        text: 'Maksājumi, piegāde, noliktava un mārketinga rīki vienā sistēmā.',
      },
    ],
  },
  {
    id: 'digital-products',
    slug: 'digitalo-produktu-un-sistemu-izstrade',
    href: '/pakalpojumi/digitalo-produktu-un-sistemu-izstrade',
    number: '03',
    label: 'Digitālie produkti un sistēmas',
    shortLabel: 'Digitālie produkti',
    description:
      'Portāli, klientu zonas, rezervācijas un iekšējie rīki sarežģītu procesu sakārtošanai.',
    eyebrow: 'DIGITĀLIE PRODUKTI',
    headline: ['Sistēmas, kas pielāgojas', 'jūsu darba ritmam.'],
    intro:
      'Projektējam un izstrādājam klientu portālus, rezervāciju risinājumus, iekšējās sistēmas un tīmekļa aplikācijas, kas samazina manuālu darbu un rada skaidru datu plūsmu.',
    seoTitle: 'Digitālo produktu un sistēmu izstrāde',
    seoDescription:
      'Digitālo produktu, klientu portālu, rezervāciju sistēmu un uzņēmuma iekšējo rīku projektēšana un izstrāde.',
    visual: 'product',
    visualTabs: ['Darbplūsma', 'Dati', 'Integrācijas'],
    details: [
      {
        title: 'Procesu kartēšana',
        text: 'Pirms izstrādes atrodam vietas, kur tehnoloģija rada reālu ietaupījumu.',
      },
      {
        title: 'Lietojams interfeiss',
        text: 'Sarežģītas darbības pārvēršam saprotamā ikdienas darba plūsmā.',
      },
      {
        title: 'Droša attīstība',
        text: 'Modulāra arhitektūra, ko iespējams paplašināt kopā ar uzņēmumu.',
      },
    ],
  },
  {
    id: 'brand-and-design',
    slug: 'zimola-un-ui-ux-dizains',
    href: '/pakalpojumi/zimola-un-ui-ux-dizains',
    number: '04',
    label: 'Zīmols un UI/UX dizains',
    shortLabel: 'Zīmols un dizains',
    description: 'Vizuālā identitāte un digitālo produktu dizains vienotai zīmola pieredzei.',
    eyebrow: 'ZĪMOLS UN DIZAINS',
    headline: ['Dizains ar raksturu', 'un skaidru sistēmu.'],
    intro:
      'Veidojam zīmola identitāti, digitālo produktu saskarnes un dizaina sistēmas, kas palīdz uzņēmumam izskatīties vienoti un cilvēkiem — bez piepūles saprast, ko darīt tālāk.',
    seoTitle: 'Zīmola identitātes un UI/UX dizains',
    seoDescription:
      'Zīmola identitātes, mājaslapu un digitālo produktu UI/UX dizains ar skaidru vizuālo sistēmu un pārdomātu lietotāja pieredzi.',
    visual: 'design',
    visualTabs: ['Identitāte', 'UI/UX', 'Sistēma'],
    details: [
      {
        title: 'Vizuālā identitāte',
        text: 'Atpazīstama un elastīga valoda dažādiem zīmola saskares punktiem.',
      },
      {
        title: 'UI/UX dizains',
        text: 'Interfeisi, kas līdzsvaro biznesa mērķus ar lietotāja vajadzībām.',
      },
      {
        title: 'Dizaina sistēma',
        text: 'Atkārtojami principi un komponentes ātrākai turpmākajai attīstībai.',
      },
    ],
  },
  {
    id: 'ai-automation',
    slug: 'ai-un-automatizacija',
    href: '/pakalpojumi/ai-un-automatizacija',
    number: '05',
    label: 'AI un automatizācija',
    shortLabel: 'AI un automatizācija',
    description: 'Praktiski AI palīgi un automatizētas darbplūsmas ikdienas laika ietaupījumam.',
    eyebrow: 'AI UN AUTOMATIZĀCIJA',
    headline: ['Mazāk rutīnas.', 'Vairāk vērtīga darba.'],
    intro:
      'Atrodam procesus, kuros automatizācija un mākslīgais intelekts dod izmērāmu ieguvumu. Savienojam rīkus, datus un komandas darbu drošā, kontrolējamā plūsmā.',
    seoTitle: 'AI risinājumi un biznesa procesu automatizācija',
    seoDescription:
      'AI palīgu, datu integrāciju un biznesa procesu automatizācijas izstrāde uzņēmumiem, lai samazinātu manuālu darbu un ietaupītu laiku.',
    visual: 'automation',
    visualTabs: ['Aģents', 'Darbplūsma', 'Kontrole'],
    details: [
      {
        title: 'Vērtības audits',
        text: 'Izvēlamies procesus, kuros automatizācija atmaksājas, nevis tikai izklausās iespaidīgi.',
      },
      {
        title: 'Rīku integrācijas',
        text: 'Savienojam esošās sistēmas, datus un paziņojumus vienotā plūsmā.',
      },
      {
        title: 'Cilvēka kontrole',
        text: 'Pārskatāmi lēmumu punkti, piekļuves un drošības robežas.',
      },
    ],
  },
  {
    id: 'digital-growth',
    slug: 'digitala-izaugsme',
    href: '/pakalpojumi/digitala-izaugsme',
    number: '06',
    label: 'Digitālā izaugsme',
    shortLabel: 'Digitālā izaugsme',
    description: 'Analītika, SEO un konversiju uzlabojumi ilgtspējīgai digitālajai izaugsmei.',
    eyebrow: 'DIGITĀLĀ IZAUGSME',
    headline: ['No datiem līdz', 'labākiem rezultātiem.'],
    intro:
      'Sakārtojam mērījumus, atrodam neizmantotās iespējas un sistemātiski uzlabojam redzamību, lietotāja ceļu un konversiju. Izaugsme balstās datos, nevis minējumos.',
    seoTitle: 'SEO, analītika un digitālā izaugsme',
    seoDescription:
      'Tehniskais SEO, tīmekļa analītika un konversiju optimizācija uzņēmumiem, kas vēlas palielināt redzamību un digitālā kanāla atdevi.',
    visual: 'growth',
    visualTabs: ['Analītika', 'SEO', 'Konversija'],
    details: [
      {
        title: 'Precīzi mērījumi',
        text: 'Notikumi un mērķi, kas parāda ne tikai apmeklējumu, bet arī vērtību.',
      },
      {
        title: 'Organiskā redzamība',
        text: 'Tehniskais SEO un satura struktūra stabilai atrodamībai meklētājos.',
      },
      {
        title: 'Konversiju uzlabojumi',
        text: 'Hipotēzes, testi un izmaiņas, kas no esošās plūsmas iegūst vairāk.',
      },
    ],
  },
  {
    id: 'rebuild-and-support',
    slug: 'majaslapu-uzturesana-un-parbuve',
    href: '/pakalpojumi/majaslapu-uzturesana-un-parbuve',
    number: '07',
    label: 'Pārbūve un ilgtermiņa atbalsts',
    shortLabel: 'Uzturēšana un atbalsts',
    description: 'Esošu risinājumu audits, pārbūve, uzturēšana un tehniskais atbalsts.',
    eyebrow: 'UZTURĒŠANA UN ATBALSTS',
    headline: ['Digitāls risinājums,', 'kas neapstājas.'],
    intro:
      'Pārņemam un sakārtojam esošas mājaslapas, veicam tehnisko pārbūvi un rūpējamies par drošību, ātrumu un attīstību pēc palaišanas. Jums ir komanda, pie kuras atgriezties.',
    seoTitle: 'Mājaslapu uzturēšana, pārbūve un atbalsts',
    seoDescription:
      'Mājaslapu un digitālo produktu uzturēšana, tehniskais audits, pārbūve, drošības atjauninājumi un ilgtermiņa attīstības atbalsts.',
    visual: 'support',
    visualTabs: ['Audits', 'Uzturēšana', 'Attīstība'],
    details: [
      {
        title: 'Tehniskais audits',
        text: 'Skaidrs esošās situācijas novērtējums un prioritāšu plāns.',
      },
      {
        title: 'Droša uzturēšana',
        text: 'Atjauninājumi, uzraudzība, rezerves kopijas un savlaicīga reakcija.',
      },
      {
        title: 'Nepārtraukta attīstība',
        text: 'Jaunas funkcijas un uzlabojumi bez nepieciešamības katru reizi sākt no nulles.',
      },
    ],
  },
] as const;

export const HEADER_SERVICES = [
  SERVICES[0]!,
  SERVICES[1]!,
  SERVICES[2]!,
  SERVICES[3]!,
  SERVICES[4]!,
  {
    ...SERVICES[5]!,
    label: 'Izaugsme un atbalsts',
    description: 'Analītika, SEO, pārbūve un ilgtermiņa tehniskais atbalsts.',
  },
] as const;

export const getServiceBySlug = (slug: string): ServiceDefinition | undefined =>
  SERVICES.find((service) => service.slug === slug);
