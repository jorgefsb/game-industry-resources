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
    ("convocatorias.html", "Fondos y convocatorias", "Funds and open calls", "Dinero, festivales y jams, con fecha de cierre", "Money, festivals and jams, with closing dates"),
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
    "convocatorias.html": ("Fondos y convocatorias para hacer videojuegos en Latinoamérica | Jorge Suárez", None, "/convocatorias"),
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


# ---------------------------------------------------------------------------
# Fondos, convocatorias y eventos (18-nov-2026). Sale de data/convocatorias.json; no se escribe a mano.
CV_TIPOS = [("fondo", "Fondos", "Funds"), ("programa", "Programas", "Programs"), ("festival", "Festivales y premios", "Festivals and awards"),
            ("evento", "Eventos", "Events"), ("jam", "Game jams", "Game jams")]
CV_TIPO1 = {"fondo": ("Fondo", "Fund"), "programa": ("Programa", "Program"), "festival": ("Festival", "Festival"), "evento": ("Evento", "Event"), "jam": ("Jam", "Jam")}
CV_PAISES = [("LATAM", "Toda la región", "Whole region"), ("MX", "México", "Mexico"), ("AR", "Argentina", "Argentina"), ("BR", "Brasil", "Brazil"),
             ("CL", "Chile", "Chile"), ("CO", "Colombia", "Colombia"), ("PE", "Perú", "Peru"), ("UY", "Uruguay", "Uruguay")]
CV_DESC = "Fondos, programas, festivales con inscripción, eventos y game jams que puede aprovechar hoy quien hace videojuegos en Latinoamérica, con fecha de cierre y liga oficial. Se revisa cada semana."

def _t(tag, es, en, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c} data-es="{esc(es)}" data-en="{esc(en)}">{esc(es)}</{tag}>'

def _rango(a, b):
    ae, an = fecha(a)
    if not b or b == a: return ae, an
    be, bn = fecha(b)
    return f"{ae} a {be}", f"{an} to {bn}"

def convocatorias():
    """Arma convocatorias.html desde data/convocatorias.json. Devuelve (abiertas, próximas, permanentes, cerradas, la que cierra primero)."""
    import json, datetime
    d = json.loads((ROOT / "data" / "convocatorias.json").read_text(encoding="utf-8"))
    hoy = datetime.date.fromisoformat(d["actualizado"])
    ent = d["entradas"]
    for e in ent:  # lo que ya cerró no se anuncia como abierto aunque el JSON no se haya tocado
        if e.get("cierra") and datetime.date.fromisoformat(e["cierra"]) < hoy: e["estado"] = "cerrada"
    viva = [e for e in ent if e["estado"] != "cerrada"]
    cerr = [e for e in ent if e["estado"] == "cerrada" and (hoy - datetime.date.fromisoformat(e["cierra"])).days <= 30]
    orden = lambda e: (e.get("cierra") or e.get("fecha_evento") or e.get("abre") or "9999")
    pronto = sorted([e for e in viva if e.get("cierra") and (datetime.date.fromisoformat(e["cierra"]) - hoy).days <= 30], key=orden)
    ae, an = fecha(d["actualizado"])
    o = ['  <main id="main">',
         '    <header class="wrap inner-hero">',
         '      <div class="hero__content">',
         '        ' + _t("span", f"Revisado el {ae} · se revisa cada miércoles", f"Checked {an} · reviewed every Wednesday", "hero__badge"),
         '        ' + _t("h1", "Fondos, convocatorias y eventos", "Funds, open calls and events", "hero__title"),
         '        ' + _t("p", "Dinero, programas, festivales con inscripción, eventos y game jams para quien hace videojuegos en Latinoamérica. Cada uno con su fecha de cierre y su página oficial.",
                         "Money, programs, festivals with submissions, events and game jams for people making games in Latin America. Each one with its closing date and official page.", "hero__subtitle lead"),
         '      </div>',
         '    </header>', '']
    if pronto:
        o += ['    <section class="wrap inner-section" id="pronto" aria-labelledby="pronto-title">',
              '      <div class="rv-head">',
              '        ' + _t("h2", "Cierran pronto", "Closing soon").replace("<h2", '<h2 id="pronto-title"'),
              '        ' + _t("p", "Lo que cierra en 30 días o menos.", "Everything closing within 30 days."),
              '      </div>',
              '      <ul class="rv-new__list cv-soon" data-cv-soon>']
        for e in pronto:
            ce, cn = fecha(e["cierra"])
            te, tn = CV_TIPO1[e["tipo"]]
            o.append(f'        <li data-cv-ref="{e["id"]}" data-cierra="{e["cierra"]}"><a href="#c-{e["id"]}"><time datetime="{e["cierra"]}" data-es="{ce}" data-en="{cn}">{ce}</time>'
                     f'<span><b>{esc(e["nombre"])}</b>{_t("small", te + " · " + e["quien"], tn + " · " + e["quien"])}</span>'
                     f'<span class="ia-badge cv-left" data-cv-left="{e["cierra"]}" data-es="cierra el {ce}" data-en="closes {cn}">cierra el {ce}</span></a></li>')
        o += ['      </ul>', '    </section>', '']
    usados = [c for c, _, _ in CV_PAISES if any(c in e["paises"] for e in viva)]
    o += ['    <section class="wrap inner-section cv-tools" aria-label="Filtros">',
          '      <div class="cv-filters" role="group" aria-label="Tipo" data-cv-filter="tipo">',
          '        ' + _t("span", "Tipo", "Type", "cv-filters__label"),
          '        <button type="button" class="cv-chip" aria-pressed="true" data-v="" data-es="Todo" data-en="All">Todo</button>']
    for t, es, en in CV_TIPOS:
        if any(e["tipo"] == t for e in viva):
            o.append(f'        <button type="button" class="cv-chip" aria-pressed="false" data-v="{t}" data-es="{es}" data-en="{en}">{es}</button>')
    o += ['      </div>',
          '      <div class="cv-filters" role="group" aria-label="País" data-cv-filter="pais">',
          '        ' + _t("span", "País", "Country", "cv-filters__label"),
          '        <button type="button" class="cv-chip" aria-pressed="true" data-v="" data-es="Todos" data-en="All">Todos</button>']
    for c, es, en in CV_PAISES:
        if c in usados and c != "LATAM":
            o.append(f'        <button type="button" class="cv-chip" aria-pressed="false" data-v="{c}" data-es="{es}" data-en="{en}">{es}</button>')
    o += ['      </div>',
          '      ' + _t("p", "Al elegir un país también salen las que aceptan a toda la región.", "Picking a country also shows the ones open to the whole region.", "cv-filters__note"),
          '      <p class="cv-empty" data-cv-empty hidden data-es="Nada con ese filtro esta semana." data-en="Nothing under that filter this week.">Nada con ese filtro esta semana.</p>',
          '    </section>', '']

    def tarjeta(e, moki=""):
        te, tn = CV_TIPO1[e["tipo"]]
        est = {"abierta": ("Abierta", "Open"), "proxima": ("Próxima", "Upcoming"), "permanente": ("Todo el año", "All year"), "cerrada": ("Cerrada", "Closed")}[e["estado"]]
        nombres = {c: (es, en) for c, es, en in CV_PAISES}
        pe = ", ".join(nombres[c][0] for c in e["paises"]); pn = ", ".join(nombres[c][1] for c in e["paises"])
        fe = fn = None
        if e["estado"] == "cerrada":
            x, y = fecha(e["cierra"]); fe, fn = f"Cerró el {x}", f"Closed {y}"
        elif e.get("cierra"):
            x, y = fecha(e["cierra"]); fe, fn = f"Cierra el {x}", f"Closes {y}"
            if e.get("abre") and datetime.date.fromisoformat(e["abre"]) > hoy:
                a, b = fecha(e["abre"]); fe, fn = f"Abre el {a} y cierra el {x}", f"Opens {b} and closes {y}"
        elif e.get("fecha_evento"):
            x, y = _rango(e["fecha_evento"], e.get("fecha_evento_fin")); fe, fn = f"Es el {x}" if not e.get("fecha_evento_fin") else f"Del {x}", f"On {y}" if not e.get("fecha_evento_fin") else f"From {y}"
        elif e["estado"] == "permanente":
            fe, fn = "Recibe solicitudes todo el año", "Takes applications all year"
        else:
            fe, fn = "Fecha por anunciar", "Date to be announced"
        ve, vn = fecha(e["fuente_fecha"])
        h = [f'        <article class="cv-card" id="c-{e["id"]}" data-tipo="{e["tipo"]}" data-paises="{" ".join(e["paises"])}" data-estado="{e["estado"]}"' + (f' data-cierra="{e["cierra"]}"' if e.get("cierra") else "") + f'>{moki}',
             f'          <p class="cv-card__top">{_t("span", te, tn, "ia-badge")}{_t("span", est[0], est[1], "cv-card__estado")}'
             + (f'<span class="cv-left" data-cv-left="{e["cierra"]}"></span>' if e.get("cierra") and e["estado"] != "cerrada" else "") + '</p>',
             f'          <h3>{esc(e["nombre"])}</h3>',
             f'          <p class="cv-card__quien">{esc(e["quien"])} · {_t("span", pe, pn)}</p>',
             '          <dl>',
             f'            <div>{_t("dt", "Para quién", "Who it is for")}{_t("dd", e["para_quien"], e["para_quien_en"])}</div>',
             f'            <div>{_t("dt", "Qué da", "What you get")}{_t("dd", e["que_da"], e["que_da_en"])}</div>',
             f'            <div>{_t("dt", "Fecha", "Date")}{_t("dd", fe + (". " + e["nota"] if e.get("nota") else ""), fn + (". " + e["nota_en"] if e.get("nota_en") else ""))}</div>',
             '          </dl>',
             f'          <p class="cv-card__foot"><a class="btn btn--ghost" href="{esc(e["liga"])}" target="_blank" rel="noopener" data-es="Página oficial ↗" data-en="Official page ↗">Página oficial ↗</a>'
             f'{_t("small", f"Verificado el {ve}", f"Verified {vn}")}</p>',
             '        </article>']
        return "\n".join(h)

    n = 0
    for t, es, en in CV_TIPOS:
        grupo = sorted([e for e in viva if e["tipo"] == t], key=lambda e: ({"abierta": 0, "proxima": 1, "permanente": 2}[e["estado"]], orden(e)))
        if not grupo: continue
        o += [f'    <section class="wrap inner-section cv-group" id="{t}" data-cv-group aria-labelledby="{t}-title">',
              '      <div class="rv-head">', '        ' + _t("h2", es, en).replace("<h2", f'<h2 id="{t}-title"'), '      </div>',
              '      <div class="cv-grid">']
        for e in grupo:
            n += 1
            o.append(tarjeta(e, '<span data-moki="arriba" data-moki-id="gamedev-convocatorias-tarjeta" style="--moki-r:10%"></span>' if n == 5 else ""))
        o += ['      </div>', '    </section>', '']
    if cerr:
        o += ['    <section class="wrap inner-section" id="cerradas" aria-labelledby="cerradas-title">',
              '      <div class="rv-head">', '        ' + _t("h2", "Cerraron hace poco", "Recently closed").replace("<h2", '<h2 id="cerradas-title"'),
              '        ' + _t("p", "Se quedan 30 días para que sepas qué buscar el próximo año.", "They stay for 30 days so you know what to look for next year."), '      </div>',
              '      <div class="cv-grid">'] + [tarjeta(e) for e in sorted(cerr, key=orden, reverse=True)] + ['      </div>', '    </section>', '']
    o += ['    <section class="wrap inner-section cv-how">',
          '      ' + _t("p", "Cómo se arma esta lista: cada miércoles abrimos la página oficial de cada entrada y de ahí sale la fecha. Si la página oficial no da fecha, lo decimos. No tomamos fechas de notas de prensa. ¿Falta una? Escríbele a Jorge en sus redes.",
                       "How this list is built: every Wednesday we open the official page of each entry and take the date from there. If the official page gives no date, we say so. We do not take dates from press notes. Missing one? Message Jorge on his socials."),
          '    </section>', '']
    mail = (HERE / "home_body.html").read_text(encoding="utf-8")
    m = re.search(r'    <section class="wrap rv-section" id="boletin".*?</section>\n', mail, re.S)
    o.append(m.group(0).replace("rv-section", "inner-section").rstrip("\n"))
    o += ['', '    <section class="wrap inner-section">', '      <div class="rv-links">',
          '        ' + _t("a", "Llévate el kit de arranque", "Grab the starter kit", "btn btn--primary").replace("<a", '<a href="kit.html"'),
          '        ' + _t("a", "Calcula cuánto cuesta tu juego", "Work out what your game costs", "btn btn--ghost").replace("<a", '<a href="presupuesto.html"'),
          '      </div>', '    </section>', '  </main>', '']
    (HERE / "convocatorias_body.html").write_text("\n".join(o), encoding="utf-8")
    page("convocatorias.html", "Fondos y convocatorias para hacer videojuegos en Latinoamérica | Jorge Suárez", CV_DESC,
         "convocatorias_body.html", extra_js='<script src="scripts/convocatorias.js" defer></script>')
    evs = [{"@type": "Event", "name": e["nombre"], "startDate": e["fecha_evento"], **({"endDate": e["fecha_evento_fin"]} if e.get("fecha_evento_fin") else {}),
            "eventStatus": "https://schema.org/EventScheduled", "location": {"@type": "Place", "name": e["lugar"], "address": e["lugar"]},
            "organizer": {"@type": "Organization", "name": e["quien"]}, "url": e["liga"], "description": e["que_da"]}
           for e in viva if e["tipo"] == "evento" and e.get("fecha_evento") and e.get("lugar")]
    f = ROOT / "convocatorias.html"; s = f.read_text(encoding="utf-8")
    s = s.replace("build 10 nov 2026", "build " + ae).replace("build Nov 10 2026", "build " + an)
    if evs:
        s = s.replace("</head>", '  <script type="application/ld+json">\n  ' + json.dumps({"@context": "https://schema.org", "@graph": evs}, ensure_ascii=False) + '\n  </script>\n</head>', 1)
    f.write_text(s, encoding="utf-8")
    c = lambda st: sum(1 for e in ent if e["estado"] == st)
    print("convocatorias", len(viva), "vivas ·", c("abierta"), "abiertas ·", c("proxima"), "próximas ·", c("permanente"), "permanentes ·", len(cerr), "cerradas · primero:", pronto[0]["nombre"] if pronto else "-")

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
         "Plantillas para avanzar tu juego: GDD de una página, checklist de tu página de tienda, pitch en 10 láminas, plan de 12 semanas antes del lanzamiento y press kit en una página. La primera es libre; las demás se abren al compartir.",
         "kit_body.html", extra_js='<script src="scripts/unlock.js" defer></script>')
    page("presupuesto.html", "¿Cuánto cuesta tu juego? Calculadora de presupuesto | Game Industry Resources",
         "Calculadora gratis para gamedevs: pon a tu equipo, los meses y tus gastos, y ve el total y cuántas copias necesitas vender para recuperarlo.",
         "presupuesto_body.html", extra_js='<script src="scripts/presupuesto.js" defer></script>')
    page("gracias.html", "Fuentes y gracias | Game Industry Resources",
         "De quién aprendimos, de dónde sale cada dato y a dónde ir por el original: Motor de Juegos, DeVuego, INDI-ES y más.",
         "gracias_body.html")
    convocatorias()
    GUIAS_PAGS = guias()
    for _rel, _t, _c in GUIAS_PAGS:
        SEO[_rel] = (_t, None, _c)
    for path, prefix, current in [(r, "../", "guias/") for r, _, _ in GUIAS_PAGS] + [
        ("index.html", "", ""), ("kit.html", "", "kit.html"), ("gracias.html", "", "gracias.html"), ("presupuesto.html", "", "presupuesto.html"), ("convocatorias.html", "", "convocatorias.html"),
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
    for path in ["index.html", "kit.html", "gracias.html", "presupuesto.html", "convocatorias.html", "entrar.html", "ciclo.html", "tools.html",
                 "marketing.html", "jobs.html", "database.html", "ecosistema.html", "mexico-indie.html", "industria.html",
                 "actividad.html", "noticias/index.html", "historico/2024-2025/index.html", "guides/cv.html",
                 "ia/index.html", "ia/patrocina/index.html", "ia/destacado-grok-bot/index.html"] + [r for r, _, _ in GUIAS_PAGS]:
        pulso(path)
    for _path, (_t, _d, _c) in SEO.items():
        seo(_path, _t, _d, _c)
    sitemap()
