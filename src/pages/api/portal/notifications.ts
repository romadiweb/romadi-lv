import type { APIRoute } from 'astro';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

const failure = (error: unknown) => {
  if (error instanceof PortalAuthError || error instanceof PortalRequestError) {
    return jsonResponse({ error: error.message }, error.status);
  }
  console.error('Task notifications request failed', error);
  return jsonResponse({ error: 'Paziņojumus neizdevās ielādēt. Mēģini vēlreiz.' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const identity = await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);
    const result = await locals.supabase
      .from('portal_task_notifications')
      .select('*')
      .eq('user_id', identity.id)
      .order('created_at', { ascending: false });
    if (result.error) throw result.error;
    return jsonResponse({ data: result.data });
  } catch (error) {
    return failure(error);
  }
};

export const PATCH: APIRoute = async (context) => {
  try {
    const identity = await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);
    const body = await context.request.text();
    if (body.length > 1_000) throw new PortalRequestError('Request is too large', 413);
    let payload: { id?: unknown };
    try {
      payload = JSON.parse(body);
    } catch {
      throw new PortalRequestError('Invalid JSON body');
    }
    if (!payload || !Number.isSafeInteger(payload.id) || Number(payload.id) < 1) {
      throw new PortalRequestError('Invalid notification ID');
    }
    const result = await context.locals.supabase
      .from('portal_task_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', Number(payload.id))
      .eq('user_id', identity.id)
      .select()
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) return jsonResponse({ error: 'Paziņojums nav atrasts.' }, 404);
    return jsonResponse({ data: result.data });
  } catch (error) {
    return failure(error);
  }
};
