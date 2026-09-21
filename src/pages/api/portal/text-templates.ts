import type { APIRoute } from 'astro';
import type { Database } from '@/types/database';
import { parseTextTemplate } from '@/lib/portal/text-templates';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

type TemplateInsert = Database['public']['Tables']['portal_text_templates']['Insert'];
type TemplateUpdate = Database['public']['Tables']['portal_text_templates']['Update'];

const readJsonBody = async (request: Request): Promise<unknown> => {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > 300_000) throw new PortalRequestError('Request is too large', 413);

  const body = await request.text();
  if (body.length > 300_000) throw new PortalRequestError('Request is too large', 413);

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

  if (code === '42P01' || code === 'PGRST205' || message.includes('portal_text_templates')) {
    console.error('Portal text templates table is not available', error);
    return jsonResponse(
      {
        error:
          'Tekstu sagatavju tabula vēl nav izveidota Supabase. Palaid migrāciju 20260921183550_create_portal_text_templates.sql un pārlādē portālu.',
      },
      503,
    );
  }

  console.error('Portal text templates endpoint failed', error);
  return jsonResponse({ error: 'The text template request could not be completed.' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const result = await locals.supabase
      .from('portal_text_templates')
      .select('*')
      .order('updated_at', { ascending: false })
      .order('id', { ascending: false });

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

    const parsed = parseTextTemplate(await readJsonBody(context.request));
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi sagataves laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result = await context.locals.supabase
      .from('portal_text_templates')
      .insert(parsed.data as TemplateInsert)
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
      throw new PortalRequestError('Invalid text template ID');
    }

    const parsed = parseTextTemplate(data, true);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi sagataves laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    const result = await context.locals.supabase
      .from('portal_text_templates')
      .update(parsed.data as TemplateUpdate)
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
      throw new PortalAuthError('Tikai super-admin var dzēst teksta sagataves.', 403);
    }
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    const id = payload && typeof payload === 'object' ? (payload as { id?: unknown }).id : null;
    if (!Number.isSafeInteger(id) || Number(id) < 1) {
      throw new PortalRequestError('Invalid text template ID');
    }

    const result = await context.locals.supabase
      .from('portal_text_templates')
      .delete()
      .eq('id', Number(id));
    if (result.error) throw result.error;
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
