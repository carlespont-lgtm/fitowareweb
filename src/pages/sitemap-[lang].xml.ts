import type { APIRoute } from 'astro';
import { locales, defaultLocale, type Locale } from '../i18n/utils';
import { allPages } from '../i18n/pages';

const FALLBACK = 'https://fitoware.com';

export function getStaticPaths() {
  return locales.map((l) => ({ params: { lang: l } }));
}

export const GET: APIRoute = ({ params, site }) => {
  const base = (site?.href ?? FALLBACK + '/').replace(/\/$/, '');
  const lang = params.lang as Locale;
  const abs = (p: string) => base + p;

  const urls = allPages()
    .map((page) => {
      const alternates = locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(page.paths[l])}"/>`)
        .join('\n');
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(page.paths[defaultLocale])}"/>`;
      return `  <url>
    <loc>${abs(page.paths[lang])}</loc>
${alternates}
${xDefault}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
