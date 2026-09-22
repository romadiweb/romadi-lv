import { z } from 'zod';

export const portalTaskStatuses = ['todo', 'in_progress', 'done', 'blocked', 'cant_do'] as const;
export const portalTaskPriorities = ['low', 'normal', 'high', 'max', 'critical'] as const;
export const portalTaskTypes = ['manual', 'new_client', 'bug', 'lead_followup', 'quota'] as const;

const withoutMarkup = (value: string) => !/[<>]/.test(value);
const cleanText = (max: number, min = 0) =>
  z.string().trim().min(min).max(max).refine(withoutMarkup, 'HTML markup is not allowed');
const nullableText = (max: number) => z.union([cleanText(max), z.null()]);
const nullableDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()]);
const nullableUuid = z.union([z.uuid(), z.null()]);
const sourceModule = z.union([cleanText(80, 1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), z.null()]);

const taskFields = z
  .object({
    assigned_to: nullableText(160).optional(),
    assigned_to_user_id: nullableUuid,
    description: nullableText(4_000),
    due_date: nullableDate,
    priority: z.enum(portalTaskPriorities),
    source_module: sourceModule,
    source_record_id: z.union([z.number().int().positive(), z.null()]),
    status: z.enum(portalTaskStatuses),
    task_type: z.enum(portalTaskTypes),
    title: cleanText(180, 1),
  })
  .strict();

const withPriorityRules = <
  T extends {
    priority?: (typeof portalTaskPriorities)[number];
    task_type?: (typeof portalTaskTypes)[number];
  },
>(
  task: T,
) => {
  const priority =
    task.task_type === 'bug' ? 'critical' : task.task_type === 'new_client' ? 'max' : task.priority;

  return priority ? { ...task, priority } : task;
};

const taskSchema = taskFields.transform(withPriorityRules);

export function parsePortalTask(value: unknown, partial = false) {
  if (!partial) return taskSchema.safeParse(value);

  return taskFields
    .partial()
    .refine((record) => Object.keys(record).length > 0, 'No changes supplied')
    .transform(withPriorityRules)
    .safeParse(value);
}
