import { z } from 'zod';

const withoutMarkup = (value: string) => !/[<>]/.test(value);
const cleanText = (max: number, min = 0) =>
  z.string().trim().min(min).max(max).refine(withoutMarkup, 'HTML markup is not allowed');
const slugKey = cleanText(80, 1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const mondayDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => new Date(`${value}T12:00:00`).getDay() === 1, 'Week must start on Monday');

const quotaTargetSchema = z
  .object({
    is_active: z.boolean(),
    label: cleanText(160, 1),
    metric_key: slugKey,
    module: slugKey,
    sort_order: z.number().int().min(0).max(1_000_000),
    target_value: z.number().int().min(1).max(1_000_000),
    week_start: mondayDate,
  })
  .strict();

export function parseQuotaTarget(value: unknown, partial = false) {
  if (!partial) return quotaTargetSchema.safeParse(value);

  return quotaTargetSchema
    .partial()
    .refine((record) => Object.keys(record).length > 0, 'No changes supplied')
    .safeParse(value);
}
