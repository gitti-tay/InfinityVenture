// ═══════════════════════════════════════════════════════════════════
// Projects Routes — /api/projects/*
// Now uses database (admin-manageable via /api/admin/projects)
// Extended with RWA OS fields for full token operating system data
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import db from '../db.js';

const router = Router();

/* ── Helper: safe JSON parse ─────────────────────────────────────── */

function safeJsonParse(raw, fallback = []) {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

/* ── Helper: format currency amount ──────────────────────────────── */

function formatAmount(amount) {
  if (!amount || amount <= 0) return '0';
  return amount >= 1e6
    ? `${(amount / 1e6).toFixed(1)}M`
    : `${Math.round(amount / 1e3)}K`;
}

/* ── Helper: compute best APY from plans ─────────────────────────── */

function getBestApy(plans) {
  if (!plans || plans.length === 0) return '0%';
  return `${Math.max(...plans.map(p => p.apy))}%`;
}

/* ── Helper: compute mid-term from plans ─────────────────────────── */

function getMidTerm(plans) {
  if (!plans || plans.length === 0) return '';
  return plans[Math.floor(plans.length / 2)].term;
}

/* ── Helper: compute min investment from plans ───────────────────── */

function getMinInvestment(plans) {
  if (!plans || plans.length === 0) return '$0';
  return `$${Math.min(...plans.map(p => p.min)).toLocaleString()}`;
}

/* ── Helper: format risk level ───────────────────────────────────── */

function formatRisk(riskLevel) {
  return riskLevel ? `${riskLevel} Risk` : 'Medium Risk';
}

/* ── Core: format a database row into the full API response ──────── */

function formatProject(row) {
  const plans = safeJsonParse(row.plans, []);
  const milestones = safeJsonParse(row.milestones, []);
  const team = safeJsonParse(row.team, []);
  const documents = safeJsonParse(row.documents, []);

  const progress = row.target_amount > 0
    ? Math.round((row.raised_amount / row.target_amount) * 100)
    : 0;

  return {
    // ── Core identity ──
    id: row.id,
    name: row.name,
    symbol: row.symbol,
    location: row.location,
    category: row.category,
    region: row.region,
    description: row.description,

    // ── Media ──
    img: row.image,
    image: row.image,
    series: row.series,
    type: row.category,
    badge: row.badge,
    assetId: row.asset_id,

    // ── Investment metrics ──
    apy: getBestApy(plans),
    term: getMidTerm(plans),
    min: getMinInvestment(plans),
    risk: formatRisk(row.risk_level),
    raised: formatAmount(row.raised_amount),
    target: formatAmount(row.target_amount),
    raisedRaw: row.raised_amount || 0,
    targetRaw: row.target_amount || 0,
    investors: row.investor_count || 0,
    progress,
    plans,
    isFeatured: !!row.is_featured,

    // ── RWA OS fields (Token Operating System) ──
    tokenType: row.token_type || null,
    blockchain: row.blockchain || null,
    liquidityRules: row.liquidity_rules || null,
    payoutScheme: row.payout_scheme || null,
    accreditationRequired: row.accreditation_required ?? null,
    complianceFramework: row.compliance_framework || null,
    custodian: row.custodian || null,
    auditor: row.auditor || null,
    legalEntity: row.legal_entity || null,
    jurisdiction: row.jurisdiction || null,
    projectStage: row.project_stage || null,

    // ── Extended data (JSON columns) ──
    milestones,
    team,
    documents,

    // ── Timestamps ──
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

/* ── GET /api/projects — list all active projects ────────────────── */

router.get('/', (req, res) => {
  try {
    const { category, sort } = req.query;
    let where = 'WHERE is_active = 1';
    const params = [];

    if (category && category !== 'All') {
      where += ' AND category = ?';
      params.push(category);
    }

    let orderBy = 'ORDER BY is_featured DESC, created_at DESC';
    if (sort === 'investors') orderBy = 'ORDER BY investor_count DESC';

    const projects = db
      .prepare(`SELECT * FROM projects ${where} ${orderBy}`)
      .all(...params);

    let formatted = projects.map(formatProject);

    if (sort === 'apy_desc') {
      formatted.sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy));
    }
    if (sort === 'apy_asc') {
      formatted.sort((a, b) => parseFloat(a.apy) - parseFloat(b.apy));
    }

    res.json({ success: true, projects: formatted, total: formatted.length });
  } catch (err) {
    console.error('[Projects] GET / error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

/* ── GET /api/projects/:id — single project detail ───────────────── */

router.get('/:id', (req, res) => {
  try {
    const project = db
      .prepare('SELECT * FROM projects WHERE id = ?')
      .get(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, project: formatProject(project) });
  } catch (err) {
    console.error('[Projects] GET /:id error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

export default router;
