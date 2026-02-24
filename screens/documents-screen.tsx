import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'tax' | 'statement' | 'legal' | 'kyc';
  category: string;
  date: string;
  size: string;
  status: 'completed' | 'pending' | 'action_required';
  projectId?: string;
  projectName?: string;
}

export function DocumentsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'investments' | 'tax' | 'legal'>('all');
  
  const documents: Document[] = [
    {
      id: '1',
      name: 'Investment Agreement - SCN',
      type: 'contract',
      category: 'Investment',
      date: '2024-02-01',
      size: '2.4 MB',
      status: 'completed',
      projectId: 'scn',
      projectName: 'SCN — Stem Cell Therapy Clinic'
    },
    {
      id: '2',
      name: 'Investment Agreement - PTF',
      type: 'contract',
      category: 'Investment',
      date: '2024-01-15',
      size: '1.8 MB',
      status: 'completed',
      projectId: 'ptf',
      projectName: 'PTF — Potato Tokenized Finance'
    },
    {
      id: '3',
      name: 'Investment Agreement - MDD',
      type: 'contract',
      category: 'Investment',
      date: '2024-01-10',
      size: '2.1 MB',
      status: 'completed',
      projectId: 'mdd',
      projectName: 'MDD — Medical Distribution'
    },
    {
      id: '4',
      name: '2024 Tax Form 1099',
      type: 'tax',
      category: 'Tax',
      date: '2024-01-31',
      size: '856 KB',
      status: 'completed'
    },
    {
      id: '5',
      name: 'Q1 2024 Account Statement',
      type: 'statement',
      category: 'Statement',
      date: '2024-04-01',
      size: '1.2 MB',
      status: 'completed'
    },
    {
      id: '6',
      name: 'KYC Verification Documents',
      type: 'kyc',
      category: 'Legal',
      date: '2023-12-15',
      size: '3.4 MB',
      status: 'completed'
    },
    {
      id: '7',
      name: 'Accredited Investor Certification',
      type: 'legal',
      category: 'Legal',
      date: '2023-12-15',
      size: '645 KB',
      status: 'action_required'
    },
    {
      id: '8',
      name: 'Risk Disclosure Statement',
      type: 'legal',
      category: 'Legal',
      date: '2023-12-15',
      size: '892 KB',
      status: 'completed'
    }
  ];
  
  const filterDocuments = () => {
    switch (activeTab) {
      case 'investments':
        return documents.filter(d => d.type === 'contract');
      case 'tax':
        return documents.filter(d => d.type === 'tax' || d.type === 'statement');
      case 'legal':
        return documents.filter(d => d.type === 'legal' || d.type === 'kyc');
      default:
        return documents;
    }
  };
  
  const filteredDocs = filterDocuments();
  
  const handleDownload = (doc: Document) => {
    alert(`Downloading: ${doc.name}`);
  };
  
  const handleView = (doc: Document) => {
    navigate(`/document/${doc.id}`, { state: { document: doc } });
  };
  
  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full">
            COMPLETED
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full">
            PENDING
          </span>
        );
      case 'action_required':
        return (
          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded-full">
            ACTION REQUIRED
          </span>
        );
    }
  };
  
  const getDocIcon = (type: Document['type']) => {
    switch (type) {
      case 'contract':
        return 'description';
      case 'tax':
        return 'receipt_long';
      case 'statement':
        return 'summarize';
      case 'legal':
        return 'gavel';
      case 'kyc':
        return 'badge';
      default:
        return 'folder';
    }
  };
  
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
            <h1 className="text-xl font-bold">Documents</h1>
            <p className="text-xs text-slate-500">{filteredDocs.length} documents</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">search</span>
          </button>
        </header>
        
        {/* Tabs */}
        <div className="sticky top-[73px] z-40 bg-white dark:bg-[#101322] border-b border-gray-100 dark:border-gray-800 px-5 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All', count: documents.length },
              { id: 'investments', label: 'Investments', count: documents.filter(d => d.type === 'contract').length },
              { id: 'tax', label: 'Tax & Statements', count: documents.filter(d => d.type === 'tax' || d.type === 'statement').length },
              { id: 'legal', label: 'Legal', count: documents.filter(d => d.type === 'legal' || d.type === 'kyc').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1132d4] text-white shadow-lg shadow-[#1132d4]/30'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <main className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-24">
          {/* Action Required Notice */}
          {documents.some(d => d.status === 'action_required') && activeTab === 'all' && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-red-600 shrink-0">priority_high</span>
                <div className="flex-1">
                  <p className="font-bold text-red-900 dark:text-red-200 mb-1">Action Required</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Some documents require your attention
                  </p>
                  <button 
                    onClick={() => setActiveTab('legal')}
                    className="text-sm font-bold text-red-600 hover:underline"
                  >
                    Review Now →
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents List */}
          <div className="space-y-3">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-4 hover:border-[#1132d4] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-600 dark:text-gray-300">
                      {getDocIcon(doc.type)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm line-clamp-1">{doc.name}</h4>
                      {getStatusBadge(doc.status)}
                    </div>
                    
                    {doc.projectName && (
                      <p className="text-xs text-[#1132d4] font-medium mb-1">{doc.projectName}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">folder</span>
                        {doc.size}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(doc)}
                        className="flex items-center gap-1 px-4 py-2 bg-[#1132d4] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        View Document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Storage Info */}
          <div className="bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm">Document Storage</h4>
              <span className="text-sm text-slate-500">14.2 MB / 1 GB</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#1132d4] rounded-full" style={{ width: '1.42%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Documents are securely stored and accessible anytime
            </p>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}