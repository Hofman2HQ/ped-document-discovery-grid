
import { Document } from '@/types';

// Mock data for document examples - representing sensitive documents found online
const mockDocuments: Document[] = [
  {
    transactionId: "doc-1",
    image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    page_url: "https://example.com/exposed-document-1",
    country: "United States",
    document_type: "Passport",
    created_at: "2025-01-15T08:30:00Z",
    state: "California",
    ped_search_country: "US",
    ped_search_document_type: "PASS",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-2",
    image_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd",
    page_url: "https://example.org/personal-data-leak",
    country: "Canada",
    document_type: "IDs",
    created_at: "2025-02-03T14:20:00Z",
    state: "Ontario",
    ped_search_country: "CA",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-3",
    image_url: "https://images.unsplash.com/photo-1650315985351-766f7da476e9",
    page_url: "https://leaked-docs.net/financial-records",
    country: "United Kingdom",
    document_type: "Driving License",
    created_at: "2025-03-11T11:45:00Z",
    state: "",
    ped_search_country: "UK",
    ped_search_document_type: "DL",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-4",
    image_url: "https://images.unsplash.com/photo-1586232151244-9b656311a3e1",
    page_url: "https://data-breach.com/personal-info",
    country: "Australia",
    document_type: "Driving License",
    created_at: "2025-02-18T09:15:00Z",
    state: "New South Wales",
    ped_search_country: "AU",
    ped_search_document_type: "DL",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-5",
    image_url: "https://images.unsplash.com/photo-1569235186275-626cb53b83ce",
    page_url: "https://insecure-site.org/documents",
    country: "Germany",
    document_type: "IDs",
    created_at: "2025-01-27T16:40:00Z",
    state: "",
    ped_search_country: "DE",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-6",
    image_url: "https://images.unsplash.com/photo-1517842645767-c639042777db",
    page_url: "https://poor-security.com/files",
    country: "France",
    document_type: "Passport",
    created_at: "2025-03-05T10:20:00Z",
    state: "",
    ped_search_country: "FR",
    ped_search_document_type: "PASS",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-7",
    image_url: "https://images.unsplash.com/photo-1607175596049-e42cbca6104f",
    page_url: "https://exposed-api.net/customer-data",
    country: "Japan",
    document_type: "IDs",
    created_at: "2025-02-10T13:50:00Z",
    state: "",
    ped_search_country: "JP",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-8",
    image_url: "https://images.unsplash.com/photo-1572059002053-8cc5ad2f4a38",
    page_url: "https://misconfigured-server.com/private",
    country: "Brazil",
    document_type: "IDs",
    created_at: "2025-01-09T09:00:00Z",
    state: "São Paulo",
    ped_search_country: "BR",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-9",
    image_url: "https://images.unsplash.com/photo-1621950111557-d59851e08c18",
    page_url: "https://leaked-database.org/records",
    country: "India",
    document_type: "Driving License",
    created_at: "2025-03-22T15:30:00Z",
    state: "Maharashtra",
    ped_search_country: "IN",
    ped_search_document_type: "DL",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-10",
    image_url: "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b",
    page_url: "https://public-folder.cloud/documents",
    country: "South Africa",
    document_type: "IDs",
    created_at: "2025-02-28T11:10:00Z",
    state: "",
    ped_search_country: "ZA",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-11",
    image_url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338",
    page_url: "https://unsecured-storage.net/personal",
    country: "Mexico",
    document_type: "IDs",
    created_at: "2025-01-20T14:15:00Z",
    state: "Jalisco",
    ped_search_country: "MX",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-12",
    image_url: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988",
    page_url: "https://open-bucket.storage/sensitive",
    country: "Spain",
    document_type: "Passport",
    created_at: "2025-03-18T08:45:00Z",
    state: "",
    ped_search_country: "ES",
    ped_search_document_type: "PASS",
    loaded_to_sfm: false
  },
];

// Return all unique countries for filtering
export const getUniqueCountries = (): string[] => {
  const countries = mockDocuments.map(doc => doc.country);
  return [...new Set(countries)];
};

// Return all unique document types for filtering
export const getUniqueDocumentTypes = (): string[] => {
  // We'll force the exact document types required
  return ["IDs", "Passport", "Driving License"];
};

// Return all unique states for filtering
export const getUniqueStates = (): string[] => {
  const states = mockDocuments.map(doc => doc.state).filter(state => state !== "");
  return [...new Set(states)];
};

// Get the states for a particular country
export const getStatesForCountry = (country: string): string[] => {
  if (!country || country === 'all') return [];
  
  const states = mockDocuments
    .filter(doc => doc.country === country && doc.state !== "")
    .map(doc => doc.state);
  
  return [...new Set(states)];
};

// Check if a country has multiple states
export const countryHasMultipleStates = (country: string): boolean => {
  if (!country || country === 'all') return false;
  
  const states = getStatesForCountry(country);
  return states.length > 0;
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
        doc.image_url.toLowerCase().includes(searchLower)
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
