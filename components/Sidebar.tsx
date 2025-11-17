import React, { useState } from 'react';
import { type Space } from '../types';

interface SidebarProps {
  isOpen: boolean;
  spaces: Space[];
  activeSpaceId: string;
  onSelectSpace: (spaceId: string) => void;
  onAddSpace: (name: string) => void;
  onMoveDocumentToSpace: (docId: string, spaceId: string | null) => void;
  allFilesId: string;
}

const SpaceItem: React.FC<{
  spaceId: string | null;
  name: string;
  isActive: boolean;
  icon: string;
  onSelect: () => void;
  onMoveDocumentToSpace: (docId: string, spaceId: string | null) => void;
}> = ({ spaceId, name, isActive, icon, onSelect, onMoveDocumentToSpace }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-sky-500/10');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-sky-500/10');
  };

  const handleDrop = (e: React.DragEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-sky-500/10');
    const docId = e.dataTransfer.getData('documentId');
    if (docId) {
      onMoveDocumentToSpace(docId, spaceId);
    }
  };

  return (
    <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative ${
            isActive
              ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300'
              : 'hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <i className={`${icon} w-5 text-center text-lg ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}></i>
          <span className="font-semibold text-sm">{name}</span>
           {isActive && <div className="absolute left-0 top-1 bottom-1 w-1 bg-sky-600 rounded-r-full"></div>}
        </a>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  spaces,
  activeSpaceId,
  onSelectSpace,
  onAddSpace,
  onMoveDocumentToSpace,
  allFilesId
}) => {
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpaceName.trim()) {
      onAddSpace(newSpaceName.trim());
      setNewSpaceName('');
      setIsAdding(false);
    }
  };

  return (
    <aside
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col ${
        isOpen ? 'w-64 p-3' : 'w-0 opacity-0'
      } overflow-hidden`}
    >
      <div className="flex-1 overflow-y-auto">
        <nav>
            <ul className="space-y-1">
            <SpaceItem
                spaceId={allFilesId}
                name="Tutti i file"
                icon="fas fa-inbox"
                isActive={activeSpaceId === allFilesId}
                onSelect={() => onSelectSpace(allFilesId)}
                onMoveDocumentToSpace={onMoveDocumentToSpace}
            />
            <hr className="border-slate-200 dark:border-slate-700 my-3" />
            {spaces.map(space => (
                <SpaceItem
                key={space.id}
                spaceId={space.id}
                name={space.name}
                icon="fas fa-folder"
                isActive={activeSpaceId === space.id}
                onSelect={() => onSelectSpace(space.id)}
                onMoveDocumentToSpace={onMoveDocumentToSpace}
                />
            ))}
            </ul>
        </nav>
      </div>

      <div className="mt-2">
         {isAdding ? (
             <form onSubmit={handleAddSpace} className="item-enter-animate">
                <input
                type="text"
                value={newSpaceName}
                onChange={e => setNewSpaceName(e.target.value)}
                placeholder="Nome dello spazio..."
                autoFocus
                onBlur={() => { if(!newSpaceName) setIsAdding(false) }}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-sky-500"
                />
             </form>
         ) : (
            <button 
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50"
            >
                <i className="fas fa-plus w-5 text-center"></i>
                Aggiungi Spazio
            </button>
         )}
      </div>
    </aside>
  );
};