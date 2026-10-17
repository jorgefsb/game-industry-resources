(function (d) {
  'use strict';
  var sfx = d.querySelector('.juice-sfx');
  var host = (sfx && sfx.parentNode) || d.querySelector('.hud__right') || d.querySelector('header') || d.body;
  if (d.querySelector('.jz-dock')) { if (window.JZ) window.JZ.paint(); return; }
  var dock = d.createElement('div');
  dock.className = 'jz-dock';
  if (sfx) host.insertBefore(dock, sfx); else host.appendChild(dock);
  if (!sfx) { sfx = d.createElement('button'); sfx.type = 'button'; sfx.className = 'juice-sfx'; }
  dock.appendChild(sfx);
  dock.insertAdjacentHTML('beforeend', '<button type="button" class="jz-lvl" aria-expanded="false" aria-controls="jz-panel"></button><button type="button" class="jz-feel" aria-expanded="false" aria-controls="jz-panel"></button>');
  var panel = d.createElement('div');
  panel.className = 'jz-panel';
  panel.id = 'jz-panel';
  panel.hidden = true;
  panel.innerHTML = '<p class="jz-panel__note" hidden></p><button type="button" class="juice-sfx jz-panel__sfx"></button><fieldset><legend data-jz-lab="juice">Juice</legend><label><input type="radio" name="jz-level" value="off"> <span data-jz-lab="off"></span></label><label><input type="radio" name="jz-level" value="subtle"> <span data-jz-lab="subtle"></span></label><label><input type="radio" name="jz-level" value="full"> <span data-jz-lab="full"></span></label></fieldset>';
  dock.appendChild(panel);
  if (window.JZ) {
    window.JZ.hook(function () {
      var t = window.JZ.t(), lv = window.JZ.level, red = window.JZ.red();
      var lab = { off: t[4], subtle: t[5], full: t[6], juice: t[7] };
      [].slice.call(d.querySelectorAll('.jz-lvl')).forEach(function (b) {
        b.innerHTML = '✨<span class="jz-lvl__label">' + t[7] + ': ' + lab[lv] + '</span>';
        b.setAttribute('aria-label', t[7] + ': ' + lab[lv]);
      });
      [].slice.call(d.querySelectorAll('.jz-feel')).forEach(function (b) {
        b.textContent = '✨';
        b.setAttribute('aria-label', t[7]);
      });
      [].slice.call(d.querySelectorAll('input[name=jz-level]')).forEach(function (r) {
        r.checked = r.value === lv;
        r.disabled = red;
      });
      [].slice.call(d.querySelectorAll('.jz-panel__note')).forEach(function (n) {
        n.hidden = !red;
        n.textContent = t[4];
      });
      [].slice.call(d.querySelectorAll('[data-jz-lab]')).forEach(function (el) {
        el.textContent = lab[el.getAttribute('data-jz-lab')] || el.textContent;
      });
    });
    window.JZ.paint();
  }
  var off = document.documentElement.getAttribute('data-jz-off') || '';
  if (off.indexOf('anticipation') < 0 && !(window.JZ_CONFIG && window.JZ_CONFIG.anticipation === false)) {
    [].slice.call(d.querySelectorAll('.btn--primary,.jz-try,.hud__cta,.hud__nav-cta,.home-card,.ia-card[href],a.ia-card')).forEach(function (el) {
      el.classList.add('jz-antic');
    });
  }
})(document);
