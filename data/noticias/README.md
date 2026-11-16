# data/noticias

Fuente de datos del digest semanal LATAM de `/noticias/`.

## Cadencia (LOCK 24-oct-2026)

- Noticias: **semanal**.
- Pulso de cifras: **trimestral** (enero, abril, julio, octubre). No mensual.

## Formato

Un archivo JSON por semana: `YYYY-Www.json` (ejemplo `2026-W47.json`).

```json
{
  "week": "2026-W47",
  "published_at": "2026-11-16",
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

Estado actual: **publicado**. Último digest: `2026-W47.json` (semana 2026-W47, publicada el 16 nov 2026, 6 items: 2 MX y 4 LATAM).

Historial: `2026-W46.json` (publicada el 9 nov 2026, 4 items), `2026-W45.json` (publicada el 2 nov 2026, 6 items), `2026-W44.json` (publicada el 26 oct 2026, 6 items) y `2026-W43.json` (publicada el 24 oct 2026, 4 items LATAM). La lista visible de `/noticias/` muestra solo el digest más reciente; las ediciones anteriores viven en este directorio.

Los items `GLOBAL` solo entran cuando mueven a la región, y el `summary` lo dice de forma explícita.

Gap conocido de 2026-W47: en la ventana 9 a 16 nov no se verificaron inversiones, cierres ni lanzamientos de estudios MX. Las notas mexicanas son el cierre de Pixelatl (palmarés y VMX Showroom), hechos nuevos frente al anuncio de W44 y al arranque de W46. Game Conference MX (13 y 14 nov, Guadalajara) no tenía resultados ni ganadores publicados y verificables al cierre. En la UI se marca el alcance de la búsqueda en `news.how.note`.

Criterio de fechas W47: `date` corresponde a la publicación del palmarés en Radix (16 nov) y a la nota de agencias sobre el VMX Showroom (14 nov; la misma nota salió en Proceso el 13 nov, pero ese sitio bloquea la verificación automática). Para Rulebound es el estreno en Steam (10 nov); que Garage Monke es un estudio argentino lo confirma Press Over, no la ficha de Steam. Que Templo es un estudio mexicano lo confirma su comunicado en Games Press; Radix solo lista "Hellbound Inc. (Templo)". Para los LAGS Awards es la cobertura de Press Over (13 nov; el anuncio es del 11 nov). Para GDV Festival es la nota previa de Agência Brasil (13 nov): ganadores de los GDV Awards y resultados del estudio de Sebrae quedan como `[SIN DATO]`. Para Gamescom Latam es la cobertura de The Gaming Era (12 nov).
