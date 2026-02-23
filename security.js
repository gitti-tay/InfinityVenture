// ═══════════════════════════════════════════════════════════════════
//  Security Middleware — Rate Limiting, Headers, Audit, Sanitization
// ═══════════════════════════════════════════════════════════════════
import crypto from 'crypto';
import db from '../db.js';

// ─── In-Memory Rate Limiter ──────────────────────────────────────
// (No need for Redis in MVP — simple token bucket per IP)
const rateLimitStore = new Map();

function cleanupStore() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore) {
    if (now - data.resetTime > 0) rateLimitStore.delete(key);
  }
}
setInterval(cleanupStore, 60_000); // cleanup every minute

export function rateLimit({ windowMs = 60_000, max = 100, message = 'Too many requests' } = {}) {
  return (req, res, next) => {
    const key = req.ip + ':' + (req.baseUrl || req.path);
    const now = Date.now();

    let entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    // Set headers
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));

    if (entry.count > max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      });
    }

    next();
  };
}

// Specific rate limiters
export const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10, message: 'Too many auth attempts. Please try again later.' });
export const apiLimiter = rateLimit({ windowMs: 60_000, max: 120 });
export const strictLimiter = rateLimit({ windowMs: 60_000, max: 20, message: 'Rate limit exceeded for this action.' });

// ─── Security Headers ────────────────────────────────────────────
export function securityHeaders(req, res, next) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0',  // Modern browsers: disabled in favor of CSP
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; script-src 'self' 'unsafe-inline'; connect-src 'self' https:",
  });
  // API responses: no caching for authenticated data
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
  }
  res.removeHeader('X-Powered-By');
  next();
}

// ─── Input Sanitization ──────────────────────────────────────────
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

function sanitizeValue(val) {
  if (typeof val === 'string') {
    let cleaned = val.trim();
    for (const pattern of DANGEROUS_PATTERNS) {
      cleaned = cleaned.replace(pattern, '');
    }
    // Limit string length to prevent abuse
    if (cleaned.length > 10000) cleaned = cleaned.substring(0, 10000);
    return cleaned;
  }
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) return val.map(sanitizeValue);
    const obj = {};
    for (const [k, v] of Object.entries(val)) {
      obj[sanitizeValue(k)] = sanitizeValue(v);
    }
    return obj;
  }
  return val;
}

export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  next();
}

// ─── Audit Logger ────────────────────────────────────────────────
export function auditLog(userId, action, resourceType, resourceId, details, req) {
  try {
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'al_' + crypto.randomBytes(12).toString('hex'),
      userId || null,
      action,
      resourceType || null,
      resourceId || null,
      typeof details === 'string' ? details : JSON.stringify(details || {}),
      req?.ip || req?.connection?.remoteAddress || null,
      req?.headers?.['user-agent']?.substring(0, 255) || null
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

// ─── Maintenance Mode Check ──────────────────────────────────────
export function maintenanceCheck(req, res, next) {
  // Skip health check and admin routes
  if (req.path === '/api/health' || req.path.startsWith('/api/admin')) {
    return next();
  }

  try {
    const row = db.prepare("SELECT value FROM system_settings WHERE key = 'maintenance_mode'").get();
    if (row?.value === 'true') {
      return res.status(503).json({
        error: 'Service is under maintenance. Please try again later.',
        maintenance: true,
      });
    }
  } catch {}

  next();
}

// ─── Request ID (for tracing) ────────────────────────────────────
export function requestId(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.set('X-Request-ID', req.requestId);
  next();
}

// ─── Validation helpers ──────────────────────────────────────────
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 255;
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return { valid: false, message: 'Password is required' };
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  if (password.length > 128) return { valid: false, message: 'Password must be at most 128 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
  if (!/\d/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, message: 'Password must contain at least one special character' };
  // Block trivially common passwords
  const lower = password.toLowerCase();
  const blocked = ['password', '12345678', 'qwerty123', 'admin123', 'letmein'];
  if (blocked.some(b => lower.includes(b))) return { valid: false, message: 'Password is too common' };
  return { valid: true };
}

export function validateAmount(amount, min = 0, max = Infinity) {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= min) return false;
  if (num > max) return false;
  // Max 2 decimal places
  if (Math.round(num * 100) / 100 !== num) return false;
  return true;
}

// ─── CSRF Token Generation & Validation ──────────────────────
const csrfTokens = new Map();

export function generateCsrfToken(req, res, next) {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionKey = req.user?.id || req.ip;
  csrfTokens.set(sessionKey, { token, expires: Date.now() + 3600000 }); // 1 hour
  res.cookie('_csrf', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  next();
}

export function csrfProtection(req, res, next) {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  // Skip for API-only calls with Bearer auth (token-based auth is CSRF-proof)
  if (req.headers.authorization?.startsWith('Bearer ')) return next();
  
  const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
  const sessionKey = req.user?.id || req.ip;
  const stored = csrfTokens.get(sessionKey);

  if (!stored || stored.token !== csrfToken || Date.now() > stored.expires) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}

// Cleanup expired CSRF tokens
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of csrfTokens) {
    if (now > val.expires) csrfTokens.delete(key);
  }
}, 300_000);

// ─── Admin IP Whitelist ──────────────────────────────────────
export function adminIpWhitelist(req, res, next) {
  try {
    const enabled = db.prepare("SELECT value FROM system_settings WHERE key = 'admin_ip_whitelist_enabled'").get()?.value;
    if (enabled !== 'true') return next();

    const allowedIps = db.prepare("SELECT ip_address FROM admin_ip_whitelist WHERE is_active = 1").all().map(r => r.ip_address);
    if (allowedIps.length === 0) return next(); // No IPs configured = allow all

    const clientIp = req.ip || req.connection?.remoteAddress;
    if (!allowedIps.includes(clientIp) && !allowedIps.includes('127.0.0.1') && clientIp !== '::1') {
      auditLog(req.user?.id || 'unknown', 'admin.ip_blocked', null, null, { ip: clientIp }, req);
      return res.status(403).json({ error: 'Admin access denied from this IP address.' });
    }
  } catch {}
  next();
}

// ─── Session Token Validation ────────────────────────────────
export function validateSession(req, res, next) {
  if (!req.user?.id) return next(); // No user = no session to validate
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  try {
    const token = authHeader.replace('Bearer ', '');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = db.prepare(
      "SELECT id FROM sessions WHERE token_hash = ? AND user_id = ? AND revoked = 0 AND expires_at > datetime('now')"
    ).get(tokenHash, req.user.id);

    // If we have sessions in the DB but this token isn't valid, reject
    const hasAnySessions = db.prepare("SELECT COUNT(*) as c FROM sessions WHERE user_id = ?").get(req.user.id);
    if (hasAnySessions?.c > 0 && !session) {
      return res.status(401).json({ error: 'Session expired or revoked. Please login again.', code: 'SESSION_INVALID' });
    }
  } catch {} // Fail open for backward compat during migration
  next();
}

