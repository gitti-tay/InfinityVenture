// ═══════════════════════════════════════════════════════════════════
//  Compliance & AML Routes — /api/compliance/*
//  Withdrawal whitelist, AML monitoring, transaction scanning
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db, { getSetting, getSettingNumber, getSettingBool } from '../db.js';
import { authRequired, adminRequired, superadminRequired } from '../middleware/auth.js';
import { auditLog, strictLimiter, validateId } from '../middleware/security.js';

const router = Router();

// ════════════════════════════════════════════════════════════════
//  USER: WITHDRAWAL ADDRESS WHITELIST
// ════════════════════════════════════════════════════════════════

// ── GET /compliance/withdrawal-addresses ──────────────────────
router.get('/withdrawal-addresses', authRequired, (req, res) => {
  const addresses = db.prepare(`
    SELECT * FROM withdrawal_addresses WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC
  `).all(req.user.id);

  res.json({ success: true, addresses });
});

// ── POST /compliance/withdrawal-addresses ─────────────────────
router.post('/withdrawal-addresses', authRequired, strictLimiter, (req, res) => {
  const { label, address, network, currency } = req.body;

  if (!label || !address || !network) {
    return res.status(400).json({ error: 'Label, address, and network are required' });
  }

  // Validate address format (basic checks)
  if (address.length < 10 || address.length > 128) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  // Check for duplicates
  const existing = db.prepare(
    'SELECT id FROM withdrawal_addresses WHERE user_id = ? AND address = ? AND network = ? AND is_active = 1'
  ).get(req.user.id, address, network);

  if (existing) {
    return res.status(409).json({ error: 'This address is already whitelisted' });
  }

  // Limit whitelist entries
  const count = db.prepare('SELECT COUNT(*) as c FROM withdrawal_addresses WHERE user_id = ? AND is_active = 1').get(req.user.id).c;
  if (count >= 10) {
    return res.status(400).json({ error: 'Maximum 10 withdrawal addresses allowed' });
  }

  const id = 'wa_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO withdrawal_addresses (id, user_id, label, address, network, currency, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `).run(id, req.user.id, label, address, network, currency || 'USDT');

  auditLog(req.user.id, 'compliance.whitelist_add', 'withdrawal_address', id, { address, network }, req);

  res.json({ success: true, addressId: id });
});

// ── DELETE /compliance/withdrawal-addresses/:id ───────────────
router.delete('/withdrawal-addresses/:id', authRequired, (req, res) => {
  const addr = db.prepare('SELECT * FROM withdrawal_addresses WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!addr) return res.status(404).json({ error: 'Address not found' });

  db.prepare('UPDATE withdrawal_addresses SET is_active = 0 WHERE id = ?').run(req.params.id);
  auditLog(req.user.id, 'compliance.whitelist_remove', 'withdrawal_address', req.params.id, { address: addr.address }, req);

  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════════
//  USER: PASSWORD RESET (TOKEN-BASED)
// ════════════════════════════════════════════════════════════════

// ── POST /compliance/password-reset/request ───────────────────
router.post('/password-reset/request', strictLimiter, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get(email);

  // Always return success to prevent email enumeration
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  // Invalidate previous tokens
  db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0").run(user.id);

  // Generate token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiryMinutes = getSettingNumber('password_reset_expiry_minutes') || 30;
  const expiresAt = new Date(Date.now() + expiryMinutes * 60000).toISOString();

  db.prepare(`
    INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).run('prt_' + crypto.randomBytes(8).toString('hex'), user.id, tokenHash, expiresAt);

  // In production, send email. For MVP, log and return token (dev mode only)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV] Password reset token for ${email}: ${rawToken}`);
    return res.json({ success: true, message: 'Reset token generated', devToken: rawToken });
  }

  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
});

// ── POST /compliance/password-reset/confirm ───────────────────
router.post('/password-reset/confirm', strictLimiter, async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  // Password strength check
  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must be 8+ chars with uppercase, lowercase, and number' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetToken = db.prepare(`
    SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used = 0 AND expires_at > datetime('now')
  `).get(tokenHash);

  if (!resetToken) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const bcrypt = (await import('bcryptjs')).default;
  const passwordHash = bcrypt.hashSync(newPassword, 12);

  db.transaction(() => {
    db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(passwordHash, resetToken.user_id);
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').run(resetToken.id);
    // Revoke all sessions
    db.prepare("UPDATE sessions SET revoked = 1 WHERE user_id = ?").run(resetToken.user_id);
  })();

  auditLog(resetToken.user_id, 'auth.password_reset', 'user', resetToken.user_id, {}, req);

  res.json({ success: true, message: 'Password reset successful. Please log in again.' });
});

// ════════════════════════════════════════════════════════════════
//  AML SCANNING ENGINE (called internally)
// ════════════════════════════════════════════════════════════════

export function runAMLCheck(userId, transactionId, amount, type, req) {
  try {
  const flags = [];

  // 1. Large transaction check
  const largeDepositThreshold = getSettingNumber('aml_large_deposit_threshold') || 10000;
  const largeWithdrawalThreshold = getSettingNumber('aml_large_withdrawal_threshold') || 5000;

  if (type === 'deposit' && amount >= largeDepositThreshold) {
    flags.push({
      flag_type: 'large_deposit',
      severity: amount >= largeDepositThreshold * 5 ? 'high' : 'medium',
      description: `Large deposit of $${amount.toLocaleString()} exceeds threshold of $${largeDepositThreshold.toLocaleString()}`
    });
  }

  if (type === 'withdraw' && amount >= largeWithdrawalThreshold) {
    flags.push({
      flag_type: 'large_withdrawal',
      severity: amount >= largeWithdrawalThreshold * 5 ? 'high' : 'medium',
      description: `Large withdrawal of $${amount.toLocaleString()} exceeds threshold of $${largeWithdrawalThreshold.toLocaleString()}`
    });
  }

  // 2. Rapid transaction velocity check
  const rapidCount = getSettingNumber('aml_rapid_tx_count') || 5;
  const rapidWindow = getSettingNumber('aml_rapid_tx_window_minutes') || 60;

  const recentTxCount = db.prepare(`
    SELECT COUNT(*) as c FROM transactions
    WHERE user_id = ? AND created_at >= datetime('now', '-${rapidWindow} minutes')
  `).get(userId).c;

  if (recentTxCount >= rapidCount) {
    flags.push({
      flag_type: 'rapid_transactions',
      severity: 'medium',
      description: `${recentTxCount} transactions in the last ${rapidWindow} minutes (threshold: ${rapidCount})`
    });
  }

  // 3. Velocity check: total amount in 24 hours
  const dailyTotal = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM transactions
    WHERE user_id = ? AND created_at >= datetime('now', '-24 hours')
  `).get(userId).total;

  if (dailyTotal >= 50000) {
    flags.push({
      flag_type: 'velocity_check',
      severity: dailyTotal >= 100000 ? 'critical' : 'high',
      description: `24-hour transaction volume of $${dailyTotal.toLocaleString()} is unusually high`
    });
  }

  // 4. New account with large transaction
  const user = db.prepare('SELECT created_at, kyc_status FROM users WHERE id = ?').get(userId);
  if (user) {
    const accountAge = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (accountAge < 7 && amount >= 5000) {
      flags.push({
        flag_type: 'suspicious_pattern',
        severity: 'medium',
        description: `New account (${Math.floor(accountAge)} days old) making large transaction of $${amount.toLocaleString()}`
      });
    }
  }

  // Insert flags
  for (const flag of flags) {
    db.prepare(`
      INSERT INTO compliance_flags (id, user_id, transaction_id, flag_type, severity, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'cf_' + crypto.randomBytes(8).toString('hex'),
      userId, transactionId, flag.flag_type, flag.severity, flag.description
    );
  }

  // Notify admins of high/critical flags
  const criticalFlags = flags.filter(f => f.severity === 'high' || f.severity === 'critical');
  if (criticalFlags.length > 0) {
    const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
    for (const admin of admins) {
      db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`).run(
        'n_' + crypto.randomBytes(8).toString('hex'), admin.id,
        '⚠️ Compliance Alert',
        `${criticalFlags.length} compliance flag(s) raised for transaction ${transactionId}: ${criticalFlags.map(f => f.description).join('; ')}`,
        'admin'
      );
    }
  }

  return flags;
  } catch (err) {
    console.error('AML check error (non-blocking):', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
//  ADMIN: COMPLIANCE DASHBOARD
// ════════════════════════════════════════════════════════════════

// ── GET /compliance/admin/flags ────────────────────────────────
router.get('/admin/flags', authRequired, adminRequired, (req, res) => {
  const { status, severity, limit = '100', offset = '0' } = req.query;
  let where = 'WHERE 1=1';
  const params = [];

  if (status) { where += ' AND cf.status = ?'; params.push(status); }
  if (severity) { where += ' AND cf.severity = ?'; params.push(severity); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM compliance_flags cf ${where}`).get(...params).c;
  params.push(parseInt(limit), parseInt(offset));

  const flags = db.prepare(`
    SELECT cf.*, u.email as user_email, u.full_name as user_name, u.kyc_status
    FROM compliance_flags cf
    LEFT JOIN users u ON cf.user_id = u.id
    ${where}
    ORDER BY
      CASE cf.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
      cf.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params);

  // Summary stats
  const stats = {
    total: db.prepare('SELECT COUNT(*) as c FROM compliance_flags').get().c,
    open: db.prepare("SELECT COUNT(*) as c FROM compliance_flags WHERE status = 'open'").get().c,
    critical: db.prepare("SELECT COUNT(*) as c FROM compliance_flags WHERE severity = 'critical' AND status = 'open'").get().c,
    high: db.prepare("SELECT COUNT(*) as c FROM compliance_flags WHERE severity = 'high' AND status = 'open'").get().c,
  };

  res.json({ success: true, flags, total, stats });
});

// ── PUT /compliance/admin/flags/:id — Update flag status ──────
router.put('/admin/flags/:id', authRequired, adminRequired, (req, res) => {
  const { status, resolutionNote } = req.body;
  const validStatuses = ['open', 'investigating', 'resolved', 'dismissed', 'escalated'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const flag = db.prepare('SELECT * FROM compliance_flags WHERE id = ?').get(req.params.id);
  if (!flag) return res.status(404).json({ error: 'Flag not found' });

  const isResolved = ['resolved', 'dismissed'].includes(status);
  db.prepare(`
    UPDATE compliance_flags SET status = ?, resolution_note = ?,
    resolved_by = CASE WHEN ? THEN ? ELSE resolved_by END,
    resolved_at = CASE WHEN ? THEN datetime('now') ELSE resolved_at END
    WHERE id = ?
  `).run(status, resolutionNote || flag.resolution_note, isResolved ? 1 : 0, req.user.id, isResolved ? 1 : 0, req.params.id);

  auditLog(req.user.id, 'compliance.flag_update', 'compliance_flag', req.params.id, { status, resolutionNote }, req);

  res.json({ success: true });
});

// ── POST /compliance/admin/manual-flag — Create manual flag ──
router.post('/admin/manual-flag', authRequired, adminRequired, (req, res) => {
  const { userId, description, severity } = req.body;
  if (!userId || !description) {
    return res.status(400).json({ error: 'User ID and description required' });
  }

  const id = 'cf_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO compliance_flags (id, user_id, flag_type, severity, description)
    VALUES (?, ?, 'manual_flag', ?, ?)
  `).run(id, userId, severity || 'medium', description);

  auditLog(req.user.id, 'compliance.manual_flag', 'compliance_flag', id, { userId, description, severity }, req);

  res.json({ success: true, flagId: id });
});

// ── GET /compliance/admin/user-risk/:userId — User risk profile ──
router.get('/admin/user-risk/:userId', authRequired, adminRequired, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const openFlags = db.prepare('SELECT * FROM compliance_flags WHERE user_id = ? AND status IN (\'open\',\'investigating\') ORDER BY created_at DESC').all(req.params.userId);
  const allFlags = db.prepare('SELECT COUNT(*) as c FROM compliance_flags WHERE user_id = ?').get(req.params.userId).c;
  const totalDeposits = db.prepare("SELECT COALESCE(SUM(amount),0) as t FROM transactions WHERE user_id = ? AND type='deposit' AND status='completed'").get(req.params.userId).t;
  const totalWithdrawals = db.prepare("SELECT COALESCE(SUM(amount),0) as t FROM transactions WHERE user_id = ? AND type='withdraw' AND status='completed'").get(req.params.userId).t;
  const recentTx = db.prepare("SELECT COUNT(*) as c FROM transactions WHERE user_id = ? AND created_at >= datetime('now','-24 hours')").get(req.params.userId).c;
  const whitelistedAddresses = db.prepare("SELECT * FROM withdrawal_addresses WHERE user_id = ? AND is_active = 1").all(req.params.userId);

  const accountAgeDays = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

  // Calculate risk score (0-100)
  let riskScore = 0;
  if (user.kyc_status !== 'verified') riskScore += 20;
  if (accountAgeDays < 7) riskScore += 15;
  if (openFlags.length > 0) riskScore += openFlags.length * 10;
  if (totalDeposits > 50000) riskScore += 10;
  if (recentTx > 10) riskScore += 10;
  riskScore = Math.min(100, riskScore);

  res.json({
    success: true,
    riskProfile: {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      kycStatus: user.kyc_status,
      accountAgeDays,
      riskScore,
      riskLevel: riskScore >= 70 ? 'critical' : riskScore >= 40 ? 'high' : riskScore >= 20 ? 'medium' : 'low',
      openFlags,
      totalFlags: allFlags,
      financials: { totalDeposits, totalWithdrawals, recentTx24h: recentTx },
      whitelistedAddresses,
    },
  });
});

// ── GET /compliance/admin/aml-scan — Run AML scan on recent transactions ──
router.post('/admin/aml-scan', authRequired, superadminRequired, (req, res) => {
  const recentTx = db.prepare(`
    SELECT t.*, u.created_at as user_created_at FROM transactions t
    JOIN users u ON t.user_id = u.id
    WHERE t.created_at >= datetime('now', '-24 hours') AND t.status = 'completed'
  `).all();

  let totalFlags = 0;
  for (const tx of recentTx) {
    const flags = runAMLCheck(tx.user_id, tx.id, tx.amount, tx.type, req);
    totalFlags += flags.length;
  }

  // Log the scan
  db.prepare(`
    INSERT INTO scheduled_tasks (id, task_type, status, details, completed_at)
    VALUES (?, 'aml_scan', 'completed', ?, datetime('now'))
  `).run('st_' + crypto.randomBytes(8).toString('hex'), JSON.stringify({ transactionsScanned: recentTx.length, flagsRaised: totalFlags }));

  res.json({ success: true, scanned: recentTx.length, flagsRaised: totalFlags });
});

// ── Admin: Project-Wallet Mapping ─────────────────────────────

// GET /compliance/admin/project-wallets — List project-wallet mappings
router.get('/admin/project-wallets', authRequired, adminRequired, (req, res) => {
  const mappings = db.prepare(`
    SELECT pwm.*, p.name as project_name, p.symbol, aw.label as wallet_label, aw.address, aw.network, aw.currency
    FROM project_wallet_mapping pwm
    LEFT JOIN projects p ON pwm.project_id = p.id
    LEFT JOIN admin_wallets aw ON pwm.admin_wallet_id = aw.id
    ORDER BY p.name
  `).all();

  res.json({ success: true, mappings });
});

// POST /compliance/admin/project-wallets — Assign wallet to project
router.post('/admin/project-wallets', authRequired, superadminRequired, (req, res) => {
  const { projectId, adminWalletId, allocationPercent } = req.body;

  if (!projectId || !adminWalletId) {
    return res.status(400).json({ error: 'Project ID and wallet ID required' });
  }

  // Verify both exist
  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  const wallet = db.prepare('SELECT id FROM admin_wallets WHERE id = ?').get(adminWalletId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const id = 'pwm_' + crypto.randomBytes(8).toString('hex');
  try {
    db.prepare(`
      INSERT INTO project_wallet_mapping (id, project_id, admin_wallet_id, allocation_percent, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, projectId, adminWalletId, allocationPercent || 100, req.user.id);
  } catch (e) {
    return res.status(409).json({ error: 'This project-wallet mapping already exists' });
  }

  auditLog(req.user.id, 'compliance.project_wallet_assign', 'project_wallet_mapping', id, { projectId, adminWalletId }, req);

  res.json({ success: true, mappingId: id });
});

// DELETE /compliance/admin/project-wallets/:id — Remove mapping
router.delete('/admin/project-wallets/:id', authRequired, superadminRequired, (req, res) => {
  db.prepare('DELETE FROM project_wallet_mapping WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
