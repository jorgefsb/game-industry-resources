# data/noticias

Fuente de datos del digest semanal LATAM de `/noticias/`.

## Cadencia (LOCK 24-oct-2026)

- Noticias: **semanal**.
- Pulso de cifras: **trimestral** (enero, abril, julio, octubre). No mensual.

## Formato

Un archivo JSON por semana: `YYYY-Www.json` (ejemplo `2026-W44.json`).

```json
{
  "week": "2026-W44",
  "published_at": "2026-11-02",
  "items": [
    {
      "title_es": "",
      "title_en": "",
      "summary_es": "",
      "summary_en": "",
      "url": "",
      "source": "",
      "date": "YYYY-MM-DD",
      "region": "MX | LATAM"
    }
  ]
}
```

## Reglas

- Cada item necesita `url` y `source` verificables. Sin fuente no se publica.
- Si falta un dato, se marca `[SIN DATO]`. No se inventa.
- Copy bilingüe ES + EN siempre, igual que el resto del sitio.
- Sin em dash en el copy de UI. Guion normal o punto.

Estado actual: **publicado**. Primer digest: `2026-W43.json` (semana 2026-W43, publicada el 24 oct 2026, 4 items LATAM).

Gap conocido de 2026-W43: sin inversiones, cierres ni policy de MX en la ventana 22-24 oct. En la UI se marca como `MX esta semana: [SIN DATO]`.
