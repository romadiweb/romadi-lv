import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Replace before production launch.
  site: 'https://romadi.lv',

  // Static-first architecture for maximum performance and crawlability.
  output: 'static',

  trailingSlash: 'never',

  redirects: {
    '/majas-lapu-izstrade': '/pakalpojumi/majaslapu-izstrade',
    '/interneta-veikalu-izstrade': '/pakalpojumi/interneta-veikalu-izstrade',
    '/ui-ux-dizains': '/pakalpojumi/zimola-un-ui-ux-dizains',
    '/seo-optimizacija': '/pakalpojumi/digitala-izaugsme',
    '/google-reklamas': '/pakalpojumi/digitala-izaugsme',
    '/socialo-tiklu-reklamas': '/pakalpojumi/digitala-izaugsme',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => new URL(page).pathname !== '/veidnes',
    }),
    icon(),
  ],

  // Prefetch only links that explicitly use data-astro-prefetch.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
