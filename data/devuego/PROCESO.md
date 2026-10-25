# Cómo se actualiza esta base

No la llena la comunidad. Un dato sin revisión se publica y después no se puede deshacer delante de un estudio.

## Quién

Scout nuestro. Script en `scripts/scout-devuego.py`. Lo corre OA, no un perfil nuevo.

## Qué baja

1. Estudios que DeVuego marca en activo: `/estudios/letra/{letra}`
2. Estudios que marca cerrados: `/estudios/letra/{letra}/cerrados`
3. Portadas de últimos lanzamientos.
4. El mapa se enlaza. No se redibuja hasta tener vivos y cerrados en el mismo corte.

## Qué no hace

- No inventa ventas, utilidad ni un blanco de compra.
- No publica un cero de cerrados si esa vista no terminó.
- No acepta un formulario público como fuente.

## Cómo entra

El script escribe `data/devuego/estudios.json`. El diff va a git. Si el corte está mal, se vuelve al commit anterior. Rollback de esta tanda: `5c98e34`.

## Cadencia

Semanal. Si dos pasadas fallan igual, se pausa. No se republica el mismo error.
