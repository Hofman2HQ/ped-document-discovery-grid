
import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No documents found matching your criteria." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg bg-card">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <FileSearch className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Results Found</h3>
      <p className="text-muted-foreground text-center max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;
