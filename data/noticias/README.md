# data/noticias

Fuente de datos del digest semanal LATAM de `/noticias/`.

## Cadencia (LOCK 24-oct-2026)

- Noticias: **semanal**.
- Pulso de cifras: **trimestral** (enero, abril, julio, octubre). No mensual.

## Formato

Un archivo JSON por semana: `YYYY-Www.json` (ejemplo `2026-W45.json`).

```json
{
  "week": "2026-W45",
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
      "region": "MX | LATAM | GLOBAL"
    }
  ]
}
```

## Reglas

- Cada item necesita `url` y `source` verificables. Sin fuente no se publica.
- Si falta un dato, se marca `[SIN DATO]`. No se inventa.
- Copy bilingüe ES + EN siempre, igual que el resto del sitio.
- Sin em dash en el copy de UI. Guion normal o punto.

Estado actual: **publicado**. Último digest: `2026-W44.json` (semana 2026-W44, publicada el 26 oct 2026, 6 items: 2 MX, 2 LATAM, 2 GLOBAL).

Historial: `2026-W43.json` (publicada el 24 oct 2026, 4 items LATAM). La lista visible de `/noticias/` muestra solo el digest más reciente; las ediciones anteriores viven en este directorio.

Los items `GLOBAL` solo entran cuando mueven a la región, y el `summary` lo dice de forma explícita.

Gap conocido de 2026-W44: en la ventana 19-26 oct no hubo inversiones ni cierres de estudios MX confirmables. Lo verificable de México fue programa público (Conecta Challenge 2026) y festival (Pixelatl 2026). En la UI se marca en `news.how.note`.
