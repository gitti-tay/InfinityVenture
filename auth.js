// ═══════════════════════════════════════════════════════════════════
//  Auth Routes — /api/auth/*  (Secured for MVP)
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db, { getSetting, getSettingNumber, getSettingBool } from '../db.js';
import { generateToken, authRequired, formatUser } from '../middleware/auth.js';
import { auditLog, validateEmail, validatePassword, authLimiter } from '../middleware/security.js';

const router = Router();

// ── POST /auth/signup ──────────────────────────────────────────
router.post('/signup', authLimiter, async (req, res) => {
  try {
    if (getSettingBool('maintenance_mode')) {
      return res.status(503).json({ error: 'Registration temporarily unavailable' });
    }
    if (!getSettingBool('signup_enabled')) {
      return res.status(403).json({ error: 'Registration is currently closed' });
    }

    const { fullName, email, password, phone, referralCode } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email and password are required' });
    }
    if (fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({ error: 'Name must be 2-100 characters' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ error: pwCheck.message });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const id = 'u_' + crypto.randomBytes(12).toString('hex');
    const passwordHash = await bcrypt.hash(password, 12);
    const userReferralCode = 'IV' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, phone, referral_code, referred_by, verification_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, email.toLowerCase().trim(), passwordHash, fullName.trim(), phone || null, userReferralCode, referralCode || null, verificationCode);

    const token = generateToken(id);
    const user = db.prepare(`
      SELECT id, email, full_name, phone, avatar, role, kyc_status, biometric_enabled, email_verified, referral_code, created_at
      FROM users WHERE id = ?
    `).get(id);

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'n_' + crypto.randomBytes(8).toString('hex'), id,
      'Welcome to Infinity Ventures!',
      'Your account has been created. Complete email verification to get started.',
      'system'
    );

    // ── Referral bonus on signup ──────────────────────────────
    if (referralCode) {
      const referrer = db.prepare('SELECT id, full_name FROM users WHERE referral_code = ?').get(referralCode.toUpperCase());
      if (referrer && referrer.id !== id) {
        const signupBonus = parseFloat(db.prepare("SELECT value FROM system_settings WHERE key = 'referral_bonus_signup'").get()?.value || '0');
        if (signupBonus > 0) {
          db.prepare(`INSERT INTO referral_bonuses (id, referrer_id, referred_id, trigger_type, bonus_amount, status)
            VALUES (?, ?, ?, 'signup', ?, 'pending')`)
            .run('rb_' + crypto.randomBytes(8).toString('hex'), referrer.id, id, signupBonus);
        }
        db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
          .run('n_' + crypto.randomBytes(8).toString('hex'), referrer.id, 'New Referral', `${fullName} signed up using your referral code!`, 'success');
      }
    }

    auditLog(id, 'auth.signup', 'user', id, { email: email.toLowerCase() }, req);

    res.status(201).json({
      success: true,
      token,
      user: formatUser(user),
      verificationCode, // In production: send via email, don't return
      message: 'Account created successfully',
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /auth/login ───────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare(`
      SELECT id, email, password_hash, full_name, phone, avatar, role, kyc_status, biometric_enabled,
             email_verified, referral_code, is_suspended, login_attempts, locked_until, created_at
      FROM users WHERE email = ?
    `).get(email.toLowerCase().trim());

    if (!user) {
      // Timing-attack prevention: still run bcrypt to keep response time consistent
      await bcrypt.compare(password, '$2a$12$invalidhashpaddingtomatchlength');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check account lockout
    const maxAttempts = getSettingNumber('max_login_attempts') || 5;
    const lockoutMinutes = getSettingNumber('lockout_duration_minutes') || 30;

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remaining = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({
        error: `Account locked. Try again in ${remaining} minutes.`,
        lockedUntil: user.locked_until,
      });
    }

    // Check suspended
    if (user.is_suspended) {
      return res.status(403).json({ error: 'Account suspended. Contact support.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      // Track failed login
      db.prepare(`INSERT INTO login_history (id, user_id, ip_address, user_agent, success, failure_reason) VALUES (?, ?, ?, ?, 0, ?)`)
        .run('lh_' + crypto.randomBytes(8).toString('hex'), user.id, req.ip, req.headers['user-agent'] || '', 'wrong_password');

      const newAttempts = (user.login_attempts || 0) + 1;
      const updates = { login_attempts: newAttempts };

      if (newAttempts >= maxAttempts) {
        const lockUntil = new Date(Date.now() + lockoutMinutes * 60000).toISOString();
        db.prepare("UPDATE users SET login_attempts = ?, locked_until = ?, updated_at = datetime('now') WHERE id = ?")
          .run(newAttempts, lockUntil, user.id);
        auditLog(user.id, 'auth.lockout', 'user', user.id, { attempts: newAttempts }, req);
        return res.status(423).json({ error: `Too many failed attempts. Account locked for ${lockoutMinutes} minutes.` });
      } else {
        db.prepare("UPDATE users SET login_attempts = ?, updated_at = datetime('now') WHERE id = ?")
          .run(newAttempts, user.id);
      }

      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Success — reset attempts, update last login
    db.prepare(`
      UPDATE users SET login_attempts = 0, locked_until = NULL,
        last_login_at = datetime('now'), last_login_ip = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(req.ip, user.id);

    // Track login history
    db.prepare(`INSERT INTO login_history (id, user_id, ip_address, user_agent, success) VALUES (?, ?, ?, ?, 1)`)
      .run('lh_' + crypto.randomBytes(8).toString('hex'), user.id, req.ip, req.headers['user-agent'] || '', 1);

    const token = generateToken(user.id, user.role);

    // Store session for tracking and revocation
    const sessionId = 's_' + crypto.randomBytes(12).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const maxAgeDays = parseInt(getSetting('session_max_age_days') || '7');
    const expiresAt = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, user.id, tokenHash, req.ip, req.headers['user-agent'] || '', expiresAt);

    // Cleanup expired sessions (background, non-blocking)
    try {
      db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now') OR revoked = 1").run();
      db.prepare("DELETE FROM password_reset_tokens WHERE expires_at < datetime('now') OR used = 1").run();
    } catch {}

    auditLog(user.id, 'auth.login', 'user', user.id, { ip: req.ip }, req);

    res.json({
      success: true,
      token,
      user: formatUser(user),
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /auth/logout ──────────────────────────────────────────
router.post('/logout', authRequired, (req, res) => {
  // Revoke the current session token
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    db.prepare("UPDATE sessions SET revoked = 1 WHERE token_hash = ?").run(tokenHash);
  }
  auditLog(req.user.id, 'auth.logout', 'user', req.user.id, {}, req);
  res.json({ success: true });
});

// ── GET /auth/me ───────────────────────────────────────────────
router.get('/me', authRequired, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── PUT /auth/me ───────────────────────────────────────────────
router.put('/me', authRequired, (req, res) => {
  try {
    const { fullName, phone, avatar, biometricEnabled } = req.body;
    const updates = [];
    const params = [];

    if (fullName !== undefined) {
      if (fullName.length < 2 || fullName.length > 100) return res.status(400).json({ error: 'Name must be 2-100 chars' });
      updates.push('full_name = ?'); params.push(fullName.trim());
    }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
    if (biometricEnabled !== undefined) { updates.push('biometric_enabled = ?'); params.push(biometricEnabled ? 1 : 0); }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

    updates.push("updated_at = datetime('now')");
    params.push(req.user.id);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const user = db.prepare(`
      SELECT id, email, full_name, phone, avatar, role, kyc_status, biometric_enabled, email_verified, referral_code, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /auth/verify-email ────────────────────────────────────
router.post('/verify-email', authRequired, (req, res) => {
  const { code } = req.body;
  const user = db.prepare('SELECT verification_code, email_verified FROM users WHERE id = ?').get(req.user.id);

  if (user?.email_verified) return res.json({ success: true, message: 'Already verified' });

  // Soft launch: accept any 6-digit code OR exact stored code
  if (code && (code.length === 6 || code === user?.verification_code)) {
    db.prepare("UPDATE users SET email_verified = 1, verification_code = NULL, updated_at = datetime('now') WHERE id = ?").run(req.user.id);
    auditLog(req.user.id, 'auth.verify_email', 'user', req.user.id, {}, req);
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid verification code' });
});

// ── POST /auth/forgot-password ─────────────────────────────────
router.post('/forgot-password', authLimiter, (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email?.toLowerCase());

  if (user) {
    const resetCode = String(Math.floor(100000 + Math.random() * 900000));
    db.prepare("UPDATE users SET verification_code = ?, updated_at = datetime('now') WHERE id = ?").run(resetCode, user.id);
    auditLog(user.id, 'auth.forgot_password', 'user', user.id, {}, req);
    // In production: send email with resetCode
  }

  res.json({ success: true, message: 'If the email exists, a reset code has been sent' });
});

// ── POST /auth/change-password ─────────────────────────────────
router.post('/change-password', authRequired, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) return res.status(400).json({ error: pwCheck.message });

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 12);
    db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(newHash, req.user.id);

    // Revoke all other sessions (force re-login on other devices)
    const currentTokenHash = crypto.createHash('sha256').update(
      req.headers.authorization?.replace('Bearer ', '') || ''
    ).digest('hex');
    db.prepare("UPDATE sessions SET revoked = 1 WHERE user_id = ? AND token_hash != ?")
      .run(req.user.id, currentTokenHash);

    auditLog(req.user.id, 'auth.change_password', 'user', req.user.id, {}, req);
    res.json({ success: true, message: 'Password changed. Other sessions have been logged out.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /auth/kyc/start ───────────────────────────────────────
router.post('/kyc/start', authRequired, (req, res) => {
  db.prepare("UPDATE users SET kyc_status = 'pending', updated_at = datetime('now') WHERE id = ?").run(req.user.id);
  auditLog(req.user.id, 'kyc.start', 'user', req.user.id, {}, req);

  // Notify admins
  const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
  for (const admin of admins) {
    db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run('n_' + crypto.randomBytes(8).toString('hex'), admin.id,
        'New KYC Submission', `User ${req.user.fullName} (${req.user.email}) submitted KYC for review.`, 'admin');
  }

  res.json({ success: true });
});

// ── POST /auth/kyc/approve (soft launch auto-approve) ──────────
router.post('/kyc/approve', authRequired, (req, res) => {
  db.prepare("UPDATE users SET kyc_status = 'verified', updated_at = datetime('now') WHERE id = ?").run(req.user.id);
  db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
    .run('n_' + crypto.randomBytes(8).toString('hex'), req.user.id, 'KYC Verified', 'Your identity has been verified.', 'success');
  res.json({ success: true });
});

export default router;
