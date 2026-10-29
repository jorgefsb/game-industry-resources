#!/usr/bin/env python3
"""Validate the /ia catalog and regenerate llms.txt from tools.json."""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
FORBIDDEN = re.compile(
    r"amber\s*studio|mexican\s*ninja|sparkplug|tecni\s*moto|\barden\b",
    re.I,
)
NEEDED = ("name", "url", "category", "description")
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
AFF_ES = "Liga de afiliado: si compras, Game Resources gana una comisión sin costo extra para ti."
AFF_EN = "Affiliate link: if you buy, Game Resources earns a commission at no extra cost to you."


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def require_https(value: str, field: str, tool_id: str) -> None:
    if not value.startswith("https://") or len(value) > 500:
        fail(f"{tool_id} {field} must be https and under 500 chars")
    try:
        parsed = urlparse(value)
    except ValueError:
        fail(f"{tool_id} {field} is not a URL")
    if parsed.scheme != "https" or not parsed.hostname or "." not in parsed.hostname:
        fail(f"{tool_id} {field} must be a valid https URL")


def main() -> None:
    data = json.loads((ROOT / "tools.json").read_text(encoding="utf-8"))
    tools = data.get("tools") or []
    cats = {c["id"] for c in data.get("categories") or []}
    if not 25 <= len(tools) <= 60:
        fail(f"need 25–60 tools, got {len(tools)}")
    ids = set()
    for tool in tools:
        for key in NEEDED:
            if key not in tool:
                fail(f"{tool.get('id')} missing {key}")
        if not ID_RE.fullmatch(str(tool["id"])):
            fail(f"{tool.get('id')} id must be a lowercase slug")
        if tool["id"] in ids:
            fail(f"duplicate id {tool['id']}")
        ids.add(tool["id"])
        if tool["category"] not in cats:
            fail(f"{tool['id']} bad category {tool['category']}")
        require_https(tool["url"], "url", tool["id"])
        if "affiliate" in tool:
            require_https(tool["affiliate"], "affiliate", tool["id"])
        desc = tool["description"]
        if not desc.get("es") or not desc.get("en"):
            fail(f"{tool['id']} needs es+en description")
        if tool.get("logo") and not (ROOT / tool["logo"]).exists():
            fail(f"{tool['id']} logo file missing: {tool['logo']}")
        if "pricing" in tool and not (tool.get("pricing_source", "").startswith("https://") and tool.get("pricing_checked")):
            fail(f"{tool['id']} pricing without pricing_source/pricing_checked")
        blob = json.dumps(tool, ensure_ascii=False)
        if FORBIDDEN.search(blob):
            fail(f"{tool['id']} contains a forbidden brand")
    for fid in data.get("featured") or []:
        if fid not in ids:
            fail(f"featured id {fid} is not in tools")

    pages = [
        ROOT / "index.html",
        ROOT / "patrocina" / "index.html",
        ROOT / "ia.css",
        ROOT / "ia.js",
        ROOT / "tokens.css",
        ROOT / "assets" / "moki-parche-derecho.png",
        ROOT / "assets" / "moki-parche-derecho.webp",
        ROOT / "fonts" / "outfit-700.woff2",
        ROOT / "fonts" / "inter-400.woff2",
                ROOT / "assets" / "jorgesuarez-wordmark-a.svg",
    ]
    for path in pages:
        if not path.exists():
            fail(f"missing {path.name}")
        if path.suffix in {".html", ".css", ".js", ".txt"}:
            text = path.read_text(encoding="utf-8", errors="ignore")
            if FORBIDDEN.search(text):
                fail(f"forbidden brand in {path}")

    lines = [
        "# Directorio de IA para indie game developers",
        f"# {data['url']}",
        f"# Machine-readable JSON: {data['json']}",
        f"# Updated: {data['updated']}",
        "# Language: Spanish first, English in tools.json",
        "# Pricing is included only when verified on the official site.",
        "# Afiliados: si compras por una liga de afiliado del directorio (hoy Meshy), Game Resources gana una comisión sin costo extra para ti. Las URLs de abajo son las oficiales.",
        "",
    ]
    by_cat = {c["id"]: [] for c in data["categories"]}
    for tool in tools:
        by_cat[tool["category"]].append(tool)
    for cat in data["categories"]:
        lines.append(f"## {cat['es']} / {cat['en']}")
        for tool in by_cat[cat["id"]]:
            price = f" [{tool['pricing']}]" if tool.get("pricing") else ""
            lines.append(f"- {tool['name']}{price}: {tool['description']['es']} ({tool['url']})")
        lines.append("")
    lines.append("## Destacados / Featured")
    for tool in (t for t in tools if t["id"] in (data.get("featured") or [])):
        lines.append(f"- {tool['name']}: {tool['description']['es']} ({tool['url']})")
    lines.append("- Featured slot open. Makers can request it at https://gamedev.jorgesuarez.com.mx/ia/patrocina/ (USD 49 per month, cancel anytime).")
    lines.append("")
    (ROOT / "llms.txt").write_text("\n".join(lines), encoding="utf-8")
    render_index(data)
    print(f"OK: {len(tools)} tools, llms.txt written, index.html catalog + JSON-LD rendered")


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def aff_note(tool: dict) -> str:
    if not tool.get("affiliate"):
        return ""
    return (
        f'<p class="ia-card__aff" data-es="{esc(AFF_ES)}" data-en="{esc(AFF_EN)}">{esc(AFF_ES)}</p>'
    )


def visit_anchor(tool: dict) -> str:
    rel = "sponsored noopener" if tool.get("affiliate") else "noopener"
    return (
        f'<a class="ia-card__link" href="/ia/go/{esc(tool["id"])}" data-href="{esc(tool["url"])}" '
        f'target="_blank" rel="{rel}">Sitio oficial '
        f'<span aria-hidden="true">↗</span><span class="sr-only"> {esc(tool["name"])} (abre en otra pestaña)</span></a>'
    )


def render_index(data: dict) -> None:
    """Pre-render the Spanish catalog and JSON-LD into index.html (SEO + no-JS). ia.js re-renders on load."""
    path = ROOT / "index.html"
    page = path.read_text(encoding="utf-8")
    labels = data.get("pricingLabels") or {}
    parts = []
    featured = data.get("featured") or []
    groups = [({"id": "destacados", "es": "Destacado"}, [t for t in data["tools"] if t["id"] in featured])]
    groups += [(cat, [t for t in data["tools"] if t["category"] == cat["id"]]) for cat in data["categories"]]
    for cat, tools in groups:
        if not tools:
            continue
        cards = []
        for t in tools:
            if t.get("logo"):
                logo = (f'<img class="ia-logo" src="{esc(t["logo"])}" width="40" height="40" loading="lazy" '
                        f'decoding="async" alt="Logo de {esc(t["name"])}">')
            else:
                logo = f'<span class="ia-logo ia-logo--tile" aria-hidden="true">{esc(t["name"][0])}</span>'
            price = ""
            if t.get("pricing") and t["pricing"] in labels:
                price = f'<span class="ia-tag">{esc(labels[t["pricing"]]["es"])}</span>'
            attrs = 'class="ia-card ia-card--featured"' if cat["id"] == "destacados" else f'class="ia-card" id="tool-{esc(t["id"])}"'
            cards.append(
                f'<article {attrs}><div class="ia-card__top">{logo}'
                f'<div><h3>{esc(t["name"])}</h3>{price}</div></div><p>{esc(t["description"]["es"])}</p>'
                f'{aff_note(t)}{visit_anchor(t)}</article>'
            )
        collapsible = len(tools) > 3
        more = ""
        if collapsible:
            more = (f'<button type="button" class="btn btn--ghost ia-more" data-more="{esc(cat["id"])}" aria-expanded="false" '
                    f'aria-controls="grid-{esc(cat["id"])}">Ver más ({len(tools) - 3})</button>')
        parts.append(
            f'<section class="ia-cat{" is-collapsed" if collapsible else ""}" id="{esc(cat["id"])}" aria-labelledby="cat-{esc(cat["id"])}">'
            f'<h3 class="ia-cat__title" id="cat-{esc(cat["id"])}">{esc(cat["es"])} <span>{len(tools)}</span></h3>'
            f'<div class="ia-grid" id="grid-{esc(cat["id"])}">{"".join(cards)}</div>{more}</section>'
        )
    sections = "\n".join(parts)
    page, n = re.subn(
        r'(<div class="ia-sections" id="ia-sections" data-ia-sections>).*?(</div><span hidden id="ia-sections-end"></span>)',
        lambda m: m.group(1) + "\n" + sections + "\n" + m.group(2),
        page,
        flags=re.S,
    )
    if n != 1:
        fail("index.html: catalog markers not found")
    app_cat = {
        "codigo": "DeveloperApplication",
        "sprites": "DesignApplication",
        "modelos3d": "DesignApplication",
        "animacion": "MultimediaApplication",
        "audio": "MultimediaApplication",
        "voces": "MultimediaApplication",
        "texturas": "DesignApplication",
        "traduccion": "BusinessApplication",
        "qa": "DeveloperApplication",
        "marketing": "MultimediaApplication",
    }
    ld = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Directorio de IA para indie game developers",
        "description": "Herramientas de IA para arte, código, audio y diseño de videojuegos. En español y gratis.",
        "url": data["url"],
        "dateModified": data["updated"],
        "numberOfItems": len(data["tools"]),
        "inLanguage": ["es", "en"],
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "item": {
                    "@type": "SoftwareApplication",
                    "name": t["name"],
                    "url": t["url"],
                    "description": t["description"]["es"],
                    "applicationCategory": app_cat[t["category"]],
                },
            }
            for i, t in enumerate(data["tools"])
        ],
    }
    ld_json = json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")
    page, n = re.subn(
        r'(<script type="application/ld\+json" id="ia-jsonld">).*?(</script>)',
        lambda m: m.group(1) + ld_json + m.group(2),
        page,
        flags=re.S,
    )
    if n != 1:
        fail("index.html: JSON-LD block not found")
    page, n = re.subn(
        r'<time datetime="[^"]*" data-ia-updated>[^<]*</time>',
        f'<time datetime="{esc(data["updated"])}" data-ia-updated>{esc(data["updated"])}</time>',
        page,
    )
    if n != 1:
        fail("index.html: data-ia-updated time element not found")
    ntools, ncats = len(data["tools"]), len(data["categories"])
    page = re.sub(r'data-n="\d+">\d+ herramientas', f'data-n="{ntools}">{ntools} herramientas', page)
    page = re.sub(r'(<strong data-ia-ntools>)\d+', rf'\g<1>{ntools}', page)
    page = re.sub(r'(<strong data-ia-ncats>)\d+', rf'\g<1>{ncats}', page)
    page = re.sub(r'(<p class="ia-count" data-ia-count aria-live="polite">)\d+', rf'\g<1>{ntools}', page)
    path.write_text(page, encoding="utf-8")


if __name__ == "__main__":
    main()
