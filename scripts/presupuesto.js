/* Calculadora «¿Cuánto cuesta tu juego?». Todo se calcula y se guarda en tu navegador. */
(function () {
  'use strict';
  var form = document.querySelector('[data-calc]');
  if (!form) return;
  var KEY = 'gd_presupuesto_v1';
  var rowsBox = form.querySelector('[data-rows]');
  var DEFAULT_ROLES = { es: ['Programación', 'Arte', 'Diseño y producción'], en: ['Programming', 'Art', 'Design and production'] };

  function en() { return document.documentElement.lang === 'en'; }
  function L(es, e) { return en() ? e : es; }
  function num(v) { var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) && n > 0 ? n : 0; }
  function pct(v) { return Math.min(100, num(v)); }
  function cur() { return form.elements.moneda.value || 'MXN'; }
  function money(n) {
    try { return new Intl.NumberFormat(en() ? 'en-US' : 'es-MX', { style: 'currency', currency: cur(), maximumFractionDigits: 0 }).format(n); }
    catch (_) { return Math.round(n) + ' ' + cur(); }
  }
  function int(n) { return new Intl.NumberFormat(en() ? 'en-US' : 'es-MX').format(n); }

  function rowEl(data) {
    var d = document.createElement('div');
    d.className = 'calc__row';
    function field(cls, labelEs, labelEn, input) {
      var l = document.createElement('label'); l.className = 'calc__field ' + cls;
      var s = document.createElement('span'); s.setAttribute('data-es', labelEs); s.setAttribute('data-en', labelEn); s.textContent = L(labelEs, labelEn);
      l.appendChild(s); l.appendChild(input); return l;
    }
    function input(type, name, value, ph) {
      var i = document.createElement('input'); i.type = type; i.setAttribute('data-k', name);
      if (type === 'number') { i.min = '0'; i.step = 'any'; i.inputMode = 'decimal'; i.placeholder = ph || '0'; }
      if (value !== undefined && value !== null && value !== '') i.value = value;
      return i;
    }
    d.appendChild(field('calc__field--role', 'Rol', 'Role', input('text', 'role', data.role)));
    d.appendChild(field('', 'Personas', 'People', input('number', 'people', data.people)));
    d.appendChild(field('', 'Costo mensual c/u', 'Monthly cost each', input('number', 'cost', data.cost)));
    d.appendChild(field('', 'Meses', 'Months', input('number', 'months', data.months)));
    var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'calc__rm';
    rm.setAttribute('aria-label', L('Quitar rol', 'Remove role')); rm.textContent = '×';
    rm.addEventListener('click', function () { d.remove(); update(); });
    d.appendChild(rm);
    return d;
  }
  function addRow(data) { rowsBox.appendChild(rowEl(data || { role: '', people: 1, cost: '', months: '' })); }

  function readRows() {
    return Array.prototype.map.call(rowsBox.querySelectorAll('.calc__row'), function (r) {
      var o = {}; r.querySelectorAll('[data-k]').forEach(function (i) { o[i.getAttribute('data-k')] = i.value; }); return o;
    });
  }
  function state() {
    var s = { rows: readRows() };
    ['moneda', 'tools', 'months', 'audio', 'loc', 'mkt', 'legal', 'events', 'buffer', 'price', 'cut', 'leak', 'pub'].forEach(function (k) { s[k] = form.elements[k].value; });
    return s;
  }
  function calc() {
    var s = state();
    var team = s.rows.reduce(function (a, r) { return a + num(r.people) * num(r.cost) * num(r.months); }, 0);
    var other = num(s.tools) * num(s.months) + num(s.audio) + num(s.loc) + num(s.mkt) + num(s.legal) + num(s.events);
    var buffer = (team + other) * pct(s.buffer) / 100;
    var total = team + other + buffer;
    var net = num(s.price) * (1 - pct(s.leak) / 100) * (1 - pct(s.cut) / 100) * (1 - pct(s.pub) / 100);
    var copies = net > 0 && total > 0 ? Math.ceil(total / net) : 0;
    return { s: s, team: team, other: other, buffer: buffer, total: total, net: net, copies: copies };
  }
  function set(k, v) { var el = form.querySelector('[data-out="' + k + '"]'); if (el) el.textContent = v; }
  function update() {
    var c = calc();
    set('total', money(c.total)); set('team', money(c.team)); set('other', money(c.other)); set('buffer', money(c.buffer));
    set('net', c.net > 0 ? money(c.net) : '—');
    set('copies', c.copies > 0 ? int(c.copies) : '—');
    var msg = '';
    if (c.total === 0) msg = L('Empieza por el equipo: personas, costo mensual y meses.', 'Start with the team: people, monthly cost and months.');
    else if (c.net === 0) msg = L('Pon el precio de tu juego para ver cuántas copias necesitas.', 'Enter your game\'s price to see how many copies you need.');
    else msg = L('Eso es recuperar lo invertido. Ganancia empieza en la copia siguiente.', 'That earns back what you put in. Profit starts with the next copy.');
    set('msg', msg);
    try { localStorage.setItem(KEY, JSON.stringify(c.s)); } catch (_) {}
    return c;
  }
  function summary() {
    var c = calc();
    var lines = [
      L('Presupuesto de mi juego', 'My game budget'),
      L('Equipo: ', 'Team: ') + money(c.team),
      L('Otros gastos: ', 'Other expenses: ') + money(c.other),
      L('Colchón: ', 'Buffer: ') + money(c.buffer),
      'Total: ' + money(c.total)
    ];
    if (c.net > 0) {
      lines.push(L('Me queda por copia: ', 'I keep per copy: ') + money(c.net));
      lines.push(L('Copias para recuperarlo: ', 'Copies to earn it back: ') + int(c.copies));
    }
    lines.push('', L('Hecho con ', 'Made with ') + 'https://gamedev.jorgesuarez.com.mx/presupuesto');
    return lines.join('\n');
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) {}
    rowsBox.innerHTML = '';
    if (s && s.rows && s.rows.length) {
      s.rows.forEach(addRow);
      Object.keys(s).forEach(function (k) { if (k !== 'rows' && form.elements[k]) form.elements[k].value = s[k]; });
    } else {
      DEFAULT_ROLES[en() ? 'en' : 'es'].forEach(function (r) { addRow({ role: r, people: 1, cost: '', months: '' }); });
    }
    update();
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  form.querySelector('[data-add-row]').addEventListener('click', function () { addRow(); update(); var last = rowsBox.lastElementChild; if (last) last.querySelector('input').focus(); });
  form.querySelector('[data-calc-reset]').addEventListener('click', function () {
    try { localStorage.removeItem(KEY); } catch (_) {}
    form.reset(); load();
  });
  var copyBtn = form.querySelector('[data-calc-copy]');
  copyBtn.addEventListener('click', function () {
    try { if (window.pulso) window.pulso('presupuesto_copia'); } catch (_) {}
    try { fetch('/api/evento', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ e: 'presupuesto_copia' }), keepalive: true }).catch(function () {}); } catch (_) {}
    var done = function () {
      copyBtn.textContent = L('Copiado', 'Copied');
      setTimeout(function () { copyBtn.textContent = copyBtn.getAttribute(en() ? 'data-en' : 'data-es'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(summary()).then(done, done); else done();
  });
  var printBtn = form.querySelector('[data-print]');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  document.addEventListener('gamedev:lang', function () {
    rowsBox.querySelectorAll('.calc__rm').forEach(function (b) { b.setAttribute('aria-label', L('Quitar rol', 'Remove role')); });
    update();
  });
  load();
})();
