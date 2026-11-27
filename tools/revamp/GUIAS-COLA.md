# Cola de guías propias

Una guía por semana (tarea de los viernes). La meta: que cada búsqueda en español de alguien que hace juegos en LATAM termine en una página nuestra que resuelve el problema completo, con fuente oficial en cada dato.

## Reglas de una guía

1. Responde una sola pregunta, la del título, en los primeros dos párrafos. Luego los pasos.
2. Cada dato de terceros lleva liga a su fuente oficial (la tienda, la autoridad fiscal, el fondo) revisada el mismo día, con la fecha de revisión visible en la página.
3. Nada de cifras de mercado ni sueldos sin fuente con fecha. Si no hay dato confiable, se dice.
4. Temas fiscales y legales: solo lo que dice la fuente oficial, con la nota «esto no es asesoría fiscal ni legal».
5. La sección «Lo que hemos visto» solo usa lo que está en `EXPERIENCIA-JORGE.md`. Si no hay nada que aplique, no va.
6. Termina con una herramienta del sitio que sirva para el siguiente paso (kit, calculadora, directorio IA, convocatorias) y el registro al boletín.
7. ES y EN completos. Marca personal: Outfit 700, Inter 400, negro, naranja y papel. Sin neón.
8. No se copia la estructura ni el texto de ninguna fuente. Se enlaza y se agradece en /gracias.

## En cola

1. Cómo cobrar en dólares por tu juego o tu trabajo desde México.
2. Cómo presentar tu juego a un publisher: qué piden y qué mandar (se apoya en el pitch del kit).
3. Cómo conseguir tu primer trabajo en videojuegos desde Latinoamérica.
4. Cuántas wishlists necesita tu juego antes de lanzar en Steam (con la fuente del dato y su fecha).
5. Cómo publicar tu juego en Steam desde Argentina.
6. Cómo publicar tu juego en Steam desde Colombia.
7. Cómo abrir un estudio de videojuegos en México: figuras legales y facturación, según fuentes oficiales.
8. Game jams en Latinoamérica: cuáles hay y cómo sacarles provecho.
9. Qué motor usar para tu primer juego: Unity, Unreal, Godot o GameMaker.
10. Cómo usar IA en tu juego sin meterte en problemas con las tiendas (reglas de Steam y otras, con liga).

## Reescrituras pendientes (una al mes, en lugar de la guía de esa semana)

Estas tres secciones nacieron de la estructura de otra fuente. Se rehacen con formato propio:

1. `industria.html`: pasa a ser «Radar de la industria»: qué informes existen, de quién, de qué fecha y qué dicen, con liga a cada uno. Sin repetir sus tablas.
2. `ecosistema.html`: pasa a ser un directorio que se puede filtrar por ciudad y por tipo (comunidad, evento, escuela), cada ficha con liga oficial revisada.
3. `ciclo.html`: pasa a ser una ruta con las plantillas del kit y la calculadora metidas en cada etapa.

## Publicadas

1. 2026-11-13 · Cómo publicar tu juego en Steam desde México · `guias/publicar-juego-en-steam-desde-mexico.html` · https://gamedev.jorgesuarez.com.mx/guias/publicar-juego-en-steam-desde-mexico
   - Fuentes: documentación de Steamworks (incorporación, cuota, impuestos, pagos, precios), tabla 1 de tratados del IRS (rev. mayo 2023), W-8BEN del IRS y trámites del RFC del SAT. Todas en 200 el 13-nov-2026.
   - Ojo al revisar: la espera entre cuota y lanzamiento hoy es de 21 días (antes eran 30). El porcentaje de Steam no está en la documentación abierta; no se publicó cifra.
   - Sin «Lo que hemos visto»: EXPERIENCIA-JORGE.md no tiene nada sobre publicar en tienda todavía.
   - Visitas (Pulso, 28 días al 27-nov): 3 vistas. Pulso da los orígenes por sitio, no por página: gamedev tuvo 5 visitas de google.com en total. Lleva 2 semanas publicada; el aviso de «revisar título» toca el 11-dic si sigue sin visitas de buscador.
2. 2026-11-27 · Cuánto cuesta hacer un videojuego indie en Latinoamérica · `guias/cuanto-cuesta-hacer-un-videojuego-indie.html` · https://gamedev.jorgesuarez.com.mx/guias/cuanto-cuesta-hacer-un-videojuego-indie
   - Fuentes: cuota de Steam Direct y anuncio de reparto de 2018 (Valve), distribución de Epic Games Store, itch.io (FAQ y pagos), Play Console (alta y comisiones), Apple (programa y Small Business Program), licencias de Godot, Unity, Unreal, GameMaker y FMOD, FAQ de Nintendo y tipo de cambio de Banxico. Todas en 200 el 27-nov-2026; Epic y Unreal dan 403 a curl y 200 en navegador.
   - Ojo al revisar: Unity Pro «desde 2,310 dólares al año» y el tope de 200,000 de Personal cambian seguido. El precio de GameMaker Enterprise no se publicó porque la página no deja claro si es mensual o anual. La comisión base de Steam sigue sin estar en documentación abierta.
   - Sin cifras de sueldos ni rangos de presupuesto: no hay fuente pública con fecha y método para LATAM. El ejemplo de la cuenta usa números inventados y lo dice.
   - Sin «Lo que hemos visto»: EXPERIENCIA-JORGE.md no tiene nada sobre presupuestos todavía (la pregunta abierta 2 lo resolvería).
   - Visitas (Pulso, 28 días): se mide desde el 4-dic.
   - La semana del 20-nov no hubo guía (la tarea no corrió).

## Cómo se arma una guía (técnico)

El contenido vive en `tools/revamp/guias.py` (lista `GUIAS`). `build.py` genera `guias/<slug>.html` y `guias/index.html`, las mete al menú, al diccionario SEO y al sitemap. Texto en ES y EN por bloque; se muestra uno u otro con `data-l`.
