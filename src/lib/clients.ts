import type { PortfolioProject, ProjectProof } from './projects';

// Klienti is the single CMS collection: client identity and portfolio details
// share a record, so publication, renaming and ordering cannot drift apart.
export const selectWebsiteProofs = (projects: PortfolioProject[]): ProjectProof[] =>
  projects
    .filter(
      (project) =>
        project.type === 'website' &&
        project.status === 'completed' &&
        project.metallic_logo_url?.trim(),
    )
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map(({ id, name, slug, metallic_logo_url, sort_order }) => ({
      id,
      name,
      slug,
      logo_url: metallic_logo_url,
      sort_order,
    }));

export const selectClientPartners = (projects: PortfolioProject[]) =>
  projects
    .filter((project) => project.show_in_partners)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map(({ name, slug, partner_logo_url, project_url }) => ({
      name,
      slug,
      logo: partner_logo_url,
      href: project_url ?? '/portfolio',
    }));
