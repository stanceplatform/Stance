// api/proxy/[...path].js
export default async function handler(req, res) {
  // --- CORS preflight ---
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin ?? '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*');
    return res.status(204).end();
  }

  // ===== MOCK SWITCH =====
  const isMock = req.query.mock === '1' || req.headers['x-mock'] === '1' || process.env.MOCK_PROXY === '1';
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const forwardedPath = pathParts.join('/');

  if (isMock) {
    // Example mock for GET /api/proxy/questions (or /api/questions via rewrite)
    if (req.method === 'GET' && forwardedPath === 'questions') {
      const mock = {
        content: [
          { id: 47, text: 'Who should pay on first date?', backgroundImage: '', yesVotes: 0, noVotes: 0, commentCount: 0, userVote: null },
          { id: 48, text: 'How to handle stray dogs situation in India?', backgroundImage: '', yesVotes: 0, noVotes: 0, commentCount: 1, userVote: null }
        ],
        pageable: { pageNumber: 0, pageSize: 20 }
      };
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
      res.setHeader('Vary', 'Origin');
      res.setHeader('x-proxy', 'mock');
      return res.status(200).json(mock);
    }
    // Example mock for POST /api/proxy/auth/login
    if (req.method === 'POST' && forwardedPath === 'auth/login') {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
      res.setHeader('Vary', 'Origin');
      res.setHeader('x-proxy', 'mock');
      return res.status(200).json({ token: 'mock.jwt.token', user: { id: 1, email: 'demo@example.com' } });
    }
    // default mock 404
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader('x-proxy', 'mock');
    return res.status(404).json({ error: 'No mock for this path' });
  }
  // ===== END MOCK SWITCH =====

  const ORIGIN = process.env.BACKEND_ORIGIN;                 // e.g. http://test-stance...
  const PREFIX = (process.env.BACKEND_PREFIX ?? '/api').replace(/\/+$/, ''); // or "" if none
  if (!ORIGIN) return res.status(500).json({ error: 'BACKEND_ORIGIN env not set' });

  // build target URL
  const qIndex = req.url.indexOf('?');
  const search = qIndex >= 0 ? req.url.substring(qIndex) : '';
  const base = ORIGIN.replace(/\/+$/, '');
  const prefix = PREFIX ? (PREFIX.startsWith('/') ? PREFIX : `/${PREFIX}`) : '';
  const upstreamUrl = `${base}${prefix}/${forwardedPath}${search}`;

  // forward headers (strip hop-by-hop)
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

    // mirror status + headers (strip compression/length)
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
