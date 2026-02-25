// ═══════════════════════════════════════════════════════════════════
// Auth Routes — /api/auth/* (Security-Hardened)
// FIXES: verificationCode leak, email bypass, KYC self-approve
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db, { getSetting, getSettingNumber, getSettingBool } from '../db.js';
import { generateToken, authRequired, adminRequired, formatUser } from '../middleware/auth.js';
import {
    auditLog, validateEmail, validatePassword,
    authLimiter, bruteforceProtection, sensitiveOpLimiter
} from '../middleware/security.js';

const router = Router();

// ── POST /auth/signup ────────────────────────────────────────────
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
                      `).run(id, email.toLowerCase().trim(), passwordHash, fullName.trim(), phone || null,
                                        userReferralCode, referralCode || null, verificationCode);

      const token = generateToken(id);

      const user = db.prepare(`
            SELECT id, email, full_name, phone, avatar, role, kyc_status,
                         biometric_enabled, email_verified, referral_code, created_at
                               FROM users WHERE id = ?
                                   `).get(id);

      // Store session
      const sessionId = 's_' + crypto.randomBytes(12).toString('hex');
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
          const maxAgeDays = parseInt(getSetting('session_max_age_days') || '7');
          const expiresAt = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000).toISOString();
          db.prepare(`
                INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
                      VALUES (?, ?, ?, ?, ?, ?)
                          `).run(sessionId, id, tokenHash, req.ip, req.headers['user-agent'] || '', expiresAt);

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
                        const signupBonus = parseFloat(
                                    db.prepare("SELECT value FROM system_settings WHERE key = 'referral_bonus_signup'").get()?.value || '0'
                                  );
                        if (signupBonus > 0) {
                                    db.prepare(`INSERT INTO referral_bonuses (id, referrer_id, referred_id, trigger_type, bonus_amount, status)
                                                VALUES (?, ?, ?, 'signup', ?, 'pending')`)
                                      .run('rb_' + crypto.randomBytes(8).toString('hex'), referrer.id, id, signupBonus);
                        }
                        db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
                          .run('n_' + crypto.randomBytes(8).toString('hex'), referrer.id,
                                              'New Referral', `${fullName} signed up using your referral code!`, 'success');
              }
      }

      auditLog(id, 'auth.signup', 'user', id, { email: email.toLowerCase() }, req);

      // ★ SECURITY FIX: Never return verificationCode in API response
      // In production, send verification code via email service
      console.log(`[EMAIL] Verification code for ${email}: ${verificationCode}`);

      res.status(201).json({
              success: true,
              token,
              user: formatUser(user),
              message: 'Account created. Verification code sent to your email.',
      });
    } catch (err) {
          console.error('Signup error:', err);
          res.status(500).json({ error: 'Internal server error' });
    }
});

// ── POST /auth/login ─────────────────────────────────────────────
router.post('/login', authLimiter, bruteforceProtection, async (req, res) => {
    try {
          const { email, password } = req.body;

      if (!email || !password) {
              return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = db.prepare(`
            SELECT id, email, password_hash, full_name, phone, avatar, role, kyc_status,
                         biometric_enabled, email_verified, referral_code, is_suspended,
                                      login_attempts, locked_until, created_at
                                            FROM users WHERE email = ?
                                                `).get(email.toLowerCase().trim());

      if (!user) {
              await bcrypt.compare(password, '$2a$12$invalidhashpaddingtomatchlength');
              if (req.recordBruteforce) req.recordBruteforce();
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

      if (user.is_suspended) {
              return res.status(403).json({ error: 'Account suspended. Contact support.' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
              db.prepare(`INSERT INTO login_history (id, user_id, ip_address, user_agent, success, failure_reason)
                      VALUES (?, ?, ?, ?, 0, ?)`)
                .run('lh_' + crypto.randomBytes(8).toString('hex'), user.id, req.ip,
                                  req.headers['user-agent'] || '', 'wrong_password');

            const newAttempts = (user.login_attempts || 0) + 1;

            if (newAttempts >= maxAttempts) {
                      const lockUntil = new Date(Date.now() + lockoutMinutes * 60000).toISOString();
                      db.prepare("UPDATE users SET login_attempts = ?, locked_until = ?, updated_at = datetime('now') WHERE id = ?")
                        .run(newAttempts, lockUntil, user.id);
                      auditLog(user.id, 'auth.lockout', 'user', user.id, { attempts: newAttempts }, req);
                      return res.status(423).json({
                                  error: `Too many failed attempts. Account locked for ${lockoutMinutes} minutes.`
                      });
            } else {
                      db.prepare("UPDATE users SET login_attempts = ?, updated_at = datetime('now') WHERE id = ?")
                        .run(newAttempts, user.id);
            }

            if (req.recordBruteforce) req.recordBruteforce();
              return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Success
      if (req.clearBruteforce) req.clearBruteforce();

      db.prepare(`
            UPDATE users SET login_attempts = 0, locked_until = NULL,
                    last_login_at = datetime('now'), last_login_ip = ?, updated_at = datetime('now')
                          WHERE id = ?
                              `).run(req.ip, user.id);

      db.prepare(`INSERT INTO login_history (id, user_id, ip_address, user_agent, success)
            VALUES (?, ?, ?, ?, 1)`)
            .run('lh_' + crypto.randomBytes(8).toString('hex'), user.id, req.ip,
                            req.headers['user-agent'] || '', 1);

      const token = generateToken(user.id, user.role);

      const sessionId = 's_' + crypto.randomBytes(12).toString('hex');
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
          const maxAgeDays = parseInt(getSetting('session_max_age_days') || '7');
          const expiresAt = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000).toISOString();

      db.prepare(`
            INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
                  VALUES (?, ?, ?, ?, ?, ?)
                      `).run(sessionId, user.id, tokenHash, req.ip, req.headers['user-agent'] || '', expiresAt);

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

// ── POST /auth/logout ────────────────────────────────────────────
router.post('/logout', authRequired, (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
          db.prepare("UPDATE sessions SET revoked = 1 WHERE token_hash = ?").run(tokenHash);
    }
    auditLog(req.user.id, 'auth.logout', 'user', req.user.id, {}, req);
    res.json({ success: true });
});

// ── GET /auth/me ─────────────────────────────────────────────────
router.get('/me', authRequired, (req, res) => {
    res.json({ success: true, user: req.user });
});

// ── PUT /auth/me ─────────────────────────────────────────────────
router.put('/me', authRequired, (req, res) => {
    try {
          const { fullName, phone, avatar, biometricEnabled } = req.body;
          const updates = [];
          const params = [];

      if (fullName !== undefined) {
              if (fullName.length < 2 || fullName.length > 100)
                        return res.status(400).json({ error: 'Name must be 2-100 chars' });
              updates.push('full_name = ?'); params.push(fullName.trim());
      }
          if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
          if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
          if (biometricEnabled !== undefined) {
                  updates.push('biometric_enabled = ?'); params.push(biometricEnabled ? 1 : 0);
          }

      if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

      updates.push("updated_at = datetime('now')");
          params.push(req.user.id);

      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

      const user = db.prepare(`
            SELECT id, email, full_name, phone, avatar, role, kyc_status,
                         biometric_enabled, email_verified, referral_code, created_at
                               FROM users WHERE id = ?
                                   `).get(req.user.id);

      res.json({ success: true, user: formatUser(user) });
    } catch (err) {
          console.error('Update user error:', err);
          res.status(500).json({ error: 'Internal server error' });
    }
});

// ── POST /auth/verify-email ──────────────────────────────────────
// ★ SECURITY FIX: Only accept the exact stored verification code
router.post('/verify-email', authRequired, (req, res) => {
    const { code } = req.body;

              if (!code || typeof code !== 'string' || code.length !== 6) {
                    return res.status(400).json({ error: 'Please enter a valid 6-digit verification code' });
              }

              const user = db.prepare('SELECT verification_code, email_verified FROM users WHERE id = ?').get(req.user.id);

              if (user?.email_verified) {
                    return res.json({ success: true, message: 'Already verified' });
              }

              // ★ SECURITY: Strict code match — must match the stored verification code exactly
              if (user?.verification_code && code === user.verification_code) {
                    db.prepare("UPDATE users SET email_verified = 1, verification_code = NULL, updated_at = datetime('now') WHERE id = ?")
                      .run(req.user.id);
                    auditLog(req.user.id, 'auth.verify_email', 'user', req.user.id, {}, req);
                    return res.json({ success: true, message: 'Email verified successfully' });
              }

              auditLog(req.user.id, 'auth.verify_email_failed', 'user', req.user.id, { providedCode: '***' }, req);
    res.status(400).json({ error: 'Invalid verification code. Please check your email.' });
});

// ── POST /auth/resend-verification ───────────────────────────────
router.post('/resend-verification', authRequired, sensitiveOpLimiter, (req, res) => {
    const user = db.prepare('SELECT email_verified FROM users WHERE id = ?').get(req.user.id);

              if (user?.email_verified) {
                    return res.json({ success: true, message: 'Email already verified' });
              }

              const newCode = String(Math.floor(100000 + Math.random() * 900000));
    db.prepare("UPDATE users SET verification_code = ?, updated_at = datetime('now') WHERE id = ?")
      .run(newCode, req.user.id);

              // In production: send via email service
              console.log(`[EMAIL] New verification code for user ${req.user.id}: ${newCode}`);

              res.json({ success: true, message: 'New verification code sent to your email' });
});

// ── POST /auth/forgot-password ───────────────────────────────────
router.post('/forgot-password', authLimiter, (req, res) => {
    const { email } = req.body;
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email?.toLowerCase());

              if (user) {
                    const resetCode = String(Math.floor(100000 + Math.random() * 900000));
                    db.prepare("UPDATE users SET verification_code = ?, updated_at = datetime('now') WHERE id = ?")
                      .run(resetCode, user.id);
                    auditLog(user.id, 'auth.forgot_password', 'user', user.id, {}, req);
                    console.log(`[EMAIL] Password reset code for ${email}: ${resetCode}`);
              }

              // Always return success to prevent email enumeration
              res.json({ success: true, message: 'If the email exists, a reset code has been sent' });
});

// ── POST /auth/change-password ───────────────────────────────────
router.post('/change-password', authRequired, sensitiveOpLimiter, async (req, res) => {
    try {
          const { currentPassword, newPassword } = req.body;

      const pwCheck = validatePassword(newPassword);
          if (!pwCheck.valid) return res.status(400).json({ error: pwCheck.message });

      const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
          const valid = await bcrypt.compare(currentPassword, user.password_hash);
          if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

      const newHash = await bcrypt.hash(newPassword, 12);
          db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?")
            .run(newHash, req.user.id);

      // Revoke all other sessions
      const currentTokenHash = crypto.createHash('sha256').update(
              req.headers.authorization?.replace('Bearer ', '') || ''
            ).digest('hex');
          db.prepare("UPDATE sessions SET revoked = 1 WHERE user_id = ? AND token_hash != ?")
            .run(req.user.id, currentTokenHash);

      auditLog(req.user.id, 'auth.password_changed', 'user', req.user.id, {}, req);
          res.json({ success: true, message: 'Password changed. Other sessions have been logged out.' });
    } catch (err) {
          res.status(500).json({ error: 'Internal server error' });
    }
});

// ── POST /auth/kyc/start ─────────────────────────────────────────
router.post('/kyc/start', authRequired, (req, res) => {
    db.prepare("UPDATE users SET kyc_status = 'pending', updated_at = datetime('now') WHERE id = ?")
      .run(req.user.id);
    auditLog(req.user.id, 'kyc.start', 'user', req.user.id, {}, req);

              // Notify admins
              const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
    for (const admin of admins) {
          db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
            .run('n_' + crypto.randomBytes(8).toString('hex'), admin.id,
                            'New KYC Submission',
                            `User ${req.user.fullName} (${req.user.email}) submitted KYC for review.`, 'admin');
    }
    res.json({ success: true, message: 'KYC submitted for review' });
});

// ── POST /auth/kyc/approve ───────────────────────────────────────
// ★ SECURITY FIX: Only admins can approve KYC — not the user themselves
router.post('/kyc/approve', authRequired, adminRequired, (req, res) => {
    const { userId } = req.body;

              if (!userId) {
                    return res.status(400).json({ error: 'userId is required' });
              }

              const targetUser = db.prepare('SELECT id, full_name, kyc_status FROM users WHERE id = ?').get(userId);
    if (!targetUser) {
          return res.status(404).json({ error: 'User not found' });
    }

              if (targetUser.kyc_status === 'verified') {
                    return res.json({ success: true, message: 'KYC already verified' });
              }

              db.prepare("UPDATE users SET kyc_status = 'verified', kyc_reviewed_by = ?, kyc_reviewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?")
      .run(req.user.id, userId);

              db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run('n_' + crypto.randomBytes(8).toString('hex'), userId,
                    'KYC Verified', 'Your identity has been verified. You can now invest.', 'success');

              auditLog(req.user.id, 'kyc.approve', 'user', userId,
                       { approvedBy: req.user.email, userName: targetUser.full_name }, req);

              res.json({ success: true, message: `KYC approved for ${targetUser.full_name}` });
});

// ── POST /auth/kyc/reject ────────────────────────────────────────
router.post('/kyc/reject', authRequired, adminRequired, (req, res) => {
    const { userId, reason } = req.body;

              if (!userId) {
                    return res.status(400).json({ error: 'userId is required' });
              }

              db.prepare("UPDATE users SET kyc_status = 'rejected', kyc_reviewed_by = ?, kyc_reviewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?")
      .run(req.user.id, userId);

              db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run('n_' + crypto.randomBytes(8).toString('hex'), userId,
                    'KYC Rejected', reason || 'Your KYC verification was not approved. Please resubmit.', 'warning');

              auditLog(req.user.id, 'kyc.reject', 'user', userId,
                       { rejectedBy: req.user.email, reason: reason || 'No reason provided' }, req);

              res.json({ success: true });
});

export default router;
