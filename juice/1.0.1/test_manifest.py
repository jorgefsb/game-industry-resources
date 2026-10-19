#!/usr/bin/env python3
"""Fail if juice/1.0.1 files are not the byte copies recorded in manifest.json."""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "manifest.json"
FILES = ("juice.css", "juice.js", "juice-menu.css", "juice-menu.js")


def main() -> int:
    if (ROOT / "MANIFEST.json").exists():
        print("FAIL: use manifest.json (lowercase), not MANIFEST.json", file=sys.stderr)
        return 1
    if not MANIFEST.is_file():
        print("FAIL: missing manifest.json", file=sys.stderr)
        return 1
    meta = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if meta.get("version") != ROOT.name:
        print(
            f"FAIL: manifest version {meta.get('version')} != folder {ROOT.name}",
            file=sys.stderr,
        )
        return 1
    files = meta.get("files") or {}
    for name in FILES:
        path = ROOT / name
        expected = str((files.get(name) or {}).get("sha256") or "").lower()
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != expected:
            print(f"FAIL: {name} sha256 {actual} != manifest {expected}", file=sys.stderr)
            return 1
    print("OK: juice/1.0.1 matches manifest sha256")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
