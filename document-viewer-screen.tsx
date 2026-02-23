import { useNavigate, useLocation, useParams } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function DocumentViewerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();
  
  const doc = location.state?.document;
  
  // Sample document content based on type
  const getDocumentContent = () => {
    if (!doc) return null;
    
    switch (doc.id) {
      case '1': // Investment Agreement - SCN
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h1 className="text-2xl font-bold mb-6">Investment Agreement</h1>
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2"><strong>Project:</strong> SCN — Stem Cell Therapy Clinic</p>
              <p className="text-sm text-slate-500 mb-2"><strong>Date:</strong> February 1, 2024</p>
              <p className="text-sm text-slate-500"><strong>Agreement No:</strong> INV-SCN-2024-001</p>
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">1. PARTIES</h2>
            <p className="mb-4">
              This Investment Agreement ("Agreement") is entered into as of February 1, 2024, by and between InfinityVentures LLC ("Platform") and the Investor ("Investor"), collectively referred to as the "Parties."
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">2. INVESTMENT DETAILS</h2>
            <p className="mb-4">
              The Investor agrees to invest in fractional ownership of the SCN Stem Cell Therapy Clinic project through the tokenization platform operated by InfinityVentures.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Investment Amount:</strong> As specified in the transaction confirmation</li>
              <li><strong>Token Type:</strong> Real World Asset (RWA) Security Token</li>
              <li><strong>Minimum Investment:</strong> $50 USD</li>
              <li><strong>Expected Yield:</strong> 8.5% - 12% APY</li>
              <li><strong>Investment Term:</strong> 12-36 months</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">3. RIGHTS AND OBLIGATIONS</h2>
            <p className="mb-4"><strong>3.1 Investor Rights</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Proportional ownership rights in the underlying asset</li>
              <li>Monthly dividend distributions as applicable</li>
              <li>Access to quarterly financial reports</li>
              <li>Secondary market trading rights (subject to liquidity)</li>
              <li>Voting rights on major decisions proportional to ownership</li>
            </ul>
            
            <p className="mb-4"><strong>3.2 Platform Obligations</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Maintain transparent reporting on asset performance</li>
              <li>Process distributions within specified timeframes</li>
              <li>Ensure regulatory compliance</li>
              <li>Provide customer support and account management</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">4. RISK FACTORS</h2>
            <p className="mb-4">
              The Investor acknowledges and understands that this investment carries inherent risks, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Market volatility and economic conditions</li>
              <li>Regulatory changes affecting tokenized securities</li>
              <li>Liquidity constraints in secondary markets</li>
              <li>Operational risks of the underlying asset</li>
              <li>Technology and cybersecurity risks</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">5. REGULATORY COMPLIANCE</h2>
            <p className="mb-4">
              This investment is structured in compliance with applicable securities laws and regulations. The Investor represents that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>They meet accredited investor requirements where applicable</li>
              <li>They have completed all required KYC/AML procedures</li>
              <li>They understand the restrictions on transferability</li>
              <li>They have reviewed all offering documents</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">6. DISTRIBUTIONS</h2>
            <p className="mb-4">
              Distributions, if any, will be made on a monthly basis and deposited directly into the Investor's account. Distribution amounts are subject to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Actual performance of the underlying asset</li>
              <li>Platform fees and operational expenses</li>
              <li>Applicable withholding taxes</li>
              <li>Reserve requirements</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">7. TERM AND TERMINATION</h2>
            <p className="mb-4">
              This Agreement shall remain in effect for the duration of the investment term unless terminated earlier in accordance with the terms herein or applicable regulations.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">8. GOVERNING LAW</h2>
            <p className="mb-4">
              This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Platform is registered.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">9. AMENDMENTS</h2>
            <p className="mb-4">
              The Platform reserves the right to amend this Agreement with notice to Investors. Material changes will require Investor consent.
            </p>
            
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-700">
              <p className="text-sm text-slate-500 mb-4">
                By proceeding with this investment, the Investor acknowledges that they have read, understood, and agree to be bound by the terms of this Agreement.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <p className="text-sm font-bold mb-2">InfinityVentures LLC</p>
                  <p className="text-sm text-slate-500">Authorized Signature</p>
                  <p className="text-sm text-slate-500 mt-2">Date: February 1, 2024</p>
                </div>
                <div>
                  <p className="text-sm font-bold mb-2">Investor</p>
                  <p className="text-sm text-slate-500">Digital Signature on File</p>
                  <p className="text-sm text-slate-500 mt-2">Date: February 1, 2024</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case '4': // Tax Form 1099
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h1 className="text-2xl font-bold mb-6">Form 1099-DIV</h1>
            <p className="text-sm text-slate-500 mb-6">Dividends and Distributions - Tax Year 2024</p>
            
            <div className="bg-slate-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">PAYER'S Information</h3>
              <p className="text-sm mb-2"><strong>InfinityVentures LLC</strong></p>
              <p className="text-sm mb-2">123 Investment Plaza, Suite 500</p>
              <p className="text-sm mb-2">New York, NY 10001</p>
              <p className="text-sm">TIN: XX-XXXXXXX</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">RECIPIENT'S Information</h3>
              <p className="text-sm mb-2"><strong>Account Holder</strong></p>
              <p className="text-sm">Account No.: ••••4521</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="font-bold mb-4 text-lg">2024 Tax Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-gray-700">
                  <span className="text-sm font-medium">1a. Total Ordinary Dividends</span>
                  <span className="font-bold">$2,456.80</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-gray-700">
                  <span className="text-sm font-medium">1b. Qualified Dividends</span>
                  <span className="font-bold">$2,456.80</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-gray-700">
                  <span className="text-sm font-medium">2a. Total Capital Gain Distributions</span>
                  <span className="font-bold">$0.00</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-gray-700">
                  <span className="text-sm font-medium">3. Nondividend Distributions</span>
                  <span className="font-bold">$0.00</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-slate-200 dark:border-gray-700">
                  <span className="text-sm font-medium">4. Federal Income Tax Withheld</span>
                  <span className="font-bold">$0.00</span>
                </div>
                
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium">7. Foreign Tax Paid</span>
                  <span className="font-bold">$0.00</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Important:</strong> This is a tax document. Please consult with a tax professional for filing guidance. Keep this form with your tax records.
              </p>
            </div>
          </div>
        );
      
      case '6': // KYC Verification Documents
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h1 className="text-2xl font-bold mb-6">KYC Verification Summary</h1>
            <p className="text-sm text-slate-500 mb-6">Know Your Customer Documentation</p>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600">verified_user</span>
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">KYC Status: VERIFIED</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Completed on December 15, 2023</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Verification Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Identity Verification</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    ✓ VERIFIED
                  </span>
                </div>
                <p className="text-sm text-slate-500">Government-issued ID verified</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Address Verification</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    ✓ VERIFIED
                  </span>
                </div>
                <p className="text-sm text-slate-500">Proof of residence confirmed</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Biometric Verification</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    ✓ VERIFIED
                  </span>
                </div>
                <p className="text-sm text-slate-500">Facial recognition completed</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Source of Funds</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    ✓ VERIFIED
                  </span>
                </div>
                <p className="text-sm text-slate-500">Documentation reviewed and approved</p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Compliance Checks</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>AML (Anti-Money Laundering) screening - PASSED</li>
              <li>PEP (Politically Exposed Person) check - CLEARED</li>
              <li>Sanctions list screening - NO MATCHES</li>
              <li>Credit and background check - COMPLETED</li>
            </ul>
            
            <div className="mt-8 bg-slate-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h3 className="font-bold mb-4">Next Steps</h3>
              <p className="text-sm mb-4">
                Your KYC verification is complete and valid. Annual re-verification may be required to maintain compliance.
              </p>
              <p className="text-sm text-slate-500">
                Verification Valid Until: December 15, 2025
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h1 className="text-2xl font-bold mb-6">{doc.name}</h1>
            <p className="text-sm text-slate-500 mb-6">Document ID: {doc.id}</p>
            <p>Document content would be displayed here.</p>
          </div>
        );
    }
  };
  
  if (!doc) {
    return (
      <PageWrapper hideNav>
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Document Not Found</h2>
            <button 
              onClick={() => navigate('/documents')}
              className="text-[#1132d4] font-bold hover:underline"
            >
              Return to Documents
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold line-clamp-1">{doc.name}</h1>
            <p className="text-xs text-slate-500">{doc.category} • {new Date(doc.date).toLocaleDateString()}</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">share</span>
          </button>
        </header>
        
        {/* Document Viewer */}
        <main className="flex-1 px-5 py-6 overflow-y-auto pb-24">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-8 shadow-sm">
            {getDocumentContent()}
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}