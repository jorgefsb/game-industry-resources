(function () {
  'use strict';

  function icon(type) {
    if (type.indexOf('AAA') >= 0) return '🏢';
    if (type.indexOf('Indie') >= 0) return '👾';
    if (type.indexOf('Mobile') >= 0) return '📱';
    if (type.indexOf('Co-dev') >= 0) return '🤝';
    return '🎮';
  }

  function render(filter, query) {
    var grid = document.getElementById('studiosGrid');
    if (!grid || typeof studios === 'undefined') return;
    var q = (query || '').toLowerCase();
    var filtered = studios.filter(function (s) {
      var byFilter = filter === 'TODO' ||
        (filter === 'HIRING' && s.hiring) ||
        (filter === 'MX' && s.country === 'MX') ||
        (filter === 'CO' && s.country === 'CO') ||
        (filter === 'AR' && s.country === 'AR') ||
        (filter === 'BR' && s.country === 'BR');
      var blob = (s.name + ' ' + s.description + ' ' + s.tags.join(' ')).toLowerCase();
      return byFilter && blob.indexOf(q) >= 0;
    });
    grid.innerHTML = '';
    filtered.forEach(function (s) {
      var card = document.createElement('a');
      card.href = s.url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'ia-card inner-card';
      card.innerHTML =
        (s.hiring ? '<span class="ia-badge">Hiring</span>' : '') +
        '<span class="card__icon">' + icon(s.type) + '</span>' +
        '<h3 class="card__title">' + s.name + ' ' + s.flag + '</h3>' +
        '<p class="card__description">' + s.description + '</p>' +
        '<div class="studio-tags">' + s.tags.map(function (t) {
          return '<span>' + t + '</span>';
        }).join('') + '</div>';
      grid.appendChild(card);
    });
    if (!filtered.length) {
      grid.innerHTML = '<p class="section__description" data-i18n="ui.loading">Nada con ese filtro.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var search = document.getElementById('studioSearch');
    var chips = document.querySelectorAll('[data-filter]');
    function currentFilter() {
      var active = document.querySelector('[data-filter][aria-pressed="true"]');
      return active ? active.getAttribute('data-filter') : 'TODO';
    }
    function refresh() {
      render(currentFilter(), search ? search.value : '');
    }
    chips.forEach(function (btn) {
      btn.addEventListener('click', function () {
        chips.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        refresh();
      });
    });
    if (search) search.addEventListener('input', refresh);
    refresh();
  });
})();
