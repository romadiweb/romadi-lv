import { SERVICES } from '@/data/services';

export const SITE = {
  /**
   * Core brand identity
   */
  name: 'ROMADI',

  shortName: 'ROMADI',

  title: 'ROMADI — mājaslapu izstrāde un digitālā izaugsme',

  titleTemplate: '%s | ROMADI',

  description:
    'ROMADI izstrādā mūsdienīgas mājaslapas, interneta veikalus un digitālos risinājumus, kas palīdz uzņēmumiem augt, komunicēt un izcelties tiešsaistē.',

  url: 'https://romadi.lv',

  language: 'lv',

  locale: 'lv_LV',

  defaultOgImage: '/images/home/hero-landscape-1600.webp',

  searchPreviewImage: '/images/brand/romadi-search-thumbnail.png',

  /**
   * Brand positioning
   */
  tagline: 'Digitāli risinājumi uzņēmuma izaugsmei.',

  positioning: 'Partneris no pirmās idejas līdz gatavam digitālajam risinājumam.',

  valueProposition:
    'Mēs ne tikai izstrādājam mājaslapas — mēs palīdzam zīmoliem augt, komunicēt un izcelties tiešsaistē.',

  /**
   * Public contact information
   */
  contact: {
    email: 'info@romadi.lv',

    phones: [
      {
        label: 'Tālrunis',
        display: '+371 26 625 125',
        href: 'tel:+37126625125',
      },
      {
        label: 'Tālrunis',
        display: '+371 29 625 996',
        href: 'tel:+37129625996',
      },
    ],

    location: {
      city: 'Liepāja',
      country: 'Latvija',
      countryCode: 'LV',
    },
  },

  /**
   * Primary website navigation
   */
  navigation: {
    primary: [
      {
        label: 'Pakalpojumi',
        href: '/pakalpojumi',
      },
      {
        label: 'Portfolio',
        href: '/portfolio',
      },
      {
        label: 'Par mums',
        href: '/par-mums',
      },
      {
        label: 'Kontakti',
        href: '/kontakti',
      },
    ],

    callToAction: {
      label: 'Pieteikt projektu',
      href: '/kontakti',
    },
  },

  /**
   * ROMADI services
   */
  services: SERVICES,

  /**
   * Footer navigation
   */
  footer: {
    companyLinks: [
      {
        label: 'Par mums',
        href: '/par-mums',
      },
      {
        label: 'Portfolio',
        href: '/portfolio',
      },
      {
        label: 'Kontakti',
        href: '/kontakti',
      },
    ],

    legalLinks: [
      {
        label: 'Privātuma politika',
        href: '/privatuma-politika',
      },
      {
        label: 'Sīkdatņu politika',
        href: '/sikdatnu-politika',
      },
    ],
  },

  /**
   * Add exact profile URLs once confirmed.
   */
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
  },

  /**
   * Organization data used by JSON-LD.
   *
   * Replace legalName and registrationNumber with the exact
   * registered company information before production launch.
   */
  organization: {
    name: 'ROMADI',
    legalName: '',
    registrationNumber: '',
    logo: '/images/brand/romadi-search-thumbnail.png',
  },

  /**
   * Default SEO settings
   */
  seo: {
    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: 'website',
      image: '/images/home/hero-landscape-1600.webp',
      imageAlt: 'ROMADI — mājaslapu izstrāde un digitālie risinājumi',
    },

    twitter: {
      card: 'summary_large_image',
    },
  },
} as const;

export type SiteConfig = typeof SITE;
export type SiteService = (typeof SITE.services)[number];
export type NavigationItem = (typeof SITE.navigation.primary)[number];
