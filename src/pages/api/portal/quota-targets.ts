import type { APIRoute } from 'astro';
import type { Database } from '@/types/database';
import { parseQuotaTarget } from '@/lib/portal/quotas';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

type QuotaTargetInsert = Database['public']['Tables']['portal_quota_targets']['Insert'];
type QuotaTargetUpdate = Database['public']['Tables']['portal_quota_targets']['Update'];

const migrationName = '20260922105558_create_portal_quotas_and_tasks.sql';

const readJsonBody = async (request: Request): Promise<unknown> => {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > 100_000) throw new PortalRequestError('Request is too large', 413);

  const body = await request.text();
  if (body.length > 100_000) throw new PortalRequestError('Request is too large', 413);

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new PortalRequestError('Invalid JSON body');
  }
};

const errorResponse = (error: unknown) => {
  if (error instanceof PortalAuthError || error instanceof PortalRequestError) {
    return jsonResponse({ error: error.message }, error.status);
  }

  const supabaseError = error as { code?: unknown; message?: unknown };
  const code = typeof supabaseError.code === 'string' ? supabaseError.code : '';
  const message = typeof supabaseError.message === 'string' ? supabaseError.message : '';

  if (code === '42P01' || code === 'PGRST205' || message.includes('portal_quota_targets')) {
    console.error('Portal quota targets table is not available', error);
    return jsonResponse(
      {
        error: `Kvotu tabula vēl nav izveidota Supabase. Palaid migrāciju ${migrationName} un pārlādē portālu.`,
      },
      503,
    );
  }

  console.error('Portal quota targets endpoint failed', error);
  return jsonResponse({ error: 'The quota request could not be completed.' }, 500);
};

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const weekStart = url.searchParams.get('week_start');
    let query = locals.supabase
      .from('portal_quota_targets')
      .select('*')
      .order('week_start', { ascending: false })
      .order('sort_order')
      .order('id');

    if (weekStart) query = query.eq('week_start', weekStart);

    const result = await query;
    if (result.error) throw result.error;
    return jsonResponse({ data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST: APIRoute = async (context) => {
  try {
    await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const parsed = parseQuotaTarget(await readJsonBody(context.request));
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi kvotas laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result = await context.locals.supabase
      .from('portal_quota_targets')
      .insert(parsed.data as QuotaTargetInsert)
      .select()
      .single();

    if (result.error) throw result.error;
    return jsonResponse({ data: result.data }, 201);
  } catch (error) {
    return errorResponse(error);
  }
};

export const PATCH: APIRoute = async (context) => {
  try {
    await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    if (!payload || typeof payload !== 'object')
      throw new PortalRequestError('Invalid request body');
    const { id, data } = payload as { id?: unknown; data?: unknown };
    if (!Number.isSafeInteger(id) || Number(id) < 1) {
      throw new PortalRequestError('Invalid quota target ID');
    }

    const parsed = parseQuotaTarget(data, true);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi kvotas laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result = await context.locals.supabase
      .from('portal_quota_targets')
      .update(parsed.data as QuotaTargetUpdate)
      .eq('id', Number(id))
      .select()
      .single();

    if (result.error) throw result.error;
    return jsonResponse({ data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    const identity = await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (identity.role !== 'super-admin') {
      throw new PortalAuthError('Tikai super-admin var dzēst kvotas.', 403);
    }
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    const id = payload && typeof payload === 'object' ? (payload as { id?: unknown }).id : null;
    if (!Number.isSafeInteger(id) || Number(id) < 1) {
      throw new PortalRequestError('Invalid quota target ID');
    }

    const result = await context.locals.supabase
      .from('portal_quota_targets')
      .delete()
      .eq('id', Number(id));
    if (result.error) throw result.error;
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
