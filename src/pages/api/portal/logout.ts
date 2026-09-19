import type { APIRoute } from 'astro';
import { requirePortalIdentity } from '@/lib/portal/auth';
import { assertCsrf, assertSameOrigin, jsonResponse } from '@/lib/portal/security';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (!context.locals.supabase) return jsonResponse({ error: 'Portal is not configured.' }, 503);

    const { error } = await context.locals.supabase.auth.signOut();
    if (error) throw error;
    return jsonResponse({ redirect: '/portal/login' });
  } catch (error) {
    console.error('Portal logout failed', error);
    return jsonResponse({ error: 'Could not sign out.' }, 401);
  }
};
