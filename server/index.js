// ═══════════════════════════════════════════════════════════════════
//  Infinity Ventures — Express Backend Server (Secured MVP)
//  API Routes + Security Middleware + Admin Panel + SPA Serving
// ═══════════════════════════════════════════════════════════════════
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Middleware ─────────────────────────────────────────────────
import {
  securityHeaders, sanitizeInput, apiLimiter, corsConfig,
  maintenanceCheck, requestId, adminIpWhitelist, ssrfGuard,
  errorSanitizer,
} from './middleware/security.js';
import db from './db.js';

// ── Route imports ─────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import transactionRoutes from './routes/transactions.js';
import investmentRoutes from './routes/investments.js';
import projectRoutes from './routes/projects.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import supportRoutes from './routes/support.js';
import legalRoutes from './routes/legal.js';
import complianceRoutes from './routes/compliance.js';
import { startScheduler } from './scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── Process-level error handlers ─────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

// ── Trust proxy (Railway, Vercel, etc.) ──────────────────────
app.set('trust proxy', 1);

// ── Global Security Middleware ────────────────────────────────
app.use(requestId);
app.use(securityHeaders);
app.use(cors(corsConfig()));
app.use(express.json({ limit: '2mb' }));  // Reduced from 5mb — tighter limit
app.use(sanitizeInput);
app.use(ssrfGuard);     // ④ SSRF protection
app.use(apiLimiter);     // ⑥ Global rate limit: 120 req/min per IP

// ── Maintenance Mode Check ───────────────────────────────────
app.use(maintenanceCheck);

// ── Request Logging ──────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logLevel = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
      if (!isProd || res.statusCode >= 400) {
        console.log(`[${logLevel}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms) [${req.ip}]`);
      }
    });
  }
  next();
});

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  let dbStatus = 'ok';
  try { db.prepare('SELECT 1').get(); } catch { dbStatus = 'error'; }
  res.json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    version: '3.0.0-secured',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: dbStatus,
    features: ['cors', 'csrf', 'csp', 'ssrf-guard', 'rbac', 'tenant-isolation',
               'bruteforce-shield', 'session-management', 'audit-log', 'aml'],
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminIpWhitelist, adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/compliance', complianceRoutes);

// ── API 404 (⑭ No path leak in production) ──────────────────
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', ...(isProd ? {} : { path: req.path }) });
});

// ── Serve Frontend (Production) ──────────────────────────────
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, filePath) => {
    // Don't cache HTML (for SPA routing)
    if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Global Error Handler (⑭ Error Exposure Blocking) ─────────
app.use(errorSanitizer);

// ── Graceful Shutdown ────────────────────────────────────────
let server;
function shutdown(signal) {
  console.log(`\n⏹  ${signal} received — shutting down gracefully...`);
  if (server) server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000); // force exit after 10s
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// ── Start Server ─────────────────────────────────────────────
server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║   🚀 Infinity Ventures API Server v2.1 (MVP)            ║
║   Port: ${String(PORT).padEnd(48)}║
║   Mode: ${String(process.env.NODE_ENV || 'development').padEnd(48)}║
║   Admin: /api/admin/*                                    ║
║   Health: /api/health                                    ║
╚══════════════════════════════════════════════════════════╝
  `);
  // Start background scheduler
  startScheduler();
});

export default app;
