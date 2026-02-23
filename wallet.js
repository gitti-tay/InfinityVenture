// ═══════════════════════════════════════════════════════════════════
//  Wallet Routes — /api/wallet/*
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Helper — generate a fake wallet address
function generateAddress(provider) {
  const prefix = provider === 'phantom' ? '' : '0x';
  const bytes = provider === 'phantom' ? 32 : 20;
  return prefix + crypto.randomBytes(bytes).toString('hex');
}

// ── GET /wallet ────────────────────────────────────────────────
router.get('/', authRequired, (req, res) => {
  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ? AND connected = 1').get(req.user.id);

  if (!wallet) {
    return res.json({ success: true, wallet: null, balance: 0 });
  }

  res.json({
    success: true,
    wallet: {
      id: wallet.id,
      provider: wallet.provider,
      address: wallet.address,
      network: wallet.network,
      connected: true,
      createdAt: wallet.created_at,
    },
    balance: wallet.balance,
  });
});

// ── POST /wallet/connect ───────────────────────────────────────
router.post('/connect', authRequired, (req, res) => {
  const { provider, address, network } = req.body;

  if (!provider) {
    return res.status(400).json({ error: 'Wallet provider is required' });
  }

  // Disconnect existing wallet first
  db.prepare('UPDATE wallets SET connected = 0 WHERE user_id = ?').run(req.user.id);

  const walletAddress = address || generateAddress(provider);
  const walletNetwork = network || 'Ethereum';
  const id = 'w_' + crypto.randomBytes(12).toString('hex');

  db.prepare(`
    INSERT INTO wallets (id, user_id, provider, address, network, balance, connected)
    VALUES (?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(user_id) DO UPDATE SET
      provider = excluded.provider,
      address = excluded.address,
      network = excluded.network,
      connected = 1,
      updated_at = datetime('now')
  `).run(id, req.user.id, provider, walletAddress, walletNetwork, 0);

  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ? AND connected = 1').get(req.user.id);

  // Notification
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'n_' + crypto.randomBytes(12).toString('hex'),
    req.user.id,
    'Wallet Connected',
    `${provider} wallet connected successfully.`,
    'success'
  );

  res.json({
    success: true,
    wallet: {
      id: wallet.id,
      provider: wallet.provider,
      address: wallet.address,
      network: wallet.network,
      connected: true,
      createdAt: wallet.created_at,
    },
    balance: wallet.balance,
  });
});

// ── POST /wallet/disconnect ────────────────────────────────────
router.post('/disconnect', authRequired, (req, res) => {
  db.prepare("UPDATE wallets SET connected = 0, updated_at = datetime('now') WHERE user_id = ?").run(req.user.id);
  res.json({ success: true });
});

// ── GET /wallet/balance ────────────────────────────────────────
router.get('/balance', authRequired, (req, res) => {
  const wallet = db.prepare('SELECT balance FROM wallets WHERE user_id = ? AND connected = 1').get(req.user.id);
  res.json({ success: true, balance: wallet?.balance || 0 });
});

export default router;
