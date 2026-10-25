#!/usr/bin/env python3
"""Scout DeVuego. Baja activos y cerrados. No inventa ventas. No publica solo."""
import json, re, subprocess, time
from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "devuego" / "estudios.json"
LETTERS = ["0"] + [chr(c) for c in range(ord("A"), ord("Z") + 1)]

def textify(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", unescape(s)).strip()

def fetch(url):
    r = subprocess.run(
        ["curl", "-fsSL", "-m", "30", "-A", "PapacitoOS-gamedev-scout/1.0", url],
        check=True, capture_output=True,
    )
    time.sleep(0.3)
    return r.stdout.decode("utf-8", "replace")

def parse(html, active):
    rows = []
    for row in re.findall(r"<tr[\s\S]*?</tr>", html):
        if "enlaceestudio" not in row:
            continue
        m = re.search(r'href="(/festudio/[^"]+)"[^>]*>([\s\S]*?)</a>', row)
        if not m:
            continue
        flag = re.search(r'flag-icon[^>]*title="([^"]+)"', row)
        rows.append({
            "name": textify(m.group(2)),
            "slug": m.group(1).rsplit("/", 1)[-1],
            "url": "https://devuego.lat" + m.group(1),
            "country": flag.group(1) if flag else "",
            "active": active,
            "company": "Es una empresa" in row,
            "source": "https://devuego.lat/estudios",
        })
    return rows

def main():
    by = {}
    for let in LETTERS:
        for active, path in ((True, ""), (False, "/cerrados")):
            html = fetch(f"https://devuego.lat/estudios/letra/{let}{path}")
            for row in parse(html, active):
                by[row["slug"]] = row
            print(let, "activo" if active else "cerrado", flush=True)
    studios = list(by.values())
    payload = {
        "source": "https://devuego.lat/",
        "note": "Vivo o cerrado es la marca de DeVuego. No es utilidad ni un blanco de compra.",
        "counts": {
            "studios": len(studios),
            "active": sum(1 for s in studios if s["active"]),
            "inactive": sum(1 for s in studios if not s["active"]),
        },
        "studios": studios,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False))
    print(payload["counts"])

if __name__ == "__main__":
    main()
