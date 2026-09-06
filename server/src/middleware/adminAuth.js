import crypto from 'crypto';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const getAdminPin = () => {
  const configuredPin = process.env.ADMIN_PIN?.trim();
  if (configuredPin) return configuredPin;
  return process.env.NODE_ENV === 'production' ? null : '1234';
};

const getTokenSecret = () => {
  const configuredSecret = process.env.ADMIN_TOKEN_SECRET?.trim();
  if (configuredSecret) return configuredSecret;
  return process.env.NODE_ENV === 'production' ? null : 'shoply-local-development-secret';
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const sign = (payload, secret) => (
  crypto.createHmac('sha256', secret).update(payload).digest('base64url')
);

export const authenticateAdminPin = (pin) => {
  const adminPin = getAdminPin();
  if (!adminPin) {
    const error = new Error('Admin access is not configured. Set ADMIN_PIN on the server.');
    error.statusCode = 503;
    throw error;
  }

  return safeEqual(pin, adminPin);
};

export const createAdminToken = () => {
  const secret = getTokenSecret();
  if (!secret) {
    const error = new Error('Admin token signing is not configured. Set ADMIN_TOKEN_SECRET on the server.');
    error.statusCode = 503;
    throw error;
  }

  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
  })).toString('base64url');

  return `${payload}.${sign(payload, secret)}`;
};

export const verifyAdminToken = (token) => {
  const secret = getTokenSecret();
  if (!secret || !token) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.role === 'admin' && Number(decoded.exp) > Date.now();
  } catch {
    return false;
  }
};

export const requireAdmin = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Admin session is missing or expired.' });
  }

  next();
};
