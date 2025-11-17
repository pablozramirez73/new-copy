import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { UploadModal } from './components/UploadModal';
import { UpdateStatusModal } from './components/UpdateStatusModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { MergeModal } from './components/MergeModal';
import { SplitModal } from './components/SplitModal';
import { Sidebar } from './components/Sidebar';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { PdfPreview } from './components/PdfPreview';
import { type Document, type Space, WorkflowStatus } from './types';
import { summarizeMergeAction, summarizeSplitAction } from './services/geminiService';

const ALL_FILES_SPACE_ID = 'all-files';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc1',
      name: 'Rapporto_Finanziario_Q3.pdf',
      versions: [{
        versionNumber: 1,
        summary: 'Analisi dettagliata delle performance finanziarie del terzo trimestre, evidenziando una crescita dei ricavi del 15% e un aumento dei costi operativi.',
        status: WorkflowStatus.ToReview,
        date: new Date('2023-10-28T10:00:00Z'),
        changeReason: 'Caricamento iniziale del documento.'
      }],
      spaceId: 'space1'
    },
    {
      id: 'doc2',
      name: 'Proposta_Progetto_Phoenix.docx',
      versions: [{
        versionNumber: 1,
        summary: 'Documento che delinea gli obiettivi, l\'ambito, il budget e la timeline per il nuovo progetto strategico Phoenix, con focus sull\'espansione nel mercato asiatico.',
        status: WorkflowStatus.InProgress,
        date: new Date('2023-11-05T14:30:00Z'),
        changeReason: 'Preso in carico dal team di progetto.'
      }],
       spaceId: 'space1'
    },
    {
      id: 'doc3',
      name: 'Linee_Guida_Marketing_2024.pdf',
      versions: [
        { versionNumber: 1, status: WorkflowStatus.ToReview, summary: 'Bozza iniziale delle linee guida.', date: new Date('2023-10-14T11:00:00Z'), changeReason: 'Caricamento bozza.' },
        { versionNumber: 2, status: WorkflowStatus.InProgress, summary: 'Bozza rivista con feedback del team.', date: new Date('2023-10-14T18:00:00Z'), changeReason: 'Revisione interna.' },
        { versionNumber: 3, status: WorkflowStatus.Approved, summary: 'Strategie e direttive per le campagne di marketing del prossimo anno, con un\'enfasi sul digital marketing e l\'influencer engagement.', date: new Date('2023-10-15T09:00:00Z'), changeReason: 'Approvazione finale del management.' }
      ],
      spaceId: 'space2'
    },
    {
      id: 'doc4',
      name: 'Contratto_Fornitore_ABC.pdf',
      versions: [{
        versionNumber: 1,
        summary: 'Bozza di contratto con il fornitore ABC Corp. per la fornitura di materie prime. Contiene clausole non conformi alle policy aziendali.',
        status: WorkflowStatus.Rejected,
        date: new Date('2023-11-10T11:45:00Z'),
        changeReason: 'Clausole non conformi. Necessaria rinegogazione.'
      }],
      spaceId: 'space2'
    },
  ]);

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [updateStatusModalState, setUpdateStatusModalState] = useState<{isOpen: boolean; docId: string | null; newStatus: WorkflowStatus | null}>({isOpen: false, docId: null, newStatus: null});
  const [versionHistoryModalState, setVersionHistoryModalState] = useState<{isOpen: boolean; document: Document | null}>({isOpen: false, document: null});

  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isMergeModalOpen, setMergeModalOpen] = useState(false);
  const [splitModalState, setSplitModalState] = useState<{isOpen: boolean; document: Document | null}>({isOpen: false, document: null});
  const [deleteModalState, setDeleteModalState] = useState<{isOpen: boolean; document: Document | null}>({isOpen: false, document: null});

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [spaces, setSpaces] = useState<Space[]>([
    { id: 'space1', name: 'Progetti Strategici' },
    { id: 'space2', name: 'Marketing & Comunicazione' },
  ]);
  const [activeSpaceId, setActiveSpaceId] = useState<string>(ALL_FILES_SPACE_ID);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [previewState, setPreviewState] = useState<{ document: Document; position: { top: number; left: number }; } | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleAddDocument = (name: string, summary: string) => {
    setDocuments(prevDocs => [
      ...prevDocs,
      {
        id: `doc${Date.now()}`,
        name,
        versions: [{
          versionNumber: 1,
          summary,
          status: WorkflowStatus.ToReview,
          date: new Date(),
          changeReason: 'Caricamento iniziale del documento.'
        }],
        spaceId: activeSpaceId === ALL_FILES_SPACE_ID ? undefined : activeSpaceId,
      }
    ]);
  };

  const handleStartUpdateStatus = useCallback((docId: string, newStatus: WorkflowStatus) => {
    setUpdateStatusModalState({ isOpen: true, docId, newStatus });
  }, []);

  const handleConfirmUpdateStatus = (reason: string) => {
    if (!updateStatusModalState.docId || updateStatusModalState.newStatus === null) return;
    
    setDocuments(prevDocs => 
      prevDocs.map(doc => {
        if (doc.id === updateStatusModalState.docId) {
          const latestVersion = doc.versions[doc.versions.length - 1];
          const newVersion = {
            versionNumber: doc.versions.length + 1,
            status: updateStatusModalState.newStatus as WorkflowStatus,
            summary: latestVersion.summary,
            date: new Date(),
            changeReason: reason,
          };
          return { ...doc, versions: [...doc.versions, newVersion] };
        }
        return doc;
      })
    );
    setUpdateStatusModalState({ isOpen: false, docId: null, newStatus: null });
  };

  const handleShowHistory = useCallback((doc: Document) => {
    setVersionHistoryModalState({ isOpen: true, document: doc });
  }, []);

  const handleRequestDelete = useCallback((doc: Document) => {
    setDeleteModalState({ isOpen: true, document: doc });
  }, []);

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    setDeleteModalState({ isOpen: false, document: null });
  };

  const handleToggleSelection = useCallback((docId: string) => {
    setSelectedDocIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  }, []);

  const handleConfirmMerge = async (newFileName: string, orderedDocs: Document[]) => {
    const summary = await summarizeMergeAction(orderedDocs.map(d => d.name));
    const newDoc: Document = {
      id: `doc${Date.now()}`,
      name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      versions: [{
        versionNumber: 1,
        summary,
        status: WorkflowStatus.ToReview,
        date: new Date(),
        changeReason: `Creato dalla fusione di ${orderedDocs.length} documenti.`
      }],
      spaceId: activeSpaceId === ALL_FILES_SPACE_ID ? undefined : activeSpaceId,
    };
    
    const mergedDocIds = orderedDocs.map(d => d.id);
    setDocuments(prevDocs => [...prevDocs.filter(d => !mergedDocIds.includes(d.id)), newDoc]);
    setSelectedDocIds([]);
    setMergeModalOpen(false);
  };

  const handleOpenSplitModal = useCallback((doc: Document) => {
    setSplitModalState({isOpen: true, document: doc});
  }, []);
  
  const handleConfirmSplit = async (originalDoc: Document, newFileNames: string[]) => {
    const newDocs: Document[] = await Promise.all(
      newFileNames.map(async (name, index) => {
        const summary = await summarizeSplitAction(originalDoc.name, name);
        return {
          id: `doc${Date.now() + index}`,
          name: name.endsWith('.pdf') ? name : `${name}.pdf`,
          versions: [{
            versionNumber: 1,
            summary,
            status: WorkflowStatus.ToReview,
            date: new Date(),
            changeReason: `Creato dalla divisione di ${originalDoc.name}.`
          }],
          spaceId: originalDoc.spaceId,
        };
      })
    );

    setDocuments(prevDocs => [...prevDocs.filter(d => d.id !== originalDoc.id), ...newDocs]);
    setSplitModalState({isOpen: false, document: null});
  };

  const handleAddSpace = (name: string) => {
    const newSpace: Space = { id: `space${Date.now()}`, name };
    setSpaces(prev => [...prev, newSpace]);
  };

  const handleMoveDocumentToSpace = (docId: string, spaceId: string | null) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === docId ? { ...doc, spaceId: spaceId === ALL_FILES_SPACE_ID ? undefined : spaceId } : doc
      )
    );
  };

  const handleReorderDocument = useCallback((draggedDocId: string, targetDocId: string) => {
    setDocuments(prevDocs => {
      const draggedIndex = prevDocs.findIndex(d => d.id === draggedDocId);
      const targetIndex = prevDocs.findIndex(d => d.id === targetDocId);

      if (draggedIndex === -1 || targetIndex === -1) {
        return prevDocs;
      }

      const newDocs = [...prevDocs];
      const [draggedItem] = newDocs.splice(draggedIndex, 1);
      
      const newTargetIndex = newDocs.findIndex(d => d.id === targetDocId);
      
      newDocs.splice(newTargetIndex, 0, draggedItem);
      return newDocs;
    });
  }, []);
  
  const handleShowPreview = useCallback((doc: Document, rect: DOMRect) => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
        const PREVIEW_WIDTH = 320; // 20rem
        const PREVIEW_HEIGHT = 400; // 25rem
        const GAP = 16; // 1rem

        let top = rect.top;
        let left = rect.right + GAP;

        if (left + PREVIEW_WIDTH > window.innerWidth) {
            left = rect.left - PREVIEW_WIDTH - GAP;
        }

        if (top + PREVIEW_HEIGHT > window.innerHeight) {
            top = window.innerHeight - PREVIEW_HEIGHT - GAP;
        }
        
        if (top < GAP) {
            top = GAP;
        }

        if (left < GAP) {
            left = rect.right + GAP;
        }

        setPreviewState({ document: doc, position: { top, left } });
    }, 500);
  }, []);

  const handleHidePreview = useCallback(() => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    setPreviewState(null);
  }, []);

  const filteredAndSearchedDocuments = useMemo(() => {
    let filteredBySpace = documents;
    if (activeSpaceId === ALL_FILES_SPACE_ID) {
      filteredBySpace = documents;
    } else {
      filteredBySpace = documents.filter(doc => doc.spaceId === activeSpaceId);
    }

    if (!searchQuery) {
        return filteredBySpace;
    }

    return filteredBySpace.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  }, [documents, activeSpaceId, searchQuery]);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      <Header 
        onUploadClick={() => setUploadModalOpen(true)}
        selectedCount={selectedDocIds.length}
        onMergeClick={() => setMergeModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex flex-1 overflow-y-auto">
        <Sidebar 
          isOpen={isSidebarOpen}
          spaces={spaces}
          activeSpaceId={activeSpaceId}
          onSelectSpace={setActiveSpaceId}
          onAddSpace={handleAddSpace}
          onMoveDocumentToSpace={handleMoveDocumentToSpace}
          allFilesId={ALL_FILES_SPACE_ID}
        />
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out">
          {filteredAndSearchedDocuments.length > 0 ? (
            <KanbanBoard 
                documents={filteredAndSearchedDocuments} 
                onUpdateDocumentStatus={handleStartUpdateStatus}
                onRequestDelete={handleRequestDelete}
                onShowHistory={handleShowHistory}
                onSplitDocument={handleOpenSplitModal}
                selectedDocIds={selectedDocIds}
                onToggleSelection={handleToggleSelection}
                onReorderDocument={handleReorderDocument}
                onShowPreview={handleShowPreview}
                onHidePreview={handleHidePreview}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
              <i className="fas fa-search text-5xl mb-4"></i>
              <h2 className="text-2xl font-semibold mb-2">Nessun risultato trovato</h2>
              <p>
                Prova a modificare i filtri o la query di ricerca.
              </p>
            </div>
          )}
        </main>
      </div>
      
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setUploadModalOpen(false)} 
          onAddDocument={handleAddDocument} 
        />
      )}

      <UpdateStatusModal
        isOpen={updateStatusModalState.isOpen}
        onClose={() => setUpdateStatusModalState({ isOpen: false, docId: null, newStatus: null })}
        onSubmit={handleConfirmUpdateStatus}
        newStatus={updateStatusModalState.newStatus}
      />

      <VersionHistoryModal
        isOpen={versionHistoryModalState.isOpen}
        onClose={() => setVersionHistoryModalState({ isOpen: false, document: null })}
        document={versionHistoryModalState.document}
      />

      <MergeModal
        isOpen={isMergeModalOpen}
        onClose={() => {
          setMergeModalOpen(false);
          setSelectedDocIds([]);
        }}
        onSubmit={handleConfirmMerge}
        documentsToMerge={documents.filter(d => selectedDocIds.includes(d.id))}
      />

      <SplitModal
        isOpen={splitModalState.isOpen}
        onClose={() => setSplitModalState({ isOpen: false, document: null })}
        onSubmit={handleConfirmSplit}
        documentToSplit={splitModalState.document}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, document: null })}
        onSubmit={handleDeleteDocument}
        documentToDelete={deleteModalState.document}
      />
      
      {previewState && (
          <PdfPreview 
            document={previewState.document} 
            position={previewState.position} 
          />
      )}
    </div>
  );
};

export default App;