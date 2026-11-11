# data/noticias

Fuente de datos del digest semanal LATAM de `/noticias/`.

## Cadencia (LOCK 24-oct-2026)

- Noticias: **semanal**.
- Pulso de cifras: **trimestral** (enero, abril, julio, octubre). No mensual.

## Formato

Un archivo JSON por semana: `YYYY-Www.json` (ejemplo `2026-W46.json`).

```json
{
  "week": "2026-W46",
  "published_at": "2026-11-09",
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

Estado actual: **publicado**. Último digest: `2026-W46.json` (semana 2026-W46, publicada el 9 nov 2026, 4 items: 1 MX y 3 LATAM).

Historial: `2026-W45.json` (publicada el 2 nov 2026, 6 items), `2026-W44.json` (publicada el 26 oct 2026, 6 items) y `2026-W43.json` (publicada el 24 oct 2026, 4 items LATAM). La lista visible de `/noticias/` muestra solo el digest más reciente; las ediciones anteriores viven en este directorio.

Los items `GLOBAL` solo entran cuando mueven a la región, y el `summary` lo dice de forma explícita.

Gap conocido de 2026-W46: en la ventana 2 a 9 nov no se verificaron inversiones, cierres ni lanzamientos de estudios MX. La nota mexicana es el arranque de Pixelatl en Zapopan, un hecho nuevo frente al anuncio previo de W44. En la UI se marca el alcance de la búsqueda en `news.how.note`.

Criterio de fechas W46: `date` corresponde al estreno en Steam para Gauchesca y al arranque del evento indicado en el cuerpo de la crónica para Pixelatl (7 nov; la cabecera del medio marca 6 nov). Para Ancine y Abragames corresponde a la cobertura del 5 y 6 nov. De Ancine se recoge la consulta regulatoria, sin repetir el decreto de W44 ni presentar como nuevo el fondo del BNDES aprobado en octubre. La investigación de Abragames aún no publica resultados: no se usa la estimación de estudios como cifra confirmada.
