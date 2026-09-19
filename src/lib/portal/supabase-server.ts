import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { APIContext } from 'astro';
import type { CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';

const getEnv = (key: keyof ImportMetaEnv): string | undefined => {
  const values: Partial<Record<keyof ImportMetaEnv, string | undefined>> = {
    PUBLIC_SUPABASE_URL:
      import.meta.env.PUBLIC_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY:
      import.meta.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY:
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
    PUBLIC_TURNSTILE_SITE_KEY:
      import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? process.env.PUBLIC_TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY:
      import.meta.env.TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET_KEY,
    PORTAL_RATE_LIMIT_SECRET:
      import.meta.env.PORTAL_RATE_LIMIT_SECRET ?? process.env.PORTAL_RATE_LIMIT_SECRET,
  };

  return values[key];
};

export const getPublicSupabaseConfig = () => {
  const url = getEnv('PUBLIC_SUPABASE_URL');
  const publishableKey = getEnv('PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  return url && publishableKey ? { url, publishableKey } : null;
};

const toAstroCookieOptions = (options: CookieOptions) => ({
  domain: options.domain,
  expires: options.expires,
  httpOnly: true,
  maxAge: options.maxAge,
  path: options.path ?? '/',
  sameSite: 'strict' as const,
  secure: import.meta.env.PROD,
});

export function createPortalSupabase(
  context: APIContext,
  responseHeaders?: Headers,
) {
  const config = getPublicSupabaseConfig();
  if (!config) return null;

  return createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request.headers.get('cookie') ?? '').flatMap(
          ({ name, value }) => (value === undefined ? [] : [{ name, value }]),
        );
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          context.cookies.set(name, value, toAstroCookieOptions(options));
        }

        if (responseHeaders) {
          for (const [name, value] of Object.entries(headers)) {
            responseHeaders.set(name, value);
          }
        }
      },
    },
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: import.meta.env.PROD,
    },
  });
}

export function createPortalAdminClient() {
  const config = getPublicSupabaseConfig();
  const secretKey = getEnv('SUPABASE_SECRET_KEY') ?? getEnv('SUPABASE_SERVICE_ROLE_KEY');
  if (!config || !secretKey) return null;

  return createClient<Database>(config.url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

export const getPortalEnvironment = () => ({
  rateLimitSecret:
    getEnv('PORTAL_RATE_LIMIT_SECRET') ??
    (import.meta.env.DEV ? 'romadi-local-rate-limit-secret-change-me' : undefined),
  turnstileSecret:
    getEnv('TURNSTILE_SECRET_KEY') ??
    (import.meta.env.DEV ? '1x0000000000000000000000000000000AA' : undefined),
  turnstileSiteKey:
    getEnv('PUBLIC_TURNSTILE_SITE_KEY') ??
    (import.meta.env.DEV ? '1x00000000000000000000AA' : undefined),
});
