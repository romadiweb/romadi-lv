export interface WebsiteTemplate {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  summary: string;
  description: string;
  price: number;
  previewImage: string;
  previewAlt: string;
  previewWidth: number;
  previewHeight: number;
  socialImage: string;
  demoEyebrow: string;
  demoTitle: string;
  demoDescription: string;
  features: string[];
  technologies: string[];
  palette: {
    background: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
  };
}

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    slug: 'atelier-majas',
    name: 'Atelier mājas',
    category: 'construction',
    categoryLabel: 'Būvniecība',
    summary: 'Pārliecinoša mājaslapa būvniekiem, interjera studijām un ražotājiem.',
    description:
      'Atturīga, vizuāla veidne uzņēmumam, kura darbu vislabāk izskaidro telpa, materiāli un realizētie projekti.',
    price: 350,
    previewImage: '/images/templates/atelier-majas/atelier-hero.webp',
    previewAlt: 'Atelier Mājas sākumlapa ar mierpilnu koka mājas interjeru priežu mežā',
    previewWidth: 1672,
    previewHeight: 941,
    socialImage: '/images/social/atelier-majas-share-v2.jpg',
    demoEyebrow: 'Telpa, kas paliek atmiņā',
    demoTitle: 'No ieceres līdz mājām, kurās gribas palikt.',
    demoDescription:
      'Projektēšana, ražošana un būvniecība vienā pārdomātā procesā — ar skaidru atbildību katrā posmā.',
    features: [
      'Projektu galerija ar lieliem attēliem',
      'Pakalpojumu un procesa sadaļas',
      'Pieteikuma forma konsultācijai',
      'Atsauksmju un partneru bloki',
      'SEO pamata iestatījumi',
      'Mobilā un planšetes versija',
    ],
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Netlify'],
    palette: {
      background: '#e7e3d8',
      surface: '#f4f1e8',
      ink: '#24241f',
      muted: '#6c6a5f',
      accent: '#5c6041',
    },
  },
  {
    slug: 'miera-spa',
    name: 'Miera SPA',
    category: 'wellness',
    categoryLabel: 'Skaistums un labsajūta',
    summary: 'Silta rezervāciju lapa saloniem, SPA un individuāliem meistariem.',
    description:
      'Mierīga, jutekliska veidne ar skaidru pakalpojumu izvēli, speciālistu stāstiem un redzamu rezervācijas ceļu.',
    price: 350,
    previewImage: '/images/templates/miera-spa/miera-hero.webp',
    previewAlt: 'Miera SPA procedūru telpa ar ceriņkrāsas linu un skulpturālām sienām',
    previewWidth: 1536,
    previewHeight: 1024,
    socialImage: '/images/social/miera-spa-share-v2.jpg',
    demoEyebrow: 'Rituāli ķermenim un prātam',
    demoTitle: 'Atgūt mieru savā ritmā.',
    demoDescription:
      'Sejas un ķermeņa procedūras, kurās profesionāla aprūpe satiekas ar laiku sev.',
    features: [
      'Pakalpojumu katalogs un cenas',
      'Rezervācijas aicinājumi visā lapā',
      'Speciālistu profili un pieeja',
      'Dāvanu karšu piedāvājums',
      'Biežāk uzdotie jautājumi',
      'Mobilā un planšetes versija',
    ],
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Resend'],
    palette: {
      background: '#f0e8df',
      surface: '#f8f4ef',
      ink: '#3d2923',
      muted: '#7a6258',
      accent: '#7a4038',
    },
  },
  {
    slug: 'ezera-nams',
    name: 'Ezera nams',
    category: 'hospitality',
    categoryLabel: 'Viesmīlība',
    summary: 'Atmosfēriska lapa viesu namiem, atpūtas vietām un nelielām viesnīcām.',
    description:
      'Fotogrāfijām veidots stāsts ar numuru piedāvājumu, apkārtnes iespējām un ātru ceļu līdz rezervācijas pieprasījumam.',
    price: 390,
    previewImage: '/images/templates/ezera-nams/ezera-hero.webp',
    previewAlt: 'Ezera nams pie mierīga ziemeļu ezera zilajā stundā',
    previewWidth: 1938,
    previewHeight: 811,
    socialImage: '/images/social/ezera-nams-share-v2.jpg',
    demoEyebrow: 'Kur daba nosaka dienas ritmu',
    demoTitle: 'Klusāka vieta, kur atgriezties.',
    demoDescription:
      'Neliels viesu nams pie ezera ar ērtām istabām, vietējām brokastīm un mieru tepat aiz durvīm.',
    features: [
      'Numuru un ērtību pārskats',
      'Apkārtnes un aktivitāšu sadaļa',
      'Rezervācijas pieprasījuma forma',
      'Galerija ar pilna platuma attēliem',
      'Kartes un kontaktu sadaļa',
      'Mobilā un planšetes versija',
    ],
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Netlify'],
    palette: {
      background: '#e9e1d4',
      surface: '#f3ede4',
      ink: '#24221c',
      muted: '#6d675c',
      accent: '#776238',
    },
  },
];

export function getWebsiteTemplate(slug: string | undefined): WebsiteTemplate | undefined {
  return WEBSITE_TEMPLATES.find((template) => template.slug === slug);
}
