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
  | 'sort_order'
  | 'is_featured'
  | 'completed_at'
>;

export async function getPublishedWebsiteProjects(): Promise<ProjectProof[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, slug, logo_url, sort_order')
    .eq('type', 'website')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.warn(`Could not load website projects from Supabase: ${error.message}`);
    return [];
  }

  return data;
}

export async function getPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select(
      'id, slug, name, type, summary, logo_url, portfolio_image_url, project_url, alt_text, build_platform, sort_order, is_featured, completed_at',
    )
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.warn(`Could not load portfolio projects from Supabase: ${error.message}`);
    return [];
  }

  return data.filter(
    (project) => !['loadmaster-simulator', 'ship-stability-simulator'].includes(project.slug),
  );
}
