import type { APIRoute } from 'astro';
import { z } from 'zod';
import { PortalAuthError, requirePortalIdentity } from '@/lib/portal/auth';
import {
  assertCsrf,
  assertSameOrigin,
  jsonResponse,
  PortalRequestError,
} from '@/lib/portal/security';

export const prerender = false;

const eventSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    event_date: z.iso.date(),
    event_type: z.enum(['event', 'social']),
    tag: z.string().trim().max(80),
    notes: z.string().trim().max(4000),
  })
  .strict();

function failure(error: unknown) {
  if (error instanceof PortalAuthError || error instanceof PortalRequestError) {
    return jsonResponse({ error: error.message }, error.status);
  }
  console.error('Calendar request failed', error);
  return jsonResponse({ error: 'Kalendāra pieprasījums neizdevās.' }, 500);
}

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    await requirePortalIdentity(locals.supabase);
    const month = url.searchParams.get('month') ?? '';
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return jsonResponse({ error: 'Norādi kalendāra mēnesi.' }, 400);
    }
    const next = new Date(month + '-01T12:00:00Z');
    next.setUTCMonth(next.getUTCMonth() + 1);
    const { data, error } = await locals
      .supabase!.from('portal_calendar_events')
      .select('*')
      .gte('event_date', month + '-01')
      .lt('event_date', next.toISOString().slice(0, 10))
      .order('event_date')
      .order('id');
    if (error) throw error;
    return jsonResponse({ data });
  } catch (error) {
    return failure(error);
  }
};

export const POST: APIRoute = async (context) => {
  try {
    await requirePortalIdentity(context.locals.supabase);
    assertSameOrigin(context.request);
    assertCsrf(context);
    const body = await context.request.text();
    if (body.length > 20000) return jsonResponse({ error: 'Notikuma teksts ir pārāk garš.' }, 413);
    const parsed = eventSchema.safeParse(JSON.parse(body));
    if (!parsed.success) return jsonResponse({ error: 'Pārbaudi notikuma laukus.' }, 422);
    const { data, error } = await context.locals
      .supabase!.from('portal_calendar_events')
      .insert(parsed.data)
      .select()
      .single();
    if (error) throw error;
    return jsonResponse({ data }, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return jsonResponse({ error: 'Nederīgs pieprasījums.' }, 400);
    return failure(error);
  }
};
