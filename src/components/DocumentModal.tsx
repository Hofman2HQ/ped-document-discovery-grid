
import React from 'react';
import { Document } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar, ExternalLink, MapPin, FileText, Flag, Check, X, Key, Hash } from 'lucide-react';

interface DocumentModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ 
  document, 
  isOpen, 
  onClose 
}) => {
  if (!document) return null;

  const formattedDate = format(new Date(document.created_at), 'MMMM d, yyyy');

  // Determine badge color based on state
  const getBadgeVariant = (state: string) => {
    switch (state.toLowerCase()) {
      case 'active':
        return 'default';
      case 'archived':
        return 'secondary';
      case 'removed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span>Document Details</span>
            <Badge 
              variant={getBadgeVariant(document.state) as any} 
              className="ml-2"
            >
              {document.state}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Information about the exposed document
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="rounded-md overflow-hidden aspect-video bg-muted">
            <img
              src={document.image_url}
              alt={`Document ${document.transactionId}`}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</h3>
              <p className="flex items-center">
                <Key className="mr-1.5 h-4 w-4 text-primary" />
                {document.transactionId}
              </p>
            </div>
            
            {document.sessionId && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Session ID</h3>
                <p className="flex items-center">
                  <Hash className="mr-1.5 h-4 w-4 text-primary" />
                  {document.sessionId}
                </p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Document Type</h3>
              <p className="flex items-center">
                <FileText className="mr-1.5 h-4 w-4 text-primary" />
                {document.document_type} 
                <span className="ml-1 text-xs">({document.ped_search_document_type})</span>
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
              <p className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4 text-primary" />
                {document.country}
                <span className="ml-1 text-xs">({document.ped_search_country})</span>
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Discovered On</h3>
              <p className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 text-primary" />
                {formattedDate}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Loaded to SFM</h3>
              <p className="flex items-center">
                <Flag className="mr-1.5 h-4 w-4 text-primary" />
                {document.loaded_to_sfm ? (
                  <><span className="mr-1">Yes</span><Check className="h-4 w-4 text-green-500" /></>
                ) : (
                  <><span className="mr-1">No</span><X className="h-4 w-4 text-red-500" /></>
                )}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Source URL</h3>
              <a 
                href={document.page_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline break-all"
              >
                <ExternalLink className="mr-1.5 h-4 w-4 flex-shrink-0" />
                {document.page_url}
              </a>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <a href={document.page_url} target="_blank" rel="noopener noreferrer">
              Visit Source
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentModal;
