// ═══════════════════════════════════════════════════════════════════
//  Security Middleware — Enterprise-Grade Security Layer
//  ① CORS/Preflight  ② CSRF  ③ XSS+CSP  ④ SSRF
//  ⑤ HSTS+Headers  ⑥ RateLimit/Bruteforce  ⑦ Input Validation
//  ⑧ Audit Logging  ⑨ Error Sanitization
// ═══════════════════════════════════════════════════════════════════
import crypto from 'crypto';
import db from '../db.js';

const isProd = process.env.NODE_ENV === 'production';

// ═══════════════════════════════════════════════════════════════
//  ① CORS — Dynamic Origin Validation + Preflight Caching
// ═══════════════════════════════════════════════════════════════
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || '')
  .split(',').map(o => o.trim()).filter(Boolean);

export function corsConfig() {
  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);   // Mobile/curl/server
      if (!isProd) return callback(null, true);    // Dev: allow all
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-CSRF-Token', 'X-Requested-With'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
}

// ═══════════════════════════════════════════════════════════════
//  ② CSRF — Double-Submit Cookie + Bearer Exemption
// ═══════════════════════════════════════════════════════════════
const csrfTokens = new Map();

export function generateCsrfToken(req, res, next) {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionKey = req.user?.id || req.ip;
  csrfTokens.set(sessionKey, { token, expires: Date.now() + 3600_000 });
  res.cookie('_csrf', token, {
    httpOnly: false, sameSite: 'strict', secure: isProd, maxAge: 3600_000, path: '/api',
  });
  next();
}

export function csrfProtection(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers.authorization?.startsWith('Bearer ')) return next();
  const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
  const sessionKey = req.user?.id || req.ip;
  const stored = csrfTokens.get(sessionKey);
  if (!stored || !csrfToken || !timingSafeEqual(stored.token, csrfToken) || Date.now() > stored.expires) {
    auditLog(null, 'security.csrf_failed', null, null, { ip: req.ip, path: req.path }, req);
    return res.status(403).json({ error: 'Invalid or expired CSRF token' });
  }
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of csrfTokens) { if (now > v.expires) csrfTokens.delete(k); }
}, 300_000);

// ═══════════════════════════════════════════════════════════════
//  ③ XSS Protection + CSP
// ═══════════════════════════════════════════════════════════════
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi, /on\w+\s*=/gi, /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi, /<iframe[\s>]/gi, /<object[\s>]/gi, /<embed[\s>]/gi,
  /<svg[\s>].*?onload/gi, /<img[^>]+onerror/gi,
  /expression\s*\(/gi, /url\s*\(\s*['"]?javascript/gi,
  /<base[\s>]/gi, /<form[\s>].*?action/gi,
];

function sanitizeValue(val, depth = 0) {
  if (depth > 10) return val;
  if (typeof val === 'string') {
    let cleaned = val.trim();
    for (const p of DANGEROUS_PATTERNS) cleaned = cleaned.replace(p, '');
    if (cleaned.length > 10_000) cleaned = cleaned.substring(0, 10_000);
    return cleaned;
  }
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) return val.slice(0, 1000).map(v => sanitizeValue(v, depth + 1));
    const keys = Object.keys(val);
    if (keys.length > 100) return val;
    const obj = {};
    for (const [k, v] of Object.entries(val)) {
      obj[typeof k === 'string' ? k.substring(0, 200) : k] = sanitizeValue(v, depth + 1);
    }
    return obj;
  }
  return val;
}

export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') req.body = sanitizeValue(req.body);
  if (req.query && typeof req.query === 'object') req.query = sanitizeValue(req.query);
  if (req.params && typeof req.params === 'object') req.params = sanitizeValue(req.params);
  next();
}

// ═══════════════════════════════════════════════════════════════
//  ④ SSRF Protection — Block Internal Network Requests
// ═══════════════════════════════════════════════════════════════
const PRIVATE_IP_RANGES = [
  /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
  /^169\.254\./, /^0\./, /^::1$/, /^fc00:/i, /^fe80:/i,
  /^localhost$/i, /^.*\.local$/i, /^.*\.internal$/i,
];

export function isPrivateUrl(urlString) {
  try { return PRIVATE_IP_RANGES.some(re => re.test(new URL(urlString).hostname)); }
  catch { return true; }
}

export function ssrfGuard(req, res, next) {
  const fields = ['url', 'callbackUrl', 'webhookUrl', 'redirect', 'returnUrl', 'imageUrl'];
  for (const f of fields) {
    const val = req.body?.[f] || req.query?.[f];
    if (val && typeof val === 'string' && isPrivateUrl(val)) {
      auditLog(req.user?.id, 'security.ssrf_blocked', null, null, { field: f, url: val }, req);
      return res.status(400).json({ error: `Invalid URL in field: ${f}` });
    }
  }
  next();
}

// ═══════════════════════════════════════════════════════════════
//  ⑤ Security Headers + HSTS
// ═══════════════════════════════════════════════════════════════
export function securityHeaders(req, res, next) {
  const nonce = crypto.randomBytes(16).toString('base64');
  req.cspNonce = nonce;

  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' https: data: blob:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  });

  if (req.path.startsWith('/api/')) {
    res.set({ 'Cache-Control': 'no-store, no-cache, must-revalidate, private', 'Pragma': 'no-cache', 'Expires': '0' });
  }
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
}

// ═══════════════════════════════════════════════════════════════
//  ⑥ Rate Limiting + Progressive Bruteforce Shield
// ═══════════════════════════════════════════════════════════════
const rateLimitStore = new Map();
const bruteforceStore = new Map();

function cleanupStores() {
  const now = Date.now();
  for (const [k, d] of rateLimitStore) { if (now > d.resetTime) rateLimitStore.delete(k); }
  for (const [k, d] of bruteforceStore) { if (now > d.blockUntil && now - d.lastFailure > 3600_000) bruteforceStore.delete(k); }
}
setInterval(cleanupStores, 60_000);

export function rateLimit({ windowMs = 60_000, max = 100, message = 'Too many requests', keyFn } = {}) {
  return (req, res, next) => {
    const key = keyFn ? keyFn(req) : (req.ip + ':' + (req.baseUrl || req.path));
    const now = Date.now();
    let entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
    }
    entry.count++;
    res.set({
      'X-RateLimit-Limit': String(max),
      'X-RateLimit-Remaining': String(Math.max(0, max - entry.count)),
      'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
    });
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)));
      return res.status(429).json({ error: message, retryAfter: Math.ceil((entry.resetTime - now) / 1000) });
    }
    next();
  };
}

// Progressive backoff: 5 fails→1min, 8→5min, 12→30min, 20→1hr
export function bruteforceProtection(req, res, next) {
  const key = 'bf:' + req.ip;
  const entry = bruteforceStore.get(key);
  if (entry && Date.now() < entry.blockUntil) {
    const waitSec = Math.ceil((entry.blockUntil - Date.now()) / 1000);
    res.set('Retry-After', String(waitSec));
    return res.status(429).json({ error: `Too many attempts. Try again in ${waitSec}s.`, retryAfter: waitSec });
  }
  req.recordBruteforce = () => {
    const now = Date.now();
    let e = bruteforceStore.get(key) || { failures: 0, blockUntil: 0, lastFailure: 0 };
    e.failures++;
    e.lastFailure = now;
    const tiers = [[5, 60_000], [8, 300_000], [12, 1_800_000], [20, 3_600_000]];
    for (const [f, ms] of tiers) { if (e.failures >= f) e.blockUntil = now + ms; }
    bruteforceStore.set(key, e);
  };
  req.clearBruteforce = () => bruteforceStore.delete(key);
  next();
}

export const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10, message: 'Too many auth attempts.', keyFn: r => 'auth:' + r.ip });
export const apiLimiter = rateLimit({ windowMs: 60_000, max: 120 });
export const strictLimiter = rateLimit({ windowMs: 60_000, max: 20, message: 'Rate limit exceeded.', keyFn: r => 'strict:' + r.ip + ':' + r.baseUrl });
export const sensitiveOpLimiter = rateLimit({ windowMs: 60_000, max: 5, message: 'Too many sensitive operations.', keyFn: r => 'sens:' + (r.user?.id || r.ip) });

// ═══════════════════════════════════════════════════════════════
//  ⑦ Input Validation Helpers
// ═══════════════════════════════════════════════════════════════
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length >= 5 && email.length <= 255;
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return { valid: false, message: 'Password is required' };
  if (password.length < 8) return { valid: false, message: 'Min 8 characters' };
  if (password.length > 128) return { valid: false, message: 'Max 128 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Need uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Need lowercase letter' };
  if (!/\d/.test(password)) return { valid: false, message: 'Need number' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, message: 'Need special character' };
  const lower = password.toLowerCase();
  if (['password', '12345678', 'qwerty123', 'admin123', 'letmein', 'changeme'].some(b => lower.includes(b)))
    return { valid: false, message: 'Password too common' };
  return { valid: true };
}

export function validateAmount(amount, min = 0, max = Infinity) {
  const num = parseFloat(amount);
  if (isNaN(num) || !isFinite(num) || num <= min || num > max) return false;
  if (Math.round(num * 100) / 100 !== num) return false;
  return true;
}

export function validateId(id) {
  return id && typeof id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

export function validatePagination(limit, offset) {
  return { limit: Math.min(Math.max(parseInt(limit) || 20, 1), 200), offset: Math.max(parseInt(offset) || 0, 0) };
}

// ═══════════════════════════════════════════════════════════════
//  ⑧ Audit Logger — Structured + Critical Event Detection
// ═══════════════════════════════════════════════════════════════
const CRITICAL_ACTIONS = [
  'auth.login_failed', 'security.csrf_failed', 'security.ssrf_blocked',
  'admin.ip_blocked', 'auth.lockout', 'admin.settings_changed',
  'admin.user_suspended', 'auth.password_changed', 'admin.balance_adjusted',
];

export function auditLog(userId, action, resourceType, resourceId, details, req) {
  try {
    const id = 'al_' + crypto.randomBytes(12).toString('hex');
    const detailStr = typeof details === 'string' ? details : JSON.stringify(details || {});
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId || null, action, resourceType || null, resourceId || null, detailStr,
      req?.ip || null, req?.headers?.['user-agent']?.substring(0, 512) || null);

    if (CRITICAL_ACTIONS.some(a => action.startsWith(a))) {
      console.error(`[SECURITY_AUDIT] action=${action} user=${userId} ip=${req?.ip} details=${detailStr}`);
    }
  } catch (err) { console.error('[AUDIT_ERROR]', err.message); }
}

// ═══════════════════════════════════════════════════════════════
//  ⑨ Error Sanitization — Never Leak Internals
// ═══════════════════════════════════════════════════════════════
export function errorSanitizer(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path} [${req.requestId || '-'}]:`, err.message);
  if (!isProd) console.error(err.stack);

  const status = err.status || err.statusCode || 500;
  const safeMsg = (status >= 500 && isProd)
    ? 'Internal server error'
    : (err.message || 'Unknown error')
        .replace(/SQLITE_\w+:/g, 'Database error:')
        .replace(/at\s+\S+\s+\(.*?\)/g, '')
        .replace(/\/[\w/.]+\.js:\d+:\d+/g, '')
        .replace(/password_hash|jwt_secret|api_key/gi, '[REDACTED]');

  res.status(status).json({ error: safeMsg, requestId: req.requestId, ...(isProd ? {} : { stack: err.stack }) });
}

// ═══════════════════════════════════════════════════════════════
//  Maintenance + Request ID + Admin IP Whitelist + Session
// ═══════════════════════════════════════════════════════════════
export function maintenanceCheck(req, res, next) {
  if (req.path === '/api/health' || req.path.startsWith('/api/admin')) return next();
  try {
    const row = db.prepare("SELECT value FROM system_settings WHERE key = 'maintenance_mode'").get();
    if (row?.value === 'true') return res.status(503).json({ error: 'Service under maintenance.', maintenance: true });
  } catch {}
  next();
}

export function requestId(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.set('X-Request-ID', req.requestId);
  next();
}

export function adminIpWhitelist(req, res, next) {
  try {
    const enabled = db.prepare("SELECT value FROM system_settings WHERE key = 'admin_ip_whitelist_enabled'").get()?.value;
    if (enabled !== 'true') return next();
    const allowed = db.prepare("SELECT ip_address FROM admin_ip_whitelist WHERE is_active = 1").all().map(r => r.ip_address);
    if (allowed.length === 0) return next();
    const clientIp = req.ip || req.connection?.remoteAddress;
    if (!allowed.includes(clientIp) && clientIp !== '::1' && clientIp !== '127.0.0.1') {
      auditLog(req.user?.id, 'admin.ip_blocked', null, null, { ip: clientIp }, req);
      return res.status(403).json({ error: 'Admin access denied from this IP.' });
    }
  } catch {}
  next();
}

export function validateSession(req, res, next) {
  if (!req.user?.id) return next();
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  try {
    const token = authHeader.replace('Bearer ', '');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = db.prepare(
      "SELECT id FROM sessions WHERE token_hash = ? AND user_id = ? AND revoked = 0 AND expires_at > datetime('now')"
    ).get(tokenHash, req.user.id);
    const hasSessions = db.prepare("SELECT COUNT(*) as c FROM sessions WHERE user_id = ?").get(req.user.id);
    if (hasSessions?.c > 0 && !session) {
      return res.status(401).json({ error: 'Session expired or revoked.', code: 'SESSION_INVALID' });
    }
  } catch {}
  next();
}

// ═══════════════════════════════════════════════════════════════
//  Timing-Safe Compare (prevents timing attacks on tokens)
// ═══════════════════════════════════════════════════════════════
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) {
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
