# juice 1.0.2

Igual que 1.0.1, más la regla de marca: el papel `#F4E8D5` no se usa como texto sobre oscuro.

- `.jz-panel` (fondo `#161616`): texto principal `var(--brand-text-on-dark, #FFFFFF)`. Texto secundario (`.jz-panel__note`) `var(--brand-text-muted, #B7B3AD)`.
- Partículas y ripple pueden seguir usando papel: no son texto.
- `juice/1.0.0/` y `juice/1.0.1/` no se tocan.

Build y pruebas: `tools/juice-1.0.2/` y `npm test`. Chromium: `npm run test:install`.
