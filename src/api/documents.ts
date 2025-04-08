
import { Document } from '@/types';

// Mock data for document examples - representing sensitive documents found online
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    page_url: "https://example.com/exposed-document-1",
    country: "United States",
    document_type: "Passport",
    created_at: "2025-01-15T08:30:00Z",
    state: "Active"
  },
  {
    id: "doc-2",
    image_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd",
    page_url: "https://example.org/personal-data-leak",
    country: "Canada",
    document_type: "ID Card",
    created_at: "2025-02-03T14:20:00Z",
    state: "Archived"
  },
  {
    id: "doc-3",
    image_url: "https://images.unsplash.com/photo-1650315985351-766f7da476e9",
    page_url: "https://leaked-docs.net/financial-records",
    country: "United Kingdom",
    document_type: "Invoice",
    created_at: "2025-03-11T11:45:00Z",
    state: "Active"
  },
  {
    id: "doc-4",
    image_url: "https://images.unsplash.com/photo-1586232151244-9b656311a3e1",
    page_url: "https://data-breach.com/personal-info",
    country: "Australia",
    document_type: "Driver License",
    created_at: "2025-02-18T09:15:00Z",
    state: "Active"
  },
  {
    id: "doc-5",
    image_url: "https://images.unsplash.com/photo-1569235186275-626cb53b83ce",
    page_url: "https://insecure-site.org/documents",
    country: "Germany",
    document_type: "Tax Form",
    created_at: "2025-01-27T16:40:00Z",
    state: "Removed"
  },
  {
    id: "doc-6",
    image_url: "https://images.unsplash.com/photo-1517842645767-c639042777db",
    page_url: "https://poor-security.com/files",
    country: "France",
    document_type: "Passport",
    created_at: "2025-03-05T10:20:00Z",
    state: "Active"
  },
  {
    id: "doc-7",
    image_url: "https://images.unsplash.com/photo-1607175596049-e42cbca6104f",
    page_url: "https://exposed-api.net/customer-data",
    country: "Japan",
    document_type: "Bank Statement",
    created_at: "2025-02-10T13:50:00Z",
    state: "Active"
  },
  {
    id: "doc-8",
    image_url: "https://images.unsplash.com/photo-1572059002053-8cc5ad2f4a38",
    page_url: "https://misconfigured-server.com/private",
    country: "Brazil",
    document_type: "Medical Record",
    created_at: "2025-01-09T09:00:00Z",
    state: "Archived"
  },
  {
    id: "doc-9",
    image_url: "https://images.unsplash.com/photo-1621950111557-d59851e08c18",
    page_url: "https://leaked-database.org/records",
    country: "India",
    document_type: "Credit Card Statement",
    created_at: "2025-03-22T15:30:00Z",
    state: "Active"
  },
  {
    id: "doc-10",
    image_url: "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b",
    page_url: "https://public-folder.cloud/documents",
    country: "South Africa",
    document_type: "Utility Bill",
    created_at: "2025-02-28T11:10:00Z",
    state: "Removed"
  },
  {
    id: "doc-11",
    image_url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338",
    page_url: "https://unsecured-storage.net/personal",
    country: "Mexico",
    document_type: "ID Card",
    created_at: "2025-01-20T14:15:00Z",
    state: "Active"
  },
  {
    id: "doc-12",
    image_url: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988",
    page_url: "https://open-bucket.storage/sensitive",
    country: "Spain",
    document_type: "Work Contract",
    created_at: "2025-03-18T08:45:00Z",
    state: "Active"
  },
];

// Return all unique countries for filtering
export const getUniqueCountries = (): string[] => {
  const countries = mockDocuments.map(doc => doc.country);
  return [...new Set(countries)];
};

// Return all unique document types for filtering
export const getUniqueDocumentTypes = (): string[] => {
  const types = mockDocuments.map(doc => doc.document_type);
  return [...new Set(types)];
};

// Return all unique states for filtering
export const getUniqueStates = (): string[] => {
  const states = mockDocuments.map(doc => doc.state);
  return [...new Set(states)];
};

// Fetch documents with optional filtering
export const fetchDocuments = async (filters?: {
  searchText?: string;
  country?: string;
  documentType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  state?: string;
}): Promise<Document[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredDocs = [...mockDocuments];

  // Apply filters if provided
  if (filters) {
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.page_url.toLowerCase().includes(searchLower) || 
        doc.country.toLowerCase().includes(searchLower) ||
        doc.document_type.toLowerCase().includes(searchLower)
      );
    }

    if (filters.country && filters.country !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.country === filters.country);
    }

    if (filters.documentType && filters.documentType !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.document_type === filters.documentType);
    }

    if (filters.dateFrom) {
      filteredDocs = filteredDocs.filter(doc => 
        new Date(doc.created_at) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      // Add one day to include the end date
      const endDate = new Date(filters.dateTo);
      endDate.setDate(endDate.getDate() + 1);
      filteredDocs = filteredDocs.filter(doc => 
        new Date(doc.created_at) <= endDate
      );
    }

    if (filters.state && filters.state !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.state === filters.state);
    }
  }

  return filteredDocs;
};
