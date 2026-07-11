import { routeSegments, localePrefix, locales, type Locale } from './utils';

export type OpCategory = 'operations' | 'platform' | 'markets' | 'advanced';

export interface OperationDef {
  key: string;
  category: OpCategory;
  icon: string;
  img: string; // ruta base; si localized=true se le añade -ca/-en y .svg
  localized?: boolean;
  slug: Record<Locale, string>;
}

export const opCategories: OpCategory[] = ['operations', 'platform', 'markets', 'advanced'];

/** Todas las áreas y temas de la edición Business Central de Fitoware. */
export const operationList: OperationDef[] = [
  // ---- Operaciones ----
  { key: 'financial', category: 'operations', icon: 'book', img: '/screens/bc-powerbi.webp',
    slug: { ca: 'finances', es: 'finanzas', en: 'finance' } },
  { key: 'inventory', category: 'operations', icon: 'layers', img: '/screens/bc-pedidos.png',
    slug: { ca: 'inventari', es: 'inventario', en: 'inventory' } },
  { key: 'crop', category: 'operations', icon: 'sprout', img: '/photos/invernadero-riego.png',
    slug: { ca: 'cultius', es: 'cultivos', en: 'crop' } },
  { key: 'planning', category: 'operations', icon: 'clock', img: '/screens/bc-inicio.webp',
    slug: { ca: 'planificacio', es: 'planificacion', en: 'planning' } },
  { key: 'sales', category: 'operations', icon: 'shopping-cart', img: '/screens/bc-pedidos.png',
    slug: { ca: 'vendes', es: 'ventas', en: 'sales' } },
  { key: 'shipping', category: 'operations', icon: 'tag', img: '/photos/invernadero-hileras.png',
    slug: { ca: 'logistica', es: 'logistica', en: 'shipping' } },

  // ---- Plataforma ----
  { key: 'erpsuite', category: 'platform', icon: 'server', img: '/screens/bc-inicio.webp',
    slug: { ca: 'suite-erp', es: 'suite-erp', en: 'erp-suite' } },
  { key: 'mobile', category: 'platform', icon: 'monitor', img: '/photos/productora.png',
    slug: { ca: 'apps-mobils', es: 'apps-moviles', en: 'mobile-apps' } },
  { key: 'analytics', category: 'platform', icon: 'network', img: '/screens/bc-powerbi.webp',
    slug: { ca: 'analitica', es: 'analitica', en: 'business-analytics' } },

  // ---- Mercados ----
  { key: 'potted', category: 'markets', icon: 'sprout', img: '/photos/invernadero-flor.png',
    slug: { ca: 'planta-en-test', es: 'planta-en-maceta', en: 'potted-plants' } },
  { key: 'young', category: 'markets', icon: 'leaf', img: '/photos/invernadero-riego.png',
    slug: { ca: 'planta-jove', es: 'planta-joven', en: 'young-plants' } },
  { key: 'startmat', category: 'markets', icon: 'layers', img: '/photos/invernadero-riego.png',
    slug: { ca: 'material-inicial', es: 'material-de-inicio', en: 'start-material' } },
  { key: 'genetics', category: 'markets', icon: 'qr', img: '/photos/invernadero-hileras.png',
    slug: { ca: 'genetica-vegetal', es: 'genetica-vegetal', en: 'plant-genetics' } },

  // ---- Integración e IA ----
  { key: 'automation', category: 'advanced', icon: 'wrench', img: '/screens/bc-inicio.webp',
    slug: { ca: 'automatitzacio-hivernacle', es: 'automatizacion-invernadero', en: 'greenhouse-automation' } },
  { key: 'ai', category: 'advanced', icon: 'sparkles', img: '/mockups/operaciones-ia', localized: true,
    slug: { ca: 'intelligencia-artificial', es: 'inteligencia-artificial', en: 'ai' } },
  { key: 'ecommerce', category: 'advanced', icon: 'shopping-cart', img: '/screens/bc-pedidos.png',
    slug: { ca: 'comerc-electronic', es: 'comercio-electronico', en: 'ecommerce' } },
  { key: 'edi', category: 'advanced', icon: 'link', img: '/screens/bc-pedidos.png',
    slug: { ca: 'edi', es: 'edi', en: 'edi' } },
];

const BC_SLUG = 'business-central';

export function operationPath(key: string, locale: Locale): string {
  const o = operationList.find((x) => x.key === key);
  if (!o) return localePrefix(locale) || '/';
  const base = routeSegments.editions[locale];
  return `${localePrefix(locale)}/${base}/${BC_SLUG}/${o.slug[locale]}`;
}

export function operationAlternates(key: string): Record<Locale, string> {
  return locales.reduce((acc, l) => {
    acc[l] = operationPath(key, l);
    return acc;
  }, {} as Record<Locale, string>);
}

export function operationImage(o: OperationDef, locale: Locale): string {
  if (!o.localized) return o.img;
  const suffix = locale === 'ca' ? '-ca' : locale === 'en' ? '-en' : '';
  return `${o.img}${suffix}.svg`;
}

export function operationsByCategory(category: OpCategory): OperationDef[] {
  return operationList.filter((o) => o.category === category);
}
