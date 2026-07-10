// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fitoware.com',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ca',
        locales: { ca: 'ca-ES', es: 'es-ES', en: 'en' },
      },
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  i18n: {
    defaultLocale: 'ca',
    locales: ['ca', 'es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
