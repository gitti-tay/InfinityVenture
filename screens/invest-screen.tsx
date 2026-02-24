import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '../components/page-wrapper';
import { PROJECTS } from '../data/projects';

export function InvestScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'apy' | 'min' | 'progress'>('apy');
  
  const categories = ['All', 'Real Estate', 'Healthcare', 'Agriculture'];
  
  const filteredProjects = selectedCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === selectedCategory);
  
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'apy') {
      return parseFloat(b.apy) - parseFloat(a.apy);
    } else if (sortBy === 'min') {
      return parseInt(a.min.replace(/\D/g, '')) - parseInt(b.min.replace(/\D/g, ''));
    } else {
      return b.progress - a.progress;
    }
  });
  
  return (
    <PageWrapper>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Investment Opportunities</h1>
            <p className="text-sm text-slate-500">Discover premium RWA projects</p>
          </div>
          <button className="p-2 rounded-full bg-slate-100 dark:bg-gray-800">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1132d4] text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>
      
      <main className="px-5 py-6 pb-24 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <p className="text-xs opacity-90 mb-1">Total Projects</p>
            <p className="text-2xl font-bold">{PROJECTS.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
            <p className="text-xs opacity-90 mb-1">Avg APY</p>
            <p className="text-2xl font-bold">
              {(PROJECTS.reduce((sum, p) => sum + parseFloat(p.apy), 0) / PROJECTS.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
            <p className="text-xs opacity-90 mb-1">Total Raised</p>
            <p className="text-2xl font-bold">
              {(PROJECTS.reduce((sum, p) => sum + parseFloat(p.raised.replace(/\D/g, '')), 0) / 1000).toFixed(1)}M
            </p>
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">
            {sortedProjects.length} {sortedProjects.length === 1 ? 'Project' : 'Projects'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm font-bold bg-slate-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border-0 outline-none cursor-pointer"
            >
              <option value="apy">Highest APY</option>
              <option value="min">Lowest Min</option>
              <option value="progress">Most Funded</option>
            </select>
          </div>
        </div>
        
        {/* Project Cards */}
        <div className="space-y-4">
          {sortedProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.img}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900">
                    {project.category}
                  </span>
                  {project.badge && (
                    <span className="px-3 py-1 bg-emerald-500/95 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                      {project.badge}
                    </span>
                  )}
                </div>
                
                {/* Project Name */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-lg text-white mb-1">{project.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="p-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">APY</p>
                    <p className="font-bold text-[#1132d4] text-lg">{project.apy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Term</p>
                    <p className="font-bold">{project.term}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Min</p>
                    <p className="font-bold">{project.min}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Risk</p>
                    <p className={`text-xs font-bold px-2 py-1 rounded-full ${
                      project.risk.includes('Low') 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}>
                      {project.risk.replace(' Risk', '')}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500">Funding Progress</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      ${project.raised} / ${project.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1132d4] to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">{project.progress}% funded</span>
                    <span className="text-xs text-slate-500">{project.investors} investors</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="flex-1 py-3 px-4 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">info</span>
                    Details
                  </button>
                  <button
                    onClick={() => navigate('/invest-amount', { state: { project } })}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    Invest Now
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-gray-700 mb-4 block">search_off</span>
            <h3 className="font-bold text-lg mb-2">No Projects Found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-3 bg-[#1132d4] text-white font-bold rounded-xl"
            >
              View All Projects
            </button>
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
