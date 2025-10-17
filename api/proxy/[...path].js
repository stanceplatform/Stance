// api/proxy/[...path].js

export default async function handler(req, res) {
  // Preflight for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*');
    res.status(204).end();
    return;
  }

  const backend = process.env.BACKEND_ORIGIN;
  if (!backend) {
    res.status(500).json({ error: 'BACKEND_ORIGIN env not set' });
    return;
  }

  // Build upstream URL. We forward to `${BACKEND_ORIGIN}/api/<path*>`
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const upstreamUrl = `${backend.replace(/\/$/, '')}/api/${pathParts.join('/')}${req.url?.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

  // Copy headers except host/connection/encoding
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!v) continue;
    const key = k.toLowerCase();
    if (['host', 'connection', 'content-length'].includes(key)) continue;
    headers[key] = Array.isArray(v) ? v.join(',') : v;
  }

  const init = {
    method: req.method,
    headers
  };

  // Pass body for non-GET/HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Vercel Node runtime has global fetch; pass the raw buffer
    const chunks = [];
    await new Promise((resolve, reject) => {
      req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      req.on('end', () => resolve());
      req.on('error', reject);
    });
    (init).body = Buffer.concat(chunks);
  }

  try {
    const upstream = await fetch(upstreamUrl, init);

    // Mirror status and headers
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      // You may filter hop-by-hop headers here if needed
      res.setHeader(key, value);
    });

    // CORS for browser calls
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');

    // Stream body back
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', detail: err?.message ?? String(err) });
  }
}
