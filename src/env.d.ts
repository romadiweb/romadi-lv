/// <reference types="astro/client" />

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { PortalIdentity } from '@/lib/portal/auth';

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL?: string;
    readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
    readonly SUPABASE_SECRET_KEY?: string;
    readonly SUPABASE_SERVICE_ROLE_KEY?: string;
    readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
    readonly TURNSTILE_SECRET_KEY?: string;
    readonly PORTAL_RATE_LIMIT_SECRET?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  namespace App {
    interface Locals {
      portalIdentity: PortalIdentity | null;
      supabase: SupabaseClient<Database> | null;
    }
  }
}

export {};
