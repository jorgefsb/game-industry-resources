(function () {
  'use strict';

  var copy = {
    es: {
      pre: {
        title: 'Preproducción',
        body: 'Aquí se decide si el juego existe. Pitch, GDD, alcance, presupuesto y un vertical slice que se pueda jugar. Poca gente. Cada sí o no cuesta meses después.',
        roles: 'Game designer, productor, art director, tech lead, un QA temprano.',
        latam: 'LATAM entra bien en concept, prototipo y documentos. Un estudio chico puede vender el slice. Un estudio de servicios puede armar el pitch pack para alguien más.',
        next: 'Si esto es lo tuyo, arma un GDD corto y un build de 5 minutos. Luego ve Production Tools.'
      },
      prod: {
        title: 'Producción',
        body: 'Aquí se come el headcount. Arte, código, diseño, audio y QA en volumen, semana a semana. Es la etapa que explica por qué el sector de servicios mueve la mayor parte de la chamba.',
        roles: 'Programación, arte 2D/3D, animación, diseño de niveles, audio, QA, producción de línea.',
        latam: 'Esta es la puerta ancha: co-dev, arte, engineering y QA para AAA, AA y Triple-I. También es donde un indie se ahoga si no corta alcance.',
        next: 'Si buscas chamba, ve Jobs. Si buscas a quién mandar el brief, ve Studios DB.'
      },
      post: {
        title: 'Postproducción',
        body: 'El juego ya se puede jugar, pero no se puede vender así. Ports, localización, certificación, live ops, parches y assets de lanzamiento.',
        roles: 'QA de cert, localización, community, live ops, marketing de producto, porting.',
        latam: 'LATAM es fuerte en QA, ports y live ops. También en contenido de lanzamiento si el equipo ya conoce Steam y consolas.',
        next: 'Si tu juego ya corre, el cuello suele ser visibilidad. Ve Marketing y el CV si estás buscando el siguiente contrato.'
      }
    },
    en: {
      pre: {
        title: 'Pre-production',
        body: 'This is where you decide if the game exists. Pitch, GDD, scope, budget, and a playable vertical slice. Small team. Every yes or no costs months later.',
        roles: 'Game designer, producer, art director, tech lead, early QA.',
        latam: 'LATAM is a good fit for concept, prototype, and docs. A small studio can sell the slice. A services studio can build the pitch pack for someone else.',
        next: 'If this is you, write a short GDD and a 5-minute build. Then open Production Tools.'
      },
      prod: {
        title: 'Production',
        body: 'This is where headcount goes. Art, code, design, audio, and QA at volume, week after week. It is why services work moves most of the jobs.',
        roles: 'Engineering, 2D/3D art, animation, level design, audio, QA, line production.',
        latam: 'This is the wide door: co-dev, art, engineering, and QA for AAA, AA, and Triple-I. It is also where an indie drowns if they do not cut scope.',
        next: 'Looking for work? Open Jobs. Looking for a studio to brief? Open Studios DB.'
      },
      post: {
        title: 'Post-production',
        body: 'The game runs, but it is not shippable yet. Ports, localization, certification, live ops, patches, and launch assets.',
        roles: 'Cert QA, localization, community, live ops, product marketing, porting.',
        latam: 'LATAM is strong in QA, ports, and live ops. Also in launch content if the team already knows Steam and consoles.',
        next: 'If the build already runs, the bottleneck is usually visibility. Open Marketing, or the CV guide if you want the next contract.'
      }
    }
  };

  function lang() {
    return document.documentElement.lang === 'en' ? 'en' : 'es';
  }

  function paint(stage) {
    var pack = copy[lang()][stage];
    if (!pack) return;
    var root = document.querySelector('[data-cycle]');
    if (!root) return;
    root.setAttribute('data-stage', stage);
    document.querySelectorAll('[data-cycle-btn]').forEach(function (btn) {
      var on = btn.getAttribute('data-cycle-btn') === stage;
      btn.setAttribute('aria-pressed', String(on));
    });
    var title = document.getElementById('cycle-title');
    var body = document.getElementById('cycle-body');
    var roles = document.getElementById('cycle-roles');
    var latam = document.getElementById('cycle-latam');
    var next = document.getElementById('cycle-next');
    if (title) title.textContent = pack.title;
    if (body) body.textContent = pack.body;
    if (roles) roles.textContent = pack.roles;
    if (latam) latam.textContent = pack.latam;
    if (next) next.textContent = pack.next;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cycle-btn]');
    if (!btn) return;
    paint(btn.getAttribute('data-cycle-btn'));
  });

  document.addEventListener('gamedev:lang', function () {
    var root = document.querySelector('[data-cycle]');
    paint((root && root.getAttribute('data-stage')) || 'prod');
  });

  document.addEventListener('DOMContentLoaded', function () {
    paint('prod');
  });
})();
