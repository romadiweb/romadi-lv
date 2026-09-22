import { z } from 'zod';

const withoutMarkup = (value: string) => !/[<>]/.test(value);
const cleanText = (max: number, min = 0) =>
  z.string().trim().min(min).max(max).refine(withoutMarkup, 'HTML markup is not allowed');

const nullableText = (max: number) => z.union([cleanText(max), z.null()]);
const itemKey = cleanText(100, 1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const pricingItemCategories = [
  'base',
  'page',
  'integration',
  'addon',
  'hourly',
  'adjustment',
] as const;

export const pricingItemUnits = ['project', 'page', 'item', 'hour'] as const;

const pricingItemSchema = z
  .object({
    category: z.enum(pricingItemCategories),
    default_quantity: z.number().min(0.01).max(10_000),
    description: nullableText(1_000),
    is_active: z.boolean(),
    item_key: itemKey,
    name: cleanText(160, 1),
    price_eur: z.number().min(0).max(1_000_000),
    sort_order: z.number().int().min(0).max(1_000_000),
    unit: z.enum(pricingItemUnits),
  })
  .strict();

export function parsePricingItem(value: unknown, partial = false) {
  if (!partial) return pricingItemSchema.safeParse(value);

  return pricingItemSchema
    .partial()
    .refine((record) => Object.keys(record).length > 0, 'No changes supplied')
    .safeParse(value);
}
