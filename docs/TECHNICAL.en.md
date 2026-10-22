[Español](TECHNICAL.md) | [English](TECHNICAL.en.md)

# Technical guide

Base: `main` `a7076dfd527ba04771d41a8d4773eae964f4a01c`.

```bash
git clone https://github.com/jorgefsb/game-industry-resources.git
cd game-industry-resources
python3 -m http.server 3000 --bind 127.0.0.1
```

Open http://127.0.0.1:3000 . Stop with Ctrl+C. No build needed for browsing; do not start a Worker or submit forms when testing documentation.

```bash
npm test
```

Tests use Node and some require Playwright/Chromium. Read the report; do not change code or tests to conceal failures. [Results](../reports/test-output.txt). [Verification](../reports/docs-brandkit-verification.json).

Worker and API are not part of the static server; do not certify forms or payments.
