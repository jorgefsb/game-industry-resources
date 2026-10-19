(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var track = document.getElementById('tickerTrack');
    if (!track || typeof studios === 'undefined') return;
    var hiring = studios.filter(function (s) { return s.hiring; });
    if (!hiring.length) return;
    var html = hiring.map(function (s) {
      return '<a href="' + s.url + '" target="_blank" rel="noopener" class="job-ticker-item">🔥 ' +
        s.name + ' (' + s.country + ') is Hiring!</a>';
    }).join('');
    track.innerHTML = html + html;
  });
})();
