# juice 1.0.1 tests

Outside the published package. Chromium is required: a missing browser fails the suite (no skip).

```
npm run test:install
npm test
```

`test:install` runs `npx playwright install chromium`. `browser.mjs` then finds `CHROME_PATH`, Playwright's bundled Chromium (`playwright.chromium.executablePath()`), or the usual Linux/macOS paths (`/Applications/Google Chrome.app/...`, `/Applications/Chromium.app/...`, `~/Library/Caches/ms-playwright/...`).
