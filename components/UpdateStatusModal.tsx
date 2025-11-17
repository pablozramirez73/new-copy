import React, { useState, useEffect } from 'react';
import { WorkflowStatus } from '../types';

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    newStatus: WorkflowStatus | null;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, onSubmit, newStatus }) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReason('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4 modal-backdrop-animate">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 modal-content-animate">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Aggiorna Stato Documento</h2>
                     <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">&times;</button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                    Stai per spostare il documento a: <span className="font-semibold text-sky-600 dark:text-sky-400">{newStatus}</span>.
                </p>
                <div>
                    <label htmlFor="change-reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Motivo della modifica <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        id="change-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        rows={4}
                        placeholder="Es: Approvato dopo revisione finale del team legale."
                    />
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                    <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                        className="bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
                    >
                        Conferma
                    </button>
                </div>
            </div>
        </div>
    );
};