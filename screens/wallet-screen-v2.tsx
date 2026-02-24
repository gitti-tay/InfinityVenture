import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '../components/page-wrapper';

interface CryptoAsset {
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  change24h: number;
  price: number;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'swap' | 'dividend';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending';
  description: string;
}

interface Holding {
  id: string;
  name: string;
  value: number;
  shares: number;
  change: number;
}

export function WalletScreen() {
  const navigate = useNavigate();
  
  // ALL hooks must be declared here at the top - no conditional hooks!
  const [activeTab, setActiveTab] = useState<'crypto' | 'holdings' | 'activity'>('crypto');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [swapFromAsset, setSwapFromAsset] = useState('USDT');
  const [swapToAsset, setSwapToAsset] = useState('BTC');
  const [swapAmount, setSwapAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Static data
  const cryptoAssets: CryptoAsset[] = [
    { symbol: 'USDT', name: 'Tether', amount: 15420.30, usdValue: 15420.30, change24h: 0.02, price: 1.00 },
    { symbol: 'USDC', name: 'USD Coin', amount: 6890.40, usdValue: 6890.40, change24h: -0.01, price: 1.00 },
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.0421, usdValue: 1875.80, change24h: 2.45, price: 44551.00 },
    { symbol: 'ETH', name: 'Ethereum', amount: 0.178, usdValue: 404.00, change24h: 1.82, price: 2269.66 },
    { symbol: 'BNB', name: 'BNB', amount: 0.523, usdValue: 189.32, change24h: 1.25, price: 362.00 },
    { symbol: 'SOL', name: 'Solana', amount: 1.42, usdValue: 156.84, change24h: 3.42, price: 110.45 },
  ];
  
  const holdings: Holding[] = [
    { id: 'scn', name: 'SCN', value: 18420, shares: 150, change: 2.4 },
    { id: 'ptf', name: 'PTF', value: 14280, shares: 120, change: 1.8 },
    { id: 'mdd', name: 'MDD', value: 9890, shares: 80, change: 3.2 }
  ];
  
  const allTransactions: Transaction[] = [
    { id: 1, type: 'deposit', amount: 5000, currency: 'USDT', date: '2026-02-04T14:30:00', status: 'completed', description: 'Bank Transfer' },
    { id: 2, type: 'withdraw', amount: 2500, currency: 'USDC', date: '2026-02-03T10:15:00', status: 'completed', description: 'To Bank Account' },
    { id: 3, type: 'dividend', amount: 125.50, currency: 'USDT', date: '2026-02-01T09:00:00', status: 'completed', description: 'SCN Monthly Dividend' },
    { id: 4, type: 'buy', amount: 0.011, currency: 'BTC', date: '2026-01-30T11:20:00', status: 'completed', description: 'Purchased Bitcoin' },
    { id: 5, type: 'withdraw', amount: 1500, currency: 'USDT', date: '2026-02-05T16:45:00', status: 'pending', description: 'To Bank Account' },
    { id: 6, type: 'dividend', amount: 89.20, currency: 'USDT', date: '2026-01-28T13:15:00', status: 'completed', description: 'PTF Quarterly Dividend' },
  ];
  
  const totalBalance = cryptoAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
  
  const filteredTransactions = allTransactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    return true;
  });
  
  // Event handlers
  const openBuyModal = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    setShowBuyModal(true);
    setBuyAmount('');
  };
  
  const openSellModal = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    setShowSellModal(true);
    setSellAmount('');
  };
  
  const openSwapModal = (fromAsset?: CryptoAsset) => {
    if (fromAsset) {
      setSwapFromAsset(fromAsset.symbol);
    }
    setShowSwapModal(true);
    setSwapAmount('');
  };
  
  const handleBuyConfirm = () => {
    alert(`Purchased $${buyAmount} of ${selectedAsset?.symbol}`);
    setShowBuyModal(false);
  };
  
  const handleSellConfirm = () => {
    alert(`Sold $${sellAmount} of ${selectedAsset?.symbol}`);
    setShowSellModal(false);
  };
  
  const handleSwapConfirm = () => {
    alert(`Swapped ${swapAmount} ${swapFromAsset} for ${swapToAsset}`);
    setShowSwapModal(false);
  };
  
  const getSwapRate = () => {
    const fromAsset = cryptoAssets.find(a => a.symbol === swapFromAsset);
    const toAsset = cryptoAssets.find(a => a.symbol === swapToAsset);
    if (!fromAsset || !toAsset || !swapAmount) return 0;
    return (parseFloat(swapAmount) * fromAsset.price) / toAsset.price;
  };
  
  const getTransactionIcon = (type: string) => {
    if (type === 'deposit') return 'arrow_downward';
    if (type === 'withdraw') return 'arrow_upward';
    if (type === 'buy') return 'shopping_cart';
    if (type === 'sell') return 'sell';
    if (type === 'swap') return 'swap_horiz';
    if (type === 'dividend') return 'payments';
    return 'receipt';
  };
  
  const getTransactionColor = (type: string) => {
    if (type === 'deposit' || type === 'dividend') return 'emerald';
    if (type === 'withdraw' || type === 'sell') return 'red';
    if (type === 'buy') return 'blue';
    if (type === 'swap') return 'violet';
    return 'gray';
  };
  
  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="px-5 pt-4 pb-3 bg-white/80 dark:bg-[#101322]/80 sticky top-0 z-10 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1132d4] to-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">account_balance_wallet</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Wallet</h1>
                <p className="text-xs text-slate-500">Manage your digital assets</p>
              </div>
            </div>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Bank-Level Security</span>
          </div>
        </header>
        
        <main className="px-5 py-4 space-y-4 pb-24">
          {/* Balance Card */}
          <div className="relative bg-gradient-to-br from-[#1132d4] via-blue-600 to-violet-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative">
              <p className="text-white/70 text-sm mb-1">Total Balance</p>
              <h2 className="text-5xl font-bold mb-2">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span className="text-sm font-bold">+2.3%</span>
                </div>
                <span className="text-white/70 text-xs">Last 24h</span>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => navigate('/deposit')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl mb-1">add_circle</span>
                  <p className="text-xs font-bold">Deposit</p>
                </button>
                
                <button 
                  onClick={() => navigate('/withdraw')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl mb-1">arrow_circle_up</span>
                  <p className="text-xs font-bold">Withdraw</p>
                </button>
                
                <button 
                  onClick={() => openSwapModal()}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl mb-1">swap_horiz</span>
                  <p className="text-xs font-bold">Swap</p>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'crypto'
                  ? 'bg-[#1132d4] text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">currency_bitcoin</span>
              <span className="hidden sm:inline">Crypto</span>
            </button>
            
            <button
              onClick={() => setActiveTab('holdings')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'holdings'
                  ? 'bg-[#1132d4] text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">inventory_2</span>
              <span className="hidden sm:inline">Holdings</span>
            </button>
            
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'activity'
                  ? 'bg-[#1132d4] text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">history</span>
              <span className="hidden sm:inline">Activity</span>
            </button>
          </div>
          
          {/* Tab Content - Crypto Assets */}
          {activeTab === 'crypto' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Crypto Assets</h3>
                <span className="text-sm text-slate-500">{cryptoAssets.length} assets</span>
              </div>
              
              {cryptoAssets.map((asset) => (
                <div 
                  key={asset.symbol}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {asset.symbol.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{asset.symbol}</h4>
                        <span className="text-xs text-slate-500">{asset.name}</span>
                      </div>
                      <p className="text-xs text-slate-500">{asset.amount.toFixed(4)} {asset.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${asset.usdValue.toLocaleString()}</p>
                      <div className={`flex items-center gap-1 text-xs font-bold ${
                        asset.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <span className="material-symbols-outlined text-xs">
                          {asset.change24h >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openBuyModal(asset)}
                      className="flex-1 bg-[#1132d4] text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Buy
                    </button>
                    <button 
                      onClick={() => openSellModal(asset)}
                      className="flex-1 bg-slate-100 dark:bg-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Sell
                    </button>
                    <button 
                      onClick={() => openSwapModal(asset)}
                      className="px-4 bg-slate-100 dark:bg-gray-700 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">swap_horiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Tab Content - Holdings */}
          {activeTab === 'holdings' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Investment Holdings</h3>
                <span className="text-sm text-slate-500">{holdings.length} assets</span>
              </div>
              
              {holdings.map((holding) => (
                <div 
                  key={holding.id}
                  onClick={() => navigate(`/my-investment/${holding.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1132d4] to-blue-600 flex items-center justify-center text-white">
                      <span className="font-bold text-lg">{holding.name}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{holding.name}</h4>
                      <p className="text-xs text-slate-500">{holding.shares} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${holding.value.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        +{holding.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#1132d4] text-2xl">lightbulb</span>
                  <h4 className="font-bold">Explore More Opportunities</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                  Discover new real-world assets and grow your portfolio with verified projects.
                </p>
                <button 
                  onClick={() => navigate('/home')}
                  className="w-full bg-[#1132d4] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Browse Opportunities
                </button>
              </div>
            </div>
          )}
          
          {/* Tab Content - Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Recent Activity</h3>
                <button 
                  onClick={() => navigate('/transaction-history')}
                  className="text-sm font-bold text-[#1132d4]"
                >
                  View All
                </button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                    filterType === 'all' ? 'bg-[#1132d4] text-white' : 'bg-slate-100 dark:bg-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('deposit')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                    filterType === 'deposit' ? 'bg-[#1132d4] text-white' : 'bg-slate-100 dark:bg-gray-700'
                  }`}
                >
                  Deposits
                </button>
                <button
                  onClick={() => setFilterType('withdraw')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                    filterType === 'withdraw' ? 'bg-[#1132d4] text-white' : 'bg-slate-100 dark:bg-gray-700'
                  }`}
                >
                  Withdrawals
                </button>
                <button
                  onClick={() => setFilterType('dividend')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                    filterType === 'dividend' ? 'bg-[#1132d4] text-white' : 'bg-slate-100 dark:bg-gray-700'
                  }`}
                >
                  Dividends
                </button>
              </div>
              
              {filteredTransactions.map((tx) => {
                const txColor = getTransactionColor(tx.type);
                const txIcon = getTransactionIcon(tx.type);
                
                return (
                  <div 
                    key={tx.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-${txColor}-100 dark:bg-${txColor}-900/30 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-${txColor}-600`}>
                          {txIcon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm capitalize">{tx.type}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === 'completed' 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{tx.description}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(tx.date).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          tx.type === 'deposit' || tx.type === 'dividend' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'dividend' ? '+' : ''}{tx.amount} {tx.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      
      {/* Buy Modal */}
      {showBuyModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Buy {selectedAsset.symbol}</h2>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-900 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedAsset.symbol.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{selectedAsset.name}</h3>
                  <p className="text-sm text-slate-500">${selectedAsset.price.toLocaleString()} per {selectedAsset.symbol}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-gray-900 rounded-xl border-2 border-slate-200 dark:border-gray-700 focus:border-[#1132d4] outline-none text-lg font-bold"
                  />
                </div>
                {buyAmount && (
                  <p className="text-sm text-slate-500 mt-2">
                    ≈ {(parseFloat(buyAmount) / selectedAsset.price).toFixed(6)} {selectedAsset.symbol}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {['50', '100', '250', '500'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBuyAmount(amount)}
                    className="py-3 bg-slate-100 dark:bg-gray-700 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-gray-600"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Payment Method</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#1132d4] bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${
                      paymentMethod === 'card' ? 'bg-[#1132d4]' : 'bg-slate-100 dark:bg-gray-700'
                    } flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${
                        paymentMethod === 'card' ? 'text-white' : 'text-slate-600 dark:text-gray-400'
                      }`}>credit_card</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm">Credit/Debit Card</p>
                      <p className="text-xs text-slate-500">Instant • 2% fee</p>
                    </div>
                    {paymentMethod === 'card' && (
                      <span className="material-symbols-outlined text-[#1132d4]">check_circle</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#1132d4] bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${
                      paymentMethod === 'bank' ? 'bg-[#1132d4]' : 'bg-slate-100 dark:bg-gray-700'
                    } flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${
                        paymentMethod === 'bank' ? 'text-white' : 'text-slate-600 dark:text-gray-400'
                      }`}>account_balance</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm">Bank Transfer</p>
                      <p className="text-xs text-slate-500">1-2 days • 0% fee</p>
                    </div>
                    {paymentMethod === 'bank' && (
                      <span className="material-symbols-outlined text-[#1132d4]">check_circle</span>
                    )}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleBuyConfirm}
                disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Sell Modal */}
      {showSellModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Sell {selectedAsset.symbol}</h2>
              <button 
                onClick={() => setShowSellModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-900 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedAsset.symbol.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{selectedAsset.name}</h3>
                  <p className="text-sm text-slate-500">Available: {selectedAsset.amount} {selectedAsset.symbol}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold">Amount ({selectedAsset.symbol})</label>
                  <button 
                    onClick={() => setSellAmount(selectedAsset.amount.toString())}
                    className="text-xs font-bold text-[#1132d4]"
                  >
                    Max
                  </button>
                </div>
                <input 
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="0.00"
                  max={selectedAsset.amount}
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-gray-900 rounded-xl border-2 border-slate-200 dark:border-gray-700 focus:border-[#1132d4] outline-none text-lg font-bold"
                />
                {sellAmount && (
                  <p className="text-sm text-slate-500 mt-2">
                    ≈ ${(parseFloat(sellAmount) * selectedAsset.price).toFixed(2)}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => setSellAmount((selectedAsset.amount * parseFloat(percent) / 100).toString())}
                    className="py-3 bg-slate-100 dark:bg-gray-700 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-gray-600"
                  >
                    {percent}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleSellConfirm}
                disabled={!sellAmount || parseFloat(sellAmount) <= 0}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-red-500/30 disabled:opacity-50"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Swap Crypto</h2>
              <button 
                onClick={() => setShowSwapModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">From</label>
                <div className="bg-slate-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <select 
                      value={swapFromAsset}
                      onChange={(e) => setSwapFromAsset(e.target.value)}
                      className="bg-transparent font-bold text-lg outline-none"
                    >
                      {cryptoAssets.map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>{asset.symbol}</option>
                      ))}
                    </select>
                    <input 
                      type="number"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-right text-lg font-bold outline-none w-32"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Available: {cryptoAssets.find(a => a.symbol === swapFromAsset)?.amount} {swapFromAsset}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    const temp = swapFromAsset;
                    setSwapFromAsset(swapToAsset);
                    setSwapToAsset(temp);
                  }}
                  className="p-3 bg-[#1132d4] rounded-full text-white hover:bg-blue-700"
                >
                  <span className="material-symbols-outlined">swap_vert</span>
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">To</label>
                <div className="bg-slate-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <select 
                      value={swapToAsset}
                      onChange={(e) => setSwapToAsset(e.target.value)}
                      className="bg-transparent font-bold text-lg outline-none"
                    >
                      {cryptoAssets.filter(a => a.symbol !== swapFromAsset).map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>{asset.symbol}</option>
                      ))}
                    </select>
                    <div className="text-right text-lg font-bold">
                      {swapAmount ? getSwapRate().toFixed(6) : '0.00'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Balance: {cryptoAssets.find(a => a.symbol === swapToAsset)?.amount} {swapToAsset}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSwapConfirm}
                disabled={!swapAmount || parseFloat(swapAmount) <= 0}
                className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                Swap Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
