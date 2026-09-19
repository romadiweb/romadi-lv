import { defineMiddleware } from 'astro:middleware';
import { getPortalIdentity } from '@/lib/portal/auth';
import { createPortalSupabase, getPublicSupabaseConfig } from '@/lib/portal/supabase-server';

const isPortalRequest = (pathname: string) =>
  pathname === '/portal' ||
  pathname.startsWith('/portal/') ||
  pathname.startsWith('/api/portal/');

const portalCsp = () => {
  const supabaseOrigin = getPublicSupabaseConfig()?.url ?? '';
  const developmentConnections = import.meta.env.DEV ? ' ws: http://localhost:*' : '';

  return [
    "default-src 'self'",
    "base-uri 'self'",
    `connect-src 'self' ${supabaseOrigin} https://challenges.cloudflare.com${developmentConnections}`,
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src https://challenges.cloudflare.com",
    "img-src 'self' data: https:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
  ].join('; ');
};

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.portalIdentity = null;
  context.locals.supabase = null;

  if (!isPortalRequest(context.url.pathname)) return next();

  const authHeaders = new Headers();
  const supabase = createPortalSupabase(context, authHeaders);
  context.locals.supabase = supabase;

  if (supabase) {
    context.locals.portalIdentity = await getPortalIdentity(supabase);
  }

  if (context.url.pathname === '/portal') {
    return context.redirect(
      context.locals.portalIdentity ? '/portal/dashboard' : '/portal/login',
      303,
    );
  }

  if (context.url.pathname === '/portal/dashboard' && !context.locals.portalIdentity) {
    return context.redirect('/portal/login?reason=session', 303);
  }

  if (context.url.pathname === '/portal/login' && context.locals.portalIdentity) {
    return context.redirect('/portal/dashboard', 303);
  }

  const response = await next();
  response.headers.set('cache-control', 'private, no-cache, no-store, must-revalidate');
  response.headers.set('content-security-policy', portalCsp());
  response.headers.set('cross-origin-opener-policy', 'same-origin');
  response.headers.set('referrer-policy', 'same-origin');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');

  for (const [name, value] of authHeaders) response.headers.set(name, value);
  return response;
});
