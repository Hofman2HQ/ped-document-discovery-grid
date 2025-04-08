
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Document, SearchFilters } from "@/types";
import { 
  fetchDocuments, 
  getUniqueCountries, 
  getUniqueDocumentTypes,
  getUniqueStates
} from "@/api/documents";
import SearchBar from "@/components/SearchBar";
import DocumentGrid from "@/components/DocumentGrid";
import DocumentModal from "@/components/DocumentModal";
import EmptyState from "@/components/EmptyState";

const Index = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [countries, setCountries] = useState<string[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const docs = await fetchDocuments();
        setDocuments(docs);
        setFilteredDocuments(docs);
        
        // Load filter options
        setCountries(getUniqueCountries());
        setDocumentTypes(getUniqueDocumentTypes());
        setStates(getUniqueStates());
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      const filteredDocs = await fetchDocuments({
        searchText: filters.searchText,
        country: filters.country === 'all' ? '' : filters.country,
        documentType: filters.documentType === 'all' ? '' : filters.documentType,
        dateFrom: filters.dateRange.from,
        dateTo: filters.dateRange.to,
        state: filters.state === 'all' ? '' : filters.state,
        transactionId: filters.transactionId,
        sessionId: filters.sessionId
      });
      setFilteredDocuments(filteredDocs);
    } catch (err) {
      console.error("Error applying filters:", err);
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Publicly Exposed Documents</h1>
        <p className="text-muted-foreground">
          Browse and search sensitive documents found exposed across the web
        </p>
      </header>

      <SearchBar 
        countries={countries} 
        documentTypes={documentTypes}
        states={states}
        onSearch={handleSearch} 
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading documents...</span>
        </div>
      ) : error ? (
        <div className="text-destructive text-center p-4">
          {error}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Results ({filteredDocuments.length})
            </h2>
          </div>
          <DocumentGrid 
            documents={filteredDocuments} 
            onDocumentClick={handleDocumentClick} 
          />
        </div>
      )}

      <DocumentModal 
        document={selectedDocument} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default Index;
