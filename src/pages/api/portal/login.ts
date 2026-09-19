import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getPortalIdentity } from '@/lib/portal/auth';
import {
  createPortalAdminClient,
  getPortalEnvironment,
} from '@/lib/portal/supabase-server';
import {
  assertSameOrigin,
  createRateLimitKey,
  getTrustedClientAddress,
  verifyTurnstile,
} from '@/lib/portal/security';

export const prerender = false;

const loginSchema = z.object({
  email: z.email().trim().max(254),
  password: z.string().min(1).max(1_024),
  turnstileToken: z.string().min(1).max(2_048),
});

const loginRedirect = (request: Request, error: string, retryAfter?: number) => {
  const url = new URL('/portal/login', request.url);
  url.searchParams.set('error', error);
  if (retryAfter) url.searchParams.set('retry', String(retryAfter));
  return new Response(null, {
    status: 303,
    headers: {
      'cache-control': 'no-store',
      location: url.pathname + url.search,
      ...(retryAfter ? { 'retry-after': String(retryAfter) } : {}),
    },
  });
};

export const POST: APIRoute = async (context) => {
  try {
    assertSameOrigin(context.request);
    if (!context.locals.supabase) return loginRedirect(context.request, 'configuration');

    const form = await context.request.formData();
    const parsed = loginSchema.safeParse({
      email: form.get('email'),
      password: form.get('password'),
      turnstileToken: form.get('cf-turnstile-response'),
    });
    if (!parsed.success) return loginRedirect(context.request, 'invalid');

    const environment = getPortalEnvironment();
    const admin = createPortalAdminClient();
    if (!admin || !environment.rateLimitSecret || !environment.turnstileSecret) {
      return loginRedirect(context.request, 'configuration');
    }

    const remoteIp = getTrustedClientAddress(context);
    const rateKey = await createRateLimitKey(
      parsed.data.email,
      remoteIp,
      environment.rateLimitSecret,
    );
    const { data: rateRows, error: rateError } = await admin.rpc(
      'consume_portal_login_attempt',
      { p_rate_key: rateKey },
    );
    if (rateError) throw rateError;

    const rate = rateRows?.[0];
    if (!rate?.allowed) {
      return loginRedirect(context.request, 'rate', rate?.retry_after_seconds ?? 900);
    }

    const turnstileValid = await verifyTurnstile({
      token: parsed.data.turnstileToken,
      secret: environment.turnstileSecret,
      remoteIp,
      expectedHostname: new URL(context.request.url).hostname,
    });
    if (!turnstileValid) return loginRedirect(context.request, 'turnstile');

    const { error: signInError } = await context.locals.supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (signInError) return loginRedirect(context.request, 'invalid');

    const identity = await getPortalIdentity(context.locals.supabase);
    if (!identity) {
      await context.locals.supabase.auth.signOut();
      return loginRedirect(context.request, 'forbidden');
    }

    await admin.rpc('reset_portal_login_attempts', { p_rate_key: rateKey });
    return context.redirect('/portal/dashboard', 303);
  } catch (error) {
    console.error('Portal login failed', error);
    return loginRedirect(context.request, 'unavailable');
  }
};
