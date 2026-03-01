// ═══════════════════════════════════════════════════════════════════
//  Auth Middleware — Hardened JWT + RBAC + Tenant Isolation
//  ⑥ AuthN/AuthZ  ⑦ RBAC+Tenant  ⑧ Least Privilege
//  ⑨ Cookie+Session  ⑩ Secret Management
// ═══════════════════════════════════════════════════════════════════
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../db.js';

const isProd = process.env.NODE_ENV === 'production';

// ═══════════════════════════════════════════════════════════════
//  ⑩ Secret Management + Validation
// ═══════════════════════════════════════════════════════════════
const JWT_SECRET = process.env.JWT_SECRET;

// ★ SECURITY FIX C-1: No hardcoded default — require env var in ALL environments
if (!JWT_SECRET) {
  console.error('[CRITICAL] JWT_SECRET environment variable is NOT set. Server cannot start safely.');
  process.exit(1);
}
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const JWT_ISSUER = 'infinity-ventures';
const JWT_AUDIENCE = 'iv-api';

// ★ SECURITY: Validate secret strength at startup
if (JWT_SECRET.length < 32) {
  console.error('[CRITICAL] JWT_SECRET is too short (<32 chars). Use a strong random secret (64+ chars recommended).');
  if (isProd) process.exit(1);
}

// ═══════════════════════════════════════════════════════════════
//  Token Generation — Minimal Claims (Least Privilege)
// ═══════════════════════════════════════════════════════════════
export function generateToken(userId, role = 'user') {
  return jwt.sign(
    {
      sub: userId,        // Subject (user ID)
      role,               // Role for RBAC
      jti: crypto.randomBytes(8).toString('hex'),  // Unique token ID
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithm: 'HS256',
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithms: ['HS256'],   // Prevent algorithm confusion attacks
  });
}

// ═══════════════════════════════════════════════════════════════
//  ⑥ AuthN — Authentication Middleware
// ═══════════════════════════════════════════════════════════════
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  // SECURITY FIX C-4: Also accept token from HttpOnly cookie (Google OAuth flow)
  const cookieToken = req.cookies?.iv_auth_token;
  
  if ((!authHeader || !authHeader.startsWith('Bearer ')) && !cookieToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : cookieToken;
  if (!token || token.length > 2048) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = verifyToken(token);

    // Use 'sub' claim (standard), fallback to 'userId' for backward compat
    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token claims' });
    }

    const user = db.prepare(`
      SELECT id, email, full_name, phone, avatar, role, kyc_status, biometric_enabled,
             email_verified, referral_code, is_suspended, created_at
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (user.is_suspended) {
      return res.status(403).json({ error: 'Account suspended. Contact support.' });
    }

    // ⑨ Session Validation — check token is not revoked
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const sessionCount = db.prepare("SELECT COUNT(*) as c FROM sessions WHERE user_id = ?").get(userId)?.c || 0;
    if (sessionCount > 0) {
      const validSession = db.prepare(
        "SELECT id FROM sessions WHERE token_hash = ? AND user_id = ? AND revoked = 0 AND expires_at > datetime('now')"
      ).get(tokenHash, userId);
      if (!validSession) {
        return res.status(401).json({ error: 'Session expired or revoked.', code: 'SESSION_INVALID' });
      }
    }

    // Attach minimal user object (Least Privilege — don't carry password hash etc.)
    req.user = formatUser(user);
    req.tokenHash = tokenHash;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    return res.status(401).json({ error: 'Authentication failed.' });
  }
}

// ═══════════════════════════════════════════════════════════════
//  ⑦ RBAC — Role-Based Access Control
//  Hierarchy: superadmin > admin > user
// ═══════════════════════════════════════════════════════════════
const ROLE_HIERARCHY = { user: 1, admin: 2, superadmin: 3 };

export function requireRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 99;
    if (userLevel < requiredLevel) {
      return res.status(403).json({ error: `Requires ${minRole} access or higher.` });
    }
    next();
  };
}

// Convenience aliases (backward compat)
export function adminRequired(req, res, next) {
  return requireRole('admin')(req, res, next);
}

export function superadminRequired(req, res, next) {
  return requireRole('superadmin')(req, res, next);
}

// ═══════════════════════════════════════════════════════════════
//  ⑦ Tenant Isolation — Users Can Only Access Own Resources
// ═══════════════════════════════════════════════════════════════
// Middleware factory: ensures :userId param or body.userId matches req.user.id
// Admins can bypass tenant isolation
export function tenantIsolation(opts = {}) {
  const { paramName = 'userId', allowAdmin = true } = opts;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const targetUserId = req.params[paramName] || req.body?.userId;
    if (!targetUserId) return next(); // No target user specified — rely on route logic

    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
    if (targetUserId !== req.user.id && !(allowAdmin && isAdmin)) {
      return res.status(403).json({ error: 'Access denied: cannot access another user\'s data.' });
    }
    next();
  };
}

// Helper: enforce ownership for DB queries (always filter by user_id)
export function ownershipCheck(userId, resourceOwnerId) {
  return userId === resourceOwnerId;
}

// ═══════════════════════════════════════════════════════════════
//  Optional Auth — Doesn't fail, just attaches user if present
// ═══════════════════════════════════════════════════════════════
export function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.iv_auth_token;
  if ((!authHeader || !authHeader.startsWith('Bearer ')) && !cookieToken) return next();

  try {
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : cookieToken;
    const decoded = verifyToken(token);
    const userId = decoded.sub || decoded.userId;
    const user = db.prepare(`
      SELECT id, email, full_name, phone, avatar, role, kyc_status, biometric_enabled,
             email_verified, referral_code, is_suspended, created_at
      FROM users WHERE id = ?
    `).get(userId);
    if (user && !user.is_suspended) req.user = formatUser(user);
  } catch {}

  next();
}

// ═══════════════════════════════════════════════════════════════
//  ⑨ Cookie Configuration Constants
// ═══════════════════════════════════════════════════════════════
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'strict' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const SESSION_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours for session cookie
};

// ═══════════════════════════════════════════════════════════════
//  Format DB Row → API User Shape (Least Privilege)
// ═══════════════════════════════════════════════════════════════
export function formatUser(row) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone || undefined,
    avatar: row.avatar || undefined,
    role: row.role || 'user',
    kycStatus: row.kyc_status,
    biometricEnabled: !!row.biometric_enabled,
    emailVerified: !!row.email_verified,
    isSuspended: !!row.is_suspended,
    createdAt: row.created_at,
    referralCode: row.referral_code || undefined,
  };
}
