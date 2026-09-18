import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/database';

export type ProjectProof = Pick<Project, 'id' | 'name' | 'slug' | 'logo_url' | 'sort_order'>;

export type PortfolioProject = Pick<
  Project,
  | 'id'
  | 'slug'
  | 'name'
  | 'type'
  | 'summary'
  | 'logo_url'
  | 'portfolio_image_url'
  | 'project_url'
  | 'alt_text'
  | 'build_platform'
  | 'challenge'
  | 'solution'
  | 'features'
  | 'technologies'
  | 'integrations'
  | 'sort_order'
  | 'is_featured'
  | 'completed_at'
>;

const PROJECT_QUERY_TIMEOUT_MS = 1_500;

const fallbackPortfolioProjects: PortfolioProject[] = [
  {
    id: -1,
    slug: 'diana-hunt',
    name: 'Diana Hunt',
    type: 'website',
    summary:
      'Medību preču kataloga vietne ar Latvijā izstrādātu mednieku eksāmena testa sistēmu, lietotāju kontiem un īpašnieka pārvaldības vidi.',
    logo_url: '/images/projects/diana-logo-metallic.webp',
    portfolio_image_url: '/images/projects/dianahunt-1600.webp',
    project_url: 'https://dianahunt.lv',
    alt_text: 'Diana Hunt interneta veikala sākumlapa',
    build_platform: 'Custom izstrāde',
    challenge:
      'Vienā saprotamā vietnē bija jāapvieno medību preču katalogs, mācību saturs un droša piekļuve eksāmena testa sistēmai.',
    solution:
      'Izveidojām individuālu vietni ar lietotāju kontiem, mednieku eksāmena treniņtestu un īpašnieka CMS produktu un lietotāju pārvaldībai.',
    features: [
      'Latvijas mednieku eksāmena testa sistēma',
      'Lietotāju konti un piekļuves pārvaldība',
      'Produktu katalogs bez tiešsaistes apmaksas',
      'CMS produktu un lietotāju pārvaldībai',
      'Pieteikuma forma ar nosūtīšanu uz e-pastu',
    ],
    technologies: ['Custom izstrāde', 'Pielāgots CMS'],
    integrations: [
      'Lietotāju konti',
      'E-pasta forma',
      'Produktu kataloga pārvaldība',
      'Eksāmena testa sistēma',
    ],
    sort_order: 10,
    is_featured: true,
    completed_at: null,
  },
  {
    id: -2,
    slug: 'liepajas-teltis',
    name: 'Liepājas Teltis',
    type: 'website',
    summary:
      'Pakalpojumu vietne, kas palīdz ātri saprast piedāvājumu un nonākt līdz rezervācijas pieprasījumam.',
    logo_url: '/images/projects/liepajasteltis-logo-metallic.webp',
    portfolio_image_url: '/images/projects/liepajas-teltis-1600.webp',
    project_url: 'https://liepajasteltis.lv',
    alt_text: 'Liepājas Teltis vietnes sākumlapa',
    build_platform: 'Custom izstrāde',
    challenge: null,
    solution: null,
    features: [],
    technologies: [],
    integrations: [],
    sort_order: 20,
    is_featured: true,
    completed_at: null,
  },
  {
    id: -3,
    slug: 'rtu-liepajas-jurniecibas-koledza',
    name: 'RTU Liepājas Jūrniecības koledža',
    type: 'website',
    summary:
      'Digitāla klātbūtne jūrniecības izglītības iestādei ar pārskatāmu informācijas arhitektūru.',
    logo_url: '/images/projects/ljk-logo-metallic.webp',
    portfolio_image_url: '/images/projects/ljk.png',
    project_url: 'https://ljk.lv',
    alt_text: 'RTU Liepājas Jūrniecības koledžas logotips',
    build_platform: 'Custom izstrāde',
    challenge: null,
    solution: null,
    features: [],
    technologies: [],
    integrations: [],
    sort_order: 30,
    is_featured: true,
    completed_at: null,
  },
];

const getFallbackPortfolioProjects = (): PortfolioProject[] =>
  fallbackPortfolioProjects.map((project) => ({
    ...project,
    features: [...project.features],
    technologies: [...project.technologies],
    integrations: [...project.integrations],
  }));

const getFallbackProjectProofs = (): ProjectProof[] =>
  fallbackPortfolioProjects.map(({ id, name, slug, logo_url, sort_order }) => ({
    id,
    name,
    slug,
    logo_url,
    sort_order,
  }));

const warnProjectQueryFailure = (scope: string, error: unknown): void => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? String(error.message)
        : 'Unknown Supabase error';

  console.warn(`Could not load ${scope} from Supabase; using local project data: ${message}`);
};

export async function getPublishedWebsiteProjects(): Promise<ProjectProof[]> {
  const fallbackProjects = getFallbackProjectProofs();
  if (!supabase) return fallbackProjects;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, slug, logo_url, sort_order')
      .eq('type', 'website')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })
      .abortSignal(AbortSignal.timeout(PROJECT_QUERY_TIMEOUT_MS));

    if (error) {
      warnProjectQueryFailure('website projects', error);
      return fallbackProjects;
    }

    return data.length > 0 ? data : fallbackProjects;
  } catch (error) {
    warnProjectQueryFailure('website projects', error);
    return fallbackProjects;
  }
}

export async function getPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  const fallbackProjects = getFallbackPortfolioProjects();
  if (!supabase) return fallbackProjects;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select(
        'id, slug, name, type, summary, logo_url, portfolio_image_url, project_url, alt_text, build_platform, challenge, solution, features, technologies, integrations, sort_order, is_featured, completed_at',
      )
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })
      .abortSignal(AbortSignal.timeout(PROJECT_QUERY_TIMEOUT_MS));

    if (error) {
      warnProjectQueryFailure('portfolio projects', error);
      return fallbackProjects;
    }

    return data.length > 0 ? data : fallbackProjects;
  } catch (error) {
    warnProjectQueryFailure('portfolio projects', error);
    return fallbackProjects;
  }
}
