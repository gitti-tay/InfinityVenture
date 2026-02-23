// ═══════════════════════════════════════════════════════════════════
//  Transaction Routes — /api/transactions/*
//  With approval flow, fees, admin wallet linking
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db, { getSettingBool, getSettingNumber } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { auditLog, validateAmount, strictLimiter } from '../middleware/security.js';
import { runAMLCheck } from './compliance.js';

const router = Router();

// ── GET /transactions ──────────────────────────────────────────
router.get('/', authRequired, (req, res) => {
  const { type, status, limit = '50', offset = '0' } = req.query;
  let where = 'WHERE user_id = ?';
  const params = [req.user.id];

  if (type) { where += ' AND type = ?'; params.push(type); }
  if (status) { where += ' AND status = ?'; params.push(status); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM transactions ${where}`).get(...params).count;
  params.push(parseInt(limit), parseInt(offset));

  const transactions = db.prepare(`
    SELECT * FROM transactions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params);

  res.json({ success: true, transactions: transactions.map(formatTransaction), total });
});

// ── POST /transactions/deposit ─────────────────────────────────
router.post('/deposit', authRequired, strictLimiter, (req, res) => {
  try {
    const { amount, method, currency, txHash } = req.body;

  const minDeposit = getSettingNumber('deposit_min') || 50;
  const maxDeposit = getSettingNumber('deposit_max') || 100000;

  if (!amount || !validateAmount(amount, 0, maxDeposit + 1)) {
    return res.status(400).json({ error: `Invalid deposit amount. Min: $${minDeposit}, Max: $${maxDeposit}` });
  }
  if (amount < minDeposit) {
    return res.status(400).json({ error: `Minimum deposit is $${minDeposit}` });
  }
  if (!method) {
    return res.status(400).json({ error: 'Payment method is required' });
  }

  // Calculate fee
  const feePercent = getSettingNumber('deposit_fee_percent') || 0;
  const fee = parseFloat((amount * feePercent / 100).toFixed(2));
  const netAmount = amount - fee;

  const txId = 'tx_' + crypto.randomBytes(12).toString('hex');
  const autoApprove = getSettingBool('auto_approve_deposits');

  // Find active admin deposit wallet for this currency
  const adminWallet = db.prepare(`
    SELECT id, address FROM admin_wallets
    WHERE wallet_type = 'deposit' AND is_active = 1 AND currency = ?
    ORDER BY created_at ASC LIMIT 1
  `).get(currency || 'USDT');

  // Ensure user wallet exists
  let wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.user.id);
  if (!wallet) {
    const wId = 'w_' + crypto.randomBytes(12).toString('hex');
    db.prepare(`
      INSERT INTO wallets (id, user_id, provider, address, network, balance, connected)
      VALUES (?, ?, 'internal', ?, 'Ethereum', 0, 1)
    `).run(wId, req.user.id, '0x' + crypto.randomBytes(20).toString('hex'));
    wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.user.id);
  }

  const status = autoApprove ? 'completed' : 'requires_approval';

  const execute = db.transaction(() => {
    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, fee, net_amount, currency, method, status, tx_hash, admin_wallet_id, to_address, description)
      VALUES (?, ?, 'deposit', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txId, req.user.id, amount, fee, netAmount,
      currency || 'USD', method, status, txHash || null,
      adminWallet?.id || null,
      adminWallet?.address || null,
      `Deposit via ${method}${fee > 0 ? ` (fee: $${fee})` : ''}`
    );

    // If auto-approve, add to balance immediately
    if (autoApprove) {
      db.prepare("UPDATE wallets SET balance = balance + ?, updated_at = datetime('now') WHERE user_id = ?")
        .run(netAmount, req.user.id);

      // Track admin wallet received amount
      if (adminWallet) {
        db.prepare("UPDATE admin_wallets SET total_received = total_received + ?, updated_at = datetime('now') WHERE id = ?")
          .run(amount, adminWallet.id);
      }
    }

    db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run('n_' + crypto.randomBytes(8).toString('hex'), req.user.id,
        autoApprove ? 'Deposit Successful' : 'Deposit Pending Review',
        autoApprove
          ? `$${netAmount.toLocaleString()} has been added to your wallet via ${method}.`
          : `Your deposit of $${amount.toLocaleString()} is being reviewed and will be credited shortly.`,
        'deposit');

    // Notify admins if requires approval
    if (!autoApprove) {
      const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
      for (const admin of admins) {
        db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
          .run('n_' + crypto.randomBytes(8).toString('hex'), admin.id,
            'New Deposit Pending', `$${amount.toLocaleString()} deposit from ${req.user.email} requires approval.`, 'admin');
      }
    }
  });

  execute();

  const newBalance = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(req.user.id).balance;
  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txId);

  auditLog(req.user.id, 'transaction.deposit', 'transaction', txId, { amount, method, status, fee }, req);

  // ── Referral bonus on first deposit ──────────────────────────
  if (autoApprove) {
    const depositCount = db.prepare("SELECT COUNT(*) as c FROM transactions WHERE user_id = ? AND type = 'deposit' AND status = 'completed'").get(req.user.id).c;
    if (depositCount === 1) {
      const user = db.prepare("SELECT referred_by FROM users WHERE id = ?").get(req.user.id);
      if (user?.referred_by) {
        const referrer = db.prepare("SELECT id FROM users WHERE referral_code = ?").get(user.referred_by);
        if (referrer) {
          const bonus = parseFloat(db.prepare("SELECT value FROM system_settings WHERE key = 'referral_bonus_first_deposit'").get()?.value || '10');
          if (bonus > 0) {
            const already = db.prepare("SELECT id FROM referral_bonuses WHERE referred_id = ? AND trigger_type = 'first_deposit'").get(req.user.id);
            if (!already) {
              const bonusTxId = 'tx_ref_' + crypto.randomBytes(8).toString('hex');
              db.prepare("UPDATE wallets SET balance = balance + ? WHERE user_id = ?").run(bonus, referrer.id);
              db.prepare(`INSERT INTO transactions (id,user_id,type,amount,currency,method,status,description) VALUES (?,?,'referral_bonus',?,'USD','system','completed',?)`)
                .run(bonusTxId, referrer.id, bonus, 'Referral bonus: first deposit');
              db.prepare(`INSERT INTO referral_bonuses (id,referrer_id,referred_id,trigger_type,bonus_amount,status,transaction_id) VALUES (?,?,?,'first_deposit',?,'credited',?)`)
                .run('rb_' + crypto.randomBytes(8).toString('hex'), referrer.id, req.user.id, bonus, bonusTxId);
            }
          }
        }
      }
    }
  }

  res.json({
    success: true,
    transaction: formatTransaction(transaction),
    balance: newBalance,
    txId,
    adminWalletAddress: adminWallet?.address || null,
    status,
  });
  } catch (err) {
    console.error('Deposit error:', err);
    res.status(500).json({ error: 'Failed to process deposit' });
  }
});

// ── POST /transactions/withdraw ────────────────────────────────
router.post('/withdraw', authRequired, strictLimiter, (req, res) => {
  try {
    const { amount, address } = req.body;

  const minWithdraw = getSettingNumber('withdraw_min') || 100;
  const maxWithdraw = getSettingNumber('withdraw_max') || 50000;

  if (!amount || !validateAmount(amount, 0, maxWithdraw + 1)) {
    return res.status(400).json({ error: `Invalid withdrawal amount. Min: $${minWithdraw}, Max: $${maxWithdraw}` });
  }
  if (amount < minWithdraw) {
    return res.status(400).json({ error: `Minimum withdrawal is $${minWithdraw}` });
  }

  // Check KYC requirement for withdrawals
  if (getSettingBool('require_kyc_for_withdraw')) {
    const user = db.prepare('SELECT kyc_status FROM users WHERE id = ?').get(req.user.id);
    if (user.kyc_status !== 'verified') {
      return res.status(403).json({ error: 'KYC verification required for withdrawals. Please complete identity verification.' });
    }
  }

  // Check daily limit
  const dailyLimit = getSettingNumber('withdraw_daily_limit') || 100000;
  const todayWithdrawn = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM transactions
    WHERE user_id = ? AND type = 'withdraw' AND status IN ('completed','pending','requires_approval')
    AND date(created_at) = date('now')
  `).get(req.user.id).total;

  if (todayWithdrawn + amount > dailyLimit) {
    return res.status(400).json({ error: `Daily withdrawal limit exceeded. Remaining: $${(dailyLimit - todayWithdrawn).toFixed(2)}` });
  }

  // Check withdrawal address whitelist
  if (getSettingBool('require_withdrawal_whitelist') && address) {
    const whitelisted = db.prepare(
      "SELECT id FROM withdrawal_addresses WHERE user_id = ? AND address = ? AND is_active = 1 AND is_verified = 1"
    ).get(req.user.id, address);
    if (!whitelisted) {
      return res.status(403).json({ error: 'Withdrawal address not in your whitelist. Please add and verify the address first.' });
    }
  }

  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.user.id);
  if (!wallet || wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Calculate fee
  const feePercent = getSettingNumber('withdraw_fee_percent') || 1.5;
  const feeFlat = getSettingNumber('withdraw_fee_flat') || 5;
  const fee = parseFloat((amount * feePercent / 100 + feeFlat).toFixed(2));
  const netAmount = amount - fee;

  if (netAmount <= 0) {
    return res.status(400).json({ error: 'Withdrawal amount too small after fees' });
  }

  const txId = 'tx_' + crypto.randomBytes(12).toString('hex');
  const autoApprove = getSettingBool('auto_approve_withdrawals');
  const status = autoApprove ? 'completed' : 'requires_approval';

  const execute = db.transaction(() => {
    // Always deduct balance immediately (hold)
    db.prepare("UPDATE wallets SET balance = balance - ?, updated_at = datetime('now') WHERE user_id = ?")
      .run(amount, req.user.id);

    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, fee, net_amount, currency, method, status, to_address, description, metadata)
      VALUES (?, ?, 'withdraw', ?, ?, ?, 'USD', 'wallet', ?, ?, ?, ?)
    `).run(
      txId, req.user.id, amount, fee, netAmount, status,
      address || '', `Withdrawal to ${address || 'external wallet'} (fee: $${fee})`,
      JSON.stringify({ address: address || '', fee, feePercent, feeFlat })
    );

    db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run('n_' + crypto.randomBytes(8).toString('hex'), req.user.id,
        autoApprove ? 'Withdrawal Processed' : 'Withdrawal Pending',
        autoApprove
          ? `$${netAmount.toLocaleString()} (after $${fee} fee) sent to your wallet.`
          : `Your withdrawal of $${amount.toLocaleString()} is being reviewed.`,
        'withdraw');

    if (!autoApprove) {
      const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
      for (const admin of admins) {
        db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
          .run('n_' + crypto.randomBytes(8).toString('hex'), admin.id,
            'Withdrawal Request', `$${amount.toLocaleString()} withdrawal from ${req.user.email} requires approval.`, 'admin');
      }
    }
  });

  execute();

  const newBalance = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(req.user.id).balance;
  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txId);

  auditLog(req.user.id, 'transaction.withdraw', 'transaction', txId, { amount, fee, netAmount, address, status }, req);

  // ── AML Compliance Check ─────────────────────────────────────
  runAMLCheck(req.user.id, txId, amount, 'withdraw', req);

  res.json({
    success: true,
    transaction: formatTransaction(transaction),
    balance: newBalance,
    txId,
    fee,
    netAmount,
    status,
  });
  } catch (err) {
    console.error('Withdraw error:', err);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// ── GET /transactions/deposit-addresses ────────────────────────
// Public facing: returns admin wallets for deposits
router.get('/deposit-addresses', authRequired, (req, res) => {
  const wallets = db.prepare(`
    SELECT id, label, address, network, currency
    FROM admin_wallets WHERE wallet_type = 'deposit' AND is_active = 1
    ORDER BY currency, network
  `).all();

  res.json({ success: true, wallets });
});

function formatTransaction(tx) {
  return {
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    fee: tx.fee || 0,
    netAmount: tx.net_amount,
    currency: tx.currency,
    method: tx.method,
    status: tx.status,
    txHash: tx.tx_hash,
    toAddress: tx.to_address,
    description: tx.description,
    metadata: tx.metadata ? (() => { try { return JSON.parse(tx.metadata); } catch { return tx.metadata; } })() : undefined,
    reviewedAt: tx.reviewed_at,
    createdAt: tx.created_at,
  };
}

export default router;
