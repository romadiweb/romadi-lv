import type { APIRoute } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { parsePortalTask } from '@/lib/portal/tasks';
import { PortalAuthError, type PortalIdentity, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

type TaskInsert = Database['public']['Tables']['portal_tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['portal_tasks']['Update'];
type PortalSupabase = SupabaseClient<Database>;

const migrationName =
  '20260922105558_create_portal_quotas_and_tasks.sql un 20260922125453_create_portal_users_and_task_assignments.sql';

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

  if (
    code === '42P01' ||
    code === '42703' ||
    code === 'PGRST205' ||
    message.includes('portal_tasks') ||
    message.includes('portal_users')
  ) {
    console.error('Portal tasks table is not available', error);
    return jsonResponse(
      {
        error: `Uzdevumu tabula vēl nav izveidota Supabase. Palaid migrāciju ${migrationName} un pārlādē portālu.`,
      },
      503,
    );
  }

  console.error('Portal tasks endpoint failed', error);
  return jsonResponse({ error: 'The task request could not be completed.' }, 500);
};

const ensureCurrentPortalUser = async (supabase: PortalSupabase, identity: PortalIdentity) => {
  const result = await supabase.from('portal_users').upsert(
    {
      email: identity.email,
      id: identity.id,
      is_active: true,
      last_seen_at: new Date().toISOString(),
      role: identity.role,
    },
    { onConflict: 'id' },
  );
  if (result.error) throw result.error;
};

const resolveAssignee = async (
  supabase: PortalSupabase,
  assignedToUserId: string | null | undefined,
) => {
  if (!assignedToUserId) return { assigned_to: null, assigned_to_user_id: null };

  const result = await supabase
    .from('portal_users')
    .select('id,email,display_name,is_active')
    .eq('id', assignedToUserId)
    .eq('is_active', true)
    .maybeSingle();

  if (result.error) throw result.error;
  if (!result.data) throw new PortalRequestError('Izvēlētais lietotājs nav atrasts.', 422);

  return {
    assigned_to: result.data.display_name || result.data.email,
    assigned_to_user_id: result.data.id,
  };
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const result = await locals.supabase
      .from('portal_tasks')
      .select('*')
      .order('status')
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (result.error) throw result.error;
    return jsonResponse({ data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const identity = await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const parsed = parsePortalTask(await readJsonBody(context.request));
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi uzdevuma laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    await ensureCurrentPortalUser(context.locals.supabase, identity);
    const assignment = await resolveAssignee(
      context.locals.supabase,
      parsed.data.assigned_to_user_id,
    );

    const payload: TaskInsert = {
      ...(parsed.data as TaskInsert),
      ...assignment,
      completed_at: parsed.data.status === 'done' ? new Date().toISOString() : null,
      created_by: identity.email,
      created_by_user_id: identity.id,
    };

    const result = await context.locals.supabase
      .from('portal_tasks')
      .insert(payload)
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
    const identity = await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    if (!payload || typeof payload !== 'object')
      throw new PortalRequestError('Invalid request body');
    const { id, data } = payload as { id?: unknown; data?: unknown };
    if (!Number.isSafeInteger(id) || Number(id) < 1) {
      throw new PortalRequestError('Invalid task ID');
    }

    const parsed = parsePortalTask(data, true);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Pārbaudi uzdevuma laukus.',
          issues: parsed.error.issues.map(({ message, path }) => ({ message, path })),
        },
        422,
      );
    }

    await ensureCurrentPortalUser(context.locals.supabase, identity);
    const assignment =
      'assigned_to_user_id' in parsed.data
        ? await resolveAssignee(context.locals.supabase, parsed.data.assigned_to_user_id)
        : {};

    const updatePayload: TaskUpdate = {
      ...(parsed.data as TaskUpdate),
      ...assignment,
      ...(parsed.data.status
        ? { completed_at: parsed.data.status === 'done' ? new Date().toISOString() : null }
        : {}),
    };

    const result = await context.locals.supabase
      .from('portal_tasks')
      .update(updatePayload)
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
      throw new PortalAuthError('Tikai super-admin var dzēst uzdevumus.', 403);
    }
    if (!context.locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const payload = await readJsonBody(context.request);
    const id = payload && typeof payload === 'object' ? (payload as { id?: unknown }).id : null;
    if (!Number.isSafeInteger(id) || Number(id) < 1)
      throw new PortalRequestError('Invalid task ID');

    const result = await context.locals.supabase.from('portal_tasks').delete().eq('id', Number(id));
    if (result.error) throw result.error;
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
