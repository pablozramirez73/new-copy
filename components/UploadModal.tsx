import React, { useState, useCallback } from 'react';
import { summarizeDocument } from '../services/geminiService';
import { type Document, WorkflowStatus } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onAddDocument: (name: string, summary: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAddDocument }) => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isThinkingMode, setThinkingMode] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const allowedExtensions = ['pdf', 'docx'];
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (fileExtension && allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setSummary('');
        setError('');
        setThinkingMode(false);
    } else {
        setFile(null);
        setError('Per favore, seleziona un file PDF o DOCX valido.');
    }
  };

  const handleSummarize = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    try {
      const generatedSummary = await summarizeDocument(file.name, isThinkingMode);
      setSummary(generatedSummary);
    } catch (err) {
      setError('Errore durante la generazione del riepilogo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [file, isThinkingMode]);

  const handleAdd = () => {
    if (file && summary) {
      onAddDocument(file.name, summary);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4 modal-backdrop-animate">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all border border-slate-200 dark:border-slate-700 modal-content-animate">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Carica Documento</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">&times;</button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Documento</label>
            <div className="mt-1 flex justify-center p-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                    <i className="fas fa-file-upload text-4xl text-slate-400"></i>
                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none">
                            <span>Seleziona un file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.docx" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">o trascinalo qui</p>
                    </div>
                    {file ? 
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{file.name}</p> :
                        <p className="text-xs text-slate-500 dark:text-slate-400">PDF o DOCX, max 10MB</p>
                    }
                </div>
            </div>
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          
          {file && !summary && (
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 item-enter-animate">
                <div className="flex items-center justify-between">
                    <label htmlFor="thinking-mode" className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            id="thinking-mode"
                            checked={isThinkingMode}
                            onChange={(e) => setThinkingMode(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-400 dark:border-slate-500 text-sky-600 focus:ring-sky-500 bg-slate-100 dark:bg-slate-900 cursor-pointer"
                        />
                        <span>Modalità Pensiero Approfondito</span>
                    </label>
                    <span className="text-slate-400 dark:text-slate-500" title="Usa un modello AI più potente (Gemini 2.5 Pro) per analisi complesse. La generazione potrebbe richiedere più tempo.">
                        <i className="fas fa-info-circle"></i>
                    </span>
                </div>
                {isThinkingMode && (
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pl-7">
                        Ideale per documenti complessi come report finanziari, contratti legali o piani strategici.
                     </p>
                )}
            </div>
          )}

          <button
            onClick={handleSummarize}
            disabled={!file || isLoading || !!summary}
            className="w-full bg-sky-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Generazione...</span>
              </>
            ) : (
                <>
                <i className="fas fa-wand-magic-sparkles"></i>
                <span>Genera Riepilogo con AI</span>
                </>
            )}
          </button>

          {summary && (
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg item-enter-animate">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Riepilogo Generato:</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={onClose} className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Annulla
            </button>
            <button
              onClick={handleAdd}
              disabled={!file || !summary}
              className="bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
            >
              Aggiungi al Flusso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};