#!/usr/bin/env python3
"""Validate the /ia catalog and regenerate llms.txt from tools.json."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FORBIDDEN = re.compile(
    r"amber\s*studio|mexican\s*ninja|sparkplug|tecni\s*moto|\barden\b",
    re.I,
)
NEEDED = ("name", "url", "category", "description")


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    data = json.loads((ROOT / "tools.json").read_text(encoding="utf-8"))
    tools = data.get("tools") or []
    cats = {c["id"] for c in data.get("categories") or []}
    if not 25 <= len(tools) <= 40:
        fail(f"need 25–40 tools, got {len(tools)}")
    ids = set()
    for tool in tools:
        for key in NEEDED:
            if key not in tool:
                fail(f"{tool.get('id')} missing {key}")
        if tool["id"] in ids:
            fail(f"duplicate id {tool['id']}")
        ids.add(tool["id"])
        if tool["category"] not in cats:
            fail(f"{tool['id']} bad category {tool['category']}")
        if not tool["url"].startswith("https://"):
            fail(f"{tool['id']} url must be https")
        desc = tool["description"]
        if not desc.get("es") or not desc.get("en"):
            fail(f"{tool['id']} needs es+en description")
        if "pricing" in tool and not tool.get("pricingSource"):
            fail(f"{tool['id']} pricing without source")
        blob = json.dumps(tool, ensure_ascii=False)
        if FORBIDDEN.search(blob):
            fail(f"{tool['id']} contains a forbidden brand")

    pages = [
        ROOT / "index.html",
        ROOT / "patrocina" / "index.html",
        ROOT / "ia.css",
        ROOT / "ia.js",
        ROOT / "tokens.css",
        ROOT / "assets" / "moki-parche-derecho.png",
        ROOT / "assets" / "moki-ia-leccion.webp",
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
        "",
    ]
    by_cat = {c["id"]: [] for c in data["categories"]}
    for tool in tools:
        by_cat[tool["category"]].append(tool)
    for cat in data["categories"]:
        lines.append(f"## {cat['es']} / {cat['en']}")
        for tool in by_cat[cat["id"]]:
            price = f" [{tool['pricing']}]" if tool.get("pricing") else ""
            lines.append(f"- {tool['name']}{price}: {tool['description']['es']} — {tool['url']}")
        lines.append("")
    lines.append("## Destacados / Featured")
    lines.append("- Slot empty. Makers can request a featured listing at /ia/patrocina/")
    lines.append("")
    (ROOT / "llms.txt").write_text("\n".join(lines), encoding="utf-8")
    print(f"OK: {len(tools)} tools, llms.txt written")


if __name__ == "__main__":
    main()
