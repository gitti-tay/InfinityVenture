// ═══════════════════════════════════════════════════════════════════
//  Admin Routes — /api/admin/*
//  Dashboard, User Management, KYC, Fund Approval, Wallet, Settings
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db, { getSetting, getSettingNumber } from '../db.js';
import { authRequired, adminRequired, superadminRequired, formatUser, generateToken } from '../middleware/auth.js';
import { auditLog, strictLimiter, validateId, validatePagination } from '../middleware/security.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authRequired, adminRequired);

// Validate URL parameters (prevent injection via route params)
router.param('userId', (req, res, next, id) => {
  if (!validateId(id)) return res.status(400).json({ error: 'Invalid user ID format' });
  next();
});
router.param('txId', (req, res, next, id) => {
  if (!validateId(id)) return res.status(400).json({ error: 'Invalid transaction ID format' });
  next();
});
router.param('walletId', (req, res, next, id) => {
  if (!validateId(id)) return res.status(400).json({ error: 'Invalid wallet ID format' });
  next();
});

// ══════════════════════════════════════════════════════════════════
//  DASHBOARD — Overview statistics
// ══════════════════════════════════════════════════════════════════
router.get('/dashboard', (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('user').c;
  const newUsersToday = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user' AND date(created_at) = date('now')").get().c;
  const newUsersWeek = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user' AND created_at >= datetime('now', '-7 days')").get().c;
  const verifiedUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE kyc_status = 'verified' AND role = 'user'").get().c;
  const suspendedUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE is_suspended = 1").get().c;
  const pendingKYC = db.prepare("SELECT COUNT(*) as c FROM users WHERE kyc_status = 'pending'").get().c;

  const totalDeposits = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'deposit' AND status = 'completed'").get().total;
  const totalWithdrawals = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'withdraw' AND status = 'completed'").get().total;
  const totalInvested = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM investments WHERE status = 'active'").get().total;
  const pendingDeposits = db.prepare("SELECT COUNT(*) as c, COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'deposit' AND status IN ('pending','requires_approval')").get();
  const pendingWithdrawals = db.prepare("SELECT COUNT(*) as c, COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'withdraw' AND status IN ('pending','requires_approval')").get();

  const totalFees = db.prepare("SELECT COALESCE(SUM(fee), 0) as total FROM transactions WHERE status = 'completed' AND fee > 0").get().total;
  const activeInvestments = db.prepare("SELECT COUNT(*) as c FROM investments WHERE status = 'active'").get().c;

  const recentTransactions = db.prepare(`
    SELECT t.*, u.full_name, u.email FROM transactions t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC LIMIT 20
  `).all().map(formatTxAdmin);

  // Recent signups (for admin dashboard real-time)
  const recentUsers = db.prepare(`
    SELECT id, email, full_name, role, kyc_status, email_verified, created_at
    FROM users ORDER BY created_at DESC LIMIT 10
  `).all().map(u => ({
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    role: u.role,
    kycStatus: u.kyc_status,
    emailVerified: !!u.email_verified,
    createdAt: u.created_at,
  }));

  const dailyStats = db.prepare(`
    SELECT date(created_at) as day,
      SUM(CASE WHEN type='deposit' AND status='completed' THEN amount ELSE 0 END) as deposits,
      SUM(CASE WHEN type='withdraw' AND status='completed' THEN amount ELSE 0 END) as withdrawals,
      SUM(CASE WHEN type='invest' AND status='completed' THEN amount ELSE 0 END) as investments
    FROM transactions
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY date(created_at)
    ORDER BY day DESC
  `).all();

  res.json({
    success: true,
    dashboard: {
      users: { total: totalUsers, newToday: newUsersToday, newWeek: newUsersWeek, verified: verifiedUsers, suspended: suspendedUsers, pendingKYC },
      finance: {
        totalDeposits, totalWithdrawals, totalInvested, totalFees,
        netInflow: totalDeposits - totalWithdrawals,
        pendingDeposits: { count: pendingDeposits.c, amount: pendingDeposits.total },
        pendingWithdrawals: { count: pendingWithdrawals.c, amount: pendingWithdrawals.total },
        activeInvestments,
      },
      recentTransactions,
          recentUsers,
      dailyStats,
    },
  });
});

// ══════════════════════════════════════════════════════════════════
//  USER MANAGEMENT
// ══════════════════════════════════════════════════════════════════
router.get('/users', (req, res) => {
  const { search, role, kyc_status, suspended, sort = 'created_at', order = 'DESC', limit = '50', offset = '0' } = req.query;
  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (role) { where += ' AND u.role = ?'; params.push(role); }
  if (kyc_status) { where += ' AND u.kyc_status = ?'; params.push(kyc_status); }
  if (suspended === 'true') { where += ' AND u.is_suspended = 1'; }
  if (suspended === 'false') { where += ' AND u.is_suspended = 0'; }

  const allowedSort = ['created_at', 'email', 'full_name', 'kyc_status'];
  const sortCol = allowedSort.includes(sort) ? `u.${sort}` : 'u.created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const total = db.prepare(`SELECT COUNT(*) as c FROM users u ${where}`).get(...params).c;
  params.push(parseInt(limit), parseInt(offset));

  const users = db.prepare(`
    SELECT u.*, w.balance as wallet_balance, w.address as wallet_address,
      (SELECT COUNT(*) FROM investments WHERE user_id = u.id AND status = 'active') as active_investments,
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = u.id AND type = 'deposit' AND status = 'completed') as total_deposited
    FROM users u
    LEFT JOIN wallets w ON w.user_id = u.id AND w.connected = 1
    ${where}
    ORDER BY ${sortCol} ${sortOrder}
    LIMIT ? OFFSET ?
  `).all(...params);

  res.json({
    success: true,
    users: users.map(u => ({
      ...formatUser(u),
      walletBalance: u.wallet_balance || 0,
      walletAddress: u.wallet_address || null,
      activeInvestments: u.active_investments || 0,
      totalDeposited: u.total_deposited || 0,
      lastLoginAt: u.last_login_at,
      loginAttempts: u.login_attempts,
    })),
    total,
  });
});

// Get single user detail
router.get('/users/:userId', (req, res) => {
  const user = db.prepare(`
    SELECT u.*, w.balance as wallet_balance, w.address as wallet_address, w.provider as wallet_provider, w.network as wallet_network
    FROM users u LEFT JOIN wallets w ON w.user_id = u.id AND w.connected = 1
    WHERE u.id = ?
  `).get(req.params.userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const transactions = db.prepare(`
    SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
  `).all(user.id);

  const investments = db.prepare(`
    SELECT * FROM investments WHERE user_id = ? ORDER BY created_at DESC
  `).all(user.id);

  const kycDocs = db.prepare(`
    SELECT * FROM kyc_documents WHERE user_id = ? ORDER BY created_at DESC
  `).all(user.id);

  res.json({
    success: true,
    user: {
      ...formatUser(user),
      walletBalance: user.wallet_balance || 0,
      walletAddress: user.wallet_address,
      walletProvider: user.wallet_provider,
      walletNetwork: user.wallet_network,
      suspendedReason: user.suspended_reason,
      lastLoginAt: user.last_login_at,
      lastLoginIp: user.last_login_ip,
    },
    transactions: transactions.map(formatTxAdmin),
    investments,
    kycDocuments: kycDocs,
  });
});

// Suspend/Unsuspend user
router.post('/users/:userId/suspend', (req, res) => {
  const { reason } = req.body;
  const user = db.prepare('SELECT id, full_name, role FROM users WHERE id = ?').get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'superadmin') return res.status(403).json({ error: 'Cannot suspend superadmin' });

  db.prepare("UPDATE users SET is_suspended = 1, suspended_reason = ?, updated_at = datetime('now') WHERE id = ?")
    .run(reason || 'Suspended by admin', user.id);

  auditLog(req.user.id, 'user.suspend', 'user', user.id, { reason }, req);
  res.json({ success: true });
});

router.post('/users/:userId/unsuspend', (req, res) => {
  db.prepare("UPDATE users SET is_suspended = 0, suspended_reason = NULL, login_attempts = 0, locked_until = NULL, updated_at = datetime('now') WHERE id = ?")
    .run(req.params.userId);

  auditLog(req.user.id, 'user.unsuspend', 'user', req.params.userId, {}, req);
  res.json({ success: true });
});

// Manually adjust user balance (admin)
router.post('/users/:userId/adjust-balance', superadminRequired, (req, res) => {
  const { amount, reason, type = 'credit' } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.params.userId);
  if (!wallet) return res.status(400).json({ error: 'User has no wallet' });

  if (type === 'debit' && wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance for debit' });
  }

  // Use separate statements instead of dynamic operator (SQLi-safe)
  if (type === 'debit') {
    db.prepare("UPDATE wallets SET balance = balance - ?, updated_at = datetime('now') WHERE user_id = ?")
      .run(amount, req.params.userId);
  } else {
    db.prepare("UPDATE wallets SET balance = balance + ?, updated_at = datetime('now') WHERE user_id = ?")
      .run(amount, req.params.userId);
  }

  // Record as admin transaction
  const txId = 'tx_adm_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO transactions (id, user_id, type, amount, currency, method, status, description, metadata)
    VALUES (?, ?, ?, ?, 'USD', 'admin_adjustment', 'completed', ?, ?)
  `).run(
    txId, req.params.userId,
    type === 'debit' ? 'withdraw' : 'deposit',
    amount,
    `Admin ${type}: ${reason || 'Manual adjustment'}`,
    JSON.stringify({ adminId: req.user.id, reason, type })
  );

  auditLog(req.user.id, 'admin.balance_adjust', 'user', req.params.userId, { amount, type, reason }, req);

  const newBalance = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(req.params.userId).balance;
  res.json({ success: true, balance: newBalance, transactionId: txId });
});

// ══════════════════════════════════════════════════════════════════
//  KYC REVIEW
// ══════════════════════════════════════════════════════════════════
router.get('/kyc/pending', (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.email, u.full_name, u.phone, u.kyc_status, u.created_at,
      (SELECT COUNT(*) FROM kyc_documents WHERE user_id = u.id) as doc_count
    FROM users u WHERE u.kyc_status = 'pending'
    ORDER BY u.updated_at ASC
  `).all();

  res.json({ success: true, users });
});

router.post('/kyc/:userId/approve', (req, res) => {
  const user = db.prepare("SELECT id FROM users WHERE id = ? AND kyc_status = 'pending'").get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found or not pending KYC' });

  db.prepare(`
    UPDATE users SET kyc_status = 'verified', kyc_reviewed_by = ?, kyc_reviewed_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(req.user.id, user.id);

  // Notify user
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, 'KYC Approved', 'Your identity verification has been approved. You now have full access.', 'success')
  `).run('n_' + crypto.randomBytes(8).toString('hex'), user.id);

  auditLog(req.user.id, 'kyc.approve', 'user', user.id, {}, req);
  res.json({ success: true });
});

router.post('/kyc/:userId/reject', (req, res) => {
  const { reason } = req.body;
  const user = db.prepare("SELECT id FROM users WHERE id = ? AND kyc_status = 'pending'").get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found or not pending KYC' });

  db.prepare(`
    UPDATE users SET kyc_status = 'rejected', kyc_reviewed_by = ?, kyc_reviewed_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(req.user.id, user.id);

  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, 'KYC Rejected', ?, 'warning')
  `).run('n_' + crypto.randomBytes(8).toString('hex'), user.id, `Your identity verification was not approved. Reason: ${reason || 'Documents insufficient'}. Please resubmit.`);

  auditLog(req.user.id, 'kyc.reject', 'user', user.id, { reason }, req);
  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════
//  TRANSACTION APPROVAL (Deposits & Withdrawals)
// ══════════════════════════════════════════════════════════════════
router.get('/transactions/pending', (req, res) => {
  const { type } = req.query;
  let where = "WHERE t.status IN ('pending','requires_approval')";
  const params = [];

  if (type) { where += ' AND t.type = ?'; params.push(type); }

  const txs = db.prepare(`
    SELECT t.*, u.full_name, u.email, u.kyc_status
    FROM transactions t JOIN users u ON t.user_id = u.id
    ${where}
    ORDER BY t.created_at ASC
  `).all(...params);

  res.json({ success: true, transactions: txs.map(formatTxAdmin) });
});

router.post('/transactions/:txId/approve', (req, res) => {
  try {
  const { note } = req.body;
  const tx = db.prepare("SELECT * FROM transactions WHERE id = ? AND status IN ('pending','requires_approval')").get(req.params.txId);
  if (!tx) return res.status(404).json({ error: 'Transaction not found or already processed' });

  const execute = db.transaction(() => {
    db.prepare(`
      UPDATE transactions SET status = 'completed', reviewed_by = ?, reviewed_at = datetime('now'), review_note = ?
      WHERE id = ?
    `).run(req.user.id, note || null, tx.id);

    // Apply balance change
    if (tx.type === 'deposit') {
      // Ensure wallet exists
      let wallet = db.prepare('SELECT id FROM wallets WHERE user_id = ?').get(tx.user_id);
      if (!wallet) {
        db.prepare(`INSERT INTO wallets (id, user_id, provider, address, network, balance, connected)
          VALUES (?, ?, 'internal', ?, 'Ethereum', 0, 1)`)
          .run('w_' + crypto.randomBytes(8).toString('hex'), tx.user_id, '0x' + crypto.randomBytes(20).toString('hex'));
      }
      db.prepare("UPDATE wallets SET balance = balance + ?, updated_at = datetime('now') WHERE user_id = ?")
        .run(tx.net_amount || tx.amount, tx.user_id);
    }
    // NOTE: Withdrawals already deducted balance at request time (hold).
    // Do NOT deduct again here — just mark as completed.

    // Notify user
    db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run(
        'n_' + crypto.randomBytes(8).toString('hex'), tx.user_id,
        tx.type === 'deposit' ? 'Deposit Approved' : 'Withdrawal Approved',
        `Your ${tx.type} of $${tx.amount.toLocaleString()} has been approved.`,
        tx.type
      );
  });

  execute();
  auditLog(req.user.id, `admin.${tx.type}.approve`, 'transaction', tx.id, { amount: tx.amount, note }, req);
  res.json({ success: true });
  } catch (err) {
    console.error('Transaction approve error:', err);
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

router.post('/transactions/:txId/reject', (req, res) => {
  try {
  const { note } = req.body;
  const tx = db.prepare("SELECT * FROM transactions WHERE id = ? AND status IN ('pending','requires_approval')").get(req.params.txId);
  if (!tx) return res.status(404).json({ error: 'Transaction not found or already processed' });

  const execute = db.transaction(() => {
    db.prepare(`
      UPDATE transactions SET status = 'cancelled', reviewed_by = ?, reviewed_at = datetime('now'), review_note = ?
      WHERE id = ?
    `).run(req.user.id, note || null, tx.id);

    // Refund if withdrawal was pre-deducted
    if (tx.type === 'withdraw') {
      db.prepare("UPDATE wallets SET balance = balance + ?, updated_at = datetime('now') WHERE user_id = ?")
        .run(tx.amount, tx.user_id);
    }

    db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run(
        'n_' + crypto.randomBytes(8).toString('hex'), tx.user_id,
        tx.type === 'deposit' ? 'Deposit Rejected' : 'Withdrawal Rejected',
        `Your ${tx.type} of $${tx.amount.toLocaleString()} was not approved. ${note ? 'Reason: ' + note : 'Please contact support.'}`,
        'warning'
      );
  });

  execute();
  auditLog(req.user.id, `admin.${tx.type}.reject`, 'transaction', tx.id, { amount: tx.amount, note }, req);
  res.json({ success: true });
  } catch (err) {
    console.error('Transaction reject error:', err);
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
});

// ══════════════════════════════════════════════════════════════════
//  ADMIN WALLETS (Company receiving wallets)
// ══════════════════════════════════════════════════════════════════
router.get('/wallets', (req, res) => {
  const wallets = db.prepare(`
    SELECT aw.*, u.full_name as created_by_name
    FROM admin_wallets aw
    LEFT JOIN users u ON aw.created_by = u.id
    ORDER BY aw.created_at DESC
  `).all();

  res.json({ success: true, wallets });
});

router.post('/wallets', superadminRequired, (req, res) => {
  const { label, address, network, currency, walletType } = req.body;
  if (!label || !address || !network || !currency) {
    return res.status(400).json({ error: 'Label, address, network, and currency are required' });
  }

  const id = 'aw_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO admin_wallets (id, label, address, network, currency, wallet_type, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, label, address, network, currency, walletType || 'deposit', req.user.id);

  auditLog(req.user.id, 'admin.wallet.create', 'admin_wallet', id, { label, address, network }, req);

  const wallet = db.prepare('SELECT * FROM admin_wallets WHERE id = ?').get(id);
  res.json({ success: true, wallet });
});

router.put('/wallets/:walletId', superadminRequired, (req, res) => {
  const { label, address, network, currency, isActive } = req.body;
  const wallet = db.prepare('SELECT * FROM admin_wallets WHERE id = ?').get(req.params.walletId);
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const updates = [];
  const params = [];
  if (label !== undefined) { updates.push('label = ?'); params.push(label); }
  if (address !== undefined) { updates.push('address = ?'); params.push(address); }
  if (network !== undefined) { updates.push('network = ?'); params.push(network); }
  if (currency !== undefined) { updates.push('currency = ?'); params.push(currency); }
  if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push("updated_at = datetime('now')");
  params.push(req.params.walletId);

  db.prepare(`UPDATE admin_wallets SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  auditLog(req.user.id, 'admin.wallet.update', 'admin_wallet', req.params.walletId, req.body, req);

  const updated = db.prepare('SELECT * FROM admin_wallets WHERE id = ?').get(req.params.walletId);
  res.json({ success: true, wallet: updated });
});

router.delete('/wallets/:walletId', superadminRequired, (req, res) => {
  db.prepare('DELETE FROM admin_wallets WHERE id = ?').run(req.params.walletId);
  auditLog(req.user.id, 'admin.wallet.delete', 'admin_wallet', req.params.walletId, {}, req);
  res.json({ success: true });
});

// Get admin wallet addresses for user-facing deposit
router.get('/wallets/deposit-addresses', (req, res) => {
  const wallets = db.prepare(`
    SELECT id, label, address, network, currency FROM admin_wallets
    WHERE wallet_type = 'deposit' AND is_active = 1
    ORDER BY currency, network
  `).all();
  res.json({ success: true, wallets });
});

// ══════════════════════════════════════════════════════════════════
//  SYSTEM SETTINGS
// ══════════════════════════════════════════════════════════════════
router.get('/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM system_settings ORDER BY key').all();
  const map = {};
  for (const s of settings) {
    map[s.key] = { value: s.value, description: s.description, updatedAt: s.updated_at };
  }
  res.json({ success: true, settings: map });
});

router.put('/settings', superadminRequired, (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings object required' });
  }

  const update = db.prepare(`
    UPDATE system_settings SET value = ?, updated_by = ?, updated_at = datetime('now')
    WHERE key = ?
  `);

  const updateMany = db.transaction(() => {
    for (const [key, value] of Object.entries(settings)) {
      update.run(String(value), req.user.id, key);
    }
  });

  updateMany();
  auditLog(req.user.id, 'admin.settings.update', 'system_settings', null, settings, req);

  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════
//  AUDIT LOGS
// ══════════════════════════════════════════════════════════════════
router.get('/audit-logs', (req, res) => {
  const { action, user_id, limit = '100', offset = '0' } = req.query;
  let where = 'WHERE 1=1';
  const params = [];

  if (action) { where += ' AND al.action LIKE ?'; params.push(`%${action}%`); }
  if (user_id) { where += ' AND al.user_id = ?'; params.push(user_id); }

  params.push(parseInt(limit), parseInt(offset));

  const logs = db.prepare(`
    SELECT al.*, u.full_name, u.email
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ${where}
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params);

  res.json({
    success: true,
    logs: logs.map(l => ({
      id: l.id,
      userId: l.user_id,
      userName: l.full_name,
      userEmail: l.email,
      action: l.action,
      resourceType: l.resource_type,
      resourceId: l.resource_id,
      details: l.details ? tryParse(l.details) : null,
      ipAddress: l.ip_address,
      createdAt: l.created_at,
    })),
  });
});

// ══════════════════════════════════════════════════════════════════
//  ADMIN ACCOUNT MANAGEMENT
// ══════════════════════════════════════════════════════════════════
router.post('/create-admin', superadminRequired, (req, res) => {
  const { email, password, fullName, role = 'admin' } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  if (!['admin', 'superadmin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const id = 'u_adm_' + crypto.randomBytes(8).toString('hex');
  const hash = bcrypt.hashSync(password, 12);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, email_verified, kyc_status, referral_code)
    VALUES (?, ?, ?, ?, ?, 1, 'verified', ?)
  `).run(id, email.toLowerCase(), hash, fullName, role, 'IVADM' + crypto.randomBytes(4).toString('hex').toUpperCase());

  auditLog(req.user.id, 'admin.create_admin', 'user', id, { email, role }, req);
  res.json({ success: true, userId: id });
});

// ══════════════════════════════════════════════════════════════════
//  REPORTS & EXPORTS
// ══════════════════════════════════════════════════════════════════
router.get('/reports/summary', (req, res) => {
  const { from, to } = req.query;
  let dateWhere = '';
  const params = [];

  if (from) { dateWhere += ' AND created_at >= ?'; params.push(from); }
  if (to) { dateWhere += ' AND created_at <= ?'; params.push(to); }

  const deposits = db.prepare(`SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM transactions WHERE type='deposit' AND status='completed' ${dateWhere}`).get(...params);
  const withdrawals = db.prepare(`SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM transactions WHERE type='withdraw' AND status='completed' ${dateWhere}`).get(...params);
  const investments = db.prepare(`SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM investments WHERE status='active' ${dateWhere}`).get(...params);
  const fees = db.prepare(`SELECT COALESCE(SUM(fee),0) as total FROM transactions WHERE status='completed' AND fee > 0 ${dateWhere}`).get(...params);
  const newUsers = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role='user' ${dateWhere}`).get(...params);

  res.json({
    success: true,
    report: {
      period: { from: from || 'all', to: to || 'now' },
      deposits: { total: deposits.total, count: deposits.count },
      withdrawals: { total: withdrawals.total, count: withdrawals.count },
      investments: { total: investments.total, count: investments.count },
      fees: fees.total,
      netRevenue: deposits.total - withdrawals.total + fees.total,
      newUsers: newUsers.count,
    },
  });
});

// ══════════════════════════════════════════════════════════════════
//  PROJECT MANAGEMENT (CRUD)
// ══════════════════════════════════════════════════════════════════
router.get('/projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  res.json({ success: true, projects: projects.map(p => ({ ...p, plans: p.plans ? tryParse(p.plans) : [] })) });
});

router.post('/projects', superadminRequired, (req, res) => {
  const { name, symbol, category, plans } = req.body;
  if (!name || !symbol || !category) return res.status(400).json({ error: 'Name, symbol, category required' });
  const id = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b = req.body;
  db.prepare(`INSERT INTO projects (id,name,symbol,location,category,region,description,image,series,badge,asset_id,risk_level,target_amount,min_investment,max_investment,plans,is_featured,created_by)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id,name,symbol,b.location||'',category,b.region||'',b.description||'',b.image||'',b.series||'',b.badge||'',b.assetId||'',b.riskLevel||'Medium',b.targetAmount||0,b.minInvestment||500,b.maxInvestment||500000,typeof plans==='string'?plans:JSON.stringify(plans||[]),b.isFeatured?1:0,req.user.id);
  auditLog(req.user.id, 'admin.project.create', 'project', id, { name }, req);
  res.json({ success: true, projectId: id });
});

router.put('/projects/:projectId', superadminRequired, (req, res) => {
  if (!db.prepare('SELECT id FROM projects WHERE id=?').get(req.params.projectId)) return res.status(404).json({ error: 'Not found' });
  // Whitelist of allowed columns (prevents SQL injection via dynamic SET)
  const ALLOWED_COLS = new Map([
    ['name','name'],['symbol','symbol'],['location','location'],['category','category'],
    ['region','region'],['description','description'],['image','image'],['series','series'],
    ['badge','badge'],['riskLevel','risk_level'],['targetAmount','target_amount'],
    ['minInvestment','min_investment'],['maxInvestment','max_investment'],
    ['isActive','is_active'],['isFeatured','is_featured'],
  ]);
  const setClauses = [];
  const params = [];
  for (const [bodyKey, dbCol] of ALLOWED_COLS) {
    if (req.body[bodyKey] !== undefined) {
      // Double-check column name is alphanumeric+underscore only
      if (!/^[a-z_]+$/.test(dbCol)) continue;
      setClauses.push(dbCol + '=?');
      params.push(req.body[bodyKey]);
    }
  }
  if (req.body.plans !== undefined) {
    setClauses.push('plans=?');
    params.push(typeof req.body.plans === 'string' ? req.body.plans : JSON.stringify(req.body.plans));
  }
  if (!setClauses.length) return res.status(400).json({ error: 'No fields' });
  setClauses.push("updated_at=datetime('now')");
  params.push(req.params.projectId);
  db.prepare('UPDATE projects SET ' + setClauses.join(',') + ' WHERE id=?').run(...params);
  auditLog(req.user.id,'admin.project.update','project',req.params.projectId,req.body,req);
  res.json({ success: true });
});

router.delete('/projects/:projectId', superadminRequired, (req, res) => {
  const c = db.prepare("SELECT COUNT(*) as c FROM investments WHERE project_id=? AND status='active'").get(req.params.projectId).c;
  if (c>0) return res.status(400).json({ error: `Cannot delete: ${c} active investments` });
  db.prepare('DELETE FROM projects WHERE id=?').run(req.params.projectId);
  auditLog(req.user.id,'admin.project.delete','project',req.params.projectId,{},req);
  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════
//  SUPPORT TICKET MANAGEMENT
// ══════════════════════════════════════════════════════════════════
router.get('/support/tickets', (req, res) => {
  const { status } = req.query; let where='WHERE 1=1'; const params=[];
  if (status) { where+=' AND t.status=?'; params.push(status); }
  const tickets = db.prepare(`SELECT t.*,u.full_name as user_name,u.email as user_email,(SELECT COUNT(*) FROM support_messages WHERE ticket_id=t.id) as message_count FROM support_tickets t JOIN users u ON t.user_id=u.id ${where} ORDER BY CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,t.updated_at DESC`).all(...params);
  res.json({ success: true, tickets });
});

router.post('/support/tickets/:id/reply', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  const ticket = db.prepare('SELECT * FROM support_tickets WHERE id=?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Not found' });
  db.prepare(`INSERT INTO support_messages (id,ticket_id,sender_id,message,is_admin) VALUES (?,?,?,?,1)`)
    .run('msg_'+crypto.randomBytes(8).toString('hex'),ticket.id,req.user.id,message);
  db.prepare("UPDATE support_tickets SET status='in_progress',assigned_to=?,updated_at=datetime('now') WHERE id=?").run(req.user.id,ticket.id);
  db.prepare(`INSERT INTO notifications (id,user_id,title,message,type) VALUES (?,?,?,?,?)`)
    .run('n_'+crypto.randomBytes(8).toString('hex'),ticket.user_id,'Support Reply',`Reply on: ${ticket.subject}`,'info');
  res.json({ success: true });
});

router.put('/support/tickets/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['open','in_progress','waiting','resolved','closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare("UPDATE support_tickets SET status=?,updated_at=datetime('now') WHERE id=?").run(status,req.params.id);
  res.json({ success: true });
});

// ══════════════════════════════════════════════════════════════════
//  YIELD PAYOUT (manual trigger)
// ══════════════════════════════════════════════════════════════════
router.post('/yield-payouts/trigger', superadminRequired, (req, res) => {
  const activeInvs = db.prepare("SELECT * FROM investments WHERE status='active'").all();
  let totalPaid=0, count=0;
  const payout = db.transaction(() => {
    for (const inv of activeInvs) {
      const monthlyYield = parseFloat(((inv.amount * inv.apy / 100) / 12).toFixed(2));
      const period = new Date().toISOString().slice(0,7);
      if (db.prepare('SELECT id FROM yield_payouts WHERE investment_id=? AND period=?').get(inv.id,period)) continue;
      const payoutId='yp_'+crypto.randomBytes(8).toString('hex');
      const txId='tx_yld_'+crypto.randomBytes(8).toString('hex');
      db.prepare("UPDATE wallets SET balance=balance+?,updated_at=datetime('now') WHERE user_id=?").run(monthlyYield,inv.user_id);
      db.prepare(`INSERT INTO transactions (id,user_id,type,amount,currency,method,status,description) VALUES (?,?,'yield',?,'USD','auto_payout','completed',?)`)
        .run(txId,inv.user_id,monthlyYield,`Yield: ${inv.project_name} - ${inv.plan_name} (${period})`);
      db.prepare(`INSERT INTO yield_payouts (id,investment_id,user_id,amount,period,transaction_id) VALUES (?,?,?,?,?,?)`)
        .run(payoutId,inv.id,inv.user_id,monthlyYield,period,txId);
      db.prepare("UPDATE investments SET total_earned=total_earned+?,monthly_yield=? WHERE id=?").run(monthlyYield,monthlyYield,inv.id);
      db.prepare(`INSERT INTO notifications (id,user_id,title,message,type) VALUES (?,?,?,?,?)`)
        .run('n_'+crypto.randomBytes(8).toString('hex'),inv.user_id,'Yield Payout',`$${monthlyYield.toFixed(2)} earned from ${inv.project_name}`,'investment');
      totalPaid+=monthlyYield; count++;
    }
  });
  payout();
  auditLog(req.user.id,'admin.yield_payout',null,null,{totalPaid,count},req);
  res.json({ success: true, totalPaid, investmentsPaid: count });
});

router.get('/yield-payouts', (req, res) => {
  const payouts = db.prepare(`SELECT yp.*,u.full_name,u.email,i.project_name FROM yield_payouts yp JOIN users u ON yp.user_id=u.id JOIN investments i ON yp.investment_id=i.id ORDER BY yp.created_at DESC LIMIT 200`).all();
  res.json({ success: true, payouts });
});

// ══════════════════════════════════════════════════════════════════
//  REFERRAL BONUSES
// ══════════════════════════════════════════════════════════════════
router.get('/referrals', (req, res) => {
  const bonuses = db.prepare(`SELECT rb.*,u1.full_name as referrer_name,u1.email as referrer_email,u2.full_name as referred_name FROM referral_bonuses rb JOIN users u1 ON rb.referrer_id=u1.id JOIN users u2 ON rb.referred_id=u2.id ORDER BY rb.created_at DESC LIMIT 100`).all();
  const stats = {
    totalCredited: db.prepare("SELECT COALESCE(SUM(bonus_amount),0) as t FROM referral_bonuses WHERE status='credited'").get().t,
    totalPending: db.prepare("SELECT COALESCE(SUM(bonus_amount),0) as t FROM referral_bonuses WHERE status='pending'").get().t,
  };
  res.json({ success: true, bonuses, stats });
});

// ══════════════════════════════════════════════════════════════════
//  LOGIN HISTORY
// ══════════════════════════════════════════════════════════════════
router.get('/login-history', (req, res) => {
  const { user_id, limit='100' } = req.query;
  let where='WHERE 1=1'; const params=[];
  if (user_id) { where+=' AND lh.user_id=?'; params.push(user_id); }
  params.push(parseInt(limit));
  const history = db.prepare(`SELECT lh.*,u.full_name,u.email FROM login_history lh JOIN users u ON lh.user_id=u.id ${where} ORDER BY lh.created_at DESC LIMIT ?`).all(...params);
  res.json({ success: true, history });
});

// ── Helpers ─────────────────────────────────────────────────────
function formatTxAdmin(tx) {
  return {
    id: tx.id,
    userId: tx.user_id,
    userName: tx.full_name,
    userEmail: tx.email,
    userKycStatus: tx.kyc_status,
    type: tx.type,
    amount: tx.amount,
    fee: tx.fee || 0,
    netAmount: tx.net_amount,
    currency: tx.currency,
    method: tx.method,
    status: tx.status,
    txHash: tx.tx_hash,
    fromAddress: tx.from_address,
    toAddress: tx.to_address,
    description: tx.description,
    metadata: tx.metadata ? tryParse(tx.metadata) : null,
    reviewedBy: tx.reviewed_by,
    reviewedAt: tx.reviewed_at,
    reviewNote: tx.review_note,
    createdAt: tx.created_at,
  };
}

function tryParse(str) {
  try { return JSON.parse(str); } catch { return str; }
}

export default router;
