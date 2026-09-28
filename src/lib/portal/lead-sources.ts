export const OTHER_LEAD_SOURCE = '__other__';

export const LEAD_SOURCE_OPTIONS = ['TikTok', 'Facebook', 'Google', 'GetAPro'] as const;

const normalizeLeadSource = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase('lv-LV')
    .replace(/[\s_-]+/g, '');

const leadSourceByNormalizedValue = new Map(
  LEAD_SOURCE_OPTIONS.map((source) => [normalizeLeadSource(source), source]),
);

export const getKnownLeadSource = (value: string) =>
  leadSourceByNormalizedValue.get(normalizeLeadSource(value)) ?? null;

export const isGetAProSource = (value: string) => getKnownLeadSource(value) === 'GetAPro';
