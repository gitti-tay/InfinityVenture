// ═══════════════════════════════════════════════════════════════════
//  Notification Routes — /api/notifications/*
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// ── GET /notifications ─────────────────────────────────────────
router.get('/', authRequired, (req, res) => {
  const { unread } = req.query;
  let where = 'WHERE user_id = ?';
  const params = [req.user.id];

  if (unread === 'true') {
    where += ' AND read = 0';
  }

  const notifications = db.prepare(`
    SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT 100
  `).all(...params);

  const unreadCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0').get(req.user.id).count;

  res.json({
    success: true,
    notifications: notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: !!n.read,
      metadata: n.metadata ? JSON.parse(n.metadata) : undefined,
      createdAt: n.created_at,
    })),
    unreadCount,
  });
});

// ── PUT /notifications/:id/read ────────────────────────────────
router.put('/:id/read', authRequired, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// ── PUT /notifications/read-all ────────────────────────────────
router.put('/read-all', authRequired, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

// ── DELETE /notifications/clear ────────────────────────────────
router.delete('/clear', authRequired, (req, res) => {
  db.prepare('DELETE FROM notifications WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

export default router;
