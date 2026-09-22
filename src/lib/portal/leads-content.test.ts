import { describe, expect, it } from 'vitest';
import { parseLeadContent } from './leads-content';

const lead = {
  company_name: 'Jauns uzņēmums',
  contact_channel: 'instagram',
  contacted_at: null,
  follow_up_enabled: false,
  found_on: 'Instagram',
  has_website: false,
  high_priority: false,
  industry: null,
  notes: null,
  outreach_owner: null,
  status: 'not_contacted',
} as const;

describe('lead content validation', () => {
  it('allows saving a lead before outreach', () => {
    expect(parseLeadContent(lead).success).toBe(true);
  });

  it('requires an outreach owner after contact', () => {
    const result = parseLeadContent({ ...lead, status: 'contacted' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ['outreach_owner'] })]),
      );
    }
  });

  it('allows contacted leads when an outreach owner is present', () => {
    expect(
      parseLeadContent({ ...lead, status: 'contacted', outreach_owner: 'Roberts' }).success,
    ).toBe(true);
  });
});
