import { routeSegments, localePrefix, locales, type Locale } from './utils';

export interface FeatureDef {
  key: string;
  icon: string;
  grad: [string, string];
  mockup: string; // nombre base en /mockups (se le añade -ca/-en según idioma)
  slug: Record<Locale, string>;
}

/** Las 6 funcionalidades del pasaporte, con su página propia. */
export const featureList: FeatureDef[] = [
  { key: 'species', icon: 'sprout', grad: ['#a3e635', '#4d7c0f'], mockup: 'fitoware-especies',
    slug: { ca: 'especies', es: 'especies', en: 'species' } },
  { key: 'passport', icon: 'qr', grad: ['#60a5fa', '#1d4ed8'], mockup: 'fitoware-pasaporte',
    slug: { ca: 'passaport', es: 'pasaporte', en: 'passport' } },
  { key: 'traceability', icon: 'layers', grad: ['#c084fc', '#7c3aed'], mockup: 'trazabilidad',
    slug: { ca: 'tracabilitat', es: 'trazabilidad', en: 'traceability' } },
  { key: 'labels', icon: 'tag', grad: ['#fbbf24', '#d97706'], mockup: 'etiquetas',
    slug: { ca: 'etiquetes', es: 'etiquetas', en: 'labels' } },
  { key: 'pz', icon: 'shield', grad: ['#f87171', '#b91c1c'], mockup: 'zona-protegida',
    slug: { ca: 'zona-protegida', es: 'zona-protegida', en: 'protected-zone' } },
  { key: 'duplicate', icon: 'printer', grad: ['#22d3ee', '#0e7490'], mockup: 'duplicado',
    slug: { ca: 'duplicat', es: 'duplicado', en: 'duplicate' } },
];

/** Ruta localizada de una funcionalidad: /<funcionalidades>/<slug>. */
export function featurePath(key: string, locale: Locale): string {
  const f = featureList.find((x) => x.key === key);
  if (!f) return localePrefix(locale) || '/';
  const base = routeSegments.features[locale];
  return `${localePrefix(locale)}/${base}/${f.slug[locale]}`;
}

/** URLs equivalentes en cada idioma (para hreflang y selector de idioma). */
export function featureAlternates(key: string): Record<Locale, string> {
  return locales.reduce((acc, l) => {
    acc[l] = featurePath(key, l);
    return acc;
  }, {} as Record<Locale, string>);
}

/** Ruta del mockup para el idioma dado. */
export function featureMockup(f: FeatureDef, locale: Locale): string {
  return `/mockups/${f.mockup}${locale === 'ca' ? '-ca' : locale === 'en' ? '-en' : ''}.svg`;
}
