// api/proxy.js
export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin ?? '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*');
    return res.status(204).end();
  }

  const ORIGIN = process.env.BACKEND_ORIGIN;              // e.g. http://test-stance...
  const PREFIX = (process.env.BACKEND_PREFIX ?? '/api').replace(/\/+$/, ''); // or ""
  if (!ORIGIN) return res.status(500).json({ error: 'BACKEND_ORIGIN env not set' });

  // Path came from the rewrite as a query param
  const raw = req.query.path || '';
  const forwardedPath = Array.isArray(raw) ? raw.join('/') : String(raw);
  const qIndex = req.url.indexOf('?');
  const search = qIndex >= 0 ? req.url.substring(qIndex) : '';

  const base = ORIGIN.replace(/\/+$/, '');
  const prefix = PREFIX ? (PREFIX.startsWith('/') ? PREFIX : `/${PREFIX}`) : '';
  const upstreamUrl = `${base}${prefix}/${forwardedPath}${search}`;

  // Copy headers (strip hop-by-hop)
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!v) continue;
    const key = k.toLowerCase();
    if (['host', 'connection', 'content-length', 'transfer-encoding'].includes(key)) continue;
    headers[key] = Array.isArray(v) ? v.join(',') : v;
  }

  const init = { method: req.method, headers, redirect: 'manual' };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    await new Promise((resolve, reject) => {
      req.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      req.on('end', resolve);
      req.on('error', reject);
    });
    init.body = Buffer.concat(chunks);
  }

  try {
    const upstream = await fetch(upstreamUrl, init);

    // Mirror status + headers; strip compression/length (body is decoded already)
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (k === 'content-encoding' || k === 'content-length' || k === 'transfer-encoding') return;
      res.setHeader(key, value);
    });

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader('x-proxy', 'vercel-node');
    res.setHeader('x-upstream-url', upstreamUrl);

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', detail: err?.message ?? String(err) });
  }
}
