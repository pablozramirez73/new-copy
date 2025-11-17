import React, { useState, useEffect } from 'react';
import { type Document } from '../types';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (docId: string) => void;
    documentToDelete: Document | null;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onSubmit, documentToDelete }) => {
    const [confirmationName, setConfirmationName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setConfirmationName('');
        }
    }, [isOpen]);

    if (!isOpen || !documentToDelete) return null;

    const isMatch = confirmationName === documentToDelete.name;

    const handleSubmit = () => {
        if (isMatch) {
            onSubmit(documentToDelete.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4 modal-backdrop-animate">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-rose-500/50 dark:border-rose-500/30 modal-content-animate">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-3">
                        <i className="fas fa-exclamation-triangle"></i>
                        Conferma Eliminazione
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">&times;</button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Questa azione è irreversibile. Per confermare l'eliminazione, digita il nome completo del documento: <strong className="text-slate-800 dark:text-slate-100">{documentToDelete.name}</strong>
                </p>

                <div>
                    <label htmlFor="confirmation-name" className="sr-only">
                        Nome del documento
                    </label>
                    <input
                        id="confirmation-name"
                        type="text"
                        value={confirmationName}
                        onChange={(e) => setConfirmationName(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
                        placeholder="Digita il nome del file qui..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isMatch}
                        className="bg-rose-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-rose-400 dark:disabled:bg-rose-800 disabled:cursor-not-allowed transition-colors"
                    >
                        Elimina Definitivamente
                    </button>
                </div>
            </div>
        </div>
    );
};