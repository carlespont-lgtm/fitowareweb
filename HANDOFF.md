# Fitoware — Web de producto · Guía de traspaso

Documento para retomar el proyecto. Última actualización: 2026-07-11.

---

## 1. Qué es

Web pública del producto **Fitoware** (pasaporte fitosanitario europeo y gestión para
viveros/horticultura ornamental). Es un **sitio estático trilingüe** (catalán, español,
inglés). Fitoware tiene dos ediciones:

- **Fitoware for Business Central** — extensión sobre Microsoft Dynamics 365 Business
  Central. Partner de implantación: IONNAVIS.
- **Fitoware for GestioERP** — módulo sobre GestioERP (ERP en la nube, grupo SIAM Cloud).

> ⚠️ **Nombre de marca:** siempre **Fitoware**, nunca "Agriware" (la web se inspira en
> mprise-agriware.com pero no debe mencionarlo).

---

## 2. Stack y arranque

- **Astro 5** (output estático) + **Tailwind CSS 4** (vía `@tailwindcss/vite`).
- Sin base de datos, sin backend. Todo se pre-renderiza a HTML en el build.

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:4321 por defecto)
npm run build    # genera el sitio estático en dist/
npm run preview  # sirve dist/ para revisar el build
```

- **Repositorio:** https://github.com/carlespont-lgtm/fitowareweb (rama `main`).
- **Dominio de producción:** https://fitoware.com (config en `astro.config.mjs` → `site`).

---

## 3. Idiomas y rutas (i18n)

Idioma por defecto: **catalán** (sin prefijo). Español bajo `/es`, inglés bajo `/en`.

- `src/i18n/utils.ts` — núcleo i18n:
  - `useTranslations(locale)` → función `t('clave')`.
  - `routeSegments` — **mapa único** de segmentos de URL por idioma (p. ej.
    `features → {ca:'funcionalitats', es:'funcionalidades', en:'features'}`). Es la fuente
    de verdad para navegación, generación de páginas y selector de idioma.
  - `localizedPath(key, locale)`, `getAlternatePath(url, target)`.
- **Traducciones:** `src/i18n/{ca,es,en}.json`. **Regla:** al añadir una clave hay que
  ponerla en los **3 ficheros** (mismo orden). `es_ES` es la referencia; si no se conoce
  la traducción, dejar el texto en inglés como fallback (el código ya cae a la clave o al
  idioma por defecto si falta).

### Páginas dinámicas (una plantilla → muchas URLs)

Se generan con `getStaticPaths` desde módulos de datos, uno por tipo:

| Módulo de datos | Componente | Rutas |
|---|---|---|
| `src/i18n/features.ts` (6 funcionalidades) | `components/pages/FeatureDetailPage.astro` | `/funcionalitats/[slug]`, `/es/funcionalidades/[slug]`, `/en/features/[slug]` |
| `src/i18n/editions.ts` (2 ediciones: `bc`, `ge`) | `components/pages/EditionDetailPage.astro` | `/edicions/[slug]`, `/es/ediciones/[slug]`, `/en/editions/[slug]` |
| `src/i18n/operations.ts` (17 áreas de Business Central, 4 categorías) | `components/pages/OperationDetailPage.astro` | `/…/business-central/[slug]` en cada idioma |

Los ficheros de ruta viven en `src/pages/**/[feature].astro`, `[edition].astro`,
`business-central/[operation].astro` (uno por idioma). Cada uno pasa a `BaseLayout` el
título, la descripción y los **`alternates`** (URLs equivalentes por idioma) para que el
selector de idioma y los `hreflang` funcionen en rutas anidadas.

---

## 4. Estructura del proyecto

```
src/
├── layouts/BaseLayout.astro     ← <head> (SEO, hreflang, OG/Twitter), header, footer,
│                                   widgets (WhatsApp, ScrollTop, cookies) y LIGHTBOX global
├── components/
│   ├── Header.astro             ← nav escritorio (mega-menús con imágenes) + menú móvil
│   │                               (acordeones <details>)
│   ├── Footer.astro, LangSwitcher.astro, Icon.astro (iconos de trazo tipo Lucide),
│   ├── ScrollTop.astro          ← botón flotante "ir arriba"
│   ├── Partners.astro, BrandFamily.astro, WhatsAppWidget.astro, CookieConsent.astro
│   └── pages/                   ← el contenido de cada página (HomePage, FeaturesPage,
│                                   EditionsPage, ContactPage, y los *DetailPage)
├── i18n/                        ← utils, {ca,es,en}.json, features.ts, editions.ts,
│                                   operations.ts, pages.ts (lista para el sitemap)
├── pages/                       ← rutas Astro (incl. sitemap-*.xml.ts)
└── styles/global.css            ← estilos globales + animaciones (ken-burns, reveal,
                                    lightbox, hover de fotos)
public/
├── mockups/   ← ilustraciones y mockups SVG (algunos generados por scripts/, ver abajo)
├── photos/    ← fotos reales de invernadero (jpg/png)
├── screens/   ← capturas de Business Central
├── brand/     ← logos/marcas
└── robots.txt
scripts/       ← generadores de SVG (ver scripts/README.md)
```

---

## 5. Funcionalidades transversales

- **Mega-menús (escritorio):** Funcionalidades, Ediciones y **Business Central** (este
  muestra las 17 áreas con miniatura, agrupadas por categoría). Se abren por hover y por
  foco de teclado, con **CSS puro** (sin JS). El panel ancho de Business Central se centra
  bajo su disparador para no desbordar. Ver `Header.astro` + su `<style>`.
- **Menú móvil:** acordeones `<details>` plegables (Funcionalidades, Ediciones, Business
  Central en texto). El mega-menú con imágenes es **solo escritorio**.
- **Lightbox global** (`BaseLayout.astro`): al pulsar cualquier imagen de contenido se
  amplía a pantalla completa. Reglas: `main img` que **no** esté dentro de un `<a>`, que
  **no** sea decorativa (`alt=""`) ni un icono pequeño (<80px). Galerías: marcar imágenes
  con `data-gallery="nombre"` para tener flechas ‹ › (teclas ←/→). Cerrar con clic, ✕ o Esc.
- **Animaciones** (`global.css`, respetan `prefers-reduced-motion`): `reveal` / `reveal-blur`
  (aparición al hacer scroll con **cascada/stagger**, enganchadas al IntersectionObserver de
  `BaseLayout`), `ken-burns`, `photo-frame` (zoom en hover).
- **Efectos premium** (`BaseLayout.astro` + `global.css`): **barra de progreso de lectura**
  (`#scroll-progress`, fija arriba), **scroll suave** + `scroll-padding-top`, y **transición de
  página** (fade + desplazamiento) vía `::view-transition-*` de Astro ClientRouter.
- **Vídeo de fondo del héroe** (`HomePage.astro`): 2 clips locales optimizados en
  `public/videos/` (`hero-1/2.mp4` 720p, `preload="metadata"`, autoplay/muted/loop) que
  **alternan aleatoriamente** por visita; póster propio y fallback `reduced-motion`.

---

## 6. SEO

- `BaseLayout.astro` genera por página: `title`, `description`, `canonical`, **`hreflang`**
  (ca/es/en + x-default), Open Graph, **Twitter Card**, `og:image` (por defecto una foto;
  se puede sobreescribir con la prop `image`), y JSON-LD `SoftwareApplication`.
- **Sitemaps por idioma**, generados como endpoints estáticos:
  - `src/pages/sitemap-index.xml.ts` → `/sitemap-index.xml` (índice, referenciado por
    `robots.txt`).
  - `src/pages/sitemap-[lang].xml.ts` → `/sitemap-ca.xml`, `/sitemap-es.xml`,
    `/sitemap-en.xml` (cada URL con sus alternates hreflang).
  - La lista de páginas la aporta `src/i18n/pages.ts` (`allPages()`).
  - Al añadir un tipo de página nuevo, **añadirlo también en `pages.ts`** para que entre
    en el sitemap.

---

## 7. Recetas rápidas

**Añadir una funcionalidad nueva:** añadir entrada en `src/i18n/features.ts` (key, icon,
mockup, slug por idioma) + claves `feat.<key>.t/.d` y `fdet.<key>.lead/.b1..b3` en los 3
JSON. La página, la ruta y el sitemap salen solos.

**Añadir un área de Business Central:** entrada en `src/i18n/operations.ts` (con
`category`) + claves `ops.<key>.title/.sub/.lead/.b1..b4` en los 3 JSON.

**Cambiar/añadir un mockup SVG generado:** editar el script en `scripts/` (textos en los
objetos de idioma) y ejecutarlo (ver `scripts/README.md`).

**Fotos/capturas:** dejar los ficheros en `public/photos/` o `public/screens/` y
referenciarlos por su ruta.

---

## 8. Datos de contacto (reales, ya en la web)

- Tel.: **+34 722 175 283** · Email: **lluis@slave.net**
- Dirección: **Avgda. Catalunya, 13 · 43772 Botarell (Tarragona)**
- Empresa: Slave Computers, S.L. (grupo SIAM Cloud). WhatsApp: mismo teléfono.

---

## 9. Despliegue

Sitio estático: `npm run build` genera `dist/` (HTML + assets + sitemaps). Subir el
contenido de `dist/` al hosting. El flujo actual es commit + `git push origin main`;
si el hosting despliega desde `main`, se publica solo. Tras publicar, enviar
`https://fitoware.com/sitemap-index.xml` en Google Search Console.
