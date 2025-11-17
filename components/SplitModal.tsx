import React, { useState, useEffect } from 'react';
import { type Document } from '../types';

interface SplitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (originalDoc: Document, newFileNames: string[]) => void;
    documentToSplit: Document | null;
}

export const SplitModal: React.FC<SplitModalProps> = ({ isOpen, onClose, onSubmit, documentToSplit }) => {
    const [newFileNames, setNewFileNames] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNewFileNames('');
        }
    }, [isOpen]);

    if (!isOpen || !documentToSplit) return null;

    const handleSubmit = () => {
        const names = newFileNames.split('\n').map(name => name.trim()).filter(Boolean);
        if (names.length > 0) {
            onSubmit(documentToSplit, names);
        }
    };

    const parsedNames = newFileNames.split('\n').map(name => name.trim()).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4 modal-backdrop-animate">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 modal-content-animate">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Dividi Documento</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">&times;</button>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Stai per dividere <span className="font-semibold text-slate-800 dark:text-slate-200">{documentToSplit.name}</span>.
                    Inserisci i nomi per i nuovi file, uno per riga.
                </p>

                <div>
                    <label htmlFor="new-files" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nomi dei nuovi documenti
                    </label>
                    <textarea
                        id="new-files"
                        value={newFileNames}
                        onChange={(e) => setNewFileNames(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
                        rows={4}
                        placeholder="Capitolo_1.pdf&#10;Appendice_A.pdf&#10;Bibliografia.pdf"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                     <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={parsedNames.length === 0}
                        className="bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                    >
                        Dividi in {parsedNames.length || ''} file
                    </button>
                </div>
            </div>
        </div>
    );
};