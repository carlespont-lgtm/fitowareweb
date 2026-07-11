# Scripts de generación de mockups (SVG)

Los mockups e ilustraciones de `public/mockups/` se generan con estos scripts de Node
(no requieren dependencias externas). Cada uno recibe como argumento la carpeta destino.

```bash
# Ilustraciones isométricas: operaciones-iso-* (ecosistema) y operaciones-ia-* (agente IA)
node scripts/gen-operaciones.mjs "public/mockups"

# Mockups de app: etiquetas-*, zona-protegida-*, duplicado-* (los 3 en es/ca/en)
node scripts/gen-features-mockups.mjs "public/mockups"

# Diagrama radial "¿Qué puede hacer un agente de IA?": ai-agente-*
node scripts/gen-ai-agent.mjs "public/mockups"
```

Cada script produce las 3 variantes de idioma (`base.svg` = ES, `-ca.svg`, `-en.svg`).
Los textos por idioma están dentro de cada script (objetos `LANGS` / `AI_LANGS` / `T`).

> Importante: escapar `&`, `<`, `>` en cualquier texto que vaya dentro de un `<text>`
> del SVG (ya se hace con la función `esc()`), o el SVG no renderiza.

El resto de mockups (`fitoware-especies`, `fitoware-pasaporte`, `trazabilidad`,
`business-central-horticultura`, etc.) están hechos a mano en `public/mockups/`.
Las fotos reales están en `public/photos/` y las capturas de Business Central en
`public/screens/`.
