
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LoadingOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
import { Tag } from "antd";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
  gap: 0.5rem;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ResultsTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Index = () => {
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
        toast.error("Failed to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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
      toast.error("Failed to apply filters. Please try again.");
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
    <Container>
      <Content>
        <Header>
          <Title>Publicly Exposed Documents</Title>
        </Header>
        
        <SearchBar 
          countries={countries} 
          documentTypes={documentTypes}
          states={states}
          onSearch={handleSearch} 
        />

        {loading ? (
          <LoadingContainer>
            <LoadingOutlined style={{ fontSize: 24 }} />
            <span>Loading documents...</span>
          </LoadingContainer>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: '1rem' }}>
            {error}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ marginBottom: '2rem' }}>
            <ResultHeader>
              <div>
                <ResultsTitle>
                  Results ({filteredDocuments.length})
                </ResultsTitle>
                
                <TagsContainer>
                  {activeSearchedQuery && (
                    <Tag color="blue" icon={<FileTextOutlined />}>
                      Query: {activeSearchedQuery}
                    </Tag>
                  )}
                  
                  {activePodId && (
                    <Tag color="purple">
                      Pod ID: {activePodId}
                    </Tag>
                  )}

                  {activeSfmStatus && (
                    <Tag color={activeSfmStatus === 'yes' ? 'green' : 'red'} 
                         icon={activeSfmStatus === 'yes' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                      {activeSfmStatus === 'yes' ? 'In SFM' : 'Not in SFM'}
                    </Tag>
                  )}
                </TagsContainer>
              </div>
            </ResultHeader>
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
      </Content>
    </Container>
  );
};

export default Index;
