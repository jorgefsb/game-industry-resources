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
  "siguiente": [("../presupuesto.html", "Abrir la calculadora", "Open the calculator"), ("../kit.html", "Checklist de página de tienda", "Store page checklist"), ("../marketing.html", "Cómo vender tu juego", "How to sell your game"), ("./", "Más guías", "More guides")],
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
