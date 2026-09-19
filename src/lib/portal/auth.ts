import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export type PortalRole = 'admin' | 'super-admin';

export interface PortalIdentity {
  id: string;
  email: string;
  role: PortalRole;
}

export class PortalAuthError extends Error {
  readonly status: number;

  constructor(message = 'Authentication required', status = 401) {
    super(message);
    this.name = 'PortalAuthError';
    this.status = status;
  }
}

const isPortalRole = (value: unknown): value is PortalRole =>
  value === 'admin' || value === 'super-admin';

export async function getPortalIdentity(
  supabase: SupabaseClient<Database>,
): Promise<PortalIdentity | null> {
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const claims = data.claims as Record<string, unknown>;
  const appMetadata = claims.app_metadata;
  const role =
    appMetadata && typeof appMetadata === 'object'
      ? (appMetadata as Record<string, unknown>).role
      : null;

  if (typeof claims.sub !== 'string' || !isPortalRole(role)) return null;

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : 'CMS lietotājs',
    role,
  };
}

export async function requirePortalIdentity(
  supabase: SupabaseClient<Database> | null,
): Promise<PortalIdentity> {
  if (!supabase) throw new PortalAuthError('Portal authentication is not configured', 503);

  const identity = await getPortalIdentity(supabase);
  if (!identity) throw new PortalAuthError();
  return identity;
}

export async function requireSuperAdmin(
  supabase: SupabaseClient<Database> | null,
): Promise<PortalIdentity> {
  const identity = await requirePortalIdentity(supabase);
  if (identity.role !== 'super-admin') {
    throw new PortalAuthError('Super-admin permission required', 403);
  }
  return identity;
}
