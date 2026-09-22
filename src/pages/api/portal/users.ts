import type { APIRoute } from 'astro';
import type { Database } from '@/types/database';
import { PortalAuthError, type PortalRole, requirePortalIdentity } from '@/lib/portal/auth';
import { createPortalAdminClient } from '@/lib/portal/supabase-server';
import { jsonResponse, PortalRequestError } from '@/lib/portal/security';

export const prerender = false;

type PortalUserInsert = Database['public']['Tables']['portal_users']['Insert'];

const migrationName = '20260922125453_create_portal_users_and_task_assignments.sql';

const isPortalRole = (value: unknown): value is PortalRole =>
  value === 'admin' || value === 'super-admin';

const readMetadataName = (metadata: unknown) => {
  if (!metadata || typeof metadata !== 'object') return null;
  const record = metadata as Record<string, unknown>;
  const name = record.full_name ?? record.name;
  return typeof name === 'string' && name.trim() ? name.trim() : null;
};

const errorResponse = (error: unknown) => {
  if (error instanceof PortalAuthError || error instanceof PortalRequestError) {
    return jsonResponse({ error: error.message }, error.status);
  }

  const supabaseError = error as { code?: unknown; message?: unknown };
  const code = typeof supabaseError.code === 'string' ? supabaseError.code : '';
  const message = typeof supabaseError.message === 'string' ? supabaseError.message : '';

  if (code === '42P01' || code === 'PGRST205' || message.includes('portal_users')) {
    console.error('Portal users table is not available', error);
    return jsonResponse(
      {
        error: `Lietotāju tabula vēl nav izveidota Supabase. Palaid migrāciju ${migrationName} un pārlādē portālu.`,
      },
      503,
    );
  }

  console.error('Portal users endpoint failed', error);
  return jsonResponse({ error: 'The user directory could not be loaded.' }, 500);
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const identity = await requirePortalIdentity(locals.supabase);
    if (!locals.supabase) return jsonResponse({ error: 'Not found' }, 404);

    const admin = createPortalAdminClient();
    const now = new Date().toISOString();
    const currentUser: PortalUserInsert = {
      display_name: null,
      email: identity.email,
      id: identity.id,
      is_active: true,
      last_seen_at: now,
      role: identity.role,
    };

    if (admin) {
      const { data: authData, error: authError } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (authError) throw authError;

      const users: PortalUserInsert[] = [];
      for (const user of authData.users ?? []) {
        const role = user.app_metadata?.role;
        if (!user.email || !isPortalRole(role)) continue;
        users.push({
          display_name: readMetadataName(user.user_metadata),
          email: user.email,
          id: user.id,
          is_active: true,
          last_seen_at: user.id === identity.id ? now : (user.last_sign_in_at ?? null),
          role,
        });
      }

      if (!users.some((user) => user.id === identity.id)) users.push(currentUser);

      const syncResult = await admin.from('portal_users').upsert(users, { onConflict: 'id' });
      if (syncResult.error) throw syncResult.error;
    } else {
      const syncResult = await locals.supabase
        .from('portal_users')
        .upsert(currentUser, { onConflict: 'id' });
      if (syncResult.error) throw syncResult.error;
    }

    const result = await locals.supabase
      .from('portal_users')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true, nullsFirst: false })
      .order('email', { ascending: true });

    if (result.error) throw result.error;
    return jsonResponse({ data: result.data });
  } catch (error) {
    return errorResponse(error);
  }
};
