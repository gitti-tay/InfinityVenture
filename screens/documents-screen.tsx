import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function DocumentsScreen() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <header className="lg:hidden px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold flex-1">Documents</h1>
      </header>

      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold">Documents</h1>
      </div>

      <main className="flex-1 px-5 lg:px-6 py-6 pb-24 lg:pb-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <span className="material-icons text-4xl text-blue-400">description</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Documents Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Investment agreements, tax forms, and other documents will appear here once you make your first investment.
          </p>
          <button
            onClick={() => navigate('/invest')}
            className="px-6 py-3 bg-[#1132d4] text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            Browse Opportunities
          </button>
        </div>
      </main>
    </PageWrapper>
  );
}
