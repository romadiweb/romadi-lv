import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { transform } from '@astrojs/compiler-rs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { LEAD_SOURCE_OPTIONS, OTHER_LEAD_SOURCE } from '../../../src/lib/portal/lead-sources';

/** Render the real dashboard with a test identity, without changing production auth. */
export async function renderPortalFixture(role = 'admin') {
  const source = await readFile('src/pages/portal/dashboard.astro', 'utf8');
  const template = source
    .replace(
      /^---[\s\S]*?---/,
      `---
const identity = Astro.locals.portalIdentity;
const csrfToken = 'test-csrf';
const LEAD_SOURCE_OPTIONS = ${JSON.stringify(LEAD_SOURCE_OPTIONS)};
const OTHER_LEAD_SOURCE = ${JSON.stringify(OTHER_LEAD_SOURCE)};
---`,
    )
    .replace(
      /<PortalLayout[\s\S]*?>/,
      '<html lang="lv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/src/styles/global.css"><link rel="stylesheet" href="/node_modules/@fontsource-variable/manrope/index.css"><link rel="stylesheet" href="/src/styles/portal.css"></head><body class="portal-body">',
    )
    .replace('</PortalLayout>', '</body></html>')
    .replace(/<script>[\s\S]*?<\/script>/, '');
  const compiled = transform(template, {
    filename: 'portal-fixture.astro',
    internalURL: 'astro/compiler-runtime',
    resultScopedSlot: true,
  });
  const modulePath = resolve('.astro/portal-fixture.mjs');
  // Vite normally removes this unused compiler metadata before loading the module.
  const code = compiled.code
    .replace(', createMetadata as $$createMetadata', '')
    .replace(/export const \$\$metadata = \$\$createMetadata\([\s\S]*?\n\}\);/, '');
  await writeFile(modulePath, code);
  const { default: component } = await import(pathToFileURL(modulePath).href);
  const container = await AstroContainer.create();
  return container.renderToString(component, {
    locals: {
      portalIdentity: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'me@romadi.lv',
        role: role as 'admin' | 'super-admin',
      },
      supabase: null,
    },
  });
}
