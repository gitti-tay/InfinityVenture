// ═══════════════════════════════════════════════════════════════════
//  Database — SQLite with better-sqlite3
//  Infinity Ventures MVP — Complete Schema
// ═══════════════════════════════════════════════════════════════════
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Production: use /data volume (Railway), fallback to local data/
const DB_PATH = process.env.DATABASE_PATH
  || (process.env.NODE_ENV === 'production' && fs.existsSync('/data') ? '/data/infinity.db' : null)
  || path.join(__dirname, '..', 'data', 'infinity.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Performance & safety pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');
db.pragma('synchronous = NORMAL');   // faster writes, still safe with WAL
db.pragma('cache_size = -64000');     // 64MB cache

// Graceful shutdown — flush WAL on exit
function closeDb() {
  try { db.pragma('wal_checkpoint(TRUNCATE)'); db.close(); } catch {}
}
process.on('SIGTERM', closeDb);
process.on('SIGINT', closeDb);

// ─── Schema ──────────────────────────────────────────────────────
db.exec(`
  -- ═══ USERS ═══
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user','admin','superadmin')),
    kyc_status TEXT DEFAULT 'none' CHECK(kyc_status IN ('none','pending','verified','rejected')),
    kyc_document_url TEXT,
    kyc_reviewed_by TEXT,
    kyc_reviewed_at TEXT,
    biometric_enabled INTEGER DEFAULT 0,
    email_verified INTEGER DEFAULT 0,
    verification_code TEXT,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    is_suspended INTEGER DEFAULT 0,
    suspended_reason TEXT,
    login_attempts INTEGER DEFAULT 0,
    locked_until TEXT,
    last_login_at TEXT,
    last_login_ip TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ SESSIONS (for token blacklisting) ═══
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    revoked INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ WALLETS ═══
  CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    address TEXT NOT NULL,
    network TEXT DEFAULT 'Ethereum',
    balance REAL DEFAULT 0 CHECK(balance >= 0),
    connected INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ ADMIN WALLETS (company receiving wallets) ═══
  CREATE TABLE IF NOT EXISTS admin_wallets (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    address TEXT NOT NULL,
    network TEXT NOT NULL DEFAULT 'Ethereum',
    currency TEXT NOT NULL DEFAULT 'USDT',
    wallet_type TEXT DEFAULT 'deposit' CHECK(wallet_type IN ('deposit','withdrawal','treasury','fee')),
    is_active INTEGER DEFAULT 1,
    total_received REAL DEFAULT 0,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ TRANSACTIONS ═══
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('deposit','withdraw','invest','yield','refund','fee')),
    amount REAL NOT NULL CHECK(amount > 0),
    fee REAL DEFAULT 0,
    net_amount REAL,
    currency TEXT DEFAULT 'USD',
    method TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','failed','cancelled','requires_approval')),
    admin_wallet_id TEXT REFERENCES admin_wallets(id),
    tx_hash TEXT,
    from_address TEXT,
    to_address TEXT,
    description TEXT,
    metadata TEXT,
    reviewed_by TEXT REFERENCES users(id),
    reviewed_at TEXT,
    review_note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ INVESTMENTS ═══
  CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    project_name TEXT,
    project_img TEXT,
    plan_name TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    apy REAL NOT NULL,
    term TEXT NOT NULL,
    payout_frequency TEXT DEFAULT 'Monthly',
    risk_level TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'active' CHECK(status IN ('active','matured','cancelled','pending')),
    monthly_yield REAL,
    total_earned REAL DEFAULT 0,
    start_date TEXT DEFAULT (datetime('now')),
    maturity_date TEXT,
    transaction_id TEXT,
    admin_wallet_id TEXT REFERENCES admin_wallets(id),
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ NOTIFICATIONS ═══
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK(type IN ('info','success','warning','error','investment','deposit','withdraw','system','admin')),
    read INTEGER DEFAULT 0,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ AUDIT LOG (모든 중요 행위 기록) ═══
  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ SYSTEM SETTINGS ═══
  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_by TEXT REFERENCES users(id),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ KYC DOCUMENTS ═══
  CREATE TABLE IF NOT EXISTS kyc_documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK(document_type IN ('passport','national_id','drivers_license','proof_of_address','selfie')),
    file_url TEXT,
    file_name TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    reviewed_by TEXT REFERENCES users(id),
    review_note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ PROJECTS (DB-managed, admin CRUD) ═══
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    location TEXT,
    category TEXT NOT NULL,
    region TEXT,
    description TEXT,
    image TEXT,
    series TEXT,
    badge TEXT,
    asset_id TEXT,
    risk_level TEXT DEFAULT 'Medium',
    target_amount REAL DEFAULT 0,
    raised_amount REAL DEFAULT 0,
    investor_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,
    min_investment REAL DEFAULT 500,
    max_investment REAL DEFAULT 500000,
    plans TEXT, -- JSON array of plans
    documents TEXT, -- JSON array of doc links
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ SUPPORT TICKETS ═══
  CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK(category IN ('general','deposit','withdrawal','investment','kyc','account','technical','other')),
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low','normal','high','urgent')),
    status TEXT DEFAULT 'open' CHECK(status IN ('open','in_progress','waiting','resolved','closed')),
    assigned_to TEXT REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ SUPPORT MESSAGES ═══
  CREATE TABLE IF NOT EXISTS support_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ REFERRAL BONUSES ═══
  CREATE TABLE IF NOT EXISTS referral_bonuses (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL REFERENCES users(id),
    referred_id TEXT NOT NULL REFERENCES users(id),
    trigger_type TEXT NOT NULL CHECK(trigger_type IN ('signup','first_deposit','first_invest')),
    bonus_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','credited','expired')),
    transaction_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ YIELD PAYOUTS ═══
  CREATE TABLE IF NOT EXISTS yield_payouts (
    id TEXT PRIMARY KEY,
    investment_id TEXT NOT NULL REFERENCES investments(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    amount REAL NOT NULL,
    period TEXT NOT NULL,
    status TEXT DEFAULT 'completed' CHECK(status IN ('pending','completed','failed')),
    transaction_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ LOGIN HISTORY ═══
  CREATE TABLE IF NOT EXISTS login_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    success INTEGER DEFAULT 1,
    failure_reason TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ LEGAL ACCEPTANCE (Terms/Privacy/Risk) ═══
  CREATE TABLE IF NOT EXISTS legal_acceptances (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK(document_type IN ('terms_of_service','privacy_policy','risk_disclosure','investment_agreement','cookie_policy')),
    document_version TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    accepted_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ INVESTMENT AGREEMENTS (per investment) ═══
  CREATE TABLE IF NOT EXISTS investment_agreements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    investment_id TEXT REFERENCES investments(id),
    project_id TEXT NOT NULL,
    amount REAL NOT NULL,
    terms_hash TEXT,
    risk_acknowledged INTEGER DEFAULT 0,
    signed_at TEXT DEFAULT (datetime('now')),
    ip_address TEXT
  );

  -- ═══ WITHDRAWAL ADDRESS WHITELIST ═══
  CREATE TABLE IF NOT EXISTS withdrawal_addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    address TEXT NOT NULL,
    network TEXT NOT NULL DEFAULT 'Ethereum',
    currency TEXT NOT NULL DEFAULT 'USDT',
    is_verified INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ PASSWORD RESET TOKENS ═══
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ AML/COMPLIANCE FLAGS ═══
  CREATE TABLE IF NOT EXISTS compliance_flags (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    transaction_id TEXT REFERENCES transactions(id),
    flag_type TEXT NOT NULL CHECK(flag_type IN ('large_deposit','large_withdrawal','rapid_transactions','suspicious_pattern','manual_flag','velocity_check','geographic_risk')),
    severity TEXT DEFAULT 'medium' CHECK(severity IN ('low','medium','high','critical')),
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK(status IN ('open','investigating','resolved','dismissed','escalated')),
    resolved_by TEXT REFERENCES users(id),
    resolution_note TEXT,
    resolved_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ ADMIN IP WHITELIST ═══
  CREATE TABLE IF NOT EXISTS admin_ip_whitelist (
    id TEXT PRIMARY KEY,
    ip_address TEXT NOT NULL,
    label TEXT,
    added_by TEXT REFERENCES users(id),
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ═══ PROJECT-WALLET MAPPING (which wallet receives funds per project) ═══
  CREATE TABLE IF NOT EXISTS project_wallet_mapping (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    admin_wallet_id TEXT NOT NULL REFERENCES admin_wallets(id),
    allocation_percent REAL DEFAULT 100,
    is_active INTEGER DEFAULT 1,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(project_id, admin_wallet_id)
  );

  -- ═══ SCHEDULED TASKS LOG ═══
  CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id TEXT PRIMARY KEY,
    task_type TEXT NOT NULL CHECK(task_type IN ('yield_payout','maturity_check','aml_scan','daily_report','session_cleanup')),
    status TEXT DEFAULT 'completed' CHECK(status IN ('running','completed','failed')),
    details TEXT,
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
  );

  -- ═══ INDEXES ═══
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
  CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
  CREATE INDEX IF NOT EXISTS idx_investments_user ON investments(user_id);
  CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_kyc_documents_user ON kyc_documents(user_id);
  CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);
  CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
  CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
  CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
  CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticket_id);
  CREATE INDEX IF NOT EXISTS idx_referral_bonuses_referrer ON referral_bonuses(referrer_id);
  CREATE INDEX IF NOT EXISTS idx_yield_payouts_investment ON yield_payouts(investment_id);
  CREATE INDEX IF NOT EXISTS idx_login_history_user ON login_history(user_id);
  CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user ON legal_acceptances(user_id);
  CREATE INDEX IF NOT EXISTS idx_legal_acceptances_type ON legal_acceptances(document_type);
  CREATE INDEX IF NOT EXISTS idx_withdrawal_addresses_user ON withdrawal_addresses(user_id);
  CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
  CREATE INDEX IF NOT EXISTS idx_compliance_flags_user ON compliance_flags(user_id);
  CREATE INDEX IF NOT EXISTS idx_compliance_flags_status ON compliance_flags(status);
  CREATE INDEX IF NOT EXISTS idx_compliance_flags_severity ON compliance_flags(severity);
  CREATE INDEX IF NOT EXISTS idx_project_wallet_mapping_project ON project_wallet_mapping(project_id);
  CREATE INDEX IF NOT EXISTS idx_investment_agreements_user ON investment_agreements(user_id);
  CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_type ON scheduled_tasks(task_type);

  -- Composite indexes for common queries
  CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_transactions_status_created ON transactions(status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_investments_user_status ON investments(user_id, status);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
  CREATE INDEX IF NOT EXISTS idx_compliance_flags_status_severity ON compliance_flags(status, severity);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_revoked ON sessions(user_id, revoked);
`);

// ─── Default System Settings (seed) ──────────────────────────────
const seedSettings = [
  ['deposit_min', '50', 'Minimum deposit amount (USD)'],
  ['deposit_max', '100000', 'Maximum deposit amount (USD)'],
  ['withdraw_min', '100', 'Minimum withdrawal amount (USD)'],
  ['withdraw_max', '50000', 'Maximum withdrawal amount per transaction (USD)'],
  ['withdraw_daily_limit', '100000', 'Maximum daily withdrawal (USD)'],
  ['deposit_fee_percent', '0', 'Deposit fee percentage'],
  ['withdraw_fee_percent', '1.5', 'Withdrawal fee percentage'],
  ['withdraw_fee_flat', '5', 'Flat withdrawal fee (USD)'],
  ['require_kyc_for_invest', 'false', 'Require KYC before investing'],
  ['require_kyc_for_withdraw', 'true', 'Require KYC before withdrawing'],
  ['auto_approve_deposits', 'true', 'Auto-approve deposits (soft launch)'],
  ['auto_approve_withdrawals', 'false', 'Auto-approve withdrawals'],
  ['maintenance_mode', 'false', 'Enable maintenance mode'],
  ['signup_enabled', 'true', 'Allow new user registration'],
  ['max_login_attempts', '5', 'Max failed login attempts before lockout'],
  ['lockout_duration_minutes', '30', 'Account lockout duration in minutes'],
  ['platform_name', 'Infinity Ventures', 'Platform display name'],
  ['support_email', 'support@infinityventures.com', 'Support email'],
  ['referral_bonus_signup', '0', 'Referral bonus on signup (USD)'],
  ['referral_bonus_first_deposit', '10', 'Referral bonus on first deposit (USD)'],
  ['referral_bonus_first_invest', '25', 'Referral bonus on first investment (USD)'],
  ['yield_payout_enabled', 'true', 'Enable automated yield payouts'],
  ['admin_notification_threshold', '5000', 'Amount threshold for admin notification'],
  ['terms_version', '1.0', 'Current Terms of Service version'],
  ['privacy_version', '1.0', 'Current Privacy Policy version'],
  ['risk_disclosure_version', '1.0', 'Current Risk Disclosure version'],
  ['require_terms_acceptance', 'true', 'Require Terms acceptance before trading'],
  ['require_risk_acknowledgment', 'true', 'Require risk acknowledgment before investing'],
  ['aml_large_deposit_threshold', '10000', 'AML flag threshold for large deposits (USD)'],
  ['aml_large_withdrawal_threshold', '5000', 'AML flag threshold for large withdrawals (USD)'],
  ['aml_rapid_tx_count', '5', 'Number of transactions in short period to trigger flag'],
  ['aml_rapid_tx_window_minutes', '60', 'Time window for rapid transaction check (minutes)'],
  ['require_withdrawal_whitelist', 'false', 'Require whitelisted addresses for withdrawals'],
  ['admin_ip_whitelist_enabled', 'false', 'Enable admin IP whitelisting'],
  ['investment_cooldown_hours', '0', 'Cooldown period between investments (hours)'],
  ['max_open_investments', '20', 'Maximum concurrent active investments per user'],
  ['password_reset_expiry_minutes', '30', 'Password reset token expiry (minutes)'],
  ['session_max_age_days', '7', 'Maximum session age (days)'],
];

const insertSetting = db.prepare(`
  INSERT OR IGNORE INTO system_settings (key, value, description)
  VALUES (?, ?, ?)
`);

for (const [key, value, desc] of seedSettings) {
  insertSetting.run(key, value, desc);
}

// ─── Seed Default Admin (if none exists) ─────────────────────────
const adminExists = db.prepare("SELECT id FROM users WHERE role IN ('admin','superadmin') LIMIT 1").get();

if (!adminExists) {
  const adminId = 'u_admin_' + crypto.randomBytes(8).toString('hex');
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2024!Secure';
  const adminHash = bcrypt.hashSync(adminPassword, 12);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, email_verified, kyc_status, referral_code)
    VALUES (?, ?, ?, ?, 'superadmin', 1, 'verified', ?)
  `).run(
    adminId,
    process.env.ADMIN_EMAIL || 'admin@infinityventures.com',
    adminHash,
    'System Admin',
    'IVADMIN' + crypto.randomBytes(3).toString('hex').toUpperCase()
  );

  // Seed default admin receiving wallets
  const wallets = [
    ['USDT (TRC20) Deposit Wallet', 'TRC20', 'USDT', 'deposit'],
    ['USDC (ERC20) Deposit Wallet', 'ERC20', 'USDC', 'deposit'],
    ['ETH Treasury Wallet', 'Ethereum', 'ETH', 'treasury'],
    ['BTC Treasury Wallet', 'Bitcoin', 'BTC', 'treasury'],
  ];

  for (const [label, network, currency, type] of wallets) {
    db.prepare(`
      INSERT INTO admin_wallets (id, label, address, network, currency, wallet_type, is_active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      'aw_' + crypto.randomBytes(8).toString('hex'),
      label,
      'SET_YOUR_' + network.toUpperCase() + '_ADDRESS_HERE',
      network, currency, type, adminId
    );
  }

  console.log(`\n🔑 Default admin created: ${process.env.ADMIN_EMAIL || 'admin@infinityventures.com'}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   ⚠️  CHANGE THIS IN PRODUCTION via ADMIN_EMAIL & ADMIN_DEFAULT_PASSWORD env vars\n`);
}

// ─── Seed Projects (if none exist) ───────────────────────────────
const projectCount = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
if (projectCount === 0) {
  const SEED_PROJECTS = [
    {
      id: 'ptf', name: 'PTF — Prime Timber Forestry', symbol: 'PTF',
      location: 'Doi Saket, Chiang Mai', category: 'Agriculture', region: 'Doi Saket, Chiang Mai',
      description: 'Sustainable timber forestry investment in Northern Thailand. High-quality teak and rosewood plantations managed with eco-certified practices.',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
      series: 'Series A', badge: 'Asset Backed', asset_id: '#8827-RWA', risk_level: 'Low',
      target_amount: 3000000, raised_amount: 768000, investor_count: 58, min_investment: 500, max_investment: 100000,
      plans: JSON.stringify([
        { name: 'Seedling', min: 500, max: 5000, apy: 12.0, term: '6 Months', payout: 'Monthly' },
        { name: 'Growth', min: 5000, max: 25000, apy: 14.2, term: '12 Months', payout: 'Monthly' },
        { name: 'Harvest', min: 25000, max: 100000, apy: 16.5, term: '24 Months', payout: 'Monthly' },
      ]),
    },
    {
      id: 'scn', name: 'SCN — Suburban Care Network', symbol: 'SCN',
      location: 'Sukhumvit, Bangkok', category: 'Healthcare', region: 'Sukhumvit, Bangkok',
      description: 'Network of suburban healthcare clinics providing affordable primary care across Bangkok metropolitan area.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      series: 'Seed', badge: 'Impact Fund', asset_id: '#9102-RWA', risk_level: 'Medium',
      target_amount: 5000000, raised_amount: 100000, investor_count: 31, min_investment: 750, max_investment: 100000,
      plans: JSON.stringify([
        { name: 'Basic', min: 750, max: 5000, apy: 10.5, term: '6 Months', payout: 'Monthly' },
        { name: 'Standard', min: 5000, max: 25000, apy: 12.5, term: '12 Months', payout: 'Monthly' },
        { name: 'Premium', min: 25000, max: 100000, apy: 14.0, term: '24 Months', payout: 'Monthly' },
      ]),
    },
    {
      id: 'mfx', name: 'MFX — MetaFlex Exchange', symbol: 'MFX',
      location: 'Singapore', category: 'Fintech', region: 'Singapore',
      description: 'Next-generation decentralized exchange with advanced order types, cross-chain swaps, and institutional-grade security.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
      series: 'Series B', badge: 'High Yield', asset_id: '#7431-DeFi', risk_level: 'High',
      target_amount: 10000000, raised_amount: 1200000, investor_count: 142, min_investment: 1000, max_investment: 500000,
      plans: JSON.stringify([
        { name: 'Starter', min: 1000, max: 10000, apy: 15.0, term: '3 Months', payout: 'Monthly' },
        { name: 'Pro', min: 10000, max: 50000, apy: 18.0, term: '6 Months', payout: 'Monthly' },
        { name: 'Whale', min: 50000, max: 500000, apy: 22.0, term: '12 Months', payout: 'Monthly' },
      ]),
    },
    {
      id: 'gev', name: 'GEV — Green Energy Ventures', symbol: 'GEV',
      location: 'Phuket, Thailand', category: 'Energy', region: 'Phuket, Thailand',
      description: 'Solar farm and battery storage project in Southern Thailand. Government-backed power purchase agreements provide stable returns.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      series: 'Series A', badge: 'ESG Certified', asset_id: '#5563-RWA', risk_level: 'Low',
      target_amount: 8000000, raised_amount: 2400000, investor_count: 89, min_investment: 2000, max_investment: 200000,
      plans: JSON.stringify([
        { name: 'Solar Lite', min: 2000, max: 10000, apy: 10.0, term: '12 Months', payout: 'Monthly' },
        { name: 'Solar Plus', min: 10000, max: 50000, apy: 11.8, term: '24 Months', payout: 'Monthly' },
        { name: 'Solar Max', min: 50000, max: 200000, apy: 13.5, term: '36 Months', payout: 'Quarterly' },
      ]),
    },
    {
      id: 'urb', name: 'URB — Urban Realty Block', symbol: 'URB',
      location: 'Sathorn, Bangkok', category: 'Real Estate', region: 'Sathorn, Bangkok',
      description: 'Tokenized commercial real estate portfolio in Bangkok CBD. Grade A office buildings with blue-chip tenants.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      series: 'Series B', badge: 'Tokenized', asset_id: '#3301-RWA', risk_level: 'Low',
      target_amount: 15000000, raised_amount: 4100000, investor_count: 203, min_investment: 5000, max_investment: 500000,
      plans: JSON.stringify([
        { name: 'Block', min: 5000, max: 25000, apy: 8.0, term: '12 Months', payout: 'Quarterly' },
        { name: 'Tower', min: 25000, max: 100000, apy: 9.5, term: '24 Months', payout: 'Monthly' },
        { name: 'Skyline', min: 100000, max: 500000, apy: 11.0, term: '36 Months', payout: 'Monthly' },
      ]),
    },
  ];

  const insertProject = db.prepare(`
    INSERT OR IGNORE INTO projects (id, name, symbol, location, category, region, description, image, series, badge, asset_id, risk_level, target_amount, raised_amount, investor_count, min_investment, max_investment, plans)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of SEED_PROJECTS) {
    insertProject.run(p.id, p.name, p.symbol, p.location, p.category, p.region, p.description, p.image, p.series, p.badge, p.asset_id, p.risk_level, p.target_amount, p.raised_amount, p.investor_count, p.min_investment, p.max_investment, p.plans);
  }
  console.log('📋 Seed projects created');
}

// ─── Helper: Get setting ─────────────────────────────────────────
export function getSetting(key) {
  const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get(key);
  return row?.value ?? null;
}

export function getSettingBool(key) {
  return getSetting(key) === 'true';
}

export function getSettingNumber(key) {
  const val = getSetting(key);
  return val !== null ? parseFloat(val) : null;
}

export default db;
