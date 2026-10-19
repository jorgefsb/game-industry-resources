/* Directorio IA · Jorge Suárez. Search, category chips, ES/EN strings and the two forms. */

/*
 * Sponsor (Destacado) checkout config. Single source of truth.
 * SPONSOR_CHECKOUT_URL is the live Stripe Payment Link (USD 49/month). With SPONSOR_LIVE true,
 * every [data-sponsor-cta] link points at it; without JavaScript it falls back to the request form.
 */
const SPONSOR_CHECKOUT_URL = 'https://buy.stripe.com/3cI8wQ3nJ4Vg358a4F9sk00';
const SPONSOR_LIVE = true;

(function () {
  'use strict';

  const STR = {
    es: {
      'meta.desc': 'Las herramientas de IA que sí sirven para hacer tu juego: arte, código, audio, voces, 3D, localización y marketing. En español y gratis.',
      'meta.ogTitle': 'Las herramientas de IA que sí sirven para hacer tu juego',
      'meta.ogDesc': 'Herramientas de IA para arte, código, audio y diseño de videojuegos. En español y gratis.',
      'meta.descSponsor': 'Pon tu herramienta de IA arriba de todo en el directorio para gamedevs de Latinoamérica. Con tu logo y una línea. USD 49 al mes. Cancelas cuando quieras.',
      'meta.ogTitleSponsor': 'Pon tu herramienta frente a gamedevs de Latinoamérica',
      'meta.ogDescSponsor': 'Arriba de todo, con tu logo y una línea. USD 49 al mes. Cancelas cuando quieras.',
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
      'sp.previewLabel': 'Así se ve el destacado',
      'sp.previewName': 'Tu herramienta',
      'sp.previewLine': 'Una línea que explica para qué sirve en tu juego.',
      'sp.formTitle': 'Aparta tu lugar',
      'sp.name': 'Nombre de tu herramienta',
      'sp.site': 'Sitio web',
      'sp.email': 'Tu correo',
      'sp.pay': 'Pagar USD 49 al mes',
      'sp.thanksTitle': '¡Gracias!',
      'sp.thanksBody': 'Tu Destacado ya está pagado. Te escribimos en menos de 24 horas para activarlo.',
      'sp.payNote': 'Pago seguro con Stripe. Se renueva cada mes y cancelas cuando quieras.',
      'sp.note': '¿Prefieres hablar antes de pagar? Déjanos tus datos y te escribimos.',
      'sp.stepsLabel': 'Tu avance',
      'sp.stepName': 'Nombre',
      'sp.stepSite': 'Sitio',
      'sp.stepEmail': 'Correo',
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
      'meta.desc': 'The AI tools that actually help you make your game: art, code, audio, voices, 3D, localization and marketing. Free to browse.',
      'meta.ogTitle': 'The AI tools that actually help you make your game',
      'meta.ogDesc': 'AI tools for game art, code, audio and design. Free to browse.',
      'meta.descSponsor': 'Put your AI tool at the top of the directory for Latin American game devs. With your logo and one line. USD 49 a month. Cancel anytime.',
      'meta.ogTitleSponsor': 'Put your tool in front of Latin American game devs',
      'meta.ogDescSponsor': 'At the top, with your logo and one line. USD 49 a month. Cancel anytime.',
      'doc.title': 'AI tools for making video games | Jorge Suárez directory',
      'doc.titleSponsor': 'Feature your AI tool to game devs | Jorge Suárez',
      'skip': 'Skip to content',
      'nav.label': 'Main',
      'nav.menu': 'Menu',
      'lang.label': 'Language',
      'hero.kicker': 'Directory · AI for game dev',
      'hero.title': 'AI tools that actually help you ship your game',
      'hero.sub': '{n} tools for game art, code, audio and design. Free to browse.',
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
      'empty.body': 'Try another word or clear the filter. If a tool is missing, send it and we\'ll review it.',
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
      'sp.previewLabel': 'What Featured looks like',
      'sp.previewName': 'Your tool',
      'sp.previewLine': 'One line on how it helps make your game.',
      'sp.formTitle': 'Save your spot',
      'sp.name': 'Tool name',
      'sp.site': 'Website',
      'sp.email': 'Your email',
      'sp.pay': 'Pay USD 49/month',
      'sp.thanksTitle': 'Thanks!',
      'sp.thanksBody': 'Your Featured listing is paid. We\u2019ll email you within 24 hours to activate it.',
      'sp.payNote': 'Secure checkout with Stripe. Renews monthly, cancel anytime.',
      'sp.note': 'Rather talk before paying? Leave your details and we\u2019ll email you.',
      'sp.stepsLabel': 'Your progress',
      'sp.stepName': 'Name',
      'sp.stepSite': 'Website',
      'sp.stepEmail': 'Email',
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

  const qpLang = new URLSearchParams(location.search).get('lang');
  if (qpLang === 'en' || qpLang === 'es') {
    localStorage.setItem('gamedev_lang', qpLang);
    try { currentLang = qpLang; } catch (e) { /* i18n.js not loaded */ }
  }

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
    const sfx = isSponsor ? 'Sponsor' : '';
    const setMeta = (sel, key) => { document.querySelectorAll(sel).forEach((m) => m.setAttribute('content', s(key + sfx))); };
    setMeta('meta[name="description"], meta[name="twitter:description"]', 'meta.desc');
    setMeta('meta[property="og:description"]', 'meta.ogDesc');
    setMeta('meta[property="og:title"], meta[name="twitter:title"]', 'meta.ogTitle');
    document.querySelectorAll('meta[property="og:locale"]').forEach((m) => m.setAttribute('content', l === 'en' ? 'en_US' : 'es_MX'));
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((m) => m.setAttribute('content', l === 'en' ? 'es_MX' : 'en_US'));
    document.querySelectorAll('[data-es][data-en]').forEach((el) => { el.textContent = el.getAttribute('data-' + l); });
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
      if (on) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
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
    const close = () => { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) close();
    });
    document.addEventListener('gamedev:closemenu', close);
    document.addEventListener('click', (e) => { if (e.target.closest('[data-submit-open]')) close(); }, true);
    const submitModal = document.getElementById('ia-submit-modal');
    if (submitModal) submitModal.addEventListener('toggle', () => { if (submitModal.open) close(); });
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
        document.dispatchEvent(new Event('gamedev:closemenu'));
        if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
        const first = modal.querySelector('input[name="name"]');
        if (first) first.focus();
      });
    });
    function close() { if (modal.open) modal.close(); else modal.removeAttribute('open'); if (opener) opener.focus(); }
    modal.querySelector('[data-submit-close]').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  })();

  /* Thank-you banner after Stripe checkout redirects to ?gracias=1. */
  const thanks = document.querySelector('[data-thanks]');
  if (thanks && new URLSearchParams(location.search).get('gracias') === '1') thanks.hidden = false;

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
      document.dispatchEvent(new CustomEvent('gamedev:form', { detail: { key: key, ok: !!ok, el: status, form: form } }));
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
        /* The featured form stays filled and locks with a done stamp (juice.js). */
        if (kind !== 'featured') form.reset();
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
