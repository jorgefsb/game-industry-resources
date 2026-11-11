#!/usr/bin/env python3
"""Revamp 10-nov-2026. Arma index.html, kit.html y gracias.html y pone el menú por intención
en todas las páginas del sitio (menos /ia/, que conserva su propio encabezado).
Uso: python3 tools/revamp/build.py   (desde la raíz del repo)"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent

GROUPS = [
  ("empezar", "Empezar", "Start", [
    ("entrar.html", "Cómo entrar", "How to get in", "Primer juego, Steam y el error más común", "First game, Steam and the most common mistake"),
    ("ciclo.html", "Dónde te metes", "Where you fit", "Elige una etapa y ve tu lugar", "Pick a stage and see your place"),
    ("guides/cv.html", "El CV perfecto", "The perfect CV", "Currículum para la industria", "A résumé for the industry"),
    ("kit.html", "Kit de arranque", "Starter kit", "Plantillas. Se paga con un post", "Templates. You pay with a post"),
  ]),
  ("hacer", "Hacer", "Make", [
    ("tools.html", "Production Tools", "Production Tools", "GDD, presupuestos y checklists", "GDD, budgets and checklists"),
    ("ia/", "Directorio IA", "AI Directory", "Herramientas con precio verificado", "Tools with verified pricing"),
  ]),
  ("vender", "Vender", "Sell", [
    ("marketing.html", "Marketing Playbook", "Marketing Playbook", "Cómo vender tu juego", "How to sell your game"),
    ("https://gamestory.jorgesuarez.com.mx/", "GameStory", "GameStory", "Video de 20 segundos de tu juego", "A 20-second video of your game"),
  ]),
  ("chamba", "Chamba", "Work", [
    ("jobs.html", "Jobs & Career", "Jobs & Career", "Vacantes, portafolio y carrera", "Openings, portfolio and career"),
    ("database.html", "Studios DB", "Studios DB", "Estudios de Latinoamérica", "Studios across Latin America"),
    ("ecosistema.html", "Ecosistema MX", "Mexico Ecosystem", "Comunidades, eventos y escuelas", "Communities, events and schools"),
    ("mexico-indie.html", "INDI-ES", "INDI-ES", "Pista de estudios indie en México", "Leads on indie studios in Mexico"),
  ]),
  ("industria", "Industria", "Industry", [
    ("industria.html", "Pulso MX", "Mexico pulse", "Corte 2024-2025, ya histórico", "2024-2025 snapshot, now historical"),
    ("noticias/", "Noticias", "News", "Digest semanal de la región", "Weekly digest of the region"),
    ("actividad.html", "Actividad", "Activity", "Lanzamientos de referencia", "Reference launches"),
    ("gracias.html", "Fuentes y gracias", "Sources and thanks", "A quién le debemos este mapa", "Who we owe this map to"),
  ]),
]

def esc(s): return s.replace("&", "&amp;").replace('"', "&quot;")

def nav(prefix, current):
    out = ['<nav class="hud__nav" id="hud-nav" aria-label="Principal" data-i18n-aria="nav.label">']
    for gid, es, en, links in GROUPS:
        out.append(f'      <div class="nav-group" data-group="{gid}">')
        out.append(f'        <button type="button" class="nav-group__btn" aria-expanded="false" aria-controls="nav-{gid}" data-es="{es}" data-en="{en}">{es}</button>')
        out.append(f'        <div class="nav-group__panel" id="nav-{gid}">')
        for href, les, len_, des, den in links:
            ext = href.startswith("http")
            h = href if ext else prefix + href
            cur = ' aria-current="page"' if href == current else ''
            out.append(f'          <a href="{h}"{cur}><span data-es="{esc(les)}" data-en="{esc(len_)}">{esc(les)}</span><small data-es="{esc(des)}" data-en="{esc(den)}">{esc(des)}</small></a>')
        out.append('        </div>')
        out.append('      </div>')
    out.append('      <a class="hud__nav-cta" href="https://club.uetc.mx" target="_blank" rel="noopener" data-i18n="nav.cta">🎮 Unirme</a>')
    out.append('    </nav>')
    return "\n".join(out)

NAV_RE = re.compile(r'<nav class="hud__nav".*?</nav>', re.S)

def patch(path, prefix, current):
    p = ROOT / path
    s = p.read_text(encoding="utf-8")
    if not NAV_RE.search(s):
        print("SIN NAV:", path); return
    s = NAV_RE.sub(lambda m: nav(prefix, current), s, count=1)
    css = f'<link rel="stylesheet" href="{prefix}styles/revamp.css">'
    if css not in s:
        anchor = f'<link rel="stylesheet" href="{prefix}styles/juice-120.css">'
        if anchor in s: s = s.replace(anchor, css + "\n  " + anchor, 1)
        else: s = s.replace("</head>", "  " + css + "\n</head>", 1)
    js = f'<script src="{prefix}scripts/nav.js" defer></script>'
    if js not in s:
        anchor = f'<script src="{prefix}scripts/home.js"></script>'
        if anchor in s: s = s.replace(anchor, anchor + "\n  " + js, 1)
        else: s = s.replace("</body>", "  " + js + "\n</body>", 1)
    p.write_text(s, encoding="utf-8")
    print("ok", path)

def page(name, title, desc, body_file, extra_js="", og_type="website"):
    head = (HERE / "_head.html").read_text(encoding="utf-8")
    foot = (HERE / "_foot.html").read_text(encoding="utf-8")
    index_head = head
    if name != "index.html":
        head = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", head, count=1, flags=re.S)
        head = re.sub(r'<meta name="description"\s+content=".*?">', f'<meta name="description" content="{esc(desc)}">', head, count=1, flags=re.S)
        head = head.replace('href="https://gamedev.jorgesuarez.com.mx/"', f'href="https://gamedev.jorgesuarez.com.mx/{name}"')
        head = head.replace('href="https://gamedev.jorgesuarez.com.mx/?lang=en"', f'href="https://gamedev.jorgesuarez.com.mx/{name}?lang=en"')
        head = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{esc(title)}">', head, count=1)
        head = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{esc(desc)}">', head, count=1)
        head = head.replace('<meta property="og:url" content="https://gamedev.jorgesuarez.com.mx/">', f'<meta property="og:url" content="https://gamedev.jorgesuarez.com.mx/{name}">')
        head = head.replace('<link rel="stylesheet" href="styles/home.css">', '<link rel="stylesheet" href="styles/home.css">\n  <link rel="stylesheet" href="styles/inner.css">')
        foot = foot.replace("gamedev / ·", f"gamedev /{name.replace('.html','')} ·")
        foot = foot.replace('gamedev-home-footer', f'gamedev-{name[:-5]}-footer').replace('gamedev-home-firma', f'gamedev-{name[:-5]}-firma')
        foot = foot.replace('  <script src="scripts/novedades.js" defer></script>\n', '')
    if extra_js:
        foot = foot.replace('  <script src="scripts/nav.js" defer></script>', '  <script src="scripts/nav.js" defer></script>\n  ' + extra_js)
    body_cls = "ia-page home-page" if name == "index.html" else "ia-page home-page inner-page"
    skip = "#rutas" if name == "index.html" else "#main"
    hud = f'''<body class="{body_cls}">
  <a class="ia-skip" href="{skip}" data-i18n="ui.skip">Ir a recursos</a>

  <header class="hud" data-hud>
    <a class="hud__brand" href="https://jorgesuarez.com.mx/" aria-label="JorgeSuarez.com.mx">
      <span class="js-wordmark">JorgeSuarez<span>.com.mx</span></span>
    </a>
    <nav class="hud__nav"></nav>
    <div class="hud__right">
      <div class="lang-switcher" role="group" aria-label="Idioma" data-i18n-aria="lang.label">
        <a href="?lang=es" class="lang-btn" data-lang="es" lang="es">ES</a>
        <span aria-hidden="true">|</span>
        <a href="?lang=en" class="lang-btn" data-lang="en" lang="en">EN</a>
      </div>
      <a class="btn btn--primary btn--sm hud__cta" href="https://club.uetc.mx" target="_blank" rel="noopener" data-i18n="nav.cta">🎮 Unirme</a>
      <button type="button" class="juice-sfx" aria-pressed="false" aria-label="Activar sonido"></button>
      <button class="hud__burger" type="button" aria-expanded="false" aria-controls="hud-nav" aria-label="Menú" data-i18n-aria="nav.menu"><span></span><span></span></button>
    </div>
  </header>

'''
    body = (HERE / body_file).read_text(encoding="utf-8").replace(' data-es-aria="Rutas"', '')
    (ROOT / name).write_text(head + hud + body + foot, encoding="utf-8")
    print("page", name)

if __name__ == "__main__":
    page("index.html", "", "", "home_body.html")
    page("kit.html", "Kit de arranque: paga con un post | Game Industry Resources",
         "Plantillas para avanzar tu juego: GDD de una página, checklist de tu página de tienda y pitch en 10 láminas. La primera es libre; las demás se abren al compartir.",
         "kit_body.html", extra_js='<script src="scripts/unlock.js" defer></script>')
    page("gracias.html", "Fuentes y gracias | Game Industry Resources",
         "De quién aprendimos, de dónde sale cada dato y a dónde ir por el original: Motor de Juegos, DeVuego, INDI-ES y más.",
         "gracias_body.html")
    for path, prefix, current in [
        ("index.html", "", ""), ("kit.html", "", "kit.html"), ("gracias.html", "", "gracias.html"),
        ("entrar.html", "", "entrar.html"), ("ciclo.html", "", "ciclo.html"), ("tools.html", "", "tools.html"),
        ("marketing.html", "", "marketing.html"), ("jobs.html", "", "jobs.html"), ("database.html", "", "database.html"),
        ("ecosistema.html", "", "ecosistema.html"), ("mexico-indie.html", "", "mexico-indie.html"),
        ("industria.html", "", "industria.html"), ("actividad.html", "", "actividad.html"),
        ("noticias/index.html", "../", "noticias/"), ("historico/2024-2025/index.html", "../../", "industria.html"),
        ("guides/cv.html", "../", "guides/cv.html"),
    ]:
        patch(path, prefix, current)
