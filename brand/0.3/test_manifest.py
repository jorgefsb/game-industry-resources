#!/usr/bin/env python3
"""Fail if brand/0.3/tokens.css is not the byte copy recorded in manifest.json."""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "manifest.json"
TOKENS = ROOT / "tokens.css"


def main() -> int:
    if (ROOT / "MANIFEST.json").exists():
        print("FAIL: use manifest.json (lowercase), not MANIFEST.json", file=sys.stderr)
        return 1
    if not MANIFEST.is_file():
        print("FAIL: missing manifest.json", file=sys.stderr)
        return 1
    meta = json.loads(MANIFEST.read_text(encoding="utf-8"))
    expected = str(meta.get("sha256") or "").lower()
    actual = hashlib.sha256(TOKENS.read_bytes()).hexdigest()
    if actual != expected:
        print(
            f"FAIL: {TOKENS.name} sha256 {actual} != manifest {expected}",
            file=sys.stderr,
        )
        return 1
    if meta.get("version") != ROOT.name:
        print(
            f"FAIL: manifest version {meta.get('version')} != folder {ROOT.name}",
            file=sys.stderr,
        )
        return 1
    source = meta.get("source") or ""
    if "brand-kit-0.3/tokens.css" not in source:
        print("FAIL: manifest source is not brand-kit-0.3/tokens.css", file=sys.stderr)
        return 1
    print(f"OK: {TOKENS} matches sha256 {actual}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
