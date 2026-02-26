// ═══════════════════════════════════════════════════════════════════
// Wallet Routes — /api/wallet/*
// Real Web3 wallet connection + KYC/Wallet status checks
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { auditLog } from '../middleware/security.js';

const router = Router();

// ── Validate Ethereum address format ─────────────────────────
function isValidEthAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// ── GET /wallet ──────────────────────────────────────────────
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

// ── GET /wallet/status — KYC + Wallet readiness check ────────
router.get('/status', authRequired, (req, res) => {
  const user = db.prepare('SELECT kyc_status FROM users WHERE id = ?').get(req.user.id);
  const wallet = db.prepare('SELECT id, provider, address, network, connected FROM wallets WHERE user_id = ? AND connected = 1').get(req.user.id);

  const kycVerified = user?.kyc_status === 'verified';
  const kycPending = user?.kyc_status === 'pending';
  const walletConnected = !!wallet;

  res.json({
    success: true,
    kycStatus: user?.kyc_status || 'none',
    kycVerified,
    kycPending,
    walletConnected,
    wallet: wallet ? {
      provider: wallet.provider,
      address: wallet.address,
      network: wallet.network,
    } : null,
    depositEnabled: {
      bankTransfer: kycVerified,
      crypto: walletConnected,
    },
  });
});

// ── POST /wallet/connect — Real wallet address from frontend ──
router.post('/connect', authRequired, (req, res) => {
  const { provider, address, network } = req.body;

  if (!provider) {
    return res.status(400).json({ error: 'Wallet provider is required' });
  }
  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  // Validate Ethereum address format
  if ((network || 'Ethereum') !== 'Solana' && !isValidEthAddress(address)) {
    return res.status(400).json({ error: 'Invalid Ethereum wallet address format' });
  }

  const walletNetwork = network || 'Ethereum';

  // Disconnect existing wallet first
  db.prepare('UPDATE wallets SET connected = 0 WHERE user_id = ?').run(req.user.id);

  const id = 'w_' + crypto.randomBytes(12).toString('hex');
  db.prepare(`
    INSERT INTO wallets (id, user_id, provider, address, network, balance, connected)
    VALUES (?, ?, ?, ?, ?, 0, 1)
    ON CONFLICT(user_id) DO UPDATE SET
      provider = excluded.provider,
      address = excluded.address,
      network = excluded.network,
      connected = 1,
      updated_at = datetime('now')
  `).run(id, req.user.id, provider, address.toLowerCase(), walletNetwork);

  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ? AND connected = 1').get(req.user.id);

  // Notification
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'n_' + crypto.randomBytes(12).toString('hex'),
    req.user.id,
    'Wallet Connected',
    provider + ' wallet (' + address.substring(0, 6) + '...' + address.substring(address.length - 4) + ') connected successfully.',
    'success'
  );

  auditLog(req.user.id, 'wallet.connect', 'wallet', wallet.id, {
    provider, address: address.toLowerCase(), network: walletNetwork,
  }, req);

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

// ── POST /wallet/disconnect ──────────────────────────────────
router.post('/disconnect', authRequired, (req, res) => {
  db.prepare("UPDATE wallets SET connected = 0, updated_at = datetime('now') WHERE user_id = ?").run(req.user.id);

  auditLog(req.user.id, 'wallet.disconnect', 'wallet', null, {}, req);

  res.json({ success: true });
});

// ── GET /wallet/balance ──────────────────────────────────────
router.get('/balance', authRequired, (req, res) => {
  const wallet = db.prepare('SELECT balance FROM wallets WHERE user_id = ? AND connected = 1').get(req.user.id);
  res.json({ success: true, balance: wallet?.balance || 0 });
});

export default router;
