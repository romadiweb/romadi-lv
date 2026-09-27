import { describe, expect, it } from 'vitest';
import { parsePortalTask } from './tasks';

const task = {
  assigned_to_user_id: '4c2bb402-4790-4b7e-b14d-4d40ba8e5b8f',
  description: 'Izpildīt šīs nedēļas uzrunāto lead kvotu.',
  due_date: '2026-09-30',
  priority: 'normal',
  source_module: 'quota-targets',
  source_record_id: 12,
  status: 'todo',
  task_type: 'quota',
  title: 'Uzrunāt 10 jaunus lead',
} as const;

describe('portal task validation', () => {
  it('accepts a task linked to an active quota target', () => {
    expect(parsePortalTask(task).success).toBe(true);
  });

  it('accepts a status-only completion update', () => {
    const result = parsePortalTask({ status: 'done' }, true);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ status: 'done' });
  });

  it('rejects malformed quota source identifiers', () => {
    expect(parsePortalTask({ ...task, source_module: 'portal_quota_targets' }).success).toBe(false);
  });
});
