"""Guías propias (tarea de los viernes). Cada guía es un diccionario en GUIAS; build.py arma guias/<slug>.html y guias/index.html.
Texto: mini marcado [texto](liga) y **negrita**. Cada bloque va en español y en inglés; se muestra uno u otro con data-l (ver revamp.css).
Reglas de contenido: tools/revamp/GUIAS-COLA.md."""
import re, json, html

BASE = "https://gamedev.jorgesuarez.com.mx"
PERSON = "https://jorgesuarez.com.mx/#person"
MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
MESES_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"]

def fecha_larga(iso):
    y, m, d = iso.split("-")
    return f"{int(d)} de {MESES_ES[int(m)-1]} de {y}", f"{MESES_EN[int(m)-1]} {int(d)}, {y}"

def md(s):
    """[texto](liga) y **negrita** a HTML. Las ligas internas empiezan con ../"""
    s = html.escape(s, quote=False)
    def a(m):
        t, u = m.group(1), m.group(2)
        ext = u.startswith("http")
        return f'<a href="{u}"' + (' target="_blank" rel="noopener"' if ext else '') + f'>{t}</a>'
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", a, s)
    return re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)

def plano(s):
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", s)
    return s.replace("**", "")

def attr(s): return html.escape(s, quote=True)
def bi(tag, es, en, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c} data-l="es">{md(es)}</{tag}>\n          <{tag}{c} data-l="en" lang="en">{md(en)}</{tag}>'
def t(tag, es, en, extra=""):
    return f'<{tag}{extra} data-es="{attr(es)}" data-en="{attr(en)}">{html.escape(es, quote=False)}</{tag}>'

def bloque(b):
    k = b[0]
    if k == "p": return "          " + bi("p", b[1], b[2])
    if k == "nota": return f'          <aside class="gap-note" role="note">\n          {bi("p", b[1], b[2])}\n          </aside>'
    if k in ("ol", "ul"):
        out = []
        for l, i in (("es", 0), ("en", 1)):
            la = ' lang="en"' if l == "en" else ""
            out.append(f'          <{k} class="guia-list" data-l="{l}"{la}>')
            out += [f"            <li>{md(it[i])}</li>" for it in b[1]]
            out.append(f"          </{k}>")
        return "\n".join(out)
    if k == "pasos":
        out = ['          <ol class="guia-steps">']
        for n, (ne, nn, te, tn) in enumerate(b[1], 1):
            out.append(f'            <li id="paso-{n}">{t("h3", ne, nn)}')
            for pe, pn in zip(te, tn):
                out.append("              " + bi("p", pe, pn))
            out.append("            </li>")
        out.append("          </ol>")
        return "\n".join(out)
    if k == "datos":
        out = ['          <dl class="guia-facts">']
        for (ke, kn, ve, vn, fe, fu) in b[1]:
            src = f'<a class="guia-src" href="{fu}" target="_blank" rel="noopener">{html.escape(fe)}</a>' if fu else ""
            out.append(f'            <div>{t("dt", ke, kn)}<dd><span data-l="es">{md(ve)}</span><span data-l="en" lang="en">{md(vn)}</span> {src}</dd></div>')
        out.append("          </dl>")
        return "\n".join(out)
    raise ValueError(k)

def cuerpo(g):
    fe, fn = fecha_larga(g["revisada"])
    o = []
    o.append('  <main id="main">')
    o.append('    <header class="wrap inner-hero">\n      <div class="hero__content">')
    o.append('        ' + t("span", "Guía", "Guide", ' class="hero__badge"'))
    o.append('        ' + t("h1", g["h1_es"], g["h1_en"], ' class="hero__title"'))
    o.append('        ' + t("p", g["sub_es"], g["sub_en"], ' class="hero__subtitle lead"'))
    o.append(f'        <p class="section__description"><span data-es="Por" data-en="By">Por</span> <a href="https://jorgesuarez.com.mx/">Jorge Suárez</a> · <span data-es="Fuentes revisadas el {fe}" data-en="Sources checked on {fn}">Fuentes revisadas el {fe}</span></p>')
    o.append('      </div>\n    </header>\n')
    o.append('    <section class="wrap inner-section">\n      <article class="guide-article guia">')
    o.append('        <section id="respuesta">\n          ' + t("h2", "La respuesta corta", "The short answer"))
    for pe, pn in g["respuesta"]:
        o.append("          " + bi("p", pe, pn))
    o.append("        </section>")
    for sid, he, hn, bloques in g["secciones"]:
        o.append(f'        <section id="{sid}">\n          ' + t("h2", he, hn))
        o += [bloque(b) for b in bloques]
        o.append("        </section>")
    # fuentes
    o.append('        <section id="fuentes">\n          ' + t("h2", "Fuentes", "Sources"))
    o.append(f'          <p><span data-es="Todas abiertas y revisadas el {fe}. Si algo cambió, manda la fuente y lo corregimos." data-en="All opened and checked on {fn}. If something changed, send us the source and we will fix it.">Todas abiertas y revisadas el {fe}. Si algo cambió, manda la fuente y lo corregimos.</span></p>')
    o.append('          <ul class="guia-list guia-sources">')
    for ne, nn, u in g["fuentes"]:
        o.append(f'            <li><a href="{u}" target="_blank" rel="noopener">{t("span", ne, nn)}</a></li>')
    o.append('          </ul>\n        </section>')
    o.append('      </article>\n    </section>\n')
    # siguiente paso
    o.append('    <section class="wrap inner-section" id="siguiente">\n      <div class="section__header">')
    o.append('        ' + t("h2", "Tu siguiente paso", "Your next step", ' class="section__title"'))
    o.append('        ' + t("p", g["sig_es"], g["sig_en"], ' class="section__description"'))
    o.append('      </div>\n      <div class="inner-actions">')
    for i, (u, le, ln) in enumerate(g["siguiente"]):
        o.append(f'        <a href="{u}" class="btn btn--{"primary" if i == 0 else "ghost"}" data-es="{attr(le)}" data-en="{attr(ln)}">{html.escape(le)}</a>')
    o.append('      </div>\n    </section>\n')
    o.append(BOLETIN)
    o.append('  </main>\n')
    return "\n".join(o)

BOLETIN = '''    <section class="wrap rv-section" id="boletin" aria-labelledby="boletin-title">
      <article class="rv-mail">
        <div class="rv-mail__copy">
          <p class="rv-mail__kicker" data-es="Boletín" data-en="Newsletter">Boletín</p>
          <h2 id="boletin-title" data-es="Una guía como esta cada semana, en tu correo" data-en="A guide like this every week, in your inbox">Una guía como esta cada semana, en tu correo</h2>
          <ul>
            <li data-es="La guía nueva, con sus fuentes" data-en="The new guide, with its sources">La guía nueva, con sus fuentes</li>
            <li data-es="Una herramienta de IA para hacer juegos" data-en="One AI tool for making games">Una herramienta de IA para hacer juegos</li>
            <li data-es="Lo que pasó en el gamedev de Latinoamérica" data-en="What happened in Latin American gamedev">Lo que pasó en el gamedev de Latinoamérica</li>
          </ul>
        </div>
        <div class="rv-mail__form">
          <form class="ia-form ia-form--inline" data-boletin="home" novalidate>
            <label class="sr-only" for="boletin-email" data-es="Tu correo" data-en="Your email">Tu correo</label>
            <input id="boletin-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" placeholder="tu@correo.com">
            <div class="ia-hp" aria-hidden="true"><label for="boletin-company">Company</label><input id="boletin-company" name="company" type="text" tabindex="-1" autocomplete="off"></div>
            <button class="btn btn--primary" type="submit" data-es="Apúntame" data-en="Sign me up">Apúntame</button>
            <p class="ia-form__status" role="status" aria-live="polite" data-status></p>
          </form>
          <p class="rv-mail__note" data-es="En español. Estamos por mandar el primer número. Solo guardamos tu correo y te das de baja cuando quieras." data-en="In Spanish. The first issue is about to go out. We only keep your email and you can unsubscribe anytime.">En español. Estamos por mandar el primer número. Solo guardamos tu correo y te das de baja cuando quieras.</p>
        </div>
      </article>
    </section>'''

def indice(guias):
    o = ['  <main id="main">', '    <header class="wrap inner-hero">\n      <div class="hero__content">',
         '        ' + t("span", "Guías", "Guides", ' class="hero__badge"'),
         '        ' + t("h1", "Guías para hacer y vender tu juego desde Latinoamérica", "Guides to make and sell your game from Latin America", ' class="hero__title"'),
         '        ' + t("p", "Una pregunta por guía, contestada completa: pasos, costos y tiempos, cada dato con su fuente oficial y la fecha en que la revisamos. Sale una nueva cada viernes.", "One question per guide, answered in full: steps, costs and timelines, every fact with its official source and the date we checked it. A new one lands every Friday.", ' class="hero__subtitle lead"'),
         '      </div>\n    </header>\n',
         '    <section class="wrap inner-section" aria-labelledby="lista-title">',
         '      ' + t("h2", "Todas las guías", "All guides", ' id="lista-title" class="sr-only"'),
         '      <ul class="rv-new__list guia-index">']
    for g in sorted(guias, key=lambda x: x["publicada"], reverse=True):
        y, m, d = g["publicada"].split("-")
        de = f"{int(d)} {MESES_ES[int(m)-1][:3]} {y}"; dn = f"{MESES_EN[int(m)-1][:3]} {int(d)}, {y}"
        o.append(f'        <li><a href="{g["slug"]}.html"><time datetime="{g["publicada"]}" data-es="{de}" data-en="{dn}">{de}</time><span>{t("b", g["h1_es"], g["h1_en"])}{t("small", g["sub_es"], g["sub_en"])}</span><span aria-hidden="true">→</span></a></li>')
    o += ['      </ul>', '    </section>\n',
          '    <section class="wrap inner-section">\n      <div class="prose">',
          '        ' + t("h2", "Cómo se hace una guía aquí", "How a guide gets made here"),
          '        ' + t("p", "Abrimos la fuente oficial el día que escribimos (la tienda, la autoridad fiscal, el fondo) y ponemos la liga junto a cada dato. Si no hay dato confiable, lo decimos. En temas fiscales y legales solo repetimos lo que dice la fuente: no es asesoría.", "We open the official source the day we write (the store, the tax authority, the fund) and put the link next to each fact. If there is no reliable figure, we say so. On tax and legal topics we only repeat what the source says: it is not advice."),
          '        <div class="inner-actions" style="justify-content:flex-start">',
          '          <a class="btn btn--primary" href="../kit.html" data-es="Kit de arranque" data-en="Starter kit">Kit de arranque</a>',
          '          <a class="btn btn--ghost" href="../presupuesto.html" data-es="Calculadora de presupuesto" data-en="Budget calculator">Calculadora de presupuesto</a>',
          '          <a class="btn btn--ghost" href="../gracias.html" data-es="Fuentes y gracias" data-en="Sources and thanks">Fuentes y gracias</a>',
          '        </div>\n      </div>\n    </section>\n', BOLETIN, '  </main>\n']
    return "\n".join(o)

def ld(g):
    url = f'{BASE}/guias/{g["slug"]}'
    graph = [{
        "@type": "Article", "@id": url + "#articulo", "headline": g["h1_es"], "description": g["desc"],
        "inLanguage": "es-MX", "datePublished": g["publicada"], "dateModified": g["revisada"],
        "mainEntityOfPage": url, "image": BASE + "/assets/og/gamedev-home.jpg",
        "author": {"@type": "Person", "@id": PERSON, "name": "Jorge Suárez", "url": "https://jorgesuarez.com.mx"},
        "publisher": {"@id": PERSON}, "isPartOf": {"@id": BASE + "/#sitio"},
    }]
    pasos = [b for s in g["secciones"] for b in s[3] if b[0] == "pasos"]
    if pasos:
        graph.append({
            "@type": "HowTo", "@id": url + "#pasos", "name": g["h1_es"], "inLanguage": "es-MX",
            "step": [{"@type": "HowToStep", "position": n, "name": ne, "text": " ".join(plano(x) for x in te), "url": f"{url}#paso-{n}"}
                     for n, (ne, nn, te, tn) in enumerate(pasos[0][1], 1)],
        })
    return '  <script type="application/ld+json">\n  ' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False) + '\n  </script>\n'

# ---------------------------------------------------------------------------
STEAM = "https://partner.steamgames.com"
D_ONB = STEAM + "/doc/gettingstarted/onboarding"
D_FAQ = STEAM + "/doc/gettingstarted/faq"
D_FEE = STEAM + "/doc/gettingstarted/appfee"
D_TAX = STEAM + "/doc/finance/taxfaq"
D_PAY = STEAM + "/doc/finance/payments_salesreporting/faq"
D_PRICE = STEAM + "/doc/store/pricing"
D_CUR = STEAM + "/doc/store/pricing/currencies"
D_DIRECT = STEAM + "/steamdirect"
IRS_T1 = "https://www.irs.gov/pub/irs-lbi/tax-treaty-table-1.pdf"
IRS_W8 = "https://www.irs.gov/forms-pubs/about-form-w-8-ben"
SAT_RFC = "https://wwwmat.sat.gob.mx/personas/tramites-del-rfc"

GUIAS = [
{
  "slug": "publicar-juego-en-steam-desde-mexico",
  "publicada": "2026-11-13", "revisada": "2026-11-13",
  "title": "Cómo publicar tu juego en Steam desde México: cuota, impuestos y pagos | Jorge Suárez",
  "desc": "Paso a paso para publicar en Steam desde México: alta en Steamworks, cuota de 100 dólares, entrevista fiscal con tu RFC, tiempos de espera y cómo te paga Steam. Cada dato con su fuente oficial.",
  "h1_es": "Cómo publicar tu juego en Steam desde México",
  "h1_en": "How to publish your game on Steam from Mexico",
  "sub_es": "Alta en Steamworks, cuota de Steam Direct, entrevista fiscal y cómo te pagan. Cada dato con su fuente oficial.",
  "sub_en": "Steamworks signup, the Steam Direct fee, the tax interview and how you get paid. Every fact with its official source.",
  "nuevo_es": "Cuota de 100 dólares, entrevista fiscal con tu RFC, 21 días de espera y pago en dólares. Con fuente oficial en cada dato.",
  "nuevo_en": "The 100-dollar fee, the tax interview with your RFC, the 21-day wait and payment in dollars. Official source on every fact.",
  "respuesta": [
    ("Sí puedes publicar en Steam desde México como persona física, sin empresa y sin cuenta de banco en Estados Unidos. Necesitas una cuenta de Steamworks con tu nombre legal, pagar 100 dólares por juego (la cuota de Steam Direct), contestar una entrevista fiscal en línea y registrar una cuenta de banco a tu nombre que reciba transferencias SWIFT en dólares.",
     "Yes, you can publish on Steam from Mexico as an individual, with no company and no US bank account. You need a Steamworks account under your legal name, 100 dollars per game (the Steam Direct fee), an online tax interview and a bank account in your name that can receive SWIFT wires in US dollars."),
    ("Entre el pago de la cuota y el lanzamiento pasan al menos 21 días. En ese tiempo tu página «Próximamente» debe estar pública dos semanas y Steam revisa tu página y tu build, lo que tarda de 1 a 5 días. Steam paga en dólares, a más tardar el día 30 del mes siguiente a tus ventas, y puede guardar el pago hasta que juntes 100 dólares.",
     "At least 21 days pass between paying the fee and releasing. In that window your \"Coming soon\" page has to be public for two weeks and Steam reviews your page and your build, which takes 1 to 5 days. Steam pays in US dollars by the 30th of the month after your sales, and may hold the payment until you reach 100 dollars."),
  ],
  "secciones": [
    ("pasos", "Los pasos, en orden", "The steps, in order", [
      ("pasos", [
        ("Decide a nombre de quién vas a publicar", "Decide whose name you publish under",
         [f"Steam acepta personas y empresas. Si el juego es tuyo, en el formulario eliges «Sole Proprietorship» y escribes tu nombre y apellidos legales como nombre de la compañía. No se vale un alias ni el nombre de tu estudio si ese estudio no existe como entidad legal ([incorporación de Steamworks]({D_ONB})).",
          f"Ese nombre tiene que ser idéntico al de tu cuenta de banco y al de tus documentos fiscales. Escríbelo sin acentos ni ñ: la documentación pide no usar caracteres propios de otro idioma que no sea el inglés ([preguntas frecuentes de incorporación]({D_FAQ})).",
          "Si piensas constituir una empresa, hazlo antes. Cambiar de nombre legal después obliga a abrir otra cuenta de socio con banco e impuestos nuevos."],
         [f"Steam accepts individuals and companies. If the game is yours, you pick \"Sole Proprietorship\" in the form and enter your legal first and last name as the company name. An alias or a studio name does not work if that studio is not a legal entity ([Steamworks onboarding]({D_ONB})).",
          f"That name has to match your bank account and your tax documents exactly. Type it without accents or ñ: the documentation asks you not to use characters unique to a language other than English ([onboarding FAQ]({D_FAQ})).",
          "If you plan to incorporate, do it first. Changing the legal name later means opening a new partner account with new banking and tax information."]),
        ("Ten a la mano tu RFC y los datos de tu banco", "Have your RFC and bank details ready",
         [f"Para pedir la tasa reducida del tratado fiscal, Steam exige un número de identificación fiscal, de Estados Unidos o de tu país ([preguntas frecuentes de impuestos]({D_TAX})). En México ese número es tu RFC, que se tramita en el [SAT]({SAT_RFC}).",
          f"La cuenta de banco debe estar a tu nombre y poder recibir una transferencia SWIFT en dólares. Steam no paga a cuentas de terceros ni por otro medio ([pagos y reportes]({D_PAY})). Pregunta a tu banco qué datos dar para recibir una transferencia internacional y cuánto cobra por recibirla."],
         [f"To claim the reduced treaty rate, Steam requires a tax identification number, either a US one or one from your country ([tax FAQ]({D_TAX})). In Mexico that number is your RFC, issued by the [SAT]({SAT_RFC}).",
          f"The bank account must be in your name and able to receive a SWIFT wire in US dollars. Steam does not pay third-party accounts or use any other method ([reporting and payments]({D_PAY})). Ask your bank which details to give for an incoming international wire and what it charges to receive one."]),
        ("Crea tu cuenta de Steamworks y firma el papeleo", "Create your Steamworks account and sign the paperwork",
         [f"Entras a [partner.steamgames.com]({STEAM}/) con tu cuenta de Steam y firmas en línea dos documentos: el acuerdo de confidencialidad y el Acuerdo de Distribución de Steam. Te piden identificación legal de quien firma, datos bancarios y datos fiscales ([incorporación de Steamworks]({D_ONB}))."],
         [f"Go to [partner.steamgames.com]({STEAM}/) with your Steam account and sign two documents online: the non-disclosure agreement and the Steam Distribution Agreement. You are asked for legal identification of the signer, bank details and tax details ([Steamworks onboarding]({D_ONB}))."]),
        ("Paga la cuota de Steam Direct", "Pay the Steam Direct fee",
         [f"Son 100 dólares, o su equivalente, por cada juego. Se paga con cualquier método que Steam acepte en tu país, menos el saldo de la Cartera de Steam. No es reembolsable ([cuota de Steam Direct]({D_FEE})).",
          "El crédito queda pegado a la cuenta de Steam que pagó y solo esa persona puede activarlo, así que paga con la cuenta que va a administrar el juego. La cuota regresa en el pago posterior a que tu juego llegue a 1,000 dólares de ingreso bruto ajustado."],
         [f"It is 100 dollars, or the equivalent, per game. You can pay with any method Steam supports in your country except Steam Wallet funds. It is not refundable ([Steam Direct fee]({D_FEE})).",
          "The credit is attached to the Steam account that paid and only that person can activate it, so pay with the account that will manage the game. The fee comes back in the payment made after your game reaches 1,000 dollars in adjusted gross revenue."]),
        ("Contesta la entrevista fiscal", "Take the tax interview",
         [f"Es un cuestionario en línea de 5 a 10 minutos que llena por ti el formulario W-8BEN, el de quienes no pagan impuestos en Estados Unidos. No se puede guardar a medias y va con el mismo nombre que diste en el alta ([preguntas frecuentes de incorporación]({D_FAQ})).",
          "Al terminar te muestra tu tasa de retención. La verificación tarda de 2 a 7 días hábiles y pueden pedirte más documentos por correo. Mientras dura no puedes cambiar tus datos fiscales, y sin datos bancarios y fiscales válidos no puedes lanzar."],
         [f"It is a 5 to 10 minute online questionnaire that fills in form W-8BEN for you, the one for people who are not US taxpayers. You cannot save it halfway and it must use the same name you gave at signup ([onboarding FAQ]({D_FAQ})).",
          "At the end it shows your withholding rate. Verification takes 2 to 7 business days and you may be asked for more documents by email. While it runs you cannot change your tax information, and without valid bank and tax information you cannot release."]),
        ("Arma tu página de tienda y ponla en «Próximamente»", "Build your store page and set it to \"Coming soon\"",
         [f"En tus primeros juegos, Steam pide que la página «Próximamente» esté pública al menos dos semanas antes de lanzar. Antes de salir pasa por una revisión de 1 a 5 días ([incorporación de Steamworks]({D_ONB})).",
          f"El precio lo pones tú. Eliges un precio en dólares y Steam te propone el de las demás monedas, que puedes editar una por una. El peso mexicano está entre las monedas con precio local ([precios]({D_PRICE}), [monedas]({D_CUR})). La revisión del precio suele tardar uno o dos días hábiles.",
          "Para no dejar huecos en la página, usa el [checklist de página de tienda del kit](../kit.html)."],
         [f"For your first few games, Steam requires the \"Coming soon\" page to be public for at least two weeks before release. Before it goes live it passes a 1 to 5 day review ([Steamworks onboarding]({D_ONB})).",
          f"You set the price. You pick a price in US dollars and Steam proposes the other currencies, which you can edit one by one. The Mexican peso is among the currencies with local pricing ([pricing]({D_PRICE}), [currencies]({D_CUR})). Price review usually takes one or two business days.",
          "To leave no gaps on the page, use the [store page checklist in the kit](../kit.html)."]),
        ("Sube tu build, pasa la revisión y lanza", "Upload your build, pass review and release",
         [f"Steam corre tu juego para confirmar que funciona, que está bien configurado y que no hace nada dañino. Esa revisión también tarda de 1 a 5 días ([incorporación de Steamworks]({D_ONB})).",
          "No puedes lanzar antes de que pasen 21 días desde que pagaste la cuota. Pon tu fecha de salida contando ese plazo, las dos semanas de «Próximamente» y las revisiones."],
         [f"Steam runs your game to confirm it works, is configured correctly and does nothing harmful. That review also takes 1 to 5 days ([Steamworks onboarding]({D_ONB})).",
          "You cannot release before 21 days have passed since you paid the fee. Set your release date counting that wait, the two weeks of \"Coming soon\" and the reviews."]),
      ]),
    ]),
    ("costos", "Costos y tiempos, con fuente", "Costs and timelines, with sources", [
      ("datos", [
        ("Cuota de Steam Direct", "Steam Direct fee", "100 dólares (o equivalente) por juego. No reembolsable.", "100 dollars (or equivalent) per game. Not refundable.", "Steamworks", D_FEE),
        ("Cuándo recuperas la cuota", "When the fee comes back", "En el pago posterior a que el juego llegue a 1,000 dólares de ingreso bruto ajustado.", "In the payment after the game reaches 1,000 dollars in adjusted gross revenue.", "Steamworks", D_FEE),
        ("Papeleo y verificación de identidad", "Paperwork and identity verification", "De 15 a 30 días, según la página de Steam Direct.", "15 to 30 days, according to the Steam Direct page.", "Steam Direct", D_DIRECT),
        ("Entrevista fiscal", "Tax interview", "De 5 a 10 minutos. La verificación tarda de 2 a 7 días hábiles.", "5 to 10 minutes. Verification takes 2 to 7 business days.", "Steamworks", D_FAQ),
        ("Espera entre la cuota y el lanzamiento", "Wait between the fee and release", "21 días en tus primeros juegos.", "21 days for your first few games.", "Steamworks", D_ONB),
        ("Página «Próximamente»", "\"Coming soon\" page", "Pública al menos dos semanas antes de lanzar.", "Public for at least two weeks before release.", "Steamworks", D_ONB),
        ("Revisión de página y de build", "Store page and build review", "De 1 a 5 días.", "1 to 5 days.", "Steamworks", D_ONB),
        ("Cuándo paga Steam", "When Steam pays", "A más tardar el día 30 del mes siguiente a las ventas. Puede tardar unos días hábiles más en verse en tu banco.", "By the 30th of the month after the sales. It can take a few more business days to post to your bank.", "Steamworks", D_PAY),
        ("Mínimo para que te paguen", "Minimum payout", "Steam puede guardar el pago hasta que juntes 100 dólares. Tú puedes subir ese mínimo.", "Steam may hold the payment until you reach 100 dollars. You can raise that minimum.", "Steamworks", D_PAY),
        ("Moneda y medio de pago", "Currency and payment method", "Solo dólares, por transferencia SWIFT fuera de Estados Unidos.", "US dollars only, by SWIFT wire outside the United States.", "Steamworks", D_PAY),
        ("Comisiones bancarias", "Bank fees", "Valve no te cobra el envío. Los bancos intermediarios y tu banco sí pueden cobrar, y no hay una cifra pública única: pregúntale al tuyo.", "Valve does not charge you for the wire. Intermediary banks and your own bank may, and there is no single public figure: ask yours.", "Steamworks", D_PAY),
        ("Porcentaje que se queda Steam", "Steam's share", "La documentación abierta no lo dice. Viene en el Acuerdo de Distribución que firmas. Léelo ahí antes de calcular.", "The open documentation does not state it. It is in the Distribution Agreement you sign. Read it there before you run numbers.", "Steamworks", D_PAY),
      ]),
    ]),
    ("impuestos", "Impuestos: qué te retiene Steam", "Taxes: what Steam withholds", [
      ("nota", "Esto no es asesoría fiscal ni legal. Aquí solo está lo que dicen Valve, el IRS y el SAT en sus páginas. Tu caso lo ve tu contador.", "This is not tax or legal advice. This only repeats what Valve, the IRS and the SAT say on their pages. Your case is for your accountant."),
      ("p", f"Valve trata tus pagos como regalías. La retención de Estados Unidos se calcula solo sobre la parte de tu pago que viene de ventas hechas en ese país, que en tu reporte mensual aparece como «US Share» ([preguntas frecuentes de impuestos]({D_TAX})).",
            f"Valve treats your payments as royalties. US withholding is calculated only on the part of your payment that comes from sales made in that country, shown as \"US Share\" on your monthly report ([tax FAQ]({D_TAX}))."),
      ("p", f"La tasa va de 0% a 30% y te la muestra la entrevista fiscal al terminar. Sin tratado, o sin dar un número de identificación fiscal, es 30%. México sí tiene tratado con Estados Unidos: la [tabla de tratados del IRS]({IRS_T1}) (revisión de mayo de 2023) marca 10% para regalías de derechos de autor. La tasa que cuenta es la que te salga a ti en la entrevista.",
            f"The rate runs from 0% to 30% and the tax interview shows it at the end. With no treaty, or with no tax identification number, it is 30%. Mexico does have a treaty with the United States: the [IRS treaty table]({IRS_T1}) (May 2023 revision) lists 10% for copyright royalties. The rate that counts is the one the interview gives you."),
      ("p", f"Pon tu RFC desde la primera vez. Si lo agregas después y tu tasa baja, Valve no devuelve lo que ya retuvo. Cada año, antes del 15 de marzo, Valve te manda el formulario 1042-S con tu ingreso de fuente estadounidense y lo retenido. El formulario W-8BEN está explicado en la [página del IRS]({IRS_W8}).",
            f"Enter your RFC the first time. If you add it later and your rate drops, Valve does not refund what it already withheld. Each year, by March 15, Valve sends you form 1042-S with your US-source income and the amount withheld. Form W-8BEN is explained on the [IRS page]({IRS_W8})."),
      ("p", "Lo que declaras en México por ese ingreso, y si puedes acreditar lo que te retuvieron allá, no lo resuelve Steam. Su documentación te manda con tu asesor fiscal, y nosotros también.",
            "What you report in Mexico for that income, and whether you can credit what was withheld abroad, is not something Steam settles. Its documentation sends you to your tax advisor, and so do we."),
    ]),
    ("errores", "Errores comunes", "Common mistakes", [
      ("p", "Estos salen de las advertencias de la propia documentación de Steamworks. Todos cuestan tiempo o dinero.", "These come from the warnings in the Steamworks documentation itself. Each one costs time or money."),
      ("ul", [
        ("**Registrarte con el nombre de tu estudio** cuando no es una entidad legal. El nombre debe ser el tuyo o el de una empresa constituida.", "**Signing up with your studio name** when it is not a legal entity. The name must be yours or a registered company's."),
        ("**Escribir tu nombre con acentos o ñ.** Después no coincide con el banco ni con la entrevista fiscal.", "**Typing your name with accents or ñ.** Then it does not match the bank or the tax interview."),
        ("**Dejar vacío el número fiscal en la entrevista.** Te quedas en 30% y lo retenido no regresa.", "**Leaving the tax number blank in the interview.** You stay at 30% and what was withheld does not come back."),
        ("**Dar una cuenta de banco que no está a tu nombre** o que no recibe SWIFT en dólares.", "**Giving a bank account that is not in your name** or that cannot receive SWIFT in US dollars."),
        ("**Pagar la cuota con otra cuenta de Steam** o querer pagarla con saldo de la Cartera.", "**Paying the fee from a different Steam account** or trying to pay it with Wallet funds."),
        ("**Anunciar fecha de salida sin contar los plazos:** 21 días desde la cuota, dos semanas de «Próximamente» y las revisiones.", "**Announcing a release date without counting the waits:** 21 days from the fee, two weeks of \"Coming soon\" and the reviews."),
        ("**Cambiar de banco después del día 15.** El pago de ese mes se puede quedar detenido hasta el siguiente ciclo.", "**Changing banks after the 15th.** That month's payment can be held until the next cycle."),
        (f"**Planear un juego que vive de anuncios o de criptomonedas y NFT.** Steam no los acepta ([incorporación de Steamworks]({D_ONB})).", f"**Planning a game that lives on ads or on crypto and NFTs.** Steam does not accept them ([Steamworks onboarding]({D_ONB}))."),
      ]),
    ]),
  ],
  "sig_es": "Antes de pagar la cuota, saca cuántas copias necesitas vender para recuperar tu juego. La calculadora ya trae la comisión de tienda como casilla: cámbiala por la de tu contrato.",
  "sig_en": "Before paying the fee, work out how many copies you need to sell to earn your game back. The calculator has the store cut as a field: change it to the one in your agreement.",
  "siguiente": [("../presupuesto.html", "Abrir la calculadora", "Open the calculator"), ("../kit.html", "Checklist de página de tienda", "Store page checklist"), ("cuanto-cuesta-hacer-un-videojuego-indie.html", "Cuánto cuesta hacer tu juego", "What your game costs"), ("./", "Más guías", "More guides")],
  "fuentes": [
    ("Steamworks: incorporación (pasos, plazos y qué no acepta Steam)", "Steamworks: onboarding (steps, waits and what Steam does not accept)", D_ONB),
    ("Steamworks: preguntas frecuentes de incorporación (nombre legal, entrevista fiscal)", "Steamworks: onboarding FAQ (legal name, tax interview)", D_FAQ),
    ("Steamworks: cuota de Steam Direct", "Steamworks: Steam Direct fee", D_FEE),
    ("Steam Direct: resumen del proceso", "Steam Direct: process overview", D_DIRECT),
    ("Steamworks: preguntas frecuentes de impuestos", "Steamworks: taxes FAQ", D_TAX),
    ("Steamworks: preguntas frecuentes de pagos y reportes", "Steamworks: reporting and payments FAQ", D_PAY),
    ("Steamworks: precios", "Steamworks: pricing", D_PRICE),
    ("Steamworks: monedas con precio local", "Steamworks: supported currencies", D_CUR),
    ("IRS: tabla 1 de tratados fiscales (revisión de mayo de 2023)", "IRS: tax treaty table 1 (May 2023 revision)", IRS_T1),
    ("IRS: formulario W-8BEN", "IRS: form W-8BEN", IRS_W8),
    ("SAT: trámites del RFC", "SAT: RFC procedures", SAT_RFC),
  ],
},
]

# --- Guía 2 (27-nov-2026): cuánto cuesta hacer un videojuego indie en Latinoamérica ---
D_SHARE = "https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838"
APPLE_PROG = "https://developer.apple.com/programs/"
APPLE_SBP = "https://developer.apple.com/app-store/small-business-program/"
GP_ALTA = "https://support.google.com/googleplay/android-developer/answer/6112435?hl=es-419"
GP_FEES = "https://support.google.com/googleplay/android-developer/answer/112622?hl=es-419"
ITCH_FAQ = "https://itch.io/docs/creators/faq"
ITCH_PAY = "https://itch.io/docs/creators/payments"
EPIC_DIST = "https://store.epicgames.com/en-US/distribution"
UNITY_PLANS = "https://unity.com/products/compare-plans"
UE_LIC = "https://www.unrealengine.com/en-US/license"
GODOT_LIC = "https://godotengine.org/license/"
GM_GET = "https://gamemaker.io/en/get"
FMOD_LIC = "https://www.fmod.com/licensing"
NIN_FAQ = "https://developer.nintendo.com/faq"
BANXICO = "https://www.banxico.org.mx/tipcamb/main.do?page=tip&idioma=sp"
G_STEAM_MX = "publicar-juego-en-steam-desde-mexico.html"

GUIAS.append({
  "slug": "cuanto-cuesta-hacer-un-videojuego-indie",
  "publicada": "2026-11-27", "revisada": "2026-11-27",
  "title": "Cuánto cuesta hacer un videojuego indie en Latinoamérica | Jorge Suárez",
  "desc": "Qué se paga de verdad para hacer y vender un juego indie desde Latinoamérica: cuotas de Steam, Apple, Google, Epic e itch.io, licencias de motor y cómo sacar tu número. Cada precio con su fuente oficial.",
  "h1_es": "Cuánto cuesta hacer un videojuego indie en Latinoamérica",
  "h1_en": "How much it costs to make an indie game in Latin America",
  "sub_es": "Las cuotas y licencias que sí tienen precio público, lo que no lo tiene y la cuenta para sacar tu propio número.",
  "sub_en": "The fees and licenses that do have a public price, the ones that do not, and the math to get your own number.",
  "nuevo_es": "Cuotas de tienda y licencias de motor con su fuente oficial, y la cuenta en 8 pasos para sacar el número de tu juego.",
  "nuevo_en": "Store fees and engine licenses with their official source, and the 8-step math to get your game's number.",
  "respuesta": [
    ("No existe una cifra única, y los rangos que circulan casi nunca dicen de dónde salen. Lo que sí tiene precio público son las cuotas y las licencias, y son la parte chica: poner un juego a la venta en Steam cuesta 100 dólares, en itch.io cero, y puedes hacerlo con un motor que no cobra nada (Godot) o que no cobra hasta que ganes dinero (Unity Personal, Unreal).",
     "There is no single figure, and the ranges you see around almost never say where they come from. What does have a public price are the fees and licenses, and they are the small part: putting a game on sale costs 100 dollars on Steam and nothing on itch.io, and you can build it with an engine that charges nothing (Godot) or nothing until you make money (Unity Personal, Unreal)."),
    ("Lo demás es tiempo de personas: los meses que dura el proyecto por lo que necesita cobrar cada quien, empezando por ti. Ese número cambia con cada equipo y cada ciudad, así que aquí no te damos un rango: te damos los precios que sí se pueden comprobar hoy y la cuenta para sacar el tuyo en diez minutos con la [calculadora](../presupuesto.html).",
     "The rest is people's time: the months the project lasts times what each person needs to earn, starting with you. That number changes with every team and every city, so we do not give you a range here: we give you the prices you can check today and the math to get yours in ten minutes with the [calculator](../presupuesto.html)."),
  ],
  "secciones": [
    ("pasos", "La cuenta, en orden", "The math, in order", [
      ("pasos", [
        ("Fija el alcance y los meses", "Fix the scope and the months",
         ["Todo el presupuesto se multiplica por los meses. Antes de sumar nada, escribe qué lleva el juego y qué se queda fuera, y pon una fecha de salida.",
          "Si todavía no lo tienes en papel, el [kit de arranque](../kit.html) trae un GDD de una página para dejarlo cerrado."],
         ["The whole budget gets multiplied by the months. Before adding anything up, write down what goes into the game and what stays out, and set a release date.",
          "If you do not have it on paper yet, the [starter kit](../kit.html) has a one-page GDD to lock it down."]),
        ("Ponle precio al tiempo de cada persona, empezando por ti", "Put a price on each person's time, starting with yours",
         ["Aunque hoy no te pagues, anota lo que necesitas cobrar al mes para vivir. Si lo dejas en cero, el presupuesto dice que tu juego es gratis y no lo es.",
          "No encontramos una fuente pública, con fecha y método, de sueldos de desarrollo de videojuegos en Latinoamérica, así que no publicamos ninguna cifra. Usa números reales: lo que tú necesitas, lo que te pide cada persona del equipo y la cotización por escrito de quien contrates por proyecto."],
         ["Even if you are not paying yourself today, write down what you need to earn per month to live. If you leave it at zero, the budget says your game is free, and it is not.",
          "We did not find a public source, with a date and a method, for game development salaries in Latin America, so we publish no figure. Use real numbers: what you need, what each team member asks for, and a written quote from anyone you hire per project."]),
        ("Elige motor y lee su licencia", "Pick an engine and read its license",
         [f"Godot es gratis, de código abierto y no cobra regalías: el juego es tuyo ([licencia de Godot]({GODOT_LIC})). Unity Personal es gratis mientras tus ingresos y los fondos que hayas levantado en los últimos 12 meses no pasen de 200,000 dólares. Arriba de eso toca Unity Pro, desde 2,310 dólares al año ([planes de Unity]({UNITY_PLANS})).",
          f"Unreal no cobra por usarlo para hacer juegos. Cobra 5% de regalía sobre lo que tu juego ingrese en bruto después del primer millón de dólares, y lo que vendas dentro de Epic Games Store no paga regalía ([licencia de Unreal]({UE_LIC})).",
          f"GameMaker es gratis solo para uso no comercial. Para vender necesitas la licencia Professional, un pago único de 99.99 dólares que cubre escritorio, web y móvil. Exportar a consolas pide la suscripción Enterprise ([licencias de GameMaker]({GM_GET}))."],
         [f"Godot is free, open source and charges no royalties: the game is yours ([Godot license]({GODOT_LIC})). Unity Personal is free as long as your revenue and the funds you raised in the last 12 months stay under 200,000 dollars. Above that you need Unity Pro, from 2,310 dollars a year ([Unity plans]({UNITY_PLANS})).",
          f"Unreal does not charge you to use it for games. It charges a 5% royalty on your game's gross revenue past the first million dollars, and what you sell inside the Epic Games Store pays no royalty ([Unreal license]({UE_LIC})).",
          f"GameMaker is free for non-commercial use only. To sell you need the Professional license, a one-time payment of 99.99 dollars that covers desktop, web and mobile. Console export requires the Enterprise subscription ([GameMaker licenses]({GM_GET}))."]),
        ("Suma las herramientas, licencia por licencia", "Add the tools, license by license",
         [f"Cada herramienta tiene su letra chica, y muchas traen un nivel gratis para proyectos chicos con un tope. Un ejemplo: el audio con FMOD es gratis si ganas menos de 200,000 dólares al año y tu presupuesto de desarrollo es menor a 600,000. Fuera de ese caso son 2,000 dólares por juego ([licencias de FMOD]({FMOD_LIC})).",
          "Haz la lista de lo que usa tu equipo (arte, audio, control de versiones, gestión de tareas) y abre la página de precios de cada una. Anota el costo por mes y multiplícalo por los meses del paso 1. Si vas a usar herramientas de IA, el [directorio de IA](../ia/) dice cuáles tienen plan gratis."],
         [f"Every tool has its fine print, and many have a free tier for small projects with a cap. One example: audio with FMOD is free if you make under 200,000 dollars a year and your development budget is under 600,000. Outside that case it is 2,000 dollars per game ([FMOD licensing]({FMOD_LIC})).",
          "List what your team uses (art, audio, version control, task tracking) and open each pricing page. Write down the monthly cost and multiply it by the months from step 1. If you plan to use AI tools, the [AI directory](../ia/) says which ones have a free plan."]),
        ("Suma la cuota de cada tienda donde vas a salir", "Add the fee of every store you will launch on",
         [f"Steam cobra 100 dólares por juego y los regresa cuando el juego pasa de 1,000 dólares de ingreso bruto ajustado ([cuota de Steam Direct]({D_FEE})). Epic Games Store también cobra 100 dólares por juego, recuperables ([distribución en Epic]({EPIC_DIST})). Subir tu juego a itch.io no cuesta nada ([preguntas frecuentes de itch.io]({ITCH_FAQ})).",
          f"En móvil, Google Play cobra 25 dólares una sola vez por la cuenta de desarrollador ([alta en Play Console]({GP_ALTA})) y Apple cobra 99 dólares cada año por su programa de desarrolladores ([Apple Developer Program]({APPLE_PROG})). Lo de Apple es un gasto que se repite mientras tu juego siga en la tienda.",
          f"Si vas a Steam desde México, el trámite completo está en [la guía de Steam]({G_STEAM_MX})."],
         [f"Steam charges 100 dollars per game and returns it once the game passes 1,000 dollars in adjusted gross revenue ([Steam Direct fee]({D_FEE})). The Epic Games Store also charges 100 dollars per game, recoupable ([Epic distribution]({EPIC_DIST})). Uploading your game to itch.io costs nothing ([itch.io creator FAQ]({ITCH_FAQ})).",
          f"On mobile, Google Play charges 25 dollars once for the developer account ([Play Console signup]({GP_ALTA})) and Apple charges 99 dollars every year for its developer program ([Apple Developer Program]({APPLE_PROG})). Apple's is a cost that repeats for as long as your game stays on the store.",
          f"If you are heading to Steam from Mexico, the full process is in [the Steam guide]({G_STEAM_MX})."]),
        ("Cotiza lo que vas a encargar fuera", "Get quotes for what you will outsource",
         ["Música, localización, tráiler, contabilidad, registro legal y viajes a eventos no tienen precio de lista. Pide dos o tres cotizaciones por escrito para cada cosa y anota la más probable, no la más barata.",
          "Para eventos y viajes, revisa primero las [convocatorias abiertas](../convocatorias.html): hay becas y fondos que cubren parte de ese gasto."],
         ["Music, localization, a trailer, accounting, legal registration and travel to events have no list price. Ask for two or three written quotes for each and write down the most likely one, not the cheapest.",
          "For events and travel, check the [open calls](../convocatorias.html) first: some grants and funds cover part of that cost."]),
        ("Pasa todo a una sola moneda y agrega un colchón", "Convert everything to one currency and add a cushion",
         [f"Las cuotas y las licencias se cobran en dólares y tu equipo cobra en moneda local. Elige una moneda para todo el presupuesto y convierte con un tipo de cambio oficial, anotando la fecha. En México es el tipo de cambio FIX que publica el [Banco de México]({BANXICO}). En otros países, el del banco central.",
          "Encima del total, agrega un porcentaje para imprevistos. La calculadora trae 20% de entrada y lo puedes mover."],
         [f"Fees and licenses are charged in US dollars and your team is paid in local currency. Pick one currency for the whole budget and convert with an official exchange rate, noting the date. In Mexico that is the FIX rate published by [Banco de México]({BANXICO}). In other countries, the central bank's.",
          "On top of the total, add a percentage for surprises. The calculator starts at 20% and you can change it."]),
        ("Saca cuántas copias necesitas vender", "Work out how many copies you need to sell",
         ["El presupuesto solo no dice nada hasta que lo comparas con lo que te queda por copia. Al precio de tu juego réstale la comisión de la tienda, la parte del publisher si hay, y los descuentos, impuestos y devoluciones. Divide el presupuesto entre eso.",
          "La [calculadora](../presupuesto.html) hace esa división con tus números y se guarda solo en tu navegador."],
         ["The budget alone says nothing until you compare it with what you keep per copy. From your game's price subtract the store's cut, the publisher's share if there is one, and discounts, taxes and refunds. Divide the budget by that.",
          "The [calculator](../presupuesto.html) does that division with your numbers and saves only in your browser."]),
      ]),
    ]),
    ("ejemplo", "Un ejemplo para ver la cuenta", "An example to see the math", [
      ("nota", "Los números de este ejemplo son inventados para enseñar la operación. No son sueldos de referencia ni una predicción de ventas.", "The numbers in this example are made up to show the operation. They are not reference salaries or a sales forecast."),
      ("ul", [
        ("Equipo: 2 personas por 12 meses, cada una con 1,000 dólares al mes. Son 24,000 dólares.", "Team: 2 people for 12 months, each at 1,000 dollars a month. That is 24,000 dollars."),
        ("Otros gastos: 100 dólares de la cuota de Steam más 1,900 de música y tráiler por encargo. Son 2,000 dólares.", "Other costs: 100 dollars for the Steam fee plus 1,900 for commissioned music and a trailer. That is 2,000 dollars."),
        ("Colchón de 20% sobre 26,000: 5,200 dólares. Presupuesto total: 31,200 dólares.", "A 20% cushion on 26,000: 5,200 dollars. Total budget: 31,200 dollars."),
        ("Venta: precio de 10 dólares, 20% menos por descuentos, impuestos y devoluciones, y 30% de comisión de tienda. Quedan 5.60 dólares por copia.", "Sales: a 10-dollar price, 20% off for discounts, taxes and refunds, and a 30% store cut. You keep 5.60 dollars per copy."),
        ("31,200 entre 5.60 da 5,572 copias para recuperar el juego.", "31,200 divided by 5.60 gives 5,572 copies to earn the game back."),
      ]),
      ("p", "En este ejemplo, las cuotas y licencias con precio público suman 100 dólares de 31,200. El resto es tiempo de personas, y por eso los dos números que más mueven el resultado son los meses y el tamaño del equipo.",
            "In this example, the fees and licenses with a public price add up to 100 dollars out of 31,200. The rest is people's time, which is why the two numbers that move the result the most are the months and the size of the team."),
    ]),
    ("costos", "Lo que sí tiene precio público", "What does have a public price", [
      ("datos", [
        ("Steam: cuota por juego", "Steam: fee per game", "100 dólares. Regresa cuando el juego pasa de 1,000 dólares de ingreso bruto ajustado.", "100 dollars. It comes back once the game passes 1,000 dollars in adjusted gross revenue.", "Steamworks", D_FEE),
        ("Epic Games Store: cuota por juego", "Epic Games Store: fee per game", "100 dólares, recuperables. Epic no cobra comisión sobre el primer millón de dólares de ingreso neto por producto al año. Después se queda 12%.", "100 dollars, recoupable. Epic takes no cut on the first million dollars of net revenue per product per year. After that it keeps 12%.", "Epic Games Store", EPIC_DIST),
        ("itch.io: subir y vender", "itch.io: uploading and selling", "Gratis. Tú eliges qué porcentaje de tus ventas le dejas a itch.io, de 0% a 100%. Viene en 10%. El procesador de pago cobra aparte, en la mayoría de los casos 0.30 dólares más 2.9% por venta.", "Free. You choose what percentage of your sales goes to itch.io, from 0% to 100%. It starts at 10%. The payment processor charges separately, in most cases 0.30 dollars plus 2.9% per sale.", "itch.io", ITCH_PAY),
        ("Google Play: cuenta de desarrollador", "Google Play: developer account", "25 dólares, una sola vez. Las cuentas personales nuevas tienen que cumplir requisitos de prueba antes de publicar.", "25 dollars, one time. New personal accounts must meet testing requirements before publishing.", "Play Console", GP_ALTA),
        ("Google Play: comisión", "Google Play: service fee", "15% sobre el primer millón de dólares al año si te inscribes en ese nivel, y 30% arriba de eso.", "15% on the first million dollars per year if you enroll in that tier, and 30% above it.", "Play Console", GP_FEES),
        ("Apple: programa de desarrolladores", "Apple: developer program", "99 dólares al año.", "99 dollars per year.", "Apple Developer", APPLE_PROG),
        ("Apple: comisión reducida", "Apple: reduced commission", "15% si te inscribes al App Store Small Business Program, para quienes ganan hasta un millón de dólares al año.", "15% if you enroll in the App Store Small Business Program, for those earning up to one million dollars a year.", "Apple Developer", APPLE_SBP),
        ("Godot", "Godot", "Gratis, licencia MIT, sin regalías.", "Free, MIT license, no royalties.", "Godot Engine", GODOT_LIC),
        ("Unity", "Unity", "Personal: gratis con menos de 200,000 dólares de ingresos o fondos en 12 meses. Pro: desde 2,310 dólares al año.", "Personal: free under 200,000 dollars in revenue or funding over 12 months. Pro: from 2,310 dollars a year.", "Unity", UNITY_PLANS),
        ("Unreal Engine", "Unreal Engine", "Gratis para hacer juegos. 5% de regalía sobre el ingreso bruto del juego arriba de un millón de dólares. Lo vendido en Epic Games Store no paga regalía.", "Free for making games. A 5% royalty on the game's gross revenue above one million dollars. Sales on the Epic Games Store pay no royalty.", "Unreal Engine", UE_LIC),
        ("GameMaker", "GameMaker", "Gratis para uso no comercial. Professional: 99.99 dólares, pago único. Consolas: suscripción Enterprise.", "Free for non-commercial use. Professional: 99.99 dollars, one-time. Consoles: Enterprise subscription.", "GameMaker", GM_GET),
        ("FMOD (audio)", "FMOD (audio)", "Gratis con menos de 200,000 dólares de ingreso al año y presupuesto menor a 600,000. Si no, 2,000 dólares por juego en el nivel indie.", "Free under 200,000 dollars of revenue per year and a budget under 600,000. Otherwise 2,000 dollars per game at the indie tier.", "FMOD", FMOD_LIC),
      ]),
    ]),
    ("sin-precio", "Lo que no tiene precio público", "What has no public price", [
      ("ul", [
        ("**Sueldos.** No hay una fuente pública con fecha y método para Latinoamérica que podamos enlazar. Si conoces una, mándala y la revisamos.", "**Salaries.** There is no public source with a date and a method for Latin America that we can link. If you know one, send it and we will review it."),
        (f"**Kits de desarrollo de consola.** Registrarte en el portal de desarrolladores de Nintendo y bajar las herramientas es gratis. El costo del hardware de desarrollo solo se ve dentro del portal ([preguntas frecuentes de Nintendo]({NIN_FAQ})). Cuenta con un gasto ahí y pregunta antes de prometer una versión de consola.", f"**Console development kits.** Signing up for the Nintendo Developer Portal and downloading the tools is free. The cost of development hardware is only shown inside the portal ([Nintendo FAQ]({NIN_FAQ})). Expect a cost there and ask before you promise a console version."),
        (f"**La comisión base de Steam.** La documentación abierta no la dice: viene en el Acuerdo de Distribución que firmas. Lo que Valve sí publicó en 2018 es que la comisión baja a 25% sobre lo que un juego gane arriba de 10 millones de dólares y a 20% arriba de 50 millones ([anuncio de Steamworks]({D_SHARE})). La calculadora trae 30% de entrada. Cámbialo por el de tu contrato.", f"**Steam's base cut.** The open documentation does not state it: it is in the Distribution Agreement you sign. What Valve did publish in 2018 is that the cut drops to 25% on what a game earns above 10 million dollars and to 20% above 50 million ([Steamworks announcement]({D_SHARE})). The calculator starts at 30%. Change it to the one in your agreement."),
        ("**Música, localización, tráiler, legal y contabilidad.** Dependen de quién lo haga y de cuánto pidas. Se resuelven con cotizaciones.", "**Music, localization, a trailer, legal and accounting.** They depend on who does the work and how much you ask for. Quotes settle them."),
      ]),
    ]),
    ("impuestos", "Lo que te descuentan antes de cobrar", "What gets taken out before you are paid", [
      ("nota", "Esto no es asesoría fiscal ni legal. Aquí solo está lo que dicen las tiendas en sus páginas. Tu caso lo ve tu contador.", "This is not tax or legal advice. This only repeats what the stores say on their pages. Your case is for your accountant."),
      ("p", f"Las tiendas de Estados Unidos retienen impuesto a quienes cobran desde otro país. En itch.io, si cobras con su sistema de pagos acumulados, la retención es de 30% y puede bajar si tu país tiene tratado fiscal con Estados Unidos y das tu número de identificación fiscal ([pagos en itch.io]({ITCH_PAY})). En Steam funciona parecido y lo explicamos en [la guía de Steam desde México]({G_STEAM_MX}#impuestos).",
            f"US stores withhold tax from people who get paid from another country. On itch.io, if you use its collected payouts, the withholding is 30% and can go down if your country has a tax treaty with the United States and you provide your tax identification number ([itch.io payments]({ITCH_PAY})). Steam works in a similar way and we explain it in [the Steam from Mexico guide]({G_STEAM_MX}#impuestos)."),
      ("p", "Para el presupuesto, esto va en la casilla de impuestos, descuentos y devoluciones de la calculadora. No la dejes en cero.",
            "For the budget, this goes in the calculator's taxes, discounts and refunds field. Do not leave it at zero."),
    ]),
    ("errores", "Errores comunes", "Common mistakes", [
      ("p", "Casi todos salen de la letra chica de las licencias y cuotas de arriba.", "Almost all of them come from the fine print of the licenses and fees above."),
      ("ul", [
        ("**Dejar tu tiempo en cero.** El presupuesto sale chico y el número de copias, también.", "**Leaving your own time at zero.** The budget comes out small, and so does the number of copies."),
        ("**Creer que Unity Personal no tiene tope.** El límite de 200,000 dólares cuenta ingresos y también fondos levantados. Un premio o un adelanto grande puede pasarte a Pro.", "**Assuming Unity Personal has no cap.** The 200,000-dollar limit counts revenue and also funds raised. A big prize or advance can move you to Pro."),
        ("**Vender un juego hecho con la licencia gratis de GameMaker.** Esa licencia es no comercial.", "**Selling a game made with GameMaker's free license.** That license is non-commercial."),
        ("**Anotar la cuota de Apple una sola vez.** Son 99 dólares cada año.", "**Writing down Apple's fee only once.** It is 99 dollars every year."),
        ("**Presupuestar en pesos lo que se cobra en dólares** y no anotar el tipo de cambio ni la fecha.", "**Budgeting in pesos for what is charged in dollars** without noting the exchange rate or the date."),
        ("**Calcular las copias a precio completo,** sin comisión, descuentos ni retención.", "**Counting copies at full price,** with no store cut, discounts or withholding."),
        ("**Usar el rango de un artículo como si fuera tu presupuesto.** Si no dice de dónde sale ni de qué año es, no te sirve para decidir.", "**Using a range from an article as if it were your budget.** If it does not say where it comes from or what year it is from, it cannot help you decide."),
        ("**Prometer versión de consola sin saber cuánto cuesta el kit.** Ese precio solo lo ves ya registrado.", "**Promising a console version without knowing what the kit costs.** You only see that price once you are registered."),
      ]),
    ]),
  ],
  "sig_es": "Abre la calculadora y pon tus números: equipo, meses, gastos y precio. En diez minutos tienes tu presupuesto y cuántas copias necesitas vender. Si el número asusta, recorta meses o alcance y vuelve a ver.",
  "sig_en": "Open the calculator and enter your numbers: team, months, costs and price. In ten minutes you have your budget and how many copies you need to sell. If the number is scary, cut months or scope and look again.",
  "siguiente": [("../presupuesto.html", "Abrir la calculadora", "Open the calculator"), ("../convocatorias.html", "Fondos y convocatorias", "Funds and open calls"), ("../kit.html", "Kit de arranque", "Starter kit"), ("./", "Más guías", "More guides")],
  "fuentes": [
    ("Steamworks: cuota de Steam Direct", "Steamworks: Steam Direct fee", D_FEE),
    ("Steamworks: anuncio de niveles de reparto de ingresos (30 de noviembre de 2018)", "Steamworks: revenue share tiers announcement (November 30, 2018)", D_SHARE),
    ("Epic Games Store: distribución, cuota y reparto", "Epic Games Store: distribution, fee and revenue share", EPIC_DIST),
    ("itch.io: preguntas frecuentes para creadores", "itch.io: creator FAQ", ITCH_FAQ),
    ("itch.io: pagos, reparto abierto y retención", "itch.io: payments, open revenue sharing and withholding", ITCH_PAY),
    ("Google Play Console: alta y cuota de registro", "Google Play Console: signup and registration fee", GP_ALTA),
    ("Google Play Console: comisiones de servicio", "Google Play Console: service fees", GP_FEES),
    ("Apple Developer Program: membresía anual", "Apple Developer Program: annual membership", APPLE_PROG),
    ("Apple: App Store Small Business Program", "Apple: App Store Small Business Program", APPLE_SBP),
    ("Godot Engine: licencia", "Godot Engine: license", GODOT_LIC),
    ("Unity: planes y precios", "Unity: plans and pricing", UNITY_PLANS),
    ("Unreal Engine: opciones de licencia", "Unreal Engine: licensing options", UE_LIC),
    ("GameMaker: licencias de exportación", "GameMaker: export licences", GM_GET),
    ("FMOD: licencias", "FMOD: licensing", FMOD_LIC),
    ("Nintendo Developer Portal: preguntas frecuentes", "Nintendo Developer Portal: FAQ", NIN_FAQ),
    ("Banco de México: tipo de cambio", "Banco de México: exchange rate", BANXICO),
  ],
})
