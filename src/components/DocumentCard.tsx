
import React from 'react';
import { Document } from '@/types';
import { ExternalLink, Calendar, MapPin, FileText, Flag, Check, X, Key } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentCardProps {
  document: Document;
  onClick: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  // Format the created_at date
  const formattedDate = format(new Date(document.created_at), 'MMM d, yyyy');
  
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
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50">
      <div className="relative aspect-video bg-muted overflow-hidden cursor-pointer" onClick={onClick}>
        <img
          src={document.image_url}
          alt={`Document ${document.transactionId}`}
          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
        />
        <Badge 
          variant={getBadgeVariant(document.state) as any} 
          className="absolute top-2 right-2"
        >
          {document.state}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Key className="mr-1 h-3.5 w-3.5" />
            <span className="font-medium truncate" title={document.transactionId}>
              ID: {document.transactionId}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1 h-3.5 w-3.5" />
            <span className="font-medium">{document.document_type}</span>
            <span className="ml-1 text-xs">({document.ped_search_document_type})</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            <span>{document.country}</span>
            <span className="ml-1 text-xs">({document.ped_search_country})</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Flag className="mr-1 h-3.5 w-3.5" />
            <span>SFM:</span>
            {document.loaded_to_sfm ? (
              <Check className="ml-1 h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="ml-1 h-3.5 w-3.5 text-red-500" />
            )}
          </div>

          <div className="flex items-center text-sm pt-1">
            <a 
              href={document.page_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center w-full truncate"
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{document.page_url}</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
