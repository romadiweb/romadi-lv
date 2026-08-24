import { supabase } from '@/lib/supabase';
import type { PricingPlan } from '@/types/database';

export type PublicPricingPlan = Pick<
  PricingPlan,
  | 'id'
  | 'name'
  | 'price_prefix'
  | 'price_label'
  | 'description'
  | 'features'
  | 'cta_label'
  | 'cta_href'
  | 'sort_order'
  | 'is_featured'
  | 'service_key'
>;

export async function getPublishedPricingPlans(serviceKey: string): Promise<PublicPricingPlan[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('pricing_plans')
    .select(
      'id, name, price_prefix, price_label, description, features, cta_label, cta_href, sort_order, is_featured, service_key',
    )
    .eq('is_published', true)
    .eq('service_key', serviceKey)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.warn(`Could not load pricing plans from Supabase: ${error.message}`);
    return [];
  }

  return data;
}
