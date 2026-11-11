/* Boletín: registro desde la portada y desde el kit. Lo guarda el Worker del sitio (mismo destino que el del Directorio IA).
   Solo se manda el correo, el idioma y de dónde vino el registro (home o kit). */
(function () {
  'use strict';
  var EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
  var T = {
    es: { badEmail: 'Revisa tu correo, parece incompleto.', sending: 'Apuntándote…', ok: 'Listo. Te llega el primer número.', okKit: 'Listo. Ya está abierto en este navegador.',
          rate: 'Muchos intentos seguidos. Prueba en una hora.', error: 'No se pudo. Prueba otra vez en un momento.' },
    en: { badEmail: 'Check your email, it looks incomplete.', sending: 'Signing you up…', ok: 'Done. The first issue is on its way.', okKit: 'Done. It is now unlocked in this browser.',
          rate: 'Too many tries in a row. Try again in an hour.', error: 'That did not work. Try again in a moment.' }
  };
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'es'; }
  document.querySelectorAll('form[data-boletin]').forEach(function (form) {
    var src = form.getAttribute('data-boletin') === 'kit' ? 'kit' : 'home';
    var status = form.querySelector('[data-status]');
    var button = form.querySelector('button[type="submit"]');
    function say(key, ok) {
      status.textContent = T[lang()][key];
      status.classList.toggle('is-ok', !!ok);
      status.classList.toggle('is-error', !ok);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var email = String(fd.get('email') || '').trim();
      if (!EMAIL_RE.test(email)) return say('badEmail');
      button.disabled = true;
      say('sending', true);
      fetch('/ia/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email, company: String(fd.get('company') || ''), lang: lang(), src: src })
      }).then(function (r) {
        if (r.status === 429) { say('rate'); return null; }
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (!r.ok || !data.ok) { say(data.error === 'email' ? 'badEmail' : 'error'); return; }
          form.reset();
          say(src === 'kit' ? 'okKit' : 'ok', true);
          try { if (window.pulso) window.pulso('boletin_alta_' + src); } catch (_) {}
          document.dispatchEvent(new CustomEvent('gamedev:boletin', { detail: { src: src } }));
        });
      }).catch(function () { say('error'); }).then(function () { button.disabled = false; });
    });
  });
})();
