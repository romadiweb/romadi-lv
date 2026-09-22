import type { APIRoute } from 'astro';
import type { Database } from '@/types/database';
import { parsePricingItem } from '@/lib/portal/pricing-items';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

type PricingItemInsert = Database['public']['Tables']['portal_pricing_items']['Insert'];
type PricingItemUpdate = Database['public']['Tables']['portal_pricing_items']['Update'];

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

  if (code === '42P01' || code === 'PGRST205' || message.includes('portal_pricing_items')) {
    console.error('Portal pricing items table is not available', error);
    return jsonResponse(
      {
        error:
          'Cenu kalkulatora tabula vēl nav izveidota Supabase. Palaid migrāciju 20260922090000_create_portal_pricing_items.sql un pārlādē portālu.',
      },
      503,
    );
  }

  console.error('Portal pricing items endpoint failed', error);
  return jsonResponse({ error: 'The pricing catalog request could not be completed.' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const result = await locals.supabase
      .from('portal_pricing_items')
      .select('*')
      .order('category')
      .order('sort_order')
      .order('id');

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

    const parsed = parsePricingItem(await readJsonBody(context.request));
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi cenu rindas laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result = await context.locals.supabase
      .from('portal_pricing_items')
      .insert(parsed.data as PricingItemInsert)
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
      throw new PortalRequestError('Invalid pricing item ID');
    }

    const parsed = parsePricingItem(data, true);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi cenu rindas laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result = await context.locals.supabase
      .from('portal_pricing_items')
      .update(parsed.data as PricingItemUpdate)
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
      throw new PortalAuthError('Tikai super-admin var dzēst cenu rindas.', 403);
    }
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    const id = payload && typeof payload === 'object' ? (payload as { id?: unknown }).id : null;
    if (!Number.isSafeInteger(id) || Number(id) < 1) {
      throw new PortalRequestError('Invalid pricing item ID');
    }

    const result = await context.locals.supabase
      .from('portal_pricing_items')
      .delete()
      .eq('id', Number(id));
    if (result.error) throw result.error;
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
