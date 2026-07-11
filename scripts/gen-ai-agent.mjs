// Diagrama radial "¿Qué puede hacer un agente de IA?" multiidioma, estilo Fitoware.
import { writeFileSync } from 'node:fs';
const FONT = 'Inter, Segoe UI, Arial, sans-serif';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Iconos mini (trazo verde), 24x24 viewBox escalado
const ICONS = {
  cursor: '<path d="M5 3l6 16 2-7 7-2z"/>',
  review: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h6M8 12h6M8 16h4"/>',
  sum: '<path d="M7 5h10l-6 7 6 7H7"/>',
  integrate: '<circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/>',
  shield: '<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/><path d="M9 12l2 2 4-4"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  bell: '<path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
};

function nodeCard(x, y, w, txt, icon) {
  const h = 56;
  return `<g>
    <rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
    <circle cx="${(x - w / 2 + 30).toFixed(1)}" cy="${y}" r="17" fill="#e7f4ee"/>
    <g transform="translate(${(x - w / 2 + 30 - 10).toFixed(1)},${y - 10}) scale(0.83)" fill="none" stroke="#0d9e80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon]}</g>
    <text x="${(x - w / 2 + 56).toFixed(1)}" y="${y + 5}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0c2a47">${esc(txt)}</text>
  </g>`;
}

function build(L) {
  const cx = 500, cy = 285;
  const nodes = [
    { icon: 'cursor', a: 210 }, { icon: 'review', a: 270 }, { icon: 'sum', a: 330 },
    { icon: 'integrate', a: 160 }, { icon: 'shield', a: 20 },
    { icon: 'alert', a: 130 }, { icon: 'bell', a: 90 }, { icon: 'monitor', a: 50 },
  ];
  const rx = 360, ry = 195;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 570" font-family="${FONT}" role="img" aria-label="${esc(L.center)}">`;
  s += `<rect width="1000" height="570" fill="#ffffff"/>`;
  // conectores
  s += '<g stroke="#a4d8bf" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round">';
  for (const n of nodes) {
    const rad = (n.a * Math.PI) / 180;
    const nx = cx + rx * Math.cos(rad), ny = cy + ry * Math.sin(rad);
    s += `<line x1="${cx.toFixed(0)}" y1="${cy.toFixed(0)}" x2="${nx.toFixed(0)}" y2="${ny.toFixed(0)}"/>`;
  }
  s += '</g>';
  // centro
  s += `<rect x="${cx - 130}" y="${cy - 55}" width="260" height="110" rx="20" fill="#e7f4ee"/>`;
  s += `<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="24" font-weight="800" fill="#0c7d68">${esc(L.center1)}</text>`;
  s += `<text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="24" font-weight="800" fill="#0c7d68">${esc(L.center2)}</text>`;
  // nodos
  nodes.forEach((n, i) => {
    const rad = (n.a * Math.PI) / 180;
    const nx = cx + rx * Math.cos(rad), ny = cy + ry * Math.sin(rad);
    const txt = L.items[i];
    const w = Math.min(300, Math.max(150, txt.length * 8.6 + 78));
    s += nodeCard(nx, ny, w, txt, n.icon);
  });
  s += '</svg>\n';
  return s;
}

const LANGS = {
  es: { center: '¿Qué puede hacer un agente de IA?', center1: '¿Qué puede hacer', center2: 'un agente de IA?',
    items: ['Automatiza clics', 'Revisa datos', 'Calcula valores', 'Integra datos', 'Mantiene datos limpios', 'Detecta excepciones', 'Envía alertas y tareas', 'Sigue el progreso'] },
  ca: { center: "Què pot fer un agent d'IA?", center1: 'Què pot fer', center2: "un agent d'IA?",
    items: ['Automatitza clics', 'Revisa dades', 'Calcula valors', 'Integra dades', 'Manté dades netes', 'Detecta excepcions', 'Envia alertes i tasques', 'Segueix el progrés'] },
  en: { center: 'What can an AI Agent do?', center1: 'What can an', center2: 'AI Agent do?',
    items: ['Automate clicks', 'Review data', 'Calculate values', 'Integrate data', 'Keep data clean', 'Detect exceptions', 'Send alerts & tasks', 'Track progress'] },
};

const OUT = process.argv[2];
for (const [lang, suffix] of [['es', ''], ['ca', '-ca'], ['en', '-en']]) {
  writeFileSync(`${OUT}/ai-agente${suffix}.svg`, build(LANGS[lang]));
}
console.log('OK: ai-agente {es,ca,en} generados en', OUT);
