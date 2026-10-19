(function () {
  'use strict';

  var H = window.GDHook;
  var lastPick = -1;

  function icon(type) {
    if (type.indexOf('AAA') >= 0) return '🏢';
    if (type.indexOf('Indie') >= 0) return '👾';
    if (type.indexOf('Mobile') >= 0) return '📱';
    if (type.indexOf('Co-dev') >= 0) return '🤝';
    return '🎮';
  }
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function render(filter, query) {
    var grid = document.getElementById('studiosGrid');
    if (!grid || typeof studios === 'undefined') return;
    var q = (query || '').toLowerCase();
    var filtered = studios.filter(function (s) {
      var byFilter = filter === 'TODO' ||
        (filter === 'HIRING' && s.hiring) ||
        (filter === 'SAVED' && H && H.isSaved('studio', s.name)) ||
        (filter === 'MX' && s.country === 'MX') ||
        (filter === 'CO' && s.country === 'CO') ||
        (filter === 'AR' && s.country === 'AR') ||
        (filter === 'BR' && s.country === 'BR');
      var blob = (s.name + ' ' + s.description + ' ' + s.tags.join(' ')).toLowerCase();
      return byFilter && blob.indexOf(q) >= 0;
    });
    grid.innerHTML = '';
    filtered.forEach(function (s) {
      var card = document.createElement('article');
      card.className = 'ia-card inner-card gd-card';
      card.setAttribute('data-studio', s.name);
      card.innerHTML =
        (s.hiring ? '<span class="ia-badge">Hiring</span>' : '') +
        '<span class="card__icon">' + icon(s.type) + '</span>' +
        '<h3 class="card__title"><a class="gd-stretch" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + s.name + ' ' + s.flag + '</a></h3>' +
        '<p class="card__description">' + s.description + '</p>' +
        '<div class="studio-tags">' + s.tags.map(function (t) {
          return '<span>' + t + '</span>';
        }).join('') + '</div>' +
        (H ? '<div class="card__actions gd-actions">' + H.saveBtn('studio', s.name, s.name) + '</div>' : '');
      grid.appendChild(card);
    });
    if (!filtered.length) {
      grid.innerHTML = filter === 'SAVED' && H
        ? '<p class="section__description">' + esc(H.t('emptySaved')) + '</p>'
        : '<p class="section__description" data-i18n="ui.loading">Nada con ese filtro.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var search = document.getElementById('studioSearch');
    var chipsBox = document.querySelector('.inner-chips');
    var savedChip = null;
    function chips() { return document.querySelectorAll('[data-filter]'); }
    function currentFilter() {
      var active = document.querySelector('[data-filter][aria-pressed="true"]');
      return active ? active.getAttribute('data-filter') : 'TODO';
    }
    function setFilter(f) {
      chips().forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === f ? 'true' : 'false'); });
    }
    function paintSavedChip() {
      if (!H || !chipsBox) return;
      var n = H.count('studio');
      if (!savedChip) {
        savedChip = document.createElement('button');
        savedChip.type = 'button';
        savedChip.className = 'ia-chip gd-chip';
        savedChip.setAttribute('data-filter', 'SAVED');
        savedChip.setAttribute('aria-pressed', 'false');
        chipsBox.appendChild(savedChip);
      }
      savedChip.innerHTML = esc(H.t('chipSaved')) + ' <span class="ia-chip__n">' + n + '</span>';
      savedChip.hidden = n === 0 && currentFilter() !== 'SAVED';
      H.paintClear(currentFilter() === 'SAVED', 'studio');
    }
    function refresh() {
      render(currentFilter(), search ? search.value : '');
    }
    if (chipsBox) {
      chipsBox.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-filter]');
        if (!btn) return;
        setFilter(btn.getAttribute('data-filter'));
        refresh();
        paintSavedChip();
      });
    }
    if (search) search.addEventListener('input', refresh);

    if (H) {
      paintSavedChip();
      document.addEventListener('gamedev:collection', function () {
        paintSavedChip();
        if (currentFilter() === 'SAVED') refresh();
      });
      document.addEventListener('gamedev:lang', function () { paintSavedChip(); refresh(); });

      var bar = document.querySelector('[data-gd-bar]');
      var got = document.querySelector('[data-gd-got]');
      var rnd = document.querySelector('[data-gd-random]');
      if (bar && rnd && typeof studios !== 'undefined' && studios.length) {
        bar.hidden = false;
        rnd.setAttribute('aria-label', H.t('randomAria'));
        rnd.addEventListener('click', function () {
          var i;
          do { i = Math.floor(Math.random() * studios.length); } while (studios.length > 1 && i === lastPick);
          lastPick = i;
          var s = studios[i];
          if (search) search.value = '';
          setFilter('TODO');
          refresh();
          paintSavedChip();
          var el = document.querySelector('[data-studio="' + s.name.replace(/"/g, '\\"') + '"]');
          if (got) got.textContent = H.t('got', { name: s.name, flag: s.flag });
          if (el) {
            [].slice.call(document.querySelectorAll('.gd-picked')).forEach(function (x) { x.classList.remove('gd-picked'); });
            el.classList.add('gd-picked');
            var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
            H.juice('reward', el);
          }
        });
      }
    }
    refresh();
  });
})();
