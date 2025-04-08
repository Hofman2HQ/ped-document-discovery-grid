
import React from 'react';
import { Document } from '@/types';
import DocumentCard from './DocumentCard';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, onDocumentClick }) => {
  return (
    <Grid>
      {documents.map((document) => (
        <DocumentCard
          key={document.transactionId}
          document={document}
          onClick={() => onDocumentClick(document)}
        />
      ))}
    </Grid>
  );
};

export default DocumentGrid;
