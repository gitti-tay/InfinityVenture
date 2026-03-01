import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { PROJECTS, type Project } from '@/app/data/projects';

// ─── Constants ───
const API_BASE = window.location.origin + '/api';

const TOKEN_LABELS: Record<string, string> = {
  INCOME_NOTE: 'Income Note',
  REVENUE_SHARE: 'Revenue Share',
  HYBRID: 'Hybrid',
};

const RISK_COLORS: Record<string, string> = {
  Low: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
  Medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30',
  High: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
};

// ─── Helpers (each ≤ 30 lines) ───

function getTokenLabel(tokenType?: string): string {
  if (!tokenType) return 'Token';
  return TOKEN_LABELS[tokenType] ?? tokenType;
}

function getRiskColorClass(risk: string): string {
  const key = risk.replace(' Risk', '');
  return RISK_COLORS[key] ?? 'text-gray-600 bg-gray-50';
}

function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseRaised(raised: string): number {
  const num = parseFloat(raised.replace(/[^0-9.]/g, ''));
  if (raised.includes('M')) return num * 1_000_000;
  if (raised.includes('K')) return num * 1_000;
  return num;
}

function parseTarget(target: string): number {
  const num = parseFloat(target.replace(/[^0-9.]/g, ''));
  if (target.includes('M')) return num * 1_000_000;
  if (target.includes('K')) return num * 1_000;
  return num;
}

// ─── Sub-components (each ≤ 30 lines) ───

function LoadingSpinner() {
  return (
    <PageWrapper>
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </PageWrapper>
  );
}

function PortfolioHeader({ onHistory, onReports }: {
  onHistory: () => void;
  onReports: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Portfolio</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time performance tracking
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onHistory} className="p-2 text-gray-500 dark:text-gray-400">
          <span className="material-icons">receipt_long</span>
        </button>
        <button onClick={onReports} className="p-2 text-gray-500 dark:text-gray-400">
          <span className="material-icons">analytics</span>
        </button>
      </div>
    </div>
  );
}

function SummaryChips({ totalEarned, activeCount }: {
  totalEarned: number;
  activeCount: number;
}) {
  const dailyChange = totalEarned > 0
    ? (totalEarned * 0.003).toFixed(2)
    : '0.00';

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full whitespace-nowrap">
        <span className="material-icons text-green-600 dark:text-green-400 text-sm">trending_up</span>
        <span className="text-sm font-semibold text-green-700 dark:text-green-300">
          24H +${dailyChange}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full whitespace-nowrap">
        <span className="material-icons text-blue-600 dark:text-blue-400 text-sm">payments</span>
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
          YIELD ${formatCurrency(totalEarned)}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full whitespace-nowrap">
        <span className="material-icons text-purple-600 dark:text-purple-400 text-sm">inventory_2</span>
        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
          {activeCount} Active
        </span>
      </div>
    </div>
  );
}

function PortfolioValueCard({ portfolioValue, totalInvested, totalEarned, growthPercent, onDeposit, onWithdraw }: {
  portfolioValue: number;
  totalInvested: number;
  totalEarned: number;
  growthPercent: string;
  onDeposit: () => void;
  onWithdraw: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
      <p className="text-xs font-medium tracking-wider opacity-80 flex items-center gap-1">
        <span className="material-icons text-sm">account_balance_wallet</span>
        Total Portfolio Value
      </p>
      <h2 className="text-4xl font-bold mt-1">${formatCurrency(portfolioValue)}</h2>

      {parseFloat(growthPercent) > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <span className="px-2 py-0.5 bg-green-500/20 rounded-full text-xs font-semibold flex items-center gap-0.5">
            <span className="material-icons text-xs">trending_up</span>
            +${formatCurrency(totalEarned)}
          </span>
          <span className="text-green-300 text-xs font-semibold">+{growthPercent}%</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-[10px] tracking-wider opacity-70">INVESTED</p>
          <p className="text-lg font-bold">${totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-[10px] tracking-wider opacity-70">YIELD</p>
          <p className="text-lg font-bold">+${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-[10px] tracking-wider opacity-70">UNREALIZED</p>
          <p className="text-lg font-bold">+${(totalEarned * 0.2).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={onDeposit} className="py-3 bg-white text-blue-700 rounded-xl font-semibold text-sm">
          Deposit Funds
        </button>
        <button onClick={onWithdraw} className="py-3 bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/20">
          Withdraw
        </button>
      </div>
    </div>
  );
}

function ActiveInvestmentsList({ investments, onSelect }: {
  investments: any[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {investments.map((inv: any) => (
        <button
          key={inv.id}
          onClick={() => onSelect(inv.id)}
          className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-left"
        >
          {inv.projectImg ? (
            <img src={inv.projectImg} alt="" className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              {inv.projectName?.substring(0, 3) || '???'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate dark:text-white">
              {inv.projectName || 'Investment'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {inv.planName} · {inv.term}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm dark:text-white">${inv.amount?.toLocaleString()}</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">+{inv.apy}% APY</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function EmptyPortfolio({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
      <span className="material-icons text-5xl text-gray-300 dark:text-gray-600 mb-3">pie_chart</span>
      <p className="text-gray-500 dark:text-gray-400 font-medium">No active investments</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
        Start investing to build your portfolio
      </p>
      <button
        onClick={onExplore}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
      >
        Explore Opportunities
      </button>
    </div>
  );
}

function MarketProjectCard({ project, onSelect }: {
  project: Project;
  onSelect: (id: string) => void;
}) {
  const raised = parseRaised(project.raised);
  const target = parseTarget(project.target);
  const pct = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  return (
    <button
      onClick={() => onSelect(project.id)}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="relative h-28">
        <img
          src={project.img}
          alt={project.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur text-white text-[10px] font-bold rounded-full">
            {project.symbol}
          </span>
          {project.tokenType && (
            <span className="px-2 py-0.5 bg-blue-600/80 backdrop-blur text-white text-[10px] font-bold rounded-full">
              {getTokenLabel(project.tokenType)}
            </span>
          )}
        </div>
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${getRiskColorClass(project.risk)}`}>
          {project.risk}
        </span>
      </div>

      <div className="p-4">
        <p className="font-semibold text-sm dark:text-white truncate">{project.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {project.category} · {project.region}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-green-600 dark:text-green-400 font-bold text-sm">
            {project.apy} APY
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {project.term}
          </span>
        </div>

        {/* Funding Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
            <span>${project.raised} raised</span>
            <span>${project.target} target</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span className="text-gray-500 dark:text-gray-400">
              {project.investors} investors
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {pct.toFixed(0)}% funded
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main Component ───

export function PortfolioScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchInvestments = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(API_BASE + '/investments', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error('Failed to fetch investments');
      const data = await res.json();
      setInvestments(data.investments || []);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const activeInvestments = investments.filter(
    (i) => i.status === 'active',
  );
  const totalInvested = investments.reduce(
    (s, i) => s + (i.amount || 0),
    0,
  );
  const totalEarned = investments.reduce(
    (s, i) => s + (i.totalEarned || 0),
    0,
  );
  const portfolioValue = totalInvested + totalEarned;
  const growthPercent =
    totalInvested > 0
      ? ((totalEarned / totalInvested) * 100).toFixed(2)
      : '0.00';

  if (loading) return <LoadingSpinner />;

  return (
    <PageWrapper>
      <div className="space-y-6 pb-24">
        <PortfolioHeader
          onHistory={() => navigate('/transaction-history')}
          onReports={() => navigate('/reports')}
        />

        {investments.length > 0 && (
          <SummaryChips
            totalEarned={totalEarned}
            activeCount={activeInvestments.length}
          />
        )}

        <PortfolioValueCard
          portfolioValue={portfolioValue}
          totalInvested={totalInvested}
          totalEarned={totalEarned}
          growthPercent={growthPercent}
          onDeposit={() => navigate('/deposit')}
          onWithdraw={() => navigate('/withdraw')}
        />

        {/* Active Investments */}
        <div>
          <h3 className="text-lg font-bold mb-3 dark:text-white">Active Investments</h3>
          {activeInvestments.length > 0 ? (
            <ActiveInvestmentsList
              investments={activeInvestments}
              onSelect={(id) => navigate('/my-investment/' + id)}
            />
          ) : (
            <EmptyPortfolio onExplore={() => navigate('/invest')} />
          )}
        </div>

        {/* Market Overview — Always visible */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold dark:text-white">Market Overview</h3>
            <button
              onClick={() => navigate('/invest')}
              className="text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              View All
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Explore RWA investment opportunities across 5 strategic sectors
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PROJECTS.map((project) => (
              <MarketProjectCard
                key={project.id}
                project={project}
                onSelect={(id) => navigate('/project/' + id)}
              />
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {fetchError && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-center">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Could not load investments. Pull to refresh or try again later.
            </p>
            <button
              onClick={() => { setFetchError(false); setLoading(true); fetchInvestments(); }}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
