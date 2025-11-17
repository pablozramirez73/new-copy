import React, { useState, useRef, useEffect } from 'react';
import { type Document, WorkflowStatus } from '../types';

interface DocumentCardProps {
  document: Document;
  onUpdateStatus: (docId: string, newStatus: WorkflowStatus) => void;
  onRequestDelete: (doc: Document) => void;
  onShowHistory: (doc: Document) => void;
  onSplit: (doc: Document) => void;
  isSelected: boolean;
  onToggleSelection: (docId: string) => void;
  onReorder: (draggedDocId: string, targetDocId: string) => void;
  onShowPreview: (doc: Document, rect: DOMRect) => void;
  onHidePreview: () => void;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return { icon: 'fas fa-file-pdf', color: 'text-rose-500' };
        case 'docx':
            return { icon: 'fas fa-file-word', color: 'text-sky-500' };
        default:
            return { icon: 'fas fa-file-alt', color: 'text-slate-500' };
    }
};


export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onUpdateStatus, onRequestDelete, onShowHistory, onSplit, isSelected, onToggleSelection, onReorder, onShowPreview, onHidePreview }) => {
  const { id, name, versions } = document;
  const latestVersion = versions[versions.length - 1];
  const { summary, status, date } = latestVersion;
  const iconDetails = getFileIcon(name);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dropIndicatorVisible, setDropIndicatorVisible] = useState(false);

  const statuses = Object.values(WorkflowStatus);
  const currentIndex = statuses.indexOf(status);

  const canMoveBack = currentIndex > 0;
  const canMoveForward = currentIndex < statuses.length - 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => window.document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moveBack = () => onUpdateStatus(id, statuses[currentIndex - 1]);
  const moveForward = () => onUpdateStatus(id, statuses[currentIndex + 1]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onHidePreview();
    e.dataTransfer.setData('documentId', id);
    e.dataTransfer.setData('documentStatus', status);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.types.includes('documentid') ? e.dataTransfer.getData('documentId') : '';
    const draggedStatus = e.dataTransfer.types.includes('documentstatus') ? e.dataTransfer.getData('documentStatus') : '';

    if (draggedId && draggedId !== id && draggedStatus === status) {
        e.dataTransfer.dropEffect = 'move';
        setDropIndicatorVisible(true);
    } else {
        e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropIndicatorVisible(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropIndicatorVisible(false);
    const draggedDocId = e.dataTransfer.getData('documentId');
    const draggedDocStatus = e.dataTransfer.getData('documentStatus');
    
    if (draggedDocId && draggedDocId !== id && draggedDocStatus === status) {
        onReorder(draggedDocId, id);
    }
  };
  
  const handleMouseEnter = () => {
    if (cardRef.current) {
        onShowPreview(document, cardRef.current.getBoundingClientRect());
    }
  };

  const handleMouseLeave = () => {
    onHidePreview();
  };

  return (
    <div 
      ref={cardRef}
      draggable="true"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-2xl border ${isSelected ? 'border-sky-500' : 'border-slate-200 dark:border-slate-700'} hover:border-sky-500 dark:hover:border-sky-400 transition-all duration-300 flex flex-col group relative hover:-translate-y-1`}
    >
        {dropIndicatorVisible && <div className="absolute top-0 left-2 right-2 h-1 bg-sky-500 rounded-full z-10 -mt-0.5" />}
        <div className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" title="Trascina per spostare o riordinare">
            <i className="fas fa-grip-vertical"></i>
        </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
                <label className="flex items-center mt-1">
                    <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelection(id)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500 bg-slate-100 dark:bg-slate-900 cursor-pointer"
                    />
                </label>
                <div className={`flex-shrink-0 text-2xl mt-1 ${iconDetails.color}`}>
                    <i className={iconDetails.icon}></i>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={name}>{name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        v{versions.length} &bull; {date.toLocaleDateString('it-IT')}
                    </p>
                </div>
            </div>
            <div className="relative flex-shrink-0" ref={menuRef}>
                <button onClick={() => setMenuOpen(prev => !prev)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700" title="Altre azioni">
                    <i className="fas fa-ellipsis-h"></i>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-20 border border-slate-200 dark:border-slate-700 dropdown-enter-animate text-sm">
                        <div className="p-1">
                            <a 
                                onClick={() => { onShowHistory(document); setMenuOpen(false); }} 
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer group" 
                                title="Visualizza la cronologia delle versioni"
                            >
                                <i className="fas fa-history w-5 text-center text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-200 text-lg"></i>
                                <span>Cronologia</span>
                            </a>
                            <a 
                                onClick={() => { onSplit(document); setMenuOpen(false); }} 
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer group" 
                                title="Dividi questo documento in più file"
                            >
                                <i className="fas fa-cut w-5 text-center text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-200 text-lg"></i>
                                <span>Dividi</span>
                            </a>
                            <hr className="border-slate-200 dark:border-slate-700 my-1"/>
                            <a 
                                onClick={() => { onRequestDelete(document); setMenuOpen(false); }} 
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/50 cursor-pointer group" 
                                title="Elimina definitivamente questo documento"
                            >
                                <i className="fas fa-trash-alt w-5 text-center text-rose-500 dark:text-rose-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors duration-200 text-lg"></i>
                                <span>Elimina</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 pl-14 leading-relaxed">
            {summary}
        </p>
      </div>
      <div className="flex justify-between items-center mt-auto bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 px-4 py-2 rounded-b-lg">
        <div>
            {status !== WorkflowStatus.Approved && (
                <button
                    onClick={() => onUpdateStatus(id, WorkflowStatus.Approved)}
                    className="p-1.5 text-sm text-teal-500 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                    title="Approvazione Rapida"
                    aria-label="Approvazione Rapida"
                >
                    <i className="fas fa-check-double"></i>
                </button>
            )}
        </div>
        <div className="flex items-center gap-1">
            <button 
              onClick={moveBack} 
              disabled={!canMoveBack}
              className="p-1.5 text-sm text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Sposta indietro"
              title="Sposta indietro"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button 
              onClick={moveForward} 
              disabled={!canMoveForward}
              className="p-1.5 text-sm text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               aria-label="Sposta avanti"
               title="Sposta avanti"
            >
              <i className="fas fa-arrow-right"></i>
            </button>
        </div>
      </div>
    </div>
  );
};