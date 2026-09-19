import type { APIRoute } from 'astro';
import { PortalAuthError, requireSuperAdmin } from '@/lib/portal/auth';
import { jsonResponse } from '@/lib/portal/security';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    await requireSuperAdmin(locals.supabase);
    if (!locals.supabase) throw new PortalAuthError('Portal is not configured', 503);

    const { data, error } = await locals.supabase
      .from('cms_audit_log')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return jsonResponse({ data });
  } catch (error) {
    if (error instanceof PortalAuthError) {
      return jsonResponse({ error: error.message }, error.status);
    }
    console.error('Portal audit endpoint failed', error);
    return jsonResponse({ error: 'Audit history could not be loaded.' }, 500);
  }
};
