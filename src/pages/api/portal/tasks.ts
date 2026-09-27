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

const assertActiveQuotaTarget = async (
  supabase: PortalSupabase,
  taskType: string | undefined,
  sourceModule: string | null | undefined,
  sourceRecordId: number | null | undefined,
) => {
  if (taskType !== 'quota') return;
  if (sourceModule !== 'quota-targets' || !sourceRecordId) {
    throw new PortalRequestError('Izvēlies aktīvo kvotu, ar kuru sasaistīt uzdevumu.', 422);
  }

  const result = await supabase
    .from('portal_quota_targets')
    .select('id,is_active')
    .eq('id', sourceRecordId)
    .eq('is_active', true)
    .maybeSingle();
  if (result.error) throw result.error;
  if (!result.data) throw new PortalRequestError('Izvēlētā kvota vairs nav aktīva.', 422);
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
    await assertActiveQuotaTarget(
      context.locals.supabase,
      parsed.data.task_type,
      parsed.data.source_module,
      parsed.data.source_record_id,
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

    const existing = await context.locals.supabase
      .from('portal_tasks')
      .select(
        'id,assigned_to,assigned_to_user_id,created_by,created_by_user_id,source_module,source_record_id,status,task_type',
      )
      .eq('id', Number(id))
      .maybeSingle();
    if (existing.error) throw existing.error;
    if (!existing.data) throw new PortalRequestError('Uzdevums nav atrasts.', 404);

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

    const identityEmail = identity.email.toLowerCase();
    const isCreator =
      existing.data.created_by_user_id === identity.id ||
      (!existing.data.created_by_user_id &&
        existing.data.created_by?.toLowerCase() === identityEmail);
    const isAssignee =
      existing.data.assigned_to_user_id === identity.id ||
      (!existing.data.assigned_to_user_id &&
        existing.data.assigned_to?.toLowerCase() === identityEmail);
    const canFullyEdit = identity.role === 'super-admin' || isCreator;

    if (!canFullyEdit) {
      const changedFields = Object.keys(parsed.data);
      const isCompletionOnly =
        isAssignee &&
        changedFields.length === 1 &&
        changedFields[0] === 'status' &&
        parsed.data.status === 'done';
      if (!isCompletionOnly) {
        throw new PortalAuthError(
          isAssignee
            ? 'Uzdevuma saņēmējs drīkst tikai atzīmēt uzdevumu kā pabeigtu.'
            : 'Tikai uzdevuma piešķīrējs drīkst to rediģēt.',
          403,
        );
      }
    }

    await ensureCurrentPortalUser(context.locals.supabase, identity);
    if (
      'task_type' in parsed.data ||
      'source_module' in parsed.data ||
      'source_record_id' in parsed.data
    ) {
      await assertActiveQuotaTarget(
        context.locals.supabase,
        parsed.data.task_type ?? existing.data.task_type,
        'source_module' in parsed.data ? parsed.data.source_module : existing.data.source_module,
        'source_record_id' in parsed.data
          ? parsed.data.source_record_id
          : existing.data.source_record_id,
      );
    }
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
