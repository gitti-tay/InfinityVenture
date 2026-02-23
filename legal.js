// ═══════════════════════════════════════════════════════════════════
//  Legal & Compliance Routes — /api/legal/*
//  Terms acceptance, Risk disclosure, Investment agreements
// ═══════════════════════════════════════════════════════════════════
import { Router } from 'express';
import crypto from 'crypto';
import db, { getSetting } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { auditLog } from '../middleware/security.js';

const router = Router();

// ── GET /legal/status — Check user's legal acceptance status ──
router.get('/status', authRequired, (req, res) => {
  try {
    const termsVersion = getSetting('terms_version') || '1.0';
  const privacyVersion = getSetting('privacy_version') || '1.0';
  const riskVersion = getSetting('risk_disclosure_version') || '1.0';

  const termsAccepted = db.prepare(`
    SELECT id FROM legal_acceptances WHERE user_id = ? AND document_type = 'terms_of_service' AND document_version = ?
  `).get(req.user.id, termsVersion);

  const privacyAccepted = db.prepare(`
    SELECT id FROM legal_acceptances WHERE user_id = ? AND document_type = 'privacy_policy' AND document_version = ?
  `).get(req.user.id, privacyVersion);

  const riskAccepted = db.prepare(`
    SELECT id FROM legal_acceptances WHERE user_id = ? AND document_type = 'risk_disclosure' AND document_version = ?
  `).get(req.user.id, riskVersion);

  res.json({
    success: true,
    legal: {
      termsOfService: { accepted: !!termsAccepted, version: termsVersion },
      privacyPolicy: { accepted: !!privacyAccepted, version: privacyVersion },
      riskDisclosure: { accepted: !!riskAccepted, version: riskVersion },
      allAccepted: !!termsAccepted && !!privacyAccepted && !!riskAccepted,
    },
  });
  } catch (err) {
    console.error('Legal status error:', err);
    res.status(500).json({ error: 'Failed to load legal status' });
  }
});

// ── POST /legal/accept — Accept a legal document ────────────
router.post('/accept', authRequired, (req, res) => {
  const { documentType, version } = req.body;

  const validTypes = ['terms_of_service', 'privacy_policy', 'risk_disclosure', 'investment_agreement', 'cookie_policy'];
  if (!validTypes.includes(documentType)) {
    return res.status(400).json({ error: 'Invalid document type' });
  }

  const currentVersion = (() => {
    switch (documentType) {
      case 'terms_of_service': return getSetting('terms_version') || '1.0';
      case 'privacy_policy': return getSetting('privacy_version') || '1.0';
      case 'risk_disclosure': return getSetting('risk_disclosure_version') || '1.0';
      default: return version || '1.0';
    }
  })();

  // Check if already accepted
  const existing = db.prepare(`
    SELECT id FROM legal_acceptances WHERE user_id = ? AND document_type = ? AND document_version = ?
  `).get(req.user.id, documentType, currentVersion);

  if (existing) {
    return res.json({ success: true, message: 'Already accepted', alreadyAccepted: true });
  }

  const id = 'la_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO legal_acceptances (id, user_id, document_type, document_version, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, documentType, currentVersion, req.ip, req.headers['user-agent']);

  auditLog(req.user.id, 'legal.accept', 'legal', id, { documentType, version: currentVersion }, req);

  res.json({ success: true, accepted: true, documentType, version: currentVersion });
});

// ── POST /legal/accept-all — Accept all current legal docs ──
router.post('/accept-all', authRequired, (req, res) => {
  try {
    const docs = [
    ['terms_of_service', getSetting('terms_version') || '1.0'],
    ['privacy_policy', getSetting('privacy_version') || '1.0'],
    ['risk_disclosure', getSetting('risk_disclosure_version') || '1.0'],
  ];

  const results = [];
  for (const [docType, version] of docs) {
    const existing = db.prepare(`
      SELECT id FROM legal_acceptances WHERE user_id = ? AND document_type = ? AND document_version = ?
    `).get(req.user.id, docType, version);

    if (!existing) {
      const id = 'la_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO legal_acceptances (id, user_id, document_type, document_version, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, req.user.id, docType, version, req.ip, req.headers['user-agent']);
      results.push({ documentType: docType, version, accepted: true });
    } else {
      results.push({ documentType: docType, version, alreadyAccepted: true });
    }
  }

  auditLog(req.user.id, 'legal.accept_all', 'legal', null, { documents: results }, req);

  res.json({ success: true, results });
  } catch (err) {
    console.error('Legal accept-all error:', err);
    res.status(500).json({ error: 'Failed to accept documents' });
  }
});

// ── POST /legal/investment-agreement — Sign investment agreement ──
router.post('/investment-agreement', authRequired, (req, res) => {
  const { projectId, amount, riskAcknowledged } = req.body;

  if (!projectId || !amount) {
    return res.status(400).json({ error: 'Project ID and amount required' });
  }
  if (!riskAcknowledged) {
    return res.status(400).json({ error: 'Risk acknowledgment required before investing' });
  }

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Hash the agreement terms for tamper evidence
  const termsHash = crypto.createHash('sha256')
    .update(`${req.user.id}:${projectId}:${amount}:${Date.now()}`)
    .digest('hex');

  const id = 'ia_' + crypto.randomBytes(8).toString('hex');
  db.prepare(`
    INSERT INTO investment_agreements (id, user_id, project_id, amount, terms_hash, risk_acknowledged, ip_address)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `).run(id, req.user.id, projectId, amount, termsHash, req.ip);

  auditLog(req.user.id, 'legal.investment_agreement', 'investment_agreement', id, { projectId, amount, termsHash }, req);

  res.json({ success: true, agreementId: id, termsHash });
});

// ── GET /legal/history — User's acceptance history ───────────
router.get('/history', authRequired, (req, res) => {
  const acceptances = db.prepare(`
    SELECT * FROM legal_acceptances WHERE user_id = ? ORDER BY accepted_at DESC
  `).all(req.user.id);

  const agreements = db.prepare(`
    SELECT ia.*, p.name as project_name FROM investment_agreements ia
    LEFT JOIN projects p ON ia.project_id = p.id
    WHERE ia.user_id = ? ORDER BY ia.signed_at DESC
  `).all(req.user.id);

  res.json({ success: true, acceptances, agreements });
});

// ── GET /legal/documents/:type — Get document content ────────
router.get('/documents/:type', (req, res) => {
  const { type } = req.params;
  const documents = {
    terms: {
      title: 'Terms of Service',
      version: getSetting('terms_version') || '1.0',
      lastUpdated: '2025-01-01',
      content: getTermsContent(),
    },
    privacy: {
      title: 'Privacy Policy',
      version: getSetting('privacy_version') || '1.0',
      lastUpdated: '2025-01-01',
      content: getPrivacyContent(),
    },
    risk: {
      title: 'Investment Risk Disclosure',
      version: getSetting('risk_disclosure_version') || '1.0',
      lastUpdated: '2025-01-01',
      content: getRiskContent(),
    },
  };

  if (!documents[type]) {
    return res.status(404).json({ error: 'Document not found' });
  }

  res.json({ success: true, document: documents[type] });
});

function getTermsContent() {
  return `INFINITY VENTURES — TERMS OF SERVICE

1. ACCEPTANCE OF TERMS
By accessing and using the Infinity Ventures platform ("Platform"), you agree to be bound by these Terms of Service.

2. ELIGIBILITY
You must be at least 18 years old and meet all regulatory requirements in your jurisdiction to use this Platform.

3. ACCOUNT REGISTRATION
You agree to provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials.

4. INVESTMENT SERVICES
The Platform provides access to tokenized real-world asset (RWA) investment opportunities. All investments carry inherent risks. Past performance does not guarantee future results.

5. DEPOSITS AND WITHDRAWALS
All transactions are subject to verification and compliance checks. Processing times may vary. Fees are disclosed before each transaction.

6. KYC/AML COMPLIANCE
You agree to complete identity verification (KYC) procedures as required. The Platform complies with applicable anti-money laundering (AML) regulations.

7. PROHIBITED ACTIVITIES
You may not use the Platform for money laundering, fraud, market manipulation, or any illegal activity. Violation may result in account suspension and reporting to authorities.

8. DISCLAIMERS
Investment in RWA tokens involves risk of loss. The Platform does not provide investment advice. You are solely responsible for your investment decisions.

9. LIMITATION OF LIABILITY
The Platform is not liable for losses resulting from market conditions, regulatory changes, or technological failures beyond our reasonable control.

10. DISPUTE RESOLUTION
Any disputes will be resolved through binding arbitration in accordance with applicable law.

11. MODIFICATIONS
We reserve the right to modify these Terms at any time. Continued use constitutes acceptance of modified Terms.

12. GOVERNING LAW
These Terms are governed by the laws of the jurisdiction in which Infinity Ventures operates.`;
}

function getPrivacyContent() {
  return `INFINITY VENTURES — PRIVACY POLICY

1. INFORMATION WE COLLECT
Personal identification information (name, email, phone), financial information (transaction history, wallet addresses), verification documents (ID, proof of address), and usage data.

2. HOW WE USE YOUR INFORMATION
To provide and maintain our services, process transactions, comply with KYC/AML regulations, communicate with you, and improve our platform.

3. DATA SHARING
We do not sell personal data. We may share information with regulatory authorities as required by law, service providers assisting our operations, and in connection with legal proceedings.

4. DATA SECURITY
We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your personal information.

5. DATA RETENTION
We retain personal data for as long as your account is active and as required by applicable regulations, typically a minimum of 5 years after account closure.

6. YOUR RIGHTS
You have the right to access, correct, or delete your personal data, subject to regulatory requirements. Contact support to exercise these rights.

7. COOKIES AND TRACKING
We use cookies for authentication, security, and analytics. You can manage cookie preferences through your browser settings.

8. INTERNATIONAL TRANSFERS
Your data may be transferred to and processed in jurisdictions with different data protection laws.

9. UPDATES TO THIS POLICY
We may update this Privacy Policy periodically. We will notify you of significant changes.

10. CONTACT
For privacy-related inquiries, contact our Data Protection Officer at privacy@infinityventures.com.`;
}

function getRiskContent() {
  return `INFINITY VENTURES — INVESTMENT RISK DISCLOSURE

IMPORTANT: Please read this disclosure carefully before making any investment.

1. RISK OF LOSS
All investments carry risk. You may lose some or all of your invested capital. Only invest amounts you can afford to lose.

2. MARKET RISK
The value of tokenized assets can fluctuate significantly based on market conditions, economic factors, and investor sentiment.

3. LIQUIDITY RISK
RWA investments may have limited liquidity. You may not be able to sell or redeem your investment immediately.

4. REGULATORY RISK
Changes in regulations may affect the value, legality, or operations of tokenized assets and this Platform.

5. TECHNOLOGY RISK
Blockchain and smart contract technologies carry risks including bugs, hacking, and network failures.

6. COUNTERPARTY RISK
The performance of investments depends on the underlying asset managers, issuers, and operators.

7. NO GUARANTEED RETURNS
Projected returns, APY figures, and yield estimates are not guarantees. Actual returns may differ materially.

8. NOT FINANCIAL ADVICE
The Platform does not provide personalized investment advice. You should consult with qualified financial advisors before making investment decisions.

9. DUE DILIGENCE
You are responsible for conducting your own research and due diligence before investing.

10. MAXIMUM INVESTMENT
Do not invest more than you can afford to lose. Consider diversifying across multiple assets and platforms.

BY PROCEEDING WITH ANY INVESTMENT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND ACCEPTED THESE RISKS.`;
}

export default router;
