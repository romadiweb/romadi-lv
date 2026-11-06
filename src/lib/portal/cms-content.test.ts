import { describe, expect, it } from 'vitest';
import { parseCmsContent } from './cms-content';

describe('client display fields', () => {
  it('saves logo readiness and partner visibility together', () => {
    const data = {
      metallic_logo_url: '/images/approved.webp',
      partner_logo_url: '/images/white.svg',
      show_in_partners: true,
    };
    const result = parseCmsContent('projects', data, true);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(data);
  });

  it('does not reset client display settings on unrelated partial edits', () => {
    const result = parseCmsContent('projects', { name: 'Renamed client' }, true);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ name: 'Renamed client' });
  });

  it('allows removing the metallic logo and rejects unsafe asset URLs', () => {
    expect(parseCmsContent('projects', { metallic_logo_url: null }, true).success).toBe(true);
    expect(
      parseCmsContent('projects', { metallic_logo_url: 'javascript:alert(1)' }, true).success,
    ).toBe(false);
  });
});
