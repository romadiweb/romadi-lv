import type { APIRoute } from 'astro';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import { jsonResponse, PortalRequestError } from '@/lib/portal/security';

export const prerender = false;

const migrationName = '20260923070703_create_portal_quota_metrics.sql';

const errorResponse = (error: unknown) => {
  if (error instanceof PortalAuthError || error instanceof PortalRequestError) {
    return jsonResponse({ error: error.message }, error.status);
  }

  const supabaseError = error as { code?: unknown; message?: unknown };
  const code = typeof supabaseError.code === 'string' ? supabaseError.code : '';
  const message = typeof supabaseError.message === 'string' ? supabaseError.message : '';

  if (code === '42P01' || code === 'PGRST205' || message.includes('portal_quota_metrics')) {
    console.error('Portal quota metrics table is not available', error);
    return jsonResponse(
      {
        error: `Kvotu rādītāju katalogs vēl nav izveidots Supabase. Palaid migrāciju ${migrationName} un pārlādē portālu.`,
      },
      503,
    );
  }

  console.error('Portal quota metrics endpoint failed', error);
  return jsonResponse({ error: 'The quota metric catalog could not be loaded.' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const result = await locals.supabase
      .from('portal_quota_metrics')
      .select('*')
      .eq('is_active', true)
      .order('area_label')
      .order('sort_order')
      .order('metric_label');

    if (result.error) throw result.error;
    return jsonResponse({ data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
};
