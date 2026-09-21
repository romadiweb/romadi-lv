import { z } from 'zod';

export const LEAD_STATUSES = [
  'not_contacted',
  'contacted',
  'answered',
  'interested',
  'offer_sent',
  'negotiation',
  'client',
  'rejected',
  'no_response',
  'deferred',
] as const;

export const LEAD_CONTACT_CHANNELS = [
  'instagram',
  'facebook',
  'linkedin',
  'tiktok',
  'email',
  'phone',
  'other',
] as const;

const withoutMarkup = (value: string) => !/[<>]/.test(value);
const cleanText = (max: number, min = 0) =>
  z.string().trim().min(min).max(max).refine(withoutMarkup, 'HTML markup is not allowed');
const nullableText = (max: number) => z.union([cleanText(max), z.null()]);
const nullableDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()]);

const leadFields = z
  .object({
    company_name: cleanText(180, 1),
    contact_channel: z.enum(LEAD_CONTACT_CHANNELS),
    contacted_at: nullableDate,
    follow_up_enabled: z.boolean(),
    found_on: cleanText(180, 1),
    has_website: z.boolean(),
    industry: nullableText(120),
    notes: nullableText(4_000),
    outreach_owner: nullableText(120),
    status: z.enum(LEAD_STATUSES),
  })
  .strict();

export const leadSchema = leadFields.superRefine((lead, context) => {
  if (lead.status !== 'not_contacted' && !lead.outreach_owner) {
    context.addIssue({
      code: 'custom',
      message: 'Norādi, kurš uzrunāja lead.',
      path: ['outreach_owner'],
    });
  }
});

export function parseLeadContent(value: unknown, partial = false) {
  if (!partial) return leadSchema.safeParse(value);
  return leadFields
    .partial()
    .refine((record) => Object.keys(record).length > 0, 'No changes supplied')
    .safeParse(value);
}
