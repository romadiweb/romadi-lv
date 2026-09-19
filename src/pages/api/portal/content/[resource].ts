import type { APIRoute } from 'astro';
import type { Database } from '@/types/database';
import {
  isCmsResource,
  parseCmsContent,
  type CmsResource,
} from '@/lib/portal/cms-content';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];
type PricingInsert = Database['public']['Tables']['pricing_plans']['Insert'];
type PricingUpdate = Database['public']['Tables']['pricing_plans']['Update'];

const getResource = (value: string | undefined): CmsResource | null =>
  isCmsResource(value) ? value : null;

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
  console.error('Portal content endpoint failed', error);
  return jsonResponse({ error: 'The CMS request could not be completed.' }, 500);
};

export const GET: APIRoute = async ({ locals, params }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    const resource = getResource(params.resource);
    if (!resource || !locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const result =
      resource === 'projects'
        ? await locals.supabase
            .from('projects')
            .select('*')
            .order('sort_order')
            .order('id')
        : resource === 'reviews'
          ? await locals.supabase
              .from('reviews')
              .select('*')
              .order('sort_order')
              .order('id')
          : await locals.supabase
              .from('pricing_plans')
              .select('*')
              .order('service_key')
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
    const resource = getResource(context.params.resource);
    if (!resource || !context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const parsed = parseCmsContent(resource, await readJsonBody(context.request));
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Check the highlighted content fields.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result =
      resource === 'projects'
        ? await context.locals.supabase
            .from('projects')
            .insert(parsed.data as ProjectInsert)
            .select()
            .single()
        : resource === 'reviews'
          ? await context.locals.supabase
              .from('reviews')
              .insert(parsed.data as ReviewInsert)
              .select()
              .single()
          : await context.locals.supabase
              .from('pricing_plans')
              .insert(parsed.data as PricingInsert)
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
    const resource = getResource(context.params.resource);
    if (!resource || !context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    if (!payload || typeof payload !== 'object') throw new PortalRequestError('Invalid request body');
    const { id, data } = payload as { id?: unknown; data?: unknown };
    if (!Number.isSafeInteger(id) || Number(id) < 1) throw new PortalRequestError('Invalid record ID');

    const parsed = parseCmsContent(resource, data, true);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Check the highlighted content fields.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const recordId = Number(id);
    const result =
      resource === 'projects'
        ? await context.locals.supabase
            .from('projects')
            .update(parsed.data as ProjectUpdate)
            .eq('id', recordId)
            .select()
            .single()
        : resource === 'reviews'
          ? await context.locals.supabase
              .from('reviews')
              .update(parsed.data as ReviewUpdate)
              .eq('id', recordId)
              .select()
              .single()
          : await context.locals.supabase
              .from('pricing_plans')
              .update(parsed.data as PricingUpdate)
              .eq('id', recordId)
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
      throw new PortalAuthError('Only a super-admin can delete content.', 403);
    }
    const resource = getResource(context.params.resource);
    if (!resource || !context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    const id = payload && typeof payload === 'object' ? (payload as { id?: unknown }).id : null;
    if (!Number.isSafeInteger(id) || Number(id) < 1) throw new PortalRequestError('Invalid record ID');

    const recordId = Number(id);
    const result =
      resource === 'projects'
        ? await context.locals.supabase.from('projects').delete().eq('id', recordId)
        : resource === 'reviews'
          ? await context.locals.supabase.from('reviews').delete().eq('id', recordId)
          : await context.locals.supabase.from('pricing_plans').delete().eq('id', recordId);

    if (result.error) throw result.error;
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
