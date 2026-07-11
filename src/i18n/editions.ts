import { routeSegments, localePrefix, locales, type Locale } from './utils';

export interface EditionDef {
  key: 'bc' | 'ge';
  slug: string; // mismo slug en los 3 idiomas (nombre de marca)
  icon: string;
  accent: 'ink' | 'brand';
  mockup: string; // ruta en /mockups (base; se localiza si aplica)
  localizedMockup: boolean;
  brandLogo: string;
  external: string;
}

export const editionList: EditionDef[] = [
  {
    key: 'bc',
    slug: 'business-central',
    icon: 'cloud',
    accent: 'ink',
    mockup: 'business-central-horticultura',
    localizedMockup: false,
    brandLogo: '/brand/ionnavis.svg',
    external: 'https://www.ionnavis.com',
  },
  {
    key: 'ge',
    slug: 'gestioerp',
    icon: 'sparkles',
    accent: 'brand',
    mockup: 'operaciones-iso',
    localizedMockup: true,
    brandLogo: '/brand/gestioerp-mark.svg',
    external: 'https://gestioerp.com',
  },
];

export function editionPath(key: string, locale: Locale): string {
  const e = editionList.find((x) => x.key === key);
  if (!e) return localePrefix(locale) || '/';
  const base = routeSegments.editions[locale];
  return `${localePrefix(locale)}/${base}/${e.slug}`;
}

export function editionAlternates(key: string): Record<Locale, string> {
  return locales.reduce((acc, l) => {
    acc[l] = editionPath(key, l);
    return acc;
  }, {} as Record<Locale, string>);
}

export function editionMockup(e: EditionDef, locale: Locale): string {
  const suffix = e.localizedMockup ? (locale === 'ca' ? '-ca' : locale === 'en' ? '-en' : '') : '';
  return `/mockups/${e.mockup}${suffix}.svg`;
}
