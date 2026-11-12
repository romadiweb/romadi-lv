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
const fields = 'first_name, last_name, photo';
const profileSchema = z
  .object({
    first_name: z.string().trim().min(1).max(60),
    last_name: z.string().trim().min(1).max(60),
    photo: z
      .string()
      .max(100_000)
      .regex(/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+={0,2}$/)
      .optional(),
  })
  .strict();

function failure(error: unknown) {
  if (error instanceof PortalAuthError || error instanceof PortalRequestError) {
    return jsonResponse({ error: error.message }, error.status);
  }
  if (error instanceof SyntaxError) return jsonResponse({ error: 'Nederīgs pieprasījums.' }, 400);
  console.error('Portal profile request failed', error);
  return jsonResponse({ error: 'Profilu neizdevās apstrādāt.' }, 500);
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    const identity = await requirePortalIdentity(locals.supabase);
    const { data, error } = await locals
      .supabase!.from('portal_self_profiles')
      .select(fields)
      .eq('id', identity.id)
      .maybeSingle();
    if (error) throw error;
    return jsonResponse({ data });
  } catch (error) {
    return failure(error);
  }
};

export const PATCH: APIRoute = async (context) => {
  try {
    const { locals, request } = context;
    const identity = await requirePortalIdentity(locals.supabase);
    assertSameOrigin(request);
    assertCsrf(context);
    if (Number(request.headers.get('content-length')) > 102_400) {
      return jsonResponse({ error: 'Profila foto ir pārāk liels.' }, 413);
    }
    const body = await request.text();
    if (body.length > 102_400) return jsonResponse({ error: 'Profila foto ir pārāk liels.' }, 413);
    const parsed = profileSchema.safeParse(JSON.parse(body));
    if (!parsed.success) return jsonResponse({ error: 'Pārbaudi vārdu, uzvārdu un foto.' }, 422);
    const { data, error } = await locals
      .supabase!.from('portal_self_profiles')
      .upsert({ id: identity.id, ...parsed.data }, { onConflict: 'id', defaultToNull: false })
      .select(fields)
      .single();
    if (error) throw error;
    return jsonResponse({ data });
  } catch (error) {
    return failure(error);
  }
};
