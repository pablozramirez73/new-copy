import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { type Document, WorkflowStatus } from '../types';

interface KanbanBoardProps {
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

export const KanbanBoard: React.FC<KanbanBoardProps> = (props) => {
  const { 
    documents, 
    onUpdateDocumentStatus, 
    onRequestDelete, 
    onShowHistory, 
    onSplitDocument, 
    selectedDocIds, 
    onToggleSelection,
    onReorderDocument,
    onShowPreview,
    onHidePreview
  } = props;
  
  const statuses = Object.values(WorkflowStatus);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statuses.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          documents={documents.filter(doc => doc.versions[doc.versions.length - 1].status === status)}
          onUpdateDocumentStatus={onUpdateDocumentStatus}
          onRequestDelete={onRequestDelete}
          onShowHistory={onShowHistory}
          onSplitDocument={onSplitDocument}
          selectedDocIds={selectedDocIds}
          onToggleSelection={onToggleSelection}
          onReorderDocument={onReorderDocument}
          onShowPreview={onShowPreview}
          onHidePreview={onHidePreview}
        />
      ))}
    </div>
  );
};