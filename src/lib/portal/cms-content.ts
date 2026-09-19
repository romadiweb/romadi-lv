import { z } from 'zod';

export const CMS_RESOURCES = ['projects', 'reviews', 'pricing_plans'] as const;
export type CmsResource = (typeof CMS_RESOURCES)[number];

export const isCmsResource = (value: string | undefined): value is CmsResource =>
  CMS_RESOURCES.includes(value as CmsResource);

const withoutMarkup = (value: string) => !/[<>]/.test(value);
const cleanText = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine(withoutMarkup, 'HTML markup is not allowed');

const nullableText = (max: number) => z.union([cleanText(max), z.null()]);
const slug = cleanText(100, 1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const safeWebUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => {
    try {
      return ['https:', 'http:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, 'Only HTTP(S) URLs are allowed');
const safeAssetUrl = z.union([
  safeWebUrl,
  z.string().trim().max(500).regex(/^\/(?!\/)[^<>]*$/),
]);
const safeLink = z.union([
  safeWebUrl,
  z.string().trim().max(500).regex(/^(?:\/|#)[^<>]*$/),
]);
const nullable = <T extends z.ZodType>(schema: T) => z.union([schema, z.null()]);
const textList = z.array(cleanText(200, 1)).max(50);

const projectSchema = z
  .object({
    alt_text: nullableText(300),
    build_platform: cleanText(120),
    challenge: nullableText(4_000),
    completed_at: nullable(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    features: textList,
    integrations: textList,
    is_featured: z.boolean(),
    is_published: z.boolean(),
    logo_url: nullable(safeAssetUrl),
    name: cleanText(160, 1),
    portfolio_image_url: nullable(safeAssetUrl),
    project_url: nullable(safeWebUrl),
    slug,
    solution: nullableText(4_000),
    sort_order: z.number().int().min(0).max(1_000_000),
    summary: nullableText(1_000),
    technologies: textList,
    type: cleanText(80, 1),
  })
  .strict();

const reviewSchema = z
  .object({
    client_name: cleanText(160, 1),
    client_url: nullable(safeWebUrl),
    is_published: z.boolean(),
    logo_url: nullable(safeAssetUrl),
    quote: nullableText(4_000),
    rating: nullable(z.number().int().min(1).max(5)),
    reviewer_name: nullableText(160),
    reviewer_role: nullableText(160),
    slug,
    sort_order: z.number().int().min(0).max(1_000_000),
  })
  .strict();

const pricingSchema = z
  .object({
    cta_href: nullable(safeLink),
    cta_label: cleanText(120, 1),
    description: cleanText(2_000, 1),
    features: textList,
    is_featured: z.boolean(),
    is_published: z.boolean(),
    name: cleanText(160, 1),
    price_label: cleanText(120, 1),
    price_prefix: cleanText(120),
    service_key: slug,
    sort_order: z.number().int().min(0).max(1_000_000),
  })
  .strict();

const schemas = {
  pricing_plans: pricingSchema,
  projects: projectSchema,
  reviews: reviewSchema,
};

export function parseCmsContent(resource: CmsResource, value: unknown, partial = false) {
  if (!partial) return schemas[resource].safeParse(value);

  const notEmpty = (record: Record<string, unknown>) => Object.keys(record).length > 0;
  if (resource === 'projects') {
    return projectSchema.partial().refine(notEmpty, 'No changes supplied').safeParse(value);
  }
  if (resource === 'reviews') {
    return reviewSchema.partial().refine(notEmpty, 'No changes supplied').safeParse(value);
  }
  return pricingSchema.partial().refine(notEmpty, 'No changes supplied').safeParse(value);
}
