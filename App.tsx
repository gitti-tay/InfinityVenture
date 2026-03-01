import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import { AuthProvider } from '@/app/contexts/AuthContext';
import { WalletProvider } from '@/app/contexts/WalletContext';
import { NotificationProvider } from '@/app/contexts/NotificationContext';
import { ProtectedRoute, GuestRoute } from '@/app/guards/ProtectedRoute';
import { AdminRoute } from '@/app/guards/AdminRoute';
import { ResponsiveLayout } from '@/app/responsive-layout';
import { ErrorBoundary } from '@/app/components/error-boundary';

// ─── Screens ──────────────────────────────────────────────────────
import { WelcomeScreen } from '@/app/screens/welcome-screen';
import { LoginScreen } from '@/app/screens/login-screen';
import { SignUpScreen } from '@/app/screens/signup-screen';
import { KYCStartScreen } from '@/app/screens/kyc-start-screen';
import { HomeScreen } from '@/app/screens/home-screen';
import { InvestScreen } from '@/app/screens/invest-screen';
import { ProjectDetailsScreen } from '@/app/screens/project-details-screen';
import { PortfolioScreen } from '@/app/screens/portfolio-screen';
import { WalletScreen } from '@/app/screens/wallet-screen-v2';
import { SettingsScreen } from '@/app/screens/settings-screen';
import { NotificationsScreen } from '@/app/screens/notifications-screen';
import { DepositScreen } from '@/app/screens/deposit-screen';
import { WithdrawScreen } from '@/app/screens/withdraw-screen';
import { ReportsScreen } from '@/app/screens/reports-screen';
import { ConnectWalletScreen } from '@/app/screens/connect-wallet-screen';
import { QRScannerScreen } from '@/app/screens/qr-scanner-screen';
import { BiometricRegistrationScreen } from '@/app/screens/biometric-registration-screen';
import { ReferralRewardsScreen } from '@/app/screens/referral-rewards-screen';
import { ForgotPasswordScreen } from '@/app/screens/forgot-password-screen';
import { GoogleAuthSuccessScreen } from '@/app/screens/google-auth-success-screen';
import { WithdrawalAddressesScreen } from '@/app/screens/withdrawal-addresses-screen';
import { EmailVerificationScreen } from '@/app/screens/email-verification-screen';
import { InvestAmountScreen } from '@/app/screens/invest-amount-screen';
import { InvestReviewScreen } from '@/app/screens/invest-review-screen';
import { InvestSuccessScreen } from '@/app/screens/invest-success-screen';
import { PaymentMethodsScreen } from '@/app/screens/payment-methods-screen';
import { DocumentsScreen } from '@/app/screens/documents-screen';
import { PreferencesScreen } from '@/app/screens/preferences-screen';
import { ProjectDocumentsScreen } from '@/app/screens/project-documents-screen';
import { DepositSuccessScreen } from '@/app/screens/deposit-success-screen';
import { WithdrawSuccessScreen } from '@/app/screens/withdraw-success-screen';
import { DocumentViewerScreen } from '@/app/screens/document-viewer-screen';
import { TransactionHistoryScreen } from '@/app/screens/transaction-history-screen';
import { MyInvestmentDetailScreen } from '@/app/screens/my-investment-detail-screen';

// ─── Admin Screens ────────────────────────────────────────────────
import { AdminLoginScreen } from '@/app/screens/admin/admin-login-screen';
import { AdminDashboardScreen } from '@/app/screens/admin/admin-dashboard-screen';
import { AdminUsersScreen } from '@/app/screens/admin/admin-users-screen';
import { AdminTransactionsScreen } from '@/app/screens/admin/admin-transactions-screen';
import { AdminKYCScreen } from '@/app/screens/admin/admin-kyc-screen';
import { AdminWalletsScreen } from '@/app/screens/admin/admin-wallets-screen';
import { AdminSettingsScreen } from '@/app/screens/admin/admin-settings-screen';
import { AdminAuditScreen } from '@/app/screens/admin/admin-audit-screen';
import { AdminProjectsScreen } from '@/app/screens/admin/admin-projects-screen';
import { AdminSupportScreen } from '@/app/screens/admin/admin-support-screen';
import { AdminYieldScreen } from '@/app/screens/admin/admin-yield-screen';
import { AdminComplianceScreen } from '@/app/screens/admin/admin-compliance-screen';
import { AdminProjectWalletsScreen } from '@/app/screens/admin/admin-project-wallets-screen';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <WalletProvider>
            <NotificationProvider>
              <ResponsiveLayout>
                <div className="min-h-screen bg-background font-['Manrope',sans-serif]">
                  <Routes>
                    {/* ── Public / Guest Routes ──────────────── */}
                    <Route path="/" element={<GuestRoute><WelcomeScreen /></GuestRoute>} />
                    <Route path="/login" element={<GuestRoute><LoginScreen /></GuestRoute>} />
                    <Route path="/signup" element={<GuestRoute><SignUpScreen /></GuestRoute>} />
                    <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                    <Route path="/auth/google/success" element={<GoogleAuthSuccessScreen />} />

                    {/* ── Onboarding (authenticated) ─────────── */}
                    <Route path="/email-verification" element={<ProtectedRoute><EmailVerificationScreen /></ProtectedRoute>} />
                    <Route path="/connect-wallet" element={<ProtectedRoute><ConnectWalletScreen /></ProtectedRoute>} />
                    <Route path="/qr-scanner" element={<ProtectedRoute><QRScannerScreen /></ProtectedRoute>} />
                    <Route path="/biometric-registration" element={<ProtectedRoute><BiometricRegistrationScreen /></ProtectedRoute>} />
                    <Route path="/kyc-start" element={<ProtectedRoute><KYCStartScreen /></ProtectedRoute>} />

                    {/* ── Main App Routes (Protected) ─────────── */}
                    <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
                    <Route path="/invest" element={<ProtectedRoute><InvestScreen /></ProtectedRoute>} />
                    <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailsScreen /></ProtectedRoute>} />
                    <Route path="/portfolio" element={<ProtectedRoute><PortfolioScreen /></ProtectedRoute>} />
                    <Route path="/wallet" element={<ProtectedRoute><WalletScreen /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
                    <Route path="/withdrawal-addresses" element={<ProtectedRoute><WithdrawalAddressesScreen /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />

                    {/* ── Financial Operations (Protected) ─────── */}
                    <Route path="/deposit" element={<ProtectedRoute><DepositScreen /></ProtectedRoute>} />
                    <Route path="/deposit-success" element={<ProtectedRoute><DepositSuccessScreen /></ProtectedRoute>} />
                    <Route path="/withdraw" element={<ProtectedRoute><WithdrawScreen /></ProtectedRoute>} />
                    <Route path="/withdraw-success" element={<ProtectedRoute><WithdrawSuccessScreen /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsScreen /></ProtectedRoute>} />
                    <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistoryScreen /></ProtectedRoute>} />

                    {/* ── Investment Flow (Protected) ─────────── */}
                    <Route path="/invest-amount" element={<ProtectedRoute><InvestAmountScreen /></ProtectedRoute>} />
                    <Route path="/invest-review" element={<ProtectedRoute><InvestReviewScreen /></ProtectedRoute>} />
                    <Route path="/invest-success" element={<ProtectedRoute><InvestSuccessScreen /></ProtectedRoute>} />

                    {/* ── Account & Settings (Protected) ──────── */}
                    <Route path="/referral-rewards" element={<ProtectedRoute><ReferralRewardsScreen /></ProtectedRoute>} />
                    <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsScreen /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><DocumentsScreen /></ProtectedRoute>} />
                    <Route path="/document/:documentId" element={<ProtectedRoute><DocumentViewerScreen /></ProtectedRoute>} />
                    <Route path="/preferences" element={<ProtectedRoute><PreferencesScreen /></ProtectedRoute>} />
                    <Route path="/project/:projectId/documents" element={<ProtectedRoute><ProjectDocumentsScreen /></ProtectedRoute>} />
                    <Route path="/my-investment/:id" element={<ProtectedRoute><MyInvestmentDetailScreen /></ProtectedRoute>} />

                    {/* ── Admin Panel ─────────────────────────── */}
                    <Route path="/admin/login" element={<AdminLoginScreen />} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboardScreen /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsersScreen /></AdminRoute>} />
                    <Route path="/admin/transactions" element={<AdminRoute><AdminTransactionsScreen /></AdminRoute>} />
                    <Route path="/admin/kyc" element={<AdminRoute><AdminKYCScreen /></AdminRoute>} />
                    <Route path="/admin/wallets" element={<AdminRoute><AdminWalletsScreen /></AdminRoute>} />
                    <Route path="/admin/projects" element={<AdminRoute><AdminProjectsScreen /></AdminRoute>} />
                    <Route path="/admin/support" element={<AdminRoute><AdminSupportScreen /></AdminRoute>} />
                    <Route path="/admin/yield" element={<AdminRoute><AdminYieldScreen /></AdminRoute>} />
                    <Route path="/admin/compliance" element={<AdminRoute><AdminComplianceScreen /></AdminRoute>} />
                    <Route path="/admin/project-wallets" element={<AdminRoute><AdminProjectWalletsScreen /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute><AdminSettingsScreen /></AdminRoute>} />
                    <Route path="/admin/audit" element={<AdminRoute><AdminAuditScreen /></AdminRoute>} />

                    {/* ── Fallback ───────────────────────────── */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </ResponsiveLayout>
            </NotificationProvider>
          </WalletProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
