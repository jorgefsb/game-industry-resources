/* «Lo nuevo»: marca lo que entró desde tu última visita. Todo vive en tu navegador. */
(function () {
  'use strict';
  var list = document.querySelector('[data-new-list]');
  if (!list) return;
  var KEY = 'gd_ultima_visita';
  var since = document.querySelector('[data-new-since]');
  var last = null;
  try { last = localStorage.getItem(KEY); } catch (_) {}
  var items = Array.prototype.slice.call(list.querySelectorAll('li[data-date]'));
  var count = 0;
  if (last) {
    items.forEach(function (li) {
      if (li.getAttribute('data-date') > last) { li.classList.add('is-new'); count++; }
    });
  }
  function label() {
    if (!since) return;
    var en = document.documentElement.lang === 'en';
    if (!last) { since.hidden = true; return; }
    since.hidden = false;
    if (count === 0) since.textContent = en ? 'Nothing new since your last visit.' : 'Nada nuevo desde tu última visita.';
    else if (count === 1) since.textContent = en ? '1 new thing since your last visit.' : '1 cosa nueva desde tu última visita.';
    else since.textContent = count + (en ? ' new things since your last visit.' : ' cosas nuevas desde tu última visita.');
  }
  label();
  document.addEventListener('gamedev:lang', label);
  var today = new Date();
  var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  try { localStorage.setItem(KEY, iso); } catch (_) {}
})();
