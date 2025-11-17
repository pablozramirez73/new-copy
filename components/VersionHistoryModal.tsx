import React from 'react';
import { type Document } from '../types';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document | null;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ isOpen, onClose, document }) => {
    if (!isOpen || !document) return null;

    const reversedVersions = [...document.versions].reverse();

    return (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4 modal-backdrop-animate">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700 modal-content-animate">
                <div className="flex justify-between items-start mb-4 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Cronologia Versioni</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 break-all" title={document.name}>{document.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">&times;</button>
                </div>
                
                <div className="overflow-y-auto space-y-4 pr-2 -mr-2">
                    {reversedVersions.map((version, index) => (
                        <div key={version.versionNumber} className={`p-4 rounded-lg border-l-4 ${index === 0 ? 'bg-sky-50 dark:bg-sky-900/40 border-sky-500' : 'bg-slate-50 dark:bg-slate-700/40 border-slate-400'}`}>
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${index === 0 ? 'bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-100' : 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100'}`}>
                                        v{version.versionNumber}
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{version.status}</span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {version.date.toLocaleString('it-IT')}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                                {version.changeReason}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-6 mt-2 flex-shrink-0 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};