
import React from 'react';
import { Document } from '@/types';
import DocumentCard from './DocumentCard';

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, onDocumentClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.transactionId}
          document={document}
          onClick={() => onDocumentClick(document)}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
