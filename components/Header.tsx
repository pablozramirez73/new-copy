import React from 'react';

interface HeaderProps {
  onUploadClick: () => void;
  selectedCount: number;
  onMergeClick: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadClick, selectedCount, onMergeClick, onToggleSidebar, isSidebarOpen, searchQuery, onSearchChange }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b-2 border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-20 rounded-b-2xl shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button
                onClick={onToggleSidebar}
                className="text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
                aria-label="Toggle sidebar"
            >
                <i className={`fas ${isSidebarOpen ? 'fa-bars-staggered' : 'fa-bars'} text-xl`}></i>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">
              Flusso PDF
            </h1>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-slate-400"></i>
                </div>
                <input
                    type="text"
                    placeholder="Cerca documenti per nome..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-transparent focus:ring-2 focus:ring-sky-500 focus:border-sky-500 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 transition"
                />
            </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {selectedCount > 1 && (
             <button
                onClick={onMergeClick}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 item-enter-animate"
              >
                <i className="fas fa-layer-group"></i>
                <span className="hidden md:inline">Unisci ({selectedCount})</span>
                <span className="md:hidden">({selectedCount})</span>
            </button>
          )}
          <button
            onClick={onUploadClick}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <i className="fas fa-arrow-up-from-bracket"></i>
            <span className="hidden sm:inline">Carica</span>
          </button>
        </div>
      </div>
    </header>
  );
};