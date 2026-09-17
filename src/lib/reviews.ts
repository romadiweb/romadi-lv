import { supabase } from '@/lib/supabase';
import type { Review } from '@/types/database';

export type PublicReview = Pick<
  Review,
  | 'id'
  | 'slug'
  | 'client_name'
  | 'client_url'
  | 'logo_url'
  | 'quote'
  | 'reviewer_name'
  | 'reviewer_role'
  | 'rating'
  | 'sort_order'
>;

export async function getPublishedReviews(slugs?: string[]): Promise<PublicReview[]> {
  if (!supabase) return [];

  const requestedSlugs = [...new Set(slugs?.filter(Boolean) ?? [])];
  let query = supabase
    .from('reviews')
    .select(
      'id, slug, client_name, client_url, logo_url, quote, reviewer_name, reviewer_role, rating, sort_order',
    )
    .eq('is_published', true);

  if (requestedSlugs.length > 0) {
    query = query.in('slug', requestedSlugs);
  }

  const { data, error } = await query
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })
    .abortSignal(AbortSignal.timeout(1_500));

  if (error) {
    if (!import.meta.env.DEV && error.code) {
      console.warn(`Could not load reviews from Supabase: ${error.message}`);
    }
    return [];
  }

  if (requestedSlugs.length === 0) return data;

  const reviewBySlug = new Map(data.map((review) => [review.slug, review]));
  return requestedSlugs.flatMap((slug) => {
    const review = reviewBySlug.get(slug);
    return review ? [review] : [];
  });
}
