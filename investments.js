// ═══════════════════════════════════════════════════════════════════
//  Investment Routes — /api/investments/*
//  With admin wallet linking and KYC checks
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db, { getSettingBool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { auditLog, strictLimiter, validateAmount } from '../middleware/security.js';

const router = Router();

// ── GET /investments ───────────────────────────────────────────
router.get('/', authRequired, (req, res) => {
  try {
    const { status } = req.query;
    let where = 'WHERE user_id = ?';
    const params = [req.user.id];
    if (status) { where += ' AND status = ?'; params.push(status); }

    const investments = db.prepare(`SELECT * FROM investments ${where} ORDER BY created_at DESC`).all(...params);
    res.json({ success: true, investments: investments.map(formatInvestment) });
  } catch (err) {
    console.error('List investments error:', err);
    res.status(500).json({ error: 'Failed to load investments' });
  }
});

// ── GET /investments/portfolio ─────────────────────────────────
router.get('/portfolio', authRequired, (req, res) => {
  const investments = db.prepare('SELECT * FROM investments WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  const wallet = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(req.user.id);
  const balance = wallet?.balance || 0;

  const active = investments.filter(i => i.status === 'active');
  const totalInvested = active.reduce((s, i) => s + i.amount, 0);
  const totalEarned = investments.reduce((s, i) => s + (i.total_earned || 0), 0);
  const monthlyYield = active.reduce((s, i) => s + (i.monthly_yield || 0), 0);
  const portfolioValue = balance + totalInvested + totalEarned;

  const allocationMap = {};
  active.forEach(i => {
    const key = i.project_name || 'Other';
    allocationMap[key] = (allocationMap[key] || 0) + i.amount;
  });

  const allocation = Object.entries(allocationMap).map(([name, amount]) => ({
    name, amount,
    percentage: totalInvested > 0 ? Math.round((amount / totalInvested) * 100) : 0,
  }));

  res.json({
    success: true,
    portfolio: {
      totalValue: portfolioValue, balance, totalInvested, totalEarned, monthlyYield,
      growthPercentage: totalInvested > 0 ? parseFloat(((totalEarned / totalInvested) * 100).toFixed(2)) : 0,
      activeInvestments: active.length,
      allocation,
      investments: investments.map(formatInvestment),
    },
  });
});

// ── POST /investments ──────────────────────────────────────────
router.post('/', authRequired, strictLimiter, (req, res) => {
  try {
  const { projectId, projectName, projectImg, planName, amount, apy, term, payoutFrequency, riskLevel } = req.body;

  if (!projectId || !planName || !amount || !apy || !term) {
    return res.status(400).json({ error: 'Missing required investment fields' });
  }
  if (!validateAmount(amount)) {
    return res.status(400).json({ error: 'Invalid investment amount' });
  }

  // ── Legal: Risk acknowledgment check ─────────────────────────
  if (getSettingBool('require_risk_acknowledgment')) {
    const riskDisclosureVersion = db.prepare("SELECT value FROM system_settings WHERE key = 'risk_disclosure_version'").get()?.value || '1.0';
    const riskAccepted = db.prepare(
      "SELECT id FROM legal_acceptances WHERE user_id = ? AND document_type = 'risk_disclosure' AND document_version = ?"
    ).get(req.user.id, riskDisclosureVersion);
    if (!riskAccepted) {
      return res.status(403).json({ error: 'You must accept the Risk Disclosure before investing.', code: 'RISK_DISCLOSURE_REQUIRED' });
    }
  }

  // ── Max open investments check ───────────────────────────────
  const maxOpenInvestments = parseInt(db.prepare("SELECT value FROM system_settings WHERE key = 'max_open_investments'").get()?.value || '20');
  const activeCount = db.prepare("SELECT COUNT(*) as c FROM investments WHERE user_id = ? AND status = 'active'").get(req.user.id).c;
  if (activeCount >= maxOpenInvestments) {
    return res.status(400).json({ error: `Maximum ${maxOpenInvestments} active investments allowed.` });
  }

  // ── Investment cooldown check ────────────────────────────────
  const cooldownHours = parseInt(db.prepare("SELECT value FROM system_settings WHERE key = 'investment_cooldown_hours'").get()?.value || '0');
  if (cooldownHours > 0) {
    const lastInvestment = db.prepare(
      "SELECT created_at FROM investments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1"
    ).get(req.user.id);
    if (lastInvestment) {
      const elapsed = (Date.now() - new Date(lastInvestment.created_at).getTime()) / (1000 * 60 * 60);
      if (elapsed < cooldownHours) {
        const remaining = Math.ceil(cooldownHours - elapsed);
        return res.status(400).json({ error: `Please wait ${remaining} hour(s) before your next investment.` });
      }
    }
  }

  // KYC check for investments
  if (getSettingBool('require_kyc_for_invest')) {
    const user = db.prepare('SELECT kyc_status FROM users WHERE id = ?').get(req.user.id);
    if (user.kyc_status !== 'verified') {
      return res.status(403).json({ error: 'KYC verification required before investing.' });
    }
  }

  // Balance check
  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(req.user.id);
  if (!wallet || wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance', balance: wallet?.balance || 0 });
  }

  const investmentId = 'inv_' + crypto.randomBytes(12).toString('hex');
  const transactionId = 'tx_' + crypto.randomBytes(12).toString('hex');
  const termMonths = parseInt(term) || 12;
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + termMonths);
  const monthlyYield = parseFloat(((amount * (apy / 100)) / 12).toFixed(2));

  // Find treasury admin wallet for investment funds
  const adminWallet = db.prepare(`
    SELECT id FROM admin_wallets WHERE wallet_type = 'treasury' AND is_active = 1 LIMIT 1
  `).get();

  const execute = db.transaction(() => {
    db.prepare("UPDATE wallets SET balance = balance - ?, updated_at = datetime('now') WHERE user_id = ?")
      .run(amount, req.user.id);

    db.prepare(`
      INSERT INTO investments (id, user_id, project_id, project_name, project_img, plan_name, amount, apy, term,
        payout_frequency, risk_level, monthly_yield, maturity_date, transaction_id, admin_wallet_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      investmentId, req.user.id, projectId, projectName || projectId, projectImg || null,
      planName, amount, apy, term, payoutFrequency || 'Monthly', riskLevel || 'Medium',
      monthlyYield, maturityDate.toISOString(), transactionId, adminWallet?.id || null
    );

    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, currency, method, status, description, metadata, admin_wallet_id)
      VALUES (?, ?, 'invest', ?, 'USD', 'wallet', 'completed', ?, ?, ?)
    `).run(
      transactionId, req.user.id, amount,
      `Investment in ${projectName || projectId} — ${planName}`,
      JSON.stringify({ investmentId, projectId, planName, apy, term }),
      adminWallet?.id || null
    );

    // Update admin wallet tracking
    if (adminWallet) {
      db.prepare("UPDATE admin_wallets SET total_received = total_received + ?, updated_at = datetime('now') WHERE id = ?")
        .run(amount, adminWallet.id);
    }

    db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
      .run('n_' + crypto.randomBytes(8).toString('hex'), req.user.id,
        'Investment Successful',
        `You invested $${amount.toLocaleString()} in ${projectName || projectId} (${planName}). Expected monthly yield: $${monthlyYield.toLocaleString()}.`,
        'investment');

    // Notify admins
    const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
    for (const admin of admins) {
      db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
        .run('n_' + crypto.randomBytes(8).toString('hex'), admin.id,
          'New Investment', `${req.user.email} invested $${amount.toLocaleString()} in ${projectName || projectId}.`, 'admin');
    }
  });

  execute();

  const newBalance = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(req.user.id).balance;
  const investment = db.prepare('SELECT * FROM investments WHERE id = ?').get(investmentId);

  auditLog(req.user.id, 'investment.create', 'investment', investmentId, { amount, projectId, planName, apy }, req);

  // ── Referral bonus on first investment ───────────────────────
  const invCount = db.prepare("SELECT COUNT(*) as c FROM investments WHERE user_id = ?").get(req.user.id).c;
  if (invCount === 1) {
    const usr = db.prepare("SELECT referred_by FROM users WHERE id = ?").get(req.user.id);
    if (usr?.referred_by) {
      const referrer = db.prepare("SELECT id FROM users WHERE referral_code = ?").get(usr.referred_by);
      if (referrer) {
        const bonus = parseFloat(db.prepare("SELECT value FROM system_settings WHERE key = 'referral_bonus_first_invest'").get()?.value || '25');
        if (bonus > 0) {
          const already = db.prepare("SELECT id FROM referral_bonuses WHERE referred_id = ? AND trigger_type = 'first_invest'").get(req.user.id);
          if (!already) {
            const bonusTxId = 'tx_ref_' + crypto.randomBytes(8).toString('hex');
            db.prepare("UPDATE wallets SET balance = balance + ? WHERE user_id = ?").run(bonus, referrer.id);
            db.prepare(`INSERT INTO transactions (id,user_id,type,amount,currency,method,status,description) VALUES (?,?,'referral_bonus',?,'USD','system','completed',?)`)
              .run(bonusTxId, referrer.id, bonus, 'Referral bonus: first investment');
            db.prepare(`INSERT INTO referral_bonuses (id,referrer_id,referred_id,trigger_type,bonus_amount,status,transaction_id) VALUES (?,?,?,'first_invest',?,'credited',?)`)
              .run('rb_' + crypto.randomBytes(8).toString('hex'), referrer.id, req.user.id, bonus, bonusTxId);
          }
        }
      }
    }
  }

  res.json({
    success: true,
    investment: formatInvestment(investment),
    transactionId, investmentId,
    balance: newBalance,
  });
  } catch (err) {
    console.error('Investment creation error:', err);
    res.status(500).json({ error: 'Failed to process investment' });
  }
});

// ── GET /investments/:id ───────────────────────────────────────
router.get('/:id', authRequired, (req, res) => {
  const investment = db.prepare('SELECT * FROM investments WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!investment) return res.status(404).json({ error: 'Investment not found' });

  // Simulate earnings based on time elapsed
  const startDate = new Date(investment.start_date);
  const now = new Date();
  const monthsElapsed = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const simulatedEarnings = parseFloat(((investment.monthly_yield || 0) * monthsElapsed).toFixed(2));

  if (simulatedEarnings > investment.total_earned) {
    db.prepare('UPDATE investments SET total_earned = ? WHERE id = ?').run(simulatedEarnings, investment.id);
    investment.total_earned = simulatedEarnings;
  }

  res.json({ success: true, investment: formatInvestment(investment) });
});

function formatInvestment(inv) {
  return {
    id: inv.id, projectId: inv.project_id, projectName: inv.project_name, projectImg: inv.project_img,
    planName: inv.plan_name, amount: inv.amount, apy: inv.apy, term: inv.term,
    payoutFrequency: inv.payout_frequency, riskLevel: inv.risk_level, status: inv.status,
    monthlyYield: inv.monthly_yield, totalEarned: inv.total_earned, startDate: inv.start_date,
    maturityDate: inv.maturity_date, transactionId: inv.transaction_id, createdAt: inv.created_at,
  };
}

export default router;
