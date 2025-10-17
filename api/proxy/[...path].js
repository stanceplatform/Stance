// api/proxy/[...path].js
export default async function handler(req, res) {
  // --- CORS preflight ---
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin ?? '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*');
    // If you plan to use cookies with this proxy later, also:
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return;
  }

  const ORIGIN = process.env.BACKEND_ORIGIN;               // e.g. http://test-stance.ap-south-1.elasticbeanstalk.com
  const PREFIX = (process.env.BACKEND_PREFIX ?? '/api')    // e.g. "/api" or "" (no leading/trailing slashes required)
    .replace(/\/+$/, '');                                   // trim trailing slash

  if (!ORIGIN) {
    res.status(500).json({ error: 'BACKEND_ORIGIN env not set' });
    return;
  }

  // --- Build upstream URL ---
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const forwardedPath = pathParts.join('/');

  // safer query extraction
  const qIndex = req.url.indexOf('?');
  const search = qIndex >= 0 ? req.url.substring(qIndex) : '';

  const base = ORIGIN.replace(/\/+$/, '');                  // no trailing slash
  const prefix = PREFIX ? (PREFIX.startsWith('/') ? PREFIX : `/${PREFIX}`) : '';
  const upstreamUrl = `${base}${prefix}/${forwardedPath}${search}`;

  // --- Copy headers (strip hop-by-hop) ---
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!v) continue;
    const key = k.toLowerCase();
    if (['host', 'connection', 'content-length', 'transfer-encoding'].includes(key)) continue;
    headers[key] = Array.isArray(v) ? v.join(',') : v;
  }

  const init = {
    method: req.method,
    headers,
    redirect: 'manual', // let the client see 3xx if backend redirects
  };

  // Pass body for non-GET/HEAD
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

    // Mirror status + headers
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => res.setHeader(key, value));

    // CORS back to browser
    const origin = req.headers.origin ?? '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    // If you need cookies later:
    // res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Helpful for debugging
    res.setHeader('x-upstream-url', upstreamUrl);
    res.setHeader('x-proxy', 'vercel-node');

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', detail: err?.message ?? String(err) });
  }
}
