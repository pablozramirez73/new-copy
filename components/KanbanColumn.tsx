import React from 'react';
import { DocumentCard } from './DocumentCard';
import { type Document, WorkflowStatus } from '../types';

interface KanbanColumnProps {
  status: WorkflowStatus;
  documents: Document[];
  onUpdateDocumentStatus: (docId: string, newStatus: WorkflowStatus) => void;
  onRequestDelete: (doc: Document) => void;
  onShowHistory: (doc: Document) => void;
  onSplitDocument: (doc: Document) => void;
  selectedDocIds: string[];
  onToggleSelection: (docId: string) => void;
  onReorderDocument: (draggedDocId: string, targetDocId: string) => void;
  onShowPreview: (doc: Document, rect: DOMRect) => void;
  onHidePreview: () => void;
}

const statusConfig = {
    [WorkflowStatus.ToReview]: {
        icon: 'fas fa-eye',
        color: 'text-sky-600 dark:text-sky-400',
        bgColor: 'bg-sky-500/10',
        borderColor: 'border-sky-500'
    },
    [WorkflowStatus.InProgress]: {
        icon: 'fas fa-hourglass-half',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500'
    },
    [WorkflowStatus.Approved]: {
        icon: 'fas fa-check-circle',
        color: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500'
    },
    [WorkflowStatus.Rejected]: {
        icon: 'fas fa-times-circle',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500'
    }
}

export const KanbanColumn: React.FC<KanbanColumnProps> = (props) => {
    const { status, documents, onUpdateDocumentStatus, onRequestDelete, onShowHistory, onSplitDocument, selectedDocIds, onToggleSelection, onReorderDocument, onShowPreview, onHidePreview } = props;
    const config = statusConfig[status];

    return (
        <div className={`rounded-xl h-full flex flex-col`}>
            <div className={`flex items-center justify-between p-3 rounded-t-lg border-b-2 ${config.borderColor} ${config.bgColor}`}>
                <div className={`font-bold text-md flex items-center gap-3 ${config.color}`}>
                    <i className={`${config.icon}`}></i>
                    <span>{status}</span>
                </div>
                <span className="text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2.5 py-0.5">
                    {documents.length}
                </span>
            </div>
            <div className={`space-y-4 p-2 h-full overflow-y-auto ${config.bgColor}`}>
                {documents.map(doc => (
                    <div key={doc.id} className="item-enter-animate">
                        <DocumentCard
                            document={doc}
                            onUpdateStatus={onUpdateDocumentStatus}
                            onRequestDelete={onRequestDelete}
                            onShowHistory={onShowHistory}
                            onSplit={onSplitDocument}
                            isSelected={selectedDocIds.includes(doc.id)}
                            onToggleSelection={onToggleSelection}
                            onReorder={onReorderDocument}
                            onShowPreview={onShowPreview}
                            onHidePreview={onHidePreview}
                        />
                    </div>
                ))}
                 {documents.length === 0 && (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                        Nessun documento
                    </div>
                )}
            </div>
        </div>
    );
};