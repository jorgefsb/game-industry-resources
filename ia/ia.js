/* Directory UI: category chips + text search. Data from tools.json. */
(function () {
  const root = document.querySelector('[data-ia-app]');
  if (!root) return;

  const grid = root.querySelector('[data-ia-grid]');
  const chips = root.querySelector('[data-ia-chips]');
  const search = root.querySelector('[data-ia-search]');
  const count = root.querySelector('[data-ia-count]');
  const empty = root.querySelector('[data-ia-empty]');
  const machine = root.querySelector('[data-ia-machine]');
  const jsonLd = document.getElementById('ia-jsonld');

  let catalog = { tools: [], categories: [], featured: [], pricingLabels: {} };
  let category = 'all';
  let query = '';

  function lang() {
    return localStorage.getItem('gamedev_lang') || 'es';
  }

  function labelCategory(id) {
    const cat = catalog.categories.find((c) => c.id === id);
    if (!cat) return id;
    return cat[lang()] || cat.es;
  }

  function pricingLabel(code) {
    const map = catalog.pricingLabels[code];
    if (!map) return '';
    return map[lang()] || map.es;
  }

  function t(es, en) {
    return lang() === 'en' ? en : es;
  }

  function renderChips() {
    const items = [{ id: 'all', es: 'Todas', en: 'All' }].concat(catalog.categories);
    chips.innerHTML = items
      .map(
        (c) =>
          `<button type="button" class="ia-chip" data-cat="${c.id}" aria-pressed="${
            c.id === category
          }">${c[lang()] || c.es}</button>`
      )
      .join('');
  }

  function matches(tool) {
    if (category !== 'all' && tool.category !== category) return false;
    if (!query) return true;
    const blob = [
      tool.name,
      tool.description.es,
      tool.description.en,
      labelCategory(tool.category),
      tool.url
    ]
      .join(' ')
      .toLowerCase();
    return blob.includes(query);
  }

  function card(tool) {
    const price = tool.pricing
      ? `<span class="ia-tag">${pricingLabel(tool.pricing)}</span>`
      : '';
    return `<article class="ia-card" data-id="${tool.id}" data-category="${tool.category}">
      <div class="ia-card__meta">
        <span class="ia-tag">${labelCategory(tool.category)}</span>
        ${price}
      </div>
      <h3>${tool.name}</h3>
      <p>${tool.description[lang()] || tool.description.es}</p>
      <a class="ia-card__link" href="${tool.url}" target="_blank" rel="noopener noreferrer">${t(
        'Sitio oficial →',
        'Official site →'
      )}</a>
    </article>`;
  }

  function renderGrid() {
    const shown = catalog.tools.filter(matches);
    grid.querySelectorAll('.ia-card').forEach((el) => el.remove());
    const html = shown.map(card).join('');
    grid.insertAdjacentHTML('afterbegin', html);
    empty.classList.toggle('is-visible', shown.length === 0);
    count.textContent = t(
      `${shown.length} herramientas`,
      `${shown.length} tools`
    );
  }

  function renderMachineList() {
    if (!machine) return;
    const groups = catalog.categories
      .map((cat) => {
        const tools = catalog.tools.filter((t) => t.category === cat.id);
        if (!tools.length) return '';
        const items = tools
          .map((tool) => `<li><a href="${tool.url}">${tool.name}</a> — ${tool.description.es}</li>`)
          .join('');
        return `<h3>${cat.es}</h3><ol>${items}</ol>`;
      })
      .join('');
    machine.innerHTML = groups;
  }

  function renderJsonLd() {
    if (!jsonLd) return;
    const itemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Directorio de IA para indie game developers',
      description:
        'Catálogo bilingüe de herramientas de IA útiles para hacer videojuegos.',
      url: 'https://gamedev.jorgesuarez.com.mx/ia/',
      numberOfItems: catalog.tools.length,
      itemListElement: catalog.tools.map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tool.name,
        url: tool.url,
        description: tool.description.es
      }))
    };
    jsonLd.textContent = JSON.stringify(itemList);
  }

  function applyLang() {
    renderChips();
    renderGrid();
    if (search) {
      search.placeholder = t('Busca por nombre o uso…', 'Search by name or use…');
    }
    document.documentElement.lang = lang();
  }

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    category = btn.getAttribute('data-cat');
    applyLang();
  });

  if (search) {
    search.addEventListener('input', () => {
      query = search.value.trim().toLowerCase();
      renderGrid();
    });
  }

  document.addEventListener('gamedev:lang', applyLang);

  fetch('tools.json', { cache: 'no-cache' })
    .then((r) => {
      if (!r.ok) throw new Error('tools.json');
      return r.json();
    })
    .then((data) => {
      catalog = data;
      applyLang();
      renderMachineList();
      renderJsonLd();
    })
    .catch(() => {
      count.textContent = t('No se pudo cargar el catálogo.', 'Could not load the catalog.');
    });
})();
