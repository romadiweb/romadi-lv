import { describe, expect, it } from 'vitest';
import { getKnownLeadSource, isGetAProSource } from './lead-sources';

describe('lead sources', () => {
  it('normalizes GetAPro spelling variants', () => {
    expect(getKnownLeadSource(' GetApro ')).toBe('GetAPro');
    expect(getKnownLeadSource('geta pro')).toBe('GetAPro');
    expect(isGetAProSource('GETA-PRO')).toBe(true);
  });

  it('keeps custom sources outside the controlled list', () => {
    expect(getKnownLeadSource('Ieteikums no klienta')).toBeNull();
    expect(isGetAProSource('Google')).toBe(false);
  });
});
