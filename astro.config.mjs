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

  integrations: [mdx(), sitemap(), icon()],

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
