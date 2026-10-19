# juice 1.1.0

Igual que 1.0.2, más:

- **Nombres que entiende cualquiera.** El botón dice «Juega» / «Play» y los niveles son **Nada · Poquito · Mucho** (None · A little · A lot). El panel dice «Sonido y juego».
- **Nivel de arranque por sitio.** `<html data-jz-default="full">` arranca en Mucho mientras la persona no haya elegido otro. Movimiento reducido sigue forzando Nada.
- **`JZ.audio()`** regresa `{ctx, out}` solo si el sonido está prendido, para que los módulos suenen por el mismo volumen y el mismo botón.
- **Moki escondido** (`moki/`): Moki se asoma por los bordes de los paneles. Si le picas, se voltea, mueve las pompis y dice algo en español o inglés según el idioma de la página. El que cuelga se jala y se columpia con física. Cada día cambia de escondites (`<html data-moki-show="5">` elige 5 de todos los que haya) y lleva el contador «Mokis de hoy». Al encontrar todos: fanfarria, confeti y Moki bailando.

## Instalar

```html
<link rel="stylesheet" href="/juice/1.1.0/juice.css">
<link rel="stylesheet" href="/juice/1.1.0/juice-menu.css">
<link rel="stylesheet" href="/juice/1.1.0/moki/moki.css">
…
<script src="/juice/1.1.0/juice.js" defer></script>
<script src="/juice/1.1.0/juice-menu.js" defer></script>
<script src="/juice/1.1.0/moki/moki.js" defer></script>
```

Escondites: `<span data-moki="arriba|cuelga|asoma|saluda" data-moki-id="sitio-seccion" style="--moki-r:8%"></span>` dentro de un panel. Variables: `--moki` (alto), `--moki-r` (al borde derecho), `--moki-y` (alto de «asoma»), `--rope` (largo del hilo de «cuelga»).

## Niveles y Moki

- **Nada** o movimiento reducido: Moki se queda asomado, no se mueve y solo cambia de pose al picarle.
- **Poquito:** se asoma de vez en cuando, brinca y mueve las pompis.
- **Mucho:** sale más seguido, más brincos y chispas, y la fiesta del final trae doble confeti.

## Sonido

Apagado por defecto y solo después de un gesto. Los sonidos de juice duran menos de 150 ms. Los de Moki son la excepción aprobada por Jorge el 19-oct-2026: el «¡Ay!» (menos de 0.6 s) suena solo al picarle y la fanfarria (unos 2 s) solo al encontrar a todos. Todo pasa por el volumen maestro de juice (0.125).

## Reglas

Moki nunca se espeja, nunca tapa un botón y no usa loops permanentes: el columpio se detiene solo. Build y pruebas: `node tools/juice-1.1.0/build.mjs` y `npm test`.
