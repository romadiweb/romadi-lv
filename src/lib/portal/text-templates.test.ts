import { describe, expect, it } from 'vitest';
import { parseTextTemplate } from './text-templates';

const template = {
  category: 'Viesu mājas',
  notes: 'Pirmajai uzrunai sociālajos tīklos.',
  title: 'Mājaslapas uzrunas teksts',
  variants: [
    {
      content: 'Labdien! Vēlētos aprunāties par jūsu mājaslapu.',
      id: '9f844327-fe55-421b-ae9d-36eb7a2f6110',
      label: 'Formāls',
    },
    {
      content: 'Sveiki! Pamanīju jūsu viesu māju un radās viena ideja.',
      id: '9d151eea-a2a8-4235-82c7-85b4a99ba45d',
      label: 'Draudzīgs',
    },
  ],
};

describe('text template validation', () => {
  it('accepts multiple named tone variants', () => {
    expect(parseTextTemplate(template).success).toBe(true);
  });

  it('normalizes blank notes to null', () => {
    const result = parseTextTemplate({ ...template, notes: '   ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.notes).toBeNull();
  });

  it('rejects duplicate tone labels regardless of letter case', () => {
    const result = parseTextTemplate({
      ...template,
      variants: [template.variants[0], { ...template.variants[1], label: 'formāls' }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ['variants', 1, 'label'] })]),
      );
    }
  });

  it('requires at least one non-empty variant', () => {
    expect(parseTextTemplate({ ...template, variants: [] }).success).toBe(false);
  });
});
