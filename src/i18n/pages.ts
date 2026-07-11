import { routeSegments, localePrefix, locales, type Locale } from './utils';
import { featureList, featurePath } from './features';
import { editionList, editionPath } from './editions';
import { operationList, operationPath } from './operations';

export interface SitePage {
  paths: Record<Locale, string>; // ruta por idioma (empieza por /)
  priority: number;
  changefreq: string;
}

/** Rutas por idioma de una página estática ('' = home; el resto usa routeSegments). */
function staticPaths(key: string): Record<Locale, string> {
  return locales.reduce((acc, l) => {
    acc[l] = key ? `${localePrefix(l)}/${routeSegments[key][l]}` : localePrefix(l) || '/';
    return acc;
  }, {} as Record<Locale, string>);
}

function fromFn(fn: (key: string, l: Locale) => string, key: string): Record<Locale, string> {
  return locales.reduce((acc, l) => {
    acc[l] = fn(key, l);
    return acc;
  }, {} as Record<Locale, string>);
}

/** Todas las páginas indexables del sitio, con sus URLs en cada idioma. */
export function allPages(): SitePage[] {
  const pages: SitePage[] = [
    { paths: staticPaths(''), priority: 1.0, changefreq: 'weekly' },
    { paths: staticPaths('features'), priority: 0.9, changefreq: 'weekly' },
    { paths: staticPaths('editions'), priority: 0.9, changefreq: 'weekly' },
    { paths: staticPaths('contact'), priority: 0.7, changefreq: 'monthly' },
    { paths: staticPaths('support'), priority: 0.6, changefreq: 'monthly' },
    { paths: staticPaths('legal'), priority: 0.3, changefreq: 'yearly' },
    { paths: staticPaths('cookies'), priority: 0.3, changefreq: 'yearly' },
  ];
  for (const f of featureList) pages.push({ paths: fromFn(featurePath, f.key), priority: 0.8, changefreq: 'monthly' });
  for (const e of editionList) pages.push({ paths: fromFn(editionPath, e.key), priority: 0.8, changefreq: 'monthly' });
  for (const o of operationList) pages.push({ paths: fromFn(operationPath, o.key), priority: 0.7, changefreq: 'monthly' });
  return pages;
}
