import type { APIContext } from 'astro';
import { z } from 'zod';

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
});

export class PortalRequestError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'PortalRequestError';
    this.status = status;
  }
}

export function assertSameOrigin(request: Request): void {
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (!source) throw new PortalRequestError('Request origin is missing', 403);

  let sourceOrigin: string;
  try {
    sourceOrigin = new URL(source).origin;
  } catch {
    throw new PortalRequestError('Request origin is invalid', 403);
  }

  if (sourceOrigin !== new URL(request.url).origin) {
    throw new PortalRequestError('Cross-origin request rejected', 403);
  }
}

export function assertCsrf(context: APIContext): void {
  const cookieToken = context.cookies.get('portal_csrf')?.value;
  const requestToken =
    context.request.headers.get('x-csrf-token') ??
    (context.request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')
      ? null
      : undefined);

  if (!cookieToken || !requestToken || cookieToken !== requestToken) {
    throw new PortalRequestError('Security token expired. Refresh the page and try again.', 403);
  }
}

export function getTrustedClientAddress(context: APIContext): string {
  try {
    return context.clientAddress || 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function createRateLimitKey(
  email: string,
  address: string,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${email.trim().toLowerCase()}\n${address}`),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyTurnstile(options: {
  token: string;
  secret: string;
  remoteIp: string;
  expectedHostname: string;
}): Promise<boolean> {
  if (!options.token || options.token.length > 2048) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: options.secret,
        response: options.token,
        remoteip: options.remoteIp === 'unknown' ? undefined : options.remoteIp,
        idempotency_key: crypto.randomUUID(),
      }),
      signal: controller.signal,
    });

    if (!response.ok) return false;
    const parsed = turnstileResponseSchema.safeParse(await response.json());
    if (!parsed.success || !parsed.data.success) return false;

    const isTestKey = options.secret.startsWith('1x0000000000000000000000000000000');
    if (isTestKey) return true;
    if (!isTestKey && parsed.data.hostname !== options.expectedHostname) return false;
    return parsed.data.action === 'portal_login';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export const jsonResponse = (body: unknown, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
