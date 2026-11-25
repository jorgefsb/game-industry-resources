# data/noticias

Fuente de datos del digest semanal LATAM de `/noticias/`.

## Cadencia (LOCK 24-oct-2026)

- Noticias: **semanal**.
- Pulso de cifras: **trimestral** (enero, abril, julio, octubre). No mensual.

## Formato

Un archivo JSON por semana: `YYYY-Www.json` (ejemplo `2026-W48.json`).

```json
{
  "week": "2026-W48",
  "published_at": "2026-11-23",
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

Estado actual: **publicado**. Último digest: `2026-W48.json` (semana 2026-W48, publicada el 23 nov 2026, 4 items: 1 MX y 3 LATAM).

Historial: `2026-W47.json` (publicada el 16 nov 2026, 6 items), `2026-W46.json` (publicada el 9 nov 2026, 4 items), `2026-W45.json` (publicada el 2 nov 2026, 6 items), `2026-W44.json` (publicada el 26 oct 2026, 6 items) y `2026-W43.json` (publicada el 24 oct 2026, 4 items LATAM). La lista visible de `/noticias/` muestra solo el digest más reciente; las ediciones anteriores viven en este directorio y en el bloque Semanas anteriores.

Los items `GLOBAL` solo entran cuando mueven a la región, y el `summary` lo dice de forma explícita.

Gap conocido de 2026-W48: en la ventana 16 a 23 nov no se verificaron inversiones, cierres ni lanzamientos de estudios MX. La nota mexicana es el balance de Game Conference MX publicado el 19 nov, con cifras y premios que no se habían confirmado en W47. El evento ocurrió el 13 y 14 nov; no se presenta como celebrado esta semana. Pixelatl y The War in Chiapas no se repiten sin un hecho nuevo frente a W47. En la UI se marca el alcance de la búsqueda en `news.how.note`.

Criterio de fechas W48: `date` es la publicación del comunicado de GCMX (19 nov), la jornada LEVEL UY ESTE en Maldonado del programa oficial (23 nov), la entrevista previa sobre C3 Expo (17 nov) y el balance del LAIC en MeriStation (22 nov). La jornada de Maldonado es adicional a las fechas de Montevideo publicadas en W45; el sitio identifica a Camila Bentancur como Premio Sofía 2026, pero no fecha por separado la entrega. CONAVI 2026 queda como `[SIN DATO]`. C3 Expo se anunció para el 20 al 22 nov: 6 mil personas es expectativa, no asistencia observada; el cierre queda como `[SIN DATO]`. LAIC corresponde a la temporada competitiva 2027, aunque ocurre en noviembre de 2026.

Descartados de W48: GDV Awards tiene ganadores oficiales, pero la ceremonia fue el 15 nov, fuera de ventana. Ancine, Marco Legal, Abragames, BIG Festival, ADVA/EVA y Super Indie Games no aportaron un hecho nuevo verificable en esta ventana. Chile Game Conference tiene fecha 17 nov, pero las fuentes revisadas devolvieron HTTP 403 a curl. No se incorporaron especulaciones sobre nominados LAGS, cifras generales de Buen Fin o Black Friday, ni noticias globales de Littlebird sin efecto regional confirmado.
