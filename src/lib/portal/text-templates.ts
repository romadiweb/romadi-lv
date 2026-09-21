import { z } from 'zod';

const trimmedText = (max: number) => z.string().trim().min(1).max(max);

export const textTemplateVariantSchema = z
  .object({
    id: z.uuid(),
    label: trimmedText(80),
    content: trimmedText(12_000),
  })
  .strict();

const textTemplateFields = z
  .object({
    title: trimmedText(160),
    category: trimmedText(100),
    notes: z
      .string()
      .trim()
      .max(2_000)
      .transform((value) => value || null)
      .nullable(),
    variants: z.array(textTemplateVariantSchema).min(1).max(12),
  })
  .strict();

const uniqueVariantLabels = (
  value: { variants?: { label: string }[] },
  context: z.RefinementCtx,
) => {
  if (!value.variants) return;
  const labels = new Set<string>();
  value.variants.forEach((variant, index) => {
    const normalized = variant.label.toLocaleLowerCase('lv-LV');
    if (labels.has(normalized)) {
      context.addIssue({
        code: 'custom',
        message: 'Katram tonim jābūt ar unikālu nosaukumu.',
        path: ['variants', index, 'label'],
      });
    }
    labels.add(normalized);
  });
};

export const textTemplateSchema = textTemplateFields.superRefine(uniqueVariantLabels);

export function parseTextTemplate(value: unknown, partial = false) {
  if (!partial) return textTemplateSchema.safeParse(value);
  return textTemplateFields
    .partial()
    .refine((record) => Object.keys(record).length > 0, 'No changes supplied')
    .superRefine(uniqueVariantLabels)
    .safeParse(value);
}

export type TextTemplateInput = z.infer<typeof textTemplateSchema>;
export type TextTemplateVariant = z.infer<typeof textTemplateVariantSchema>;
