// ═══════════════════════════════════════════════════════════════════
//  Support Routes — /api/support/*
//  User ticket system with admin response capability
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { auditLog, strictLimiter } from '../middleware/security.js';

const router = Router();

// ── GET /support/tickets ────────────────────────────────────────
router.get('/tickets', authRequired, (req, res) => {
  const { status } = req.query;
  let where = 'WHERE t.user_id = ?';
  const params = [req.user.id];
  if (status) { where += ' AND t.status = ?'; params.push(status); }

  const tickets = db.prepare(`
    SELECT t.*, 
      (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id) as message_count,
      (SELECT message FROM support_messages WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message
    FROM support_tickets t ${where}
    ORDER BY t.updated_at DESC
  `).all(...params);

  res.json({ success: true, tickets });
});

// ── POST /support/tickets ───────────────────────────────────────
router.post('/tickets', authRequired, strictLimiter, (req, res) => {
  const { subject, category, message } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });

  const ticketId = 'tk_' + crypto.randomBytes(8).toString('hex');
  const msgId = 'msg_' + crypto.randomBytes(8).toString('hex');

  const execute = db.transaction(() => {
    db.prepare(`
      INSERT INTO support_tickets (id, user_id, subject, category)
      VALUES (?, ?, ?, ?)
    `).run(ticketId, req.user.id, subject, category || 'general');

    db.prepare(`
      INSERT INTO support_messages (id, ticket_id, sender_id, message, is_admin)
      VALUES (?, ?, ?, ?, 0)
    `).run(msgId, ticketId, req.user.id, message);

    // Notify admins
    const admins = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin')").all();
    for (const admin of admins) {
      db.prepare(`INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`)
        .run('n_' + crypto.randomBytes(8).toString('hex'), admin.id,
          'New Support Ticket', `${req.user.fullName}: ${subject}`, 'admin');
    }
  });

  execute();
  auditLog(req.user.id, 'support.create_ticket', 'support_ticket', ticketId, { subject, category }, req);
  res.status(201).json({ success: true, ticketId });
});

// ── GET /support/tickets/:id ────────────────────────────────────
router.get('/tickets/:id', authRequired, (req, res) => {
  const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const messages = db.prepare(`
    SELECT sm.*, u.full_name as sender_name, u.role as sender_role
    FROM support_messages sm JOIN users u ON sm.sender_id = u.id
    WHERE sm.ticket_id = ? ORDER BY sm.created_at ASC
  `).all(ticket.id);

  res.json({ success: true, ticket, messages });
});

// ── POST /support/tickets/:id/reply ─────────────────────────────
router.post('/tickets/:id/reply', authRequired, strictLimiter, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  if (ticket.status === 'closed') return res.status(400).json({ error: 'Ticket is closed' });

  db.prepare(`INSERT INTO support_messages (id, ticket_id, sender_id, message, is_admin) VALUES (?, ?, ?, ?, 0)`)
    .run('msg_' + crypto.randomBytes(8).toString('hex'), ticket.id, req.user.id, message);
  db.prepare("UPDATE support_tickets SET status = 'open', updated_at = datetime('now') WHERE id = ?").run(ticket.id);

  res.json({ success: true });
});

// ── Legal pages ─────────────────────────────────────────────────
router.get('/terms', (req, res) => {
  res.json({
    success: true,
    version: '1.0',
    lastUpdated: '2024-01-15',
    content: `TERMS OF SERVICE — Infinity Ventures Platform

1. ACCEPTANCE OF TERMS
By accessing or using the Infinity Ventures platform, you agree to be bound by these Terms of Service.

2. ELIGIBILITY
You must be at least 18 years old and complete identity verification (KYC) to use investment features.

3. ACCOUNT SECURITY
You are responsible for maintaining the confidentiality of your account credentials. Enable two-factor authentication when available.

4. INVESTMENT RISKS
All investments carry risk. Past performance does not guarantee future results. You may lose some or all of your invested capital.

5. KYC/AML COMPLIANCE
We comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. You must provide accurate identification documents.

6. DEPOSITS & WITHDRAWALS
Deposits are processed after verification. Withdrawals are subject to KYC verification, processing times, and applicable fees.

7. FEES
Platform fees, withdrawal fees, and other charges are disclosed before each transaction. Fee schedules may change with notice.

8. PROHIBITED ACTIVITIES
Money laundering, fraud, market manipulation, and use of the platform for illegal purposes are strictly prohibited.

9. LIMITATION OF LIABILITY
Infinity Ventures is not liable for losses resulting from market conditions, system failures beyond our control, or unauthorized account access.

10. DISPUTE RESOLUTION
Disputes shall be resolved through arbitration. Users agree to waive class action rights.

11. MODIFICATIONS
We may modify these terms with 30 days notice. Continued use constitutes acceptance.

12. CONTACT
support@infinityventures.com`
  });
});

router.get('/privacy', (req, res) => {
  res.json({
    success: true,
    version: '1.0',
    lastUpdated: '2024-01-15',
    content: `PRIVACY POLICY — Infinity Ventures Platform

1. DATA COLLECTION
We collect: personal information (name, email, phone), identity documents for KYC, transaction data, device and usage information.

2. USE OF DATA
Your data is used for: account management, KYC/AML compliance, transaction processing, customer support, and platform improvement.

3. DATA SHARING
We do not sell personal data. Data may be shared with: KYC/AML service providers, regulatory authorities (when required), payment processors.

4. DATA SECURITY
We use encryption, access controls, and secure infrastructure. Data is stored with industry-standard security measures.

5. DATA RETENTION
Account data is retained while your account is active. Transaction records are kept for regulatory compliance (minimum 5 years).

6. YOUR RIGHTS
You may: access your data, request corrections, request deletion (subject to regulatory requirements), export your data.

7. COOKIES
We use essential cookies for authentication and security. Analytics cookies help improve our service.

8. INTERNATIONAL TRANSFERS
Data may be processed in multiple jurisdictions. We ensure appropriate safeguards for cross-border transfers.

9. CHANGES
We will notify you of material changes to this policy via email or platform notification.

10. CONTACT
privacy@infinityventures.com`
  });
});

export default router;
