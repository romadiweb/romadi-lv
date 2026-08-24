import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/database';

export type ProjectProof = Pick<Project, 'id' | 'name' | 'slug' | 'logo_url' | 'sort_order'>;

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
