# juice 1.0.2 tests

`paper.test.mjs` fails if `#F4E8D5` appears as a CSS `color` (direct or `var(--x,#F4E8D5)`) in the four published 1.0.2 files. `manifest.test.mjs` hashes those four files against each pack's `manifest.json` (1.0.0 uses the legacy pin; it has no sidecar). `pin.test.mjs` locks 1.0.0 and 1.0.1 hashes.

```
npm run test:install
npm test
```
