/*
 * game-industry-resources Worker.
 * Static assets are served first by Cloudflare (assets binding). This script only runs for
 * requests that match no asset. It handles two form endpoints for /ia and passes everything
 * else to the assets binding, so the rest of the site behaves exactly as before.
 *
 *   POST /ia/api/subscribe  { email, lang, company(honeypot) }            -> KV key: <email>
 *   POST /ia/api/featured   { name, site, email, lang, company(honeypot) } -> KV key: featured:<host>:<email>
 *   POST /ia/api/submit     { name, site, email, lang, company(honeypot) } -> KV key: submit:<host>:<email>
 *
 * /ia/llms.txt and /ia/tools.json run through the Worker first (assets run_worker_first) to add charset=utf-8.
 *
 * KV binding IA_KV = namespace "ia-newsletter". Nothing is emailed or sent anywhere.
 * Rate limit: 5 submissions per IP per hour (KV counter "rl:<ip>:<hour>" with TTL).
 */
const MAX_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) return null;
  const text = await request.text();
  if (text.length > 4096) return null;
  try {
    const data = JSON.parse(text);
    return data && typeof data === 'object' ? data : null;
  } catch (_) {
    return null;
  }
}

async function rateLimited(env, request) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  const key = `rl:${ip}:${hour}`;
  const count = parseInt((await env.IA_KV.get(key)) || '0', 10);
  if (count >= MAX_PER_HOUR) return true;
  await env.IA_KV.put(key, String(count + 1), { expirationTtl: 3700 });
  return false;
}

function cleanEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}

function cleanSite(value) {
  let raw = String(value || '').trim();
  if (!raw || raw.length > 200) return null;
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  try {
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes('.')) return null;
    return url;
  } catch (_) {
    return null;
  }
}

async function handleForm(kind, request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  if (!env.IA_KV) return json({ ok: false, error: 'unavailable' }, 503);
  const data = await readBody(request);
  if (!data) return json({ ok: false, error: 'body' }, 400);
  if (await rateLimited(env, request)) return json({ ok: false, error: 'rate' }, 429);
  if (String(data.company || '').length > 0) return json({ ok: false, error: 'rejected' }, 400);

  const lang = data.lang === 'en' ? 'en' : 'es';
  const email = cleanEmail(data.email);
  if (!email) return json({ ok: false, error: 'email' }, 400);
  const ts = new Date().toISOString();

  if (kind === 'subscribe') {
    const existing = await env.IA_KV.get(email);
    if (!existing) await env.IA_KV.put(email, JSON.stringify({ ts, lang }));
    return json({ ok: true });
  }

  const name = String(data.name || '').trim().replace(/\s+/g, ' ');
  if (!name || name.length > 80) return json({ ok: false, error: 'name' }, 400);
  const site = cleanSite(data.site);
  if (!site) return json({ ok: false, error: 'site' }, 400);
  const key = `${kind}:${site.hostname.toLowerCase()}:${email}`;
  await env.IA_KV.put(key, JSON.stringify({ ts, lang, name, site: site.href, email }));
  return json({ ok: true });
}

const META_EN = {
  home: {
    title: 'AI tools for making video games | Jorge Suárez directory',
    desc: 'The AI tools that actually help you make your game: art, code, audio, voices, 3D, localization and marketing. Free to browse.',
    ogTitle: 'The AI tools that actually help you make your game',
    ogDesc: 'AI tools for game art, code, audio and design. Free to browse.',
  },
  sponsor: {
    title: 'Feature your AI tool to game devs | Jorge Suárez',
    desc: 'Put your AI tool at the top of the directory for Latin American game devs. With your logo and one line. USD 49 a month. Cancel anytime.',
    ogTitle: 'Put your tool in front of Latin American game devs',
    ogDesc: 'At the top, with your logo and one line. USD 49 a month. Cancel anytime.',
  },
};

/* English meta tags for ?lang=en, so crawlers that do not run JavaScript see English text. */
function englishMeta(response, m) {
  const type = response.headers.get('content-type') || '';
  if (!response.ok || !type.includes('text/html')) return response;
  const set = (v) => ({ element(el) { el.setAttribute('content', v); } });
  return new HTMLRewriter()
    .on('html', { element(el) { el.setAttribute('lang', 'en'); } })
    .on('title', { element(el) { el.setInnerContent(m.title); } })
    .on('meta[name="description"]', set(m.desc))
    .on('meta[name="twitter:description"]', set(m.desc))
    .on('meta[property="og:description"]', set(m.ogDesc))
    .on('meta[property="og:title"]', set(m.ogTitle))
    .on('meta[name="twitter:title"]', set(m.ogTitle))
    .on('meta[property="og:locale"]', set('en_US'))
    .on('meta[property="og:locale:alternate"]', set('es_MX'))
    .transform(response);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (pathname === '/ia/api/subscribe') return handleForm('subscribe', request, env);
    if (pathname === '/ia/api/featured') return handleForm('featured', request, env);
    if (pathname === '/ia/api/submit') return handleForm('submit', request, env);
    if (pathname === '/tools.json') {
      return Response.redirect(new URL('/ia/tools.json', request.url).toString(), 301);
    }
    const response = await env.ASSETS.fetch(request);
    if ((pathname === '/ia/' || pathname === '/ia/patrocina/') && url.searchParams.get('lang') === 'en') {
      return englishMeta(response, pathname === '/ia/patrocina/' ? META_EN.sponsor : META_EN.home);
    }
    if (pathname === '/ia/llms.txt' || pathname === '/ia/tools.json') {
      const type = response.headers.get('content-type') || '';
      if (type && !/charset=/i.test(type)) {
        const headers = new Headers(response.headers);
        headers.set('content-type', type + '; charset=utf-8');
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
      }
    }
    return response;
  }
};
