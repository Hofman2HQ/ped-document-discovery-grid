
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, CheckCircle, XCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  const [activeSearchedQuery, setActiveSearchedQuery] = useState<string>("");
  const [activePodId, setActivePodId] = useState<string>("");
  const [activeSfmStatus, setActiveSfmStatus] = useState<string>("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const docs = await fetchDocuments();
        setDocuments(docs);
        setFilteredDocuments(docs);
        
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
      // Update this call to include the podId and remove documentDate
      const filteredDocs = await fetchDocuments({
        searchText: filters.searchText,
        country: filters.country === 'all' ? '' : filters.country,
        documentType: filters.documentType === 'all' ? '' : filters.documentType,
        dateFrom: filters.dateRange.from,
        dateTo: filters.dateRange.to,
        state: filters.state === 'all' ? '' : filters.state,
        transactionId: filters.transactionId,
        sessionId: filters.sessionId,
        searchedQuery: filters.searchedQuery,
        podId: filters.podId,
        sfmStatus: filters.sfmStatus
      });
      
      setFilteredDocuments(filteredDocs);
      setActiveSearchedQuery(filters.searchedQuery || "");
      setActivePodId(filters.podId || "");
      setActiveSfmStatus(filters.sfmStatus !== 'all' ? filters.sfmStatus : "");
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
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">Publicly Exposed Documents</h1>
        </div>
        
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
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold">
                  Results ({filteredDocuments.length})
                </h2>
                
                {activeSearchedQuery && (
                  <Badge className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Query: {activeSearchedQuery}</span>
                  </Badge>
                )}
                
                {activePodId && (
                  <Badge className="flex items-center gap-1 bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1">
                    <span>Pod ID: {activePodId}</span>
                  </Badge>
                )}

                {activeSfmStatus && (
                  <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1">
                    {activeSfmStatus === 'yes' ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        <span>In SFM</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Not in SFM</span>
                      </>
                    )}
                  </Badge>
                )}
              </div>
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
    </div>
  );
};

export default Index;
