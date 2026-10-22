[Español](TECHNICAL.md) | [English](TECHNICAL.en.md)

# Guía técnica

Base: `main` `a7076dfd527ba04771d41a8d4773eae964f4a01c`.

```bash
git clone https://github.com/jorgefsb/game-industry-resources.git
cd game-industry-resources
python3 -m http.server 3000 --bind 127.0.0.1
```

Abre http://127.0.0.1:3000 . Detén con Ctrl+C. Sin build para navegar; no inicies Worker, no uses formularios para probar la documentación.

```bash
npm test
```

Las pruebas usan Node y algunas requieren Playwright/Chromium. Consulta el reporte; no cambiar código ni tests para ocultar fallos. [Resultados](../reports/test-output.txt). [Verificación](../reports/docs-brandkit-verification.json).

Worker y API no forman parte del servidor estático; no certificar formularios ni pagos.
