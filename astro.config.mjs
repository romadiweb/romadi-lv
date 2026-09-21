import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('dev');

function ignoreWindowsDumpStackWatchErrors() {
  return {
    name: 'romadi-ignore-windows-dumpstack-watch-errors',
    configureServer(server) {
      const watcher = server.watcher;
      const originalHandleError = watcher._handleError?.bind(watcher);

      if (typeof originalHandleError !== 'function') {
        return;
      }

      watcher._handleError = (error) => {
        const errorPath =
          typeof error?.path === 'string' ? error.path.replaceAll('\\', '/').toLowerCase() : '';

        if (error?.code === 'EBUSY' && errorPath === 'c:/dumpstack.log.tmp') {
          return error;
        }

        return originalHandleError(error);
      };
    },
  };
}

export default defineConfig({
  // Replace before production launch.
  site: 'https://romadi.lv',

  // Keep supervised portal previews free of development-only overlay controls.
  devToolbar: { enabled: false },

  // Static-first architecture for maximum performance and crawlability.
  output: 'static',
  adapter: isDev
    ? undefined
    : netlify({
        devFeatures: {
          edgeFunctions: false,
          environmentVariables: false,
          images: false,
        },
      }),

  trailingSlash: 'never',

  redirects: {
    '/majas-lapu-izstrade': '/pakalpojumi/majaslapu-izstrade',
    '/majaslapu-izstrade-liepaja': '/pakalpojumi/majas-lapu-izstrade-liepaja',
    '/majas-lapu-izstrade-liepaja': '/pakalpojumi/majas-lapu-izstrade-liepaja',
    '/pakalpojumi/majaslapu-izstrade-liepaja': '/pakalpojumi/majas-lapu-izstrade-liepaja',
    '/interneta-veikalu-izstrade': '/pakalpojumi/interneta-veikalu-izstrade',
    '/ui-ux-dizains': '/pakalpojumi/zimola-un-ui-ux-dizains',
    '/seo-optimizacija': '/pakalpojumi/digitala-izaugsme',
    '/google-reklamas': '/pakalpojumi/digitala-izaugsme',
    '/socialo-tiklu-reklamas': '/pakalpojumi/digitala-izaugsme',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !new globalThis.URL(page).pathname.startsWith('/veidnes'),
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
    plugins: [ignoreWindowsDumpStackWatchErrors(), tailwindcss()],
    server: {
      fs: {
        allow: [projectRoot],
      },
      watch: {
        ignored: [
          /(^|[/\\])DumpStack\.log\.tmp$/i,
          /^[a-z]:[/\\]DumpStack\.log\.tmp$/i,
          /[/\\]\$Recycle\.Bin[/\\]/i,
          /[/\\]System Volume Information[/\\]/i,
        ],
      },
    },
  },
});
