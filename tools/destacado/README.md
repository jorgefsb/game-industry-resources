# Destacado USD 49: qué pasa después del pago

Dueño ops: Gary (NA1). Gate de merge y deploy: Tron. Sí de Jorge para publicar.
SLA: el Destacado sale arriba del directorio en 24 h o menos desde el cargo confirmado en Stripe.

Esta carpeta vive en `tools/`, que `.assetsignore` deja fuera del sitio publicado.

## Flujo (ops manual, sin webhook)

1. Stripe confirma el cargo del Payment Link de Destacado (dashboard o recibo de Stripe a la cuenta JorgeSuarez.com.mx). Sin cargo confirmado no se hace nada.
2. Cruza el cargo con la solicitud del formulario de /ia/patrocina/ en KV `ia-newsletter`, llave `featured:<host>:<correo>` (nombre, sitio, correo).
3. Si la herramienta no está en `ia/tools.json`, agrégala con su descripción ES y EN (mismas reglas que el resto: https, sin marcas prohibidas).
4. Corre `python3 tools/destacado/destacar.py <tool-id>`. Solo agrega el id a `featured` y corre `ia/build.py`.
5. PR draft con el cambio. Tron da el sí y despliega (merge no despliega, ver upload-session en el README del proyecto).
6. Manda el texto de `email-pagaste.md` desde el correo de Jorge con el sí de canal. Ningún script de aquí manda correos.
7. Anota el cobro en `state/wario-cobrado` (Wario) y la hora de salida al aire, para medir el SLA.

## Cancelación o rollback

- Cancela el cliente o hay que quitarlo: `python3 tools/destacado/destacar.py <tool-id> --quitar`, PR, deploy con sí de Tron.
- Rollback del código: revertir el commit de esta rama. Con `featured` vacío el sitio queda igual que hoy (verificado: build sin diff).
- Nunca vaciar `featured` en vivo para "probar". Se prueba en local y se regresa con `--quitar`.

## Qué no hace

- No toca Stripe (ni llaves, ni Payment Link, ni success_url, ni webhooks).
- No manda correos ni despliega.
- Webhook automático: siguiente paso solo si el volumen pasa de lo que el SLA manual aguanta. Requiere secreto de webhook de Stripe y sí de Jorge.
