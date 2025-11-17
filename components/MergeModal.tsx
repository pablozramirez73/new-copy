import React, { useState, useEffect } from 'react';
import { type Document } from '../types';

interface MergeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newFileName: string, orderedDocs: Document[]) => void;
    documentsToMerge: Document[];
}

export const MergeModal: React.FC<MergeModalProps> = ({ isOpen, onClose, onSubmit, documentsToMerge }) => {
    const [newFileName, setNewFileName] = useState('');
    const [orderedDocs, setOrderedDocs] = useState<Document[]>([]);

    useEffect(() => {
        if (isOpen) {
            setNewFileName('Documento_Unito.pdf');
            setOrderedDocs(documentsToMerge);
        }
    }, [isOpen, documentsToMerge]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (newFileName.trim() && orderedDocs.length > 1) {
            onSubmit(newFileName, orderedDocs);
        }
    };
    
    // Per semplicità, non implementiamo il drag-and-drop ma mostriamo solo l'elenco.
    // In un'implementazione reale, si potrebbe aggiungere qui la logica per riordinare.

    return (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4 modal-backdrop-animate">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 modal-content-animate">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Unisci Documenti</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">&times;</button>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Stai per unire {orderedDocs.length} documenti. Assegna un nome al nuovo file.</p>

                <div className="mb-4">
                    <label htmlFor="new-file-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nome del nuovo file
                    </label>
                    <input
                        id="new-file-name"
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
                        placeholder="Es: Report_Consolidato.pdf"
                    />
                </div>

                <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Documenti da unire:</h4>
                    <ul className="space-y-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                        {orderedDocs.map(doc => 
                            <li key={doc.id} className="flex items-center gap-2">
                                <i className="fas fa-file-alt text-slate-400"></i>
                                <span>{doc.name}</span>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!newFileName.trim() || orderedDocs.length < 2}
                        className="bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        Conferma Unione
                    </button>
                </div>
            </div>
        </div>
    );
};