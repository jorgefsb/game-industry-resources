# juice 1.0.1

Motion y sonido de la marca personal. El paquete **no carga fuentes**: no hay `@import` ni `@font-face`.

Cambio frente a 1.0.0 (el paquete 1.0.0 no se toca):

- Botón de sonido: el texto visible y el `aria-label` son la misma frase (`Sonido` / `Sound`). El estado va en `aria-pressed`. El emoji va aparte con `aria-hidden="true"`.
- Botón del menú móvil: el emoji ✨ es decorativo (`aria-hidden`). El texto visible y el `aria-label` son `Sonido y juice` / `Sound and juice`.
- El flash es `.jz-flash`: borde de 3px `#FF6B35` que dura poco. Sin resplandor.
- La palomita sobre naranja usa `var(--brand-ink, #22211F)`. El anillo del sello usa `var(--brand-accent, #FF6B35)`.

Build y pruebas viven en `tools/juice-1.0.1/` (no se publican junto al paquete): `npm run test:install` (baja Chromium de Playwright) y luego `npm test`. Sin browser la suite falla; no se salta.

La página anfitriona debe cargar **Outfit 700** (títulos y sello «Listo») e **Inter 400** (menú, leyenda y cuerpo). El CSS usa:

- Cuerpo (`.juice-sfx`, `.jz-lvl`, `.jz-feel`, `.jz-panel`, leyenda, `.jz-steps`): `font-family: var(--brand-font-body, Inter, system-ui, sans-serif)` peso 400
- Sello (`.jz-stamp`): `font-family: var(--brand-font-heading, Outfit, Inter, system-ui, sans-serif)` peso 700

Si el host ya define `--brand-font-body` y `--brand-font-heading`, se respetan.
