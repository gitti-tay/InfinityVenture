// ═══════════════════════════════════════════════════════════════════
//  Projects Routes — /api/projects/*
//  Now uses database (admin-manageable via /api/admin/projects)
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import db from '../db.js';

const router = Router();

function formatProject(row) {
  const plans = row.plans ? (() => { try { return JSON.parse(row.plans); } catch { return []; } })() : [];
  const progress = row.target_amount > 0 ? Math.round((row.raised_amount / row.target_amount) * 100) : 0;
  return {
    id: row.id, name: row.name, symbol: row.symbol, location: row.location,
    category: row.category, region: row.region, description: row.description,
    img: row.image, image: row.image, series: row.series, type: row.category,
    badge: row.badge, assetId: row.asset_id,
    apy: plans.length > 0 ? `${Math.max(...plans.map(p => p.apy))}%` : '0%',
    term: plans.length > 0 ? plans[Math.floor(plans.length / 2)].term : '',
    min: plans.length > 0 ? `$${Math.min(...plans.map(p => p.min)).toLocaleString()}` : '$0',
    risk: row.risk_level ? `${row.risk_level} Risk` : 'Medium Risk',
    raised: row.raised_amount >= 1e6 ? `${(row.raised_amount/1e6).toFixed(1)}M` : `${Math.round(row.raised_amount/1e3)}K`,
    target: row.target_amount >= 1e6 ? `${(row.target_amount/1e6).toFixed(1)}M` : `${Math.round(row.target_amount/1e3)}K`,
    investors: row.investor_count || 0, progress, plans, isFeatured: !!row.is_featured,
  };
}

router.get('/', (req, res) => {
  const { category, sort } = req.query;
  let where = 'WHERE is_active = 1';
  const params = [];
  if (category && category !== 'All') { where += ' AND category = ?'; params.push(category); }
  let orderBy = 'ORDER BY is_featured DESC, created_at DESC';
  if (sort === 'investors') orderBy = 'ORDER BY investor_count DESC';
  const projects = db.prepare(`SELECT * FROM projects ${where} ${orderBy}`).all(...params);
  let formatted = projects.map(formatProject);
  if (sort === 'apy_desc') formatted.sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy));
  if (sort === 'apy_asc') formatted.sort((a, b) => parseFloat(a.apy) - parseFloat(b.apy));
  res.json({ success: true, projects: formatted, total: formatted.length });
});

router.get('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, project: formatProject(project) });
});

export default router;
