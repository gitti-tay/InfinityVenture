import { useNavigate, useParams } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { PROJECTS } from '@/app/data/projects';

interface ProjectDocument {
  id: string;
  name: string;
  type: 'prospectus' | 'legal' | 'financial' | 'technical' | 'compliance';
  date: string;
  size: string;
  pages: number;
  mandatory: boolean;
}

export function ProjectDocumentsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const project = PROJECTS.find(p => p.id === projectId);
  
  if (!project) {
    navigate('/home');
    return null;
  }
  
  // Project-specific documents based on project type
  const getProjectDocuments = (): ProjectDocument[] => {
    const commonDocs: ProjectDocument[] = [
      {
        id: '1',
        name: 'Investment Prospectus',
        type: 'prospectus',
        date: '2024-01-15',
        size: '4.2 MB',
        pages: 45,
        mandatory: true
      },
      {
        id: '2',
        name: 'Risk Disclosure Statement',
        type: 'legal',
        date: '2024-01-15',
        size: '892 KB',
        pages: 12,
        mandatory: true
      },
      {
        id: '3',
        name: 'Subscription Agreement',
        type: 'legal',
        date: '2024-01-15',
        size: '1.5 MB',
        pages: 18,
        mandatory: true
      },
      {
        id: '4',
        name: 'Operating Agreement',
        type: 'legal',
        date: '2024-01-10',
        size: '2.1 MB',
        pages: 28,
        mandatory: true
      }
    ];
    
    // Add project-specific documents
    if (projectId === 'scn') {
      return [
        ...commonDocs,
        {
          id: '5',
          name: 'Medical Facility License',
          type: 'compliance',
          date: '2023-12-20',
          size: '645 KB',
          pages: 8,
          mandatory: false
        },
        {
          id: '6',
          name: 'Clinical Trial Results',
          type: 'technical',
          date: '2024-01-05',
          size: '3.8 MB',
          pages: 62,
          mandatory: false
        },
        {
          id: '7',
          name: 'FDA Approval Documentation',
          type: 'compliance',
          date: '2023-11-15',
          size: '2.4 MB',
          pages: 35,
          mandatory: false
        },
        {
          id: '8',
          name: 'Healthcare Equipment Appraisal',
          type: 'financial',
          date: '2024-01-12',
          size: '1.9 MB',
          pages: 22,
          mandatory: false
        },
        {
          id: '9',
          name: 'Patient Demographics & Market Analysis',
          type: 'financial',
          date: '2024-01-08',
          size: '2.7 MB',
          pages: 38,
          mandatory: false
        }
      ];
    } else if (projectId === 'ptf') {
      return [
        ...commonDocs,
        {
          id: '5',
          name: 'Agricultural Land Deed',
          type: 'legal',
          date: '2023-12-15',
          size: '1.2 MB',
          pages: 15,
          mandatory: false
        },
        {
          id: '6',
          name: 'Crop Yield Analysis Report',
          type: 'technical',
          date: '2024-01-10',
          size: '3.1 MB',
          pages: 48,
          mandatory: false
        },
        {
          id: '7',
          name: 'Farm Equipment Inventory',
          type: 'financial',
          date: '2024-01-05',
          size: '892 KB',
          pages: 12,
          mandatory: false
        },
        {
          id: '8',
          name: 'Supply Chain Contracts',
          type: 'legal',
          date: '2023-12-28',
          size: '1.8 MB',
          pages: 24,
          mandatory: false
        },
        {
          id: '9',
          name: 'Environmental Impact Assessment',
          type: 'compliance',
          date: '2023-12-10',
          size: '2.3 MB',
          pages: 31,
          mandatory: false
        }
      ];
    } else if (projectId === 'mdd') {
      return [
        ...commonDocs,
        {
          id: '5',
          name: 'Distribution Network Map',
          type: 'technical',
          date: '2024-01-12',
          size: '1.4 MB',
          pages: 18,
          mandatory: false
        },
        {
          id: '6',
          name: 'Warehouse Facility Documentation',
          type: 'compliance',
          date: '2023-12-20',
          size: '2.2 MB',
          pages: 28,
          mandatory: false
        },
        {
          id: '7',
          name: 'Supplier Contracts & Agreements',
          type: 'legal',
          date: '2024-01-05',
          size: '3.5 MB',
          pages: 42,
          mandatory: false
        },
        {
          id: '8',
          name: 'Revenue Projections (5-Year)',
          type: 'financial',
          date: '2024-01-10',
          size: '1.7 MB',
          pages: 25,
          mandatory: false
        },
        {
          id: '9',
          name: 'Medical Device Certifications',
          type: 'compliance',
          date: '2023-12-15',
          size: '2.9 MB',
          pages: 36,
          mandatory: false
        }
      ];
    }
    
    return commonDocs;
  };
  
  const documents = getProjectDocuments();
  const mandatoryDocs = documents.filter(d => d.mandatory);
  const optionalDocs = documents.filter(d => !d.mandatory);
  
  const handleDownload = (doc: ProjectDocument) => {
    alert(`Downloading: ${doc.name}\nSize: ${doc.size}\nPages: ${doc.pages}`);
  };
  
  const handleView = (doc: ProjectDocument) => {
    alert(`Opening document viewer for: ${doc.name}`);
  };
  
  const getDocIcon = (type: ProjectDocument['type']) => {
    switch (type) {
      case 'prospectus':
        return 'description';
      case 'legal':
        return 'gavel';
      case 'financial':
        return 'payments';
      case 'technical':
        return 'engineering';
      case 'compliance':
        return 'verified';
      default:
        return 'folder';
    }
  };
  
  const getDocColor = (type: ProjectDocument['type']) => {
    switch (type) {
      case 'prospectus':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600';
      case 'legal':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600';
      case 'financial':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600';
      case 'technical':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600';
      case 'compliance':
        return 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600';
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600';
    }
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => navigate(`/project/${projectId}`)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-3"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold mb-1">Project Documents</h1>
            <p className="text-sm text-[#1132d4] font-medium">{project.name}</p>
            <p className="text-xs text-slate-500">{documents.length} documents available</p>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-24">
          {/* Download All Banner */}
          <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Complete Document Package</h3>
                <p className="text-white/80 text-sm">All project documents in one download</p>
              </div>
              <button className="bg-white text-[#1132d4] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95 shrink-0">
                <span className="material-symbols-outlined text-sm">download</span>
                Download All
              </button>
            </div>
          </div>
          
          {/* Mandatory Documents */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Required Documents</h3>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded-full">
                MUST READ
              </span>
            </div>
            <div className="space-y-3">
              {mandatoryDocs.map(doc => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-800 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getDocColor(doc.type)}`}>
                      <span className="material-symbols-outlined">
                        {getDocIcon(doc.type)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1 line-clamp-1">{doc.name}</h4>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">calendar_today</span>
                          {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">description</span>
                          {doc.pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">folder</span>
                          {doc.size}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="flex items-center gap-1 text-xs font-bold text-[#1132d4] hover:underline"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-gray-400 hover:underline"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Optional Documents */}
          {optionalDocs.length > 0 && (
            <section>
              <h3 className="font-bold text-lg mb-4">Additional Documents</h3>
              <div className="space-y-3">
                {optionalDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-4 hover:border-[#1132d4] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getDocColor(doc.type)}`}>
                        <span className="material-symbols-outlined">
                          {getDocIcon(doc.type)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{doc.name}</h4>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">calendar_today</span>
                            {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">description</span>
                            {doc.pages} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">folder</span>
                            {doc.size}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="flex items-center gap-1 text-xs font-bold text-[#1132d4] hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-gray-400 hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Document Types Legend */}
          <div className="bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700 p-5">
            <h4 className="font-bold text-sm mb-4">Document Types</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'prospectus', label: 'Prospectus' },
                { type: 'legal', label: 'Legal' },
                { type: 'financial', label: 'Financial' },
                { type: 'technical', label: 'Technical' },
                { type: 'compliance', label: 'Compliance' }
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getDocColor(type as ProjectDocument['type'])}`}>
                    <span className="material-symbols-outlined text-xs">
                      {getDocIcon(type as ProjectDocument['type'])}
                    </span>
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}