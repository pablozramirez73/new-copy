export enum WorkflowStatus {
  ToReview = 'Da Revisionare',
  InProgress = 'In Lavorazione',
  Approved = 'Approvato',
  Rejected = 'Rifiutato',
}

export interface DocumentVersion {
  versionNumber: number;
  status: WorkflowStatus;
  summary: string;
  date: Date;
  changeReason: string;
}

export interface Document {
  id: string;
  name: string;
  versions: DocumentVersion[];
  spaceId?: string;
}

export interface Space {
  id: string;
  name: string;
}
