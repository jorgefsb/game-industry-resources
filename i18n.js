// i18n System - Comprehensive Bilingual Support (ES/EN)
const translations = {
    es: {
        // Navigation & General UI
        'nav.resources': 'Recursos',
        'nav.ia': 'IA',
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
        'ia.sponsor.p3': 'Antes de publicarlo revisamos que la herramienta exista y sirva para hacer juegos. Generar un listing no es lo mismo que verificarlo — Moki ya lo sabe.',
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
        'hero.badge.free': '🆓 Recursos 100% gratuitos para LATAM',
        'hero.badge.career': '💼 Career Boost Activo',
        'hero.badge.tools': '🛠️ Production Ready',
        'hero.badge.studios': '🌎 LATAM Power',
        'hero.badge.marketing': '📢 Visibility Hack',
        'hero.title.home': 'Level up tu carrera en <span class="home-accent">Game Development</span>',
        'hero.subtitle.home': 'Templates, guías, ofertas de trabajo y herramientas creadas por profesionales de la industria. <strong>¡Consigue chamba</strong> y funda tu estudio rentable!',
        'hero.cta.explore': '🕹️ Explorar Recursos',
        'hero.cta.jobs': '💼 Ver Ofertas Diarias',

        'hero.title.jobs': 'LEVEL UP YOUR CAREER',
        'hero.subtitle.jobs': 'Tu guía definitiva para trabajar en la industria de videojuegos en LATAM. Tips de nivel senior para entrar a estudios AA/AAA.',

        'hero.title.tools': 'PRODUCTION TOOLS',
        'hero.subtitle.tools': 'Templates probados en estudios AA/AAA. No reinventes la rueda, usa lo que ya funciona profesionalmente.',

        'hero.title.database': 'LATAM STUDIOS DB',
        'hero.subtitle.database': 'El mapa más completo de la industria en Latinoamérica. Encuentra estudios, tecnología y vacantes.',

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
        'ia.sponsor.p3': 'Before it goes live we check that the tool exists and helps make games. Generating a listing is not the same as verifying it — Moki already knows.',
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
        'hero.badge.free': '🆓 100% Free Resources for LATAM',
        'hero.badge.career': '💼 Career Boost Active',
        'hero.badge.tools': '🛠️ Production Ready',
        'hero.badge.studios': '🌎 LATAM Power',
        'hero.badge.marketing': '📢 Visibility Hack',
        'hero.title.home': 'Level up your career in <span class="home-accent">Game Development</span>',
        'hero.subtitle.home': 'Templates, guides, job offers and tools created by industry professionals. <strong>Get hired</strong> and build your studio!',
        'hero.cta.explore': '🕹️ Explore Resources',
        'hero.cta.jobs': '💼 See Daily Offers',

        'hero.title.jobs': 'LEVEL UP YOUR CAREER',
        'hero.subtitle.jobs': 'Your ultimate guide to working in the LATAM game industry. Senior-level tips to enter AA/AAA studios.',

        'hero.title.tools': 'PRODUCTION TOOLS',
        'hero.subtitle.tools': 'Tested templates from AA/AAA studios. Don\'t reinvent the wheel, use what works professionally.',

        'hero.title.database': 'LATAM STUDIOS DB',
        'hero.subtitle.database': 'The most complete map of the industry in Latin America. Find studios, tech, and job openings.',

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
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
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
