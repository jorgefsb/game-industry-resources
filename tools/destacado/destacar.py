#!/usr/bin/env python3
"""Turn a paid Destacado on or off in ia/tools.json, then rebuild the /ia catalog.

Usage:
  python3 tools/destacado/destacar.py <tool-id>          # add to featured
  python3 tools/destacado/destacar.py <tool-id> --quitar # remove (cancel or rollback)

Only touches the "featured" list. No Stripe, no email, no deploy.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

IA = Path(__file__).resolve().parents[2] / "ia"


def main() -> None:
    args = sys.argv[1:]
    if not args or args[0].startswith("-"):
        sys.exit(__doc__)
    tool_id, quitar = args[0], "--quitar" in args[1:]
    path = IA / "tools.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    if tool_id not in {t["id"] for t in data["tools"]}:
        sys.exit(f"FAIL: {tool_id} no está en tools. Agrégala primero al catálogo.")
    featured = [f for f in data.get("featured") or [] if f != tool_id]
    if not quitar:
        featured.append(tool_id)
    data["featured"] = featured
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    subprocess.run([sys.executable, str(IA / "build.py")], check=True)
    print(f"featured = {featured}")


if __name__ == "__main__":
    main()
