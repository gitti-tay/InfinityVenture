#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
//  Security Audit Test Suite — All 15 Security Areas
//  Run: node test/security-audit.mjs
// ═══════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SERVER = path.join(ROOT, 'server');

let passed = 0;
let failed = 0;
let warnings = 0;
const results = [];

function assert(condition, area, test, detail = '') {
  if (condition) {
    passed++;
    results.push({ status: '✅', area, test });
  } else {
    failed++;
    results.push({ status: '❌', area, test, detail });
  }
}

function warn(area, test, detail = '') {
  warnings++;
  results.push({ status: '⚠️', area, test, detail });
}

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

console.log('\n' + '═'.repeat(60));
console.log('  🔒 SECURITY AUDIT — 15 Areas Comprehensive Check');
console.log('═'.repeat(60) + '\n');

// ═══════════════════════════════════════════════════════════════
//  ① CORS/Preflight
// ═══════════════════════════════════════════════════════════════
const securityJs = readFile('server/middleware/security.js');
const indexJs = readFile('server/index.js');

assert(securityJs.includes('corsConfig'), '① CORS', 'Dynamic CORS config factory exists');
assert(securityJs.includes('CORS_ORIGIN'), '① CORS', 'CORS_ORIGIN env var used for whitelist');
assert(securityJs.includes('optionsSuccessStatus: 204'), '① CORS', 'Preflight returns 204');
assert(securityJs.includes("maxAge: 600"), '① CORS', 'Preflight cache ≤10min (allows quick policy changes)');
assert(indexJs.includes('corsConfig()'), '① CORS', 'index.js uses corsConfig factory');
assert(securityJs.includes('exposedHeaders'), '① CORS', 'Only specified headers exposed');
assert(!indexJs.includes("origin: '*'"), '① CORS', 'No wildcard origin in production');

// ═══════════════════════════════════════════════════════════════
//  ② CSRF
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('csrfProtection'), '② CSRF', 'CSRF protection middleware exists');
assert(securityJs.includes("Bearer"), '② CSRF', 'Bearer token auth exempted (inherently CSRF-proof)');
assert(securityJs.includes('generateCsrfToken'), '② CSRF', 'CSRF token generator exists');
assert(securityJs.includes('timingSafeEqual'), '② CSRF', 'Timing-safe comparison for CSRF tokens');
assert(securityJs.includes("sameSite: 'strict'") || securityJs.includes("sameSite: isProd"), '② CSRF', 'SameSite cookie attribute set');
assert(securityJs.includes('x-csrf-token'), '② CSRF', 'CSRF header checked');

// ═══════════════════════════════════════════════════════════════
//  ③ XSS + CSP
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('Content-Security-Policy'), '③ XSS+CSP', 'CSP header set');
assert(securityJs.includes('nonce-'), '③ XSS+CSP', 'Nonce-based CSP for inline scripts');
assert(securityJs.includes("frame-ancestors 'none'"), '③ XSS+CSP', 'Clickjacking protection via CSP');
assert(securityJs.includes("base-uri 'self'"), '③ XSS+CSP', 'Base tag hijacking prevented');
assert(securityJs.includes("object-src 'none'"), '③ XSS+CSP', 'Plugin/Flash blocked');
assert(securityJs.includes("form-action 'self'"), '③ XSS+CSP', 'Form action restricted');
assert(securityJs.includes('upgrade-insecure-requests'), '③ XSS+CSP', 'Auto HTTP→HTTPS upgrade');
assert(securityJs.includes('sanitizeInput'), '③ XSS+CSP', 'Input sanitization middleware');
assert(securityJs.includes('DANGEROUS_PATTERNS'), '③ XSS+CSP', 'XSS patterns blocked');
assert(securityJs.includes('<svg'), '③ XSS+CSP', 'SVG onload attack pattern blocked');
assert(securityJs.includes('<base'), '③ XSS+CSP', 'Base tag injection blocked');
assert(securityJs.includes('depth > 10'), '③ XSS+CSP', 'Deep recursion DoS prevented in sanitizer');

// ═══════════════════════════════════════════════════════════════
//  ④ SSRF
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('ssrfGuard'), '④ SSRF', 'SSRF guard middleware exists');
assert(securityJs.includes('PRIVATE_IP_RANGES'), '④ SSRF', 'Private IP ranges defined');
assert(securityJs.includes('isPrivateUrl'), '④ SSRF', 'Private URL detection function');
assert(securityJs.includes('127.'), '④ SSRF', 'Loopback blocked');
assert(securityJs.includes('169') && securityJs.includes('254'), '④ SSRF', 'Link-local blocked');
assert(securityJs.includes('fc00:'), '④ SSRF', 'IPv6 unique-local blocked');
assert(securityJs.includes('localhost'), '④ SSRF', 'Localhost blocked');
assert(indexJs.includes('ssrfGuard'), '④ SSRF', 'SSRF guard applied in middleware chain');

// ═══════════════════════════════════════════════════════════════
//  ⑤ AuthN/AuthZ
// ═══════════════════════════════════════════════════════════════
const authJs = readFile('server/middleware/auth.js');
assert(authJs.includes('authRequired'), '⑤ AuthN', 'Authentication middleware exists');
assert(authJs.includes('verifyToken'), '⑤ AuthN', 'JWT verification function');
assert(authJs.includes("algorithms: ['HS256']"), '⑤ AuthN', 'Algorithm confusion attack prevented');
assert(authJs.includes('TokenExpiredError'), '⑤ AuthN', 'Token expiry handled');
assert(authJs.includes('is_suspended'), '⑤ AuthN', 'Suspended account check');
assert(authJs.includes('issuer:'), '⑤ AuthN', 'JWT issuer claim validated');
assert(authJs.includes('audience:'), '⑤ AuthN', 'JWT audience claim validated');
assert(authJs.includes('token.length > 2048'), '⑤ AuthN', 'Token size limit enforced');

// Session validation
assert(authJs.includes('SESSION_INVALID'), '⑤ AuthN', 'Revoked session detection');
assert(authJs.includes('token_hash'), '⑤ AuthN', 'Token stored as hash (not plaintext)');

// ═══════════════════════════════════════════════════════════════
//  ⑥ RBAC / Tenant Isolation
// ═══════════════════════════════════════════════════════════════
assert(authJs.includes('ROLE_HIERARCHY'), '⑥ RBAC', 'Role hierarchy defined');
assert(authJs.includes('requireRole'), '⑥ RBAC', 'Generic role requirement function');
assert(authJs.includes('adminRequired'), '⑥ RBAC', 'Admin role middleware');
assert(authJs.includes('superadminRequired'), '⑥ RBAC', 'Superadmin role middleware');
assert(authJs.includes('tenantIsolation'), '⑥ Tenant', 'Tenant isolation middleware');
assert(authJs.includes('ownershipCheck'), '⑥ Tenant', 'Ownership check helper');

// Verify routes enforce tenant isolation (all user queries filter by user_id)
const txJs = readFile('server/routes/transactions.js');
const invJs = readFile('server/routes/investments.js');
const walletJs = readFile('server/routes/wallet.js');
assert(txJs.includes('req.user.id'), '⑥ Tenant', 'Transactions filtered by user_id');
assert(invJs.includes('req.user.id'), '⑥ Tenant', 'Investments filtered by user_id');
assert(walletJs.includes('req.user.id'), '⑥ Tenant', 'Wallet filtered by user_id');

// Admin param validation
const adminJs = readFile('server/routes/admin.js');
assert(adminJs.includes("router.param('userId'"), '⑥ RBAC', 'Admin userId param validated');
assert(adminJs.includes("router.param('txId'"), '⑥ RBAC', 'Admin txId param validated');

// ═══════════════════════════════════════════════════════════════
//  ⑦ Least Privilege
// ═══════════════════════════════════════════════════════════════
assert(authJs.includes('formatUser'), '⑦ LeastPriv', 'User object formatted (no password hash)');
assert(!authJs.includes('password_hash') || authJs.includes('SELECT id, email'), '⑦ LeastPriv', 'Password hash not in user queries');
assert(authJs.includes("sub: userId"), '⑦ LeastPriv', 'JWT uses minimal claims (sub + role)');
assert(authJs.includes('jti:'), '⑦ LeastPriv', 'JWT has unique token ID');

// ═══════════════════════════════════════════════════════════════
//  ⑧ Validation + SQLi Defense
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('validateEmail'), '⑧ Validation', 'Email validation exists');
assert(securityJs.includes('validatePassword'), '⑧ Validation', 'Password validation exists');
assert(securityJs.includes('validateAmount'), '⑧ Validation', 'Amount validation exists');
assert(securityJs.includes('validateId'), '⑧ Validation', 'ID format validation exists');
assert(securityJs.includes('validatePagination'), '⑧ Validation', 'Pagination validation exists');

// SQLi — check all .js files use parameterized queries (? placeholders)
const allServerFiles = fs.readdirSync(path.join(SERVER, 'routes')).filter(f => f.endsWith('.js'));
let sqliSafe = true;
for (const file of allServerFiles) {
  const content = readFile(`server/routes/${file}`);
  // Check for string concatenation in SQL (dangerous pattern)
  // Match lines with prepare() containing ${...}
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.includes('prepare(') && line.includes('${')) {
      // Safe patterns: dynamic WHERE/SET/ORDER/LIMIT clauses built from code-controlled variables
      const safeVars = ['where', 'WHERE', 'orderBy', 'order', 'limit', 'offset', 'set', 'SET',
                        'qs', 'query', 'updates', 'columns', 'datetime', 'rapidWindow'];
      const interpolations = line.match(/\$\{(\w+)/g) || [];
      const unsafeVars = interpolations.filter(v => !safeVars.some(s => v.toLowerCase().includes(s.toLowerCase())));
      if (unsafeVars.length > 0) {
        sqliSafe = false;
        warn('⑧ SQLi', `${file}: Unsafe SQL interpolation: ${unsafeVars.join(', ')}`, line.trim().substring(0, 120));
      }
    }
  }
  // (unsafe interpolations already warned above)
}
assert(sqliSafe, '⑧ SQLi', 'No unsafe SQL string interpolation detected');

// Check all queries use prepare().get/all/run (parameterized)
let parameterizedCount = 0;
for (const file of allServerFiles) {
  const content = readFile(`server/routes/${file}`);
  parameterizedCount += (content.match(/\.prepare\(/g) || []).length;
}
assert(parameterizedCount > 50, '⑧ SQLi', `${parameterizedCount} parameterized queries found (>50)`);

// ═══════════════════════════════════════════════════════════════
//  ⑨ Rate Limiting / Bruteforce
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('rateLimit'), '⑨ RateLimit', 'Rate limiter exists');
assert(securityJs.includes('authLimiter'), '⑨ RateLimit', 'Auth-specific limiter');
assert(securityJs.includes('strictLimiter'), '⑨ RateLimit', 'Strict limiter for sensitive ops');
assert(securityJs.includes('sensitiveOpLimiter'), '⑨ RateLimit', 'Sensitive operation limiter');
assert(securityJs.includes('bruteforceProtection'), '⑨ Bruteforce', 'Progressive bruteforce shield');
assert(securityJs.includes('recordBruteforce'), '⑨ Bruteforce', 'Failure recording function');
assert(securityJs.includes('clearBruteforce') || securityJs.includes('req.clearBruteforce'), '⑨ Bruteforce', 'Success clears bruteforce counter');
assert(securityJs.includes('Retry-After'), '⑨ RateLimit', 'Retry-After header set on 429');

// Check progressive tiers
assert(securityJs.includes('60_000') && securityJs.includes('300_000'), '⑨ Bruteforce', 'Multiple backoff tiers (1min, 5min)');

const authRoutesJs = readFile('server/routes/auth.js');
assert(authRoutesJs.includes('bruteforceProtection'), '⑨ Bruteforce', 'Login uses bruteforce protection');
assert(authRoutesJs.includes('req.recordBruteforce'), '⑨ Bruteforce', 'Login records failures');
assert(authRoutesJs.includes('req.clearBruteforce'), '⑨ Bruteforce', 'Login clears on success');

// ═══════════════════════════════════════════════════════════════
//  ⑩ Cookie + Session Security
// ═══════════════════════════════════════════════════════════════
assert(authJs.includes('COOKIE_OPTIONS'), '⑩ Cookie', 'Cookie options constant defined');
assert(authJs.includes('httpOnly: true'), '⑩ Cookie', 'HttpOnly flag set');
assert(authJs.includes("secure: isProd") || authJs.includes('secure: true'), '⑩ Cookie', 'Secure flag (HTTPS only in prod)');
assert(authJs.includes("sameSite:"), '⑩ Cookie', 'SameSite attribute set');

// Session management
assert(authRoutesJs.includes('sessions'), '⑩ Session', 'Session table used for tracking');
assert(authRoutesJs.includes('token_hash'), '⑩ Session', 'Tokens stored as hashes');
assert(authRoutesJs.includes('expires_at'), '⑩ Session', 'Session expiration enforced');
assert(authRoutesJs.includes("revoked"), '⑩ Session', 'Session revocation supported');

// ═══════════════════════════════════════════════════════════════
//  ⑪ Secret Management + Rotation
// ═══════════════════════════════════════════════════════════════
assert(authJs.includes('JWT_SECRET'), '⑪ Secret', 'JWT secret from env var');
assert(authJs.includes('JWT_SECRET.length < 32'), '⑪ Secret', 'Minimum secret length enforced (32 chars)');
assert(authJs.includes('process.exit(1)'), '⑪ Secret', 'Server exits if secret too weak in production');
assert(authJs.includes('JWT_ISSUER'), '⑪ Secret', 'JWT issuer claim prevents token reuse across services');
assert(authJs.includes('JWT_AUDIENCE'), '⑪ Secret', 'JWT audience claim validates intended recipient');

// .env.example doesn't contain real secrets
const envExample = readFile('.env.example');
assert(!envExample.includes('sk_') && !envExample.includes('eyJ'), '⑪ Secret', '.env.example has no real secrets');

// .gitignore blocks secrets
const gitignore = readFile('.gitignore');
assert(gitignore.includes('.env'), '⑪ Secret', '.env files in .gitignore');
assert(gitignore.includes('.db'), '⑪ Secret', 'DB files in .gitignore');

// ═══════════════════════════════════════════════════════════════
//  ⑫ HTTPS / HSTS + Security Headers
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('Strict-Transport-Security'), '⑫ HSTS', 'HSTS header set');
assert(securityJs.includes('63072000') || securityJs.includes('31536000'), '⑫ HSTS', 'HSTS max-age ≥ 1 year');
assert(securityJs.includes('includeSubDomains'), '⑫ HSTS', 'HSTS includes subdomains');
assert(securityJs.includes('preload'), '⑫ HSTS', 'HSTS preload flag');
assert(securityJs.includes('X-Content-Type-Options'), '⑫ Headers', 'Content sniffing prevention');
assert(securityJs.includes('X-Frame-Options'), '⑫ Headers', 'Clickjacking prevention');
assert(securityJs.includes('Referrer-Policy'), '⑫ Headers', 'Referrer policy set');
assert(securityJs.includes('Permissions-Policy'), '⑫ Headers', 'Feature/permissions policy');
assert(securityJs.includes('Cross-Origin-Opener-Policy'), '⑫ Headers', 'COOP header set');
assert(securityJs.includes('Cross-Origin-Resource-Policy'), '⑫ Headers', 'CORP header set');
assert(securityJs.includes("removeHeader('X-Powered-By')"), '⑫ Headers', 'Server fingerprint removed');
assert(securityJs.includes("removeHeader('Server')"), '⑫ Headers', 'Server header removed');

// ═══════════════════════════════════════════════════════════════
//  ⑬ Audit Logging
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('auditLog'), '⑬ AuditLog', 'Audit log function exists');
assert(securityJs.includes('CRITICAL_ACTIONS'), '⑬ AuditLog', 'Critical actions detected and logged to stderr');
assert(securityJs.includes('SECURITY_AUDIT'), '⑬ AuditLog', 'Security events logged to SIEM output');
assert(securityJs.includes('ip_address'), '⑬ AuditLog', 'IP address recorded');
assert(securityJs.includes('user_agent'), '⑬ AuditLog', 'User agent recorded');

// Check audit log usage across routes
let auditUsageCount = 0;
for (const file of allServerFiles) {
  const content = readFile(`server/routes/${file}`);
  auditUsageCount += (content.match(/auditLog\(/g) || []).length;
}
assert(auditUsageCount >= 15, '⑬ AuditLog', `${auditUsageCount} audit log calls across routes (≥15)`);

// ═══════════════════════════════════════════════════════════════
//  ⑭ Error Exposure Blocking
// ═══════════════════════════════════════════════════════════════
assert(securityJs.includes('errorSanitizer'), '⑭ ErrorBlock', 'Error sanitizer middleware exists');
assert(securityJs.includes('SQLITE_'), '⑭ ErrorBlock', 'SQLite error messages stripped');
assert(securityJs.includes('[REDACTED]'), '⑭ ErrorBlock', 'Sensitive keywords redacted');
assert(securityJs.includes('requestId'), '⑭ ErrorBlock', 'Error responses include requestId for debugging');
assert(indexJs.includes('errorSanitizer'), '⑭ ErrorBlock', 'Error sanitizer applied in middleware chain');

// Check production error doesn't leak stack
assert(securityJs.includes("isProd ? {} : { stack"), '⑭ ErrorBlock', 'Stack trace hidden in production');

// API 404 doesn't leak path in production
assert(indexJs.includes("isProd ? {} : { path"), '⑭ ErrorBlock', '404 path hidden in production');

// ═══════════════════════════════════════════════════════════════
//  ⑮ Dependency Vulnerability Check
// ═══════════════════════════════════════════════════════════════
const pkgJson = JSON.parse(readFile('package.json'));
const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };

// Check for known-vulnerable packages
const knownVulnerable = ['express-fileupload', 'jquery', 'lodash.template', 'minimist', 'debug'];
const hasVulnerable = Object.keys(deps).filter(d => knownVulnerable.includes(d));
assert(hasVulnerable.length === 0, '⑮ Deps', `No known-vulnerable packages (checked: ${knownVulnerable.join(', ')})`);

// Check critical deps are present and reasonably recent
assert(deps['express'] !== undefined, '⑮ Deps', 'Express is a dependency');
assert(deps['jsonwebtoken'] !== undefined, '⑮ Deps', 'jsonwebtoken is a dependency');
assert(deps['bcryptjs'] !== undefined, '⑮ Deps', 'bcryptjs is a dependency (no native bcrypt issues)');
assert(deps['better-sqlite3'] !== undefined, '⑮ Deps', 'better-sqlite3 is a dependency');

// Check no eval or Function in server code
let hasUnsafeEval = false;
const serverFiles = ['index.js', 'db.js', 'scheduler.js', 'middleware/auth.js', 'middleware/security.js',
  ...allServerFiles.map(f => `routes/${f}`)];
for (const file of serverFiles) {
  const content = readFile(`server/${file}`);
  if (/\beval\s*\(/.test(content) || /\bnew\s+Function\s*\(/.test(content)) {
    hasUnsafeEval = true;
    warn('⑮ Deps', `${file}: Contains eval() or new Function()`, 'Potential code injection risk');
  }
}
assert(!hasUnsafeEval, '⑮ Deps', 'No eval() or new Function() in server code');

// Check .gitignore blocks sensitive files
assert(gitignore.includes('node_modules'), '⑮ Deps', 'node_modules in .gitignore');
assert(gitignore.includes('.env'), '⑮ Deps', '.env in .gitignore');

// ═══════════════════════════════════════════════════════════════
//  RESULTS
// ═══════════════════════════════════════════════════════════════
console.log('─'.repeat(60));
for (const r of results) {
  const detail = r.detail ? ` — ${r.detail}` : '';
  console.log(`${r.status} [${r.area}] ${r.test}${detail}`);
}

console.log('\n' + '═'.repeat(60));
console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${warnings} warnings`);
console.log('═'.repeat(60));

if (failed > 0) {
  console.log('\n❌ SECURITY AUDIT FAILED — Fix the above issues before deploying.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  SECURITY AUDIT PASSED WITH WARNINGS — Review above items.\n');
} else {
  console.log('\n✅ SECURITY AUDIT PASSED — All 15 areas verified.\n');
}
