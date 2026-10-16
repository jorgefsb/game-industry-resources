/* Directorio IA · Jorge Suárez. Search, category chips, ES/EN strings and the two forms. */

/*
 * Sponsor (Destacado) checkout config. Single source of truth.
 * SPONSOR_CHECKOUT_URL is currently the Stripe TEST link. While SPONSOR_LIVE is false,
 * nothing on the page points at it: "Quiero el destacado" opens the request form instead.
 * When Jorge activates Stripe live: swap in the live payment link here and set SPONSOR_LIVE = true.
 */
const SPONSOR_CHECKOUT_URL = 'https://buy.stripe.com/test_3cI8wQ3nJ4Vg358a4F9sk00';
const SPONSOR_LIVE = false;

(function () {
  'use strict';

  const STR = {
    es: {
      'doc.title': 'Herramientas de IA para hacer videojuegos | Directorio de Jorge Suárez',
      'doc.titleSponsor': 'Destaca tu herramienta de IA ante gamedevs | Jorge Suárez',
      'skip': 'Ir al contenido',
      'nav.label': 'Principal',
      'nav.menu': 'Menú',
      'lang.label': 'Idioma',
      'hero.kicker': 'Directorio · IA para gamedev',
      'hero.title': 'Las herramientas de IA que sí sirven para hacer tu juego',
      'hero.sub': '{n} herramientas para arte, código, audio y diseño. En español y gratis.',
      'hero.bubble': '¿Qué buscamos hoy?',
      'search.label': 'Buscar herramientas',
      'search.ph': 'Busca: sprites, voces, música, código…',
      'proof.label': 'Datos del directorio',
      'proof.tools': 'herramientas',
      'proof.cats': 'categorías',
      'proof.free': 'Gratis para devs',
      'featured.seen': 'Te ven los devs justo cuando están eligiendo herramientas para su juego.',
      'more.show': 'Ver más ({n})',
      'more.hide': 'Ver menos',
      'submit.modalTitle': 'Envía una herramienta',
      'submit.send': 'Enviar herramienta',
      'submit.ok': 'Recibido. La revisamos y la agregamos si encaja.',
      'sp.nameAny': 'Nombre de la herramienta',
      'modal.close': 'Cerrar',
      'featured.badge': 'Destacado',
      'featured.price': 'USD 49 al mes',
      'featured.slot': 'Tu logo',
      'featured.title': 'Pon tu herramienta frente a gamedevs de Latinoamérica',
      'featured.body': 'Arriba de todo, con tu logo y una línea. USD 49 al mes. Cancelas cuando quieras.',
      'featured.cta': 'Quiero el destacado',
      'catalog.title': 'Catálogo',
      'catalog.count': '{n} herramientas',
      'catalog.count1': '1 herramienta',
      'chips.label': 'Categorías',
      'chips.all': 'Todas',
      'card.site': 'Sitio oficial',
      'card.newtab': '(abre en otra pestaña)',
      'empty.title': 'Moki no encontró eso',
      'empty.body': 'Prueba otra palabra o quita el filtro. Si falta una herramienta, mándala y la revisamos.',
      'submit.title': '¿Hiciste o usas una herramienta que no está?',
      'submit.body': 'Listar es gratis. Revisamos que exista y que sirva para hacer juegos.',
      'submit.cta': '¿Falta una? Envíala gratis',
      'news.title': 'Una herramienta de IA nueva cada semana',
      'news.sub': 'Para hacer tu juego. En español. Sin spam.',
      'news.label': 'Tu correo',
      'news.ph': 'tu@correo.com',
      'news.cta': 'Quiero recibirlo',
      'news.ok': 'Listo, ya estás en la lista. Te escribimos cuando salga el primero.',
      'form.sending': 'Enviando…',
      'form.badEmail': 'Revisa tu correo, parece que le falta algo.',
      'form.badName': 'Escribe el nombre de tu herramienta.',
      'form.badSite': 'Escribe el sitio web completo, con https://',
      'form.rate': 'Demasiados intentos. Vuelve a intentarlo en una hora.',
      'form.error': 'No se pudo guardar. Inténtalo de nuevo en un momento.',
      'sp.freeTag': 'Gratis',
      'sp.free': 'Directorio, búsqueda, filtros y boletín. Pagan las herramientas.',
      'sp.featured': 'Arriba de todo, con tu logo y una línea. USD 49 al mes. Cancelas cuando quieras.',
      'sp.soonTag': 'Pronto',
      'sp.soon': 'Revisión rápida para listarte antes.',
      'sp.previewLabel': 'Así se ve el destacado',
      'sp.previewName': 'Tu herramienta',
      'sp.previewLine': 'Una línea que explica para qué sirve en tu juego.',
      'sp.formTitle': 'Aparta tu lugar',
      'sp.name': 'Nombre de tu herramienta',
      'sp.site': 'Sitio web',
      'sp.email': 'Tu correo',
      'sp.note': 'Sin cobro hoy. Pagas hasta que lo activemos.',
      'sp.ok': 'Recibido. Te escribimos para activarlo.',
      'sp.back': '← Volver al directorio',
      'alt.mokiHero': 'Moki, el astronauta de cartón naranja, listo para explorar',
      'alt.mokiEmpty': 'Moki buscando sin suerte',
      'alt.mokiNews': 'Moki con la próxima herramienta',
      'alt.mokiSponsor': 'Moki revisa tu herramienta',
      'alt.logo': 'Logo de {name}',
      'footer.label': 'Créditos',
      'footer.social': 'Redes',
      'footer.love': 'Hecho con amor ❤️🎮 por',
      'footer.values': 'Jorge Suárez | © 2026 | Construido con nuestros valores de Kaizen &amp; Play.',
      'footer.llms': 'Para ChatGPT, Claude y Grok'
    },
    en: {
      'doc.title': 'AI tools for making video games | Jorge Suárez directory',
      'doc.titleSponsor': 'Feature your AI tool to game devs | Jorge Suárez',
      'skip': 'Skip to content',
      'nav.label': 'Main',
      'nav.menu': 'Menu',
      'lang.label': 'Language',
      'hero.kicker': 'Directory · AI for game dev',
      'hero.title': 'AI tools that actually help you ship your game',
      'hero.sub': '{n} tools for art, code, audio and design. In Spanish and English, and free.',
      'hero.bubble': 'What are we hunting today?',
      'search.label': 'Search tools',
      'search.ph': 'Search: sprites, voices, music, code…',
      'proof.label': 'Directory facts',
      'proof.tools': 'tools',
      'proof.cats': 'categories',
      'proof.free': 'Free for devs',
      'featured.seen': 'Seen by devs right when they\u2019re picking tools for their game.',
      'more.show': 'See more ({n})',
      'more.hide': 'See less',
      'submit.modalTitle': 'Submit a tool',
      'submit.send': 'Submit tool',
      'submit.ok': 'Got it. We\u2019ll review it and add it if it fits.',
      'sp.nameAny': 'Tool name',
      'modal.close': 'Close',
      'featured.badge': 'Featured',
      'featured.price': 'USD 49/month',
      'featured.slot': 'Your logo',
      'featured.title': 'Put your tool in front of Latin American game devs',
      'featured.body': 'Top of the page, your logo and one line. USD 49/month. Cancel anytime.',
      'featured.cta': 'Get featured',
      'catalog.title': 'Catalog',
      'catalog.count': '{n} tools',
      'catalog.count1': '1 tool',
      'chips.label': 'Categories',
      'chips.all': 'All',
      'card.site': 'Official site',
      'card.newtab': '(opens in a new tab)',
      'empty.title': 'Moki found nothing',
      'empty.body': 'Try another word or clear the filter. If a tool is missing, send it and we will review it.',
      'submit.title': 'Made or use a tool that is not here?',
      'submit.body': 'Listing is free. We check that it exists and helps make games.',
      'submit.cta': 'Missing a tool? Submit it free',
      'news.title': 'One new AI tool for game devs, every week',
      'news.sub': 'Free. No spam.',
      'news.label': 'Your email',
      'news.ph': 'you@email.com',
      'news.cta': 'Send it to me',
      'news.ok': 'You\u2019re on the list. We\u2019ll email you when the first one ships.',
      'form.sending': 'Sending…',
      'form.badEmail': 'Check your email, something looks off.',
      'form.badName': 'Type your tool\u2019s name.',
      'form.badSite': 'Type the full website, starting with https://',
      'form.rate': 'Too many tries. Please try again in an hour.',
      'form.error': 'Could not save it. Please try again in a moment.',
      'sp.freeTag': 'Free',
      'sp.free': 'Directory, search, filters and newsletter. Tools pay.',
      'sp.featured': 'Top of the page, your logo and one line. USD 49/month. Cancel anytime.',
      'sp.soonTag': 'Coming next',
      'sp.soon': 'Fast-track review to get listed sooner.',
      'sp.previewLabel': 'What Featured looks like',
      'sp.previewName': 'Your tool',
      'sp.previewLine': 'One line on how it helps make your game.',
      'sp.formTitle': 'Save your spot',
      'sp.name': 'Tool name',
      'sp.site': 'Website',
      'sp.email': 'Your email',
      'sp.note': 'No charge today. You only pay once it\u2019s live.',
      'sp.ok': 'Got it. We\u2019ll email you to activate it.',
      'sp.back': '← Back to the directory',
      'alt.mokiHero': 'Moki, the orange cardboard astronaut, ready to explore',
      'alt.mokiEmpty': 'Moki searching with no luck',
      'alt.mokiNews': 'Moki holding the next tool',
      'alt.mokiSponsor': 'Moki reviews your tool',
      'alt.logo': '{name} logo',
      'footer.label': 'Credits',
      'footer.social': 'Social',
      'footer.love': 'Made with love ❤️🎮 by',
      'footer.values': 'Jorge Suárez | © 2026 | Built on our values of Kaizen &amp; Play.',
      'footer.llms': 'For ChatGPT, Claude and Grok'
    }
  };

  const isSponsor = document.body.getAttribute('data-page') === 'sponsor';
  let ntools = Number((document.querySelector('[data-n]') || {}).dataset?.n || 0);

  function lang() {
    const l = localStorage.getItem('gamedev_lang');
    return l === 'en' ? 'en' : 'es';
  }
  function s(key, vars) {
    let out = STR[lang()][key] ?? STR.es[key] ?? key;
    if (vars) Object.keys(vars).forEach((k) => { out = out.split('{' + k + '}').join(vars[k]); });
    return out;
  }
  function esc(v) {
    return String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function applyStatic() {
    const l = lang();
    document.documentElement.lang = l;
    document.title = s(isSponsor ? 'doc.titleSponsor' : 'doc.title');
    document.querySelectorAll('[data-t]').forEach((el) => {
      const k = el.getAttribute('data-t');
      el.innerHTML = k === 'hero.sub' ? esc(s(k, { n: ntools })) : s(k);
    });
    document.querySelectorAll('[data-t-ph]').forEach((el) => { el.placeholder = s(el.getAttribute('data-t-ph')); });
    document.querySelectorAll('[data-t-alt]').forEach((el) => { el.alt = s(el.getAttribute('data-t-alt')); });
    document.querySelectorAll('[data-t-aria]').forEach((el) => { el.setAttribute('aria-label', s(el.getAttribute('data-t-aria'))); });
    document.querySelectorAll('.lang-btn').forEach((b) => {
      const on = b.getAttribute('data-lang') === l;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  /* Header: burger menu */
  (function () {
    const burger = document.querySelector('.hud__burger');
    const nav = document.getElementById('hud-nav');
    if (!burger || !nav) return;
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
  })();

  /* Submit-a-tool modal */
  (function () {
    const modal = document.getElementById('ia-submit-modal');
    if (!modal) return;
    let opener = null;
    document.querySelectorAll('[data-submit-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        opener = btn;
        const st = modal.querySelector('[data-status]');
        if (st) { st.textContent = ''; st.className = 'ia-form__status'; }
        if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
        const first = modal.querySelector('input[name="name"]');
        if (first) first.focus();
      });
    });
    function close() { if (modal.open) modal.close(); else modal.removeAttribute('open'); if (opener) opener.focus(); }
    modal.querySelector('[data-submit-close]').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  })();

  /* Sponsor checkout: only used once SPONSOR_LIVE is true. */
  if (SPONSOR_LIVE) {
    document.querySelectorAll('[data-sponsor-cta]').forEach((el) => {
      el.href = SPONSOR_CHECKOUT_URL;
      el.setAttribute('rel', 'noopener');
    });
  }

  /* Forms: newsletter + featured request. Stored by the site Worker in Cloudflare KV. */
  const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
  document.querySelectorAll('[data-ia-form]').forEach((form) => {
    const kind = form.getAttribute('data-ia-form');
    const status = form.querySelector('[data-status]');
    const button = form.querySelector('button[type="submit"]');
    function say(key, ok) {
      status.textContent = s(key);
      status.classList.toggle('is-ok', !!ok);
      status.classList.toggle('is-error', !ok);
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {
        email: String(fd.get('email') || '').trim(),
        company: String(fd.get('company') || ''),
        lang: lang()
      };
      if (kind === 'featured' || kind === 'submit') {
        payload.name = String(fd.get('name') || '').trim();
        payload.site = String(fd.get('site') || '').trim();
        if (payload.site && !/^https?:\/\//i.test(payload.site)) payload.site = 'https://' + payload.site;
        if (!payload.name) return say('form.badName');
        try { new URL(payload.site); } catch (_) { return say('form.badSite'); }
      }
      if (!EMAIL_RE.test(payload.email)) return say('form.badEmail');
      button.disabled = true;
      say('form.sending', true);
      try {
        const r = await fetch('/ia/api/' + kind, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (r.status === 429) return say('form.rate');
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.ok) return say(data.error === 'email' ? 'form.badEmail' : data.error === 'site' ? 'form.badSite' : 'form.error');
        form.reset();
        say(kind === 'featured' ? 'sp.ok' : kind === 'submit' ? 'submit.ok' : 'news.ok', true);
      } catch (_) {
        say('form.error');
      } finally {
        button.disabled = false;
      }
    });
  });

  /* Directory */
  const root = document.querySelector('[data-ia-app]');
  let catalog = null;
  let category = 'all';
  let query = '';
  const expanded = new Set();
  const PREVIEW = 3;

  function norm(v) {
    return String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function catLabel(c) { return c[lang()] || c.es; }
  function priceLabel(code) {
    const m = catalog.pricingLabels && catalog.pricingLabels[code];
    return m ? (m[lang()] || m.es) : '';
  }
  function matches(tool) {
    if (category !== 'all' && tool.category !== category) return false;
    if (!query) return true;
    const cat = catalog.categories.find((c) => c.id === tool.category) || {};
    return norm([tool.name, tool.description.es, tool.description.en, cat.es, cat.en, (tool.tags || []).join(' ')].join(' ')).includes(query);
  }
  function card(tool) {
    const logo = tool.logo
      ? `<img class="ia-logo" src="${esc(tool.logo)}" width="40" height="40" loading="lazy" decoding="async" alt="${esc(s('alt.logo', { name: tool.name }))}">`
      : `<span class="ia-logo ia-logo--tile" aria-hidden="true">${esc(tool.name.charAt(0))}</span>`;
    const price = tool.pricing ? `<span class="ia-tag">${esc(priceLabel(tool.pricing))}</span>` : '';
    return `<article class="ia-card" id="tool-${esc(tool.id)}">
      <div class="ia-card__top">${logo}<div><h3>${esc(tool.name)}</h3>${price}</div></div>
      <p>${esc(tool.description[lang()] || tool.description.es)}</p>
      <a class="ia-card__link" href="${esc(tool.url)}" target="_blank" rel="noopener">${esc(s('card.site'))} <span aria-hidden="true">↗</span><span class="sr-only"> ${esc(tool.name)} ${esc(s('card.newtab'))}</span></a>
    </article>`;
  }
  function renderChips() {
    const chips = root.querySelector('[data-ia-chips]');
    const items = [{ id: 'all', label: s('chips.all'), n: catalog.tools.length }].concat(
      catalog.categories.map((c) => ({ id: c.id, label: catLabel(c), n: catalog.tools.filter((t) => t.category === c.id).length }))
    );
    chips.innerHTML = items.map((c) =>
      `<button type="button" class="ia-chip" data-cat="${esc(c.id)}" aria-pressed="${c.id === category}">${esc(c.label)} <span class="ia-chip__n">${c.n}</span></button>`
    ).join('');
  }
  function renderSections() {
    const box = root.querySelector('[data-ia-sections]');
    let shown = 0;
    box.innerHTML = catalog.categories.map((c) => {
      const tools = catalog.tools.filter((t) => t.category === c.id && matches(t));
      shown += tools.length;
      if (!tools.length) return '';
      const collapsible = !query && tools.length > PREVIEW;
      const open = expanded.has(c.id);
      const more = collapsible
        ? `<button type="button" class="btn btn--ghost ia-more" data-more="${esc(c.id)}" aria-expanded="${open}" aria-controls="grid-${esc(c.id)}">${esc(open ? s('more.hide') : s('more.show', { n: tools.length - PREVIEW }))}</button>`
        : '';
      return `<section class="ia-cat${collapsible && !open ? ' is-collapsed' : ''}" id="${esc(c.id)}" aria-labelledby="cat-${esc(c.id)}">
        <h3 class="ia-cat__title" id="cat-${esc(c.id)}">${esc(catLabel(c))} <span>${tools.length}</span></h3>
        <div class="ia-grid" id="grid-${esc(c.id)}">${tools.map(card).join('')}</div>${more}
      </section>`;
    }).join('');
    root.querySelector('[data-ia-empty]').hidden = shown !== 0;
    root.querySelector('[data-ia-count]').textContent = shown === 1 ? s('catalog.count1') : s('catalog.count', { n: shown });
  }
  function renderAll() {
    if (!catalog) return;
    renderChips();
    renderSections();
  }

  if (root) {
    root.querySelector('[data-ia-sections]').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-more]');
      if (!btn) return;
      const id = btn.getAttribute('data-more');
      if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
      renderSections();
      const again = root.querySelector(`[data-more="${id}"]`);
      if (again) again.focus();
    });
    root.querySelector('[data-ia-chips]').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      category = btn.getAttribute('data-cat');
      renderAll();
    });
    const search = document.querySelector('[data-ia-search]');
    const sform = document.querySelector('[data-ia-searchform]');
    if (search) {
      search.addEventListener('input', () => { query = norm(search.value.trim()); renderSections(); });
    }
    if (sform) {
      sform.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('catalogo').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
    }
    fetch('tools.json')
      .then((r) => { if (!r.ok) throw new Error('tools.json'); return r.json(); })
      .then((data) => {
        catalog = data;
        ntools = data.tools.length;
        document.querySelectorAll('[data-ia-ntools]').forEach((el) => { el.textContent = data.tools.length; });
        document.querySelectorAll('[data-ia-ncats]').forEach((el) => { el.textContent = data.categories.length; });
        applyStatic();
        renderAll();
      })
      .catch(() => { /* static HTML catalog stays visible */ });
  }

  applyStatic();
  document.addEventListener('gamedev:lang', () => { applyStatic(); renderAll(); });
})();
