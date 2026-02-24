import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useWallet } from '@/app/contexts/WalletContext';
import { useNotification } from '@/app/contexts/NotificationContext';

interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  popular: boolean;
}

export function ConnectWalletScreen() {
  const navigate = useNavigate();
  const { connectWallet, wallet, isConnecting } = useWallet();
  const { success: showSuccess, error: showError } = useNotification();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  
  const wallets: WalletOption[] = [
    { id: 'metamask', name: 'MetaMask', description: 'Most popular wallet', icon: '🦊', iconBg: 'bg-orange-50 dark:bg-orange-900/20', popular: true },
    { id: 'walletconnect', name: 'WalletConnect', description: 'Scan with mobile wallet', icon: '🔗', iconBg: 'bg-blue-50 dark:bg-blue-900/20', popular: true },
    { id: 'coinbase', name: 'Coinbase Wallet', description: 'Secure & easy to use', icon: '💼', iconBg: 'bg-blue-50 dark:bg-blue-900/20', popular: true },
    { id: 'trust', name: 'Trust Wallet', description: 'Mobile-first wallet', icon: '🛡️', iconBg: 'bg-purple-50 dark:bg-purple-900/20', popular: false },
    { id: 'phantom', name: 'Phantom', description: 'Solana & Ethereum', icon: '👻', iconBg: 'bg-purple-50 dark:bg-purple-900/20', popular: false },
    { id: 'ledger', name: 'Ledger', description: 'Hardware wallet', icon: '🔐', iconBg: 'bg-slate-50 dark:bg-slate-900/20', popular: false },
  ];
  
  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    const walletName = wallets.find(w => w.id === walletId)?.name || walletId;
    
    const result = await connectWallet(walletName);
    
    if (result.success) {
      showSuccess('Wallet Connected!', `${walletName} connected successfully`);
      navigate('/home');
    } else {
      showError('Connection Failed', result.error || 'Please try again');
      setSelectedWallet(null);
    }
  };
  
  if (wallet) {
    return (
      <PageWrapper hideNav>
        <div className="min-h-screen flex flex-col">
          <header className="px-5 py-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center px-5 pb-12">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Wallet Connected</h1>
            <p className="text-slate-500 text-sm mb-6">Your wallet is already connected</p>
            <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-xl mb-8 w-full max-w-xs text-center">
              <p className="text-xs text-slate-500">Address</p>
              <p className="font-mono font-bold">{wallet.shortAddress}</p>
              <p className="text-xs text-slate-400 mt-1">{wallet.provider} · {wallet.network}</p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="w-full max-w-xs bg-[#1132d4] text-white font-bold py-4 rounded-xl"
            >
              Go to Dashboard
            </button>
          </main>
        </div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button onClick={() => navigate('/home')} className="text-sm text-[#1132d4] font-bold">
            Skip for now
          </button>
        </header>
        
        <main className="flex-1 px-5 pb-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1132d4]/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[#1132d4] text-3xl">account_balance_wallet</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
            <p className="text-sm text-slate-500">Choose a wallet to start investing in premium assets</p>
          </div>
          
          {/* Popular Wallets */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular</h3>
            <div className="space-y-3">
              {wallets.filter(w => w.popular).map(w => (
                <button
                  key={w.id}
                  onClick={() => handleConnect(w.id)}
                  disabled={isConnecting}
                  className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4 active:scale-[0.98] transition-all disabled:opacity-50 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${w.iconBg} flex items-center justify-center text-2xl`}>
                    {w.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{w.name}</p>
                    <p className="text-xs text-slate-500">{w.description}</p>
                  </div>
                  {isConnecting && selectedWallet === w.id ? (
                    <div className="w-5 h-5 border-2 border-[#1132d4] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Other Wallets */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Other Wallets</h3>
            <div className="space-y-3">
              {wallets.filter(w => !w.popular).map(w => (
                <button
                  key={w.id}
                  onClick={() => handleConnect(w.id)}
                  disabled={isConnecting}
                  className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4 active:scale-[0.98] transition-all disabled:opacity-50 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${w.iconBg} flex items-center justify-center text-2xl`}>
                    {w.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{w.name}</p>
                    <p className="text-xs text-slate-500">{w.description}</p>
                  </div>
                  {isConnecting && selectedWallet === w.id ? (
                    <div className="w-5 h-5 border-2 border-[#1132d4] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-8 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm">shield</span>
              <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Secure Connection</p>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              We never access your private keys. Wallet connections are read-only until you approve transactions.
              All connections use industry-standard encryption.
            </p>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
