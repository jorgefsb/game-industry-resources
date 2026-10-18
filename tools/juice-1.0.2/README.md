# juice 1.0.2 tests

`paper.test.mjs` fails if `#F4E8D5` appears as a CSS `color` in the four published 1.0.2 files. `pin.test.mjs` locks 1.0.0 and 1.0.1 hashes.

```
npm run test:install
npm test
```
