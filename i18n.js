// i18n System - Bilingual Support (ES/EN)

const translations = {
    es: {
        // Navigation
        'nav.resources': 'Recursos',
        'nav.jobs': 'Jobs & Career',
        'nav.studios': 'Studios DB',
        'nav.community': 'Comunidad',
        'nav.cta': '🎮 Únete a EGDC',

        // Hero
        'hero.badge': '🆓 Recursos 100% gratuitos para LATAM',
        'hero.title.part1': 'Level up tu carrera en',
        'hero.title.part2': 'Game Development',
        'hero.subtitle': 'Templates, guías, ofertas de trabajo y herramientas creadas por profesionales de la industria. <strong>¡Consigue chamba</strong> y funda tu estudio rentable!',
        'hero.cta.primary': '🕹️ Explorar Recursos',
        'hero.cta.secondary': '💼 Ver Ofertas Diarias',
        'hero.quote': '"It\'s dangerous to go alone! Take this." - Old Man, Zelda',

        // Footer
        'footer.tagline': 'Recursos premium para game devs en LATAM. Gratis, profesionales, y con onda gamer.',
        'footer.resources': '🎒 Recursos',
        'footer.ecosystem': '🌐 Ecosistema',
        'footer.connect': '🔗 Conecta',
        'footer.copyright': '© 2026 Game Industry Resources. Hecho con 💙 por',
        'footer.tagline.small': '"It\'s dangerous to go alone! Take this." 🗡️'
    },
    en: {
        // Navigation
        'nav.resources': 'Resources',
        'nav.jobs': 'Jobs & Career',
        'nav.studios': 'Studios DB',
        'nav.community': 'Community',
        'nav.cta': '🎮 Join EGDC',

        // Hero
        'hero.badge': '🆓 100% Free Resources for LATAM',
        'hero.title.part1': 'Level up your career in',
        'hero.title.part2': 'Game Development',
        'hero.subtitle': 'Templates, guides, job offers and tools created by industry professionals. <strong>Get hired</strong> and build a profitable studio!',
        'hero.cta.primary': '🕹️ Explore Resources',
        'hero.cta.secondary': '💼 See Daily Offers',
        'hero.quote': '"It\'s dangerous to go alone! Take this." - Old Man, Zelda',

        // Footer
        'footer.tagline': 'Premium resources for game devs in LATAM. Free, professional, and with gamer vibes.',
        'footer.resources': '🎒 Resources',
        'footer.ecosystem': '🌐 Ecosystem',
        'footer.connect': '🔗 Connect',
        'footer.copyright': '© 2026 Game Industry Resources. Made with 💙 by',
        'footer.tagline.small': '"It\'s dangerous to go alone! Take this." 🗡️'
    }
};

// Current language
let currentLang = localStorage.getItem('gamedev_lang') || 'es';

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Switch language
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('gamedev_lang', lang);

    // Update UI
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else {
            el.innerHTML = t(key);
        }
    });

    // Update active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update gamification language
    if (typeof gameState !== 'undefined') {
        gameState.lang = lang;
        saveState();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    switchLanguage(currentLang);

    // Add click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
});
