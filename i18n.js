// i18n System - Comprehensive Bilingual Support (ES/EN)
const translations = {
    es: {
        // Navigation & General UI
        'nav.resources': 'Recursos',
        'nav.ia': 'IA',
        'nav.industry': 'Industria',
        'nav.jobs': 'Jobs & Career',
        'nav.studios': 'Studios DB',
        'nav.community': 'Comunidad',
        'nav.cta': '🎮 Únete a EGDC',
        'nav.home': '← JorgeSuarez<span>.com.mx</span>',
        'nav.label': 'Principal',
        'nav.menu': 'Menú',
        'lang.label': 'Idioma',
        'ui.skip': 'Ir a recursos',
        'alt.mokiHome': 'Moki, el astronauta de cartón naranja, listo para explorar',
        'ui.sfx.on': 'Silenciar',
        'ui.sfx.off': 'Activar sonido',
        'hero.cta.ia': 'Ver directorio IA',
        'hero.bubble.home': '¿Listo para el<br>next level?',
        'footer.label': 'Créditos',
        'footer.social': 'Redes',
        'footer.llms': 'Para ChatGPT, Claude y Grok',
        'footer.kaizen': 'Kaizen y Juego',
        'footer.values': 'Jorge Suárez | © 2026 | Construido sobre nuestros valores de Kaizen y Juego.',
        'ia.kicker': 'Directorio · indie + IA',
        'ia.title': 'Herramientas de IA para hacer tu juego',
        'ia.lead': 'Una lista viva, en español primero. Moki te acompaña a filtrar. Sin ratings inventados: nombre, para qué sirve y el sitio oficial.',
        'ia.cta.browse': 'Ver el catálogo',
        'ia.cta.feature': 'Pon tu herramienta aquí',
        'ia.featured.kicker': 'Destacados',
        'ia.featured.title': 'Este slot está vacío. A propósito.',
        'ia.featured.body': 'Las herramientas de este directorio se listan porque existen y sirven para hacer juegos. Destacado / Featured es un lugar pagado: USD 49 al mes, cancelas cuando quieras.',
        'ia.featured.cta': 'Pon tu herramienta aquí / Feature your tool',
        'ia.catalog.kicker': 'Catálogo',
        'ia.search.label': 'Buscar herramientas',
        'ia.empty.title': 'Moki no encontró eso',
        'ia.empty.body': 'Prueba otra categoría o una palabra más corta. Si falta una herramienta real, escríbenos desde Patrocina.',
        'ia.news.title': 'Boletín del directorio',
        'ia.news.body': 'Cuando haya herramientas nuevas o un Destacado real, lo mandamos aquí. Todavía no está conectado.',
        'ia.news.cta': 'Próximamente',
        'ia.machine.title': 'Para agentes y citas',
        'ia.footer': 'Hecho para indie game devs que ya usan IA. Marca personal Jorge Suárez. Moki no se espeja.',
        'ia.sponsor.kicker': 'Destacado / Featured',
        'ia.sponsor.title': 'Pon tu herramienta donde la buscan quienes ya hacen juegos',
        'ia.sponsor.p1': 'Este directorio es para indie game devs que usan IA. El listado orgánico es editorial: herramientas reales, con URL oficial, sin estrellas inventadas.',
        'ia.sponsor.p2': 'Destacado es otra cosa. Es el slot de arriba, el que hoy ocupa Moki con un “aquí va la tuya”. Quien fabrica la herramienta paga para estar ahí un tiempo, con nombre, una línea y el enlace oficial.',
        'ia.sponsor.p3': 'Antes de publicarlo revisamos que la herramienta exista y sirva para hacer juegos. Generar un listing no es lo mismo que verificarlo: Moki ya lo sabe.',
        'ia.sponsor.price': 'USD 49 al mes',
        'ia.sponsor.included.title': 'Qué incluye',
        'ia.sponsor.inc1': 'Tu herramienta como Destacado arriba de todo en /ia, con badge de Moki.',
        'ia.sponsor.inc2': 'Bilingüe: ficha en español e inglés.',
        'ia.sponsor.inc3': 'Aparece en /ia/tools.json y /ia/llms.txt, que leen los chatbots.',
        'ia.sponsor.inc4': 'Cancelas cuando quieras.',
        'ia.sponsor.cta.mail': 'Quiero salir destacado',
        'ia.sponsor.cta.buy': 'Quiero salir destacado',
        'ia.sponsor.back': 'Volver al directorio',
        'ia.sponsor.lesson': 'Lección oficial del kit: generar no es verificar. Por eso el Destacado se revisa a mano.',
        'card.ia.title': 'Directorio IA',
        'card.ia.desc': 'Herramientas de IA reales para código, arte, audio y marketing de tu juego.',
        'ui.back_to_hub': '← Regresar al Hub',
        'ui.loading': 'Cargando...',

        // Hero Sections
        'hero.badge.free': 'Pulso 2024-2025 · México y LATAM',
        'hero.badge.career': '💼 Career Boost Activo',
        'hero.badge.tools': '🛠️ Production Ready',
        'hero.badge.studios': '🌎 LATAM Power',
        'hero.badge.marketing': '📢 Visibility Hack',
        'hero.badge.industry': 'Corte 2024-2025',
        'hero.badge.eco': 'Mapa vivo',
        'hero.badge.cycle': 'Herramienta',
        'hero.title.home': 'El mapa para hacer juegos en <span class="home-accent">LATAM</span>',
        'hero.subtitle.home': 'Cifras del sector, estudios, chamba y herramientas. Curado para quien ya está en esto o quiere entrar.',
        'hero.cta.explore': '🕹️ Ver recursos',
        'hero.cta.jobs': '💼 Ver chamba',
        'hero.cta.industry': 'Ver el pulso',
        'hero.cta.cycle': 'Dónde te metes',
        'hero.title.industry': 'Pulso de la industria MX',
        'hero.subtitle.industry': 'Servicios, empleo y lo que todavía no leí del informe. Números para decidir, no para presumir.',
        'hero.title.eco': 'Ecosistema MX',
        'hero.subtitle.eco': 'Quién hace juegos, quién se junta y dónde se enseña. El mapa que yo usaría para entrar.',
        'hero.title.cycle': 'Dónde te metes',
        'hero.subtitle.cycle': 'Elige una etapa del ciclo. Te digo qué se hace, qué se contrata y qué pedirle a un estudio de esta región.',

        'hero.title.jobs': 'LEVEL UP YOUR CAREER',
        'hero.subtitle.jobs': 'Cómo entrar a un estudio de esta región: CV, dónde postular y en qué se concentra la chamba.',

        'hero.title.tools': 'PRODUCTION TOOLS',
        'hero.subtitle.tools': 'Templates probados en estudios AA/AAA. No reinventes la rueda, usa lo que ya funciona profesionalmente.',

        'hero.title.database': 'LATAM STUDIOS DB',
        'hero.subtitle.database': 'Busca estudio por país, tech o si están contratando. El mapa de comunidades y eventos está en Ecosistema.',

        'hero.title.marketing': 'MARKETING PLAYBOOK',
        'hero.subtitle.marketing': 'Tu juego no se vende solo. Aprende a crear comunidades, llamar la atención de publishers y dominar Steam.',

        // Sections
        'section.guides.title': 'Guías de Carrera',
        'section.guides.desc': 'Inspirado en los recursos de Amir Satvat, adaptados a nuestra realidad en LATAM.',
        'section.jobs_where.title': 'DÓNDE BUSCAR CHAMBA',
        'section.jobs_where.desc': 'Los mejores lugares para encontrar vacantes reales y filtradas.',
        'section.tools.title': 'GDD & Blueprinting',
        'section.tools.badge': '📋 Standard Docs',
        'section.studios.title': 'Directorio de Estudios',
        'section.marketing.title': 'Estrategias de Lanzamiento',
        'section.home.resources': 'Herramientas para cada etapa',
        'section.pulse.kicker': 'Lo que se ve en el sector',
        'section.pulse.lead': 'Corte 2024-2025. Servicios y desarrollo externo en México, más el mapa de la escena.',
        'pulse.50.n': '+50',
        'pulse.50.l': 'Estudios de servicios',
        'pulse.50.d': 'Desarrollo y apoyo externo en el país.',
        'pulse.2900.n': '+2,900',
        'pulse.2900.l': 'Empleos directos',
        'pulse.2900.d': 'Gente cobrando por hacer juegos en México.',
        'pulse.79.n': '79%',
        'pulse.79.l': 'En desarrollo',
        'pulse.79.d': 'Casi 8 de cada 10 puestos están en hacer el juego, no en lo demás.',
        'pulse.36.n': '+USD 36 M',
        'pulse.36.l': 'Facturación',
        'pulse.36.d': 'Promedio anual del sector de servicios.',
        'outsource.title': 'Qué es desarrollo externo',
        'outsource.aka': 'También le dicen servicios para la industria u outsourcing.',
        'outsource.p1': 'Es cuando un estudio o un publisher te encarga un trozo del juego: arte, código, QA, audio o un módulo entero. No es trabajo menor. Es cómo se arman casi todos los AAA, AA y Triple-I de hoy.',
        'outsource.p2': 'México entra por talento, costo y huso horario con Estados Unidos. Si buscas chamba, este es el volumen. Si publicas tu propio juego, igual te vas a cruzar con estos equipos.',
        'cycle.teaser.title': 'Tres etapas. Ahí te metes.',
        'cycle.teaser.desc': 'Preproducción, producción y post. La producción es la que come equipo.',
        'cycle.pre.t': 'Preproducción',
        'cycle.pre.d': 'Pitch, GDD, alcance, vertical slice. Poca gente, muchas decisiones.',
        'cycle.prod.t': 'Producción',
        'cycle.prod.d': 'Arte, código, diseño, audio y QA en volumen. Aquí se contrata.',
        'cycle.post.t': 'Postproducción',
        'cycle.post.d': 'Live ops, ports, localización, cert y assets de lanzamiento.',
        'card.industry.title': 'Pulso de la industria',
        'card.industry.desc': 'Cifras 2024-2025 y qué falta del informe.',
        'card.eco.title': 'Ecosistema MX',
        'card.eco.desc': 'Estudios, comunidades, eventos y escuelas.',
        'card.cycle.title': 'Ciclo de producción',
        'card.cycle.desc': 'Elige una etapa y ve dónde encajas.',
        'card.tools.title': 'Production Tools',
        'card.jobs.title': 'Jobs & Career',
        'card.studios.title': 'Studios DB',
        'database.intro': 'Este directorio es para encontrar estudio. El mapa de comunidades, eventos y escuelas está en Ecosistema. En servicios, el corte 2024-2025 habla de más de 50 empresas; la escena más ancha pasa de 150.',
        'database.cta.eco': 'Ver el ecosistema',
        'jobs.pulse.title': 'Dónde está la chamba',
        'jobs.pulse.desc': 'El corte de servicios marca más de 2,900 empleos directos en México. Casi 8 de cada 10 están en desarrollo. Si quieres entrar, ese es el volumen: arte, código, QA y producción para juegos de otros, además de los estudios que publican lo suyo.',
        'tools.cycle.title': 'El ciclo, sin rodeos',
        'tools.cycle.desc': 'Antes de bajar un GDD, entiende en qué etapa te estás metiendo. Pre, producción o post. Cada una pide un equipo distinto.',
        'tools.cycle.cta': 'Abrir el ciclo',
        'industry.method.title': 'Cómo se midió',
        'industry.method.p': 'Encuesta online, junio a octubre de 2025. 292 respuestas: 67 entusiastas, 82 indie, 134 empleados, 9 empresarios. Publicado el 1 de febrero de 2026. No pedía datos sensibles.',
        'industry.exclude.title': 'Qué no entra',
        'industry.exclude.p': 'Juegos de mesa y cartas. Escuelas, gobierno y organismos de promoción. Importan, pero no facturan desarrollo digital.',
        'industry.gap.title': 'Lo que falta (PDF)',
        'industry.gap.p': 'El informe largo no está leído aquí. Faltan tablas por empresa, sueldos, problemáticas y las propuestas. Si alguien lo abre, actualizo esta página.',
        'industry.cuts.title': 'Dos cortes, no los mezcles',
        'industry.cuts.p': 'Servicios y outsourcing: más de 50 estudios y más de 2,900 empleos. La escena más ancha (originales + servicios): más de 150 empresas y más de 2,000 personas. Distinta red, distinto conteo.',
        'industry.read.title': 'Cómo leer estas cifras',
        'industry.read.p': 'Son un pulso público 2024-2025, no un censo. Sirven para ubicar volumen. No las uses para un pitch de inversionista sin ir a la fuente primaria de cada número.',
        'eco.150.n': '+150',
        'eco.150.l': 'Empresas',
        'eco.150.d': 'Originales y de servicios, juntas.',
        'eco.40.n': '+40',
        'eco.40.l': 'Juegos en Steam',
        'eco.40.d': 'Publicados desde México en 2024-2025.',
        'eco.30.n': '+30',
        'eco.30.l': 'Eventos al año',
        'eco.30.d': 'Industria, consumo, cultura, academia y jams.',
        'eco.2000.n': '+2,000',
        'eco.2000.l': 'Personas',
        'eco.2000.d': 'Corte de la escena amplia, no el de servicios.',
        'eco.market.title': 'El mercado que nos paga',
        'eco.market.p': 'México: más de 76 millones de jugadores. Mercado local alrededor de USD 2,300 millones. Casi 87% juega en celular. Mitad mujeres, mitad hombres. LATAM rebasa los USD 8,000 millones en 2025. Somos mercado grande. La pregunta es cuánto de eso se queda en estudios de aquí.',
        'eco.dirs.title': 'Directorios más anchos',
        'eco.vjm': 'VideojuegosMEX',
        'eco.vjm.d': 'Listado de desarrolladores en México.',
        'eco.devuego': 'DeVUEGO LATAM',
        'eco.devuego.d': 'Estudios por país. Empieza por MX.',
        'eco.games.title': 'Juegos que ya salieron de aquí',
        'eco.games.p': 'Hay un catálogo de más de 1,400 títulos hechos en México, desde los 70. El listado vivo lo arma Victoria Cataxis Pérez en INDI-ES. Abajo, diez que la gente ya conoce. El top 2024 y 2025 no venía en la página pública; no lo invento.',
        'eco.svc.title': 'Quién hace el juego de otro',
        'eco.svc.p': 'Servicios, co-dev y arte para publishers de fuera. Aquí está el volumen de headcount.',
        'eco.own.title': 'Quién publica lo suyo',
        'eco.own.p': 'Estudios con IP propia que ya llegaron a tiendas. No es lista cerrada.',
        'eco.com.title': 'Con quién juntarte',
        'eco.com.p': 'Asociaciones, comunidades y medios. Entras, preguntas, ayudas. Así se consigue chamba y cofounder.',
        'eco.evt.title': 'Calendario, no FOMO',
        'eco.evt.p': 'Más de 30 fechas al año. Confirma la edición actual en el sitio oficial antes de comprar vuelo.',
        'eco.evt.dev': 'Industria',
        'eco.evt.play': 'Consumo',
        'eco.evt.culture': 'Cultura',
        'eco.evt.school': 'Academia',
        'eco.evt.jam': 'Jams',
        'eco.edu.title': 'Escuelas',
        'eco.edu.p': 'Hay 24 universidades con más de 30 programas de licenciatura, ingeniería o posgrado enfocados a videojuegos. Tres nombres que se repiten: SAE Institute México, Universidad de Artes Digitales y Universidad AMERIKE. El resto, verifícalo en la universidad. Un título no te contrata. Un portafolio sí.',
        'cycle.pick': 'Elige etapa',
        'cycle.result': 'Qué implica',
        'cycle.roles': 'Roles que se piden',
        'cycle.latam': 'Cómo entra LATAM',
        'cycle.next': 'Siguiente paso',
        'cycle.open.tools': 'Production Tools',
        'cycle.open.jobs': 'Jobs & Career',
        'cycle.open.db': 'Studios DB',

        // Cards & Features
        'card.cv.title': 'El CV Perfecto',
        'card.cv.desc': 'Plantillas y consejos para que tu currículum destaque ante reclutadores.',
        'card.portfolio.title': 'Portafolio que Vende',
        'card.portfolio.desc': 'Cómo presentar tu trabajo para Arte, Programación o Diseño.',
        'card.interview.title': 'Interview Prep',
        'card.interview.desc': 'Preguntas comunes y cómo negociar tu salario sin morir en el intento.',
        'card.read_guide': 'Leer Guía',
        'card.coming_soon': 'Próximamente',
        'card.download': 'Descargar',

        // Footer
        'footer.tagline': 'Recursos premium para game devs en LATAM. Profesionales, gratuitos y con onda gamer.',
        'footer.resources': '🎒 Recursos',
        'footer.ecosystem': '🌐 Ecosistema',
        'footer.connect': '🔗 Conecta',
        'footer.copyright': '© 2026 Game Industry Resources. Hecho con 💙 por',
        'footer.tagline.small': '"It\'s dangerous to go alone! Take this." 🗡️',

        // Registration Modal
        'modal.title': '👾 CREAR CUENTA',
        'modal.subtitle': '¡Únete a la elite de LATAM y guarda tu progreso de XP!',
        'modal.label.name': 'Nombre',
        'modal.label.lastname': 'Apellido',
        'modal.label.phone': 'WhatsApp / Teléfono',
        'modal.btn': '🚀 UNIRME AL NEXUS',
        'modal.footer': 'Al unirte, aceptas que te contactemos con recursos épicos.'
    },
    en: {
        // Navigation & General UI
        'nav.resources': 'Resources',
        'nav.ia': 'AI',
        'nav.industry': 'Industry',
        'nav.jobs': 'Jobs & Career',
        'nav.studios': 'Studios DB',
        'nav.community': 'Community',
        'nav.cta': '🎮 Join EGDC',
        'nav.home': '← JorgeSuarez<span>.com.mx</span>',
        'nav.label': 'Main',
        'nav.menu': 'Menu',
        'lang.label': 'Language',
        'ui.skip': 'Skip to resources',
        'alt.mokiHome': 'Moki, the orange cardboard astronaut, ready to explore',
        'ui.sfx.on': 'Mute sound',
        'ui.sfx.off': 'Turn sound on',
        'hero.cta.ia': 'Open the AI directory',
        'hero.bubble.home': 'Ready for the<br>next level?',
        'footer.label': 'Credits',
        'footer.social': 'Social',
        'footer.llms': 'For ChatGPT, Claude and Grok',
        'footer.kaizen': 'Kaizen & Play',
        'footer.values': 'Jorge Suárez | © 2026 | Built on our values of Kaizen & Play.',
        'ia.kicker': 'Directory · indie + AI',
        'ia.title': 'AI tools for making your game',
        'ia.lead': 'A living list, Spanish first. Moki helps you filter. No invented ratings: name, what it is for, and the official site.',
        'ia.cta.browse': 'Browse the catalog',
        'ia.cta.feature': 'Feature your tool',
        'ia.featured.kicker': 'Featured',
        'ia.featured.title': 'This slot is empty. On purpose.',
        'ia.featured.body': 'Tools in this directory are listed because they exist and help make games. Featured is a paid slot: USD 49 per month, cancel anytime.',
        'ia.featured.cta': 'Pon tu herramienta aquí / Feature your tool',
        'ia.catalog.kicker': 'Catalog',
        'ia.search.label': 'Search tools',
        'ia.empty.title': 'Moki found nothing',
        'ia.empty.body': 'Try another category or a shorter word. If a real tool is missing, write from the Feature page.',
        'ia.news.title': 'Directory newsletter',
        'ia.news.body': 'When new tools or a real Featured listing land, they go here. Not connected yet.',
        'ia.news.cta': 'Coming soon',
        'ia.machine.title': 'For agents and citations',
        'ia.footer': 'Made for indie game devs who already use AI. Jorge Suárez personal brand. Moki is never mirrored.',
        'ia.sponsor.kicker': 'Destacado / Featured',
        'ia.sponsor.title': 'Put your tool where people who already ship games look',
        'ia.sponsor.p1': 'This directory is for indie game devs who use AI. The organic list is editorial: real tools, official URLs, no invented stars.',
        'ia.sponsor.p2': 'Featured is different. It is the top slot Moki is holding open. The company that makes the tool pays to sit there for a while, with a name, one line, and the official link.',
        'ia.sponsor.p3': 'Before it goes live we check that the tool exists and helps make games. Generating a listing is not the same as verifying it: Moki already knows.',
        'ia.sponsor.price': 'USD 49 per month',
        'ia.sponsor.included.title': 'What is included',
        'ia.sponsor.inc1': 'Your tool as Featured at the top of /ia, with a Moki badge.',
        'ia.sponsor.inc2': 'Bilingual: listing in Spanish and English.',
        'ia.sponsor.inc3': 'Listed in /ia/tools.json and /ia/llms.txt, which chatbots read.',
        'ia.sponsor.inc4': 'Cancel anytime.',
        'ia.sponsor.cta.mail': 'Get featured',
        'ia.sponsor.cta.buy': 'Get featured',
        'ia.sponsor.back': 'Back to the directory',
        'ia.sponsor.lesson': 'Official kit lesson: generating is not verifying. That is why Featured is reviewed by hand.',
        'card.ia.title': 'AI directory',
        'card.ia.desc': 'Real AI tools for code, art, audio, and marketing your game.',
        'ui.back_to_hub': '← Back to Hub',
        'ui.loading': 'Loading...',

        // Hero Sections
        'hero.badge.free': '2024-2025 pulse · Mexico and LATAM',
        'hero.badge.career': '💼 Career Boost Active',
        'hero.badge.tools': '🛠️ Production Ready',
        'hero.badge.studios': '🌎 LATAM Power',
        'hero.badge.marketing': '📢 Visibility Hack',
        'hero.badge.industry': '2024-2025 snapshot',
        'hero.badge.eco': 'Living map',
        'hero.badge.cycle': 'Tool',
        'hero.title.home': 'The map for making games in <span class="home-accent">LATAM</span>',
        'hero.subtitle.home': 'Industry numbers, studios, jobs, and tools. Curated for people already in it, or trying to get in.',
        'hero.cta.explore': '🕹️ See the resources',
        'hero.cta.jobs': '💼 See jobs',
        'hero.cta.industry': 'Read the pulse',
        'hero.cta.cycle': 'Where you fit',
        'hero.title.industry': 'Mexico industry pulse',
        'hero.subtitle.industry': 'Services, jobs, and what I have not read from the long report. Numbers to decide, not to brag.',
        'hero.title.eco': 'Mexico ecosystem',
        'hero.subtitle.eco': 'Who makes games, who gathers, and where people learn. The map I would use to get in.',
        'hero.title.cycle': 'Where you fit',
        'hero.subtitle.cycle': 'Pick a stage of the cycle. I will tell you what gets done, who gets hired, and what to ask a studio here.',

        'hero.title.jobs': 'LEVEL UP YOUR CAREER',
        'hero.subtitle.jobs': 'How to get into a studio in this region: CV, where to apply, and where the jobs actually sit.',

        'hero.title.tools': 'PRODUCTION TOOLS',
        'hero.subtitle.tools': 'Tested templates from AA/AAA studios. Don\'t reinvent the wheel, use what works professionally.',

        'hero.title.database': 'LATAM STUDIOS DB',
        'hero.subtitle.database': 'Find a studio by country, tech, or hiring status. Communities and events live on Ecosystem.',

        'hero.title.marketing': 'MARKETING PLAYBOOK',
        'hero.subtitle.marketing': 'Your game won\'t sell itself. Learn to build communities, get publishers\' attention, and master Steam.',

        // Sections
        'section.guides.title': 'Career Guides',
        'section.guides.desc': 'Inspired by Amir Satvat\'s world-class resources, adapted to our LATAM reality.',
        'section.jobs_where.title': 'WHERE TO FIND JOBS',
        'section.jobs_where.desc': 'The best places to find real, filtered job openings.',
        'section.tools.title': 'GDD & Blueprinting',
        'section.tools.badge': '📋 Standard Docs',
        'section.studios.title': 'Studio Directory',
        'section.marketing.title': 'Launch Strategies',
        'section.home.resources': 'Tools for each stage',
        'section.pulse.kicker': 'What the sector looks like',
        'section.pulse.lead': '2024-2025 snapshot. External development and services in Mexico, plus the wider scene.',
        'pulse.50.n': '+50',
        'pulse.50.l': 'Services studios',
        'pulse.50.d': 'External development and support in the country.',
        'pulse.2900.n': '+2,900',
        'pulse.2900.l': 'Direct jobs',
        'pulse.2900.d': 'People getting paid to make games in Mexico.',
        'pulse.79.n': '79%',
        'pulse.79.l': 'In development',
        'pulse.79.d': 'Almost 8 in 10 roles are making the game, not the rest.',
        'pulse.36.n': '+USD 36 M',
        'pulse.36.l': 'Revenue',
        'pulse.36.d': 'Average yearly figure for the services sector.',
        'outsource.title': 'What external development is',
        'outsource.aka': 'Also called industry services or outsourcing.',
        'outsource.p1': 'A studio or publisher hires you for a slice of the game: art, code, QA, audio, or a whole module. That is not leftover work. It is how most AAA, AA, and Triple-I games get built today.',
        'outsource.p2': 'Mexico shows up because of talent, cost, and the US time zone. If you want a job, this is the volume. If you ship your own game, you will still cross these teams.',
        'cycle.teaser.title': 'Three stages. That is where you plug in.',
        'cycle.teaser.desc': 'Pre-production, production, and post. Production is the one that eats headcount.',
        'cycle.pre.t': 'Pre-production',
        'cycle.pre.d': 'Pitch, GDD, scope, vertical slice. Few people, many decisions.',
        'cycle.prod.t': 'Production',
        'cycle.prod.d': 'Art, code, design, audio, and QA at volume. This is where hiring happens.',
        'cycle.post.t': 'Post-production',
        'cycle.post.d': 'Live ops, ports, localization, cert, and launch assets.',
        'card.industry.title': 'Industry pulse',
        'card.industry.desc': '2024-2025 figures and what the report still hides.',
        'card.eco.title': 'Mexico ecosystem',
        'card.eco.desc': 'Studios, communities, events, and schools.',
        'card.cycle.title': 'Production cycle',
        'card.cycle.desc': 'Pick a stage and see where you fit.',
        'card.tools.title': 'Production Tools',
        'card.jobs.title': 'Jobs & Career',
        'card.studios.title': 'Studios DB',
        'database.intro': 'This directory is for finding a studio. Communities, events, and schools live on Ecosystem. The 2024-2025 services cut talks about 50+ companies; the wider scene is past 150.',
        'database.cta.eco': 'Open the ecosystem',
        'jobs.pulse.title': 'Where the jobs sit',
        'jobs.pulse.desc': 'The services cut lists more than 2,900 direct jobs in Mexico. Almost 8 in 10 are in development. If you want in, that is the volume: art, code, QA, and production for other people\'s games, plus the studios shipping their own.',
        'tools.cycle.title': 'The cycle, no fluff',
        'tools.cycle.desc': 'Before you download a GDD, know which stage you are walking into. Pre, production, or post. Each one asks for a different team.',
        'tools.cycle.cta': 'Open the cycle',
        'industry.method.title': 'How it was measured',
        'industry.method.p': 'Online survey, June to October 2025. 292 answers: 67 enthusiasts, 82 indie, 134 employees, 9 founders. Published 1 February 2026. No sensitive personal data.',
        'industry.exclude.title': 'What is out',
        'industry.exclude.p': 'Board and card games. Schools, government, and promotion bodies. They matter, but they do not bill digital game development.',
        'industry.gap.title': 'What is missing (PDF)',
        'industry.gap.p': 'The long report is not read here. Missing: company tables, pay, problems, and the proposed fixes. If someone opens it, I update this page.',
        'industry.cuts.title': 'Two cuts. Do not mix them.',
        'industry.cuts.p': 'Services and outsourcing: 50+ studios and 2,900+ jobs. The wider scene (originals + services): 150+ companies and 2,000+ people. Different net, different count.',
        'industry.read.title': 'How to read these numbers',
        'industry.read.p': 'This is a public 2024-2025 pulse, not a census. Use it to size the room. Do not put it in an investor deck without checking each primary source.',
        'eco.150.n': '+150',
        'eco.150.l': 'Companies',
        'eco.150.d': 'Originals and services, together.',
        'eco.40.n': '+40',
        'eco.40.l': 'Steam games',
        'eco.40.d': 'Shipped from Mexico in 2024-2025.',
        'eco.30.n': '+30',
        'eco.30.l': 'Events a year',
        'eco.30.d': 'Industry, players, culture, campus, and jams.',
        'eco.2000.n': '+2,000',
        'eco.2000.l': 'People',
        'eco.2000.d': 'Wider-scene cut, not the services cut.',
        'eco.market.title': 'The market that pays us',
        'eco.market.p': 'Mexico: more than 76 million players. Local market around USD 2.3 billion. Almost 87% play on phones. About half women, half men. LATAM is past USD 8 billion in 2025. Big market. The question is how much stays in studios from here.',
        'eco.dirs.title': 'Wider directories',
        'eco.vjm': 'VideojuegosMEX',
        'eco.vjm.d': 'Developer listing for Mexico.',
        'eco.devuego': 'DeVUEGO LATAM',
        'eco.devuego.d': 'Studios by country. Start with MX.',
        'eco.games.title': 'Games that already left the country',
        'eco.games.p': 'There is a catalog of more than 1,400 titles made in Mexico, going back to the 70s. Victoria Cataxis Pérez keeps the living list on INDI-ES. Below, ten people already know. The 2024 and 2025 top tens were not on the public page, so I am not inventing them.',
        'eco.svc.title': 'Who makes someone else\'s game',
        'eco.svc.p': 'Services, co-dev, and art for publishers abroad. This is where the headcount sits.',
        'eco.own.title': 'Who ships their own',
        'eco.own.p': 'Studios with their own IP that already reached stores. Not a closed list.',
        'eco.com.title': 'Who to gather with',
        'eco.com.p': 'Associations, communities, and press. Show up, ask, help. That is how jobs and cofounders happen.',
        'eco.evt.title': 'A calendar, not FOMO',
        'eco.evt.p': 'More than 30 dates a year. Check the current edition on the official site before you buy a flight.',
        'eco.evt.dev': 'Industry',
        'eco.evt.play': 'Players',
        'eco.evt.culture': 'Culture',
        'eco.evt.school': 'Campus',
        'eco.evt.jam': 'Jams',
        'eco.edu.title': 'Schools',
        'eco.edu.p': '24 universities run 30+ bachelor, engineering, or graduate programs focused on games. Three names that keep coming up: SAE Institute Mexico, Universidad de Artes Digitales, and Universidad AMERIKE. Check the rest at the school. A degree does not hire you. A portfolio does.',
        'cycle.pick': 'Pick a stage',
        'cycle.result': 'What it means',
        'cycle.roles': 'Roles they hire',
        'cycle.latam': 'How LATAM plugs in',
        'cycle.next': 'Next step',
        'cycle.open.tools': 'Production Tools',
        'cycle.open.jobs': 'Jobs & Career',
        'cycle.open.db': 'Studios DB',

        // Cards & Features
        'card.cv.title': 'The Perfect CV',
        'card.cv.desc': 'Templates and tips to make your resume stand out to recruiters.',
        'card.portfolio.title': 'Selling Portfolio',
        'card.portfolio.desc': 'How to present your work for Art, Programming, or Design.',
        'card.interview.title': 'Interview Prep',
        'card.interview.desc': 'Common questions and how to negotiate your salary like a pro.',
        'card.read_guide': 'Read Guide',
        'card.coming_soon': 'Coming Soon',
        'card.download': 'Download',

        // Footer
        'footer.tagline': 'Premium resources for game devs in LATAM. Professional, free, and with gamer vibes.',
        'footer.resources': '🎒 Resources',
        'footer.ecosystem': '🌐 Ecosystem',
        'footer.connect': '🔗 Connect',
        'footer.copyright': '© 2026 Game Industry Resources. Made with 💙 by',
        'footer.tagline.small': '"It\'s dangerous to go alone! Take this." 🗡️',

        // Registration Modal
        'modal.title': '👾 CREATE ACCOUNT',
        'modal.subtitle': 'Join the LATAM elite and save your XP progress!',
        'modal.label.name': 'First Name',
        'modal.label.lastname': 'Last Name',
        'modal.label.phone': 'WhatsApp / Phone',
        'modal.btn': '🚀 JOIN THE NEXUS',
        'modal.footer': 'By joining, you agree to receive epic resources and updates.'
    }
};

// Current language
let currentLang = localStorage.getItem('gamedev_lang') || 'es';
const qpLang = new URLSearchParams(location.search).get('lang');
if (qpLang === 'en' || qpLang === 'es') {
    currentLang = qpLang;
    localStorage.setItem('gamedev_lang', qpLang);
}

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Switch language
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('gamedev_lang', lang);
    document.documentElement.lang = lang;

    // Update UI elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else {
            el.innerHTML = t(key);
        }
    });

    document.querySelectorAll('[data-es][data-en]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        el.alt = t(el.getAttribute('data-i18n-alt'));
    });

    // Update active state of buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        if (btn.getAttribute('data-lang') === lang) btn.setAttribute('aria-current', 'true');
        else btn.removeAttribute('aria-current');
    });

    // Update gamification context if available
    if (typeof gameState !== 'undefined') {
        gameState.lang = lang;
        if (typeof saveState === 'function') saveState();
    }

    document.dispatchEvent(new CustomEvent('gamedev:lang', { detail: lang }));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchLanguage(btn.getAttribute('data-lang'));
        });
    });
});
