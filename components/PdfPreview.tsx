import React from 'react';
import { type Document } from '../types';

interface PdfPreviewProps {
    document: Document;
    position: { top: number; left: number };
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ document, position }) => {
    const latestVersion = document.versions[document.versions.length - 1];

    return (
        <div
            className="fixed w-80 h-[400px] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col pointer-events-none item-enter-animate"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                willChange: 'transform, opacity',
            }}
        >
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={document.name}>
                    {document.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    v{document.versions.length} &bull; {latestVersion.status}
                </p>
            </div>
            <div className="flex-1 p-4 overflow-hidden flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/50">
                <i className="fas fa-file-pdf text-6xl text-rose-500 mb-4"></i>
                <div className="text-xs text-center space-y-2 text-slate-500 dark:text-slate-400">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.</p>
                    <p className="opacity-60">Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</p>
                    <p className="opacity-40">Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
                </div>
            </div>
            <div className="text-center text-xs p-2 border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
                Anteprima
            </div>
        </div>
    );
};
