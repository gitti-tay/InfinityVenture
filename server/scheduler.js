// ═══════════════════════════════════════════════════════════════════
//  Scheduler — Automated Tasks Runner
//  Yield payouts, maturity checks, session cleanup, AML scans
// ═══════════════════════════════════════════════════════════════════
import crypto from 'crypto';
import db, { getSettingBool, getSettingNumber } from '../db.js';

// ── Yield Payout Processing ──────────────────────────────────
export function processYieldPayouts() {
  if (!getSettingBool('yield_payout_enabled')) return { processed: 0 };

  const taskId = 'st_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`INSERT INTO scheduled_tasks (id, task_type, status) VALUES (?, 'yield_payout', 'running')`).run(taskId);

  try {
    const activeInvestments = db.prepare(`
      SELECT i.*, u.email FROM investments i
      JOIN users u ON i.user_id = u.id
      WHERE i.status = 'active' AND i.monthly_yield > 0
    `).all();

    let processed = 0;
    const now = new Date();

    for (const inv of activeInvestments) {
      // Check if yield already paid for current period
      const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const alreadyPaid = db.prepare(
        "SELECT id FROM yield_payouts WHERE investment_id = ? AND period = ?"
      ).get(inv.id, currentPeriod);

      if (alreadyPaid) continue;

      // Check if enough time has passed since start (at least 30 days for first payout)
      const startDate = new Date(inv.start_date);
      const daysSinceStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceStart < 30) continue;

      const payoutAmount = inv.monthly_yield;
      const payoutId = 'yp_' + crypto.randomBytes(8).toString('hex');
      const txId = 'tx_yield_' + crypto.randomBytes(8).toString('hex');

      db.transaction(() => {
        // Create yield payout record
        db.prepare(`
          INSERT INTO yield_payouts (id, investment_id, user_id, amount, period, status, transaction_id)
          VALUES (?, ?, ?, ?, ?, 'completed', ?)
        `).run(payoutId, inv.id, inv.user_id, payoutAmount, currentPeriod, txId);

        // Create transaction
        db.prepare(`
          INSERT INTO transactions (id, user_id, type, amount, currency, method, status, description, metadata)
          VALUES (?, ?, 'yield', ?, 'USD', 'system', 'completed', ?, ?)
        `).run(
          txId, inv.user_id, payoutAmount,
          `Monthly yield from ${inv.project_name} (${inv.plan_name})`,
          JSON.stringify({ investmentId: inv.id, period: currentPeriod, apy: inv.apy })
        );

        // Add to wallet balance
        db.prepare("UPDATE wallets SET balance = balance + ?, updated_at = datetime('now') WHERE user_id = ?")
          .run(payoutAmount, inv.user_id);

        // Update investment total earned
        db.prepare("UPDATE investments SET total_earned = total_earned + ? WHERE id = ?")
          .run(payoutAmount, inv.id);

        // Notify user
        db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`).run(
          'n_' + crypto.randomBytes(8).toString('hex'), inv.user_id,
          'Yield Received',
          `$${payoutAmount.toFixed(2)} monthly yield from ${inv.project_name} has been added to your wallet.`,
          'investment'
        );

        processed++;
      })();
    }

    db.prepare("UPDATE scheduled_tasks SET status = 'completed', details = ?, completed_at = datetime('now') WHERE id = ?")
      .run(JSON.stringify({ processed, total: activeInvestments.length }), taskId);

    return { processed, total: activeInvestments.length };
  } catch (err) {
    db.prepare("UPDATE scheduled_tasks SET status = 'failed', details = ?, completed_at = datetime('now') WHERE id = ?")
      .run(JSON.stringify({ error: err.message }), taskId);
    return { error: err.message };
  }
}

// ── Maturity Check ──────────────────────────────────────────
export function checkMaturities() {
  const taskId = 'st_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`INSERT INTO scheduled_tasks (id, task_type, status) VALUES (?, 'maturity_check', 'running')`).run(taskId);

  try {
    const matured = db.prepare(`
      SELECT * FROM investments WHERE status = 'active' AND maturity_date <= datetime('now')
    `).all();

    let processed = 0;
    for (const inv of matured) {
      db.transaction(() => {
        db.prepare("UPDATE investments SET status = 'matured' WHERE id = ?").run(inv.id);

        // Return principal to wallet
        db.prepare("UPDATE wallets SET balance = balance + ?, updated_at = datetime('now') WHERE user_id = ?")
          .run(inv.amount, inv.user_id);

        // Create return transaction
        const txId = 'tx_mature_' + crypto.randomBytes(8).toString('hex');
        db.prepare(`
          INSERT INTO transactions (id, user_id, type, amount, currency, method, status, description, metadata)
          VALUES (?, ?, 'refund', ?, 'USD', 'system', 'completed', ?, ?)
        `).run(
          txId, inv.user_id, inv.amount,
          `Investment matured: ${inv.project_name} (${inv.plan_name}) — principal returned`,
          JSON.stringify({ investmentId: inv.id, totalEarned: inv.total_earned })
        );

        // Notify user
        db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`).run(
          'n_' + crypto.randomBytes(8).toString('hex'), inv.user_id,
          'Investment Matured',
          `Your investment in ${inv.project_name} (${inv.plan_name}) has matured. $${inv.amount.toLocaleString()} principal returned. Total earned: $${(inv.total_earned || 0).toFixed(2)}.`,
          'investment'
        );

        processed++;
      })();
    }

    db.prepare("UPDATE scheduled_tasks SET status = 'completed', details = ?, completed_at = datetime('now') WHERE id = ?")
      .run(JSON.stringify({ matured: processed }), taskId);

    return { matured: processed };
  } catch (err) {
    db.prepare("UPDATE scheduled_tasks SET status = 'failed', details = ?, completed_at = datetime('now') WHERE id = ?")
      .run(JSON.stringify({ error: err.message }), taskId);
    return { error: err.message };
  }
}

// ── Session Cleanup ─────────────────────────────────────────
export function cleanupSessions() {
  try {
    const expired = db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now') OR revoked = 1").changes;
    const oldTokens = db.prepare("DELETE FROM password_reset_tokens WHERE expires_at < datetime('now') OR used = 1").changes;
    const oldLoginHistory = db.prepare("DELETE FROM login_history WHERE created_at < datetime('now', '-90 days')").changes;
    return { expiredSessions: expired, expiredTokens: oldTokens, oldLoginRecords: oldLoginHistory };
  } catch (err) {
    console.error('Session cleanup error:', err.message);
    return { error: err.message };
  }
}

// ── Start Scheduler (run every hour) ────────────────────────
let schedulerInterval = null;

export function startScheduler() {
  console.log('⏰ Scheduler started (runs every 60 minutes)');

  // Run immediately on start
  setTimeout(() => {
    try {
      cleanupSessions();
      checkMaturities();
    } catch (e) {
      console.error('Initial scheduler run error:', e.message);
    }
  }, 5000);

  // Then every 60 minutes
  schedulerInterval = setInterval(() => {
    const now = new Date().toISOString();
    try {
      const cleanup = cleanupSessions();
      const maturity = checkMaturities();
      const yields = processYieldPayouts();
      console.log(`[${now}] Scheduler: cleanup=${JSON.stringify(cleanup)}, maturity=${JSON.stringify(maturity)}, yields=${JSON.stringify(yields)}`);

      // Cleanup stale scheduled_tasks older than 30 days
      db.prepare("DELETE FROM scheduled_tasks WHERE completed_at < datetime('now', '-30 days')").run();
    } catch (e) {
      console.error(`[${now}] Scheduler error:`, e.message);
    }
  }, 60 * 60 * 1000); // 1 hour
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
