const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

const sendJson = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL?.trim().replace(/\/$/, '');
  if (!backendUrl) {
    return sendJson(res, 503, {
      error: 'Production API is not configured.',
      action: 'Set BACKEND_URL in Vercel to the deployed Shoply server URL.',
    });
  }

  try {
    const requestPath = req.url || '/api/health';
    const upstreamUrl = new URL(requestPath, `${backendUrl}/`);
    const headers = {};

    for (const [name, value] of Object.entries(req.headers)) {
      if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase()) && value !== undefined) {
        headers[name] = value;
      }
    }

    headers['x-forwarded-host'] = req.headers.host || '';
    headers['x-forwarded-proto'] = 'https';

    const method = req.method || 'GET';
    const hasBody = method !== 'GET' && method !== 'HEAD';
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body: hasBody ? req : undefined,
      duplex: hasBody ? 'half' : undefined,
      redirect: 'manual',
    });

    res.status(upstreamResponse.status);
    upstreamResponse.headers.forEach((value, name) => {
      if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) res.setHeader(name, value);
    });

    return res.end(Buffer.from(await upstreamResponse.arrayBuffer()));
  } catch (error) {
    return sendJson(res, 502, {
      error: 'Unable to reach the Shoply backend.',
      detail: error.message,
    });
  }
}
