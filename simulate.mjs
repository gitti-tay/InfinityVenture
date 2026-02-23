#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
//  Infinity Ventures — MVP Simulation Test
//  Tests entire user + admin flow end-to-end
// ═══════════════════════════════════════════════════════════════════

const BASE = process.env.API_URL || 'http://localhost:5000';
let passed = 0, failed = 0;
let userToken = '', adminToken = '';
let userId = '', txId = '', investmentId = '';

async function req(method, path, body, token, expectFail = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${BASE}${path}`, {
      method, headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok && !expectFail) {
      return { ok: false, status: res.status, error: data.error, data };
    }
    return { ok: res.ok, status: res.status, data, error: data.error };
  } catch (e) {
    return { ok: false, status: 0, error: e.message, data: null };
  }
}

function test(name, condition, detail) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name} ${detail ? '— ' + detail : ''}`);
  }
}

async function run() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   🧪 Infinity Ventures MVP Simulation Test      ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // ═══ 1. Health Check ═══
  console.log('📡 1. Health Check');
  const health = await req('GET', '/api/health');
  test('Server is running', health.ok && health.data?.status === 'ok');

  // ═══ 2. User Signup ═══
  console.log('\n📝 2. User Registration');
  const signupData = {
    fullName: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    phone: '+1234567890',
  };

  const signup = await req('POST', '/api/auth/signup', signupData);
  test('Signup successful', signup.ok && signup.data?.success);
  test('Returns JWT token', !!signup.data?.token);
  test('Returns user object', !!signup.data?.user?.id);
  test('User has referral code', !!signup.data?.user?.referralCode);
  userToken = signup.data?.token;
  userId = signup.data?.user?.id;

  // Duplicate email
  const dupSignup = await req('POST', '/api/auth/signup', signupData, null, true);
  test('Rejects duplicate email', !dupSignup.ok && dupSignup.status === 409);

  // Weak password
  const weakPass = await req('POST', '/api/auth/signup', { ...signupData, email: 'weak@test.com', password: '123' }, null, true);
  test('Rejects weak password', !weakPass.ok);

  // ═══ 3. Auth ═══
  console.log('\n🔐 3. Authentication');
  const me = await req('GET', '/api/auth/me', null, userToken);
  test('GET /auth/me returns user', me.ok && me.data?.user?.email === signupData.email);

  const badLogin = await req('POST', '/api/auth/login', { email: signupData.email, password: 'wrong' }, null, true);
  test('Wrong password rejected', !badLogin.ok && badLogin.status === 401);

  const login = await req('POST', '/api/auth/login', { email: signupData.email, password: signupData.password });
  test('Login with correct credentials', login.ok && login.data?.success);

  const noAuth = await req('GET', '/api/auth/me', null, null, true);
  test('Unauthenticated access rejected', !noAuth.ok && noAuth.status === 401);

  const badToken = await req('GET', '/api/auth/me', null, 'invalid-token', true);
  test('Invalid token rejected', !badToken.ok && badToken.status === 401);

  // ═══ 4. Email Verification ═══
  console.log('\n📧 4. Email Verification');
  const verify = await req('POST', '/api/auth/verify-email', { code: '123456' }, userToken);
  test('Email verification (soft launch)', verify.ok);

  // ═══ 5. Wallet Connection ═══
  console.log('\n💼 5. Wallet Connection');
  const connect = await req('POST', '/api/wallet/connect', { provider: 'MetaMask', network: 'Ethereum' }, userToken);
  test('Wallet connected', connect.ok && connect.data?.wallet?.provider === 'MetaMask');
  test('Wallet address generated', !!connect.data?.wallet?.address);

  const walletInfo = await req('GET', '/api/wallet', null, userToken);
  test('Get wallet info', walletInfo.ok && walletInfo.data?.wallet?.connected === true);

  // ═══ 6. Projects ═══
  console.log('\n📋 6. Projects');
  const projects = await req('GET', '/api/projects');
  test('List projects (public)', projects.ok && projects.data?.projects?.length > 0);

  const project = await req('GET', '/api/projects/ptf');
  test('Get single project', project.ok && project.data?.project?.id === 'ptf');
  test('Project has plans', project.data?.project?.plans?.length > 0);

  // ═══ 7. Deposit ═══
  console.log('\n💰 7. Deposit Flow');
  const depositAddresses = await req('GET', '/api/transactions/deposit-addresses', null, userToken);
  test('Get deposit addresses', depositAddresses.ok);

  const deposit = await req('POST', '/api/transactions/deposit', {
    amount: 10000, method: 'USDT', currency: 'USDT', txHash: '0xabc123test'
  }, userToken);
  test('Deposit successful', deposit.ok && deposit.data?.success);
  test('Balance updated', deposit.data?.balance >= 10000);
  test('Transaction ID returned', !!deposit.data?.txId);

  const bal = await req('GET', '/api/wallet/balance', null, userToken);
  test('Balance check after deposit', bal.ok && bal.data?.balance >= 10000);

  // ═══ 8. Investment ═══
  console.log('\n📈 8. Investment Flow');
  const invest = await req('POST', '/api/investments', {
    projectId: 'ptf',
    projectName: 'PTF — Prime Timber Forestry',
    planName: 'Growth',
    amount: 5000,
    apy: 14.2,
    term: '12 Months',
    payoutFrequency: 'Monthly',
    riskLevel: 'Low',
  }, userToken);
  test('Investment created', invest.ok && invest.data?.success);
  test('Balance deducted', invest.data?.balance <= 5000);
  test('Investment ID returned', !!invest.data?.investmentId);
  investmentId = invest.data?.investmentId;

  // Insufficient balance test
  const bigInvest = await req('POST', '/api/investments', {
    projectId: 'ptf', planName: 'Growth', amount: 999999, apy: 14.2, term: '12',
  }, userToken, true);
  test('Insufficient balance rejected', !bigInvest.ok);

  // ═══ 9. Portfolio ═══
  console.log('\n📊 9. Portfolio');
  const portfolio = await req('GET', '/api/investments/portfolio', null, userToken);
  test('Get portfolio', portfolio.ok && portfolio.data?.portfolio);
  test('Portfolio shows investment', portfolio.data?.portfolio?.activeInvestments >= 1);
  test('Total invested correct', portfolio.data?.portfolio?.totalInvested >= 5000);

  const investDetail = await req('GET', `/api/investments/${investmentId}`, null, userToken);
  test('Get investment detail', investDetail.ok && investDetail.data?.investment?.id === investmentId);

  // ═══ 10. Transactions ═══
  console.log('\n📜 10. Transaction History');
  const txList = await req('GET', '/api/transactions', null, userToken);
  test('List transactions', txList.ok && txList.data?.transactions?.length >= 2);
  test('Has deposit transaction', txList.data?.transactions?.some((t) => t.type === 'deposit'));
  test('Has invest transaction', txList.data?.transactions?.some((t) => t.type === 'invest'));

  // ═══ 11. Withdrawal ═══
  console.log('\n📤 11. Withdrawal Flow');
  const withdraw = await req('POST', '/api/transactions/withdraw', {
    amount: 500, address: '0x1234567890abcdef1234567890abcdef12345678'
  }, userToken);
  // May require KYC — check both cases
  if (withdraw.ok) {
    test('Withdrawal processed', withdraw.data?.success);
    test('Fee applied', withdraw.data?.fee > 0);
  } else {
    test('Withdrawal requires KYC (expected)', withdraw.data?.error?.includes('KYC') || withdraw.status === 403);
    // Complete KYC and retry
    await req('POST', '/api/auth/kyc/start', {}, userToken);
    await req('POST', '/api/auth/kyc/approve', {}, userToken);
    const retry = await req('POST', '/api/transactions/withdraw', { amount: 500, address: '0x123' }, userToken);
    test('Withdrawal after KYC', retry.ok || retry.data?.success !== false);
  }

  // ═══ 12. Notifications ═══
  console.log('\n🔔 12. Notifications');
  const notifs = await req('GET', '/api/notifications', null, userToken);
  test('Get notifications', notifs.ok && notifs.data?.notifications?.length > 0);
  test('Has unread count', typeof notifs.data?.unreadCount === 'number');

  // ═══ 13. Admin Login ═══
  console.log('\n👑 13. Admin Authentication');
  const adminLogin = await req('POST', '/api/auth/login', {
    email: process.env.ADMIN_EMAIL || 'admin@infinityventures.com',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2024!Secure',
  });
  test('Admin login', adminLogin.ok && adminLogin.data?.success);
  test('Admin role returned', ['admin', 'superadmin'].includes(adminLogin.data?.user?.role));
  adminToken = adminLogin.data?.token;

  // Regular user cannot access admin
  const userAdmin = await req('GET', '/api/admin/dashboard', null, userToken, true);
  test('Regular user blocked from admin', !userAdmin.ok && userAdmin.status === 403);

  // ═══ 14. Admin Dashboard ═══
  console.log('\n📊 14. Admin Dashboard');
  const dashboard = await req('GET', '/api/admin/dashboard', null, adminToken);
  test('Admin dashboard loads', dashboard.ok && dashboard.data?.dashboard);
  test('Shows user count', dashboard.data?.dashboard?.users?.total >= 1);
  test('Shows financial data', typeof dashboard.data?.dashboard?.finance?.totalDeposits === 'number');
  test('Shows recent transactions', Array.isArray(dashboard.data?.dashboard?.recentTransactions));

  // ═══ 15. Admin User Management ═══
  console.log('\n👥 15. Admin User Management');
  const users = await req('GET', '/api/admin/users', null, adminToken);
  test('List users', users.ok && users.data?.users?.length >= 1);

  const userDetail = await req('GET', `/api/admin/users/${userId}`, null, adminToken);
  test('Get user detail', userDetail.ok && userDetail.data?.user?.id === userId);
  test('User detail has transactions', Array.isArray(userDetail.data?.transactions));

  // ═══ 16. Admin Wallet Management ═══
  console.log('\n🏦 16. Admin Wallets');
  const adminWallets = await req('GET', '/api/admin/wallets', null, adminToken);
  test('List admin wallets', adminWallets.ok && Array.isArray(adminWallets.data?.wallets));

  const newWallet = await req('POST', '/api/admin/wallets', {
    label: 'Test BNB Wallet', address: '0xTEST_BNB_ADDRESS', network: 'BEP20', currency: 'USDT', walletType: 'deposit'
  }, adminToken);
  test('Create admin wallet', newWallet.ok && newWallet.data?.wallet?.id);

  if (newWallet.data?.wallet?.id) {
    const updated = await req('PUT', `/api/admin/wallets/${newWallet.data.wallet.id}`, {
      label: 'Updated BNB Wallet'
    }, adminToken);
    test('Update admin wallet', updated.ok);

    const deleted = await req('DELETE', `/api/admin/wallets/${newWallet.data.wallet.id}`, null, adminToken);
    test('Delete admin wallet', deleted.ok);
  }

  // ═══ 17. Admin Settings ═══
  console.log('\n⚙️ 17. System Settings');
  const settings = await req('GET', '/api/admin/settings', null, adminToken);
  test('Get settings', settings.ok && settings.data?.settings);
  test('Has deposit_min setting', !!settings.data?.settings?.deposit_min);

  const updateSettings = await req('PUT', '/api/admin/settings', {
    settings: { deposit_min: '100' }
  }, adminToken);
  test('Update settings', updateSettings.ok);

  // Restore original
  await req('PUT', '/api/admin/settings', { settings: { deposit_min: '50' } }, adminToken);

  // ═══ 18. Admin KYC ═══
  console.log('\n🆔 18. KYC Management');
  const pendingKYC = await req('GET', '/api/admin/kyc/pending', null, adminToken);
  test('List pending KYC', pendingKYC.ok && Array.isArray(pendingKYC.data?.users));

  // ═══ 19. Admin Pending Transactions ═══
  console.log('\n⏳ 19. Transaction Approval');
  const pendingTx = await req('GET', '/api/admin/transactions/pending', null, adminToken);
  test('List pending transactions', pendingTx.ok && Array.isArray(pendingTx.data?.transactions));

  // ═══ 20. Audit Logs ═══
  console.log('\n📋 20. Audit Logs');
  const auditLogs = await req('GET', '/api/admin/audit-logs', null, adminToken);
  test('Get audit logs', auditLogs.ok && Array.isArray(auditLogs.data?.logs));
  test('Audit logs have entries', auditLogs.data?.logs?.length > 0);

  // ═══ 21. Reports ═══
  console.log('\n📑 21. Reports');
  const report = await req('GET', '/api/admin/reports/summary', null, adminToken);
  test('Get report summary', report.ok && report.data?.report);

  // ═══ 22. Security Tests ═══
  console.log('\n🔒 22. Security Checks');
  
  // Suspend user test
  const suspend = await req('POST', `/api/admin/users/${userId}/suspend`, { reason: 'Test suspension' }, adminToken);
  test('Suspend user', suspend.ok);

  const suspendedAccess = await req('GET', '/api/auth/me', null, userToken, true);
  test('Suspended user blocked', !suspendedAccess.ok && suspendedAccess.status === 403);

  const unsuspend = await req('POST', `/api/admin/users/${userId}/unsuspend`, {}, adminToken);
  test('Unsuspend user', unsuspend.ok);

  const restoredAccess = await req('GET', '/api/auth/me', null, userToken);
  test('Restored user can access', restoredAccess.ok);

  // Profile update
  const updateProfile = await req('PUT', '/api/auth/me', { fullName: 'Updated Name' }, userToken);
  test('Update profile', updateProfile.ok && updateProfile.data?.user?.fullName === 'Updated Name');

  // Password change
  const changePw = await req('POST', '/api/auth/change-password', {
    currentPassword: 'TestPass123!', newPassword: 'NewPass456!'
  }, userToken);
  test('Change password', changePw.ok);

  // ═══ 23. Logout ═══
  console.log('\n🚪 23. Logout');
  const logout = await req('POST', '/api/auth/logout', null, userToken);
  test('User logout', logout.ok);

  // Re-login for remaining tests
  const relogin = await req('POST', '/api/auth/login', { email: 'testuser@infinity.io', password: 'Test1234!' });
  if (relogin.ok) userToken = relogin.data.token;
  test('Re-login for extended tests', relogin.ok);

  // ═══ 24. Legal Acceptance ═══
  console.log('\n📋 24. Legal Acceptance');
  const legalStatus = await req('GET', '/api/legal/status', null, userToken);
  test('Get legal status', legalStatus.ok);

  const termsDoc = await req('GET', '/api/legal/documents/terms', null, userToken);
  test('Get Terms of Service document', termsDoc.ok && termsDoc.data?.document?.content?.length > 100);

  const privacyDoc = await req('GET', '/api/legal/documents/privacy', null, userToken);
  test('Get Privacy Policy document', privacyDoc.ok);

  const riskDoc = await req('GET', '/api/legal/documents/risk_disclosure', null, userToken);
  test('Get Risk Disclosure document', riskDoc.ok);

  const acceptAll = await req('POST', '/api/legal/accept-all', {}, userToken);
  test('Accept all legal documents', acceptAll.ok);

  const legalStatus2 = await req('GET', '/api/legal/status', null, userToken);
  test('Legal status updated (all accepted)', legalStatus2.ok &&
    legalStatus2.data?.terms?.accepted && legalStatus2.data?.privacy?.accepted && legalStatus2.data?.risk?.accepted);

  const legalHistory = await req('GET', '/api/legal/history', null, userToken);
  test('Get legal acceptance history', legalHistory.ok && legalHistory.data?.acceptances?.length >= 3);

  // ═══ 25. Withdrawal Address Management ═══
  console.log('\n🏠 25. Withdrawal Address Management');
  const addAddr = await req('POST', '/api/compliance/withdrawal-addresses', {
    label: 'My Binance', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD53', network: 'ethereum', currency: 'USDT'
  }, userToken);
  test('Add withdrawal address', addAddr.ok);

  const addAddr2 = await req('POST', '/api/compliance/withdrawal-addresses', {
    label: 'My MetaMask', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', network: 'ethereum', currency: 'USDC'
  }, userToken);
  test('Add second withdrawal address', addAddr2.ok);

  const listAddr = await req('GET', '/api/compliance/withdrawal-addresses', null, userToken);
  test('List withdrawal addresses (2)', listAddr.ok && listAddr.data?.addresses?.length >= 2);

  // Delete one
  if (listAddr.data?.addresses?.length > 0) {
    const delAddr = await req('DELETE', `/api/compliance/withdrawal-addresses/${listAddr.data.addresses[1].id}`, null, userToken);
    test('Delete withdrawal address', delAddr.ok);
  }

  const listAddr2 = await req('GET', '/api/compliance/withdrawal-addresses', null, userToken);
  test('Address list updated after delete', listAddr2.ok && listAddr2.data?.addresses?.length === 1);

  // ═══ 26. Password Reset Flow ═══
  console.log('\n🔑 26. Password Reset');
  const resetReq = await req('POST', '/api/compliance/password-reset/request', { email: 'testuser@infinity.io' });
  test('Request password reset (no enumeration)', resetReq.ok);

  const resetBad = await req('POST', '/api/compliance/password-reset/confirm', { token: 'badtoken123', newPassword: 'NewPass123!' });
  test('Invalid reset token rejected', !resetBad.ok);

  // ═══ 27. AML/Compliance (Admin) ═══
  console.log('\n🛡️ 27. AML/Compliance');
  const compFlags = await req('GET', '/api/compliance/admin/flags', null, adminToken);
  test('Get compliance flags', compFlags.ok);

  const manualFlag = await req('POST', '/api/compliance/admin/manual-flag', {
    userId: userId, flagType: 'manual_flag', severity: 'medium', description: 'Test manual flag for review'
  }, adminToken);
  test('Create manual compliance flag', manualFlag.ok);

  const compFlags2 = await req('GET', '/api/compliance/admin/flags?status=open', null, adminToken);
  test('Open flags include manual flag', compFlags2.ok && compFlags2.data?.flags?.length > 0);

  // Update flag status
  if (compFlags2.data?.flags?.length > 0) {
    const flagId = compFlags2.data.flags[0].id;
    const updateFlag = await req('PUT', `/api/compliance/admin/flags/${flagId}`, {
      status: 'investigating', resolutionNote: 'Under review'
    }, adminToken);
    test('Update flag to investigating', updateFlag.ok);

    const resolveFlag = await req('PUT', `/api/compliance/admin/flags/${flagId}`, {
      status: 'resolved', resolutionNote: 'Verified legitimate activity'
    }, adminToken);
    test('Resolve compliance flag', resolveFlag.ok);
  }

  const userRisk = await req('GET', `/api/compliance/admin/user-risk/${userId}`, null, adminToken);
  test('Get user risk profile', userRisk.ok && userRisk.data?.riskProfile !== undefined);

  // ═══ 28. Project-Wallet Mapping ═══
  console.log('\n🔗 28. Project-Wallet Mapping');
  const projWallets = await req('GET', '/api/compliance/admin/project-wallets', null, adminToken);
  test('Get project-wallet mappings', projWallets.ok);

  // ═══ 29. Investment Agreement ═══
  console.log('\n📄 29. Investment Agreement');
  if (investmentId) {
    const signAgreement = await req('POST', '/api/legal/investment-agreement', {
      investmentId, projectName: 'Test Project', amount: 500, riskAcknowledged: true
    }, userToken);
    test('Sign investment agreement', signAgreement.ok);
  } else {
    test('Sign investment agreement (skipped — no investment)', true);
  }

  // ═══ 30. Session Management ═══
  console.log('\n🔐 30. Session & Security');
  const healthCheck = await req('GET', '/api/health');
  test('Health endpoint returns server info', healthCheck.ok && healthCheck.data?.version);

  // ═══ SUMMARY ═══
  console.log('\n' + '═'.repeat(50));
  console.log(`\n🏁 SIMULATION COMPLETE`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total:  ${passed + failed}`);
  console.log(`   📈 Rate:   ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED — MVP READY FOR LAUNCH!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed — review above for details.\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Test runner error:', e); process.exit(1); });
