// Mockups de app (760x480) para las funcionalidades sin ilustración: etiquetas,
// zona protegida y duplicado A4. Estilo idéntico a los mockups existentes.
import { writeFileSync } from 'node:fs';

const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
const chrome = (title) => `
  <rect width="760" height="480" fill="#ecfdf5"/>
  <rect x="40" y="28" width="680" height="424" rx="16" fill="#ffffff" stroke="#d8e0e6" filter="url(#fsh2)"/>
  <path d="M40 44 a16 16 0 0 1 16 -16 h648 a16 16 0 0 1 16 16 v26 h-680 z" fill="#0d9e80"/>
  <circle cx="64" cy="44" r="5" fill="#ffffff" opacity="0.85"/>
  <circle cx="82" cy="44" r="5" fill="#ffffff" opacity="0.6"/>
  <circle cx="100" cy="44" r="5" fill="#ffffff" opacity="0.45"/>
  <text x="380" y="49" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="600">${title}</text>`;

const head = (title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 480" width="760" height="480" font-family="${FONT}" role="img" aria-label="${title}">
  <defs><filter id="fsh2" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#0e6354" flood-opacity="0.18"/></filter></defs>`;

// Barras EAN-13 deterministas (patrón fijo, no aleatorio)
function barcode(x, y, w, h) {
  const widths = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1];
  let cx = x, g = '<g fill="#0f172a">';
  for (let i = 0; i < widths.length && cx < x + w; i++) {
    if (i % 2 === 0) g += `<rect x="${cx.toFixed(1)}" y="${y}" width="${widths[i]}" height="${h}"/>`;
    cx += widths[i] + 1.4;
  }
  g += '</g>';
  return g;
}
// QR simplificado
function qr(x, y, s) {
  const n = 7, c = s / n;
  const on = [
    [1,1,1,0,1,1,1],[1,0,1,0,0,0,1],[1,1,1,0,1,0,1],
    [0,0,0,1,0,1,0],[1,0,1,0,1,1,1],[1,1,0,1,0,0,1],[1,0,1,1,1,0,1],
  ];
  let g = `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#ffffff"/>`;
  g += '<g fill="#0c2a47">';
  for (let r = 0; r < n; r++) for (let col = 0; col < n; col++)
    if (on[r][col]) g += `<rect x="${(x + col * c).toFixed(1)}" y="${(y + r * c).toFixed(1)}" width="${c.toFixed(1)}" height="${c.toFixed(1)}"/>`;
  g += '</g>';
  return g;
}

// ---------- 1) ETIQUETAS Y EAN-13 ----------
function etiquetas(L) {
  let s = head(L.title) + chrome(L.title);
  s += `<text x="60" y="98" fill="#0f172a" font-size="14" font-weight="700">${L.heading}</text>`;
  // formulario izquierda
  const rows = [[L.item, 'Rosa gallica · maceta 5L'], [L.ean, '8 412345 678905'], [L.batch, 'L-2026-0345'], [L.qty, '250']];
  let y = 128;
  for (const [k, v] of rows) {
    s += `<text x="60" y="${y}" fill="#64748b" font-size="11">${k}</text>`;
    s += `<rect x="60" y="${y + 6}" width="300" height="30" rx="8" fill="#ffffff" stroke="#cbd5e1"/>`;
    s += `<text x="74" y="${y + 26}" fill="#0f172a" font-size="12" font-weight="600">${v}</text>`;
    y += 52;
  }
  // botón imprimir
  s += `<rect x="60" y="${y + 2}" width="300" height="40" rx="9" fill="#0d9e80"/>`;
  s += `<path d="M78 ${y + 16} h4 v-6 h14 v6 h4 v12 h-4 v-6 h-14 v6 h-4 z" fill="#ffffff" opacity="0.95"/>`;
  s += `<text x="220" y="${y + 27}" text-anchor="middle" fill="#ffffff" font-size="12.5" font-weight="700">${L.print}</text>`;

  // preview etiqueta (derecha)
  s += `<rect x="416" y="120" width="284" height="256" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>`;
  s += `<text x="558" y="146" text-anchor="middle" fill="#94a3b8" font-size="10.5" font-weight="700" letter-spacing="1.5">${L.preview}</text>`;
  s += `<rect x="440" y="158" width="236" height="196" rx="8" fill="#ffffff" stroke="#cbd5e1"/>`;
  s += `<text x="456" y="184" fill="#0c2a47" font-size="12.5" font-weight="700" font-style="italic">Rosa gallica</text>`;
  s += `<text x="456" y="202" fill="#64748b" font-size="10">L-2026-0345 · ${L.origin} ES</text>`;
  s += qr(596, 170, 62);
  s += barcode(456, 232, 150, 46);
  s += `<text x="456" y="296" fill="#0f172a" font-size="12" font-family="monospace" letter-spacing="2">8 412345 678905</text>`;
  s += `<rect x="456" y="312" width="220" height="1.4" fill="#e2e8f0"/>`;
  s += `<text x="456" y="336" fill="#0c7d68" font-size="10.5" font-weight="700">EAN-13 + QR</text>`;
  // pie
  s += `<circle cx="70" cy="424" r="3" fill="#0d9e80"/><text x="84" y="428" fill="#64748b" font-size="11">${L.foot}</text>`;
  return s + '</svg>\n';
}

// ---------- 2) ZONA PROTEGIDA (PZ) ----------
function zonaProtegida(L) {
  let s = head(L.title) + chrome(L.title);
  s += `<text x="60" y="98" fill="#0f172a" font-size="14" font-weight="700">${L.heading}</text>`;
  s += `<text x="688" y="98" text-anchor="end" fill="#64748b" font-size="11.5">Buxus sempervirens</text>`;
  const rows = [[L.species, 'Buxus sempervirens'], [L.family, 'Buxaceae'], [L.organism, 'Cydalima perspectalis']];
  let y = 128;
  for (const [k, v] of rows) {
    s += `<text x="60" y="${y}" fill="#64748b" font-size="11">${k}</text>`;
    s += `<rect x="60" y="${y + 6}" width="360" height="30" rx="8" fill="#ffffff" stroke="#cbd5e1"/>`;
    s += `<text x="74" y="${y + 26}" fill="#0f172a" font-size="12" font-weight="600" font-style="${k === L.species ? 'italic' : 'normal'}">${v}</text>`;
    y += 52;
  }
  // toggle PZ activado
  s += `<text x="60" y="${y}" fill="#64748b" font-size="11">${L.pz}</text>`;
  s += `<rect x="60" y="${y + 6}" width="72" height="30" rx="15" fill="#dc2626"/>`;
  s += `<circle cx="115" cy="${y + 21}" r="11" fill="#ffffff"/>`;
  s += `<text x="80" y="${y + 25}" fill="#ffffff" font-size="11" font-weight="700">${L.yes}</text>`;

  // preview pasaporte con badge PZ (derecha)
  s += `<rect x="452" y="120" width="248" height="230" rx="12" fill="#ffffff" stroke="#e2e8f0" filter="url(#fsh2)"/>`;
  s += `<path d="M452 132 a12 12 0 0 1 12 -12 h224 a12 12 0 0 1 12 12 v22 h-248 z" fill="#0d9e80"/>`;
  s += `<text x="466" y="139" fill="#ffffff" font-size="10.5" font-weight="700">${L.passport}</text>`;
  s += `<rect x="640" y="126" width="44" height="20" rx="6" fill="#dc2626"/>`;
  s += `<text x="662" y="140" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">PZ</text>`;
  const pp = [['A', 'Buxus sempervirens'], ['B', 'ES-08 09'], ['C', 'L-2026-0345'], ['D', 'ES']];
  let py = 180;
  for (const [a, v] of pp) {
    s += `<text x="470" y="${py}" fill="#0c2a47" font-size="11.5"><tspan font-weight="800">${a} ·</tspan> ${v}</text>`;
    py += 22;
  }
  s += `<rect x="470" y="284" width="210" height="1.4" fill="#eef2f6"/>`;
  s += `<rect x="470" y="298" width="196" height="20" rx="6" fill="#fee2e2"/>`;
  s += `<text x="480" y="312" fill="#b91c1c" font-size="10" font-weight="700">${L.quarantine}: Cydalima perspectalis</text>`;
  s += `<circle cx="70" cy="424" r="3" fill="#0d9e80"/><text x="84" y="428" fill="#64748b" font-size="11">${L.foot}</text>`;
  return s + '</svg>\n';
}

// ---------- 3) DUPLICADO A4 (2 EN 1) ----------
function duplicado(L) {
  let s = head(L.title) + chrome(L.title);
  s += `<text x="60" y="98" fill="#0f172a" font-size="14" font-weight="700">${L.heading}</text>`;
  // botón imprimir A4
  s += `<rect x="560" y="82" width="140" height="34" rx="9" fill="#0d9e80"/>`;
  s += `<text x="630" y="104" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">${L.print}</text>`;
  // hoja A4 centrada
  s += `<rect x="250" y="120" width="260" height="316" rx="6" fill="#ffffff" stroke="#cbd5e1" filter="url(#fsh2)"/>`;
  s += `<text x="380" y="140" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="700" letter-spacing="2">A4 · 210 × 297 mm</text>`;
  // dos pasaportes (arriba/abajo)
  function passport(x, y) {
    let g = `<rect x="${x}" y="${y}" width="212" height="118" rx="8" fill="#ffffff" stroke="#0d9e80"/>`;
    g += `<path d="M${x} ${y + 10} a10 10 0 0 1 10 -10 h192 a10 10 0 0 1 10 10 v14 h-212 z" fill="#0d9e80"/>`;
    g += `<text x="${x + 12}" y="${y + 15}" fill="#ffffff" font-size="9" font-weight="700">${L.passportShort}</text>`;
    g += `<text x="${x + 12}" y="${y + 40}" fill="#0c2a47" font-size="10"><tspan font-weight="800">A ·</tspan> Rosa gallica</text>`;
    g += `<text x="${x + 12}" y="${y + 56}" fill="#0c2a47" font-size="10"><tspan font-weight="800">B ·</tspan> ES-08 09</text>`;
    g += `<text x="${x + 12}" y="${y + 72}" fill="#0c2a47" font-size="10"><tspan font-weight="800">C ·</tspan> L-2026-0345</text>`;
    g += `<text x="${x + 12}" y="${y + 88}" fill="#0c2a47" font-size="10"><tspan font-weight="800">D ·</tspan> ES</text>`;
    g += qr(x + 156, y + 34, 44);
    return g;
  }
  s += passport(274, 156);
  s += passport(274, 302);
  // línea de corte
  s += `<line x1="262" y1="288" x2="498" y2="288" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="5 5"/>`;
  s += `<text x="516" y="220" fill="#0c7d68" font-size="11" font-weight="700" transform="rotate(90 516 220)">2 ${L.perSheet}</text>`;
  s += `<circle cx="70" cy="424" r="3" fill="#0d9e80"/><text x="84" y="428" fill="#64748b" font-size="11">${L.foot}</text>`;
  return s + '</svg>\n';
}

// =============== TEXTOS POR IDIOMA ===============
const T = {
  es: {
    etiquetas: {
      title: 'Fitoware · Etiquetas y EAN-13', heading: 'Diseño de etiqueta', item: 'Artículo',
      ean: 'Código EAN-13', batch: 'Lote', qty: 'Cantidad', print: 'Imprimir etiquetas',
      preview: 'VISTA PREVIA', origin: 'Origen', foot: 'Genera el EAN-13 y el QR de trazabilidad automáticamente.',
    },
    zona: {
      title: 'Fitoware · Zona protegida (PZ)', heading: 'Ficha de especie', species: 'Especie', family: 'Familia',
      organism: 'Organismo de cuarentena', pz: 'Zona protegida (PZ)', yes: 'Sí', passport: 'PASAPORTE FITOSANITARIO UE',
      quarantine: 'Organismo', foot: 'El indicador PZ y el organismo aparecen en el pasaporte de las especies que lo requieren.',
    },
    duplicado: {
      title: 'Fitoware · Duplicado A4 (2 en 1)', heading: 'Vista previa de impresión', print: 'Imprimir A4',
      passportShort: 'PASAPORTE FITOSANITARIO UE', perSheet: 'por hoja', foot: 'Dos pasaportes por hoja A4, para archivar y entregar.',
    },
  },
  ca: {
    etiquetas: {
      title: 'Fitoware · Etiquetes i EAN-13', heading: "Disseny d'etiqueta", item: 'Article',
      ean: 'Codi EAN-13', batch: 'Lot', qty: 'Quantitat', print: 'Imprimir etiquetes',
      preview: 'VISTA PRÈVIA', origin: 'Origen', foot: "Genera l'EAN-13 i el QR de traçabilitat automàticament.",
    },
    zona: {
      title: 'Fitoware · Zona protegida (PZ)', heading: "Fitxa d'espècie", species: 'Espècie', family: 'Família',
      organism: 'Organisme de quarantena', pz: 'Zona protegida (PZ)', yes: 'Sí', passport: 'PASSAPORT FITOSANITARI UE',
      quarantine: 'Organisme', foot: "L'indicador PZ i l'organisme apareixen al passaport de les espècies que ho requereixen.",
    },
    duplicado: {
      title: 'Fitoware · Duplicat A4 (2 en 1)', heading: "Vista prèvia d'impressió", print: 'Imprimir A4',
      passportShort: 'PASSAPORT FITOSANITARI UE', perSheet: 'per full', foot: 'Dos passaports per full A4, per arxivar i lliurar.',
    },
  },
  en: {
    etiquetas: {
      title: 'Fitoware · Labels & EAN-13', heading: 'Label design', item: 'Item',
      ean: 'EAN-13 code', batch: 'Batch', qty: 'Quantity', print: 'Print labels',
      preview: 'PREVIEW', origin: 'Origin', foot: 'Generates the EAN-13 and traceability QR automatically.',
    },
    zona: {
      title: 'Fitoware · Protected zone (PZ)', heading: 'Species record', species: 'Species', family: 'Family',
      organism: 'Quarantine organism', pz: 'Protected zone (PZ)', yes: 'Yes', passport: 'EU PLANT PASSPORT',
      quarantine: 'Organism', foot: 'The PZ flag and organism appear on the passport of species that require it.',
    },
    duplicado: {
      title: 'Fitoware · A4 duplicate (2-up)', heading: 'Print preview', print: 'Print A4',
      passportShort: 'EU PLANT PASSPORT', perSheet: 'per sheet', foot: 'Two passports per A4 sheet, to file and hand over.',
    },
  },
};

const OUT = process.argv[2];
const suffix = { es: '', ca: '-ca', en: '-en' };
for (const lang of ['es', 'ca', 'en']) {
  writeFileSync(`${OUT}/etiquetas${suffix[lang]}.svg`, etiquetas(T[lang].etiquetas));
  writeFileSync(`${OUT}/zona-protegida${suffix[lang]}.svg`, zonaProtegida(T[lang].zona));
  writeFileSync(`${OUT}/duplicado${suffix[lang]}.svg`, duplicado(T[lang].duplicado));
}
console.log('OK: etiquetas/zona-protegida/duplicado × {es,ca,en} generados');
