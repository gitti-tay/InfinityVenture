import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { PROJECTS } from '@/app/data/projects';

export function ProjectDetailsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === id);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/wallet/balance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.available ?? data.balance ?? 0);
        }
      } catch (e) {
        console.error('Failed to fetch balance:', e);
      }
    };
    fetchBalance();
  }, []);

  if (!project) {
    return (
      <PageWrapper hideNav>
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
          <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
          <p className="text-slate-500 text-center mb-6">The project you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/home')} className="px-6 py-3 bg-[#1132d4] text-white rounded-xl font-bold">
            Back to Home
          </button>
        </div>
      </PageWrapper>
    );
  }

  const balanceDisplay = balance !== null ? `${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '...';
  const perfData = project.performanceData || [8.2, 10.5, 12.1, 13.8, 12.4, parseFloat(project.apy)];
  const perfLabels = project.performanceLabels || ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
  const maxPerf = Math.max(...perfData.filter(v => v > 0));
  const docs = project.documents || [
    { name: 'Investment Memo', size: '3.0 MB' },
    { name: 'Legal Due Diligence', size: '2.5 MB' },
    { name: 'Financial Statements', size: '4.0 MB' },
    { name: 'Risk Disclosure', size: '1.5 MB' }
  ];

  return (
    <PageWrapper hideNav className="bg-white dark:bg-[#101322]">
      {/* Mobile-only header */}
      <div className="fixed top-0 z-50 w-full max-w-md lg:hidden bg-white/80 dark:bg-[#101322]/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-bold text-sm uppercase tracking-wider text-slate-500">Project Details</span>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">ios_share</span>
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-bold text-sm uppercase tracking-wider text-slate-500">Project Details</span>
        <div className="flex-1" />
        <span className="text-xs text-slate-400 font-mono">{project.assetId}</span>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">ios_share</span>
        </button>
      </div>

      <main className="pt-14 lg:pt-0 space-y-6 pb-32 lg:pb-8 overflow-y-auto">
        <div className="relative h-64 lg:h-80 overflow-hidden lg:rounded-2xl lg:mx-5 lg:mt-4">
          <img className="w-full h-full object-cover" src={project.img} alt={project.name} />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="bg-[#1132d4]/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm uppercase">
              {project.category}
            </span>
            <span className={`${
              project.risk === 'Low Risk' ? 'bg-emerald-500/90' :
              project.risk === 'Medium Risk' ? 'bg-amber-500/90' :
              'bg-red-500/90'
            } text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm uppercase`}>
              {project.risk}
            </span>
            {project.badge && (
              <span className="bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                {project.badge}
              </span>
            )}
          </div>
        </div>

        <div className="px-5">
          <h1 className="text-2xl font-extrabold mb-1">{project.name}</h1>
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">place</span>
              {project.region}
            </span>
            {project.series && (
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{project.series}</span>
            )}
          </div>
        </div>

        <div className="px-5 grid grid-cols-4 gap-2">
          {[
            {l:'APY', v: project.apy},
            {l:'Term', v: project.term},
            {l:'Min', v: project.min},
            {l:'Payout', v: project.payout || 'Monthly'}
          ].map((i, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-gray-800 p-3 rounded-xl text-center border border-slate-100 dark:border-gray-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{i.l}</p>
              <p className={`font-bold text-sm ${i.l === 'APY' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                {i.v}
              </p>
            </div>
          ))}
        </div>

        <div className="px-5">
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Funding Progress</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="text-2xl font-bold mb-3">
              ${project.raised} <span className="text-sm font-medium text-slate-400">/ ${project.target}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-gray-700 h-2 rounded-full mb-2">
              <div className="bg-[#1132d4] h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{project.investors} Investors</span>
              <span>{project.progress}% Funded</span>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-4">
          <h3 className="font-bold text-lg">Investment Overview</h3>
          <div className="bg-slate-50 dark:bg-gray-800 rounded-xl p-4 space-y-3 text-sm leading-relaxed">
            <p className="text-slate-700 dark:text-gray-300">
              {project.overview || `This investment opportunity offers exposure to ${project.category.toLowerCase()} with strong fundamentals and proven track record. Expected returns of ${project.apy} annually, with ${project.term.toLowerCase()} investment period and monthly distribution payouts.`}
            </p>
          </div>
        </div>

        {project.highlights && project.highlights.length > 0 && (
          <div className="px-5 space-y-3">
            <h3 className="font-bold text-lg">Key Highlights</h3>
            <div className="space-y-2">
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                  <span className="material-symbols-outlined text-emerald-600 text-lg mt-0.5">check_circle</span>
                  <p className="text-sm text-slate-700 dark:text-gray-300 flex-1">{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.riskDetails && (
          <div className="px-5 space-y-3">
            <h3 className="font-bold text-lg">Risk Assessment</h3>
            <div className={`rounded-xl p-4 border text-sm leading-relaxed ${
              project.risk === 'Low Risk' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' :
              project.risk === 'Medium Risk' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800' :
              'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
            }`}>
              <p className="text-slate-700 dark:text-gray-300">{project.riskDetails}</p>
            </div>
          </div>
        )}

        <div className="px-5 space-y-4">
          <h3 className="font-bold text-lg">Historical Performance</h3>
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Avg Annual Return</p>
                <p className="text-2xl font-bold text-emerald-600">{project.apy}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase mb-1">Consistency</p>
                <p className="text-2xl font-bold">{project.consistency || 'High'}</p>
              </div>
            </div>
            <div className="h-32 flex items-end justify-between gap-2">
              {perfData.map((val, i) => {
                const height = maxPerf > 0 ? (val / maxPerf) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-xl">
                          {val > 0 ? `${val}%` : 'N/A'}
                        </div>
                      </div>
                      <div
                        className={`w-full rounded-t transition-all duration-300 hover:scale-105 ${val > 0 ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-slate-200 dark:bg-gray-700'}`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold">{perfLabels[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-5 space-y-3">
          <h3 className="font-bold text-lg">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase mb-1">Min Investment</p>
              <p className="text-xl font-bold text-[#1132d4]">{project.min}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase mb-1">Risk Level</p>
              <p className="text-xl font-bold">{project.risk}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase mb-1">Target Raise</p>
              <p className="text-xl font-bold">${project.target}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase mb-1">Category</p>
              <p className="text-sm font-bold">{project.category}</p>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Documents</h3>
            <button
              onClick={() => navigate(`/project/${project.id}/documents`)}
              className="text-sm font-bold text-[#1132d4] hover:underline flex items-center gap-1"
            >
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-2">
            {docs.map((doc, i) => (
              <div
                key={i}
                onClick={() => navigate(`/project/${project.id}/documents`)}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[#1132d4]">description</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{doc.name}</p>
                  <p className="text-xs text-slate-400">PDF {doc.size}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">download</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full max-w-md lg:hidden bg-white dark:bg-[#101322] border-t border-slate-100 dark:border-gray-800 p-4 pb-8 flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
          <span className="text-lg font-bold">{balanceDisplay}</span>
        </div>
        <button
          onClick={() => navigate('/invest-amount', { state: { project } })}
          className="flex-1 h-14 bg-[#1132d4] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Invest Now
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-4 px-5 py-4 border-t border-slate-100 dark:border-gray-800 bg-white dark:bg-[#101322] sticky bottom-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Available Balance</span>
          <span className="text-lg font-bold">{balanceDisplay}</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => navigate('/invest-amount', { state: { project } })}
          className="px-8 h-14 bg-[#1132d4] text-white font-bold rounded-xl shadow-lg hover:bg-[#0e28b0] transition-colors flex items-center justify-center gap-2"
        >
          Invest Now
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </PageWrapper>
  );
}
