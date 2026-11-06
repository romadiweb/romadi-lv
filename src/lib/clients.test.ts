import { describe, expect, it } from 'vitest';
import { selectClientPartners, selectWebsiteProofs } from './clients';
import type { PortfolioProject } from './projects';

const client = (overrides: Partial<PortfolioProject> = {}): PortfolioProject => ({
  id: 1,
  name: 'Client',
  slug: 'client',
  type: 'website',
  status: 'completed',
  logo_url: '/logo.png',
  partner_logo_url: '/flat-logo.svg',
  metallic_logo_url: '/metallic.webp',
  show_in_partners: true,
  project_url: 'https://example.com',
  sort_order: 10,
  summary: null,
  portfolio_image_url: null,
  alt_text: null,
  build_platform: null,
  challenge: null,
  solution: null,
  features: [],
  technologies: [],
  integrations: [],
  is_featured: false,
  completed_at: null,
  ...overrides,
});

describe('shared client displays', () => {
  it('requires a completed website and an approved metallic logo for proof', () => {
    const clients = [
      client(),
      client({ id: 2, status: 'in_progress' }),
      client({ id: 3, metallic_logo_url: null }),
      client({ id: 4, metallic_logo_url: '  ' }),
      client({ id: 5, type: 'design' }),
    ];
    expect(selectWebsiteProofs(clients).map((proof) => proof.id)).toEqual([1]);
    expect(selectWebsiteProofs(clients)[0]!.logo_url).toBe('/metallic.webp');
    expect(selectClientPartners(clients)).toHaveLength(5);
    expect(selectClientPartners(clients)[0]?.logo).toBe('/flat-logo.svg');
  });

  it('keeps renamed clients, ordering and logo readiness synchronized', () => {
    const clients = [
      client({ id: 2, sort_order: 20 }),
      client({ name: 'Updated client', sort_order: 0 }),
    ];
    expect(selectClientPartners(clients)[0]!.name).toBe('Updated client');
    expect(selectWebsiteProofs(clients)[0]!.name).toBe('Updated client');
    clients[0]!.metallic_logo_url = null;
    expect(selectWebsiteProofs(clients)).toHaveLength(1);
    expect(selectClientPartners(clients)).toHaveLength(2);
  });

  it('supports partner opt-out and clients without a logo or website', () => {
    expect(selectClientPartners([client({ show_in_partners: false })])).toEqual([]);
    expect(
      selectClientPartners([client({ partner_logo_url: null, project_url: null })])[0],
    ).toMatchObject({
      name: 'Client',
      logo: null,
      href: '/portfolio',
    });
    expect(selectClientPartners([])).toEqual([]);
    expect(selectWebsiteProofs([])).toEqual([]);
  });
});
