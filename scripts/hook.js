/* Loop Hook de gamedev (piloto, propuesta 18-oct-2026).
   Todo vive en el navegador del visitante (localStorage). Nada se manda a ningún servidor.
   - Colección: guardar estudios y herramientas, quitarlos y borrar todo.
   - Herramientas nuevas desde la última visita en /ia (sin fechas inventadas: compara IDs vistos).
   Sin JavaScript la página sigue completa; esto solo agrega. */
(function (w, d) {
  'use strict';
  var KEY = 'gamedev_hook_v1';
  var SKEY = 'gamedev_hook_new_v1';

  var STR = {
    es: {
      save: 'Guardar', saved: 'Guardado',
      saveAria: 'Guardar {name} en tu colección', savedAria: 'Quitar {name} de tu colección',
      random: '🎲 Estudio al azar', randomAria: 'Mostrar un estudio al azar',
      got: 'Te tocó {name} {flag}. ¿Otro?',
      chipSaved: '⭐ Mi colección', chipNew: '✨ Nuevas',
      clear: 'Borrar mi colección', cleared: 'Listo, tu colección quedó vacía.',
      emptySaved: 'Todavía no guardas nada. Toca «Guardar» en lo que te sirva.',
      newOne: '1 herramienta nueva desde tu última visita.',
      newMany: '{n} herramientas nuevas desde tu última visita.',
      badgeNew: 'Nueva',
      local: 'Se guarda solo en este navegador.'
    },
    en: {
      save: 'Save', saved: 'Saved',
      saveAria: 'Save {name} to your collection', savedAria: 'Remove {name} from your collection',
      random: '🎲 Random studio', randomAria: 'Show a random studio',
      got: 'You got {name} {flag}. Another one?',
      chipSaved: '⭐ My collection', chipNew: '✨ New',
      clear: 'Clear my collection', cleared: 'Done, your collection is empty.',
      emptySaved: 'Nothing saved yet. Tap “Save” on anything useful.',
      newOne: '1 new tool since your last visit.',
      newMany: '{n} new tools since your last visit.',
      badgeNew: 'New',
      local: 'Saved only in this browser.'
    }
  };

  function lang() {
    var l = null;
    try { l = localStorage.getItem('gamedev_lang'); } catch (e) {}
    return l === 'en' ? 'en' : 'es';
  }
  function t(k, vars) {
    var s = (STR[lang()][k] != null ? STR[lang()][k] : STR.es[k]) || k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]); });
    return s;
  }
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function load() {
    var st = null;
    try { st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!st || typeof st !== 'object') st = {};
    st.saved = st.saved && typeof st.saved === 'object' ? st.saved : {};
    st.saved.studio = Array.isArray(st.saved.studio) ? st.saved.studio : [];
    st.saved.tool = Array.isArray(st.saved.tool) ? st.saved.tool : [];
    st.seenTools = Array.isArray(st.seenTools) ? st.seenTools : null;
    return st;
  }
  var state = load();
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function isSaved(type, id) { return state.saved[type].indexOf(String(id)) >= 0; }
  function count(type) { return state.saved[type].length; }
  function toggle(type, id) {
    id = String(id);
    var list = state.saved[type], i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    persist();
    return i < 0;
  }
  function clear(type) { state.saved[type] = []; persist(); }

  function saveBtn(type, id, name) {
    var on = isSaved(type, id);
    return '<button type="button" class="gd-save" data-gd-save="' + esc(type) + '" data-gd-id="' + esc(id) + '" data-gd-name="' + esc(name) +
      '" aria-pressed="' + on + '" aria-label="' + esc(t(on ? 'savedAria' : 'saveAria', { name: name })) + '">' +
      '<span aria-hidden="true">' + (on ? '★' : '☆') + '</span> <span>' + esc(t(on ? 'saved' : 'save')) + '</span></button>';
  }
  function paintBtn(b) {
    var on = isSaved(b.getAttribute('data-gd-save'), b.getAttribute('data-gd-id'));
    var name = b.getAttribute('data-gd-name');
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', t(on ? 'savedAria' : 'saveAria', { name: name }));
    b.innerHTML = '<span aria-hidden="true">' + (on ? '★' : '☆') + '</span> <span>' + esc(t(on ? 'saved' : 'save')) + '</span>';
  }

  /* Herramientas nuevas desde la última visita.
     Primera visita: se guardan los IDs y no se marca nada.
     Las nuevas de esta visita se recuerdan en sessionStorage para que recargar no las borre. */
  function newTools(ids) {
    var fresh = [];
    try { fresh = JSON.parse(sessionStorage.getItem(SKEY) || 'null'); } catch (e) { fresh = null; }
    if (!Array.isArray(fresh)) {
      fresh = state.seenTools ? ids.filter(function (id) { return state.seenTools.indexOf(id) < 0; }) : [];
      try { sessionStorage.setItem(SKEY, JSON.stringify(fresh)); } catch (e) {}
    }
    state.seenTools = ids.slice();
    persist();
    return fresh;
  }

  function juice(kind, el) {
    var jz = w.JZ;
    if (!jz || !el) return;
    try {
      if (kind === 'save') { jz.press(el); if (jz.snd) jz.snd('tap'); }
      if (kind === 'reward') { if (jz.spray) jz.spray(el, 'around'); if (jz.snd) jz.snd('success'); }
    } catch (e) {}
  }

  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-gd-save]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    toggle(b.getAttribute('data-gd-save'), b.getAttribute('data-gd-id'));
    paintBtn(b);
    juice('save', b);
    d.dispatchEvent(new CustomEvent('gamedev:collection', { detail: { type: b.getAttribute('data-gd-save') } }));
  });
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-gd-clear]');
    if (!b) return;
    var type = b.getAttribute('data-gd-clear');
    clear(type);
    [].slice.call(d.querySelectorAll('[data-gd-save="' + type + '"]')).forEach(paintBtn);
    d.dispatchEvent(new CustomEvent('gamedev:collection', { detail: { type: type, cleared: true } }));
  });
  function paintClear(filterIsSaved, type) {
    [].slice.call(d.querySelectorAll('[data-gd-clear="' + type + '"]')).forEach(function (b) { b.hidden = !(filterIsSaved && count(type) > 0); });
  }
  d.addEventListener('gamedev:lang', function () {
    [].slice.call(d.querySelectorAll('[data-gd-save]')).forEach(paintBtn);
    [].slice.call(d.querySelectorAll('[data-gd-t]')).forEach(function (el) { el.textContent = t(el.getAttribute('data-gd-t')); });
  });

  w.GDHook = { paintClear: paintClear, t: t, isSaved: isSaved, toggle: toggle, clear: clear, count: count, saveBtn: saveBtn, newTools: newTools, juice: juice, lang: lang };
})(window, document);
