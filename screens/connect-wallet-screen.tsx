import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useWallet } from '@/app/contexts/WalletContext';
import { useNotification } from '@/app/contexts/NotificationContext';

// ─── Types ──────────────────────────────────────────────────────
interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  popular: boolean;
  checkInstalled: () => boolean;
  installUrl: string;
}

// ─── Detect wallet providers ─────────────────────────────────────
function getEthereum(): any {
  return typeof window !== 'undefined' ? (window as any).ethereum : null;
}

function isMetaMaskInstalled(): boolean {
  const eth = getEthereum();
  return !!(eth && eth.isMetaMask);
}

function isCoinbaseInstalled(): boolean {
  const eth = getEthereum();
  return !!(eth && (eth.isCoinbaseWallet || eth.providers?.some((p: any) => p.isCoinbaseWallet)));
}

function isTrustInstalled(): boolean {
  const eth = getEthereum();
  return !!(eth && eth.isTrust);
}

// ─── Get specific provider from multi-provider setup ─────────────
function getProvider(walletId: string): any {
  const eth = getEthereum();
  if (!eth) return null;

  // If multiple providers (e.g., MetaMask + Coinbase)
  if (eth.providers?.length) {
    switch (walletId) {
      case 'metamask':
        return eth.providers.find((p: any) => p.isMetaMask);
      case 'coinbase':
        return eth.providers.find((p: any) => p.isCoinbaseWallet);
      default:
        return eth.providers[0];
    }
  }
  return eth;
}

export function ConnectWalletScreen() {
  const navigate = useNavigate();
  const { connectWallet, wallet, disconnectWallet } = useWallet();
  const { success: showSuccess, error: showError, info: showInfo } = useNotification();

  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const wallets: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: isMetaMaskInstalled() ? 'Ready to connect' : 'Not installed',
      icon: '🦊',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      popular: true,
      checkInstalled: isMetaMaskInstalled,
      installUrl: 'https://metamask.io/download/',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: isCoinbaseInstalled() ? 'Ready to connect' : 'Not installed',
      icon: '💼',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      popular: true,
      checkInstalled: isCoinbaseInstalled,
      installUrl: 'https://www.coinbase.com/wallet/downloads',
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      description: isTrustInstalled() ? 'Ready to connect' : 'Not installed',
      icon: '🛡️',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      popular: false,
      checkInstalled: isTrustInstalled,
      installUrl: 'https://trustwallet.com/download',
    },
  ];

  // Listen for account/chain changes
  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnectedAddress(null);
        disconnectWallet();
      } else {
        setConnectedAddress(accounts[0]);
      }
    };

    const handleChainChanged = (cId: string) => {
      setChainId(cId);
    };

    eth.on('accountsChanged', handleAccountsChanged);
    eth.on('chainChanged', handleChainChanged);

    return () => {
      eth.removeListener('accountsChanged', handleAccountsChanged);
      eth.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnectWallet]);

  // Format address for display
  const shortAddr = (addr: string) =>
    addr ? addr.substring(0, 6) + '...' + addr.substring(addr.length - 4) : '';

  // Get network name from chain ID
  const getNetworkName = (cId: string | null): string => {
    if (!cId) return 'Unknown';
    const id = parseInt(cId, 16);
    switch (id) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon';
      case 56: return 'BNB Chain';
      case 42161: return 'Arbitrum One';
      case 10: return 'Optimism';
      case 8453: return 'Base';
      case 43114: return 'Avalanche';
      default: return 'Chain ' + id;
    }
  };

  const handleConnect = useCallback(async (walletId: string) => {
    const walletInfo = wallets.find(w => w.id === walletId);
    if (!walletInfo) return;

    // Check if wallet extension is installed
    if (!walletInfo.checkInstalled()) {
      showInfo(
        walletInfo.name + ' Not Found',
        'Please install ' + walletInfo.name + ' browser extension first.'
      );
      window.open(walletInfo.installUrl, '_blank');
      return;
    }

    setIsConnecting(true);
    setSelectedWallet(walletId);

    try {
      const provider = getProvider(walletId);
      if (!provider) {
        throw new Error('Wallet provider not found');
      }

      // Request account access (this triggers the MetaMask popup)
      const accounts: string[] = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned. Please unlock your wallet.');
      }

      const address = accounts[0];
      const cId = await provider.request({ method: 'eth_chainId' });
      setChainId(cId);
      setConnectedAddress(address);

      // Save to backend
      const result = await connectWallet(walletInfo.name, address, 'Ethereum');

      if (result) {
        showSuccess('Wallet Connected!', walletInfo.name + ' (' + shortAddr(address) + ') connected successfully');
        // Small delay so user sees the success state
        setTimeout(() => navigate('/home'), 1500);
      } else {
        throw new Error('Failed to save wallet connection');
      }
    } catch (err: any) {
      console.error('Wallet connect error:', err);
      if (err.code === 4001) {
        showError('Connection Rejected', 'You rejected the connection request.');
      } else if (err.code === -32002) {
        showInfo('Pending Request', 'Please check your wallet — a connection request is already pending.');
      } else {
        showError('Connection Failed', err.message || 'Failed to connect wallet');
      }
      setSelectedWallet(null);
    } finally {
      setIsConnecting(false);
    }
  }, [connectWallet, navigate, showSuccess, showError, showInfo, wallets]);

  // ─── Already connected state ─────────────────────────────────
  if (wallet) {
    return (
      <PageWrapper hideNav>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0b14]">
          <header className="px-5 py-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center px-5 pb-12">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Wallet Connected</h1>
            <p className="text-slate-500 text-sm mb-6">Your Web3 wallet is linked to your account</p>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">account_balance_wallet</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{wallet.provider}</p>
                  <p className="text-xs text-slate-500">{wallet.network}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="font-mono text-sm font-bold break-all">{wallet.address}</p>
              </div>
              {chainId && (
                <p className="text-xs text-slate-400 mt-2 text-center">{getNetworkName(chainId)}</p>
              )}
            </div>

            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={async () => {
                  await disconnectWallet();
                  setConnectedAddress(null);
                  setChainId(null);
                  showSuccess('Disconnected', 'Wallet disconnected from your account');
                }}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-bold py-3 rounded-xl text-sm"
              >
                Disconnect
              </button>
              <button
                onClick={() => navigate('/home')}
                className="flex-1 bg-[#1132d4] text-white font-bold py-3 rounded-xl text-sm"
              >
                Go to Dashboard
              </button>
            </div>
          </main>
        </div>
      </PageWrapper>
    );
  }

  // ─── No Web3 wallet detected ──────────────────────────────────
  const hasAnyWallet = getEthereum() !== null;

  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0b14]">
        <header className="px-5 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button onClick={() => navigate('/home')} className="text-sm text-[#1132d4] font-bold">
            Skip for now
          </button>
        </header>

        <main className="flex-1 px-5 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1132d4]/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[#1132d4] text-3xl">account_balance_wallet</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Link your Web3 wallet to deposit USDT/USDC and invest in premium RWA assets
            </p>
          </div>

          {!hasAnyWallet && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-amber-600 text-sm">warning</span>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">No Web3 Wallet Detected</p>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-500 leading-relaxed">
                Install a browser wallet extension like MetaMask to connect. Mobile users can use the MetaMask mobile browser.
              </p>
            </div>
          )}

          {/* Wallet Options */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Wallet</h3>
            <div className="space-y-3">
              {wallets.map(w => {
                const installed = w.checkInstalled();
                return (
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
                      <p className={`text-xs ${installed ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {installed ? '✓ Detected — tap to connect' : 'Not installed — tap to install'}
                      </p>
                    </div>
                    {isConnecting && selectedWallet === w.id ? (
                      <div className="w-5 h-5 border-2 border-[#1132d4] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">
                        {installed ? 'link' : 'open_in_new'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Why connect */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6">
            <h3 className="font-bold text-sm mb-3">Why connect a wallet?</h3>
            <div className="space-y-3">
              {[
                { icon: 'payments', label: 'Deposit USDT/USDC directly from your wallet' },
                { icon: 'swap_horiz', label: 'Fast on-chain transfers with low fees' },
                { icon: 'verified_user', label: 'Secure — we never access your private keys' },
                { icon: 'monitoring', label: 'Real-time balance & transaction tracking' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1132d4] text-sm">{item.icon}</span>
                  <p className="text-xs text-slate-600 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm">shield</span>
              <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Secure Connection</p>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              We only request read access to your wallet address. Private keys never leave your device. 
              All transactions require your explicit approval in your wallet.
            </p>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
