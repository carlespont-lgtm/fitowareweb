// Generador de la ilustración isométrica "ecosistema de operaciones" de Fitoware,
// con etiquetas flotantes de módulos traducidas por idioma. Estilo inspirado en el
// render 3D de Mprise Agriware, en la marca verde de Fitoware.
import { writeFileSync } from 'node:fs';

// ---------- Proyección isométrica ----------
const OX = 500, OY = 208, TW = 33, TH = 17, ZH = 24;
const P = (x, y, z = 0) => [
  +(OX + (x - y) * TW).toFixed(1),
  +(OY + (x + y) * TH - z * ZH).toFixed(1),
];
const pts = (a) => a.map((p) => p.join(',')).join(' ');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Caja isométrica ----------
function isoBox(x0, y0, x1, y1, z0, h, { top, left, right, stroke = 'none', sw = 0, op = 1 }) {
  const T = [P(x0, y0, z0 + h), P(x1, y0, z0 + h), P(x1, y1, z0 + h), P(x0, y1, z0 + h)];
  const L = [P(x0, y1, z0 + h), P(x1, y1, z0 + h), P(x1, y1, z0), P(x0, y1, z0)];
  const R = [P(x1, y0, z0 + h), P(x1, y1, z0 + h), P(x1, y1, z0), P(x1, y0, z0)];
  const s = stroke !== 'none' ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : '';
  return `<g${s} opacity="${op}">`
    + `<polygon points="${pts(R)}" fill="${right}"/>`
    + `<polygon points="${pts(L)}" fill="${left}"/>`
    + `<polygon points="${pts(T)}" fill="${top}"/></g>`;
}
const quad = (a, b, c, d, fill, extra = '') => `<polygon points="${pts([a, b, c, d])}" fill="${fill}" ${extra}/>`;

// ================= ESCENA por idioma =================
function build(labels) {
  let S = '';
  const add = (s) => (S += s + '\n');

  add('<svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(labels.aria) + '">');
  add(`<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2fbff"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfeaf2" stop-opacity="0.62"/><stop offset="1" stop-color="#afdcd0" stop-opacity="0.42"/></linearGradient>
    <linearGradient id="bed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f9d54"/><stop offset="1" stop-color="#1f6b39"/></linearGradient>
    <filter id="lbl" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0c2a47" flood-opacity="0.18"/></filter>
  </defs>`);
  add('<rect width="1000" height="700" fill="url(#sky)"/>');
  add('<circle cx="180" cy="150" r="150" fill="#a3e635" opacity="0.08"/>');
  add('<circle cx="820" cy="140" r="150" fill="#16bd95" opacity="0.08"/>');

  // ---- Parcela base (suelo) ----
  const GX = 16, GY = 12;
  add(quad(P(0, 0), P(GX, 0), P(GX, GY), P(0, GY), '#eef2f4'));
  // borde grosor
  add(quad(P(0, GY), P(GX, GY), P(GX, GY, -0.4), P(0, GY, -0.4), '#d5dde2'));
  add(quad(P(GX, 0), P(GX, GY), P(GX, GY, -0.4), P(GX, 0, -0.4), '#c9d3d9'));

  // ---- Carretera frontal ----
  add(quad(P(0, GY), P(GX, GY), P(GX, GY + 1.7), P(0, GY + 1.7), '#8b96a0'));
  add(quad(P(0, GY + 1.7), P(GX, GY + 1.7), P(GX, GY + 1.7, -0.4), P(0, GY + 1.7, -0.4), '#6f7a84'));
  // líneas discontinuas de la carretera
  let dash = '<g>';
  for (let x = 0.6; x < GX; x += 1.4) {
    const a = P(x, GY + 0.85), b = P(x + 0.7, GY + 0.85);
    dash += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e8edf0" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  dash += '</g>';
  add(dash);

  // ---- Seto / arbustos frontales (entre parcela y carretera) ----
  let hedge = '<g>';
  for (let x = 0.4; x < GX; x += 0.9) {
    const [sx, sy] = P(x, GY - 0.15, 0);
    hedge += `<ellipse cx="${sx}" cy="${sy - 6}" rx="10" ry="8" fill="#3f9d54"/><ellipse cx="${sx}" cy="${sy - 9}" rx="7" ry="6" fill="#57b56a"/>`;
  }
  hedge += '</g>';
  add(hedge);

  // ---- Campo exterior (derecha): cultivo en hileras al aire libre ----
  (function outdoorField() {
    const x0 = 10.2, x1 = 15.6, y0 = 6.4, y1 = 11.6;
    let g = quad(P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1), '#e3ead0');
    for (let y = y0 + 0.35; y < y1; y += 0.62) {
      const a = P(x0 + 0.2, y), b = P(x1 - 0.2, y);
      g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#6ea644" stroke-width="6" stroke-linecap="round"/>`;
      g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#4f8f37" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    add(g);
  })();

  // ---- Zona de trabajo (patio abierto, front-left): suelo blanco hundido ----
  const yardX0 = 0.6, yardX1 = 6.4, yardY0 = 6.6, yardY1 = 11.4;
  add(isoBox(yardX0, yardY0, yardX1, yardY1, -0.25, 0.25, { top: '#f8fafb', left: '#dfe6ea', right: '#d2dbe0' }));

  // desks (Finance & HR / Sales): fila de puestos con pantallas
  function desk(gx, gy) {
    let g = isoBox(gx, gy, gx + 0.7, gy + 0.45, 0, 0.28, { top: '#2f3b45', left: '#232d35', right: '#1b232a' });
    const [mx, my] = P(gx + 0.35, gy + 0.1, 0.28);
    g += `<rect x="${mx - 9}" y="${my - 16}" width="18" height="12" rx="1.5" fill="#16bd95"/>`;
    // silla + operario
    const [px, py] = P(gx + 0.35, gy + 0.75, 0);
    g += person(px, py, 0.8);
    return g;
  }
  add(desk(1.0, 9.8) + desk(2.1, 9.8) + desk(1.0, 10.6) + desk(2.1, 10.6));

  // mesas de packing (Mobile Operations): superficies claras
  add(isoBox(3.4, 9.4, 5.2, 9.9, 0, 0.32, { top: '#e2e8ec', left: '#c7d1d7', right: '#b7c3ca' }));
  add(isoBox(3.4, 10.5, 5.2, 11.0, 0, 0.32, { top: '#2f3b45', left: '#232d35', right: '#1b232a' }));

  // palets apilados
  function pallet(gx, gy) {
    return isoBox(gx, gy, gx + 0.7, gy + 0.7, 0, 0.5, { top: '#d9a441', left: '#b9862f', right: '#9c7026' });
  }
  add(pallet(4.5, 7.6) + pallet(5.2, 7.6) + pallet(4.85, 8.4));

  // carretilla elevadora (verde Fitoware)
  function forklift(gx, gy) {
    let g = isoBox(gx, gy, gx + 0.55, gy + 0.8, 0, 0.45, { top: '#16bd95', left: '#0d9e80', right: '#0c7d68' });
    g += isoBox(gx + 0.05, gy + 0.05, gx + 0.4, gy + 0.4, 0.45, 0.35, { top: '#0f3a5f', left: '#0c2a47', right: '#081d33' });
    // mástil
    const [ax, ay] = P(gx, gy + 0.4, 0);
    g += `<line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay - 34}" stroke="#0c2a47" stroke-width="3"/>`;
    return g;
  }
  add(forklift(3.6, 8.2));

  // operarios sueltos en el patio
  add(person(...P(2.9, 8.9, 0), 1) + person(...P(4.2, 9.5, 0), 1));

  // ---- Invernadero (estructura de cristal con techo a dos aguas, multi-nave) ----
  (function greenhouse() {
    const gx0 = 5.6, gx1 = 15.4;        // largo (eje x)
    const gy0 = 0.2, gy1 = 6.0;          // ancho total (eje y)
    const wallZ = 0, wallH = 2.0, ridgeH = 0.9;
    const bays = 4;
    const bw = (gy1 - gy0) / bays;

    // camas de cultivo interiores (verde) — se ven bajo el cristal
    let beds = '';
    for (let b = 0; b < bays; b++) {
      const by0 = gy0 + b * bw + 0.18, by1 = gy0 + (b + 1) * bw - 0.18;
      beds += quad(P(gx0 + 0.3, by0), P(gx1 - 0.3, by0), P(gx1 - 0.3, by1), P(gx0 + 0.3, by1), 'url(#bed)');
      for (let y = by0 + 0.18; y < by1; y += 0.34) {
        const a = P(gx0 + 0.4, y), c = P(gx1 - 0.4, y);
        beds += `<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#2b7d43" stroke-width="4" stroke-linecap="round"/>`;
        beds += `<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#57b56a" stroke-width="1.6" stroke-linecap="round"/>`;
      }
    }
    // pasillo central
    add(beds);

    // techos a dos aguas por nave (glass) + frames
    let roof = '', frame = '';
    for (let b = 0; b < bays; b++) {
      const yA = gy0 + b * bw, yB = gy0 + (b + 1) * bw, yC = (yA + yB) / 2;
      const eaveA0 = P(gx0, yA, wallZ + wallH), eaveA1 = P(gx1, yA, wallZ + wallH);
      const eaveB0 = P(gx0, yB, wallZ + wallH), eaveB1 = P(gx1, yB, wallZ + wallH);
      const ridge0 = P(gx0, yC, wallZ + wallH + ridgeH), ridge1 = P(gx1, yC, wallZ + wallH + ridgeH);
      // dos faldones
      roof += quad(eaveA0, eaveA1, ridge1, ridge0, 'url(#glass)', 'stroke="#eaf6fb" stroke-width="1"');
      roof += quad(eaveB0, eaveB1, ridge1, ridge0, '#bfe0e6', 'opacity="0.5" stroke="#eaf6fb" stroke-width="1"');
      // frontón triangular (cara frontal, en gx0)
      frame += `<polygon points="${pts([eaveA0, eaveB0, ridge0])}" fill="#dff0f4" opacity="0.55" stroke="#cfe6ec" stroke-width="1"/>`;
      // costillas de la cumbrera
      for (let x = gx0; x <= gx1; x += 1.1) {
        const r = P(x, yC, wallZ + wallH + ridgeH), e1 = P(x, yA, wallZ + wallH), e2 = P(x, yB, wallZ + wallH);
        frame += `<line x1="${r[0]}" y1="${r[1]}" x2="${e1[0]}" y2="${e1[1]}" stroke="#dcecef" stroke-width="1.3"/>`;
        frame += `<line x1="${r[0]}" y1="${r[1]}" x2="${e2[0]}" y2="${e2[1]}" stroke="#cfe2e6" stroke-width="1.3"/>`;
      }
    }

    // paredes de cristal (frontal y2 = gy1, lateral x1 = gx1)
    const wA = P(gx0, gy1, wallZ), wB = P(gx1, gy1, wallZ), wC = P(gx1, gy1, wallZ + wallH), wD = P(gx0, gy1, wallZ + wallH);
    const sA = P(gx1, gy0, wallZ), sB = P(gx1, gy1, wallZ), sC = P(gx1, gy1, wallZ + wallH), sD = P(gx1, gy0, wallZ + wallH);
    add(quad(sA, sB, sC, sD, 'url(#glass)', 'stroke="#eaf6fb" stroke-width="1"'));
    add(quad(wA, wB, wC, wD, 'url(#glass)', 'stroke="#eaf6fb" stroke-width="1"'));
    // mullions verticales en la pared frontal
    let mull = '<g stroke="#dbeef2" stroke-width="1.2">';
    for (let x = gx0; x <= gx1; x += 1.0) {
      const p0 = P(x, gy1, wallZ), p1 = P(x, gy1, wallZ + wallH);
      mull += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}"/>`;
    }
    mull += '</g>';
    add(mull);
    add(roof);
    add(frame);

    // aspersores (agua) en una nave
    const [spx, spy] = P(gx0 + 3.4, gy0 + bw * 1.5, wallZ + wallH);
    add(`<g stroke="#8fd3ff" stroke-width="1.6" opacity="0.7" stroke-linecap="round">
      <line x1="${spx}" y1="${spy}" x2="${spx - 4}" y2="${spy + 26}"/>
      <line x1="${spx}" y1="${spy}" x2="${spx + 5}" y2="${spy + 24}"/>
      <line x1="${spx + 10}" y1="${spy - 3}" x2="${spx + 8}" y2="${spy + 22}"/>
    </g>`);
  })();

  // ---- Vehículos en la carretera ----
  function car(gx, gy, color, dark) {
    let g = isoBox(gx, gy, gx + 1.5, gy + 0.8, 0, 0.4, { top: color, left: dark, right: dark });
    g += isoBox(gx + 0.25, gy + 0.12, gx + 1.15, gy + 0.68, 0.4, 0.32, { top: '#cfe0e8', left: '#a9c2cd', right: '#95b1bd' });
    return g;
  }
  function truck(gx, gy) {
    let g = isoBox(gx, gy, gx + 1.1, gy + 0.9, 0, 0.55, { top: '#eef2f4', left: '#cdd6db', right: '#bcc7cd' }); // caja
    g += isoBox(gx + 1.1, gy + 0.12, gx + 1.8, gy + 0.78, 0, 0.5, { top: '#dfe6ea', left: '#c1cbd1', right: '#aeb9c0' }); // cabina
    return g;
  }
  add(truck(11.2, 12.0));
  add(car(8.4, 12.15, '#3a4650', '#252e35'));
  add(car(5.6, 12.2, '#f4f7f9', '#cdd6db'));

  // árboles decorativos
  function tree(gx, gy) {
    const [sx, sy] = P(gx, gy, 0);
    return `<g><rect x="${sx - 2}" y="${sy - 20}" width="4" height="20" fill="#8a6a4a"/><ellipse cx="${sx}" cy="${sy - 26}" rx="15" ry="17" fill="#3f9d54"/><ellipse cx="${sx - 5}" cy="${sy - 30}" rx="9" ry="10" fill="#57b56a"/></g>`;
  }
  add(tree(0.5, 4.6) + tree(1.4, 2.2));

  // ================= ETIQUETAS FLOTANTES =================
  // [texto, x, y] en coords de pantalla; el orden sigue labels.items
  const positions = [
    [300, 175], [636, 150], [838, 262], [214, 262], [524, 268],
    [286, 430], [566, 392], [190, 528], [452, 528],
  ];
  const spots = labels.items.map((txt, i) => [txt, positions[i][0], positions[i][1]]);
  let L = '<g font-family="Inter, Segoe UI, Arial, sans-serif" font-weight="700" font-size="17">';
  for (const [txt, cx, cy] of spots) {
    const w = Math.max(70, txt.length * 9.3 + 26);
    const x = cx - w / 2;
    L += `<g filter="url(#lbl)">`
      + `<rect x="${x.toFixed(1)}" y="${cy - 17}" width="${w.toFixed(1)}" height="34" rx="17" fill="#ffffff"/>`
      + `<text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="#0c7d68">${esc(txt)}</text>`
      + `</g>`;
  }
  L += '</g>';
  add(L);

  add('</svg>');
  return S;
}

// ---------- Personita iso (silueta) ----------
function person(sx, sy, scale = 1) {
  const s = scale;
  return `<g transform="translate(${sx.toFixed(1)},${sy.toFixed(1)}) scale(${s})">`
    + `<ellipse cx="0" cy="2" rx="7" ry="3" fill="#0c2a47" opacity="0.10"/>`
    + `<rect x="-4" y="-20" width="8" height="15" rx="3.5" fill="#0c7d68"/>`
    + `<circle cx="0" cy="-24" r="3.6" fill="#f0c9a8"/></g>`;
}

// ---------- Idiomas ----------
const LANGS = {
  es: {
    aria: 'Ecosistema de operaciones de un vivero gestionado con Fitoware',
    items: ['Inventario', 'Control de producción', 'Gestión de cultivos', 'Logística', 'IA y automatización', 'Finanzas y RRHH', 'Operaciones móviles', 'Ventas y pedidos', 'EDI y API'],
  },
  ca: {
    aria: "Ecosistema d'operacions d'un viver gestionat amb Fitoware",
    items: ['Inventari', 'Control de producció', 'Gestió de cultius', 'Logística', 'IA i automatització', 'Finances i RRHH', 'Operacions mòbils', 'Vendes i comandes', 'EDI i API'],
  },
  en: {
    aria: 'Operations ecosystem of a nursery managed with Fitoware',
    items: ['Inventory', 'Production Control', 'Crop Management', 'Logistics', 'AI & Automation', 'Finance & HR', 'Mobile Operations', 'Sales & Orders', 'EDI & API'],
  },
};

// ---- Set IA (mismo escenario, etiquetas de agente IA) ----
const AI_LANGS = {
  es: {
    aria: 'Ecosistema de operaciones de un vivero con agente de IA de Fitoware',
    items: ['La IA instruye a los equipos', 'Acelera la facturación', 'La IA sugiere próximas acciones', 'La IA crea pedidos en el ERP', 'Pide decisiones sí/no', 'La IA convierte emails en pedidos', 'La IA integra datos externos'],
  },
  ca: {
    aria: "Ecosistema d'operacions d'un viver amb agent d'IA de Fitoware",
    items: ["La IA instrueix els equips", 'Accelera la facturació', 'La IA suggereix accions següents', "La IA crea comandes a l'ERP", 'Demana decisions sí/no', 'La IA converteix emails en comandes', 'La IA integra dades externes'],
  },
  en: {
    aria: 'Operations ecosystem of a nursery with a Fitoware AI agent',
    items: ['AI instructs execution teams', 'Speeds up invoicing tasks', 'AI suggests next actions', 'AI creates orders in ERP', 'Asks go/no-go decisions', 'AI converts emails to orders', 'AI integrates 3rd-party data'],
  },
};

const OUT = process.argv[2]; // carpeta destino
for (const [lang, suffix] of [['es', ''], ['ca', '-ca'], ['en', '-en']]) {
  writeFileSync(`${OUT}/operaciones-iso${suffix}.svg`, build(LANGS[lang]));
  writeFileSync(`${OUT}/operaciones-ia${suffix}.svg`, build(AI_LANGS[lang]));
}
console.log('OK: operaciones-iso + operaciones-ia {es,ca,en} generados en', OUT);
