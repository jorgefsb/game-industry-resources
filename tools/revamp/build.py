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
    ("guias/", "Guías", "Guides", "Una pregunta, contestada con fuente oficial", "One question, answered with official sources"),
    ("ciclo.html", "Dónde te metes", "Where you fit", "Elige una etapa y ve tu lugar", "Pick a stage and see your place"),
    ("guides/cv.html", "El CV perfecto", "The perfect CV", "Currículum para la industria", "A résumé for the industry"),
    ("kit.html", "Kit de arranque", "Starter kit", "Plantillas. Se paga con un post", "Templates. You pay with a post"),
  ]),
  ("hacer", "Hacer", "Make", [
    ("presupuesto.html", "Calculadora de presupuesto", "Budget calculator", "Cuánto cuesta tu juego y cuántas copias vender", "What your game costs and how many copies to sell"),
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

# ---------------------------------------------------------------------------
# SEO (11-nov-2026): título con la búsqueda en español primero, canónica limpia (sin .html, igual que el sitemap)
# y datos estructurados en la portada. Si cambias un título aquí, cámbialo también en i18n.js cuando la página lo traduzca.
BASE = "https://gamedev.jorgesuarez.com.mx"
SEO = {
    # archivo: (título, descripción o None para dejar la que tiene, ruta canónica)
    "index.html": ("Hacer videojuegos en LATAM: guías, plantillas y chamba | Jorge Suárez", None, "/"),
    "kit.html": ("Plantillas gratis para tu videojuego: GDD, tienda y pitch | Jorge Suárez", None, "/kit"),
    "presupuesto.html": ("¿Cuánto cuesta hacer un videojuego? Calculadora de presupuesto | Jorge Suárez", None, "/presupuesto"),
    "gracias.html": ("Fuentes y créditos del mapa gamedev LATAM | Jorge Suárez", None, "/gracias"),
    "entrar.html": ("Cómo entrar a la industria de videojuegos en LATAM | Jorge Suárez", None, "/entrar"),
    "ciclo.html": ("Cómo se produce un videojuego: del concepto al lanzamiento | Jorge Suárez", None, "/ciclo"),
    "tools.html": ("Herramientas y plantillas para producir videojuegos | Jorge Suárez",
                   "Plantillas para tu documento de diseño, presupuesto y gestión de proyecto de videojuegos.", "/tools"),
    "marketing.html": ("Marketing para videojuegos indie: cómo dar a conocer tu juego | Jorge Suárez",
                       "Cómo dar a conocer y vender tu videojuego: visibilidad, página de tienda y comunidad.", "/marketing"),
    "jobs.html": ("Trabajo en videojuegos en LATAM: vacantes, CV y carrera | Jorge Suárez",
                  "Dónde buscar trabajo en la industria de videojuegos desde Latinoamérica, con guías de carrera y CV.", "/jobs"),
    "database.html": ("Estudios de videojuegos en Latinoamérica | Jorge Suárez",
                      "Estudios de videojuegos de Latinoamérica, con liga a su sitio.", "/database"),
    "ecosistema.html": ("Videojuegos en México: comunidades, eventos y escuelas | Jorge Suárez", None, "/ecosistema"),
    "mexico-indie.html": ("Estudios indie de México: la pista de INDI-ES | Jorge Suárez",
                          "Estudios indie y eventos de México según INDI-ES. Es una pista para buscar, no un censo.", "/mexico-indie"),
    "industria.html": ("Industria de videojuegos en México: cifras 2024-2025 | Jorge Suárez", None, "/industria"),
    "actividad.html": ("Juegos y estudios en español: actividad reciente | Jorge Suárez", None, "/actividad"),
    "noticias/index.html": ("Noticias de gamedev en México y Latinoamérica, cada semana | Jorge Suárez", None, "/noticias/"),
    "guides/cv.html": ("Cómo hacer tu CV para trabajar en videojuegos | Jorge Suárez",
                       "Cómo armar un currículum para la industria de videojuegos: qué poner, qué quitar y cómo enseñar tu trabajo.", "/guides/cv"),
}
LD_HOME = """  <script type="application/ld+json">
  {"@context":"https://schema.org","@graph":[
    {"@type":"WebSite","@id":"https://gamedev.jorgesuarez.com.mx/#sitio","url":"https://gamedev.jorgesuarez.com.mx/","name":"Game Industry Resources","alternateName":"Mapa gamedev LATAM de Jorge Suárez","inLanguage":["es-MX","en"],"description":"Guías, plantillas, estudios, chamba y herramientas de IA para hacer videojuegos en Latinoamérica.","publisher":{"@id":"https://jorgesuarez.com.mx/#person"}},
    {"@type":"Person","@id":"https://jorgesuarez.com.mx/#person","name":"Jorge Suárez","url":"https://jorgesuarez.com.mx","sameAs":["https://www.linkedin.com/in/yorgenmeister/","https://x.com/jorgefsb","https://www.youtube.com/@jorgefsb","https://github.com/jorgefsb","https://www.instagram.com/jorgefsb/"]}
  ]}
  </script>
"""

def _attr(v):
    return v.replace("&", "&amp;").replace('"', "&quot;")

def seo(path, title, desc, canon):
    p = ROOT / path
    s = p.read_text(encoding="utf-8")
    url = BASE + canon
    s = re.sub(r"<title([^>]*)>.*?</title>", lambda m: f"<title{m.group(1)}>{title}</title>", s, count=1, flags=re.S)
    if desc:
        s = re.sub(r'(<meta name="description"\s+content=")[^"]*(")', lambda m: m.group(1) + _attr(desc) + m.group(2), s, count=1, flags=re.S)
    if 'rel="canonical"' in s:
        s = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), s, count=1)
    else:
        s = s.replace("</title>", f'</title>\n<link rel="canonical" href="{url}">', 1)
    for prop in ("og:title", "twitter:title"):
        s = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % prop, lambda m: m.group(1) + _attr(title) + m.group(2), s, count=1)
    s = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), s, count=1)
    if path == "index.html" and "application/ld+json" not in s:
        s = s.replace("</head>", LD_HOME + "</head>", 1)
    p.write_text(s, encoding="utf-8")

def sitemap():
    """Reescribe sitemap.xml: las URLs que ya estaban más las de SEO, cada una con la fecha del último cambio de su archivo en git."""
    import subprocess
    p = ROOT / "sitemap.xml"
    viejas = re.findall(r"<loc>([^<]+)</loc>", p.read_text(encoding="utf-8"))
    urls = list(dict.fromkeys(viejas + [BASE + c for (_, _, c) in SEO.values()]))
    def archivo(u):
        r = u[len(BASE):].strip("/")
        if r == "": return "index.html"
        for cand in (r, r + ".html", r + "/index.html"):
            if (ROOT / cand).is_file(): return cand
        return None
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        f = archivo(u)
        if not f: continue
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", f], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        out.append(f"  <url><loc>{u}</loc>" + (f"<lastmod>{d}</lastmod>" if d else "") + "</url>")
    out.append("</urlset>")
    p.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("sitemap", len(out) - 3, "urls")


PULSO_TAG = '<script src="https://pulso.jorgesuarez.com.mx/pulso.js" defer></script>'

def pulso(path):
    """Pone el contador anónimo de visitas (Pulso) antes de </body>. Idempotente."""
    p = ROOT / path
    s = p.read_text(encoding="utf-8")
    if "pulso.jorgesuarez.com.mx/pulso.js" in s:
        return
    i = s.rindex("</body>")
    s = s[:i] + "<!-- Pulso: conteo anónimo de visitas, sin cookies (10-nov-2026) -->\n" + PULSO_TAG + "\n" + s[i:]
    p.write_text(s, encoding="utf-8")
    print("pulso", path)

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
        slug = name[:-5]
        head = head.replace('href="https://gamedev.jorgesuarez.com.mx/"', f'href="https://gamedev.jorgesuarez.com.mx/{slug}"')
        head = head.replace('href="https://gamedev.jorgesuarez.com.mx/?lang=en"', f'href="https://gamedev.jorgesuarez.com.mx/{slug}?lang=en"')
        head = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{esc(title)}">', head, count=1)
        head = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{esc(desc)}">', head, count=1)
        head = head.replace('<meta property="og:url" content="https://gamedev.jorgesuarez.com.mx/">', f'<meta property="og:url" content="https://gamedev.jorgesuarez.com.mx/{slug}">')
        head = head.replace('<link rel="stylesheet" href="styles/home.css">', '<link rel="stylesheet" href="styles/home.css">\n  <link rel="stylesheet" href="styles/inner.css">')
        if name == "kit.html":
            head = head.replace("assets/og/gamedev-home.jpg", "assets/og/gamedev-kit.jpg")
            head = re.sub(r'<meta property="og:image:alt" content=".*?">', '<meta property="og:image:alt" content="Boleto de papel: Paga con un post. Kit de arranque para tu juego, con Moki.">', head, count=1)
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

def _prefijo(h, prefix):
    """Vuelve relativas a la carpeta de la guía las rutas del cascarón (que están escritas desde la raíz)."""
    return re.sub(r'(href|src)="(?!https?:|/|#|\?|mailto:|\.\./)', lambda m: f'{m.group(1)}="{prefix}', h)

def guia_page(rel, title, desc, body, canon, ld="", og_type="article"):
    """Arma una página dentro de guias/ con el cascarón del sitio. rel: ruta del archivo; canon: ruta limpia."""
    head = (HERE / "_head.html").read_text(encoding="utf-8")
    foot = (HERE / "_foot.html").read_text(encoding="utf-8")
    url = BASE + canon
    head = re.sub(r"<title>.*?</title>", lambda m: f"<title>{title}</title>", head, count=1, flags=re.S)
    head = re.sub(r'<meta name="description"\s+content=".*?">', lambda m: f'<meta name="description" content="{esc(desc)}">', head, count=1, flags=re.S)
    head = head.replace('href="https://gamedev.jorgesuarez.com.mx/"', f'href="{url}"')
    head = head.replace('href="https://gamedev.jorgesuarez.com.mx/?lang=en"', f'href="{url}?lang=en"')
    head = re.sub(r'<meta property="og:title" content=".*?">', lambda m: f'<meta property="og:title" content="{esc(title)}">', head, count=1)
    head = re.sub(r'<meta property="og:description" content=".*?">', lambda m: f'<meta property="og:description" content="{esc(desc)}">', head, count=1)
    head = head.replace('<meta property="og:url" content="https://gamedev.jorgesuarez.com.mx/">', f'<meta property="og:url" content="{url}">')
    head = head.replace('<meta property="og:type" content="website">', f'<meta property="og:type" content="{og_type}">')
    head = re.sub(r'<meta property="og:image:alt" content=".*?">', lambda m: f'<meta property="og:image:alt" content="{esc(title)}">', head, count=1)
    head = head.replace('<link rel="stylesheet" href="styles/home.css">', '<link rel="stylesheet" href="styles/home.css">\n  <link rel="stylesheet" href="styles/inner.css">\n  <link rel="stylesheet" href="styles/revamp.css">')
    head = head.replace("</head>", ld + "</head>", 1)
    nombre = canon.strip("/").replace("/", "-")
    foot = foot.replace("gamedev / ·", f"gamedev {canon} ·").replace("build 10 nov 2026", "build 13 nov 2026").replace("build Nov 10 2026", "build Nov 13 2026")
    foot = foot.replace('gamedev-home-footer', f'gamedev-{nombre}-footer').replace('gamedev-home-firma', f'gamedev-{nombre}-firma')
    foot = foot.replace('  <script src="scripts/novedades.js" defer></script>\n', '')
    hud = '''<body class="ia-page home-page inner-page guia-page">
  <a class="ia-skip" href="#main" data-i18n="ui.skip">Ir a recursos</a>

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
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(_prefijo(head, "../") + hud + body + _prefijo(foot, "../"), encoding="utf-8")
    print("guía", rel)

def guias():
    """Guías propias: una página por guía más el índice. Devuelve [(archivo, título, ruta canónica)]."""
    import sys
    sys.path.insert(0, str(HERE))
    import guias as G
    out = []
    for g in G.GUIAS:
        rel = f'guias/{g["slug"]}.html'
        guia_page(rel, g["title"], g["desc"], G.cuerpo(g), f'/guias/{g["slug"]}', ld=G.ld(g))
        out.append((rel, g["title"], f'/guias/{g["slug"]}'))
    t = "Guías para hacer y vender tu videojuego desde Latinoamérica | Jorge Suárez"
    guia_page("guias/index.html", t,
              "Guías en español para gamedevs de Latinoamérica: una pregunta por guía, con pasos, costos, tiempos y la fuente oficial de cada dato. Una nueva cada viernes.",
              G.indice(G.GUIAS), "/guias/", og_type="website")
    out.append(("guias/index.html", t, "/guias/"))
    return out

MESES_ES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
MESES_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
def fecha(iso):
    y, m, d = iso.split("-")
    return f"{int(d)} {MESES_ES[int(m)-1]} {y}", f"{MESES_EN[int(m)-1]} {int(d)}, {y}"

def block(path, marker, html, before="  </main>"):
    """Inserta o reemplaza un bloque marcado antes de </main>. Idempotente."""
    p = ROOT / path
    s = p.read_text(encoding="utf-8")
    a, z = f"<!-- {marker}:inicio -->", f"<!-- {marker}:fin -->"
    chunk = f"{a}\n{html}\n    {z}\n"
    if a in s:
        s = re.sub(re.escape(a) + r".*?" + re.escape(z) + r"\n", lambda m: chunk, s, flags=re.S)
    else:
        i = s.rindex(before)
        s = s[:i] + "    " + chunk + s[i:]
    p.write_text(s, encoding="utf-8")
    print("bloque", marker, path)

def noticias_archivo():
    import json
    files = sorted((ROOT / "data" / "noticias").glob("20*-W*.json"), reverse=True)
    weeks = [json.loads(f.read_text(encoding="utf-8")) for f in files][1:]  # la más reciente ya está en la página
    out = ['<section class="wrap inner-section" id="archivo" aria-labelledby="archivo-title">',
           '      <div class="rv-head">',
           '        <h2 id="archivo-title" data-es="Semanas anteriores" data-en="Previous weeks">Semanas anteriores</h2>',
           '        <p data-es="Cada nota con su fuente y su fecha." data-en="Every item with its source and date.">Cada nota con su fuente y su fecha.</p>',
           '      </div>']
    for w in weeks:
        fe, fn = fecha(w["published_at"])
        n = w["week"].split("-W")[1]
        out.append(f'      <details class="news-week"><summary><span data-es="Semana {n} · publicada {fe}" data-en="Week {n} · published {fn}">Semana {n} · publicada {fe}</span></summary>')
        out.append('        <ul class="rv-new__list">')
        for it in w["items"]:
            de, dn = fecha(it["date"])
            out.append(f'          <li><a href="{esc(it["url"])}" target="_blank" rel="noopener"><time datetime="{it["date"]}" data-es="{de}" data-en="{dn}">{de}</time><span><b data-es="{esc(it["title_es"])}" data-en="{esc(it["title_en"])}">{esc(it["title_es"])}</b><small>{esc(it["source"])} · {it["region"]}</small></span><span aria-hidden="true">↗</span></a></li>')
        out.append('        </ul>')
        out.append('      </details>')
    out.append('    </section>')
    block("noticias/index.html", "archivo-noticias", "\n".join(out))

def creditos(path, prefix):
    html = (f'<section class="wrap inner-section rv-credit">\n'
            f'      <p><span data-es="Esta sección se armó con trabajo de otros." data-en="This section was built on other people\'s work.">Esta sección se armó con trabajo de otros.</span> '
            f'<a href="{prefix}gracias.html" data-es="Ver fuentes y gracias" data-en="See sources and thanks">Ver fuentes y gracias</a></p>\n'
            f'    </section>')
    block(path, "creditos", html)

HUD_TMPL = """  <a class="ia-skip" href="#main" data-i18n="ui.skip">Ir a recursos</a>

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
      <button class="hud__burger" type="button" aria-expanded="false" aria-controls="hud-nav" aria-label="Menú" data-i18n-aria="nav.menu"><span></span><span></span></button>
    </div>
  </header>
  <main id="main">
"""
FOOT_TMPL = """  </main>
  <footer class="wrap papacito-footer" aria-label="Créditos" data-i18n-aria="footer.label">
    <div class="papacito-footer__identity">
      <a class="js-wordmark" href="https://jorgesuarez.com.mx/">JorgeSuarez<span>.com.mx</span></a>
      <p data-es="Kaizen y Juego" data-en="Kaizen &amp; Play">Kaizen y Juego</p>
    </div>
    <p class="papacito-footer__signature"><span data-es="Hecho con amor ❤️🎮 por" data-en="Made with love ❤️🎮 by">Hecho con amor ❤️🎮 por</span> <a href="https://jorgesuarez.com.mx/">JorgeSuarez.com.mx</a> <a class="foot-back" href="https://jorgesuarez.com.mx/" data-i18n="nav.home">← JorgeSuarez<span>.com.mx</span></a></p>
    <div class="papacito-footer__meta">
      <p><a href="gracias.html" data-es="Fuentes y gracias" data-en="Sources and thanks">Fuentes y gracias</a></p>
    </div>
  </footer>
"""
def shell(path):
    """Mete una página suelta (sin HUD) al cascarón del sitio. Idempotente."""
    p = ROOT / path
    s = p.read_text(encoding="utf-8")
    if 'class="hud"' in s:
        return
    s = s.replace("<body>", '<body class="ia-page home-page inner-page shell-page">\n' + HUD_TMPL, 1)
    s = s.replace('<link rel="stylesheet" href="styles/home.css" />', '<link rel="stylesheet" href="styles/home.css" />\n<link rel="stylesheet" href="styles/inner.css" />', 1)
    cut = s.index("<!-- Barra común")
    scripts = '' if 'src="i18n.js"' in s else '  <script src="i18n.js"></script>\n'
    scripts += '  <script src="scripts/home.js"></script>\n'
    i18n_tag = '  <script src="i18n.js"></script>\n'
    if i18n_tag in s[:cut]:
        s = s.replace(i18n_tag, '', 1); cut = s.index("<!-- Barra común"); scripts = i18n_tag + scripts
    s = s[:cut] + FOOT_TMPL + scripts + s[cut:]
    p.write_text(s, encoding="utf-8")
    print("cascarón", path)

if __name__ == "__main__":
    shell("actividad.html"); shell("mexico-indie.html")
    page("index.html", "", "", "home_body.html")
    page("kit.html", "Kit de arranque: paga con un post | Game Industry Resources",
         "Plantillas para avanzar tu juego: GDD de una página, checklist de tu página de tienda y pitch en 10 láminas. La primera es libre; las demás se abren al compartir.",
         "kit_body.html", extra_js='<script src="scripts/unlock.js" defer></script>')
    page("presupuesto.html", "¿Cuánto cuesta tu juego? Calculadora de presupuesto | Game Industry Resources",
         "Calculadora gratis para gamedevs: pon a tu equipo, los meses y tus gastos, y ve el total y cuántas copias necesitas vender para recuperarlo.",
         "presupuesto_body.html", extra_js='<script src="scripts/presupuesto.js" defer></script>')
    page("gracias.html", "Fuentes y gracias | Game Industry Resources",
         "De quién aprendimos, de dónde sale cada dato y a dónde ir por el original: Motor de Juegos, DeVuego, INDI-ES y más.",
         "gracias_body.html")
    GUIAS_PAGS = guias()
    for _rel, _t, _c in GUIAS_PAGS:
        SEO[_rel] = (_t, None, _c)
    for path, prefix, current in [(r, "../", "guias/") for r, _, _ in GUIAS_PAGS] + [
        ("index.html", "", ""), ("kit.html", "", "kit.html"), ("gracias.html", "", "gracias.html"), ("presupuesto.html", "", "presupuesto.html"),
        ("entrar.html", "", "entrar.html"), ("ciclo.html", "", "ciclo.html"), ("tools.html", "", "tools.html"),
        ("marketing.html", "", "marketing.html"), ("jobs.html", "", "jobs.html"), ("database.html", "", "database.html"),
        ("ecosistema.html", "", "ecosistema.html"), ("mexico-indie.html", "", "mexico-indie.html"),
        ("industria.html", "", "industria.html"), ("actividad.html", "", "actividad.html"),
        ("noticias/index.html", "../", "noticias/"), ("historico/2024-2025/index.html", "../../", "industria.html"),
        ("guides/cv.html", "../", "guides/cv.html"),
    ]:
        patch(path, prefix, current)
    noticias_archivo()
    for path, prefix in [("industria.html", ""), ("ecosistema.html", ""), ("ciclo.html", ""), ("actividad.html", ""), ("mexico-indie.html", ""), ("historico/2024-2025/index.html", "../../")]:
        if "  </main>" in (ROOT / path).read_text(encoding="utf-8"):
            creditos(path, prefix)
        else:
            print("sin <main>:", path)
    for path in ["index.html", "kit.html", "gracias.html", "presupuesto.html", "entrar.html", "ciclo.html", "tools.html",
                 "marketing.html", "jobs.html", "database.html", "ecosistema.html", "mexico-indie.html", "industria.html",
                 "actividad.html", "noticias/index.html", "historico/2024-2025/index.html", "guides/cv.html",
                 "ia/index.html", "ia/patrocina/index.html", "ia/destacado-grok-bot/index.html"] + [r for r, _, _ in GUIAS_PAGS]:
        pulso(path)
    for _path, (_t, _d, _c) in SEO.items():
        seo(_path, _t, _d, _c)
    sitemap()
