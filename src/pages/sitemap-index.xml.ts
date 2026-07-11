import type { APIRoute } from 'astro';
import { locales } from '../i18n/utils';

const FALLBACK = 'https://fitoware.com';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? FALLBACK + '/').replace(/\/$/, '');
  const sitemaps = locales
    .map((l) => `  <sitemap>\n    <loc>${base}/sitemap-${l}.xml</loc>\n  </sitemap>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
