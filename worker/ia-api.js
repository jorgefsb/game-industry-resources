/*
 * game-industry-resources Worker.
 * Static assets are served first by Cloudflare (assets binding). This script only runs for
 * requests that match no asset. It handles form endpoints and outbound click redirects for /ia
 * and passes everything else to the assets binding, so the rest of the site behaves as before.
 *
 *   POST /ia/api/subscribe  { email, lang, company(honeypot) }            -> KV key: <email>
 *   POST /ia/api/featured   { name, site, email, lang, company(honeypot) } -> KV key: featured:<host>:<email>
 *   POST /ia/api/submit     { name, site, email, lang, company(honeypot) } -> KV key: submit:<host>:<email>
 *   GET  /ia/go/<slug>      302 to the catalog outbound URL (affiliate if set, else official).
 *                           Allowlist is built from /ia/tools.json. Never an open redirect.
 *
 * /ia/llms.txt and /ia/tools.json run through the Worker first (assets run_worker_first) to add charset=utf-8.
 * If run_worker_first is a list of paths, also add /ia/go/* so the click counter is never skipped.
 *
 * KV binding IA_KV = namespace "ia-newsletter". Nothing is emailed or sent anywhere.
 * Click counters: clicks:<slug>:<YYYY-MM-DD> (UTC). Observability: {event:'outbound_click', slug}.
 * Rate limit: 5 form posts per hour. KV key rl:<16 hex SHA-256(IP_HASH_SALT:ip:YYYY-MM-DD)>:<hour>
 * with expirationTtl 3600. The IP is never written to KV or console.log.
 * If env.IP_HASH_SALT is missing, rate limit is skipped (forms still accept, /ia/go still 302).
 * Deploy: create Worker secret IP_HASH_SALT (wrangler secret put IP_HASH_SALT) before relying on the limiter.
 */
const MAX_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const GO_PATH_RE = /^\/ia\/go\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

function utcDay(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

async function rlToken(salt, ip, day) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${salt}:${ip}:${day}`)
  );
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function rateLimited(env, request) {
  const salt = env.IP_HASH_SALT;
  if (!salt) return false;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const hour = Math.floor(Date.now() / 3600000);
  let token;
  try {
    token = await rlToken(salt, ip, utcDay());
  } catch (_) {
    return false;
  }
  const key = `rl:${token}:${hour}`;
  const count = parseInt((await env.IA_KV.get(key)) || '0', 10);
  if (count >= MAX_PER_HOUR) return true;
  await env.IA_KV.put(key, String(count + 1), { expirationTtl: 3600 });
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

function httpsDest(value) {
  const raw = String(value || '').trim();
  if (!raw.startsWith('https://') || raw.length > 500) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || !url.hostname || !url.hostname.includes('.')) return null;
    return url.toString();
  } catch (_) {
    return null;
  }
}

async function catalogAllowlist(env, request) {
  if (!env.ASSETS) return null;
  const res = await env.ASSETS.fetch(new Request(new URL('/ia/tools.json', request.url), { method: 'GET' }));
  if (!res.ok) return null;
  let data;
  try {
    data = await res.json();
  } catch (_) {
    return null;
  }
  const allow = Object.create(null);
  for (const tool of data.tools || []) {
    if (!tool || typeof tool.id !== 'string' || !SLUG_RE.test(tool.id)) continue;
    const dest = httpsDest(tool.affiliate || tool.url);
    if (!dest) continue;
    allow[tool.id] = dest;
  }
  return allow;
}

async function countClick(env, slug) {
  if (!env.IA_KV) return;
  const key = `clicks:${slug}:${utcDay()}`;
  const n = parseInt((await env.IA_KV.get(key)) || '0', 10);
  const next = Number.isFinite(n) ? n + 1 : 1;
  await env.IA_KV.put(key, String(next));
}

function notFound() {
  return new Response('Not found', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

async function handleOutbound(request, env) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return json({ ok: false, error: 'method' }, 405);
  }
  const url = new URL(request.url);
  const match = GO_PATH_RE.exec(url.pathname);
  if (!match) return notFound();
  const slug = match[1];
  let allow;
  try {
    allow = await catalogAllowlist(env, request);
  } catch (_) {
    allow = null;
  }
  if (!allow) {
    return new Response('Unavailable', {
      status: 503,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff'
      }
    });
  }
  const dest = allow[slug];
  if (!dest) return notFound();
  if (request.method === 'GET') {
    console.log(JSON.stringify({ event: 'outbound_click', slug }));
    try {
      await countClick(env, slug);
    } catch (_) { /* still redirect */ }
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: dest,
      'cache-control': 'no-store'
    }
  });
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
/* The English URL must be its own canonical (and og:url). If it pointed at the Spanish URL, search
 * engines would treat hreflang="en" as conflicting and drop the English version from the index. */
const withLangEn = (href) => (href && !/[?&]lang=en\b/.test(href) ? href + (href.includes('?') ? '&' : '?') + 'lang=en' : href);
function englishMeta(response, m) {
  const type = response.headers.get('content-type') || '';
  if (!response.ok || !type.includes('text/html')) return response;
  const set = (v) => ({ element(el) { el.setAttribute('content', v); } });
  return new HTMLRewriter()
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', withLangEn(el.getAttribute('href'))); } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', withLangEn(el.getAttribute('content'))); } })
    .on('html', { element(el) { el.setAttribute('lang', 'en'); } })
    .on('title', { element(el) { el.setInnerContent(m.title); } })
    .on('meta[name="description"]', set(m.desc))
    .on('meta[name="twitter:description"]', set(m.desc))
    .on('meta[property="og:description"]', set(m.ogDesc))
    .on('meta[property="og:title"]', set(m.ogTitle))
    .on('meta[name="twitter:title"]', set(m.ogTitle))
    .on('meta[property="og:locale"]', set('en_US'))
    .on('meta[property="og:locale:alternate"]', set('es_MX'))
    .on('[data-en]', { element(el) { const t = el.getAttribute('data-en'); if (t) el.setInnerContent(t); } })
    .transform(response);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (pathname === '/ia/api/subscribe') return handleForm('subscribe', request, env);
    if (pathname === '/ia/api/featured') return handleForm('featured', request, env);
    if (pathname === '/ia/api/submit') return handleForm('submit', request, env);
    if (pathname === '/ia/go' || pathname.startsWith('/ia/go/')) return handleOutbound(request, env);
    if (pathname === '/tools.json') {
      return Response.redirect(new URL('/ia/tools.json', request.url).toString(), 301);
    }
    const response = await env.ASSETS.fetch(request);
    if ((pathname === '/ia/' || pathname === '/ia/patrocina/') && url.searchParams.get('lang') === 'en') {
      return englishMeta(response, pathname === '/ia/patrocina/' ? META_EN.sponsor : META_EN.home);
    }
    if (pathname === '/llms.txt' || pathname === '/ia/llms.txt' || pathname === '/ia/tools.json') {
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
